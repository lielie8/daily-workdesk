<div align="center">

# Daily Workbench

**把注意力留给眼前的一件事，也给喜欢的生活留点位置。**

A calm, local-first personal dashboard for tasks, study, rewards, and everyday life.

[English](README.en.md) · [使用指南](#开始使用) · [贡献指南](CONTRIBUTING.md) · [更新记录](CHANGELOG.md)

![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=111)
![Storage](https://img.shields.io/badge/Storage-localStorage-075fb3)
![License](https://img.shields.io/badge/License-MIT-302b27)

</div>

Daily Workbench 是一个轻量的个人工作台，帮助你整理学习、工作和生活。打开后先关注当前的一件事，需要时再查看本周计划、项目和长期方向。

它从个人真实使用需求中生长出来：减少重复规划和启动负担，让完成的事情有迹可循，同时保留休息、兴趣和期待。没有连续打卡惩罚，也没有必须攒够积分才能享受的奖励。

## 功能

| 入口 | 可以做什么 |
| --- | --- |
| 今日 | 选择精力、填写当前任务、完成线和断点；保留主任务与生活事项；查看未来七天的重要日期 |
| 本周 | 写下三个关键结果和工作量预算；管理任务、优先级、日期、预计时长及下一步行动；查看全部重要日期和随手记录 |
| 奖励 | 收藏想做的事，记录备注、地点或预算；随机挑选一项；标记“已享受”或重新期待 |
| 项目 | 管理目标、状态、日期、里程碑和成果；最多同时推进两个项目 |
| 路线图 | 按阶段编辑目标、成果、依赖与风险，按自己的节奏回看 |
| 健康与精力 | 可选记录睡眠、活动、感受与支持事项 |
| 复盘 | 回顾完成了什么、什么难以启动、下周如何调整；可选月度检查 |
| 完成记录 | 完成当前任务、勾选今日事项或完成任务清单时留下记录；支持补记、按日期回看和近七天概览 |

## 五套皮肤

| 皮肤 | 气质 |
| --- | --- |
| Swiss Signal | 红黑点缀、明确网格、利落的视觉层级 |
| Bauhaus Play | 蓝黄配色、几何感、圆角与硬阴影 |
| Paper Editorial | 暖纸色、衬线字、安静的编辑排版 |
| 日常散步 | 奶油纸色、手写字、便笺式卡片 |
| 蓝色来信 | 钴蓝、斜体大字、细线与请柬式留白 |

皮肤会应用到各个功能页，选择保存在当前浏览器中。界面目前以中文为主。

## 开始使用

只需要一个现代浏览器，以及任意静态文件服务器。没有 npm 依赖，也没有构建步骤。

```sh
git clone https://github.com/lielie8/daily-workdesk.git
cd daily-workdesk
python -m http.server 4173 --directory dist
```

打开 [http://localhost:4173](http://localhost:4173)。上面的预览命令需要先安装 Python；也可以使用你熟悉的静态预览工具。

建议从一个具体任务开始，填写“做到什么程度算完成”；暂时离开时记下断点。以后再按需要使用本周、项目和复盘。

## 数据与隐私

- 任务、奖励、日程、完成记录、健康记录和皮肤偏好保存在当前浏览器的 `localStorage` 中。
- 没有应用后端，不向 GitHub 或项目作者同步这些记录；GitHub 保存的是程序源码。
- 当前没有云同步、自动备份或应用内导入导出。清除站点数据会丢失本地记录。
- 不同浏览器、设备、域名或端口的数据相互独立；`localhost` 和 `127.0.0.1` 也是不同来源。
- 字体通过 Google Fonts 加载，会产生向该服务的字体请求；断网时使用系统字体回退。
- 新安装不再预填作者的个人考试与申请时间。已有浏览器存储继续沿用，存储键 `hui-workbench-v1` 为兼容历史版本保留。

如果在共用电脑上记录私人内容，请留意该浏览器的使用权限。本项目是个人规划工具，不提供诊断或治疗功能。

## 部署自己的版本

将 `dist/` 内的文件作为静态网站发布即可，例如使用 GitHub Pages、Cloudflare Pages 或其他静态托管服务。无需构建命令。

仓库内 `.openai/hosting.json` 绑定的是原项目的 Sites 身份。复用时应创建你自己的部署，不要沿用这个 `project_id`。本仓库公开不代表作者的个人在线工作台向公众开放。

## 项目结构

```text
dist/
  index.html      # 页面骨架、基础皮肤、本地状态及完成记录
  workdesk.js     # 分层页面、任务、奖励、项目与复盘
  workdesk.css    # 分层页面与表单样式
  skins.css       # 日常散步、蓝色来信两套皮肤
  skins.js        # 皮肤专属寄语
.openai/
  hosting.json    # 原站点的 Sites 发布配置
```

文件名中的 `workdesk` 为历史命名，项目展示名称统一为 **Daily Workbench**。

## 设计参考

“日常散步”从 [《平屋慢生活》官网](https://hirayasumi-anime.jp/) 的日常气质中获得灵感；“蓝色来信”参考了 [Tonami & Ayano Wedding Invitation](https://wedding.tonami-komuro.com/) 的钴蓝、斜体排版与纸面感。

本项目没有复制这些网站的人物插画、摄影、品牌标识或源码，也不隶属于它们。字体遵循各自的许可证，详情见 [Google Fonts](https://fonts.google.com/)。

## 贡献与许可

欢迎通过 [Issues](https://github.com/lielie8/daily-workdesk/issues) 反馈问题或想法。请先阅读 [贡献指南](CONTRIBUTING.md)，尤其注意不要提交自己的日程、健康记录或浏览器存储。

代码以 [MIT License](LICENSE) 发布。作者：[@lielie8](https://github.com/lielie8)。
