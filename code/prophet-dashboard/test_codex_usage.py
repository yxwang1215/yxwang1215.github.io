import base64
import json
import tempfile
import time
import unittest
from pathlib import Path

import codex_usage


def jwt(exp, name="Yuxuan", email="yuxuan@example.com", plan="prolite",
        until="2026-11-14T05:37:11+00:00"):
    header = base64.urlsafe_b64encode(b'{"alg":"none"}').decode().rstrip("=")
    auth = {"chatgpt_plan_type": plan}
    if until:
        auth["chatgpt_subscription_active_until"] = until
    body = base64.urlsafe_b64encode(json.dumps({
        "exp": exp, "name": name, "email": email,
        "https://api.openai.com/auth": auth,
    }).encode()).decode().rstrip("=")
    return f"{header}.{body}.sig"


def write_account(directory, access, refresh, name="Yuxuan", plan="prolite", account_id="acct-1"):
    directory.mkdir(parents=True, exist_ok=True)
    (directory / "auth.json").write_text(json.dumps({
        "auth_mode": "chatgpt",
        "tokens": {"id_token": jwt(int(time.time()) + 3600, name, plan=plan),
                   "access_token": access, "refresh_token": refresh, "account_id": account_id},
    }))


class FakeTransport:
    def __init__(self, fail_status=None, payload=None, resets=None, resets_fail=None):
        self.posts = []
        self.gets = []
        self.fail_status = fail_status
        self.resets = resets
        self.resets_fail = resets_fail
        self.payload = payload or {
            "plan_type": "prolite",
            "rate_limit": {"primary_window": {
                "used_percent": 50, "limit_window_seconds": 604800,
                "reset_after_seconds": 200000, "reset_at": 1793897183},
                "secondary_window": None},
            "credits": {"has_credits": True, "unlimited": False, "balance": "71780.94",
                        "approx_local_messages": [17945, 93315]},
        }

    def post_json(self, url, payload, headers):
        self.posts.append(payload["refresh_token"])
        return {"access_token": jwt(int(time.time()) + 3600), "refresh_token": "refresh-new",
                "id_token": jwt(int(time.time()) + 3600), "expires_in": 3600}

    def get_json(self, url, headers):
        self.gets.append((headers["Authorization"], headers.get("chatgpt-account-id"), url))
        if "rate-limit-reset-credits" in url:
            if self.resets_fail:
                raise codex_usage.UsageError(self.resets_fail, "HTTP " + str(self.resets_fail))
            return self.resets if self.resets is not None else {"credits": [], "available_count": 0}
        if self.fail_status:
            raise codex_usage.UsageError(self.fail_status, "HTTP " + str(self.fail_status))
        return self.payload


