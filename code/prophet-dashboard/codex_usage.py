#!/usr/bin/env python3
"""Read this user's Codex accounts and their ChatGPT rate-limit / credit quota."""
import base64
from datetime import datetime, timezone
import fcntl
import json
import os
from pathlib import Path
import threading
import time

from claude_usage import UsageError, UrllibTransport, _atomic_write, _load_json

TOKEN_URL = "https://auth.openai.com/oauth/token"
USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"
RESETS_URL = "https://chatgpt.com/backend-api/wham/rate-limit-reset-credits"
CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann"
PLANS = {"free": "Free", "go": "Go", "plus": "Plus", "pro": "Pro", "prolite": "Pro Lite",
         "team": "Team", "business": "Business", "enterprise": "Enterprise", "edu": "Edu"}


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


def _plan(raw):
    key = str(raw or "").strip().lower()
    if not key:
        return ""
    return PLANS.get(key, key[:24])


def window_label(seconds):
    if not isinstance(seconds, (int, float)) or seconds <= 0:
        return "额度"
    if abs(seconds - 5 * 3600) <= 60:
        return "5小时"
    if abs(seconds - 86400) <= 60:
        return "一天"
    if abs(seconds - 7 * 86400) <= 3600:
        return "一周"
    hours = seconds / 3600
    if hours < 48:
        return f"{round(hours)}小时"
    return f"{round(seconds / 86400)}天"


def _iso(epoch):
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(epoch))


def _window(raw):
    if not isinstance(raw, dict) or not isinstance(raw.get("used_percent"), (int, float)):
        return None
    resets_at = None
    reset_at = raw.get("reset_at")
    reset_after = raw.get("reset_after_seconds")
    if isinstance(reset_at, (int, float)) and reset_at > 0:
        resets_at = _iso(reset_at)
    elif isinstance(reset_after, (int, float)) and reset_after >= 0:
        resets_at = _iso(time.time() + reset_after)
    seconds = raw.get("limit_window_seconds")
    window_seconds = int(seconds) if isinstance(seconds, (int, float)) and seconds > 0 else None
    return {"percent": float(raw["used_percent"]), "resets_at": resets_at,
            "window_seconds": window_seconds, "label": window_label(window_seconds)}


def windows_from_payload(payload):
    rate = payload.get("rate_limit") if isinstance(payload, dict) else None
    rate = rate if isinstance(rate, dict) else {}
    windows = []
    for key in ("primary_window", "secondary_window"):
        window = _window(rate.get(key))
        if window:
            windows.append(dict(window, key=key))
    return windows


