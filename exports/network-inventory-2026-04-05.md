# 内网设备 IP 列表

**更新时间:** 2026-04-05  
**网段:** 192.168.2.0/24  
**在线设备:** 32 台

---

## 📡 网络设备

| 设备名 | IP 地址 | 端口 | 账号/密码 | 说明 |
|--------|---------|------|-----------|------|
| iKuai 爱快路由 | 192.168.2.1 | 80 | - | 主网关 ✅ |
| TP-Link SG1008 | 192.168.2.2 | 80 | admin/qwe2526425ZXC | 交换机 |
| OpenWrt | 192.168.2.3 | 22/80/443 | root/qwe2526425ZXC | 旁路由 |
| JetKoo AC | 192.168.2.11 | - | ❓ 未知 | AC 控制器 |

---

## 🖥️ Proxmox VE 虚拟机

| VMID | 名称 | IP 地址 | 类型 | 状态 | 说明 |
|------|------|---------|------|------|------|
| 100 | ikuai | 192.168.2.1 | VM | ✅ 运行 | 爱快路由 (主网关) |
| 101 | openwrt | 192.168.2.3 | VM | ✅ 运行 | OpenWrt (旁路由) |
| 102 | ad | 192.168.2.8 | VM | ✅ 运行 | AD 域控/DNS |
| 103 | jike | 192.168.2.11 | VM | ✅ 运行 | 集客 AC 控制器 |
| 104 | Ubuntu-Server | 192.168.2.10 | VM | ✅ 运行 | 乌班图服务器 |
| 105 | Synology | 192.168.2.5 | VM | ✅ 运行 | 黑群晖 NAS |
| 106 | ha | 192.168.2.6 | VM | ✅ 运行 | Home Assistant |
| 107 | win11 | 192.168.2.7 | VM | ✅ 运行 | Windows 11 (RDP) |
| 108 | HACK-BIG-SUR | - | VM | ⛔ 停止 | 黑苹果 (GT 730) |
| 109 | CT109 | 192.168.2.15 | LXC | ✅ 运行 | Cloudflare Tunnel |
| 110 | openclaw | - | VM | ✅ 运行 | OpenClaw (爪爪🦞) |
| 200 | Monitor-Grafana | 192.168.2.12 | LXC | ✅ 运行 | Grafana+InfluxDB 监控 |

---

## 🔧 服务器访问信息

### Proxmox VE
- **IP:** 192.168.2.4
- **用户:** root
- **密码:** qwe2526425ZXC

### 各服务器凭证

| 设备 | IP | 用户 | 密码 | 备注 |
|------|-----|------|------|------|
| Ubuntu-Server | 192.168.2.10 | jane | 老密码 | SSH |
| Home Assistant | 192.168.2.6 | - | Token 已配 | Web:8123 |
| Windows 11 | 192.168.2.7 | 1 | 2526425**** | RDP:3389 |
| Grafana | 192.168.2.12 | root/admin | 123456 | SSH/Web |
| Cloudflare Tunnel | 192.168.2.15 | root | 123456 | SSH |
| AD DNS | 192.168.2.8 | ad | 123456 | SSH |
| Hackintosh | 192.168.2.9 | 陈彦齐 | 123456 | SSH 未开启 |

---

## 📊 OpenClaw VM 工具清单

**IP:** 192.168.2.20  
**系统状态:** ✅ 已更新到最新 (2026-03-09)

### 开发工具
`git`, `curl`, `wget`, `vim`, `nano`, `build-essential`, `gcc`, `g++`, `make`, `tree`, `jq`

### 系统监控
`htop`, `tmux`, `lm-sensors`, `ncdu`, `duf`, `glances`, `iotop`, `iftop`

### 网络工具
`net-tools`, `dnsutils` (dig, nslookup), `iperf3`, `nmap`, `netcat` (nc), `tcpdump`, `mtr`, `telnet`, `rsync`, `ftp`, `lftp`

### Python 3.12.3
**库:** `requests`, `beautifulsoup4`, `selenium`, `pillow`, `pandas`, `numpy`

### Node.js v22.22.1
**全局包:** `pm2`, `nodemon`, `typescript`, `ts-node`, `eslint`, `prettier`, `clawhub`, `openclaw`

### 数据库客户端
`mariadb-client` (mysql), `postgresql-client` (psql), `redis-tools` (redis-cli)

### 安全工具
`openssh-client`, `sshpass`, `expect`, `fail2ban`, `ufw`, `certbot`

### 文件管理
`zip`, `unzip`, `tar`, `gzip`, `rsync`, `mc` (Midnight Commander), `file`

### Web/API测试
`httpie`, `curl`, `wget`, `selenium` (浏览器自动化)

**总工具数:** 50+ 个

---

## 🏠 Home Assistant 实体

### iKuai 爱快路由关键实体

**状态监控:**
- `binary_sensor.ikuai_status` - 路由器在线状态
- `sensor.ikuai_cpu_usage` - CPU 使用率 (%)
- `sensor.ikuai_memory_usage` - 内存使用率 (%)
- `sensor.ikuai_disk_usage` - 磁盘使用率 (%)

**网络流量:**
- `sensor.ikuai_upload` - 实时上传速度 (KB/s)
- `sensor.ikuai_download` - 实时下载速度 (KB/s)
- `sensor.ikuai_totalup` - 总上传流量 (GB)
- `sensor.ikuai_totaldown` - 总下载流量 (GB)
- `sensor.ikuaios_router_external_ip` - 公网 IP

**设备数量:**
- `sensor.ikuai_online_user` - 在线设备数
- `sensor.ikuai_ap_online` - 在线 AP 数

---

## 📝 备注

1. **密码安全:** 建议定期更换重要设备密码
2. **备份:** 关键配置已备份到 Google Drive
3. **监控:** Grafana 监控运行正常 (LXC200)
4. **隧道:** Cloudflare Tunnel 运行正常 (LXC109)

---

*文档由 爪爪🦞自动生成*
