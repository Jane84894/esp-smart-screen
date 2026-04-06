# MiCam 项目部署方案

**项目名称:** MiCam (米家摄像头)  
**项目地址:** https://github.com/miiot/micam  
**部署日期:** 2026-03-15  
**部署者:** 爪爪 (Claw)

---

## 📋 项目概述

### 项目简介
MiCam 是一个基于 ESP32 的网络摄像头项目，支持：
- RTSP 视频流
- Web 界面访问
- 运动检测
- 照片捕捉
- 远程访问

### 支持的设备
- ✅ ESP32-CAM
- ✅ ESP32-S3
- ✅ ESP32-WROVER
- ✅ 其他带摄像头的 ESP32 开发板

---

## 🛠️ 部署前准备

### 1. 硬件准备

#### 必需硬件
```
□ ESP32 开发板 (推荐 ESP32-S3)
□ 摄像头模块 (OV2640/OV5640)
□ USB 数据线
□ 5V 电源适配器
□ 杜邦线 (如需外接)
```

#### 可选硬件
```
□ microSD 卡模块
□ 红外灯 (夜视)
□ 外壳
□ 三脚架
```

### 2. 软件准备

#### 必需软件
```
□ Arduino IDE 或 PlatformIO
□ ESP32 开发环境
□ Git
```

#### 安装 ESP32 开发环境

**方法 1: Arduino IDE**
```bash
# 1. 安装 Arduino IDE
# 下载：https://www.arduino.cc/en/software

# 2. 添加 ESP32 开发板支持
# 文件 → 首选项 → 附加开发板管理器网址
# 添加：https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json

# 3. 安装开发板
# 工具 → 开发板 → 开发板管理器
# 搜索 "ESP32" 并安装
```

**方法 2: PlatformIO (推荐)**
```bash
# 1. 安装 VS Code
# 下载：https://code.visualstudio.com/

# 2. 安装 PlatformIO 插件
# 扩展 → 搜索 "PlatformIO" → 安装

# 3. 安装 ESP32 平台
# PlatformIO Home → Platforms → Embedded → Espressif 32 → Install
```

### 3. 下载项目

```bash
# 方法 1: Git 克隆
git clone https://github.com/miiot/micam.git
cd micam

# 方法 2: 下载 ZIP
# https://github.com/miiot/micam/archive/refs/heads/main.zip
# 解压后进入目录
```

---

## 📦 部署流程

### 步骤 1: 配置项目

#### 使用 PlatformIO (推荐)

**1. 打开项目**
```bash
# 在 VS Code 中打开 micam 目录
# PlatformIO 会自动识别项目
```

**2. 配置 platformio.ini**

编辑 `platformio.ini` 文件：
```ini
[env:esp32cam]
platform = espressif32
board = esp32cam
framework = arduino

# 摄像头配置
board_build.mcu = esp32
board_build.f_cpu = 240000000L
board_build.f_flash = 80000000L
board_build.flash_mode = qio

# 串口配置
monitor_speed = 115200
upload_speed = 921600

# 分区表
board_build.partitions = min_spiffs.csv

# 编译标志
build_flags = 
    -DCAMERA_MODEL_ESP32_CAM
    -DBOARD_HAS_PSRAM
    -DARDUINO_ARCH_ESP32
    -DCONFIG_SPIRAM_USE_MALLOC
```

**3. 配置摄像头引脚**

编辑 `src/camera_pins.h` (或相应文件)：

```cpp
// ESP32-CAM 引脚定义
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22
```

**4. 配置 WiFi 和网络**

编辑 `src/config.h` (或相应文件)：

```cpp
// WiFi 配置
#define WIFI_SSID "你的 WiFi 名称"
#define WIFI_PASSWORD "你的 WiFi 密码"

// 或者使用动态配置 (首次启动后通过串口配置)
// #define WIFI_SSID ""
// #define WIFI_PASSWORD ""

// 网络配置
#define RTSP_PORT 8554
#define HTTP_PORT 80
#define STREAM_PORT 81

// 视频流配置
#define XCLK_MHZ 20
#define LEDC_CHANNEL 7
#define LEDC_TIMER_50HZ 0
#define LEDC_DUTY 255
```

### 步骤 2: 编译项目

**使用 PlatformIO:**
```bash
# 在 VS Code 中
# 点击 PlatformIO 底部工具栏的 ✓ (Build)

# 或使用命令行
pio run
```

**使用 Arduino IDE:**
```bash
# 工具 → 开发板 → ESP32 Dev Module
# 点击 编译按钮 (✓)
```

### 步骤 3: 烧录固件

