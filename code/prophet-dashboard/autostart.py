#!/usr/bin/env python3
"""Start once per container boot; cron checks never undo a later manual stop.

Use both @reboot and a minute cron entry: some containers retain cron's
/run/crond.reboot marker across restarts. Crontabs themselves must survive
container replacement for this hook to cover replacement as well.
"""
import fcntl
import json
import os
from pathlib import Path
import socket
import subprocess
import sys
import tempfile
import time

import run

HERE = Path(__file__).resolve().parent
READY_GRACE = 600


def proc_fields(stat):
    # Linux comm may contain spaces and closing parentheses; fields follow
    # the final closing parenthesis. The resulting index 0 is stat field 3.
    return stat.rsplit(")", 1)[1].split()


def boot_identity(hostname=None, boot_id_path=Path("/proc/sys/kernel/random/boot_id"),
                  stat_path=Path("/proc/1/stat")):
    return ":".join((hostname or socket.gethostname(),
                     Path(boot_id_path).read_text().strip(),
                     proc_fields(Path(stat_path).read_text())[19]))


def owned_child(supervisor, child, uid=None, proc=Path("/proc")):
    uid = os.getuid() if uid is None else uid
    try:
        parent_dir, child_dir = proc / str(supervisor), proc / str(child)
        return (parent_dir.stat().st_uid == uid and child_dir.stat().st_uid == uid
                and int(proc_fields((child_dir / "stat").read_text())[1]) == supervisor)
    except (OSError, ValueError, IndexError):
        return False


def inspect_service():
    service = run.state()
    if not service or not owned_child(service.get("pid"), service.get("server_pid")):
        return None
    data = run.health(service["port"], service.get("server_pid"))
    if not data or data.get("server_pid") != service.get("server_pid"):
        return None
    return data


def write_state(path, value):
    fd, pending = tempfile.mkstemp(prefix="boot.", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w") as stream:
            os.fchmod(stream.fileno(), 0o600)
            json.dump(value, stream)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(pending, path)
    finally:
        Path(pending).unlink(missing_ok=True)


def launch(argv):
    # Never copy untrusted stdout/stderr into state or cron mail: these may
    # contain details from the user's authentication provider.
    return subprocess.run(argv, cwd=HERE, stdin=subprocess.DEVNULL,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                          timeout=45, check=False)


def ensure_started(runtime=None, now=None, identity=None, starter=None, inspector=None):
    runtime = Path(run.RUNTIME if runtime is None else runtime)
    runtime.mkdir(mode=0o700, parents=True, exist_ok=True)
    now = time.time() if now is None else now
    identity = boot_identity() if identity is None else identity
    starter, inspector = starter or launch, inspector or inspect_service
    lock_fd = os.open(runtime / "boot.lock", os.O_CREAT | os.O_WRONLY, 0o600)
    with os.fdopen(lock_fd, "w") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return 0
        path = runtime / "boot.json"
        try:
            record = json.loads(path.read_text())
            if (not isinstance(record, dict) or not isinstance(record.get("boot_id"), str)
                    or type(record.get("success")) is not bool
                    or type(record.get("attempts")) is not int
                    or not 0 <= record["attempts"] <= 3
                    or not isinstance(record.get("next_retry_at"), (int, float))):
                raise ValueError("invalid boot record")
        except FileNotFoundError:
            record = None
        except (OSError, ValueError, TypeError):
            print("autostart: invalid boot.json; refusing to restart blindly", file=sys.stderr)
            return 1
        if record is None or record["boot_id"] != identity:
            record = {"boot_id": identity, "success": False, "attempts": 0,
                      "next_retry_at": 0, "history": []}
        if record["success"]:
            return 0

        def observe():
            data = inspector()
            alive = bool(data and data.get("owner_uid") == os.getuid()
                         and data.get("poller_alive") is True
                         and data.get("collector_healthy") is True)
            return alive, bool(alive and data.get("data_available") is True)

        if record.get("awaiting_ready"):
            alive, ready = observe()
            if ready:
                record.update(success=True, awaiting_ready=False, success_at=now,
                              last_error=None)
                write_state(path, record)
                return 0
            if alive and now < record["ready_until"]:
                return 0
            record.update(awaiting_ready=False, last_error="startup readiness not confirmed",
                          last_error_at=now)
            write_state(path, record)
        if record["attempts"] >= 3:
            return 1
        if now < record["next_retry_at"]:
            return 0

        record["attempts"] += 1
        attempt = record["attempts"]
        record.update(last_attempt_at=now, next_retry_at=now + (60 if attempt == 1 else 180),
                      awaiting_ready=False)
        # Reserve the attempt before spawning so an interrupted cron job cannot
        # create an unbounded series of actual starts.
        write_state(path, record)
        argv = [sys.executable, str(HERE / "run.py"), "start", "--port", "18765",
                "--interval", "60"]
        error = None
        try:
            result = starter(argv)
            rc = result.returncode
            if rc:
                error = "start command failed"
        except (OSError, subprocess.SubprocessError):
            rc, error = -1, "start command could not complete"
        record.update(last_rc=rc, last_error=error)
        record["history"].append({"at": now, "rc": rc, "error": error})
        if rc == 0:
            alive, ready = observe()
            if ready:
                record.update(success=True, success_at=now)
            elif alive:
                record.update(awaiting_ready=True, ready_until=now + READY_GRACE,
                              last_error="waiting for initial data")
            else:
                record["last_error"] = "own healthy supervisor child not confirmed"
        if record.get("last_error"):
            record["last_error_at"] = now
        write_state(path, record)
        if record["last_error"] and not record.get("awaiting_ready"):
            print(f"autostart: attempt {attempt}/3 rc={rc}: {record['last_error']}", file=sys.stderr)
        return 0 if record["success"] or record.get("awaiting_ready") else 1


if __name__ == "__main__":
    try:
        raise SystemExit(ensure_started())
    except (OSError, ValueError, KeyError, IndexError, TypeError):
        print("autostart: boot check failed; inspect local runtime permissions/state", file=sys.stderr)
        raise SystemExit(1)
