# ESPHome Smart PDA

基于 ESP32-S3 的智能家居控制面板，支持 LVGL 图形界面，显示时间、天气、农历、虚拟机状态等信息。

## 📦 所需 Home Assistant 集成

在使用此配置文件前，请确保 Home Assistant 中已安装以下集成：

### 必需集成

| 集成名称 | 用途 | 安装方式 |
|---------|------|---------|
| **OpenWeatherMap** | 天气数据 | HA 内置集成 |
| **Proxmox VE** | PVE 服务器监控 | HACS: [Proxmox VE Integration](https://github.com/dougite/proxmoxve-hass) |
| **AdGuard Home** | 广告拦截统计 | HA 内置集成 |
| **Clash** | 代理流量监控 | HACS: [Clash](https://github.com/ha0z01/ha_clash) |
| **iKuai** | 爱快路由器监控 | HACS: [iKuai](https://github.com/SimonKniep/ha-ikuai) |
| **农历传感器** | 农历日期显示 | 手动安装（见下文） |

### 可选集成

| 集成名称 | 用途 | 安装方式 |
|---------|------|---------|
| **ESXi Stats** | VMware 虚拟机监控 | HACS: [ESXi Stats](https://github.com/wxt2005/esxi_stats) |

---

## 🔧 集成安装指南

### 1. OpenWeatherMap (天气)

1. 获取 API Key: https://home.openweathermap.org/users/sign_up
2. HA 中：**设置** → **设备与服务** → **添加集成** → 搜索 `OpenWeatherMap`
3. 输入 API Key 和位置信息

### 2. Proxmox VE (PVE 监控)

```bash
# HACS 安装
1. HACS → 集成 → 探索并下载仓库
2. 搜索 "Proxmox VE"
3. 安装 https://github.com/dougite/proxmoxve-hass
4. 重启 HA
5. 设置 → 设备与服务 → 添加集成 → Proxmox VE
```

**配置信息:**
- Host: `192.168.2.4` (你的 PVE IP)
- Port: `8006`
- 用户名：`root`
- 密码：你的 PVE 密码
- 选择监控的 VM 和 LXC

### 3. AdGuard Home (广告拦截)

HA 内置集成，直接添加：
- Host: `192.168.2.8` (你的 AdGuard IP)
- 端口：`3000` (默认)
- 用户名/密码：你的 AdGuard 登录信息

### 4. Clash (代理监控)

```bash
# HACS 安装
1. HACS → 集成 → 探索并下载仓库
2. 搜索 "Clash"
3. 安装 https://github.com/ha0z01/ha_clash
4. 重启 HA
5. 配置 Clash 实例
```

### 5. iKuai (爱快路由)

```bash
# HACS 安装
1. HACS → 集成 → 探索并下载仓库
2. 搜索 "iKuai"
3. 安装 https://github.com/SimonKniep/ha-ikuai
4. 重启 HA
5. 配置 iKuai 登录信息
```

### 6. 农历传感器

**方法 1: 使用 HACS 自定义集成**
```bash
1. HACS → 集成 → 添加自定义仓库
2. 仓库 URL: https://github.com/Jane84894/ha-lunar-sensor
3. 安装农历传感器
4. 重启 HA
```

**方法 2: 手动安装**
```bash
# 下载并复制到 HA 配置目录
cd /config/custom_components
git clone https://github.com/Jane84894/ha-lunar-sensor.git lunar_calendar
# 重启 HA
```

---

## 📊 所需传感器实体

确保以下实体在 HA 中存在：

### 虚拟机状态 (binary_sensor)
- `binary_sensor.ikuai_status` - iKuai 路由
- `binary_sensor.openwrt_status` - OpenWrt 路由
- `binary_sensor.ad_status` - AD 域控
- `binary_sensor.jike_status` - 集客 AC
- `binary_sensor.ubuntu_server_status` - Ubuntu 服务器
- `binary_sensor.synology_status` - 群晖 NAS
- `binary_sensor.ha_status` - HA 自身
- `binary_sensor.win11_status` - Windows 11
- `binary_sensor.hack_big_sur_status` - 黑苹果
- `binary_sensor.ct109_status` - CT109
- `binary_sensor.openclaw_status` - OpenClaw
- `binary_sensor.monitor_grafana_status` - Grafana 监控

### 传感器 (sensor)

**天气:**
- `sensor.openweathermap_temperature` - 温度
- `sensor.openweathermap_humidity` - 湿度
- `sensor.openweathermap_wind_speed` - 风速
- `sensor.openweathermap_apparent_temperature` - 体感温度
- `sensor.openweathermap_weather` - 天气状况

**PVE 监控:**
- `sensor.pve_cpu_usage` - CPU 使用率
- `sensor.pve_max_cpu` - 最大 CPU
- `sensor.pve_memory_usage` - 内存使用
- `sensor.pve_max_memory_usage` - 最大内存
- `sensor.pve_disk_usage` - 磁盘使用
- `sensor.pve_max_disk_usage` - 最大磁盘
- `sensor.pve_status` - PVE 状态

**路由器:**
- `sensor.ikuai_upload` - iKuai 上传速度
- `sensor.ikuai_download` - iKuai 下载速度
- `sensor.ikuai_online_user` - iKuai 在线设备数

**Clash:**
- `sensor.clash_shi_li_upload_speed` - 上传速度
- `sensor.clash_shi_li_download_speed` - 下载速度
- `sensor.clash_shi_li_connection_number` - 连接数

**AdGuard:**
- `sensor.adguard_home_dns_queries_blocked` - 已拦截查询数
- `sensor.adguard_home_dns_queries_blocked_ratio` - 拦截率
- `sensor.adguard_home_average_processing_speed` - 平均处理速度

**农历:**
- `sensor.nong_li_ri_qi` - 农历日期
- `sensor.nong_li_ri_qi_2` - 农历日期 (数字)
- `sensor.sheng_xiao` - 生肖
- `sensor.gan_zhi_nian` - 干支年

---

## 📁 文件说明

```
esp-smart-screen/
├── README.md                 # 本文件
├── smart-pda-fixed.yaml      # ESPHome 配置文件 ⭐
└── secrets.example.yaml      # 密钥模板
```

---

## 🚀 使用方法

### 1. 准备密钥文件

```bash
# 复制密钥模板
cp secrets.example.yaml secrets.yaml

# 编辑密钥文件
nano secrets.yaml
```

**需要修改的密钥:**
- `api_key` - ESPHome API 加密密钥
- `wifi_ssid` - WiFi 名称
- `wifi_password` - WiFi 密码

### 2. 上传到 ESPHome

**方法 1: ESPHome Dashboard**
1. 打开 ESPHome Dashboard
2. 点击 **New Device** 或选择现有设备
3. 点击 **Edit**
4. 复制 `smart-pda-fixed.yaml` 内容
5. 粘贴并 **Save**
6. 点击 **Install**

**方法 2: 命令行**
```bash
esphome upload smart-pda-fixed.yaml
```

### 3. 编译和上传

```bash
# 编译
esphome compile smart-pda-fixed.yaml

# 上传 (替换设备 IP)
esphome upload smart-pda-fixed.yaml --device 192.168.2.201
```

---

## 🎨 UI 页面

### 主页
- 时间日期
- 农历显示 (含生肖、干支年)
- 天气信息 (温度、湿度、风速、体感)
- HA 连接状态

### 应用菜单
- PVE 状态
- 路由器中心
- 智能家居
- 存储中心
- 系统状态
- 系统设置

### PVE 状态页
- CPU/内存/磁盘仪表盘
- 12 台虚拟机状态指示灯

### 路由器中心
- iKuai (主路由): 在线设备、上传/下载速度
- Clash (旁路由): 连接数、上传/下载速度
- AdGuard: 拦截数、拦截率、处理速度

### 系统状态页
- 网络信息 (IP、MAC、WiFi 信号)
- 运行状态 (运行时间、可用内存)

### 设置页
- 屏幕亮度调节
- 息屏时间设置
- 常亮模式开关
- 一键息屏
- 重启设备

---

## ⚙️ 配置选项

### 屏幕设置
```yaml
number.sleep_time: 息屏时间 (5-600 秒，默认 15 秒)
```

### 常亮模式
```yaml
globals.always_on_mode: 常亮模式 (true/false)
```

### 更新频率
```yaml
interval: 5s  # LVGL 刷新频率 (已优化)
```

---

## 🔧 故障排除

### 1. 编译失败
```bash
# 清理缓存
esphome clean smart-pda-fixed.yaml

# 重新编译
esphome compile smart-pda-fixed.yaml
```

### 2. 传感器显示 "--"
- 检查 HA 中对应实体是否存在
- 检查实体 ID 是否正确
- 检查 HA 与 ESPHome 的连接

### 3. 屏幕不显示
- 检查 GPIO 引脚定义
- 检查屏幕初始化序列
- 检查背光 PWM 配置

### 4. 触摸不灵敏
- 检查 I2C 引脚 (SDA: GPIO8, SCL: GPIO4)
- 检查触摸 IC 复位引脚 (GPIO38)
- 检查中断引脚 (GPIO3)

---

## 📝 更新日志

### v1.0 (2026-03-14)
- ✅ 添加生肖和干支年传感器支持
- ✅ 优化更新频率 (1 秒 → 5 秒)
- ✅ 添加空值检查防止崩溃
- ✅ 优化字体 glyphs 定义
- ✅ 添加内存保护

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [ESPHome](https://esphome.io/)
- [LVGL](https://lvgl.io/)
- [Home Assistant](https://www.home-assistant.io/)
