import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import monitor


class MonitorTests(unittest.TestCase):
    def test_personal_port_stays_in_the_shared_range(self):
        self.assertEqual(monitor.personal_port(0), 20000)
        self.assertEqual(monitor.personal_port(2071), 22071)
        self.assertEqual(monitor.personal_port(8000), 20000)
        self.assertLess(monitor.personal_port(999999), 28000)

    def test_choose_port_skips_a_busy_port(self):
        def probe(port):
            if port < 22073:
                raise OSError("busy")
        self.assertEqual(monitor.choose_port(22071, probe), 22073)

    def test_choose_port_stops_after_the_scan_window(self):
        def busy(port):
            raise OSError("busy")

        with self.assertRaises(OSError):
            monitor.choose_port(65520, busy)

    def test_user_flag_is_stored_for_that_uid_only(self):
        with tempfile.TemporaryDirectory() as tmp:
            runtime = Path(tmp)
            with patch.object(monitor, "HERE", runtime), patch.object(monitor.os, "getuid", return_value=42):
                path = monitor.save_identity("carol")
            self.assertEqual(path.read_text(), "carol\n")
            self.assertEqual(path.stat().st_mode & 0o777, 0o600)
            self.assertTrue(str(path).endswith("/.runtime/42/dashboard_user"))
            self.assertEqual(os.stat(runtime / ".runtime" / "42").st_mode & 0o777, 0o700)


if __name__ == "__main__":
    unittest.main()
