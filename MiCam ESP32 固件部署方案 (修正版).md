# MiCam ESP32 固件部署方案 (修正版)

**项目:** MiCam - ESP32 网络摄像头固件  
**项目地址:** https://github.com/miiot/micam  
**部署日期:** 2026-03-15  
**设备类型:** ESP32 嵌入式设备 (不是电脑软件！)

---

## ⚠️ 重要说明

**MiCam 是运行在 ESP32 硬件上的固件，不是电脑软件！**

### 你需要准备：
```
✅ ESP32 开发板 (如 ESP32-CAM)
✅ 摄像头模块 (OV2640)
✅ USB 转 TTL 转换器
✅ 5V 电源
✅ 电脑 (用于编译和烧录)
```

### 不需要：
```
❌ 不需要在电脑上运行
❌ 不需要安装 Windows/Mac 软件
❌ 不需要服务器
```

---

## 🛠️ 正确的部署流程

### 步骤 1: 准备硬件

#### 必需硬件
```
□ ESP32-CAM 开发板 (~¥30)
   - ESP32-S 芯片
   - OV2640 摄像头
   - microSD 卡槽

□ USB 转 TTL 转换器 (~¥10)
   - CP2102 或 CH340
   - 用于烧录固件

□ 5V 电源适配器
   - 或 5V USB 电源

□ 杜邦线
   - 母对母 10 根
```

#### 接线图
```
USB 转 TTL     ESP32-CAM
─────────     ─────────
5V        →   5V
GND       →   GND
TX        →   U0R (GPIO3)
RX        →   U0T (GPIO1)

烧录时需要：
GPIO0     →   GND  (进入下载模式)
```

---

### 步骤 2: 准备软件环境

#### 在电脑上安装 (只需一次)

**1. 安装 Arduino IDE**
```
下载：https://www.arduino.cc/en/software
选择你的系统：Windows / macOS / Linux
```

**2. 安装 ESP32 开发板支持**
```
打开 Arduino IDE
文件 → 首选项

附加开发板管理器网址：
https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json

工具 → 开发板 → 开发板管理器
搜索 "ESP32"
安装 "esp32 by Espressif Systems"
```

**3. 安装 USB 驱动**
```
CP2102 驱动：
https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers

CH340 驱动：
http://www.wch.cn/downloads/CH341SER_ZIP.html
```

---

### 步骤 3: 下载 MiCam 代码

**方法 1: Git 克隆**
```bash
# 打开命令行 (CMD/PowerShell/Terminal)
cd Desktop
git clone https://github.com/miiot/micam.git
cd micam
```

**方法 2: 下载 ZIP**
```
1. 打开 https://github.com/miiot/micam
2. 点击 "Code" → "Download ZIP"
3. 解压到桌面
4. 进入 micam 文件夹
```

---

### 步骤 4: 配置 MiCam

**1. 打开 Arduino 项目**
```
打开 Arduino IDE
文件 → 打开
选择 micam/micam.ino
```

**2. 配置 WiFi**
```cpp
// 在 micam.ino 中找到：
const char* wifi_ssid = "你的 WiFi 名称";
const char* wifi_password = "你的 WiFi 密码";
```

**3. 配置摄像头型号**
```cpp
// 在 camera_pins.h 中选择你的摄像头：
#if defined(CAMERA_MODEL_ESP32_CAM)
  // ESP32-CAM 使用这个
#elif defined(CAMERA_MODEL_AI_THINKER)
  // AI-Thinker ESP32-CAM 使用这个
#endif
```

**4. 配置视频质量**
```cpp
// 在 micam.ino 中：
#define CAMERA_MODEL_XGA  // 1024x768
// 或
#define CAMERA_MODEL_HD   // 1280x720
```

---

### 步骤 5: 编译固件

**1. 选择开发板**
```
工具 → 开发板 → ESP32 Arduino → "ESP32 Dev Module"
```

**2. 配置上传设置**
```
工具 → Upload Speed → "921600"
工具 → 端口 → 选择你的 COM 端口 (如 COM3)
```

**3. 编译**
```
点击 ✓ (编译按钮)
等待编译完成 (约 2-5 分钟)
```

---

### 步骤 6: 烧录固件到 ESP32

**1. 进入下载模式**
```
1. 按住 ESP32-CAM 上的 BOOT 按钮
2. 按下 RESET 按钮
3. 松开 RESET 按钮
4. 松开 BOOT 按钮
```

**2. 上传固件**
```
点击 → (上传按钮)
等待上传完成 (约 1-2 分钟)
```

**3. 重启设备**
```
按下 RESET 按钮
设备开始运行
```

---

### 步骤 7: 配置网络

**1. 连接热点**
```
ESP32-CAM 启动后会创建 WiFi 热点
名称：MiCam-XXXX
密码：micam1234

用手机/电脑连接到这个热点
```

**2. 配置 WiFi**
```
浏览器访问：192.168.4.1
输入你的 WiFi 名称和密码
点击保存
```

**3. 获取 IP 地址**
```
打开串口监视器 (115200 波特率)
查看分配的 IP 地址
例如：192.168.2.100
```

---

### 步骤 8: 访问摄像头