def _count(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    return max(0, int(value))


def _utc_stamp(value):
    if not isinstance(value, str) or not value.strip():
        return None
    text = value.strip().replace("Z", "+00:00")
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def resets_from_usage(payload):
    raw = payload.get("rate_limit_reset_credits") if isinstance(payload, dict) else None
    if not isinstance(raw, dict):
        return None
    count = _count(raw.get("available_count"))
    if count is None:
        return None
    return {"available": count, "items": []}


def resets_from_details(payload, summary=None):
    if not isinstance(payload, dict):
        return summary
    count = _count(payload.get("available_count"))
    items = []
    credits = payload.get("credits")
    if isinstance(credits, list):
        for credit in credits:
            if not isinstance(credit, dict) or credit.get("status") != "available":
                continue
            title = credit.get("title")
            items.append({
                "title": str(title).strip()[:80] if isinstance(title, str) else "",
                "expires_at": _utc_stamp(credit.get("expires_at")),
                "granted_at": _utc_stamp(credit.get("granted_at")),
            })
    items.sort(key=lambda item: (item["expires_at"] is None, item["expires_at"] or "",
                                 item["granted_at"] or ""))
    if count is None:
        count = summary["available"] if summary else (len(items) if items else None)
    if count is None:
        return None
    return {"available": count, "items": items[:count]}


def _keep_reset_items(summary, previous):
    if not summary:
        return None
    items = []
    if isinstance(previous, dict) and previous.get("available") == summary["available"]:
        items = [item for item in previous.get("items") or [] if isinstance(item, dict)]
    return {"available": summary["available"], "items": items}


def credits_from_payload(payload):
    raw = payload.get("credits") if isinstance(payload, dict) else None
    if not isinstance(raw, dict):
        return None
    if raw.get("unlimited") is True:
        return {"unlimited": True, "balance": None, "local_messages": None}
    balance = raw.get("balance")
    try:
        balance = float(balance)
    except (TypeError, ValueError):
        balance = None
    if balance is None and raw.get("has_credits") is not True:
        return None
    messages = raw.get("approx_local_messages")
    local = None
    if (isinstance(messages, list) and len(messages) >= 2
            and all(isinstance(item, (int, float)) for item in messages[:2])):
        local = [int(messages[0]), int(messages[1])]
    return {"unlimited": False, "balance": balance, "local_messages": local}


def _identity(tokens):
    claims = _jwt(tokens.get("id_token") or "")
    auth = claims.get("https://api.openai.com/auth")
    auth = auth if isinstance(auth, dict) else {}
    email = str(claims.get("email") or "").strip()
    name = str(claims.get("name") or "").strip()
    if not name:
        name = email.split("@", 1)[0] if email else "Codex"
    return name, email, _plan(auth.get("chatgpt_plan_type"))


def subscription_until_from_tokens(tokens):
    """End of the current ChatGPT subscription period, from the login token."""
    claims = _jwt((tokens or {}).get("id_token") or "")
    auth = claims.get("https://api.openai.com/auth")
    auth = auth if isinstance(auth, dict) else {}
    parsed = None
    raw = auth.get("chatgpt_subscription_active_until")
    if isinstance(raw, str) and raw.strip():
        text = raw.strip().replace("Z", "+00:00")
        try:
            parsed = datetime.fromisoformat(text)
        except ValueError:
            parsed = None
    if parsed is None:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def discover_accounts(home):
    home = Path(home)
    found = []
    creds = home / ".codex" / "auth.json"
    if creds.is_file():
        found.append({"id": "default", "account": "默认", "credentials": creds})
    try:
        named = sorted(home.glob(".codex-*"))
    except OSError:
        named = []
    for directory in named:
        name = directory.name.removeprefix(".codex-")
        creds = directory / "auth.json"
        if name and creds.is_file():
            found.append({"id": name, "account": name, "credentials": creds})
    return found


def _public(account, name, email, plan, windows, credits, stale, error, as_of,
            subscription_until=None, resets=None):
    return {"id": account["id"], "name": name, "account": account["account"], "plan": plan,
            "email": email, "windows": windows or [], "credits": credits, "resets": resets,
            "subscription_until": subscription_until, "stale": stale,
            "error": error, "as_of": as_of}


def _tokens(path):
    data = _load_json(path) or {}
    tokens = data.get("tokens")
    return tokens if isinstance(tokens, dict) else {}


def _refresh_locked(path, transport):
    with path.open("r+") as handle:
        fcntl.flock(handle, fcntl.LOCK_EX)
        data = json.loads(handle.read())
        tokens = data.get("tokens")
        if not isinstance(tokens, dict) or not tokens.get("refresh_token"):
            raise UsageError(0, "需要重新登录")
        try:
            fresh = transport.post_json(TOKEN_URL, {
                "grant_type": "refresh_token",
                "refresh_token": tokens["refresh_token"],
                "client_id": CLIENT_ID,
            }, {"Content-Type": "application/json", "Accept": "application/json",
                "User-Agent": "codex-cli"})
        except UsageError as exc:
            if exc.status in (400, 401):
                raise UsageError(exc.status, "需要重新登录") from None
            raise
        access = fresh.get("access_token")
        if not isinstance(access, str) or not access:
            raise UsageError(0, "登录刷新失败")
        tokens["access_token"] = access
        if isinstance(fresh.get("refresh_token"), str) and fresh["refresh_token"]:
            tokens["refresh_token"] = fresh["refresh_token"]
        if isinstance(fresh.get("id_token"), str) and fresh["id_token"]:
            tokens["id_token"] = fresh["id_token"]
        data["tokens"] = tokens
        data["last_refresh"] = _iso(time.time())
        _atomic_write(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        return access, tokens


def _token(path, transport, force=False):
    tokens = _tokens(path)
    access = tokens.get("access_token")
    if not isinstance(access, str) or not access or not tokens.get("refresh_token"):
        if not tokens.get("refresh_token"):
            raise UsageError(0, "需要重新登录")
    exp = _jwt(access).get("exp") if isinstance(access, str) else 0
    if (not isinstance(access, str) or not access or force
            or (isinstance(exp, (int, float)) and exp <= time.time() + 60)):
        access, tokens = _refresh_locked(path, transport)
    return access, tokens


def _headers(token, account_id):
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/json",
               "User-Agent": "codex-cli"}
    if account_id:
        headers["chatgpt-account-id"] = account_id
    return headers


def _usage(token, account_id, transport):
    return transport.get_json(USAGE_URL, _headers(token, account_id))


def _reset_credits(token, account_id, transport):
    return transport.get_json(RESETS_URL, _headers(token, account_id))


def _one_account(account, transport, previous=None):
    tokens = _tokens(account["credentials"])
    name, email, plan = _identity(tokens)
    subscription_until = (subscription_until_from_tokens(tokens)
                          or (previous or {}).get("subscription_until"))
    cached_windows = (previous or {}).get("windows") or []
    cached_credits = (previous or {}).get("credits")
    cached_resets = (previous or {}).get("resets")
    as_of = (previous or {}).get("as_of")
    try:
        token, tokens = _token(account["credentials"], transport)
        name, email, refreshed_plan = _identity(tokens)
        plan = refreshed_plan or plan
        account_id = tokens.get("account_id") or ""
        try:
            payload = _usage(token, account_id, transport)
        except UsageError as exc:
            if exc.status != 401:
                raise
            token, tokens = _token(account["credentials"], transport, force=True)
            name, email, refreshed_plan = _identity(tokens)
            plan = refreshed_plan or plan
            payload = _usage(token, tokens.get("account_id") or account_id, transport)
        windows = windows_from_payload(payload)
        credits = credits_from_payload(payload)
        summary = resets_from_usage(payload)
        resets = summary
        try:
            resets = resets_from_details(_reset_credits(token, tokens.get("account_id") or account_id, transport),
                                         summary)
        except UsageError:
            resets = _keep_reset_items(summary, cached_resets)
        if not windows and not credits and not resets:
            raise UsageError(0, "额度响应里没有窗口或积分")
        live_plan = _plan(payload.get("plan_type"))
        subscription_until = subscription_until_from_tokens(tokens) or subscription_until
        return _public(account, name, email, live_plan or plan, windows, credits, False, None,
                       _iso(time.time()), subscription_until, resets)
    except UsageError as exc:
        keep = bool(cached_windows or cached_credits or cached_resets)
        return _public(account, name, email, plan, cached_windows if keep else [],
                       cached_credits if keep else None, keep, _public_error(exc), as_of if keep else None,
                       subscription_until, cached_resets if keep else None)
    except (OSError, json.JSONDecodeError):
        keep = bool(cached_windows or cached_credits or cached_resets)
        return _public(account, name, email, plan, cached_windows if keep else [],
                       cached_credits if keep else None, keep, "读不到登录状态", as_of if keep else None,
                       subscription_until, cached_resets if keep else None)


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
    return Path(__file__).resolve().parent / ".runtime" / str(os.getuid()) / "codex_usage.json"


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
