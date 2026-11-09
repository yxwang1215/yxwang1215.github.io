#!/usr/bin/env python3
"""Loopback-only dashboard server with read-only task and resource queries."""
import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import signal
import threading
import time
from urllib.parse import urlsplit

from prophet import Client, SnapshotStore, now, PROJECTS

STATIC = Path(__file__).resolve().parent / "static"
ASSETS = {"/": ("index.html", "text/html; charset=utf-8"),
          "/app.js": ("app.js", "text/javascript; charset=utf-8"),
          "/style.css": ("style.css", "text/css; charset=utf-8")}


def collection_is_healthy(alive, started, finished, progress, current):
    # Requests use 5s connect / 20s read timeouts. Allow 90s without page
    # progress, regardless of how long the complete multi-page scan takes.
    return alive and (finished >= started or current - max(started, progress) <= 90)


def _usage_bits(account):
    if "five_hour" in account or "week" in account:
        five = (account.get("five_hour") or {}).get("percent")
        week = (account.get("week") or {}).get("percent")
        return f"{account.get('id')} 5h={five} week={week}"
    parts = [f"{window.get('label')}={window.get('percent')}" for window in account.get("windows") or []]
    credits = account.get("credits") or {}
    if credits.get("unlimited"):
        parts.append("credits=unlimited")
    elif isinstance(credits.get("balance"), (int, float)):
        parts.append(f"credits={round(credits['balance'])}")
    resets = account.get("resets") or {}
    if isinstance(resets.get("available"), int):
        parts.append(f"resets={resets['available']}")
    return f"{account.get('id')} {' '.join(parts)}".strip()


# Claude's 5-hour and weekly windows do not move on a minute scale. The usage
# endpoint rate-limits a 3-minute loop, so keep this well below that pace.
# A manual dashboard refresh must not bypass the same gap.
CLAUDE_USAGE_INTERVAL = 30 * 60


class UsagePoller(threading.Thread):
    def __init__(self, store, interval=180, label="claude", limit_backoff=600):
        super().__init__(name=f"{label}-usage", daemon=True)
        self.store = store
        self.interval = interval
        self.limit_backoff = limit_backoff
        self.label = label
        self.trigger = threading.Event()
        self.stopping = threading.Event()
        self.last_started = 0
        self.limited = False

    def _gap(self):
        return self.limit_backoff if self.limited else self.interval

    def run(self):
        while not self.stopping.is_set():
            self.trigger.clear()
            self.last_started = time.monotonic()
            try:
                data = self.store.refresh()
                bits = [_usage_bits(account) for account in data.get("accounts") or []]
                print(f"{now()} {self.label} usage {' '.join(bits) or 'none'}", flush=True)
                self.limited = any("限流" in (account.get("error") or "") for account in data.get("accounts") or [])
            except Exception as exc:
                self.limited = False
                print(f"{now()} {self.label} usage error={type(exc).__name__}", flush=True)
            self.trigger.wait(self._gap())

    def request_refresh(self):
        if self.last_started and time.monotonic() - self.last_started < self._gap():
            return False
        self.trigger.set()
        return True


class Poller(threading.Thread):
    def __init__(self, store, interval):
        super().__init__(name="prophet-poller", daemon=True)
        self.store = store
        self.interval = interval
        self.trigger = threading.Event()
        self.stopping = threading.Event()
        self.last_started = 0
        self.last_finished = 0

    def run(self):
        while not self.stopping.is_set():
            self.trigger.clear()
            self.last_started = time.monotonic()
            try:
                data = self.store.refresh()
                print(f"{now()} refresh complete={data['complete']} jobs={len(data['jobs'])}", flush=True)
            except Exception as exc:
                print(f"{now()} refresh error={type(exc).__name__}", flush=True)
            finally:
                self.last_finished = time.monotonic()
            self.trigger.wait(self.interval)

    def request_refresh(self):
        if time.monotonic() - self.last_started < 10:
            return False
        self.trigger.set()
        return True

    def healthy(self):
        progress = getattr(getattr(self.store, "client", None), "last_progress", self.last_started)
        return collection_is_healthy(self.is_alive(), self.last_started, self.last_finished,
                                     progress, time.monotonic())


