# Prophet 本机 GPU 查询

直接从本机查询 Prophet 的训练任务，提供自动刷新的仪表盘和终端命令。程序只执行查询，不提交、取消或修改 Prophet 任务。

## 共享安装位置

真实目录为 `/home/jovyan/zhaoguangxiang-data-zzzc/prophet_dashboard/`，与各用户目录同级。目录属组为 `jovyan`，权限为 `2775`；源码允许该组读写，新增文件继承该组。其他用户可以从这个共享路径直接运行，不必访问 wangyuxuan 的私有目录。

2026-10-15 从 `wangyuxuan/tools/prophet_dashboard/` 迁移至此，原路径保留软链接；`wangyuxuan/prophet_dashboard/` 也链接到此目录。原有终端命令与 18765 端口继续有效。源码、测试、静态资源及历史运行日志均已保留。

代码共享，凭据由各用户自行提供。运行文件按 UID 保存在 `.runtime/<uid>/`，各用户的 PID、锁和日志互不覆盖。其他用户不要抢 18765，直接运行 `python3 monitor.py`：脚本按当前 UID 在 20000–27999 选一个固定端口，用该用户自己的 Prophet 凭据启动实时监控。

## 打开仪表盘

服务默认地址：<http://127.0.0.1:18765>。在 VS Code / Cursor 的「端口」面板转发 **18765**，点击转发后的地址。

也可以在个人电脑运行：

```bash
ssh -N -L 18765:127.0.0.1:18765 kkt
```

随后在个人电脑打开 <http://127.0.0.1:18765>。如果 `kkt` 不是你的 SSH 别名，请替换成连接这台机器时使用的主机名。

页面支持项目、GPU 型号、用户名、状态、任务名 / ID / 卡型筛选。「只看我的」默认是启动服务的登录名。Prophet 用户名不同时，用 `python3 monitor.py --user 名字` 或环境变量 `PROPHET_DASHBOARD_USER` 指定，这个设置只写在该用户自己的运行目录里。GPU 型号、项目分布和用户排行可以点击筛选；CSV / JSON 导出遵循当前筛选。

“节点空闲卡”独立展示空闲单卡合计、整台空闲 8 卡节点数、同节点至少空闲 4 / 2 卡节点数，以及恰好剩余 1 卡节点数。分布表显示各节点恰好剩余 8、6、4、2、1 等卡数的台数；展开后可查看每台节点。4 / 2 卡阈值包含更大空闲节点，分布表的“余4卡”则只计恰好剩4卡的节点。

资源统计只随项目和 GPU 型号筛选，不随任务用户名、状态、搜索条件变化。JSON 导出同时保留资源节点、可用性与过期信息，任务 CSV 仍只导出任务。

## 终端查询

```bash
prophet-gpu
prophet-gpu --mine
prophet-gpu --project ZhinaoRD2_A800
prophet-gpu --user wangyuxuan6 --json
```

wangyuxuan 的入口在 `~/.local/bin/`。其他用户可在共享目录运行 `python3 prophet.py`；也可以在自己的 `~/.local/bin/` 创建入口链接。

## 服务管理

给别人用时，把这一条交给对方即可。对方用自己的账号执行，看到的是自己的凭据、端口和「只看我的」：

```bash
python3 /home/jovyan/zhaoguangxiang-data-zzzc/prophet_dashboard/monitor.py
python3 /home/jovyan/zhaoguangxiang-data-zzzc/prophet_dashboard/monitor.py status
python3 /home/jovyan/zhaoguangxiang-data-zzzc/prophet_dashboard/monitor.py stop
python3 /home/jovyan/zhaoguangxiang-data-zzzc/prophet_dashboard/monitor.py watch
python3 /home/jovyan/zhaoguangxiang-data-zzzc/prophet_dashboard/monitor.py --user prophet用户名
```

`start` 是默认动作，后台每 60 秒刷新网页。`watch` 在终端里按同样间隔打印占卡和空闲，不另开端口。网页地址会打印出来，在 Cursor 端口面板转发该端口，或 `ssh -N -L <端口>:127.0.0.1:<端口> kkt`。

已有入口仍可用：`prophet-dashboard start` / `status` / `stop`，或 `python3 run.py start`。这些默认占用 18765，适合原来那一个服务。前台调试：`python3 server.py --port 18765`（先停止后台服务）。修改代码后需停止再启动。

后台服务独立于终端会话存活，每 60 秒查询一次 Prophet；浏览器每 5 秒读取本机缓存。手动刷新有 10 秒限流。监督进程每 15 秒检查服务和采集线程；进程退出或本机健康连续异常时自动重启，最多连续恢复 3 次，有退避。上游接口故障保留上次数据，按正常刷新周期重试，不重启任务、不调用模型。本程序不自动通知或唤醒模型。

### 自动启动

kkt 当前为 docker-init 容器环境，没有可用的用户 systemd。已为 wangyuxuan 配置用户 cron：`@reboot` 加每分钟执行一次 `autostart.py`，无需登录后手动启动。每分钟的检查只读取容器启动身份；同一次启动确认服务就绪后，不再探测或拉起服务，保留人工停止和监督进程有限恢复的行为。

