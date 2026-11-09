import json
import tempfile
import time
import unittest
from pathlib import Path

import claude_usage


def write_account(root, directory, account_id, access, refresh, expires_at, email, name):
    directory.mkdir(parents=True, exist_ok=True)
    (directory / ".credentials.json").write_text(json.dumps({"claudeAiOauth": {
        "accessToken": access, "refreshToken": refresh, "expiresAt": expires_at,
        "scopes": ["user:profile"], "subscriptionType": "pro"}}))
    profile = {"oauthAccount": {"displayName": name, "emailAddress": email}}
    if account_id == "default":
        (root / ".claude.json").write_text(json.dumps(profile))
    else:
        (directory / ".claude.json").write_text(json.dumps(profile))


class FakeTransport:
    def __init__(self, fail_status=None):
        self.posts = []
        self.gets = []
        self.fail_status = fail_status

    def post_json(self, url, payload, headers):
        self.posts.append(payload["refresh_token"])
        return {"access_token": "access-new", "refresh_token": "refresh-new",
                "expires_in": 3600, "refresh_token_expires_in": 7200, "scope": "user:profile"}

    def get_json(self, url, headers):
        self.gets.append(headers["Authorization"])
        if self.fail_status:
            raise claude_usage.UsageError(self.fail_status, "HTTP " + str(self.fail_status))
        return {"five_hour": {"utilization": 12, "resets_at": "2026-11-02T15:39:59+00:00"},
                "seven_day": {"utilization": 100, "resets_at": "2026-11-03T21:59:59+00:00"}}


class ClaudeUsageTests(unittest.TestCase):
    def test_windows_fall_back_to_limit_rows(self):
        windows = claude_usage.windows_from_payload({"limits": [
            {"kind": "session", "percent": 3, "resets_at": "2026-11-02T00:00:00Z"},
            {"kind": "weekly_all", "percent": 9, "resets_at": "2026-11-08T00:00:00Z"}]})
        self.assertEqual(windows["five_hour"]["percent"], 3)
        self.assertEqual(windows["week"]["percent"], 9)

    def test_discover_reads_default_and_named_accounts_only(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            later = int(time.time() * 1000) + 3_600_000
            write_account(root, root / ".claude", "default", "access-old", "refresh-old", later,
                          "felix@example.com", "Felix")
            write_account(root, root / ".claude-work", "work", "access-work", "refresh-work", later,
                          "work@example.com", "Yuxuan")
            (root / ".claude-code-install").mkdir()
            (root / ".claude-code-install" / ".credentials.json").write_text("{}")
            ids = [item["id"] for item in claude_usage.discover_accounts(root)]
            self.assertEqual(ids, ["default", "work"])

    def test_live_token_is_not_refreshed_and_secrets_stay_out_of_snapshot(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            later = int(time.time() * 1000) + 3_600_000
            write_account(root, root / ".claude", "default", "access-old", "refresh-old", later,
                          "felix@example.com", "Felix")
            transport = FakeTransport()
            snap = claude_usage.collect_usage(root, transport)
            account = snap["accounts"][0]
            self.assertEqual(account["name"], "Felix")
            self.assertEqual(account["account"], "默认")
            self.assertEqual(account["plan"], "Pro")
            self.assertEqual(account["five_hour"]["percent"], 12)
            self.assertEqual(account["week"]["percent"], 100)
            self.assertFalse(account["stale"])
            self.assertEqual(transport.posts, [])
            self.assertEqual(transport.gets, ["Bearer access-old"])
            dumped = json.dumps(snap)
            self.assertNotIn("access-old", dumped)
            self.assertNotIn("refresh-old", dumped)

    def test_expired_token_is_refreshed_and_written_back(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            creds = root / ".claude" / ".credentials.json"
            write_account(root, root / ".claude", "default", "access-old", "refresh-old", 0,
                          "felix@example.com", "Felix")
            transport = FakeTransport()
            snap = claude_usage.collect_usage(root, transport)
            self.assertEqual(transport.posts, ["refresh-old"])
            self.assertEqual(transport.gets, ["Bearer access-new"])
            saved = json.loads(creds.read_text())["claudeAiOauth"]
            self.assertEqual(saved["accessToken"], "access-new")
            self.assertEqual(saved["refreshToken"], "refresh-new")
            self.assertGreater(saved["expiresAt"], time.time() * 1000)
            dumped = json.dumps(snap)
            self.assertNotIn("access-new", dumped)
            self.assertNotIn("refresh-new", dumped)

    def test_failed_fetch_keeps_cached_windows(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            later = int(time.time() * 1000) + 3_600_000
            write_account(root, root / ".claude", "default", "access-old", "refresh-old", later,
                          "felix@example.com", "Felix")
            profile = json.loads((root / ".claude.json").read_text())
            profile["cachedUsageUtilization"] = {"fetchedAtMs": 1_700_000_000_000, "utilization": {
                "five_hour": {"utilization": 4, "resets_at": "2026-11-02T01:00:00Z"},
                "seven_day": {"utilization": 8, "resets_at": "2026-11-08T01:00:00Z"}}}
            (root / ".claude.json").write_text(json.dumps(profile))
            snap = claude_usage.collect_usage(root, FakeTransport(fail_status=503))
            account = snap["accounts"][0]
            self.assertTrue(account["stale"])
            self.assertEqual(account["five_hour"]["percent"], 4)
            self.assertEqual(account["error"], "额度暂时读不到")

    def test_monthly_subscription_ends_on_the_next_anniversary(self):
        from datetime import datetime, timezone
        now = datetime(2026, 11, 7, 8, 0, tzinfo=timezone.utc)
        self.assertEqual(
            claude_usage.monthly_subscription_until("2026-11-07T03:40:16.828811Z", now),
            "2026-12-07T03:40:16Z")
        later = datetime(2026, 3, 15, tzinfo=timezone.utc)
        self.assertEqual(
            claude_usage.monthly_subscription_until("2026-01-31T00:00:00Z", later),
            "2026-03-31T00:00:00Z")
        leap = datetime(2024, 2, 15, tzinfo=timezone.utc)
        self.assertEqual(
            claude_usage.monthly_subscription_until("2024-01-31T12:00:00Z", leap),
            "2024-02-29T12:00:00Z")
        self.assertIsNone(claude_usage.monthly_subscription_until(None, now))


if __name__ == "__main__":
    unittest.main()
