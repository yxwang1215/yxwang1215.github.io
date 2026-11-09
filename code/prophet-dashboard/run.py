#!/usr/bin/env python3
"""Manage the detached local dashboard and restart it after process failures."""
import argparse
import fcntl
import json
import os
from pathlib import Path
import signal
import socket
import subprocess
import sys
import threading
import time
from urllib.error import HTTPError
from urllib.request import ProxyHandler, build_opener

HERE = Path(__file__).resolve().parent
RUNTIME = HERE / ".runtime" / str(os.getuid())
STATE = RUNTIME / "service.json"
STOP = threading.Event()


def health(port, expected_pid):
    opener = build_opener(ProxyHandler({}))
    try:
        try:
            response = opener.open(f"http://127.0.0.1:{port}/api/health", timeout=5)
        except HTTPError as exc:
            response = exc
        with response:
            data = json.load(response)
            return data if expected_pid is not None and data.get("server_pid") == expected_pid else None
    except Exception:
        return None


def ensure_port_available(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        probe.bind(("127.0.0.1", port))


def save_state(value):
    pending = STATE.with_suffix(".tmp")
    pending.write_text(json.dumps(value))
    os.chmod(pending, 0o600)
    pending.replace(STATE)


def state():
    try:
        value = json.loads(STATE.read_text())
        pid = value["pid"]
        cmd = Path(f"/proc/{pid}/cmdline").read_bytes().split(b"\0")
        if str(HERE / "run.py").encode() in cmd and b"supervise" in cmd:
            return value
    except (OSError, ValueError, KeyError, TypeError):
        pass
    return None


def terminate(child):
    if child.poll() is None:
        child.terminate()
        try:
            child.wait(timeout=8)
        except subprocess.TimeoutExpired:
            child.kill()
            child.wait()


def supervise(args):
    RUNTIME.mkdir(mode=0o700, exist_ok=True)
    with (RUNTIME / "service.lock").open("w") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return 0
        signal.signal(signal.SIGTERM, lambda *_: STOP.set())
        signal.signal(signal.SIGINT, lambda *_: STOP.set())
        service_state = {"pid": os.getpid(), "port": args.port, "interval": args.interval}
        save_state(service_state)
        retries, child = 0, None
        try:
            while not STOP.is_set():
                child = subprocess.Popen([sys.executable, "-u", str(HERE / "server.py"),
                                          "--port", str(args.port), "--interval", str(args.interval)], cwd=HERE)
                started = time.monotonic()
                service_state["server_pid"] = child.pid
                save_state(service_state)
                failures = 0
                print(f"server pid={child.pid} restarts={retries}", flush=True)
                while not STOP.wait(15):
                    if child.poll() is not None:
                        print(f"server exited rc={child.returncode}", flush=True)
                        break
                    check = health(args.port, child.pid)
                    # An upstream outage leaves the process alive and retries next minute.
                    # Restart only for a dead/hung local server or its collector thread.
                    failed = not check or not check.get("poller_alive") or not check.get("collector_healthy", True)
                    failures = failures + 1 if failed and time.monotonic() - started > 180 else 0
                    if failures >= 3:
                        print("local server/collector unhealthy; restarting", flush=True)
                        break
                terminate(child)
                if STOP.is_set():
                    break
                if time.monotonic() - started > 3600:
                    retries = 0
                retries += 1
                if retries > 3:
                    print("stopped after three failed recovery attempts; see service.log", flush=True)
                    return 1
                if STOP.wait(min(60, 5 * 2 ** (retries - 1))):
                    break
        finally:
            if child is not None:
                terminate(child)
            STATE.unlink(missing_ok=True)
    return 0


def main():
    parser = argparse.ArgumentParser(description="管理 Prophet 本机仪表盘")
    parser.add_argument("command", nargs="?", choices=("start", "stop", "status", "supervise"), default="status")
    parser.add_argument("--port", type=int, default=18765)
    parser.add_argument("--interval", type=int, default=60)
    args = parser.parse_args()
    if not 1 <= args.port <= 65535 or args.interval < 10:
        parser.error("port 需在 1–65535，interval 不得小于 10 秒")
    if args.command == "supervise":
        return supervise(args)
    current = state()
    if args.command == "stop":
        if not current:
            print("服务未运行")
            return 0
        os.kill(current["pid"], signal.SIGTERM)
        for _ in range(40):
            if not state():
                print("服务已停止")
                return 0
            time.sleep(0.25)
        print(f"停止尚未完成，请检查 {RUNTIME / 'service.log'}")
        return 1
    if args.command == "start" and not current:
        try:
            ensure_port_available(args.port)
        except OSError:
            print(f"端口 {args.port} 已被占用；请用 --port 指定其他端口。")
            return 1
        RUNTIME.mkdir(mode=0o700, exist_ok=True)
        os.chmod(RUNTIME, 0o700)
        with (RUNTIME / "service.log").open("a") as log:
            os.chmod(log.name, 0o600)
            proc = subprocess.Popen([sys.executable, "-u", str(HERE / "run.py"), "supervise",
                                     "--port", str(args.port), "--interval", str(args.interval)],
                                    cwd=HERE, stdin=subprocess.DEVNULL, stdout=log, stderr=log,
                                    start_new_session=True)
        for _ in range(80):
            current = state()
            if current and health(current["port"], current.get("server_pid")):
                break
            if proc.poll() is not None:
                print(f"启动失败，请检查 {RUNTIME / 'service.log'}")
                return 1
            time.sleep(0.25)
    if current:
        check = health(current["port"], current.get("server_pid"))
        print(f"http://127.0.0.1:{current['port']}  supervisor PID={current['pid']}")
        print(json.dumps(check or {"error": "查询服务暂时不可达"}, ensure_ascii=False))
        return 0 if check else 1
    print("服务未运行；使用 prophet-dashboard start 启动")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
