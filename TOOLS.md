# TOOLS.md - Local Notes

## SSH Hosts

### Proxmox VE
- **pve** → 192.168.2.4, user: root, pass: qwe2526425ZXC

### Network Devices
| Device | IP | Port | Credentials | Notes |
|--------|-----|------|-------------|-------|
| TP-Link SG1008 | 192.168.2.2 | 80 | admin/qwe2526425ZXC | 交换机 |
| OpenWrt | 192.168.2.3 | 22/80/443 | root/qwe2526425ZXC | 路由器 |
| JetKoo AC (VM103) | 192.168.2.11 | - | ❓未知 | AC 控制器 |

### Servers & VMs
| Device | IP | Port | OS | Credentials | Notes |
|--------|-----|------|-------|-------------|-------|
| Synology (黑群晖 VM105) | 192.168.2.5 | 80 | DSM | Jane/老密码 | NAS |
| ADGH DNS (VM102) | 192.168.2.8 | - | - | ❓未知 | DNS 服务器 |
| Hackintosh (VM108) | 192.168.2.9 | 22/80 | macOS | 陈彦齐/123456 | 黑苹果 (GT 730) |
| Home Assistant (VM106) | 192.168.2.6 | 8123 | HA OS | Token 已配 | 智能家居 |
| Windows 11 (VM107) | 192.168.2.7 | 3389 | Win11 | 1/2526425**** | RDP 远程 |
| Ubuntu-Server (VM104) | 192.168.2.10 | 22/80 | Ubuntu | jane/老密码 | 乌班图 |
| Grafana (LXC200) | 192.168.2.12 | 22/80 | LXC | ✅ root/123456 / admin/123456 (Web) | PVE 容器 - Grafana 监控运行中 |
| Cloudflare Tunnel (LXC109) | 192.168.2.15 | 22 | LXC | ✅ root/123456 | PVE 容器 - Cloudflare Tunnel 运行中 ✅ |
| ADGH DNS (VM102) | 192.168.2.8 | 22 | LXC | ✅ ad/123456 | AD 域控/DNS |
| Hackintosh (VM108) | 192.168.2.9 | 80 | macOS | ❌ SSH 未开启 | 黑苹果 (GT 730) |

### PVE VMs/Containers
| VMID | Name | IP | Type | Notes |
|------|------|-----|------|-------|
| 100 | ikuai | 192.168.2.1 | VM | 爱快路由 (主网关) ✅ |
| 101 | openwrt | 192.168.2.3 | VM | OpenWrt (旁路由) |
| 102 | ad | 192.168.2.8 | VM | AD 域控/DNS |
| 103 | jike | 192.168.2.11 | VM | 集客 AC 控制器 |
| 104 | Ubuntu-Server | 192.168.2.10 | VM | 乌班图 |
| 105 | Synology | 192.168.2.5 | VM | 黑群晖 |
| 106 | ha | 192.168.2.6 | VM | Home Assistant |
| 107 | win11 | 192.168.2.7 | VM | Windows 11 |
| 108 | HACK-BIG-SUR | - | VM | 黑苹果 (GT 730) ⛔停止 |
| 109 | CT109 | 192.168.2.15 | LXC | Cloudflare Tunnel ✅ |
| 110 | openclaw | - | VM | 我自己 (爪爪🦞) |
| 200 | Monitor-Grafana | 192.168.2.12 | LXC | Grafana+InfluxDB 监控 |

### OpenClaw VM (192.168.2.110) 已安装工具

#### 🔧 开发工具
git, curl, wget, vim, nano, build-essential, gcc, g++, make, tree, jq

#### 📊 系统监控
htop, tmux, lm-sensors, ncdu, duf, glances, iotop, iftop

#### 🌐 网络工具
net-tools, dnsutils (dig, nslookup), iperf3, nmap, netcat (nc), tcpdump, mtr, telnet, rsync, ftp, lftp

#### 🐍 Python 3.12.3 + 库
- **版本:** Python 3.12.3, pip3
- **库:** requests, beautifulsoup4, selenium, pillow, pandas, numpy

#### 🟨 Node.js v22.22.1 + 全局包
- **版本:** Node.js v22.22.1, npm 10.9.4
- **全局包:** pm2, nodemon, typescript, ts-node, eslint, prettier, clawhub, openclaw

#### 💾 数据库客户端
mariadb-client (mysql), postgresql-client (psql), redis-tools (redis-cli)

#### 🔒 安全工具
openssh-client, sshpass, expect, fail2ban, ufw, certbot

#### 📦 文件管理
zip, unzip, tar, gzip, rsync, mc (Midnight Commander), file

#### 🌍 Web/API 测试
httpie, curl, wget, selenium (浏览器自动化)

#### 📈 其他工具
tree, jq (JSON 处理), lm-sensors (硬件监控)

**系统状态:** ✅ 已更新到最新 (2026-03-09)
**总工具数:** 50+ 个

---

## 🎤 语音功能配置

### 🆓 免费本地方案（推荐）

#### STT (语音识别)
- **工具:** Faster Whisper
- **状态:** 📦 安装中
- **模型:** base (中文)
- **离线:** ✅ 完全离线

