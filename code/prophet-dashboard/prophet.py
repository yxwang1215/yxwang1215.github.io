#!/usr/bin/env python3
"""Read-only Prophet queries, snapshots, and a small terminal interface."""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import importlib.util
import getpass
import json
import os
from pathlib import Path
import threading
import time

import requests

PROJECTS = {"CP": "66557bf295d868bcde9b7665", "CPE": "6698b726418dbe9557b8000b",
            "ZhinaoRD2_A800": "69425d2187603586a0830c41"}
PROJECT_LABELS = {"CP": ("H800（CP）", "zhinaord2_h800"),
                  "CPE": ("A100（CPE）", "zhinaord2_a100"),
                  "ZhinaoRD2_A800": ("A800", "zhinaord2_a800")}
BASE = "https://prophet.qihoo.net/production-api/backend/notebook/"
STATUSES = ("Running", "Pending")
FINISHED_STATUS = "Succeeded"
FINISHED_STATUSES = ("Succeeded", "Failed", "Interrupted")
FINISHED_WINDOW_SECONDS = 48 * 3600
FINISHED_PAGE_CAP = 15
FINISHED_EMPTY_PAGE_STOP = 4


class QueryError(RuntimeError):
    pass


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def integer(value):
    try:
        number = int(str(value))
        return number if number >= 0 else None
    except (ValueError, TypeError):
        return None


def epoch_seconds(value):
    number = integer(value)
    if number is None or number <= 0:
        return None
    return number // 1000 if number > 10_000_000_000 else number


def normalize_job(raw, project):
    resource = raw.get("resource") or {}
    nodes, per_node = integer(resource.get("count")), integer(resource.get("gpu"))
    return {
        "id": str(raw.get("id") or ""), "name": str(raw.get("name") or ""),
        "project": project, "status": str(raw.get("status") or "Unknown"),
        "user": str(raw.get("creator_name") or "unknown"),
        "display_name": str(raw.get("creator_display_name") or ""),
        "priority": str(raw.get("priority") or "—"),
        "gpu_type": str(resource.get("resource_type") or "未知"),
        "nodes": nodes, "gpus_per_node": per_node,
        "gpus": nodes * per_node if nodes is not None and per_node is not None else None,
        "created_at": integer(raw.get("create_time")),
        "started_at": integer(raw.get("start_time")),
        "ended_at": epoch_seconds(raw.get("end_time")),
        "duration_seconds": integer(raw.get("duration")),
        "cluster": str(raw.get("cluster") or ""), "stale": False,
    }


def summarize(jobs):
    result = {"running_jobs": 0, "pending_jobs": 0, "running_gpus": 0,
              "pending_gpus": 0, "unknown_gpu_jobs": 0}
    for j in jobs:
        kind = {"Running": "running", "Pending": "pending"}.get(j["status"])
        if kind:
            result[kind + "_jobs"] += 1
            if j["gpus"] is None:
                result["unknown_gpu_jobs"] += 1
            else:
                result[kind + "_gpus"] += j["gpus"]
    return result


def dashboard_user(identity_path=None):
    """Prophet name for “mine”. Each user sets their own; login name is the fallback."""
    chosen = os.environ.get("PROPHET_DASHBOARD_USER", "").strip()
    if chosen:
        return chosen
    path = Path(identity_path) if identity_path is not None else (
        Path(__file__).resolve().parent / ".runtime" / str(os.getuid()) / "dashboard_user")
    try:
        saved = path.read_text().strip()
    except OSError:
        saved = ""
    return saved or getpass.getuser()


def credentials():
    for ak_name, sk_name in (("PROPHET_API_AK_KEY", "PROPHET_API_SK_KEY"), ("API_AK_KEY", "API_SK_KEY")):
        ak, sk = os.environ.get(ak_name), os.environ.get(sk_name)
        if ak or sk:
            if not (ak and sk):
                raise QueryError(f"请成对提供 {ak_name} / {sk_name}，避免混用不同账号的凭据")
            return {"ak": ak, "sk": sk}
    # Reuse the current user's existing provider without depending on the code's location.
    helper_path = Path(os.environ.get("PROPHET_HELPER", Path.home() / "coding_security_train/submit_prophet.py"))
    if not helper_path.is_file():
        raise QueryError("请设置 PROPHET_API_AK_KEY / PROPHET_API_SK_KEY，或用 PROPHET_HELPER 指定自己的认证模块")
    spec = importlib.util.spec_from_file_location("dashboard_prophet_auth", helper_path)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    return helper.make_prophet_headers()