**方法 1: PlatformIO (推荐)**
```bash
# 连接 ESP32 到电脑
# 确保端口正确 (如 /dev/ttyUSB0 或 COM3)

# 烧录
pio run --target upload

# 或指定端口
pio run --target upload --upload-port /dev/ttyUSB0
```

**方法 2: Arduino IDE**
```bash
# 工具 → 端口 → 选择正确的端口
# 点击 上传按钮 (→)
```

**方法 3: esptool.py**
```bash
# 安装 esptool
pip3 install esptool

# 擦除 Flash
esptool.py --chip esp32 --port /dev/ttyUSB0 erase_flash

# 烧录固件
esptool.py --chip esp32 --port /dev/ttyUSB0 \
  --baud 921600 --before default_reset --after hard_reset \
  write_flash -z --flash_mode dio --flash_freq 80m --flash_size 4MB \
  0x1000 .pio/build/esp32cam/bootloader/bootloader.bin \
  0x8000 .pio/build/esp32cam/partitions.bin \
  0x10000 .pio/build/esp32cam/firmware.bin
```

### 步骤 4: 配置网络

**首次启动配置:**

1. **打开串口监视器**
   ```bash
   # PlatformIO
   pio device monitor --baud 115200

   # Arduino IDE
   # 工具 → 串口监视器 → 波特率 115200
   ```

2. **配置 WiFi**
   ```
   设备启动后会创建 WiFi 热点
   名称：MiCam-XXXX
   密码：micam1234

   连接到热点后访问：192.168.4.1
   配置你的 WiFi 网络
   ```

3. **获取设备 IP**
   ```
   连接成功后，串口会显示分配的 IP 地址
   例如：192.168.2.100
   ```

---

## 🎥 访问摄像头

### 1. Web 界面访问

```
http://[设备 IP]/
例如：http://192.168.2.100/
```

**功能:**
- ✅ 实时视频预览
- ✅ 拍照
- ✅ 参数配置
- ✅ WiFi 设置

### 2. RTSP 视频流

```
rtsp://[设备 IP]:8554/mjpeg/1
rtsp://[设备 IP]:8554/mjpeg/2
rtsp://[设备 IP]:8554/mjpeg/3

# 例如：
rtsp://192.168.2.100:8554/mjpeg/1
```

**使用 VLC 播放器:**
```bash
# 打开 VLC
# 媒体 → 打开网络串流
# 输入：rtsp://192.168.2.100:8554/mjpeg/1
# 点击 播放
```

**使用 FFmpeg:**
```bash
# 录制视频
ffmpeg -i rtsp://192.168.2.100:8554/mjpeg/1 \
  -c:v copy output.mp4

# 转码为 H.264
ffmpeg -i rtsp://192.168.2.100:8554/mjpeg/1 \
  -c:v libx264 -preset ultrafast -tune zerolatency \
  -c:a aac output.mp4
```

### 3. MJPEG 流

```
http://[设备 IP]:81/stream
例如：http://192.168.2.100:81/stream
```

**在浏览器中直接观看:**
```
http://192.168.2.100:81/stream
```

**在 Home Assistant 中集成:**
```yaml
# configuration.yaml
camera:
  - platform: mjpeg
    name: MiCam
    mjpeg_url: http://192.168.2.100:81/stream
    still_image_url: http://192.168.2.100:81/capture
```

---

## 🔧 高级配置

### 1. 运动检测配置

编辑 `src/motion_config.h`:
```cpp
// 运动检测灵敏度 (1-100)
#define MOTION_SENSITIVITY 50

// 检测区域 (百分比)
#define DETECTION_AREA 80

// 冷却时间 (秒)
#define COOLDOWN_TIME 10

// 触发后录像时长 (秒)
#define RECORD_DURATION 30
```

### 2. 照片存储配置

```cpp
// 启用 SD 卡存储
#define USE_SDCARD true
#define SDCARD_CS_PIN 13

// 照片保存路径
#define PHOTO_PATH "/sdcard/photos"

// 照片命名格式
#define PHOTO_FORMAT "IMG_%Y%m%d_%H%M%S.jpg"

// 自动上传到服务器
#define AUTO_UPLOAD false
#define UPLOAD_URL "http://your-server.com/upload"
```

### 3. 夜视模式配置

```cpp
// 启用红外灯
#define USE_IR_LED true
#define IR_LED_PIN 4

// 自动夜视
#define AUTO_NIGHT_VISION true
#define LIGHT_THRESHOLD 50

// 手动控制
#define MANUAL_IR_BRIGHTNESS 200
```

### 4. 视频质量配置

