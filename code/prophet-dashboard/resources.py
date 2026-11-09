"""Project-scoped GPU inventory from Prophet's read-only resource query.

GPU counts describe resource allocation, not measured device utilization. Cached
snapshots retain their original values and carry stale flags after query failures.
"""

from collections import Counter
from copy import deepcopy
from datetime import datetime, timezone


class ResourceError(Exception):
    """A resource response could not be validated as a complete snapshot."""


def _integer(value):
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str):
        try:
            return int(value)
        except ValueError:
            pass
    return None


def _gpu(resource):
    """Return one GPU quantity and whether its two aliases agree."""
    if not isinstance(resource, dict):
        return None, False
    primary, alias = "nvidia.com/gpu", "accelerators"
    if primary in resource:
        value = _integer(resource[primary])
        matches = value is not None and (alias not in resource or _integer(resource[alias]) == value)
        return value, matches
    value = _integer(resource.get(alias))
    return value, alias not in resource or value is not None


def _normalize(row, project):
    if not isinstance(row, dict):
        raise ResourceError("资源节点格式异常")
    name, cluster = row.get("node_name"), row.get("cluster_name")
    if not isinstance(name, str) or not name or not isinstance(cluster, str) or not cluster:
        raise ResourceError("资源节点缺少名称或集群")
    capacity, capacity_alias = _gpu(row.get("capacity"))
    allocated, allocated_alias = _gpu(row.get("allocated", {}))
    free, free_alias = _gpu(row.get("available"))
    status = row.get("status") or {}
    properties = row.get("property") or {}
    if not isinstance(status, dict) or not isinstance(properties, dict):
        raise ResourceError("资源节点状态格式异常")
    consistent = (capacity_alias and allocated_alias and free_alias
                  and capacity is not None and free is not None
                  and 0 <= free <= capacity)
    if allocated is not None:
        consistent = (consistent and capacity is not None and free is not None
                      and 0 <= allocated <= capacity and capacity == allocated + free)
    status_name = status.get("info") if isinstance(status.get("info"), str) else "未知"
    synced = row.get("not_synced") is False
    return {
        "name": name, "cluster": cluster, "project": project, "projects": [project],
        "gpu_type": properties.get("machine_type") if isinstance(properties.get("machine_type"), str) else "未知",
        "total_gpus": capacity, "allocated_gpus": allocated, "free_gpus": free,
        "schedulable": bool(consistent and synced and status_name == "可调度"),
        "status": status_name,
        "reason": status.get("reason") if isinstance(status.get("reason"), str) else "",
        "consistent": bool(consistent), "not_synced": not synced, "stale": False,
    }


def summarize(nodes, missing_projects=0):
    """Aggregate deduplicated nodes; nullable totals never hide unknown values.

    known_* counters expose partial numeric sums when their corresponding total
    is null. Distribution and threshold counts include only schedulable nodes.
    Stale values remain visible, with stale_nodes indicating historical data.
    Missing projects make global GPU totals unknown; known_* sums and node
    counts still describe the successfully queried or cached subset.
    """
    result = {"total_nodes": len(nodes), "missing_projects": missing_projects,
              "stale_nodes": sum(n["stale"] for n in nodes),
              "unavailable_nodes": sum(not n["schedulable"] for n in nodes),
              "inconsistent_nodes": sum(not n["consistent"] for n in nodes)}
    for output, field in (("total_gpus", "total_gpus"), ("allocated_gpus", "allocated_gpus"),
                          ("raw_free_gpus", "free_gpus")):
        unknown = sum(n[field] is None for n in nodes)
        known = sum(n[field] for n in nodes if n[field] is not None)
        result[output] = None if unknown or missing_projects else known
        result["known_" + output] = known
        result["unknown_" + output + "_nodes"] = unknown
    available = [n for n in nodes if n["schedulable"]]
    result["schedulable_nodes"] = len(available)
    known_schedulable = sum(n["free_gpus"] for n in available)
    result["known_schedulable_free_gpus"] = known_schedulable
    result["schedulable_free_gpus"] = None if missing_projects else known_schedulable
    result["full_free_8_nodes"] = sum(n["total_gpus"] == 8 and n["free_gpus"] == 8 for n in available)
    for threshold in (8, 4, 2, 1):
        result[f"at_least_{threshold}_nodes"] = sum(n["free_gpus"] >= threshold for n in available)
    distribution = Counter(n["free_gpus"] for n in available)
    result["free_distribution"] = {str(k): distribution[k] for k in sorted(distribution)}
    return result


