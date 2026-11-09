#!/usr/bin/env python3
"""Read this user's Cursor account and its current billing-period quota."""
import base64
import json
import os
from pathlib import Path
import threading
import time

from claude_usage import UsageError, UrllibTransport, _atomic_write, _load_json

API = "https://api2.cursor.sh"
USAGE_PATH = "/aiserver.v1.DashboardService/GetCurrentPeriodUsage"
PLAN_PATH = "/aiserver.v1.DashboardService/GetPlanInfo"
ME_PATH = "/aiserver.v1.DashboardService/GetMe"
CLIENT_VERSION = "cli-2026.10.22-27dcf5f"


def _public_error(exc):
    text = str(exc)
    if any(mark in text for mark in ("eyJ", "sk-", "rt.")):
        text = ""
    if exc.status in (400, 401) or text == "需要重新登录":
        return "需要重新登录"
    if exc.status == 429 or "Rate limited" in text:
        return "查询被限流，显示缓存"
    if exc.status == 403:
        return "额度接口拒绝了这次查询"
    if exc.status == 0:
        return text or "网络不可达"
    return "额度暂时读不到"


def _jwt(token):
    try:
        part = token.split(".")[1]
        part += "=" * ((4 - len(part) % 4) % 4)
        data = json.loads(base64.urlsafe_b64decode(part))
    except (AttributeError, IndexError, UnicodeError, json.JSONDecodeError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def _iso(epoch):
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(epoch))


def _reset(value):
    try:
        stamp = int(value)
    except (TypeError, ValueError):
        return None
    if stamp <= 0:
        return None
    if stamp < 10_000_000_000:
        stamp *= 1000
    return _iso(stamp / 1000)


def _percent(usage, key):
    value = usage.get(key) if isinstance(usage, dict) else None
    if isinstance(value, (int, float)):
        return float(value)
    return None


def windows_from_payload(payload):
    usage = payload.get("planUsage") if isinstance(payload, dict) else None
    usage = usage if isinstance(usage, dict) else {}
    resets_at = _reset((payload or {}).get("billingCycleEnd") if isinstance(payload, dict) else None)
    windows = []
    for key, label, field in (("api", "模型", "apiPercentUsed"), ("auto", "Auto", "autoPercentUsed")):
        percent = _percent(usage, field)
        if percent is None:
            continue
        windows.append({"key": key, "label": label, "percent": percent, "resets_at": resets_at})
    if not windows:
        percent = _percent(usage, "totalPercentUsed")
        if percent is not None:
            windows.append({"key": "total", "label": "合计", "percent": percent, "resets_at": resets_at})
    return windows


def _note(windows):
    api = next((item["percent"] for item in windows if item["key"] == "api"), None)
    if api is not None and api >= 100:
        return "指定模型已用完"
    return None


def discover_accounts(home):
    home = Path(home)
    found = []
    creds = home / ".config" / "cursor" / "auth.json"
    if creds.is_file():
        found.append({"id": "default", "account": "默认", "credentials": creds,
                      "profile": home / ".cursor" / "cli-config.json"})
    config = home / ".config"
    try:
        named = sorted(config.glob("cursor-*")) if config.is_dir() else []
    except OSError:
        named = []
    for directory in named:
        name = directory.name.removeprefix("cursor-")
        creds = directory / "auth.json"
        if name and creds.is_file():
            found.append({"id": name, "account": name, "credentials": creds,
                          "profile": home / ".cursor" / f"cli-config-{name}.json"})
    return found


def _profile(path):
    info = (_load_json(path) or {}).get("authInfo")
    return info if isinstance(info, dict) else {}


def _identity(profile, me):
    me = me if isinstance(me, dict) else {}
    name = " ".join(part for part in (str(me.get("firstName") or "").strip(),
                                      str(me.get("lastName") or "").strip()) if part)
    email = str(me.get("email") or profile.get("email") or "").strip()
    if not name:
        name = str(profile.get("displayName") or "").strip()
    if not name:
        name = email.split("@", 1)[0] if email else "Cursor"
    return name, email


