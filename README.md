# ESPHome Smart PDA - 专业版

基于 ESP32-S3 的智能家居控制面板，使用 LVGL 图形库，支持精美的 UI 界面、动画效果和完整的传感器集成。

## ✨ 主要特性

- 🖥️ **480x272 QSPI 显示屏** - 高速显示驱动
- 🎨 **LVGL 图形界面** - 支持动画和复杂 UI
- 🌤️ **天气显示** - 温度、湿度、风速、天气状况
- 📅 **农历显示** - 农历日期、生肖、干支年
- 🖥️ **PVE 服务器监控** - CPU/内存/磁盘使用率仪表盘
- 🌐 **路由器监控** - iKuai、Clash、AdGuard Home
- 📊 **12 台虚拟机状态** - 实时状态指示灯
- ⚙️ **系统信息** - 网络信息、运行时间、内存状态
- 🎯 **控制面板** - 亮度调节、息屏时间、常亮模式

## 📦 所需 Home Assistant 集成

### 必需集成

| 集成名称 | 用途 | 安装方式 |
|---------|------|---------|
| **OpenWeatherMap** | 天气数据 | HA 内置集成 |
| **Proxmox VE** | PVE 服务器监控 | HACS: [Proxmox VE Integration](https://github.com/dougite/proxmoxve-hass) |
| **AdGuard Home** | 广告拦截统计 | HA 内置集成 |
| **Clash** | 代理流量监控 | HACS: [Clash](https://github.com/ha0z01/ha_clash) |
| **iKuai** | 爱快路由器监控 | HACS: [iKuai](https://github.com/SimonKniep/ha-ikuai) |
| **农历传感器** | 农历日期显示 | 手动安装 |

### 所需传感器实体

**天气:**
- `sensor.openweathermap_temperature`
- `sensor.openweathermap_humidity`
- `sensor.openweathermap_wind_speed`
- `sensor.openweathermap_apparent_temperature`
- `sensor.openweathermap_weather`

**PVE 监控:**
- `sensor.pve_cpu_usage`
- `sensor.pve_max_cpu`
- `sensor.pve_memory_usage`
- `sensor.pve_max_memory_usage`
- `sensor.pve_disk_usage`
- `sensor.pve_max_disk_usage`
- `sensor.pve_status`

**路由器:**
- `sensor.ikuai_upload`
- `sensor.ikuai_download`
- `sensor.ikuai_online_user`
- `sensor.clash_shi_li_upload_speed`
- `sensor.clash_shi_li_download_speed`
- `sensor.clash_shi_li_connection_number`
- `sensor.adguard_home_dns_queries_blocked`
- `sensor.adguard_home_dns_queries_blocked_ratio`
- `sensor.adguard_home_average_processing_speed`

**农历:**
- `sensor.nong_li_ri_qi`
- `sensor.nong_li_ri_qi_2`
- `sensor.sheng_xiao`
- `sensor.gan_zhi_nian`

**虚拟机状态:**
- `binary_sensor.ikuai_status`
- `binary_sensor.openwrt_status`
- `binary_sensor.ad_status`
- `binary_sensor.jike_status`
- `binary_sensor.ubuntu_server_status`
- `binary_sensor.synology_status`
- `binary_sensor.ha_status`
- `binary_sensor.win11_status`
- `binary_sensor.hack_big_sur_status`
- `binary_sensor.ct109_status`
- `binary_sensor.openclaw_status`
- `binary_sensor.monitor_grafana_status`

## 📁 文件说明

```
esp-smart-screen/
├── README.md                 # 本文件
├── smart-pda.yaml            # ESPHome 主配置
└── secrets.yaml              # 密钥文件 (不包含在仓库中)
```

## 🚀 使用方法

### 1. 准备密钥文件

创建 `secrets.yaml` 文件：

```yaml
wifi_ssid: "你的 WiFi 名称"
wifi_password: "你的 WiFi 密码"
api_key: "你的 API 加密密钥 (base64 编码，32 字节)"
```

### 2. 上传到 ESPHome

**方法 1: ESPHome Dashboard**
1. 打开 ESPHome Dashboard
2. 点击 **New Device** 或选择现有设备
3. 点击 **Edit**
4. 复制 `smart-pda.yaml` 内容
5. 粘贴并 **Save**
6. 点击 **Install**

**方法 2: 命令行**
```bash
esphome upload smart-pda.yaml
```

### 3. 编译和上传

```bash
# 编译
esphome compile smart-pda.yaml

# 上传 (替换设备 IP)
esphome upload smart-pda.yaml --device 192.168.2.201
```

## 🎨 UI 页面

### 主页
- 时间日期
- 农历显示 (含生肖、干支年)
- 天气信息
- HA 连接状态
- WiFi 状态

### 应用菜单
- PVE 服务器
- 路由器
- 智能家居
- 网络存储
- 系统信息
- 控制面板

### PVE 状态页
- CPU/内存/磁盘仪表盘 (带动画)
- 12 台虚拟机状态指示灯

### 路由器中心
- iKuai (主路由): 在线设备、上传/下载速度
- Clash (旁路由): 连接数、上传/下载速度
- AdGuard: 拦截数、拦截率、处理速度

### 系统信息页
- 网络信息 (IP、MAC、WiFi 信号)
- 性能状态 (运行时间、可用内存)

### 控制面板
- 屏幕亮度调节
- 息屏时间设置
- 常亮模式开关
- 一键息屏
- 重启设备

## ⚙️ 配置选项

### 硬件配置
```yaml
esp32:
  board: esp32-s3-devkitc-1
  framework:
    type: esp-idf

psram:
  mode: octal
  speed: 80MHz
```

### 显示屏配置
```yaml
display:
  - platform: qspi_dbi
    data_rate: 20MHz  # 可调整：20-40MHz
    dimensions:
      width: 480
      height: 272
```

### LVGL 配置
```yaml
lvgl:
  buffer_size: 100%  # 可调整：50-100%
  color_depth: 16
```

### 更新频率
```yaml
interval:
  - interval: 5s  # LVGL 刷新频率
```

## 🔧 故障排除

### 编译失败
```bash
# 清理缓存
esphome clean smart-pda.yaml

# 重新编译
esphome compile smart-pda.yaml
```

### 内存不足
- 减少 `lvgl.buffer_size` (100% → 50%)
- 降低 `data_rate` (40MHz → 20MHz)
- 减少字体大小和数量

### 传感器显示 "--"
- 检查 HA 中对应实体是否存在
- 检查实体 ID 是否正确
- 检查 HA 与 ESPHome 的连接

### 屏幕不显示
- 检查 GPIO 引脚定义
- 检查屏幕初始化序列
- 检查背光 PWM 配置

### 触摸不灵敏
- 检查 I2C 引脚 (SDA: GPIO8, SCL: GPIO4)
- 检查触摸 IC 复位引脚 (GPIO38)
- 检查中断引脚 (GPIO3)

## 📝 更新日志

### v2.0 (2026-03-14)
- ✅ 使用 ESP-IDF 框架
- ✅ 优化 LVGL 动画效果
- ✅ 改进 UI 对齐和布局
- ✅ 添加页面切换动画
- ✅ 优化字体系统
- ✅ 改进传感器数据格式化

### v1.0 (2026-03-10)
- ✅ 初始版本
- ✅ 基本 LVGL 界面
- ✅ 传感器集成

## 📄 许可证

MIT License

## 🙏 致谢

- [ESPHome](https://esphome.io/)
- [LVGL](https://lvgl.io/)
- [Home Assistant](https://www.home-assistant.io/)
- [Guition](https://github.com/Guition)

## 📮 联系方式

- GitHub: [@D1ts1337](https://github.com/D1ts1337)
- Issues: [Issues](https://github.com/D1ts1337/esp-smart-screen/issues)

---

**如果这个项目对你有帮助，请给个 Star! ⭐**
