# ESPHome Smart PDA

基于 ESP32-S3 的智能家居控制面板，支持 LVGL 图形界面，显示时间、天气、农历、虚拟机状态等信息。

Smart home control panel based on ESP32-S3 with LVGL graphics interface, displaying time, weather, lunar calendar, VM status, and more.

---

## 📦 所需 Home Assistant 集成 / Required HA Integrations

在使用此配置文件前，请确保 Home Assistant 中已安装以下集成。

Before using this configuration file, ensure the following integrations are installed in Home Assistant.

### 必需集成 / Required Integrations

| 集成名称 / Integration | 用途 / Purpose | 安装方式 / Installation |
|---------|------|---------|
| **OpenWeatherMap** | 天气数据 / Weather data | HA 内置 / Built-in |
| **Proxmox VE** | PVE 服务器监控 / PVE server monitoring | HACS: [Proxmox VE Integration](https://github.com/dougite/proxmoxve-hass) |
| **AdGuard Home** | 广告拦截统计 / Ad blocking statistics | HA 内置 / Built-in |
| **Clash** | 代理流量监控 / Proxy traffic monitoring | HACS: [Clash](https://github.com/ha0z01/ha_clash) |
| **iKuai** | 爱快路由器监控 / iKuai router monitoring | HACS: [iKuai](https://github.com/SimonKniep/ha-ikuai) |
| **农历传感器 / Lunar Calendar** | 农历日期显示 / Lunar date display | 手动安装 / Manual install (见下文 / see below) |

### 可选集成 / Optional Integrations

| 集成名称 / Integration | 用途 / Purpose | 安装方式 / Installation |
|---------|------|---------|
| **ESXi Stats** | VMware 虚拟机监控 / VMware VM monitoring | HACS: [ESXi Stats](https://github.com/wxt2005/esxi_stats) |

---

## 🔧 集成安装指南 / Integration Installation Guide

### 1. OpenWeatherMap (天气 / Weather)

**中文:**
1. 获取 API Key: https://home.openweathermap.org/users/sign_up
2. HA 中：**设置** → **设备与服务** → **添加集成** → 搜索 `OpenWeatherMap`
3. 输入 API Key 和位置信息

**English:**
1. Get API Key: https://home.openweathermap.org/users/sign_up
2. In HA: **Settings** → **Devices & Services** → **Add Integration** → Search `OpenWeatherMap`
3. Enter API Key and location information

### 2. Proxmox VE (PVE 监控 / PVE Monitoring)

**中文:**
```bash
# HACS 安装
1. HACS → 集成 → 探索并下载仓库
2. 搜索 "Proxmox VE"
3. 安装 https://github.com/dougite/proxmoxve-hass
4. 重启 HA
5. 设置 → 设备与服务 → 添加集成 → Proxmox VE
```

**配置信息 / Configuration:**
- Host: `192.168.2.4` (你的 PVE IP / Your PVE IP)
- Port: `8006`
- 用户名 / Username: `root`
- 密码 / Password: 你的 PVE 密码 / Your PVE password
- 选择监控的 VM 和 LXC / Select VMs and LXCs to monitor

### 3. AdGuard Home (广告拦截 / Ad Blocking)

**中文:**
HA 内置集成，直接添加：
- Host: `192.168.2.8` (你的 AdGuard IP / Your AdGuard IP)
- 端口 / Port: `3000` (默认 / default)
- 用户名/密码 / Username/Password: 你的 AdGuard 登录信息 / Your AdGuard login

**English:**
HA built-in integration, add directly:
- Host: `192.168.2.8` (Your AdGuard IP)
- Port: `3000` (default)
- Username/Password: Your AdGuard login credentials

### 4. Clash (代理监控 / Proxy Monitoring)

**中文:**
```bash
# HACS 安装
1. HACS → 集成 → 探索并下载仓库
2. 搜索 "Clash"
3. 安装 https://github.com/ha0z01/ha_clash
4. 重启 HA
5. 配置 Clash 实例
```

**English:**
```bash
# HACS Installation
1. HACS → Integrations → Explore & Download Repository
2. Search "Clash"
3. Install https://github.com/ha0z01/ha_clash
4. Restart HA
5. Configure Clash instance
```

### 5. iKuai (爱快路由 / iKuai Router)

**中文:**
```bash
# HACS 安装
1. HACS → 集成 → 探索并下载仓库
2. 搜索 "iKuai"
3. 安装 https://github.com/SimonKniep/ha-ikuai
4. 重启 HA
5. 配置 iKuai 登录信息
```

**English:**
```bash
# HACS Installation
1. HACS → Integrations → Explore & Download Repository
2. Search "iKuai"
3. Install https://github.com/SimonKniep/ha-ikuai
4. Restart HA
5. Configure iKuai login credentials
```

### 6. 农历传感器 / Lunar Calendar Sensor

**方法 1: 使用 HACS 自定义集成 / Method 1: Using HACS Custom Integration**
```bash
中文:
1. HACS → 集成 → 添加自定义仓库
2. 仓库 URL: https://github.com/Jane84894/ha-lunar-sensor
3. 安装农历传感器
4. 重启 HA

English:
1. HACS → Integrations → Add Custom Repository
2. Repository URL: https://github.com/Jane84894/ha-lunar-sensor
3. Install Lunar Calendar sensor
4. Restart HA
```

**方法 2: 手动安装 / Method 2: Manual Installation**
```bash
# 下载并复制到 HA 配置目录 / Download and copy to HA config directory
cd /config/custom_components
git clone https://github.com/Jane84894/ha-lunar-sensor.git lunar_calendar
# 重启 HA / Restart HA
```

---

## 📊 所需传感器实体 / Required Sensor Entities

确保以下实体在 HA 中存在 / Ensure the following entities exist in HA:

### 虚拟机状态 / VM Status (binary_sensor)
- `binary_sensor.ikuai_status` - iKuai 路由 / iKuai Router
- `binary_sensor.openwrt_status` - OpenWrt 路由 / OpenWrt Router
- `binary_sensor.ad_status` - AD 域控 / AD Domain Controller
- `binary_sensor.jike_status` - 集客 AC / Jike AC
- `binary_sensor.ubuntu_server_status` - Ubuntu 服务器 / Ubuntu Server
- `binary_sensor.synology_status` - 群晖 NAS / Synology NAS
- `binary_sensor.ha_status` - HA 自身 / HA itself
- `binary_sensor.win11_status` - Windows 11
- `binary_sensor.hack_big_sur_status` - 黑苹果 / Hackintosh
- `binary_sensor.ct109_status` - CT109
- `binary_sensor.openclaw_status` - OpenClaw
- `binary_sensor.monitor_grafana_status` - Grafana 监控 / Grafana Monitoring

### 传感器 / Sensors (sensor)

**天气 / Weather:**
- `sensor.openweathermap_temperature` - 温度 / Temperature
- `sensor.openweathermap_humidity` - 湿度 / Humidity
- `sensor.openweathermap_wind_speed` - 风速 / Wind Speed
- `sensor.openweathermap_apparent_temperature` - 体感温度 / Apparent Temperature
- `sensor.openweathermap_weather` - 天气状况 / Weather Condition

**PVE 监控 / PVE Monitoring:**
- `sensor.pve_cpu_usage` - CPU 使用率 / CPU Usage
- `sensor.pve_max_cpu` - 最大 CPU / Max CPU
- `sensor.pve_memory_usage` - 内存使用 / Memory Usage
- `sensor.pve_max_memory_usage` - 最大内存 / Max Memory
- `sensor.pve_disk_usage` - 磁盘使用 / Disk Usage
- `sensor.pve_max_disk_usage` - 最大磁盘 / Max Disk
- `sensor.pve_status` - PVE 状态 / PVE Status

**路由器 / Router:**
- `sensor.ikuai_upload` - iKuai 上传速度 / iKuai Upload Speed
- `sensor.ikuai_download` - iKuai 下载速度 / iKuai Download Speed
- `sensor.ikuai_online_user` - iKuai 在线设备数 / iKuai Online Devices

**Clash:**
- `sensor.clash_shi_li_upload_speed` - 上传速度 / Upload Speed
- `sensor.clash_shi_li_download_speed` - 下载速度 / Download Speed
- `sensor.clash_shi_li_connection_number` - 连接数 / Connection Count

**AdGuard:**
- `sensor.adguard_home_dns_queries_blocked` - 已拦截查询数 / Blocked Queries
- `sensor.adguard_home_dns_queries_blocked_ratio` - 拦截率 / Block Ratio
- `sensor.adguard_home_average_processing_speed` - 平均处理速度 / Avg Processing Speed

**农历 / Lunar Calendar:**
- `sensor.nong_li_ri_qi` - 农历日期 / Lunar Date
- `sensor.nong_li_ri_qi_2` - 农历日期 (数字) / Lunar Date (Number)
- `sensor.sheng_xiao` - 生肖 / Chinese Zodiac
- `sensor.gan_zhi_nian` - 干支年 / Heavenly Stems Year

---

## 📁 文件说明 / File Structure

```
esp-smart-screen/
├── README.md                 # 本文件 / This file
├── smart-pda-fixed.yaml      # ESPHome 配置文件 / ESPHome Config ⭐
└── secrets.example.yaml      # 密钥模板 / Secrets Template
```

---

## 🚀 使用方法 / Usage

### 1. 准备密钥文件 / Prepare Secrets File

**中文:**
```bash
# 复制密钥模板
cp secrets.example.yaml secrets.yaml

# 编辑密钥文件
nano secrets.yaml
```

**需要修改的密钥 / Secrets to Modify:**
- `api_key` - ESPHome API 加密密钥 / ESPHome API encryption key
- `wifi_ssid` - WiFi 名称 / WiFi SSID
- `wifi_password` - WiFi 密码 / WiFi Password

**English:**
```bash
# Copy secrets template
cp secrets.example.yaml secrets.yaml

# Edit secrets file
nano secrets.yaml
```

**Secrets to Modify:**
- `api_key` - ESPHome API encryption key
- `wifi_ssid` - WiFi SSID
- `wifi_password` - WiFi Password

### 2. 上传到 ESPHome / Upload to ESPHome

**方法 1: ESPHome Dashboard**

**中文:**
1. 打开 ESPHome Dashboard
2. 点击 **New Device** 或选择现有设备
3. 点击 **Edit**
4. 复制 `smart-pda-fixed.yaml` 内容
5. 粘贴并 **Save**
6. 点击 **Install**

**English:**
1. Open ESPHome Dashboard
2. Click **New Device** or select existing device
3. Click **Edit**
4. Copy `smart-pda-fixed.yaml` content
5. Paste and **Save**
6. Click **Install**

**方法 2: 命令行 / Command Line**

**中文:**
```bash
esphome upload smart-pda-fixed.yaml
```

**English:**
```bash
esphome upload smart-pda-fixed.yaml
```

### 3. 编译和上传 / Compile and Upload

**中文:**
```bash
# 编译
esphome compile smart-pda-fixed.yaml

# 上传 (替换设备 IP)
esphome upload smart-pda-fixed.yaml --device 192.168.2.201
```

**English:**
```bash
# Compile
esphome compile smart-pda-fixed.yaml

# Upload (replace device IP)
esphome upload smart-pda-fixed.yaml --device 192.168.2.201
```

---

## 🎨 UI 页面 / UI Pages

### 主页 / Home Page
- 时间日期 / Time & Date
- 农历显示 (含生肖、干支年) / Lunar Calendar (with Zodiac, Heavenly Stems)
- 天气信息 (温度、湿度、风速、体感) / Weather Info (Temp, Humidity, Wind, Feels Like)
- HA 连接状态 / HA Connection Status

### 应用菜单 / App Menu
- PVE 状态 / PVE Status
- 路由器中心 / Router Center
- 智能家居 / Smart Home
- 存储中心 / Storage Center
- 系统状态 / System Status
- 系统设置 / System Settings

### PVE 状态页 / PVE Status Page
- CPU/内存/磁盘仪表盘 / CPU/Memory/Disk Gauges
- 12 台虚拟机状态指示灯 / 12 VM Status Indicators

### 路由器中心 / Router Center
- iKuai (主路由): 在线设备、上传/下载速度 / iKuai (Main Router): Online Devices, Upload/Download Speed
- Clash (旁路由): 连接数、上传/下载速度 / Clash (Side Router): Connection Count, Upload/Download Speed
- AdGuard: 拦截数、拦截率、处理速度 / AdGuard: Blocked Count, Block Ratio, Processing Speed

### 系统状态页 / System Status Page
- 网络信息 (IP、MAC、WiFi 信号) / Network Info (IP, MAC, WiFi Signal)
- 运行状态 (运行时间、可用内存) / Runtime Status (Uptime, Available Memory)

### 设置页 / Settings Page
- 屏幕亮度调节 / Screen Brightness Adjustment
- 息屏时间设置 / Screen Timeout Setting
- 常亮模式开关 / Always-On Mode Toggle
- 一键息屏 / One-Click Screen Off
- 重启设备 / Restart Device

---

## ⚙️ 配置选项 / Configuration Options

### 屏幕设置 / Screen Settings
```yaml
number.sleep_time: 息屏时间 (5-600 秒，默认 15 秒) / Screen timeout (5-600s, default 15s)
```

### 常亮模式 / Always-On Mode
```yaml
globals.always_on_mode: 常亮模式 (true/false) / Always-on mode (true/false)
```

### 更新频率 / Update Frequency
```yaml
interval: 5s  # LVGL 刷新频率 (已优化) / LVGL refresh rate (optimized)
```

---

## 🔧 故障排除 / Troubleshooting

### 1. 编译失败 / Compilation Failed
**中文:**
```bash
# 清理缓存
esphome clean smart-pda-fixed.yaml

# 重新编译
esphome compile smart-pda-fixed.yaml
```

**English:**
```bash
# Clean cache
esphome clean smart-pda-fixed.yaml

# Recompile
esphome compile smart-pda-fixed.yaml
```

### 2. 传感器显示 "--" / Sensors Show "--"
**中文:**
- 检查 HA 中对应实体是否存在
- 检查实体 ID 是否正确
- 检查 HA 与 ESPHome 的连接

**English:**
- Check if corresponding entities exist in HA
- Verify entity IDs are correct
- Check HA to ESPHome connection

### 3. 屏幕不显示 / Screen Not Displaying
**中文:**
- 检查 GPIO 引脚定义
- 检查屏幕初始化序列
- 检查背光 PWM 配置

**English:**
- Check GPIO pin definitions
- Verify display initialization sequence
- Check backlight PWM configuration

### 4. 触摸不灵敏 / Touch Not Responsive
**中文:**
- 检查 I2C 引脚 (SDA: GPIO8, SCL: GPIO4)
- 检查触摸 IC 复位引脚 (GPIO38)
- 检查中断引脚 (GPIO3)

**English:**
- Check I2C pins (SDA: GPIO8, SCL: GPIO4)
- Check touch IC reset pin (GPIO38)
- Check interrupt pin (GPIO3)

---

## 📝 更新日志 / Changelog

### v1.0 (2026-03-14)
**中文:**
- ✅ 添加生肖和干支年传感器支持
- ✅ 优化更新频率 (1 秒 → 5 秒)
- ✅ 添加空值检查防止崩溃
- ✅ 优化字体 glyphs 定义
- ✅ 添加内存保护

**English:**
- ✅ Added Chinese zodiac and Heavenly Stems sensor support
- ✅ Optimized update frequency (1s → 5s)
- ✅ Added null value checks to prevent crashes
- ✅ Optimized font glyphs definition
- ✅ Added memory protection

---

## 📄 许可证 / License

MIT License

---

## 🙏 致谢 / Acknowledgments

- [ESPHome](https://esphome.io/)
- [LVGL](https://lvgl.io/)
- [Home Assistant](https://www.home-assistant.io/)