class ResourceStore:
    """Validate all project pages before replacing that project's success cache."""

    def __init__(self, client, projects):
        self.client = client
        self.projects = dict(projects)
        self._cache = {}

    def _query_project(self, project, project_id):
        nodes, seen, expected_total = [], set(), None
        for page in range(1, 201):
            payload = self.client.post_query("v4/management/accessory/find",
                                             {"project_id": project_id, "page": page, "count": 100}, {})
            if not isinstance(payload, dict):
                raise ResourceError("资源响应格式异常")
            context, data = payload.get("context"), payload.get("data")
            if not isinstance(context, dict) or context.get("status") not in (0, 200):
                raise ResourceError("资源查询业务错误")
            if not isinstance(data, dict) or not isinstance(data.get("nodes"), list):
                raise ResourceError("资源响应缺少节点列表")
            count = _integer(data.get("count"))
            if count is None or count < 0:
                raise ResourceError("资源响应缺少有效节点总数")
            if expected_total is None:
                expected_total = count
            elif count != expected_total:
                raise ResourceError("资源分页期间节点总数变化")
            rows = data["nodes"]
            expected_page = min(100, max(0, expected_total - (page - 1) * 100))
            if len(rows) != expected_page:
                raise ResourceError("资源分页条数与节点总数不符")
            for row in rows:
                node = _normalize(row, project)
                key = node["cluster"], node["name"]
                if key in seen:
                    raise ResourceError("资源分页包含重复节点")
                seen.add(key)
                nodes.append(node)
            if len(nodes) == expected_total:
                return nodes
        raise ResourceError("资源分页超过查询上限")

    def refresh(self):
        checked_at = datetime.now(timezone.utc).isoformat()
        projects, merged = [], {}
        all_current, any_available = True, False
        compare = ("gpu_type", "total_gpus", "allocated_gpus", "free_gpus", "status", "reason", "not_synced")
        for project, project_id in self.projects.items():
            error = None
            try:
                nodes = self._query_project(project, project_id)
            except Exception as exc:
                all_current = False
                # External exceptions may contain credentials or raw response bodies.
                error = str(exc) if isinstance(exc, ResourceError) else f"资源查询失败（{type(exc).__name__}）"
            else:
                self._cache[project] = {"nodes": nodes, "updated_at": checked_at}
            cached = self._cache.get(project)
            has_cache = cached is not None
            stale = error is not None and has_cache
            any_available = any_available or has_cache
            projects.append({"name": project, "id": project_id, "available": has_cache,
                             "stale": stale, "updated_at": cached["updated_at"] if has_cache else None,
                             "error": error})
            for node in deepcopy(cached["nodes"] if has_cache else []):
                node["stale"] = stale
                key = node["cluster"], node["name"]
                if key not in merged:
                    merged[key] = node
                    continue
                previous = merged[key]
                previous["projects"].append(project)
                # A current observation supersedes historical values from any
                # other project. Only observations of the same freshness can
                # establish a conflicting view of this physical node.
                if previous["stale"] and not stale:
                    node["projects"] = previous["projects"]
                    node["project"] = previous["project"]
                    merged[key] = node
                    continue
                if not previous["stale"] and stale:
                    continue
                if any(previous[field] != node[field] for field in compare) or not node["consistent"]:
                    previous["consistent"] = False
                    previous["schedulable"] = False
        nodes = list(merged.values())
        return {"available": any_available, "complete": all_current and bool(self.projects),
                "checked_at": checked_at, "projects": projects, "nodes": nodes,
                "summary": summarize(nodes, sum(not p["available"] for p in projects)) if any_available else None}
