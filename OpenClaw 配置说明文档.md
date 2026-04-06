# OpenClaw 配置说明文档

**文档版本:** 1.0  
**更新日期:** 2026-03-15  
**配置对象:** OpenClaw AI 助手 (爪爪 Claw)

---

## 📋 配置文件位置

### 主配置文件
```
/home/jane/.openclaw/openclaw.json
```

### 其他配置文件
```
/home/jane/.openclaw/agents/main/agent/models.json  # 模型配置
/home/jane/.openclaw/credentials/                    # 凭证文件
/home/jane/.openclaw/cron/jobs.json                 # 定时任务
/home/jane/.openclaw/devices/                       # 设备配对
```

---

## ⚙️ 可配置的内容

### 1️⃣ AI 模型配置 (models)

**位置:** `openclaw.json → models`

**当前配置:**
```json
{
  "providers": {
    "bailian": {
      "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
      "apiKey": "sk-sp-ab88983ec7fc4a5692321db9bb5e2cd8",
      "models": [
        {
          "id": "qwen3.5-plus",
          "name": "qwen3.5-plus",
          "reasoning": false,
          "contextWindow": 1000000,
          "maxTokens": 65536
        },
        // ... 其他模型
      ]
    }
  }
}
```

**可以配置:**
- ✅ 添加新的 AI 模型
- ✅ 修改模型参数 (上下文窗口、最大 token 数)
- ✅ 启用/禁用推理模式 (reasoning)
- ✅ 设置默认模型
- ✅ 配置 API 密钥

**示例 - 添加新模型:**
```json
{
  "id": "new-model",
  "name": "New Model",
  "reasoning": true,
  "contextWindow": 128000,
  "maxTokens": 32768
}
```

---

### 2️⃣ Agent 配置 (agents)

**位置:** `openclaw.json → agents`

**当前配置:**
```json
{
  "defaults": {
    "model": {
      "primary": "bailian/qwen3.5-plus"
    },
    "workspace": "/home/jane/.openclaw/workspace"
  }
}
```

**可以配置:**
- ✅ 更改默认 AI 模型
- ✅ 修改工作目录路径
- ✅ 配置备用模型
- ✅ 设置模型优先级

**示例 - 更改默认模型:**
```json
{
  "defaults": {
    "model": {
      "primary": "bailian/qwen3-max-2026-01-23"
    }
  }
}
```

---

### 3️⃣ 工具配置 (tools)

**位置:** `openclaw.json → tools`

**当前配置:**
```json
{
  "profile": "full",
  "web": {
    "search": { "enabled": true },
    "fetch": { "enabled": true }
  },
  "media": {
    "audio": {
      "enabled": true,
      "maxBytes": 20971520
    }
  }
}
```

**可以配置:**
- ✅ 启用/禁用网络搜索
- ✅ 启用/禁用网页抓取
- ✅ 启用/禁用音频处理
- ✅ 修改音频文件大小限制
- ✅ 配置工具配置文件 (profile)

**配置文件选项:**
- `minimal` - 最小化工具集
- `standard` - 标准工具集
- `full` - 完整工具集

---

### 4️⃣ 消息配置 (messages)

**位置:** `openclaw.json → messages`

**当前配置:**
```json
{
  "ackReactionScope": "group-mentions",
  "tts": {
    "auto": "tagged",
    "provider": "edge",
    "edge": {
      "enabled": true,
      "voice": "zh-CN-XiaoxiaoNeural",
      "lang": "zh-CN",
      "rate": "+0%",
      "pitch": "+0%"
    }
  }
}
```

**可以配置:**
- ✅ 更改 TTS 语音 (voice)
- ✅ 更改语言 (lang)
- ✅ 调整语速 (rate)
- ✅ 调整音调 (pitch)
- ✅ 启用/禁用自动 TTS
- ✅ 配置消息确认反应范围

**TTS 语音选项:**
- `zh-CN-XiaoxiaoNeural` - 女声
- `zh-CN-YunxiNeural` - 男声
- `zh-CN-XiaoyiNeural` - 女声 (活泼)
- `en-US-JennyNeural` - 英语女声

---

### 5️⃣ 命令配置 (commands)

**位置:** `openclaw.json → commands`

**当前配置:**
```json
{
  "native": "auto",
  "nativeSkills": "auto",
  "restart": true,
  "ownerDisplay": "raw"
}
```

**可以配置:**
- ✅ 启用/禁用原生命令
- ✅ 启用/禁用原生技能
- ✅ 启用/禁用重启命令
- ✅ 更改所有者显示模式

---

### 6️⃣ 会话配置 (session)

**位置:** `openclaw.json → session`

**当前配置:**
```json
{
  "dmScope": "per-channel-peer"
}
```

**可以配置:**
- ✅ 会话作用域范围
- ✅ 会话持久化设置

---

### 7️⃣ 通道配置 (channels)

**位置:** `openclaw.json → channels`

**当前配置:**
```json
{
  "telegram": {
    "enabled": true,
    "dmPolicy": "pairing",
    "botToken": "5789409916:AAFnYlQMnA_CxwB2VzX1IOZeV6cFKzl0F_M",
    "groupPolicy": "allowlist",
    "streaming": "partial"
  }
}
```

**可以配置:**
- ✅ 启用/禁用 Telegram
- ✅ 更改 Bot Token
- ✅ 配置私聊策略 (dmPolicy)
- ✅ 配置群组策略 (groupPolicy)
- ✅ 启用/禁用流式响应