def make_server(store, port=18765, interval=60, usage=None, codex_usage=None, cursor_usage=None):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, fmt, *args):
            # Access logs add little value to an auto-polling local dashboard.
            pass

        def allowed_host(self):
            hostname = urlsplit("http://" + self.headers.get("Host", "")).hostname
            return hostname in ("127.0.0.1", "localhost")

        def send(self, status, body, content_type="application/json; charset=utf-8"):
            if not isinstance(body, bytes):
                body = json.dumps(body, ensure_ascii=False).encode()
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Referrer-Policy", "no-referrer")
            self.send_header("Content-Security-Policy", "default-src 'self'; style-src 'self'; script-src 'self'; "
                             "connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'")
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            if not self.allowed_host():
                return self.send(403, {"error": "只接受本机访问"})
            path = urlsplit(self.path).path
            if path in ASSETS:
                filename, mime = ASSETS[path]
                return self.send(200, (STATIC / filename).read_bytes(), mime)
            usage_routes = {"/api/claude-usage": "usage", "/api/codex-usage": "codex_usage",
                            "/api/cursor-usage": "cursor_usage"}
            if path in usage_routes:
                usage_store = getattr(self.server, usage_routes[path], None)
                snap = usage_store.read() if usage_store is not None else None
                if not snap:
                    return self.send(200, {"accounts": [], "pending": True})
                return self.send(200, snap)
            if path == "/api/snapshot":
                data = store.read()
                if data is None:
                    return self.send(503, {"error": "正在首次查询 Prophet，请稍候"})
                payload = dict(data, refresh_interval=interval)
                for attr, key in (("usage", "claude_usage"), ("codex_usage", "codex_usage"),
                                  ("cursor_usage", "cursor_usage")):
                    usage_store = getattr(self.server, attr, None)
                    if usage_store is not None:
                        snap = usage_store.read()
                        if snap:
                            payload[key] = snap
                return self.send(200, payload)
            if path == "/api/health":
                poller = self.server.poller
                data = store.read()
                active = poller.healthy()
                available = bool(data and any(p["available"] for p in data["projects"]))
                return self.send(200 if active and available else 503,
                                 {"poller_alive": poller.is_alive(), "collector_healthy": active,
                                  "server_pid": os.getpid(), "owner_uid": os.getuid(),
                                  "data_available": available,
                                  "complete": bool(data and data["complete"]),
                                  "checked_at": data["checked_at"] if data else None})
            return self.send(404, {"error": "不存在的路径"})

        def do_POST(self):
            if not self.allowed_host():
                return self.send(403, {"error": "只接受本机访问"})
            origin = self.headers.get("Origin")
            if origin and origin != "http://" + self.headers.get("Host", ""):
                return self.send(403, {"error": "拒绝跨站请求"})
            if urlsplit(self.path).path != "/api/refresh":
                return self.send(404, {"error": "不存在的路径"})
            accepted = self.server.poller.request_refresh()
            for name in ("usage_poller", "codex_poller", "cursor_poller"):
                usage_poller = getattr(self.server, name, None)
                if usage_poller is not None:
                    usage_poller.request_refresh()
            return self.send(202 if accepted else 429, {"accepted": accepted, "retry_after": 10})

    http = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    http.daemon_threads = True
    http.poller = Poller(store, interval)
    http.usage = usage
    http.codex_usage = codex_usage
    http.cursor_usage = cursor_usage
    return http


def main():
    parser = argparse.ArgumentParser(description="Prophet 本机 GPU 仪表盘")
    parser.add_argument("--port", type=int, default=18765)
    parser.add_argument("--interval", type=int, default=60)
    args = parser.parse_args()
    if args.interval < 10:
        parser.error("刷新间隔不得少于 10 秒")
    from resources import ResourceStore
    from claude_usage import UsageStore
    from codex_usage import UsageStore as CodexUsageStore
    from cursor_usage import UsageStore as CursorUsageStore
    client=Client()
    store = SnapshotStore(client,resource_store=ResourceStore(client, PROJECTS))
    usage = UsageStore()
    codex_usage = CodexUsageStore()
    cursor_usage = CursorUsageStore()
    http = make_server(store, args.port, args.interval, usage=usage, codex_usage=codex_usage,
                       cursor_usage=cursor_usage)
    http.usage_poller = UsagePoller(usage, interval=CLAUDE_USAGE_INTERVAL,
                                    limit_backoff=CLAUDE_USAGE_INTERVAL, label="claude")
    http.codex_poller = UsagePoller(codex_usage, label="codex")
    http.cursor_poller = UsagePoller(cursor_usage, label="cursor")

    def stop(*_):
        http.poller.stopping.set()
        http.poller.trigger.set()
        http.usage_poller.stopping.set()
        http.usage_poller.trigger.set()
        http.codex_poller.stopping.set()
        http.codex_poller.trigger.set()
        http.cursor_poller.stopping.set()
        http.cursor_poller.trigger.set()
        threading.Thread(target=http.shutdown, daemon=True).start()

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    http.poller.start()
    http.usage_poller.start()
    http.codex_poller.start()
    http.cursor_poller.start()
    print(f"Prophet Dashboard http://127.0.0.1:{http.server_port} interval={args.interval}s", flush=True)
    try:
        http.serve_forever()
    finally:
        http.server_close()


if __name__ == "__main__":
    main()
