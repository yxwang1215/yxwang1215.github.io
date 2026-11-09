import base64
import json
import tempfile
import time
import unittest
from pathlib import Path

import cursor_usage


def jwt(exp):
    header = base64.urlsafe_b64encode(b'{"alg":"none"}').decode().rstrip("=")
    body = base64.urlsafe_b64encode(json.dumps({"exp": exp, "sub": "user"}).encode()).decode().rstrip("=")
    return f"{header}.{body}.sig"


def write_account(root, directory, access, name="Elizabeth Rodriguez", email="liz@example.com"):
    directory.mkdir(parents=True, exist_ok=True)
    (directory / "auth.json").write_text(json.dumps({"accessToken": access, "refreshToken": "refresh-old"}))
    if directory.name == "cursor":
        profile = root / ".cursor" / "cli-config.json"
        profile.parent.mkdir(parents=True, exist_ok=True)
        profile.write_text(json.dumps({"authInfo": {"displayName": name, "email": email}}))


class FakeTransport:
    def __init__(self, fail_status=None):
        self.posts = []
        self.fail_status = fail_status

    def post_json(self, url, payload, headers):
        self.posts.append((url, headers["Authorization"]))
        if self.fail_status and url.endswith("GetCurrentPeriodUsage"):
            raise cursor_usage.UsageError(self.fail_status, "HTTP " + str(self.fail_status))
        if url.endswith("GetMe"):
            return {"firstName": "Elizabeth", "lastName": "Rodriguez", "email": "liz@example.com"}
        if url.endswith("GetPlanInfo"):
            return {"planInfo": {"planName": "Pro+", "billingCycleEnd": "1794724754000"}}
        if url.endswith("GetCurrentPeriodUsage"):
            return {"billingCycleEnd": "1794724754000", "planUsage": {
                "apiPercentUsed": 100, "autoPercentUsed": 51.258, "totalPercentUsed": 55.4}}
        raise cursor_usage.UsageError(0, "unknown")


class CursorUsageTests(unittest.TestCase):
    def test_windows_split_named_models_and_auto(self):
        windows = cursor_usage.windows_from_payload({"billingCycleEnd": "1794724754000", "planUsage": {
            "apiPercentUsed": 100, "autoPercentUsed": 51.2}})
        self.assertEqual([item["label"] for item in windows], ["模型", "Auto"])
        self.assertEqual(windows[0]["resets_at"], "2026-11-15T06:39:14Z")
        self.assertEqual(cursor_usage._note(windows), "指定模型已用完")

    def test_discover_reads_default_and_named_accounts_only(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_account(root, root / ".config" / "cursor", "access-old")
            write_account(root, root / ".config" / "cursor-work", "access-work")
            (root / ".config" / "cursor-empty").mkdir()
            ids = [item["id"] for item in cursor_usage.discover_accounts(root)]
            self.assertEqual(ids, ["default", "work"])

    def test_live_token_reads_plan_and_keeps_secrets_out(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_account(root, root / ".config" / "cursor", "access-old")
            transport = FakeTransport()
            snap = cursor_usage.collect_usage(root, transport)
            account = snap["accounts"][0]
            self.assertEqual(account["name"], "Elizabeth Rodriguez")
            self.assertEqual(account["plan"], "Pro+")
            self.assertEqual(account["windows"][0]["percent"], 100)
            self.assertAlmostEqual(account["windows"][1]["percent"], 51.258)
            self.assertEqual(account["note"], "指定模型已用完")
            self.assertFalse(account["stale"])
            self.assertEqual([url.rsplit("/", 1)[-1] for url, _ in transport.posts],
                             ["GetMe", "GetPlanInfo", "GetCurrentPeriodUsage"])
            dumped = json.dumps(snap)
            self.assertNotIn("access-old", dumped)
            self.assertNotIn("refresh-old", dumped)

    def test_expired_token_is_not_sent(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_account(root, root / ".config" / "cursor", jwt(0))
            transport = FakeTransport()
            snap = cursor_usage.collect_usage(root, transport)
            account = snap["accounts"][0]
            self.assertEqual(account["error"], "需要重新登录")
            self.assertEqual(transport.posts, [])
            self.assertNotIn(jwt(0), json.dumps(snap))

    def test_failed_fetch_keeps_previous_windows(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_account(root, root / ".config" / "cursor", "access-old")
            previous = {"accounts": [{"id": "default", "plan": "Pro+", "note": "指定模型已用完",
                                      "windows": [{"key": "api", "label": "模型", "percent": 100,
                                                   "resets_at": "2026-11-15T06:39:14Z"}],
                                      "as_of": "2026-11-02T01:00:00Z"}]}
            snap = cursor_usage.collect_usage(root, FakeTransport(fail_status=503), previous)
            account = snap["accounts"][0]
            self.assertTrue(account["stale"])
            self.assertEqual(account["windows"][0]["percent"], 100)
            self.assertEqual(account["error"], "额度暂时读不到")


if __name__ == "__main__":
    unittest.main()