```cpp
// 分辨率设置
// FRAMESIZE_QQVGA    160x120
// FRAMESIZE_QCIF     176x144
// FRAMESIZE_HQVGA    240x176
// FRAMESIZE_240X240  240x240
// FRAMESIZE_QVGA     320x240
// FRAMESIZE_CIF      400x296
// FRAMESIZE_HVGA     480x320
// FRAMESIZE_VGA      640x480
// FRAMESIZE_SVGA     800x600
// FRAMESIZE_XGA      1024x768
// FRAMESIZE_HD       1280x720
// FRAMESIZE_SXGA     1280x1024
// FRAMESIZE_UXGA     1600x1200

#define CAMERA_RESOLUTION FRAMESIZE_HD

// JPEG 质量 (10-63, 数字越小质量越高)
#define JPEG_QUALITY 12

// 帧率 (FPS)
#define FPS 25

// 增益上限
#define GAINCEILING_2X
// #define GAINCEILING_4X
// #define GAINCEILING_8X
// #define GAINCEILING_16X
// #define GAINCEILING_32X
// #define GAINCEILING_64X
// #define GAINCEILING_128X
```

---

## 🔗 集成到 Home Assistant

### 方法 1: RTSP 集成

```yaml
# configuration.yaml
stream:
  rtsp:
    rtsp://192.168.2.100:8554/mjpeg/1

camera:
  - platform: generic
    name: MiCam Front Door
    still_image_url: http://192.168.2.100:81/capture
    stream_source: rtsp://192.168.2.100:8554/mjpeg/1
```

### 方法 2: MJPEG 集成

```yaml
# configuration.yaml
camera:
  - platform: mjpeg
    name: MiCam
    mjpeg_url: http://192.168.2.100:81/stream
    still_image_url: http://192.168.2.100:81/capture
    username: !secret micam_user
    password: !secret micam_password
```

### 方法 3: ONVIF 集成 (如果支持)

```yaml
# configuration.yaml
onvif:
  - host: 192.168.2.100
    port: 8554
    username: !secret micam_user
    password: !secret micam_password
```

### 在 Lovelace 中显示

```yaml
# ui-lovelace.yaml
type: picture-entity
entity: camera.micam
camera_view: live
name: 门口摄像头

# 或使用更高级的卡片
type: custom:webrtc-camera
entity: camera.micam
url: rtsp://192.168.2.100:8554/mjpeg/1
```

---

## 🐛 故障排除

### 问题 1: 无法烧录固件

**症状:**
```
A fatal error occurred: Failed to connect to ESP32
```

**解决方案:**
```bash
# 1. 检查连接
# 确保 USB 线连接正确

# 2. 进入下载模式
# 按住 BOOT 按钮，然后按 RESET
# 松开 RESET，然后松开 BOOT

# 3. 检查端口
ls /dev/ttyUSB*  # Linux
# 或
Get-ItemProperty -Path "HKLM:\HARDWARE\DEVICEMAP\SERIALCOMM"  # Windows

# 4. 安装驱动
# CH340: https://github.com/nodemcu/nodemcu-devkit/tree/master/drivers
# CP2102: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
```

### 问题 2: 摄像头无法初始化

**症状:**
```
E (1234) camera: Camera init failed
```

**解决方案:**
```cpp
// 1. 检查引脚定义
// 确认 camera_pins.h 中的引脚定义正确

// 2. 检查摄像头连接
// 确保排线连接正确且牢固

// 3. 检查电源
// 确保电源充足 (建议 5V 2A)

// 4. 降低 XCLK 频率
#define XCLK_MHZ 10  // 从 20 降到 10
```

### 问题 3: WiFi 连接失败

**症状:**
```
W (5678) wifi: connect failed
```

**解决方案:**
```cpp
// 1. 检查 WiFi 配置
#define WIFI_SSID "正确的 WiFi 名称"
#define WIFI_PASSWORD "正确的密码"

// 2. 检查 WiFi 信号强度
// 确保设备在 WiFi 覆盖范围内

// 3. 使用静态 IP
#include <WiFi.h>

IPAddress local_IP(192, 168, 2, 100);
IPAddress gateway(192, 168, 2, 1);
IPAddress subnet(255, 255, 255, 0);

WiFi.config(local_IP, gateway, subnet);
```

### 问题 4: 视频流卡顿

**症状:**
- 视频卡顿
- 帧率低
- 延迟高

**解决方案:**
```cpp
// 1. 降低分辨率
#define CAMERA_RESOLUTION FRAMESIZE_SVGA  // 从 HD 降到 SVGA

// 2. 降低帧率
#define FPS 15  // 从 25 降到 15

// 3. 优化 JPEG 质量
#define JPEG_QUALITY 15  // 从 12 升到 15

// 4. 启用 PSRAM
#define BOARD_HAS_PSRAM
```

