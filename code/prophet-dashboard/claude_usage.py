#!/usr/bin/env python3
"""Read this user's Claude accounts and their 5-hour / weekly quota."""
import calendar
from datetime import datetime, timezone
import fcntl
import json
import os
from pathlib import Path
import threading
import time
from urllib.error import HTTPError, URLError
from urllib.request import ProxyHandler, Request, build_opener

# Public Claude Code OAuth client. Refresh rotates the refresh token, so a
# successful refresh is written back before any later request.
TOKEN_URL = "https://platform.claude.com/v1/oauth/token"
USAGE_URL = "https://api.anthropic.com/api/oauth/usage"
CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e"
BETA = "oauth-2025-04-20"
PLANS = {"pro": "Pro", "max": "Max", "team": "Team", "enterprise": "Enterprise"}


class UsageError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status


def proxy_url():
    for key in ("https_proxy", "HTTPS_PROXY", "http_proxy", "HTTP_PROXY"):
        value = os.environ.get(key)
        if value:
            return value
    return "http://127.0.0.1:18083"


class UrllibTransport:
    def __init__(self, timeout=20):
        proxy = proxy_url()
        self.opener = build_opener(ProxyHandler({"http": proxy, "https": proxy}))
        self.timeout = timeout

    def post_json(self, url, payload, headers):
        return self._json("POST", url, headers, json.dumps(payload).encode())

    def get_json(self, url, headers):
        return self._json("GET", url, headers, None)

    def _json(self, method, url, headers, body):
        request = Request(url, data=body, headers=headers, method=method)
        try:
            with self.opener.open(request, timeout=self.timeout) as response:
                raw = response.read()
        except HTTPError as exc:
            raw = exc.read()[:400]
            message = f"HTTP {exc.code}"
            try:
                parsed = json.loads(raw.decode())
                err = parsed.get("error")
                if isinstance(err, dict) and isinstance(err.get("message"), str):
                    message = err["message"][:160]
                elif isinstance(err, str):
                    message = err[:160]
            except (UnicodeError, json.JSONDecodeError, AttributeError):
                pass
            if "sk-ant" in message:
                message = f"HTTP {exc.code}"
            raise UsageError(exc.code, message) from None
        except URLError as exc:
            raise UsageError(0, "网络不可达") from None
        try:
            data = json.loads(raw.decode())
        except (UnicodeError, json.JSONDecodeError):
            raise UsageError(0, "额度响应无法解析") from None
        if not isinstance(data, dict):
            raise UsageError(0, "额度响应无法解析")
        return data


def _atomic_write(path, text):
    tmp = path.with_name(path.name + ".tmp")
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    try:
        os.write(fd, text.encode())
        os.fsync(fd)
    finally:
        os.close(fd)
    os.chmod(tmp, 0o600)
    os.replace(tmp, path)


def _load_json(path):
    try:
        data = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError):
        return None
    return data if isinstance(data, dict) else None


def _window(payload, key, kind):
    raw = payload.get(key) if isinstance(payload, dict) else None
    if isinstance(raw, dict) and isinstance(raw.get("utilization"), (int, float)):
        return {"percent": float(raw["utilization"]), "resets_at": raw.get("resets_at")}
    for item in (payload.get("limits") or []) if isinstance(payload, dict) else []:
        if isinstance(item, dict) and item.get("kind") == kind and isinstance(item.get("percent"), (int, float)):
            return {"percent": float(item["percent"]), "resets_at": item.get("resets_at")}
    return None


def _public_error(exc):
    text = str(exc)
    if exc.status in (400, 401) or text == "需要重新登录":
        return "需要重新登录"
    if exc.status == 429 or "Rate limited" in text:
        return "查询被限流，显示缓存"
    if exc.status == 403:
        return "额度接口拒绝了这次查询"
    if exc.status == 0:
        return text or "网络不可达"
    return "额度暂时读不到"