def _public(account, name, email, plan, windows, note, stale, error, as_of):
    return {"id": account["id"], "name": name, "account": account["account"], "plan": plan,
            "email": email, "windows": windows or [], "note": note, "stale": stale,
            "error": error, "as_of": as_of}


def _access_token(path):
    data = _load_json(path) or {}
    access = data.get("accessToken")
    if not isinstance(access, str) or not access:
        raise UsageError(0, "需要重新登录")
    exp = _jwt(access).get("exp")
    if isinstance(exp, (int, float)) and exp <= time.time() + 60:
        raise UsageError(401, "需要重新登录")
    return access


def _post(token, path, transport):
    return transport.post_json(API + path, {}, {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Connect-Protocol-Version": "1",
        "Accept": "application/json",
        "x-cursor-client-type": "cli",
        "x-cursor-client-version": CLIENT_VERSION,
        "User-Agent": "cursor-cli",
    })


def _optional(token, path, transport):
    try:
        return _post(token, path, transport)
    except UsageError as exc:
        if exc.status in (400, 401):
            raise
        return {}


def _one_account(account, transport, previous=None):
    profile = _profile(account["profile"])
    name, email = _identity(profile, {})
    cached = (previous or {}).get("windows") or []
    cached_note = (previous or {}).get("note")
    as_of = (previous or {}).get("as_of")
    plan = (previous or {}).get("plan") or ""
    try:
        token = _access_token(account["credentials"])
        me = _optional(token, ME_PATH, transport)
        plan_payload = _optional(token, PLAN_PATH, transport)
        usage = _post(token, USAGE_PATH, transport)
        name, email = _identity(profile, me)
        info = plan_payload.get("planInfo") if isinstance(plan_payload, dict) else None
        if isinstance(info, dict) and str(info.get("planName") or "").strip():
            plan = str(info["planName"]).strip()
        windows = windows_from_payload(usage)
        if not windows:
            raise UsageError(0, "额度响应里没有本周期用量")
        return _public(account, name, email, plan, windows, _note(windows), False, None, _iso(time.time()))
    except UsageError as exc:
        keep = bool(cached)
        return _public(account, name, email, plan, cached if keep else [], cached_note if keep else None,
                       keep, _public_error(exc), as_of if keep else None)
    except (OSError, json.JSONDecodeError):
        keep = bool(cached)
        return _public(account, name, email, plan, cached if keep else [], cached_note if keep else None,
                       keep, "读不到登录状态", as_of if keep else None)


def collect_usage(home, transport=None, previous=None):
    transport = transport or UrllibTransport()
    prior = {}
    for item in (previous or {}).get("accounts") or []:
        if isinstance(item, dict) and item.get("id"):
            prior[item["id"]] = item
    accounts = [_one_account(account, transport, prior.get(account["id"]))
                for account in discover_accounts(home)]
    return {"checked_at": _iso(time.time()), "accounts": accounts}


def _default_cache():
    return Path(__file__).resolve().parent / ".runtime" / str(os.getuid()) / "cursor_usage.json"


class UsageStore:
    def __init__(self, home=None, cache_path=None, transport=None):
        self.home = Path(home or Path.home())
        self.cache_path = Path(cache_path) if cache_path else _default_cache()
        self.transport = transport or UrllibTransport()
        self.lock = threading.Lock()
        self.snapshot = self._load()

    def _load(self):
        data = _load_json(self.cache_path)
        if not data or not isinstance(data.get("accounts"), list):
            return None
        data["stale"] = True
        return data

    def read(self):
        with self.lock:
            return self.snapshot

    def refresh(self):
        snapshot = collect_usage(self.home, self.transport, self.read())
        text = json.dumps(snapshot, ensure_ascii=False)
        with self.lock:
            self.snapshot = snapshot
        try:
            self.cache_path.parent.mkdir(mode=0o700, exist_ok=True)
            _atomic_write(self.cache_path, text + "\n")
        except OSError:
            pass
        return snapshot