---

## 📊 性能优化

### 内存优化

```cpp
// 启用 PSRAM
#define BOARD_HAS_PSRAM
config.psram_found = true;

// 优化内存分配
config.fb_count = 2;
config.fb_location = CAMERA_FB_IN_PSRAM;
```

### 性能优化

```cpp
// 优化 XCLK 频率
#define XCLK_MHZ 20  // 可调整 10-24

// 优化 JPEG 质量
#define JPEG_QUALITY 12  // 10-63

// 优化帧率
#define FPS 25  // 15-30
```

### 功耗优化

```cpp
// 启用省电模式
#define POWER_SAVE_MODE true

// 自动关闭 LED
#define AUTO_LED_OFF true
#define LED_OFF_TIMEOUT 60  // 秒
```

---

## 🔐 安全配置

### 1. 启用认证

```cpp
// 启用 Web 界面认证
#define USE_AUTH true
#define ADMIN_USER "admin"
#define ADMIN_PASS "你的强密码"

// 启用流媒体认证
#define STREAM_USER "stream"
#define STREAM_PASS "你的流密码"
```

### 2. 启用 HTTPS

```cpp
// 启用 HTTPS (需要证书)
#define USE_HTTPS true
#define SSL_CERT_PATH "/spiffs/cert.pem"
#define SSL_KEY_PATH "/spiffs/key.pem"
```

### 3. 防火墙配置

```cpp
// 只允许特定 IP 访问
#define ALLOWED_IPS {"192.168.2.100", "192.168.2.101"}
#define BLOCK_UNKNOWN_IPS true
```

---

## 📁 项目文件结构

```
micam/
├── README.md              # 项目说明
├── platformio.ini         # PlatformIO 配置
├── src/
│   ├── main.cpp          # 主程序
│   ├── camera_pins.h     # 摄像头引脚定义
│   ├── config.h          # 配置文件
│   ├── wifi_manager.cpp  # WiFi 管理
│   ├── rtsp_server.cpp   # RTSP 服务器
│   ├── web_server.cpp    # Web 服务器
│   └── motion_detect.cpp # 运动检测
├── lib/                   # 依赖库
├── data/                  # 数据文件
└── docs/                  # 文档
```

---

## 📝 部署检查清单

### 部署前
```
□ 准备硬件 (ESP32 + 摄像头)
□ 安装开发环境 (Arduino/PlatformIO)
□ 下载项目代码
□ 配置引脚定义
□ 配置 WiFi 信息
```

### 编译时
```
□ 选择正确的开发板
□ 配置编译选项
□ 编译项目 (无错误)
□ 检查固件大小
```

### 烧录时
```
□ 连接设备
□ 进入下载模式
□ 烧录固件
□ 验证烧录成功
```

### 配置时
```
□ 连接 WiFi 热点
□ 配置 WiFi 网络
□ 获取设备 IP
□ 测试 Web 界面
□ 测试视频流
```

### 集成时
```
□ 配置 Home Assistant
□ 添加摄像头实体
□ 配置 Lovelace 卡片
□ 测试自动化
```

---

## 🎯 快速部署 (15 分钟)

```bash
# 1. 下载项目 (2 分钟)
git clone https://github.com/miiot/micam.git
cd micam

# 2. 配置 (3 分钟)
# 编辑 src/config.h
# 修改 WiFi 名称和密码

# 3. 编译 (5 分钟)
pio run

# 4. 烧录 (3 分钟)
pio run --target upload

# 5. 配置网络 (2 分钟)
# 连接热点 MiCam-XXXX
# 访问 192.168.4.1 配置 WiFi

# 6. 测试 (立即)
# 访问 http://[设备 IP]/
# 观看 rtsp://[设备 IP]:8554/mjpeg/1
```

---

## 📞 获取帮助

### 官方资源
- GitHub: https://github.com/miiot/micam
- Issues: https://github.com/miiot/micam/issues
- Wiki: https://github.com/miiot/micam/wiki

### 社区资源
- ESPHome 论坛: https://community.home-assistant.io/c/esphome
- Home Assistant 论坛: https://community.home-assistant.io/

---

## 📊 部署成功标志

```
✅ 设备启动成功 (串口有输出)
✅ WiFi 连接成功 (获取到 IP)
✅ Web 界面可访问
✅ 视频流可观看
✅ 延迟在可接受范围内 (<500ms)
✅ 帧率稳定 (>15 FPS)
```

---

**部署方案已完成，祝你部署成功！** 🦞

**END OF DOCUMENT**