def windows_from_payload(payload):
    return {"five_hour": _window(payload, "five_hour", "session"),
            "week": _window(payload, "seven_day", "weekly_all")}


def _parse_utc(value):
    if not isinstance(value, str) or not value.strip():
        return None
    try:
        parsed = datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def _add_months(moment, months):
    index = moment.month - 1 + months
    year = moment.year + index // 12
    month = index % 12 + 1
    day = min(moment.day, calendar.monthrange(year, month)[1])
    return moment.replace(year=year, month=month, day=day)


def monthly_subscription_until(created, now=None):
    """Next monthly anniversary of a subscription that publishes only its start.

    Claude's profile has subscriptionCreatedAt and no period end. Stripe and
    App Store monthly plans renew on that anniversary.
    """
    start = _parse_utc(created)
    if start is None:
        return None
    current = now or datetime.now(timezone.utc)
    if current.tzinfo is None:
        current = current.replace(tzinfo=timezone.utc)
    current = current.astimezone(timezone.utc)
    for months in range(1, 241):
        end = _add_months(start, months)
        if end > current:
            return end.strftime("%Y-%m-%dT%H:%M:%SZ")
    return None


def _present(account_id, profile, oauth):
    name = (profile.get("displayName") or profile.get("fullName") or "").strip()
    email = (profile.get("emailAddress") or "").strip()
    if not name:
        name = email.split("@", 1)[0] if email else account_id
    plan = PLANS.get(str(oauth.get("subscriptionType") or "").lower(), "")
    return name, email, plan


def _profile(path):
    data = _load_json(path) or {}
    account = data.get("oauthAccount")
    cache = data.get("cachedUsageUtilization")
    return (account if isinstance(account, dict) else {},
            cache if isinstance(cache, dict) else None)


def discover_accounts(home):
    home = Path(home)
    found = []
    creds = home / ".claude" / ".credentials.json"
    if creds.is_file():
        profile_path = home / ".claude.json"
        nested = home / ".claude" / ".claude.json"
        if not profile_path.is_file() and nested.is_file():
            profile_path = nested
        found.append({"id": "default", "account": "默认", "credentials": creds, "profile": profile_path})
    try:
        named = sorted(home.glob(".claude-*"))
    except OSError:
        named = []
    for directory in named:
        name = directory.name.removeprefix(".claude-")
        creds = directory / ".credentials.json"
        if name == "code-install" or not creds.is_file():
            continue
        found.append({"id": name, "account": name, "credentials": creds,
                      "profile": directory / ".claude.json"})
    return found


def _cache_windows(cache):
    util = (cache or {}).get("utilization")
    if not isinstance(util, dict):
        return None
    windows = windows_from_payload(util)
    if windows["five_hour"] or windows["week"]:
        return windows
    return None


def _public(account, name, email, plan, windows, stale, error, as_of, subscription_until=None):
    return {"id": account["id"], "name": name, "account": account["account"], "plan": plan,
            "email": email, "five_hour": windows.get("five_hour") if windows else None,
            "week": windows.get("week") if windows else None,
            "subscription_until": subscription_until, "stale": stale,
            "error": error, "as_of": as_of}