class CodexUsageTests(unittest.TestCase):
    def test_windows_use_duration_labels_and_keep_credits(self):
        windows = codex_usage.windows_from_payload({"rate_limit": {
            "primary_window": {"used_percent": 50, "limit_window_seconds": 604800, "reset_at": 1793897183},
            "secondary_window": {"used_percent": 12, "limit_window_seconds": 18000, "reset_at": 1793500000}}})
        self.assertEqual([item["label"] for item in windows], ["一周", "5小时"])
        self.assertEqual(windows[0]["percent"], 50)
        credits = codex_usage.credits_from_payload({
            "credits": {"unlimited": False, "balance": "10.5", "approx_local_messages": [1, 2]}})
        self.assertEqual(credits["balance"], 10.5)
        self.assertEqual(credits["local_messages"], [1, 2])

    def test_discover_reads_default_and_named_accounts_only(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_account(root / ".codex", "access-old", "refresh-old")
            write_account(root / ".codex-work", "access-work", "refresh-work", name="Work")
            (root / ".codex-empty").mkdir()
            ids = [item["id"] for item in codex_usage.discover_accounts(root)]
            self.assertEqual(ids, ["default", "work"])

    def test_live_token_is_not_refreshed_and_secrets_stay_out_of_snapshot(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_account(root / ".codex", "access-old", "refresh-old")
            transport = FakeTransport()
            snap = codex_usage.collect_usage(root, transport)
            account = snap["accounts"][0]
            self.assertEqual(account["name"], "Yuxuan")
            self.assertEqual(account["account"], "默认")
            self.assertEqual(account["plan"], "Pro Lite")
            self.assertEqual(account["subscription_until"], "2026-11-14T05:37:11Z")
            self.assertEqual(account["windows"][0]["label"], "一周")
            self.assertEqual(account["windows"][0]["percent"], 50)
            self.assertEqual(account["credits"]["balance"], 71780.94)
            self.assertFalse(account["stale"])
            self.assertEqual(transport.posts, [])
            self.assertEqual([item[:2] for item in transport.gets],
                             [("Bearer access-old", "acct-1"), ("Bearer access-old", "acct-1")])
            self.assertIn("wham/usage", transport.gets[0][2])
            self.assertIn("rate-limit-reset-credits", transport.gets[1][2])
            dumped = json.dumps(snap)
            self.assertNotIn("access-old", dumped)
            self.assertNotIn("refresh-old", dumped)

    def test_expired_token_is_refreshed_and_written_back(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            creds = root / ".codex" / "auth.json"
            write_account(root / ".codex", jwt(0), "refresh-old")
            transport = FakeTransport()
            snap = codex_usage.collect_usage(root, transport)
            self.assertEqual(transport.posts, ["refresh-old"])
            self.assertTrue(transport.gets[0][0].startswith("Bearer ey"))
            saved = json.loads(creds.read_text())["tokens"]
            self.assertNotEqual(saved["access_token"], jwt(0))
            self.assertEqual(saved["refresh_token"], "refresh-new")
            dumped = json.dumps(snap)
            self.assertNotIn("refresh-new", dumped)
            self.assertNotIn(saved["access_token"], dumped)

    def test_failed_fetch_keeps_previous_windows(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_account(root / ".codex", "access-old", "refresh-old")
            previous = {"accounts": [{"id": "default", "windows": [
                {"label": "一周", "percent": 4, "resets_at": "2026-11-08T01:00:00Z"}],
                "credits": {"unlimited": False, "balance": 12, "local_messages": None},
                "as_of": "2026-11-02T01:00:00Z"}]}
            snap = codex_usage.collect_usage(root, FakeTransport(fail_status=503), previous)
            account = snap["accounts"][0]
            self.assertTrue(account["stale"])
            self.assertEqual(account["windows"][0]["percent"], 4)
            self.assertEqual(account["credits"]["balance"], 12)
            self.assertEqual(account["error"], "额度暂时读不到")

    def test_reset_count_and_expiry_come_from_details(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_account(root / ".codex", "access-old", "refresh-old")
            transport = FakeTransport(
                payload={
                    "plan_type": "prolite",
                    "rate_limit": {"primary_window": {
                        "used_percent": 33, "limit_window_seconds": 604800, "reset_at": 1793897183}},
                    "credits": {"balance": "62154"},
                    "rate_limit_reset_credits": {"available_count": 2},
                },
                resets={
                    "available_count": 2,
                    "credits": [
                        {"id": "RateLimitResetCredit_secret", "status": "available",
                         "title": "Full reset (Weekly + 5 hr)",
                         "granted_at": "2026-11-08T00:00:00Z", "expires_at": "2026-12-08T00:00:00Z"},
                        {"id": "later", "status": "redeemed", "expires_at": "2026-12-01T00:00:00Z"},
                        {"id": "sooner", "status": "available", "title": "Sooner",
                         "expires_at": "2026-11-20T16:46:25+00:00"},
                    ],
                })
            account = codex_usage.collect_usage(root, transport)["accounts"][0]
            self.assertEqual(account["resets"]["available"], 2)
            self.assertEqual([item["expires_at"] for item in account["resets"]["items"]],
                             ["2026-11-20T16:46:25Z", "2026-12-08T00:00:00Z"])
            self.assertEqual(account["resets"]["items"][0]["title"], "Sooner")
            dumped = json.dumps(account)
            self.assertNotIn("RateLimitResetCredit_secret", dumped)
            self.assertNotIn("later", dumped)

    def test_reset_details_failure_keeps_matching_expiries(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_account(root / ".codex", "access-old", "refresh-old")
            previous = {"accounts": [{"id": "default", "resets": {
                "available": 2,
                "items": [{"title": "Full reset", "expires_at": "2026-12-08T00:00:00Z"}]}}]}
            transport = FakeTransport(
                payload={"plan_type": "prolite",
                         "rate_limit_reset_credits": {"available_count": 2},
                         "credits": {"balance": "1"}},
                resets_fail=503)
            account = codex_usage.collect_usage(root, transport, previous)["accounts"][0]
            self.assertFalse(account["stale"])
            self.assertEqual(account["resets"]["available"], 2)
            self.assertEqual(account["resets"]["items"][0]["expires_at"], "2026-12-08T00:00:00Z")

            transport.payload["rate_limit_reset_credits"]["available_count"] = 1
            changed = codex_usage.collect_usage(root, transport, previous)["accounts"][0]
            self.assertEqual(changed["resets"], {"available": 1, "items": []})


if __name__ == "__main__":
    unittest.main()
