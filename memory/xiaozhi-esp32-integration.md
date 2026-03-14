# 小智 AI 聊天机器人集成计划

> 创建时间：2026-03-10  
> 状态：📋 规划中（等待用户启动）  
> 目标：将 OpenClaw 接入小智 ESP32 硬件，实现语音对话

---

## 📋 项目概述

### 背景
- 用户已有小智 AI ESP32 硬件（面包板 DIY 版）
- 包含：ESP32-S3/C3 + 麦克风 + 喇叭 + 屏幕
- 当前使用官方服务器 (xiaozhi.me)
- 目标：接入 OpenClaw，使用本地 LLM 和 TTS

### 优势
- ✅ 更智能的对话（Qwen3.5-Max vs 官方 Qwen 实时版）
- ✅ 本地 TTS（Edge TTS 免费，自然度高）
- ✅ 可接入 Home Assistant 智能家居
- ✅ 数据自主可控

---

## 🏗️ 架构设计

### 方案选择：轻量级 WebSocket 服务器

```
┌─────────────┐    WebSocket     ┌──────────────────┐    HTTP     ┌─────────────┐
│   ESP32     │ ◄──────────────► │  Python Server   │ ◄─────────► │  OpenClaw   │
│  (小智固件)  │   Opus 音频      │ (xiaozhi-bridge) │   API       │   Gateway   │
└─────────────┘                  └──────────────────┘             └─────────────┘
       │                                │                                │
       │                                │                                ├─► Whisper STT
       │                                │                                │   (本地 Faster)
       │                                │                                │
       │                                │                                ├─► LLM 推理
       │                                │                                │   (qwen3.5-plus)
       │                                │                                │
       │                                │                                └─► TTS
       │                                │                                    (Edge TTS)
       │                                │
       │                                └─► 音频编解码
       │                                    (Opus ↔ WAV/MP3)
       │
       └─► 离线唤醒 (ESP-SR)
           屏幕显示
           按键控制
```

### 通信协议

基于小智官方 WebSocket 协议：

**连接建立**：
```json
// ESP32 → 服务器
{
  "type": "hello",
  "version": 1,
  "transport": "websocket",
  "audio_params": {
    "format": "opus",
    "sample_rate": 16000,
    "channels": 1,
    "frame_duration": 60
  }
}

// 服务器 → ESP32
{
  "type": "hello",
  "transport": "websocket",
  "session_id": "uuid-generated"
}
```

**语音对话流程**：
1. ESP32 发送 `{"type": "listen", "state": "start"}`
2. ESP32 持续发送 Opus 音频帧（binary）
3. 服务器识别语音 → 调用 OpenClaw
4. OpenClaw 返回文本 → TTS 合成
5. 服务器发送 TTS 音频帧给 ESP32
6. ESP32 播放音频

---

## 📦 技术栈

### 服务器端
| 组件 | 技术选型 | 说明 |
|------|---------|------|
| **WebSocket 服务** | `websockets` (Python) | 异步 WebSocket 服务器 |
| **音频编解码** | `opuslib-next` | Opus 编解码 |
| **STT** | Faster Whisper | 本地识别，zh_CN-huayan |
| **LLM** | OpenClaw API | 调用 qwen3.5-plus |
| **TTS** | Edge TTS | 微软免费，zh-CN-XiaoxiaoNeural |
| **音频格式转换** | `ffmpeg` | WAV ↔ MP3/OGG |

### ESP32 端
- **固件**：小智官方 v2 固件（无需修改）
- **配置**：仅修改服务器地址
- **唤醒词**：可选修改（"你好爪爪"）

---

## 📝 实现步骤

### 阶段一：基础服务器（1-2 小时）

#### 1.1 创建项目结构
```bash
mkdir -p ~/.openclaw/xiaozhi-bridge
cd ~/.openclaw/xiaozhi-bridge
git init
```

#### 1.2 安装依赖
```bash
pip3 install websockets opuslib-next edge-tts ffmpeg-python
sudo apt install ffmpeg
```

#### 1.3 编写核心代码

**文件**: `server.py`
- WebSocket 服务器（端口 8000）
- 处理 hello 握手
- 接收音频帧
- 调用 STT/LLM/TTS

**文件**: `audio_codec.py`
- Opus 编解码
- 采样率转换（16k ↔ 24k）

**文件**: `xiaozhi_protocol.py`
- 解析小智协议 JSON 消息
- 生成响应消息

#### 1.4 测试连接
```bash
python3 server.py
# 浏览器打开测试页面
# 或使用小智测试工具
```

### 阶段二：集成 OpenClaw（1 小时）

#### 2.1 配置 OpenClaw API
- 获取 Gateway Token
- 编写 API 调用封装

#### 2.2 集成 STT
```python
# 使用已有的 Faster Whisper
python3 ~/.openclaw/whisper-stt.py audio.wav
```

#### 2.3 集成 TTS
```python
# 使用 Edge TTS
edge-tts --text "回复内容" --voice zh-CN-XiaoxiaoNeural --write-media output.mp3
```

#### 2.4 流式优化
- 实现边识别边回复
- 目标：首字延迟 < 3 秒

### 阶段三：ESP32 配置（30 分钟）

#### 3.1 获取 ESP32 配置权限
- 登录 xiaozhi.me 控制台
- 或本地修改固件配置