容器重启后，启动身份改变，脚本会自动运行 `run.py start`。失败最多启动 3 次，间隔至少 60 / 180 秒；首次数据就绪有 10 分钟宽限，不会为等待采集而反复启动。PID、UID、父子关系和真实健康数据都需要核验。单独 `@reboot` 在本环境可能被残留的 cron 标志跳过，因此保留每分钟轻量检查。没有模型定时调用。

启动状态为 `.runtime/2071/boot.json`，启动错误日志为 `.runtime/2071/autostart.log`。`crontab -l` 可查看两条带 `prophet-dashboard-autostart` 标记的启动项；修改前的用户 crontab 已备份在私有运行目录。其他用户需要自行配置自己的 cron 与空闲端口。

此配置覆盖保留容器的重启；如果平台销毁并重建容器，用户 crontab 可能丢失，需要重新安装启动项或由平台提供持久启动钩子。未为验收而重启共享机器或容器。

慢查询按分页进展判断：请求连接 / 读取超时分别为 5 / 20 秒；采集过程中超过 90 秒没有分页进展才视为停滞，不限制整轮分页总时长。JSON 导出保留所选项目的错误、可用性和上次成功更新时间，完全不可用时汇总为 `null`。

运行文件在 `.runtime/<uid>/`：`service.json` 为监督进程 PID、端口及刷新间隔；`service.lock` 防止同一用户重复启动；`service.log` 记录查询和恢复事件。`.runtime/` 为组共享目录，各 UID 子目录权限为 0700。wangyuxuan 的日志位于 `.runtime/2071/service.log`。

## 数据口径

- 查询当前认证账号可见的 **CP、CPE、ZhinaoRD2_A800** 项目，包含其他用户的可见任务；仅包含 `Running` / `Pending` 训练任务。
- 已通过真实任务详情核实项目别名：**CP = `zhinaord2_h800`（H800）**，**CPE = `zhinaord2_a100`（A100）**，ZhinaoRD2_A800 = `zhinaord2_a800`。页面直接显示 GPU 型号与项目别名，并提供 GPU 型号筛选和独立占卡汇总；终端的旧项目参数保留兼容。
- 总卡数为 `resource.count × resource.gpu`，即节点数乘每节点卡数。运行任务显示分配资源，排队任务显示申请需求。
- 只统计已知卡数；资源字段缺失显示未知。项目查询失败不会当成零占用，会保留上次成功数据并标明过期及更新时间。
- “节点空闲卡”直接读取各项目关联的 owned / private_for 节点池，不从训练任务倒推。节点接口反映资源分配，因此可覆盖该节点上训练任务之外的分配；这不是整个 Prophet 全平台或所有共享、可抢占资源的盘点。
- 空闲指 `available.nvidia.com/gpu` 上报的未分配数量，不是低 GPU 利用率。`accelerators` 是同一资源的别名，不相加。每个物理节点按集群 + 节点名去重，节点卡型按首个上报硬件型号展示。
- “可调度空闲”只包括状态可调度、已同步且容量 / 分配字段一致的节点。维修、不可调度、未同步和异常节点单列；“全部未分配”保留这些节点上报的原始剩余。CPU、内存等其他约束仍可能影响最终调度。
- 空闲值、容量等字段缺失显示未知；部分项目首次查询失败时合计显示未知，已有成功行仍可查看；过期缓存保留并标注。上报容量是当前资源系统可见的容量，不等同于安装硬件库存。实时 GPU 利用率尚未接入。
- 本工具展示调度状态和分配卡数，无法仅凭这些字段判断实验是否有效推进。

## 认证与依赖

Python 3.10+、`requests`（本机已有）。优先读取当前用户的 `PROPHET_API_AK_KEY` / `PROPHET_API_SK_KEY` 环境变量（兼容 `API_AK_KEY` / `API_SK_KEY`）；提供其中一项时必须同时提供另一项。

未提供环境变量时，读取 `PROPHET_HELPER` 指定的认证模块，默认使用当前用户 HOME 下的 `coding_security_train/submit_prophet.py`。这保留了 wangyuxuan 原有认证方式，其他用户可使用自己的环境变量或认证模块；共享目录不复制任何账号密钥。

服务只监听回环地址；凭据、任务命令和环境变量不会进入前端、导出文件或日志。上游连接直连 HTTPS，不经过代理。前端不加载 CDN，无构建或 npm 安装步骤。

## 验证

```bash
cd /home/jovyan/zhaoguangxiang-data-zzzc/prophet_dashboard
python3 -m unittest discover -v
node --test test_app.mjs
```

`prophet.py` 负责训练任务查询、快照和终端输出；`resources.py` 负责逐节点资源查询、分页、去重及空闲统计；`server.py` 负责 HTTP 与采集线程；`run.py` 管理后台服务；`autostart.py` 处理每次容器启动的自动拉起；`static/` 存放页面、样式和前端交互；测试文件覆盖统计、分页、失败恢复、HTTP 路由、筛选、导出和自动启动；`PLAN.md` 记录实现范围。

已通过 59 项 Python、14 项 JavaScript 测试及真实资源查询 / HTTP 检查。共享用户撞端口时会拒绝启动，健康响应需匹配自有服务 PID；GPU 型号筛选在所选型号暂时没有任务时继续保留。本机未安装浏览器，尚未完成浏览器实测及截图验收。