#### TTS (语音合成)
- **工具:** Piper TTS
- **状态:** ✅ 已安装
- **语音:** zh_CN-huayan-medium
- **离线:** ✅ 完全离线

#### 配置步骤
1. 安装 ffmpeg: `sudo apt install ffmpeg`
2. 下载 Piper 中文模型
3. 配置 openclaw.json
4. 重启 Gateway

### 💰 付费方案（备用）

#### ElevenLabs TTS
- **API Key:** ❓未配置
- **声音:** Rachel
- **质量:** ⭐⭐⭐⭐⭐
- **成本:** $5/月起

---

### Telegram 语音消息
- **接收:** ✅ OpenClaw 支持
- **发送:** ✅ 支持.ogg 格式
- **自动 STT:** 需要配置 Whisper
- **自动 TTS:** 需要配置 Piper

---

## 📅 日程管理配置

### Google Calendar
1. 访问 https://console.cloud.google.com/
2. 创建项目并启用 Calendar API
3. 下载 credentials.json
4. 运行：`python3 scripts/calendar-setup.py`

### 邮件监控
1. 启用 IMAP 访问
2. 获取应用专用密码
3. 配置到 scripts/email-monitor.py


---

## 🏠 Home Assistant 实体标识符

### iKuai 爱快路由 (VM100 / 192.168.2.1)

#### 状态传感器
| 实体 ID | 说明 | 单位 |
|--------|------|------|
| `binary_sensor.ikuai_status` | 路由器在线状态 | - |
| `binary_sensor.ikuaios_router_wan_status` | WAN 口连接状态 | - |
| `sensor.ikuai_status` | 运行状态 | - |
| `sensor.ikuai_uptime` | 运行时间 | - |
| `sensor.ikuai_wan_uptime` | WAN 连接时间 | - |

#### 系统监控
| 实体 ID | 说明 | 单位 |
|--------|------|------|
| `sensor.ikuai_cpu` | CPU 频率 | MHz |
| `sensor.ikuai_cpu_temperature` | CPU 温度 | °C |
| `sensor.ikuai_cpu_usage` | CPU 使用率 | % |
| `sensor.ikuai_max_cpu` | 最大 CPU 频率 | MHz |
| `sensor.ikuai_memory` | 已用内存 | MB |
| `sensor.ikuai_memory_usage` | 内存使用率 | % |
| `sensor.ikuai_max_memory_usage` | 最大内存使用 | MB |
| `sensor.ikuai_disk_usage` | 磁盘使用率 | % |
| `sensor.ikuai_max_disk_usage` | 最大磁盘使用 | MB |

#### 网络流量
| 实体 ID | 说明 | 单位 |
|--------|------|------|
| `sensor.ikuai_totalup` | 总上传流量 | GB |
| `sensor.ikuai_totaldown` | 总下载流量 | GB |
| `sensor.ikuai_upload` | 实时上传速度 | KB/s |
| `sensor.ikuai_download` | 实时下载速度 | KB/s |
| `sensor.ikuaios_router_upload_speed` | 上传速度 | MB/s |
| `sensor.ikuaios_router_download_speed` | 下载速度 | MB/s |
| `sensor.ikuaios_router_external_ip` | 公网 IP | - |
| `sensor.ikuai_connect_num` | 连接数 | - |
| `sensor.ikuai_online_user` | 在线设备数 | - |
| `sensor.ikuai_ap_online` | 在线 AP 数 | - |

#### IP 地址
| 实体 ID | 说明 |
|--------|------|
| `sensor.ikuai_wan_ip` | WAN 口 IPv4 |
| `sensor.ikuai_wan6_ip` | WAN 口 IPv6 |
| `sensor.ikuai_lan6_ip` | LAN 口 IPv6 |

#### 控制开关
| 实体 ID | 说明 |
|--------|------|
| `switch.ikuai_arp_filter` | ARP 过滤 |
| `switch.ikuai_arp_filter_2` | ARP 过滤 2 |
| `switch.ikuai_stream_control` | 流控开关 |
| `switch.ikuai_nas_flow_to_world` | NAS 流量转发 |

#### 操作按钮
| 实体 ID | 说明 |
|--------|------|
| `button.ikuai_restart` | 重启路由器 |
| `button.ikuai_restart_2` | 重启 2 |
| `button.ikuai_reset` | 重置配置 |
| `button.ikuai_start` | 启动 |
| `button.ikuai_stop` | 停止 |
| `button.ikuai_hibernate` | 休眠 |
| `button.ikuai_reconnect_wan` | 重连 WAN |

#### 设备追踪
| 实体 ID | 说明 |
|--------|------|
| `device_tracker.ikuai_iphone13_dscao` | iPhone13_dscao |
| `device_tracker.ikuai_iphone13_hyq` | iPhone13_hyq |
| `device_tracker.ikuai_oppo_a11` | Oppo A11 |
| `device_tracker.ikuai_oppo_k7` | Oppo K7 |
| `device_tracker.ikuai_phone403` | Phone403 |
| `device_tracker.ikuai_phoneredmi_cwl` | PhoneRedmi_cwl |
| `device_tracker.ikuai_vivo_y93s` | Vivo y93s |

#### 更新
| 实体 ID | 说明 |
|--------|------|
| `update.ikuai_update` | 固件更新 |
