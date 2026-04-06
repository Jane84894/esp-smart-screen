# MEMORY.md - Long-Term Memory

> Your curated memories. Distill from daily notes. Remove when outdated.

---

## About Jane (阿简)

### Key Context
- **Name:** Jane (阿简)
- **Location:** 广东潮州潮安
- **Timezone:** Asia/Shanghai (UTC+8)
- **Status:** 高三学生 → 2026 年 6 月高考 → 9 月上大学
- **Tech Style:** 极简主义黑客风，Proxmox/Home Assistant 玩家

### Hardware / Devices
| 设备 | 配置 | 用途 |
|------|------|------|
| **台式机** | R5 5600 + RX 6600 XT | 主力游戏/AI，计划带去大学 |
| **黑苹果 VM** | GT 730 | 学习 macOS |
| **目标笔记本** | MacBook M1 Pro 14 寸 16+512 | 大学携带，本地 AI 推理 |
| **目标显示器** | 泰坦军团 M27E2R 27 寸 2K 180Hz | 宿舍外接，KVM+ 一线通 |

### Preferences Learned
- 直接、不啰嗦
- 喜欢技术挑战
- 对 AI 工具要求高（要聪明还要省钱）
- 关注本地 AI 部署（Gemma 4 等开源模型）
- 重视 120Hz 屏幕（不用 60Hz）
- 性价比优先（700 元显示器很香）

---

## Lessons Learned

### 2026-04-04 - 记忆维护问题
- **问题:** 我没有在对话后写记忆文件，导致第二天"失忆"
- **教训:** 每次重要对话后必须更新 `memory/YYYY-MM-DD.md` 和 `MEMORY.md`
- **行动:** 已修复，开始维护记忆系统

---

## Ongoing Context

### Active Projects
- 模型路由系统开发中
- HA 升级到 2026.3.1 ✅
- 选购 MacBook M1 Pro 14 寸（高考后买）
- 选购泰坦军团 M27E2R 显示器（高考后买）

### Things to Remember
- 用户准备上大学，需要考虑设备携带性
- 对本地 AI 推理有强烈兴趣（Gemma 4 等）
- 16GB MacBook 跑 26B 模型会紧张，但够用
- 14 寸 + 宿舍外接显示器 = 最佳组合
- 高考前不买设备，专心备考

### Inner Network (内网设备)
- **网段:** 192.168.2.0/24
- **在线设备:** 32 台
- **Proxmox VMs:** 10 台 (bc:24:11:xx:xx:xx)
- **ESPHome 设备:** 3 台 (201,205,208)
- **小米设备:** 9 台
- **关键设备:**
  - 192.168.2.1: iKuai 爱快路由
  - 192.168.2.4: Proxmox VE
  - 192.168.2.6: Home Assistant
  - 192.168.2.12: Grafana 监控
  - 192.168.2.20: OpenClaw 本机

---

## Scheduled Tasks (定时任务)

| 任务 | 频率 | 说明 |
|------|------|------|
| 每日早报 | 每天 5:00 | 重大新闻 + 潮州天气 + 雨伞提醒 |
| PVE 负载监控 | 每 3 小时 | CPU>80%/内存>85%/磁盘>90% 告警 |

---

## Relationships & People

*Review and update periodically. Daily notes are raw; this is curated.*
