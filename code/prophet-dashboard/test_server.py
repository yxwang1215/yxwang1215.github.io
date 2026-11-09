import json
import threading
import unittest
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import server


class CollectorHealthTests(unittest.TestCase):
    def test_long_collection_with_recent_page_progress_stays_healthy(self):
        self.assertTrue(server.collection_is_healthy(True, 1, 0, 1190, 1200))

    def test_stalled_collection_is_unhealthy(self):
        self.assertFalse(server.collection_is_healthy(True, 1, 0, 1, 1200))

    def test_idle_collection_does_not_time_out_between_refreshes(self):
        self.assertTrue(server.collection_is_healthy(True, 1, 20, 20, 1200))
        self.assertFalse(server.collection_is_healthy(False, 1, 20, 20, 1200))


class ServerTests(unittest.TestCase):
    def setUp(self):
        class Store:
            def read(self):
                return {"checked_at": "2026-10-15T00:00:00+00:00", "complete": True,
                        "projects": [{"available": True}], "jobs": [], "summary": {}}
        self.http = server.make_server(Store(), port=0)
        self.thread = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.thread.start()
        self.base = f"http://127.0.0.1:{self.http.server_port}"

    def tearDown(self):
        self.http.shutdown()
        self.http.server_close()
        self.thread.join()

    def test_snapshot_is_json_and_static_assets_are_served(self):
        with urlopen(self.base + "/api/snapshot") as r:
            self.assertEqual(json.load(r)["jobs"], [])
            self.assertIn("no-store", r.headers["Cache-Control"])
        for path, content_type in [("/", "text/html"), ("/app.js", "javascript"), ("/style.css", "text/css")]:
            with urlopen(self.base + path) as r:
                self.assertIn(content_type, r.headers["Content-Type"])
                self.assertGreater(len(r.read()), 100)

    def test_refresh_rejects_cross_origin_requests(self):
        req = Request(self.base + "/api/refresh", method="POST", headers={"Origin": "https://example.com"})
        with self.assertRaises(HTTPError) as err:
            urlopen(req)
        self.assertEqual(err.exception.code, 403)

    def test_arbitrary_workspace_files_are_not_served(self):
        for path in ("/prophet.py", "/../submit_prophet.py", "/.env", "/static/../../AGENTS.md"):
            with self.assertRaises(HTTPError) as err:
                urlopen(self.base + path)
            self.assertEqual(err.exception.code, 404)

    def test_claude_usage_is_pending_until_collected(self):
        with urlopen(self.base + "/api/claude-usage") as r:
            self.assertEqual(json.load(r), {"accounts": [], "pending": True})

    def test_snapshot_includes_claude_usage_when_present(self):
        class Usage:
            def read(self):
                return {"checked_at": "2026-11-02T00:00:00Z",
                        "accounts": [{"id": "work", "name": "Yuxuan", "five_hour": {"percent": 12}}]}
        self.http.usage = Usage()
        with urlopen(self.base + "/api/snapshot") as r:
            usage = json.load(r)["claude_usage"]
        self.assertEqual(usage["accounts"][0]["five_hour"]["percent"], 12)
        self.assertNotIn("accessToken", json.dumps(usage))

    def test_codex_usage_is_pending_until_collected(self):
        with urlopen(self.base + "/api/codex-usage") as r:
            self.assertEqual(json.load(r), {"accounts": [], "pending": True})

    def test_snapshot_includes_codex_usage_when_present(self):
        class Usage:
            def read(self):
                return {"checked_at": "2026-11-03T00:00:00Z",
                        "accounts": [{"id": "default", "name": "Yuxuan",
                                      "windows": [{"label": "一周", "percent": 50}],
                                      "credits": {"balance": 100}}]}
        self.http.codex_usage = Usage()
        with urlopen(self.base + "/api/snapshot") as r:
            usage = json.load(r)["codex_usage"]
        self.assertEqual(usage["accounts"][0]["windows"][0]["percent"], 50)
        self.assertNotIn("access_token", json.dumps(usage))

    def test_cursor_usage_is_pending_until_collected(self):
        with urlopen(self.base + "/api/cursor-usage") as r:
            self.assertEqual(json.load(r), {"accounts": [], "pending": True})

    def test_snapshot_includes_cursor_usage_when_present(self):
        class Usage:
            def read(self):
                return {"checked_at": "2026-11-03T00:00:00Z",
                        "accounts": [{"id": "default", "name": "Elizabeth", "plan": "Pro+",
                                      "windows": [{"label": "模型", "percent": 100}]}]}
        self.http.cursor_usage = Usage()
        with urlopen(self.base + "/api/snapshot") as r:
            usage = json.load(r)["cursor_usage"]
        self.assertEqual(usage["accounts"][0]["windows"][0]["percent"], 100)
        self.assertNotIn("accessToken", json.dumps(usage))

    def test_dns_rebinding_host_is_rejected(self):
        req = Request(self.base + "/api/snapshot", headers={"Host": "example.com"})
        with self.assertRaises(HTTPError) as err:
            urlopen(req)
        self.assertEqual(err.exception.code, 403)


if __name__ == "__main__":
    unittest.main()