class Client:
    def __init__(self, get=None, page_size=100):
        self.page_size = page_size
        self._headers = credentials() if get is None else None
        self.get = get or self._get
        self.last_progress = time.monotonic()

    def _get(self, path, params):
        try:
            with requests.Session() as session:
                session.trust_env = False
                response = session.get(BASE + path, params=params, headers=self._headers,
                                       timeout=(5, 20), allow_redirects=False)
                if response.status_code != 200:
                    raise QueryError(f"Prophet HTTP {response.status_code}")
                return response.json()
        except (requests.RequestException, ValueError) as exc:
            # Do not include request headers, bodies, or raw exception text in the API.
            raise QueryError(f"Prophet 查询失败（{type(exc).__name__}）") from None

    def post_query(self, path, params, body):
        # This POST endpoint only reads the project's node resource inventory.
        if path != 'v4/management/accessory/find':
            raise QueryError('不支持的资源查询路径')
        self.last_progress = time.monotonic()
        try:
            with requests.Session() as session:
                session.trust_env = False
                response = session.post(BASE + path, params=params, json=body, headers=self._headers,
                                        timeout=(5, 20), allow_redirects=False)
                if response.status_code != 200:
                    raise QueryError(f"Prophet 资源查询 HTTP {response.status_code}")
                return response.json()
        except (requests.RequestException, ValueError) as exc:
            raise QueryError(f"Prophet 资源查询失败（{type(exc).__name__}）") from None
        finally:
            self.last_progress = time.monotonic()

    def list_jobs(self, project_id, status):
        rows, seen = [], set()
        for page in range(1, 201):
            self.last_progress = time.monotonic()
            try:
                payload = self.get("v1/jobs", {"project_id": project_id, "page": page,
                                   "page_size": self.page_size, "filter_status": status})
            finally:
                self.last_progress = time.monotonic()
            if not isinstance(payload, dict):
                raise QueryError("Prophet 响应格式异常")
            context = payload.get("context") or {}
            if context.get("status", 0) not in (0, 200):
                raise QueryError(f"Prophet 业务错误（{context.get('status')}）")
            data = payload.get("data")
            if not isinstance(data, dict) or not isinstance(data.get("data"), list):
                raise QueryError("Prophet 返回缺少任务列表")
            batch = data["data"]
            before = len(seen)
            for row in batch:
                if not isinstance(row, dict) or not row.get("id"):
                    raise QueryError("Prophet 任务缺少 ID")
                if row["id"] not in seen:
                    seen.add(row["id"])
                    rows.append(row)
            if batch and len(seen) == before:
                raise QueryError("Prophet 分页重复；本次结果未完成")
            total = integer(data.get("total"))
            expected = min(self.page_size, max(0, total - (page - 1) * self.page_size)) if total is not None else 0
            if len(batch) < expected:
                raise QueryError("Prophet 返回的分页少于声明的任务数；本次结果未完成")
            if len(batch) < self.page_size or (total is not None and page * self.page_size >= total):
                return rows
        raise QueryError("Prophet 任务分页超出限制")

    def list_recent_finished(self, project_id, since, status=None):
        status = status or FINISHED_STATUS
        # Succeeded history is not strictly time-sorted, but recent completions
        # cluster near the front. Stop after several pages with nothing in window.
        rows, seen, empty_run = [], set(), 0
        for page in range(1, FINISHED_PAGE_CAP + 1):
            self.last_progress = time.monotonic()
            try:
                payload = self.get("v1/jobs", {"project_id": project_id, "page": page,
                                   "page_size": self.page_size, "filter_status": status})
            finally:
                self.last_progress = time.monotonic()
            if not isinstance(payload, dict):
                raise QueryError("Prophet 响应格式异常")
            context = payload.get("context") or {}
            if context.get("status", 0) not in (0, 200):
                raise QueryError(f"Prophet 业务错误（{context.get('status')}）")
            data = payload.get("data")
            if not isinstance(data, dict) or not isinstance(data.get("data"), list):
                raise QueryError("Prophet 返回缺少任务列表")
            batch = data["data"]
            if not batch:
                return rows
            kept = 0
            for row in batch:
                if not isinstance(row, dict) or not row.get("id"):
                    raise QueryError("Prophet 任务缺少 ID")
                ended = epoch_seconds(row.get("end_time"))
                if ended is not None and ended >= since and row["id"] not in seen:
                    seen.add(row["id"])
                    rows.append(row)
                    kept += 1
            empty_run = 0 if kept else empty_run + 1
            if empty_run >= FINISHED_EMPTY_PAGE_STOP:
                return rows
            total = integer(data.get("total"))
            if len(batch) < self.page_size or (total is not None and page * self.page_size >= total):
                return rows
        return rows


