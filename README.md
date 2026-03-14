# ESPHome 智能屏中控 - Guition JC4827W543C

基于 ESP32-S3 的智能家居中控面板，集成 Home Assistant、农历显示、VM 监控、路由器状态等功能。

![ESP32-S3](https://img.shields.io/badge/ESP32--S3-480x272-blue)
![Home Assistant](https://img.shields.io/badge/Home_Assistant-Integration-blue)
![LVGL](https://img.shields.io/badge/LVGL-8.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📸 效果预览

> **[待补充：屏幕实拍照片/GIF]**

---

## 🎯 功能特性

- ✅ **480x272 彩屏显示** - QSPI DBI 驱动，流畅 UI
- ✅ **电容触摸** - GT911 触摸控制器
- ✅ **Home Assistant 集成** - 实时同步 HA 实体状态
- ✅ **农历显示** - 传统节日倒计时
- ✅ **VM 状态监控** - PVE 虚拟机运行状态
- ✅ **路由器监控** - iKuai/OpenWrt/AdGuard 实时数据
- ✅ **天气显示** - 温度、湿度、风速
- ✅ **自动息屏** - 可调节亮度 + 休眠时间

---

## 📦 硬件清单

| 组件 | 型号 | 数量 | 备注 |
|------|------|------|------|
| 主控板 | ESP32-S3 | 1 | 8MB PSRAM |
| 屏幕 | Guition JC4827W543C | 1 | 480x272 QSPI |
| 触摸 | GT911 | 1 | 电容触摸 |
| 杜邦线 | - | 若干 | 连接用 |

### 购买链接
> **[待补充：淘宝/拼多多/1688 链接]**

---

## 🔌 接线图

### GPIO 分配

| 功能 | GPIO | 备注 |
|------|------|------|
| QSPI CLK | GPIO47 | |
| QSPI D0 | GPIO21 | |
| QSPI D1 | GPIO48 | |
| QSPI D2 | GPIO40 | |
| QSPI D3 | GPIO39 | |
| QSPI CS | GPIO45 | |
| 背光 PWM | GPIO1 | |
| I2C SDA | GPIO8 | GT911 |
| I2C SCL | GPIO4 | GT911 |
| 触摸中断 | GPIO3 | GT911 |
| 触摸复位 | GPIO38 | GT911 |

> **[待补充：Fritzing 接线图]**

---

## 🚀 快速开始

### 1️⃣ 环境准备

```bash
# 安装 ESPHome
pip3 install esphome

# 或使用 Home Assistant 插件
# Home Assistant → 设置 → 插件 → ESPHome
```

### 2️⃣ 配置密钥

```bash
# 复制密钥模板
cp secrets.example.yaml secrets.yaml

# 编辑 secrets.yaml，填入你的信息
vim secrets.yaml
```

### 3️⃣ 编译上传

```bash
# 编译
esphome compile smart-pda.yaml

# 上传 (首次需要 USB 连接)
esphome upload smart-pda.yaml

# 后续可 OTA 更新
esphome upload smart-pda.yaml --device 192.168.2.XXX
```

---

## 🏠 Home Assistant 集成

### 必需实体

#### 农历传感器
```yaml
# 在 HA 的 configuration.yaml 中添加
python_script:
  lunar_sensor: |
    # 使用提供的 lunar_sensor.py 脚本
```

> **[待补充：农历传感器配置链接]**

#### VM 状态监控
```yaml
# 二进制传感器 (示例)
template:
  - binary_sensor:
      - name: "iKuai 状态"
        unique_id: ikuai_status
        state: "{{ is_state('binary_sensor.ikuai_status', 'on') }}"
```

#### 路由器数据
```yaml
# iKuai 上传/下载速度
sensor:
  - platform: rest
    resource: "http://192.168.2.1/api/status"
    name: "iKuai Upload"
```

### 完整 HA 配置
> **[待补充：ha-templates/ 目录链接]**

---

## 📁 文件说明

```
esp-smart-screen/
├── README.md                 # 本文件
├── smart-pda.yaml            # ESPHome 主配置
├── secrets.example.yaml      # 密钥模板 (复制为 secrets.yaml)
├── fonts/                    # 字体文件
│   ├── misans.ttf           # MiSans 字体
│   └── materialdesignicons-webfont.ttf
├── ha-templates/             # HA 模板配置
│   ├── lunar.yaml           # 农历传感器
│   ├── vm-status.yaml       # VM 状态
│   └── router.yaml          # 路由器监控
└── docs/
    ├── wiring.md            # 详细接线图
    └── build-guide.md       # 编译指南
```

---

## 🎨 UI 页面

### 主页
- 时间日期
- 农历显示
- 天气信息
- HA 连接状态

### 应用菜单
- PVE 状态
- 路由器中心
- 智能家居
- 存储中心
- 虚拟主机
- 设置

### PVE 状态页
- CPU/内存/磁盘使用率
- 11 台 VM 运行状态

### 路由器中心
- iKuai 主路由 (上传/下载/在线设备)
- OpenWrt 旁路由 (Clash 连接数)
- AdGuard Home (拦截统计)

### 设置页
- 屏幕亮度调节
- 自动息屏时间

---

## ⚙️ 配置说明

### WiFi 配置
```yaml
wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  fast_connect: false  # 根据网络环境调整
```

### 显示配置
```yaml
display:
  - platform: qspi_dbi
    model: CUSTOM
    dimensions:
      width: 480
      height: 272
    init_sequence: [...]  # 屏幕初始化序列
```

### LVGL 配置
```yaml
lvgl:
  buffer_size: 20%  # 根据 PSRAM 大小调整
  color_depth: 16
```

---

## 🔧 故障排除

### 屏幕不亮
- 检查 GPIO 接线是否正确
- 确认背光 PWM 配置
- 尝试调整 `init_sequence`

### 触摸无响应
- 检查 GT911 中断/复位引脚
- 确认 I2C 地址 (默认 0x5D)
- 尝试 `ignore_strapping_warning: true`

### HA 连接失败
- 确认 API 密钥正确
- 检查 HA 是否启用 `api:` 组件
- 查看日志 `esphome logs smart-pda.yaml`

### 编译错误
```bash
# 清理缓存
esphome clean smart-pda.yaml

# 重新编译
esphome compile smart-pda.yaml
```

---

## 📊 功耗数据

| 状态 | 电流 | 备注 |
|------|------|------|
| 屏幕常亮 | ~300mA | 背光 100% |
| 自动息屏 | ~50mA | 背光关闭 |
| 深度睡眠 | ~10mA | 需外接唤醒 |

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

### 你可以贡献
- 🐛 Bug 修复
- 📝 文档完善
- 🎨 UI 优化
- 🔌 新功能

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [ESPHome](https://esphome.io/)
- [LVGL](https://lvgl.io/)
- [Home Assistant](https://www.home-assistant.io/)
- [Guition](https://github.com/Guition)

---

## 📬 联系方式

- GitHub: [@Jane84894](https://github.com/Jane84894)
- 问题反馈：[Issues](https://github.com/Jane84894/esp-smart-screen/issues)

---

**[待补充：演示视频/二维码]**