**群组策略选项:**
- `allowlist` - 仅允许列表中的群组
- `denylist` - 拒绝列表中的群组
- `open` - 开放所有群组

---

### 8️⃣ 网关配置 (gateway)

**位置:** `openclaw.json → gateway`

**当前配置:**
```json
{
  "port": 18789,
  "mode": "local",
  "bind": "auto",
  "auth": {
    "mode": "token",
    "token": "9056839eb7cee61881c7fbd934f15ac0362d07f3a64b33a3a64b33a3"
  },
  "tailscale": {
    "mode": "off"
  },
  "nodes": {
    "denyCommands": [
      "camera.snap",
      "camera.clip",
      "screen.record"
    ]
  }
}
```

**可以配置:**
- ✅ 更改网关端口 (port)
- ✅ 更改绑定地址 (bind)
- ✅ 更改认证模式 (auth.mode)
- ✅ 更改认证令牌 (auth.token)
- ✅ 启用/禁用 Tailscale
- ✅ 配置节点禁止的命令

**认证模式选项:**
- `token` - 令牌认证
- `none` - 无认证 (不推荐)

---

### 9️⃣ 插件配置 (plugins)

**位置:** `openclaw.json → plugins`

**当前配置:**
```json
{
  "entries": {
    "telegram": { "enabled": true }
  }
}
```

**可以配置:**
- ✅ 启用/禁用插件
- ✅ 添加新插件
- ✅ 配置插件参数

---

### 🔟 环境变量 (env)

**位置:** `openclaw.json → env`

**当前配置:**
```json
{
  "TAVILY_API_KEY": "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"
}
```

**可以配置:**
- ✅ 添加 API 密钥
- ✅ 添加环境变量
- ✅ 配置第三方服务密钥

---

## 🛠️ 如何修改配置

### 方法 1: 直接编辑文件

```bash
# 1. 打开配置文件
nano /home/jane/.openclaw/openclaw.json

# 2. 修改配置
# 使用 JSON 格式，注意语法正确

# 3. 保存并重启
# 重启 OpenClaw 使配置生效
```

### 方法 2: 使用命令

```bash
# 查看当前配置
openclaw config show

# 修改配置 (如果支持)
openclaw config set <key> <value>

# 重启生效
openclaw restart
```

---

## ⚠️ 配置注意事项

### 1. JSON 格式要求
```json
✅ 正确:
{
  "key": "value",
  "number": 123,
  "boolean": true
}

❌ 错误:
{
  key: "value",  // 键名必须用引号
  "number": 123,
  "boolean": True  // 必须小写 true
}
```

### 2. 备份配置
```bash
# 修改前备份
cp openclaw.json openclaw.json.bak
```

### 3. 验证配置
```bash
# 检查 JSON 语法
jq . openclaw.json
```

### 4. 敏感信息保护
```bash
# 不要将配置文件上传到 GitHub
# 使用 .gitignore 忽略
echo "openclaw.json" >> .gitignore
```

---

## 📊 当前配置总结

### AI 模型
- **默认模型:** bailian/qwen3.5-plus
- **可用模型:** 8 个 (Qwen、MiniMax、GLM、Kimi)
- **推理模式:** 已启用 (可通过 messages.tts.auto 控制)

### 工具
- **网络搜索:** ✅ 启用
- **网页抓取:** ✅ 启用
- **音频处理:** ✅ 启用 (最大 20MB)

### 消息
- **TTS:** ✅ 启用 (Edge 语音引擎)
- **语音:** zh-CN-XiaoxiaoNeural (女声)
- **语言:** 中文 (zh-CN)

### 通道
- **Telegram:** ✅ 启用
- **私聊策略:** 配对模式
- **群组策略:** 白名单模式

### 网关
- **端口:** 18789
- **模式:** 本地模式
- **认证:** 令牌认证
- **Tailscale:** ❌ 禁用

---

## 🎯 常用配置修改

### 1. 更改默认 AI 模型
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "bailian/qwen3-max-2026-01-23"
      }
    }
  }
}
```

### 2. 更改 TTS 语音
```json
{
  "messages": {
    "tts": {
      "edge": {
        "voice": "zh-CN-YunxiNeural"
      }
    }
  }
}
```

### 3. 禁用网络搜索
```json
{
  "tools": {
    "web": {
      "search": {
        "enabled": false
      }
    }
  }
}
```

### 4. 更改网关端口
```json
{
  "gateway": {
    "port": 8080
  }
}
```

### 5. 启用 Tailscale
```json
{
  "gateway": {
    "tailscale": {
      "mode": "on"
    }
  }
}
```

---

## 📝 配置修改记录

每次修改配置后，建议记录:

```markdown
## 2026-03-15 - 配置修改
- 修改内容：[描述]
- 修改原因：[原因]
- 修改人：[姓名]
- 生效时间：[时间]
```

---

## 🆘 故障排除

### 配置不生效
```
1. 检查 JSON 语法是否正确
2. 重启 OpenClaw
3. 检查日志文件
```

### 配置丢失
```
1. 检查备份文件
2. 恢复备份
3. 重新配置
```

### 无法启动
```
1. 检查配置文件权限
2. 检查端口占用
3. 查看错误日志
```

---

**本配置文档已保存到工作目录，可随时查阅。**

**END OF DOCUMENT**