class SnapshotStore:
    def __init__(self, client, projects=None, resource_store=None):
        self.client = client
        self.projects = dict(PROJECTS if projects is None else projects)
        self.resource_store = resource_store
        self.lock = threading.Lock()
        self.refresh_lock = threading.Lock()
        self.snapshot = None

    def read(self):
        with self.lock:
            return self.snapshot

    def refresh(self):
        with self.refresh_lock:
            return self._refresh()

    def _refresh(self):
        previous = self.read() or {"jobs": [], "projects": [], "finished": []}
        previous_projects = {p["name"]: p for p in previous["projects"]}

        def previous_finished(name):
            return [dict(j, stale=True) for j in previous.get("finished", []) if j.get("project") == name]

        def collect(item):
            name, project_id = item
            finished = []
            try:
                # Commit only complete per-project snapshots, including both states.
                dedup = {}
                for status in STATUSES:
                    for raw in self.client.list_jobs(project_id, status):
                        dedup[raw["id"]] = normalize_job(raw, name)
                rows = list(dedup.values())
                if hasattr(self.client, "list_recent_finished"):
                    since = int(time.time()) - FINISHED_WINDOW_SECONDS
                    seen_ids = set()
                    for status in FINISHED_STATUSES:
                        try:
                            for raw in self.client.list_recent_finished(project_id, since, status):
                                row = normalize_job(raw, name)
                                if row["ended_at"] is None or row["ended_at"] < since or row["id"] in seen_ids:
                                    continue
                                seen_ids.add(row["id"])
                                finished.append(row)
                        except Exception:
                            for old in previous_finished(name):
                                if old.get("status") == status and old.get("id") not in seen_ids:
                                    seen_ids.add(old["id"])
                                    finished.append(old)
                project = {"name": name, "id": project_id, "available": True,
                           "stale": False, "updated_at": now(), "error": None}
            except Exception as exc:
                rows = [dict(j, stale=True) for j in previous["jobs"] if j["project"] == name]
                finished = previous_finished(name)
                old = previous_projects.get(name, {})
                project = {"name": name, "id": project_id, "available": old.get("available", False),
                           "stale": True, "updated_at": old.get("updated_at"),
                           "error": str(exc) if isinstance(exc, QueryError) else f"查询异常（{type(exc).__name__}）"}
            project["summary"] = summarize(rows)
            project["label"], project["platform_name"] = PROJECT_LABELS.get(name, (name, name))
            return project, rows, finished

        projects, jobs, finished = [], [], []
        with ThreadPoolExecutor(max_workers=3) as executor:
            for project, rows, done in executor.map(collect, self.projects.items()):
                projects.append(project)
                jobs.extend(rows)
                finished.extend(done)
        jobs.sort(key=lambda j: (j["status"] != "Running", -(j["gpus"] or 0), j["id"]))
        snapshot = {"checked_at": now(), "complete": all(not p["stale"] for p in projects),
                    "scope": "当前认证账号可见的三个项目的 Running / Pending 训练任务；finished 为最近 48 小时成功、失败或中断的任务，不计入占卡",
                    "default_user": dashboard_user(),
                    "capabilities": {"pool_capacity": False, "gpu_utilization": False},
                    "projects": projects, "jobs": jobs, "finished": finished,
                    "summary": summarize(jobs)}
        if self.resource_store is not None:
            inventory = self.resource_store.refresh()
            snapshot['inventory'] = inventory
            snapshot['capabilities']['pool_capacity'] = inventory['available']
            snapshot['complete'] = snapshot['complete'] and inventory['complete']
        with self.lock:
            self.snapshot = snapshot
        return snapshot