#### 3.2 修改服务器地址
```json
{
  "server": {
    "websocket_url": "ws://192.168.2.110:8000/xiaozhi/v1/"
  }
}
```

#### 3.3 烧录固件（可选）
- 如需修改唤醒词
- 使用官方烧录工具

### 阶段四：测试与优化（1 小时）

#### 4.1 基础对话测试
- 唤醒 → 说话 → 等待回复
- 测试延迟

#### 4.2 压力测试
- 连续对话
- 网络断开重连

#### 4.3 优化
- 调整音频参数
- 优化延迟

---

## 📊 性能目标

| 指标 | 目标值 | 备注 |
|------|--------|------|
| **首字延迟** | < 3 秒 | 唤醒到开始播放 |
| **总响应时间** | < 6 秒 | 完整回复 |
| **识别准确率** | > 95% | 中文普通话 |
| **TTS 自然度** | MOS > 4.0 | Edge TTS Xiaoxiao |
| **并发支持** | 1-2 设备 | 单服务器实例 |

---

## 🛠️ 代码框架

### 服务器主循环（伪代码）

```python
async def handle_websocket(websocket):
    # 1. 等待 hello
    msg = await websocket.recv()
    assert msg["type"] == "hello"
    
    # 2. 回复 hello
    await websocket.send({
        "type": "hello",
        "session_id": generate_uuid()
    })
    
    # 3. 进入音频循环
    audio_buffer = []
    async for frame in websocket:
        if frame is binary:
            # Opus 音频帧
            audio_buffer.append(decode_opus(frame))
        elif frame is text:
            msg = json.loads(frame)
            if msg["type"] == "listen" and msg["state"] == "stop":
                # 停止录音，开始处理
                text = await stt(audio_buffer)
                response = await openclaw_chat(text)
                audio = await tts(response)
                await send_audio(websocket, audio)
```

### OpenClaw 调用

```python
async def openclaw_chat(text):
    # 调用 OpenClaw API
    response = requests.post(
        "http://localhost:18789/v1/chat",
        json={"message": text},
        headers={"Authorization": "Bearer <token>"}
    )
    return response.json()["reply"]
```

---

## 🔧 配置文件

### 服务器配置 (`config.json`)
```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 8000,
    "websocket_path": "/xiaozhi/v1/"
  },
  "openclaw": {
    "gateway_url": "http://localhost:18789",
    "gateway_token": "9056839eb7cee61881c7fbd934f15ac0362d07f3a64b33a3"
  },
  "stt": {
    "model": "faster-whisper",
    "language": "zh"
  },
  "tts": {
    "provider": "edge",
    "voice": "zh-CN-XiaoxiaoNeural"
  },
  "audio": {
    "sample_rate": 16000,
    "channels": 1,
    "frame_duration_ms": 60
  }
}
```

### ESP32 配置（通过智控台或固件）
```json
{
  "server": {
    "websocket_url": "ws://192.168.2.110:8000/xiaozhi/v1/",
    "device_id": "auto",
    "client_id": "auto"
  },
  "wake_word": "你好爪爪",
  "audio": {
    "codec": "opus",
    "sample_rate": 16000
  }
}
```

---

## 📚 参考资料

### 小智官方
- GitHub: https://github.com/78/xiaozhi-esp32
- 通信协议：https://github.com/78/xiaozhi-esp32/blob/main/docs/websocket.md
- 智控台：https://xiaozhi.me

### 第三方服务器
- xinnan-tech: https://github.com/xinnan-tech/xiaozhi-esp32-server
- 部署文档：https://github.com/xinnan-tech/xiaozhi-esp32-server/blob/main/docs/Deployment.md

### 音频编解码
- Opus: https://opus-codec.org/
- opuslib-next: https://pypi.org/project/opuslib-next/

### TTS
- Edge TTS: https://github.com/rany2/edge-tts
- 微软语音：https://azure.microsoft.com/zh-cn/products/ai-services/text-to-speech

---

## ✅ 检查清单

### 启动前
- [ ] Python 环境准备（3.12+）
- [ ] 安装依赖包
- [ ] 配置 OpenClaw Gateway Token
- [ ] 测试 STT（whisper-stt.py）
- [ ] 测试 TTS（edge-tts）

### 第一阶段
- [ ] WebSocket 服务器运行
- [ ] 能接收 hello 握手
- [ ] 能接收音频帧
- [ ] 能发送音频帧

### 第二阶段
- [ ] STT 集成完成
- [ ] LLM 调用完成
- [ ] TTS 集成完成
- [ ] 端到端测试通过

### 第三阶段
- [ ] ESP32 配置修改
- [ ] 连接本地服务器
- [ ] 语音对话测试
- [ ] 延迟优化

---

## 🚀 快速启动命令

```bash
# 1. 进入项目目录
cd ~/.openclaw/xiaozhi-bridge

# 2. 启动服务器
python3 server.py

# 3. ESP32 配置服务器地址
# 通过智控台或烧录配置

# 4. 唤醒 ESP32 测试
# 说："你好爪爪"
```

---

## 📞 后续步骤

1. **用户决定启动时间**
2. **创建项目目录和代码**
3. **测试连接**
4. **优化体验**

---

*文档创建者：爪爪 🦞*  
*最后更新：2026-03-10 12:25 UTC*
