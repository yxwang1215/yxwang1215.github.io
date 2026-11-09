import copy
import unittest

try:
    import resources
except ModuleNotFoundError:
    resources = None


def node(name="n1", free=8, total=8, allocated=0, status="可调度", **changes):
    row = {
        "node_name": name, "cluster_name": "c1", "node_type": "hosting",
        "not_synced": False, "capacity": {"nvidia.com/gpu": total, "accelerators": total},
        "available": {"nvidia.com/gpu": free, "accelerators": free},
        "allocated": {} if allocated is None else {"nvidia.com/gpu": allocated, "accelerators": allocated},
        "status": {"info": status, "reason": ""}, "usage": "owned", "utilization": "99.9",
        "consumption": "10.2", "tasks": None, "role": "worker",
        "property": {"machine_type": "A800-80G-基础版", "type": "GPU", "private_for": "pool"},
    }
    row.update(changes)
    return row


def payload(rows, count=None):
    return {"context": {"status": 0}, "data": {"nodes": rows, "count": len(rows) if count is None else count}}


class Source:
    def __init__(self, rows):
        self.rows = rows
        self.broken = set()

    def post_query(self, path, params, body):
        if path != "v4/management/accessory/find" or body != {} or params["count"] != 100:
            raise AssertionError("Unexpected query contract")
        pid = params["project_id"]
        if pid in self.broken:
            raise RuntimeError("credentials and unsafe error content must stay private")
        rows = self.rows[pid]
        start = (params["page"] - 1) * params["count"]
        return payload(copy.deepcopy(rows[start:start + params["count"]]), len(rows))