def _refresh_locked(path, transport):
    with path.open("r+") as handle:
        fcntl.flock(handle, fcntl.LOCK_EX)
        data = json.loads(handle.read())
        oauth = data.get("claudeAiOauth")
        if not isinstance(oauth, dict) or not oauth.get("refreshToken"):
            raise UsageError(0, "需要重新登录")
        payload = {"grant_type": "refresh_token", "refresh_token": oauth["refreshToken"],
                   "client_id": CLIENT_ID, "scope": " ".join(oauth.get("scopes") or [])}
        try:
            fresh = transport.post_json(TOKEN_URL, payload, {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "claude-code/2.1.316",
            })
        except UsageError as exc:
            if exc.status in (400, 401):
                raise UsageError(exc.status, "需要重新登录") from None
            raise
        access = fresh.get("access_token")
        if not isinstance(access, str) or not access:
            raise UsageError(0, "登录刷新失败")
        now_ms = int(time.time() * 1000)
        oauth["accessToken"] = access
        if isinstance(fresh.get("refresh_token"), str) and fresh["refresh_token"]:
            oauth["refreshToken"] = fresh["refresh_token"]
        expires_in = fresh.get("expires_in")
        if isinstance(expires_in, (int, float)) and expires_in > 0:
            oauth["expiresAt"] = now_ms + int(expires_in * 1000)
        refresh_in = fresh.get("refresh_token_expires_in")
        if isinstance(refresh_in, (int, float)) and refresh_in > 0:
            oauth["refreshTokenExpiresAt"] = now_ms + int(refresh_in * 1000)
        if isinstance(fresh.get("scope"), str) and fresh["scope"].strip():
            oauth["scopes"] = fresh["scope"].split()
        data["claudeAiOauth"] = oauth
        _atomic_write(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        return access


def _token(path, transport, force=False):
    data = _load_json(path) or {}
    oauth = data.get("claudeAiOauth")
    if not isinstance(oauth, dict) or not oauth.get("accessToken"):
        raise UsageError(0, "需要重新登录")
    expires = oauth.get("expiresAt") or 0
    if not force and isinstance(expires, (int, float)) and expires > time.time() * 1000 + 60_000:
        return oauth["accessToken"]
    return _refresh_locked(path, transport)


def _usage(token, transport):
    return transport.get_json(USAGE_URL, {
        "Authorization": f"Bearer {token}",
        "anthropic-beta": BETA,
        "Accept": "application/json",
        "User-Agent": "claude-code/2.1.316",
    })


def _one_account(account, transport):
    profile, cache = _profile(account["profile"])
    oauth = (_load_json(account["credentials"]) or {}).get("claudeAiOauth")
    oauth = oauth if isinstance(oauth, dict) else {}
    name, email, plan = _present(account["id"], profile, oauth)
    subscription_until = monthly_subscription_until(profile.get("subscriptionCreatedAt"))
    cached = _cache_windows(cache)
    as_of = None
    if cache and isinstance(cache.get("fetchedAtMs"), (int, float)):
        as_of = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(cache["fetchedAtMs"] / 1000))
    try:
        token = _token(account["credentials"], transport)
        try:
            payload = _usage(token, transport)
        except UsageError as exc:
            if exc.status != 401:
                raise
            token = _token(account["credentials"], transport, force=True)
            payload = _usage(token, transport)
        windows = windows_from_payload(payload)
        if not windows["five_hour"] and not windows["week"]:
            raise UsageError(0, "额度响应里没有 5 小时或一周窗口")
        return _public(account, name, email, plan, windows, False, None,
                       time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), subscription_until)
    except UsageError as exc:
        return _public(account, name, email, plan, cached, bool(cached), _public_error(exc), as_of,
                       subscription_until)
    except (OSError, json.JSONDecodeError):
        return _public(account, name, email, plan, cached, bool(cached), "读不到登录状态", as_of,
                       subscription_until)


def collect_usage(home, transport=None):
    transport = transport or UrllibTransport()
    accounts = [_one_account(account, transport) for account in discover_accounts(home)]
    return {"checked_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "accounts": accounts}


def _default_cache():
    return Path(__file__).resolve().parent / ".runtime" / str(os.getuid()) / "claude_usage.json"


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
        snapshot = collect_usage(self.home, self.transport)
        text = json.dumps(snapshot, ensure_ascii=False)
        with self.lock:
            self.snapshot = snapshot
        try:
            self.cache_path.parent.mkdir(mode=0o700, exist_ok=True)
            _atomic_write(self.cache_path, text + "\n")
        except OSError:
            pass
        return snapshot