**1. Web 界面**
```
浏览器访问：http://192.168.2.100/
可以看到实时视频
可以拍照
可以调节参数
```

**2. 视频流地址**
```
MJPEG 流：http://192.168.2.100:81/stream
RTSP 流：rtsp://192.168.2.100:8554/mjpeg/1
```

**3. 在 VLC 中观看**
```
打开 VLC 播放器
媒体 → 打开网络串流
输入：rtsp://192.168.2.100:8554/mjpeg/1
点击播放
```

---

## 🏠 集成到 Home Assistant

### 方法 1: MJPEG 摄像头

```yaml
# configuration.yaml
camera:
  - platform: mjpeg
    name: ESP32 Camera
    mjpeg_url: http://192.168.2.100:81/stream
    still_image_url: http://192.168.2.100:81/capture
```

### 方法 2: Generic RTSP

```yaml
# configuration.yaml
camera:
  - platform: generic
    name: ESP32 Camera
    stream_source: rtsp://192.168.2.100:8554/mjpeg/1
    still_image_url: http://192.168.2.100:81/capture
```

### 在 Lovelace 中显示

```yaml
type: picture-entity
entity: camera.esp32_camera
camera_view: live
name: 门口摄像头
```

---

## 🔧 常见问题

### Q1: 无法上传固件

**错误信息:**
```
A fatal error occurred: Failed to connect to ESP32
```

**解决方案:**
```
1. 检查 USB 连接是否牢固
2. 确保进入了下载模式 (BOOT + RESET)
3. 检查 COM 端口是否正确
4. 安装正确的 USB 驱动
5. 尝试降低上传速度到 115200
```

### Q2: 摄像头无法初始化

**错误信息:**
```
E (1234) camera: Camera init failed
```

**解决方案:**
```
1. 检查摄像头排线是否插好
2. 检查摄像头方向是否正确
3. 确认选择了正确的摄像头型号
4. 检查电源是否充足 (建议 5V 2A)
```

### Q3: 连接不上 WiFi

**解决方案:**
```
1. 确保 WiFi 名称和密码正确
2. 确保是 2.4GHz WiFi (ESP32 不支持 5G)
4. 确保 WiFi 信号足够强
5. 尝试靠近路由器
```

### Q4: 视频很卡

**解决方案:**
```
1. 降低分辨率 (XGA → SVGA)
2. 降低帧率 (25 → 15)
3. 降低 JPEG 质量 (12 → 15)
4. 确保电源充足
```

---

## 📊 完整的烧录接线图

```
USB 转 TTL 转换器     ESP32-CAM 开发板
───────────────     ────────────────
5V              →   5V
GND             →   GND
TX (发送)       →   U0R (GPIO3)
RX (接收)       →   U0T (GPIO1)

烧录时需要短接：
GPIO0           →   GND  (进入下载模式)

正常工作时断开：
GPIO0           →   悬空 (正常运行)
```

---

## ⚡ 快速部署流程 (30 分钟)

```
1. 购买硬件 (快递 3 天)
   □ ESP32-CAM 开发板
   □ USB 转 TTL
   □ 杜邦线

2. 安装软件 (10 分钟)
   □ Arduino IDE
   □ ESP32 开发板
   □ USB 驱动

3. 下载代码 (2 分钟)
   □ Git 克隆或下载 ZIP

4. 配置代码 (5 分钟)
   □ 配置 WiFi
   □ 配置摄像头

5. 编译固件 (5 分钟)
   □ 点击编译

6. 烧录固件 (5 分钟)
   □ 进入下载模式
   □ 上传固件
   □ 重启设备

7. 配置网络 (3 分钟)
   □ 连接热点
   □ 配置 WiFi

8. 测试 (立即)
   □ 访问 Web 界面
   □ 观看视频流
```

---

## 📦 推荐购买清单

### 基础套装 (~¥50)
```
□ ESP32-CAM 开发板 × 1 (约¥25)
□ USB 转 TTL (CP2102) × 1 (约¥10)
□ 杜邦线 (母对母) × 10 (约¥5)
□ 5V 电源适配器 × 1 (约¥10)
```

### 推荐套装 (~¥80)
```
□ ESP32-CAM 开发板 × 2 (约¥50)
□ USB 转 TTL × 1 (约¥10)
□ 杜邦线 × 20 (约¥10)
□ 5V 电源 × 2 (约¥20)
□ 外壳 × 1 (约¥10)
```

---

## ⚠️ 重要提醒

### 这是 ESP32 固件，不是电脑软件！

**你需要：**
- ✅ ESP32 硬件开发板
- ✅ 烧录工具
- ✅ 编译环境

**你不需要：**
- ❌ 在电脑上运行程序
- ❌ 安装 Windows 软件
- ❌ 购买服务器

---

## 📝 总结

**MiCam 是一个 ESP32 摄像头固件项目：**

1. **在电脑上编译** - 使用 Arduino IDE
2. **烧录到 ESP32** - 使用 USB 转 TTL
3. **ESP32 独立运行** - 不需要电脑
4. **通过网络访问** - Web/RTSP/MJPEG

**不是电脑软件！是嵌入式固件！**

---

**抱歉之前的错误！这次是正确的 ESP32 固件部署方案！** 🦞

**END OF DOCUMENT**