def print_report(data, rows):
    s = data["summary"]
    print(f"Prophet  {data['checked_at']}")
    if not any(p["available"] for p in data["projects"]):
        print("查询失败：运行与排队任务数、GPU 数量均未知。")
    else:
        if not data["complete"]:
            print("部分项目查询失败，以下仅含可用数据。")
        print(f"运行 {s['running_jobs']} 任务 / {s['running_gpus']} 卡；"
              f"排队 {s['pending_jobs']} 任务 / 申请 {s['pending_gpus']} 卡")
    print("项目对应：CP = H800（zhinaord2_h800）；CPE = A100（zhinaord2_a100）；ZhinaoRD2_A800 = A800")
    print(f"{'PROJECT':<17} {'USER':<17} {'STATE':<9} {'GPUS':>4} {'NODES':>5}  NAME")
    for j in rows:
        print(f"{j['project']:<17} {j['user']:<17} {j['status']:<9} {str(j['gpus'] if j['gpus'] is not None else '?'):>4} "
              f"{str(j['nodes']):>5}  {j['name']}")
    if s['unknown_gpu_jobs']:
        print(f"另有 {s['unknown_gpu_jobs']} 个任务卡数未知，合计仅包含已知卡数。")
    inventory=data.get('inventory')
    if inventory and inventory.get('summary'):
        r=inventory['summary']
        print(f"资源池可调度空闲：{r.get('schedulable_free_gpus')} 卡；"
              f"单机至少空闲 8卡 {r.get('at_least_8_nodes')} 台 · "
              f"4卡 {r.get('at_least_4_nodes')} 台 · "
              f"2卡 {r.get('at_least_2_nodes')} 台")
    if inventory:
        for project in inventory.get('projects',[]):
            if project.get('error'):
                print(f"资源查询失败 {project['name']}: {project['error']}")
    print("口径：任务占卡为节点数 × 每节点 GPU 数；资源空闲按项目关联节点的未分配卡统计，实时利用率未接入。")
    for p in data["projects"]:
        if p["error"]:
            print(f"查询失败 {p['name']}: {p['error']}")


def main():
    parser = argparse.ArgumentParser(description="直接查询 Prophet 训练任务占卡情况")
    parser.add_argument("--json", action="store_true", help="输出 JSON 快照")
    parser.add_argument("--user", help="用户名精确匹配")
    parser.add_argument("--mine", action="store_true", help="只看自己的任务")
    parser.add_argument("--project", choices=list(PROJECTS))
    args = parser.parse_args()
    try:
        from resources import ResourceStore
        client=Client()
        projects={args.project:PROJECTS[args.project]} if args.project else PROJECTS
        data = SnapshotStore(client,projects,ResourceStore(client,projects)).refresh()
    except QueryError as exc:
        parser.exit(1, str(exc) + "\n")
    user = data["default_user"] if args.mine else args.user
    rows = [j for j in data["jobs"] if (not user or j["user"] == user)
            and (not args.project or j["project"] == args.project)]
    data["jobs"], data["summary"] = rows, summarize(rows)
    if args.project:
        data["projects"] = [p for p in data["projects"] if p["name"] == args.project]
        data["complete"] = all(not p["stale"] for p in data["projects"]) and data.get('inventory',{}).get('complete',True)
    if args.json:
        print(json.dumps(data, ensure_ascii=False, indent=2))
    else:
        print_report(data, rows)
    return 0 if data["complete"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