class ResourceTests(unittest.TestCase):
    def setUp(self):
        self.assertIsNotNone(resources, "ResourceStore is not implemented")

    def store(self, rows):
        return resources.ResourceStore(Source({"p": rows}), {"POOL": "p"})

    def test_exact_free_distribution_and_threshold_counts(self):
        result = self.store([node(str(f), f, allocated=8-f) for f in (0, 1, 4, 6, 8)]).refresh()
        self.assertTrue(result["available"])
        self.assertTrue(result["complete"])
        summary = result["summary"]
        self.assertEqual(summary["total_gpus"], 40)
        self.assertEqual(summary["allocated_gpus"], 21)
        self.assertEqual(summary["raw_free_gpus"], 19)
        self.assertEqual(summary["schedulable_free_gpus"], 19)
        self.assertEqual(summary["free_distribution"], {"0": 1, "1": 1, "4": 1, "6": 1, "8": 1})
        self.assertEqual([summary[k] for k in ("full_free_8_nodes", "at_least_8_nodes", "at_least_4_nodes", "at_least_2_nodes", "at_least_1_nodes")], [1, 1, 3, 3, 4])

    def test_maintenance_unschedulable_and_unsynced_are_excluded(self):
        rows = [node("healthy"), node("maintenance", status="维修中"),
                node("cordoned", status="不可调度"), node("unsynced", not_synced=True)]
        result = self.store(rows).refresh()
        self.assertEqual(result["summary"]["raw_free_gpus"], 32)
        self.assertEqual(result["summary"]["schedulable_free_gpus"], 8)
        self.assertEqual(result["summary"]["unavailable_nodes"], 3)

    def test_inconsistent_allocation_preserves_raw_numbers(self):
        result = self.store([node("over", free=0, total=7, allocated=8),
                             node("bad-sum", free=4, allocated=2)]).refresh()
        self.assertEqual(result["summary"]["inconsistent_nodes"], 2)
        self.assertEqual(result["summary"]["schedulable_free_gpus"], 0)
        self.assertEqual(result["nodes"][0]["allocated_gpus"], 8)
        self.assertEqual(result["nodes"][0]["total_gpus"], 7)

    def test_missing_allocated_is_unknown_but_can_be_schedulable(self):
        result = self.store([node(free=8, allocated=None)]).refresh()
        self.assertIsNone(result["summary"]["allocated_gpus"])
        self.assertIsNone(result["nodes"][0]["allocated_gpus"])
        self.assertTrue(result["nodes"][0]["consistent"])
        self.assertTrue(result["nodes"][0]["schedulable"])
        self.assertEqual(result["summary"]["schedulable_free_gpus"], 8)

    def test_missing_gpu_is_unknown_and_does_not_become_zero(self):
        result = self.store([node(capacity={}, available={}, allocated={})]).refresh()
        self.assertIsNone(result["summary"]["total_gpus"])
        self.assertIsNone(result["summary"]["raw_free_gpus"])
        self.assertFalse(result["nodes"][0]["schedulable"])
        self.assertIsNone(result["nodes"][0]["free_gpus"])

    def test_alias_fallback_does_not_double_count_and_conflict_is_rejected(self):
        fallback = node("fallback", capacity={"accelerators": 8}, available={"accelerators": 4}, allocated=4)
        fallback["allocated"] = {"accelerators": 4}
        conflict = node("conflict", capacity={"nvidia.com/gpu": 8, "accelerators": 16})
        result = self.store([fallback, conflict]).refresh()
        self.assertEqual(result["summary"]["total_gpus"], 16)
        self.assertEqual(result["summary"]["schedulable_free_gpus"], 4)
        self.assertEqual(result["summary"]["inconsistent_nodes"], 1)

    def test_malformed_present_allocated_is_not_treated_as_absent(self):
        bad = node()
        bad["allocated"] = {"nvidia.com/gpu": "invalid"}
        result = self.store([bad]).refresh()
        self.assertFalse(result["nodes"][0]["consistent"])
        self.assertFalse(result["nodes"][0]["schedulable"])
        self.assertIsNone(result["nodes"][0]["allocated_gpus"])

    def test_pages_are_combined_only_after_complete_validation(self):
        rows = [node(str(i)) for i in range(101)]
        result = self.store(rows).refresh()
        self.assertEqual(len(result["nodes"]), 101)
        self.assertEqual(result["summary"]["total_gpus"], 808)

    def test_incomplete_and_duplicate_pages_keep_previous_snapshot(self):
        source = Source({"p": [node("old")]})
        store = resources.ResourceStore(source, {"POOL": "p"})
        first = store.refresh()
        cases = [payload([node("new")], 101),
                 {"context": {"status": 403}, "data": {}},
                 {"context": {"status": 0}, "data": {"count": 0}},
                 payload([node("duplicate") for _ in range(100)], 101)]
        for bad in cases:
            with self.subTest(bad=bad["data"].get("count")):
                source.post_query = lambda *args: bad
                current = store.refresh()
                self.assertFalse(current["complete"])
                self.assertTrue(current["nodes"][0]["stale"])
                self.assertEqual(current["nodes"][0]["name"], "old")
                self.assertEqual(current["projects"][0]["updated_at"], first["projects"][0]["updated_at"])

    def test_repeated_node_across_pages_fails_without_publishing_partial_data(self):
        class Duplicated(Source):
            def post_query(self, path, params, body):
                return payload([node(str(i)) for i in range(100)] if params["page"] == 1 else [node("99")], 101)
        result = resources.ResourceStore(Duplicated({}), {"POOL": "p"}).refresh()
        self.assertFalse(result["available"])
        self.assertIsNone(result["summary"])

    def test_shared_physical_node_is_counted_once_and_sources_are_retained(self):
        source = Source({"p": [node()], "q": [node()]})
        result = resources.ResourceStore(source, {"ONE": "p", "TWO": "q"}).refresh()
        self.assertEqual(len(result["nodes"]), 1)
        self.assertEqual(result["nodes"][0]["projects"], ["ONE", "TWO"])
        self.assertEqual(result["summary"]["total_gpus"], 8)

    def test_conflicting_shared_node_is_not_schedulable(self):
        source = Source({"p": [node()], "q": [node(free=4, allocated=4)]})
        result = resources.ResourceStore(source, {"ONE": "p", "TWO": "q"}).refresh()
        self.assertEqual(len(result["nodes"]), 1)
        self.assertFalse(result["nodes"][0]["consistent"])
        self.assertFalse(result["nodes"][0]["schedulable"])
        self.assertEqual(result["summary"]["inconsistent_nodes"], 1)

    def test_fresh_shared_node_overrides_stale_source_in_either_project_order(self):
        for projects in ({"CP": "p", "CPE": "q"}, {"CPE": "q", "CP": "p"}):
            with self.subTest(projects=list(projects)):
                source = Source({"p": [node()], "q": [node()]})
                store = resources.ResourceStore(source, projects)
                store.refresh()
                source.broken.add("p")
                source.rows["q"] = [node(free=4, allocated=4)]
                result = store.refresh()
                current = result["nodes"][0]
                self.assertEqual(current["free_gpus"], 4)
                self.assertFalse(current["stale"])
                self.assertTrue(current["consistent"])
                self.assertTrue(current["schedulable"])
                self.assertEqual(set(current["projects"]), {"CP", "CPE"})
                self.assertFalse(result["complete"])
                statuses = {p["name"]: p for p in result["projects"]}
                self.assertTrue(statuses["CP"]["stale"])
                self.assertFalse(statuses["CPE"]["stale"])
                self.assertEqual(result["summary"]["schedulable_free_gpus"], 4)

    def test_failure_cache_is_stale_and_first_failure_is_not_zero(self):
        source = Source({"p": [node()]})
        store = resources.ResourceStore(source, {"POOL": "p"})
        source.broken.add("p")
        failed = store.refresh()
        self.assertFalse(failed["available"])
        self.assertIsNone(failed["summary"])
        self.assertNotIn("credentials", failed["projects"][0]["error"])
        source.broken.clear()
        first = store.refresh()
        source.broken.add("p")
        cached = store.refresh()
        self.assertTrue(cached["available"])
        self.assertFalse(cached["complete"])
        self.assertTrue(cached["projects"][0]["stale"])
        self.assertEqual(cached["summary"]["raw_free_gpus"], 8)
        self.assertEqual(cached["projects"][0]["updated_at"], first["projects"][0]["updated_at"])
        source.broken.clear()
        self.assertFalse(store.refresh()["nodes"][0]["stale"])

    def test_first_failure_of_one_project_makes_global_totals_unknown(self):
        source = Source({"p": [node(free=4, allocated=4)], "q": [node("other")]})
        source.broken.add("q")
        result = resources.ResourceStore(source, {"ONE": "p", "TWO": "q"}).refresh()
        self.assertTrue(result["available"])
        self.assertFalse(result["complete"])
        summary = result["summary"]
        self.assertEqual(summary.get("missing_projects"), 1)
        for field in ("total_gpus", "allocated_gpus", "raw_free_gpus", "schedulable_free_gpus"):
            self.assertIsNone(summary[field])
        self.assertEqual(summary["known_total_gpus"], 8)
        self.assertEqual(summary["known_allocated_gpus"], 4)
        self.assertEqual(summary["known_raw_free_gpus"], 4)
        self.assertEqual(summary["known_schedulable_free_gpus"], 4)
        self.assertEqual(summary["free_distribution"], {"4": 1})

    def test_returned_snapshot_cannot_mutate_success_cache(self):
        source = Source({"p": [node()]})
        store = resources.ResourceStore(source, {"POOL": "p"})
        first = store.refresh()
        first["nodes"][0]["free_gpus"] = 999
        source.broken.add("p")
        self.assertEqual(store.refresh()["nodes"][0]["free_gpus"], 8)


if __name__ == "__main__":
    unittest.main()
