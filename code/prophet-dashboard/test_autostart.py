import fcntl
import contextlib
import io
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

try:
    import autostart
except ModuleNotFoundError:
    autostart = None


class AutostartTests(unittest.TestCase):
    def setUp(self):
        self.assertIsNotNone(autostart, "autostart module must be implemented")
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.stderr = io.StringIO()
        # Expected failure diagnostics stay available for assertions without
        # producing misleading errors in a successful suite.
        self.stderr_redirect = contextlib.redirect_stderr(self.stderr)
        self.stderr_redirect.__enter__()
        self.addCleanup(self.stderr_redirect.__exit__, None, None, None)
        self.runtime = Path(self.tmp.name)
        self.starts = []
        self.rc = 0
        self.health = {"owner_uid": os.getuid(), "server_pid": 123,
                       "poller_alive": True, "collector_healthy": True,
                       "data_available": True}

    def start(self, argv):
        self.starts.append(argv)
        return subprocess.CompletedProcess(argv, self.rc,
                                           stdout="secret-auth-value", stderr="secret-auth-value")

    def call(self, now=1000, identity="boot-a", inspector=None):
        return autostart.ensure_started(runtime=self.runtime, now=now, identity=identity,
                                        starter=self.start,
                                        inspector=inspector or (lambda: self.health))

    def state(self):
        return json.loads((self.runtime / "boot.json").read_text())

    def test_new_boot_starts_once_and_success_does_not_probe_or_restart(self):
        self.assertEqual(self.call(), 0)
        def forbidden():
            self.fail("successful boot must remain untouched, including after manual stop")
        self.assertEqual(self.call(now=2000, inspector=forbidden), 0)
        self.assertEqual(len(self.starts), 1)
        self.assertEqual(self.starts[0][1:],
                         [str(autostart.HERE / "run.py"), "start", "--port", "18765", "--interval", "60"])
        self.assertTrue(self.state()["success"])

    def test_new_boot_resets_success(self):
        self.call()
        self.call(identity="boot-b")
        self.assertEqual(len(self.starts), 2)
        self.assertEqual(self.state()["boot_id"], "boot-b")

    def test_failures_have_backoff_and_three_start_limit(self):
        self.rc = 7
        for at, expected in ((1000, 1), (1001, 1), (1059, 1), (1060, 2),
                             (1200, 2), (1239, 2), (1240, 3), (10000, 3)):
            self.call(now=at)
            self.assertEqual(len(self.starts), expected)
        self.assertEqual(len(self.starts), 3)
        self.assertEqual(self.state()["attempts"], 3)
        self.assertFalse(self.state()["success"])
        self.assertEqual(self.state()["last_rc"], 7)
        self.assertEqual(self.state()["last_attempt_at"], 1240)
        self.assertNotIn("secret-auth-value", (self.runtime / "boot.json").read_text())
        self.assertNotIn("secret-auth-value", self.stderr.getvalue())

    def test_new_boot_resets_exhausted_retries(self):
        self.rc = 1
        for at in (1000, 1060, 1240):
            self.call(now=at)
        self.rc = 0
        self.call(now=2000, identity="boot-b")
        self.assertEqual(len(self.starts), 4)
        self.assertTrue(self.state()["success"])

    def test_initial_collection_waits_without_restarting_then_confirms_data(self):
        self.health["data_available"] = False
        self.call()
        self.call(now=1060)
        self.call(now=1300)
        self.assertEqual(len(self.starts), 1)
        self.assertFalse(self.state()["success"])
        self.health["data_available"] = True
        self.call(now=1360)
        self.assertEqual(len(self.starts), 1)
        self.assertTrue(self.state()["success"])

    def test_unavailable_data_cannot_wait_forever_or_launch_without_bound(self):
        self.health["data_available"] = False
        for at in range(1000, 5000, 60):
            self.call(now=at)
        self.assertLessEqual(len(self.starts), 3)
        self.assertFalse(self.state()["success"])
        self.assertEqual(self.state()["attempts"], 3)

    def test_wrong_owner_and_dead_collector_never_confirm_success(self):
        for changed in ({"owner_uid": os.getuid() + 1}, {"poller_alive": False},
                        {"collector_healthy": False}):
            with self.subTest(changed=changed):
                (self.runtime / "boot.json").unlink(missing_ok=True)
                health = dict(self.health, **changed)
                self.call(inspector=lambda: health)
                self.assertFalse(self.state()["success"])

    def test_no_service_is_not_health_success(self):
        self.call(inspector=lambda: None)
        self.assertFalse(self.state()["success"])
        self.call(now=1060, inspector=lambda: None)
        self.assertEqual(len(self.starts), 2)

    def test_state_is_private_and_written_without_leftover_temporary_file(self):
        self.call()
        self.assertEqual((self.runtime / "boot.json").stat().st_mode & 0o777, 0o600)
        self.assertFalse(list(self.runtime.glob("boot.*.tmp")))

    def test_lock_prevents_overlapping_cron_starts(self):
        with (self.runtime / "boot.lock").open("w") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            self.assertEqual(self.call(), 0)
        self.assertEqual(self.starts, [])
        self.assertFalse((self.runtime / "boot.json").exists())

    def test_corrupt_state_fails_closed(self):
        (self.runtime / "boot.json").write_text("{bad")
        self.assertNotEqual(self.call(), 0)
        self.assertEqual(self.starts, [])

    def test_start_exception_records_safe_error_and_does_not_leak_message(self):
        def broken(argv):
            raise OSError("secret-auth-value")
        self.start = broken
        self.assertNotEqual(self.call(), 0)
        self.assertEqual(self.state()["attempts"], 1)
        self.assertNotIn("secret-auth-value", (self.runtime / "boot.json").read_text())

    def test_boot_identity_parses_comm_with_spaces_and_parentheses(self):
        boot = self.runtime / "host-boot"
        stat = self.runtime / "stat"
        boot.write_text("host-boot-id\n")
        # Fields after comm start at field 3; starttime is field 22.
        stat.write_text("1 (odd ( name ) here) S " + " ".join(["0"] * 18) + " 54321 0\n")
        value = autostart.boot_identity(hostname="node", boot_id_path=boot, stat_path=stat)
        self.assertEqual(value, "node:host-boot-id:54321")

    def test_inspector_requires_own_supervisor_child_and_health_pid(self):
        service = {"pid": 101, "server_pid": 123, "port": 18765}
        with patch.object(autostart.run, "state", return_value=service), \
                patch.object(autostart.run, "health", return_value=self.health), \
                patch.object(autostart, "owned_child", return_value=False):
            self.assertIsNone(autostart.inspect_service())
        with patch.object(autostart.run, "state", return_value=service), \
                patch.object(autostart.run, "health", return_value=dict(self.health, server_pid=999)), \
                patch.object(autostart, "owned_child", return_value=True):
            self.assertIsNone(autostart.inspect_service())

    def test_owned_child_checks_actual_proc_uid_and_parent_relation(self):
        for pid in (101, 123):
            (self.runtime / str(pid)).mkdir()
        (self.runtime / "123/stat").write_text("123 (child ( odd ) name) S 101 0 0")
        self.assertTrue(autostart.owned_child(101, 123, proc=self.runtime))
        self.assertFalse(autostart.owned_child(101, 123, uid=os.getuid() + 1, proc=self.runtime))
        (self.runtime / "123/stat").write_text("123 (child) S 999 0 0")
        self.assertFalse(autostart.owned_child(101, 123, proc=self.runtime))
        self.assertFalse(autostart.owned_child(101, 456, proc=self.runtime))

    def test_failed_atomic_replace_preserves_previous_state_and_removes_temporary(self):
        self.call()
        path = self.runtime / "boot.json"
        previous = path.read_bytes()
        with patch.object(autostart.os, "replace", side_effect=OSError("disk error")):
            with self.assertRaises(OSError):
                autostart.write_state(path, {"replaced": True})
        self.assertEqual(path.read_bytes(), previous)
        self.assertFalse(list(self.runtime.glob("boot.*.tmp")))


if __name__ == "__main__":
    unittest.main()
