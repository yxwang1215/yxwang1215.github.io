import os
from pathlib import Path
import tempfile
import unittest
import io
from contextlib import redirect_stdout
from unittest.mock import patch

import prophet


def job(jid="one", status="Running", count="1", gpu="8", **kw):
    return dict(id=jid, name="train", status=status, creator_name="alice",
                resource={"count": count, "gpu": gpu, "resource_type": "A800"}, **kw)


class CountingTests(unittest.TestCase):
    def test_multinode_and_pending_are_counted_separately(self):
        rows = [prophet.normalize_job(job(count="4"), "CP"),
                prophet.normalize_job(job("two", "Pending", "2", "8"), "CP")]
        result = prophet.summarize(rows)
        self.assertEqual(result["running_gpus"], 32)
        self.assertEqual(result["pending_gpus"], 16)
        self.assertEqual(result["running_jobs"], 1)

    def test_missing_gpu_is_unknown_not_eight_or_zero(self):
        row = prophet.normalize_job({"id": "x", "resource": {}, "status": "Running"}, "CP")
        self.assertIsNone(row["gpus"])
        self.assertEqual(prophet.summarize([row])["unknown_gpu_jobs"], 1)

    def test_recent_finished_keeps_window_and_stops_after_empty_pages(self):
        now = 2_000_000_000
        since = now - prophet.FINISHED_WINDOW_SECONDS
        pages = {
            1: [job("a", end_time=now - 10), job("b", end_time=since - 10)],
            2: [job("c", end_time=since - 20), job("d", end_time=since - 30)],
            3: [job("e", end_time=now - 50), job("f", end_time=since - 40)],
        }
        for page in range(4, 9):
            pages[page] = [job(f"x{page}a", end_time=since - 100), job(f"x{page}b", end_time=since - 200)]
        seen = []

        def get(path, params):
            seen.append(params["page"])
            self.assertEqual(params["filter_status"], "Succeeded")
            return {"data": {"data": pages[params["page"]], "total": 9999}}

        client = prophet.Client(get=get, page_size=2)
        self.assertEqual([row["id"] for row in client.list_recent_finished("p", since)], ["a", "e"])
        self.assertNotIn(8, seen)
        self.assertEqual(prophet.normalize_job(job(end_time=now - 10), "CP")["ended_at"], now - 10)

    def test_priority_is_preserved_for_each_task(self):
        self.assertEqual(prophet.normalize_job(job(priority="P3"), "CP")["priority"], "P3")
        self.assertEqual(prophet.normalize_job(job(), "CP")["priority"], "—")

    def test_cpu_job_zero_and_missing_node_count(self):
        self.assertEqual(prophet.normalize_job(job(gpu="0"), "CP")["gpus"], 0)
        self.assertIsNone(prophet.normalize_job(job(count=None), "CP")["gpus"])

    def test_secrets_commands_and_environment_are_excluded(self):
        row = prophet.normalize_job(job(command="sensitive", envs={"SECRET": "hidden"}, ak="key"), "CP")
        self.assertTrue({"command", "envs", "ak"}.isdisjoint(row))


class SharedInstallTests(unittest.TestCase):
    def test_environment_credentials_work_without_private_helper(self):
        with patch.dict('os.environ', {"PROPHET_API_AK_KEY": "test-ak", "PROPHET_API_SK_KEY": "test-sk",
                                      "PROPHET_HELPER": "/missing/private/helper.py"}):
            self.assertEqual(prophet.credentials(), {"ak": "test-ak", "sk": "test-sk"})

    def test_partial_environment_credentials_do_not_fall_back_to_another_account(self):
        with patch.dict('os.environ', {"PROPHET_API_AK_KEY": "test-ak"}, clear=True):
            with self.assertRaises(prophet.QueryError):
                prophet.credentials()

    def test_prefixed_credentials_do_not_mix_with_legacy_credential_pair(self):
        with patch.dict('os.environ', {"PROPHET_API_AK_KEY": "new-ak", "API_SK_KEY": "old-sk"}, clear=True):
            with self.assertRaises(prophet.QueryError):
                prophet.credentials()

    def test_dashboard_user_follows_the_login_or_that_users_own_setting(self):
        with tempfile.TemporaryDirectory() as tmp:
            identity = Path(tmp) / "dashboard_user"
            with patch.dict(os.environ, {}, clear=False):
                os.environ.pop("PROPHET_DASHBOARD_USER", None)
                with patch.object(prophet.getpass, "getuser", return_value="wangyuxuan"):
                    self.assertEqual(prophet.dashboard_user(identity), "wangyuxuan")
                identity.write_text("alice\n")
                self.assertEqual(prophet.dashboard_user(identity), "alice")
            with patch.dict(os.environ, {"PROPHET_DASHBOARD_USER": "bob"}):
                self.assertEqual(prophet.dashboard_user(identity), "bob")


