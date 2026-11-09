#!/usr/bin/env python3
"""Start a personal live Prophet monitor.

Each Unix user gets a separate port, credential lookup, and “mine” name.
Nothing in this entry point belongs to a particular account. Run:

    python3 monitor.py
    python3 monitor.py status
    python3 monitor.py stop
    python3 monitor.py watch
    python3 monitor.py --user <prophet-username>
"""
import argparse
import os
from pathlib import Path
import sys
import time

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

import run
from prophet import PROJECTS, QueryError, credentials, dashboard_user

PORT_BASE = 20000
PORT_SPAN = 8000


def personal_port(uid):
    return PORT_BASE + (int(uid) % PORT_SPAN)


def choose_port(preferred, probe=None):
    probe = probe or run.ensure_port_available
    error = None
    for port in range(int(preferred), min(int(preferred) + 32, 65536)):
        try:
            probe(port)
            return port
        except OSError as exc:
            error = exc
    raise OSError(f"从 {preferred} 起没有可用端口") from error


def save_identity(name):
    runtime = HERE / ".runtime" / str(os.getuid())
    runtime.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chmod(runtime, 0o700)
    path = runtime / "dashboard_user"
    path.write_text(name + "\n")
    os.chmod(path, 0o600)
    return path


def watch(interval, project, mine):
    from prophet import Client, SnapshotStore, print_report, summarize
    from resources import ResourceStore

    client = Client()
    projects = {project: PROJECTS[project]} if project else dict(PROJECTS)
    store = SnapshotStore(client, projects, ResourceStore(client, projects))
    user = dashboard_user() if mine else None
    while True:
        data = store.refresh()
        rows = [job for job in data["jobs"] if not user or job["user"] == user]
        data["jobs"], data["summary"] = rows, summarize(rows)
        if project:
            data["projects"] = [item for item in data["projects"] if item["name"] == project]
        print_report(data, rows)
        print(f"--- {interval} 秒后再次查询，Ctrl+C 结束 ---", flush=True)
        time.sleep(interval)


def main(argv=None):
    parser = argparse.ArgumentParser(description="按当前系统用户实时监控 Prophet 占卡")
    parser.add_argument("command", nargs="?", choices=("start", "stop", "status", "watch"), default="start")
    parser.add_argument("--user", help="Prophet 用户名，只影响「只看我的」。默认是登录名")
    parser.add_argument("--port", type=int, help="本用户端口，默认落在 20000–27999，按 UID 固定")
    parser.add_argument("--interval", type=int, default=60)
    parser.add_argument("--project", choices=list(PROJECTS))
    parser.add_argument("--mine", action="store_true", help="终端监控只打印自己的任务")
    args = parser.parse_args(argv)
    if not 10 <= args.interval or (args.port is not None and not 1 <= args.port <= 65535):
        parser.error("interval 不得小于 10 秒，port 需在 1–65535")
    if args.user is not None:
        name = args.user.strip()
        if not name or any(ch in name for ch in "\n\r/"):
            parser.error("用户名无效")
        save_identity(name)
        os.environ["PROPHET_DASHBOARD_USER"] = name
    user = dashboard_user()
    if args.command == "watch":
        try:
            watch(args.interval, args.project, args.mine)
        except KeyboardInterrupt:
            print("\n已停止监控")
            return 0
        except QueryError as exc:
            print(exc, file=sys.stderr)
            return 1
        return 0
    try:
        credentials()
    except QueryError as exc:
        print(exc, file=sys.stderr)
        return 1
    current = run.state()
    if args.command == "start" and not current:
        preferred = args.port or personal_port(os.getuid())
        try:
            port = choose_port(preferred)
        except OSError as exc:
            print(exc, file=sys.stderr)
            return 1
        if port != preferred:
            print(f"端口 {preferred} 已被占用，改用 {port}")
        print(f"用户 {user}  ·  http://127.0.0.1:{port}")
    elif current:
        port = current["port"]
        print(f"用户 {user}  ·  http://127.0.0.1:{port}")
    else:
        port = args.port or personal_port(os.getuid())
    sys.argv = [str(HERE / "run.py"), args.command, "--port", str(port), "--interval", str(args.interval)]
    return run.main()


if __name__ == "__main__":
    raise SystemExit(main())