class QueryTests(unittest.TestCase):
    def test_resource_queries_cannot_post_to_job_mutation_routes(self):
        client=prophet.Client(get=lambda *a: {})
        with self.assertRaises(prophet.QueryError):
            client.post_query('v1/jobs', {}, {})

    def test_inventory_errors_do_not_hide_successful_task_queries(self):
        class Source:
            def list_jobs(self, project_id, status):
                return [job()] if status=='Running' else []
        class Resources:
            def refresh(self):
                return {'available':False,'complete':False,'nodes':[],'projects':[],'summary':None}
        data=prophet.SnapshotStore(Source(),{'CP':'p'},resource_store=Resources()).refresh()
        self.assertEqual(data['summary']['running_gpus'],8)
        self.assertFalse(data['complete'])
        self.assertIsNone(data['inventory']['summary'])
        self.assertFalse(data['capabilities']['pool_capacity'])

    def test_project_cli_retains_resource_failure_and_nonzero_exit(self):
        class Source:
            def list_jobs(self, project_id, status):
                return [job()] if status=='Running' else []
        class Resources:
            def __init__(self,*args):
                pass
            def refresh(self):
                return {'available':False,'complete':False,'nodes':[],
                        'projects':[{'name':'CP','available':False,'error':'资源权限不足'}],'summary':None}
        for extra in ([],['--json']):
            with self.subTest(extra=extra),patch('prophet.Client',return_value=Source()),patch('resources.ResourceStore',Resources),patch('sys.argv',['prophet-gpu','--project','CP',*extra]):
                output=io.StringIO()
                with redirect_stdout(output):rc=prophet.main()
                self.assertEqual(rc,1)
                if extra:
                    import json
                    self.assertFalse(json.loads(output.getvalue())['complete'])
                else:self.assertIn('资源权限不足',output.getvalue())

    def test_pagination_deduplicates_and_reads_past_full_page(self):
        def get(path, params):
            self.assertEqual(path, "v1/jobs")
            self.assertEqual(params["project_id"], "p")
            page = params["page"]
            rows = {1: [job("a"), job("b")], 2: [job("b"), job("c")]}[page]
            return {"context": {"status": 0}, "data": {"total": 4, "data": rows}}
        client = prophet.Client(get=get, page_size=2)
        self.assertEqual([j["id"] for j in client.list_jobs("p", "Running")], ["a", "b", "c"])

    def test_http_200_business_failure_is_not_empty_success(self):
        client = prophet.Client(get=lambda *a: {"context": {"status": 403, "message": "denied"}, "data": {}})
        with self.assertRaises(prophet.QueryError):
            client.list_jobs("p", "Running")

    def test_malformed_page_is_not_empty_success(self):
        client = prophet.Client(get=lambda *a: {"context": {"status": 0}, "data": {}})
        with self.assertRaises(prophet.QueryError):
            client.list_jobs("p", "Running")

    def test_repeated_full_page_fails_instead_of_looping(self):
        client = prophet.Client(get=lambda *a: {"data": {"data": [job()], "total": 99}}, page_size=1)
        with self.assertRaises(prophet.QueryError):
            client.list_jobs("p", "Running")

    def test_short_page_with_remaining_total_is_not_complete(self):
        for total in (2, 3):
            with self.subTest(total=total):
                client = prophet.Client(get=lambda *a: {"data": {"data": [job()], "total": total}}, page_size=2)
                with self.assertRaises(prophet.QueryError):
                    client.list_jobs("p", "Running")

    def test_partial_failure_preserves_previous_project_with_stale_flag(self):
        class Source:
            broken = False
            def list_jobs(self, project_id, status):
                if self.broken and project_id == "p":
                    raise prophet.QueryError("unavailable")
                return [job(project_id)] if status == "Running" else []
        source = Source()
        store = prophet.SnapshotStore(source, {"CP": "p", "CPE": "q"})
        initial = store.refresh()
        self.assertEqual(initial["summary"]["running_gpus"], 16)
        source.broken = True
        current = store.refresh()
        self.assertEqual(current["summary"]["running_gpus"], 16)
        self.assertTrue(current["projects"][0]["stale"])
        self.assertFalse(current["projects"][1]["stale"])
        self.assertTrue(current["jobs"][0]["stale"])
        self.assertEqual(current["projects"][0]["updated_at"], initial["projects"][0]["updated_at"])

    def test_first_failure_does_not_report_project_as_empty(self):
        class Source:
            def list_jobs(self, *args):
                raise prophet.QueryError("unavailable")
        data = prophet.SnapshotStore(Source(), {"CP": "p"}).refresh()
        self.assertFalse(data["projects"][0]["available"])
        self.assertFalse(data["complete"])

    def test_cli_failure_reports_unknown_instead_of_zero_gpus(self):
        data = {"checked_at": "now", "complete": False,
                "summary": prophet.summarize([]), "projects": [
                    {"name": "CP", "available": False, "error": "unavailable"}]}
        output = io.StringIO()
        with redirect_stdout(output):
            prophet.print_report(data, [])
        self.assertIn("未知", output.getvalue())
        self.assertNotIn("运行 0 任务 / 0 卡", output.getvalue())


if __name__ == "__main__":
    unittest.main()
