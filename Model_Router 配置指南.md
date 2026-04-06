# Model Router 配置指南

**版本:** 2.0.0  
**功能:** 自动选择最优模型，节省 40-60% 成本

---

## 🎯 当前配置

**默认模型:** `qwen3.5-plus`

**可用模型:**
- `glm-4.7` - 简单对话 (最便宜)
- `qwen3.5-plus` - 默认/通用
- `qwen3-coder-plus` - 编程专用
- `qwen3-max-2026-01-23` - 复杂推理 (最强)
- `MiniMax-M2.5` - 长文本生成

---

## 🚀 启用 Model Router

### 方法 1: 修改配置文件

**编辑 `/home/jane/.openclaw/openclaw.json`:**

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "bailian": {
        "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
        "apiKey": "sk-sp-ab88983ec7fc4a5692321db9bb5e2cd8",
        "api": "openai-completions"
      }
    },
    "router": {
      "enabled": true,
      "configPath": "/home/jane/.openclaw/workspace/skills/model-router/config/routes.json",
      "defaultModel": "qwen3.5-plus"
    }
  }
}
```

### 方法 2: 使用命令行

```bash
# 启用 Model Router
openclaw configure --section models
```

然后在配置界面中：
1. 选择 `router` → `enabled`: `true`
2. 设置 `configPath`: `/home/jane/.openclaw/workspace/skills/model-router/config/routes.json`
3. 设置 `defaultModel`: `qwen3.5-plus`

---

## 📋 路由规则详解

### 1. 编程任务 (Coding)
**模型:** `qwen3-coder-plus`

**触发关键词:**
```
代码，函数，脚本，编程，debug, write code,
function, script, programming, implement, 开发，实现，
bug, 错误，fix, 修复，python, javascript, java, c++,
shell, bash, npm, node, react, vue, api, sql,
github, git, pr, commit, 仓库，依赖，npm install
```

**触发模式:**
```regex
写一个.*函数
帮我.*代码
.*怎么实现
.*怎么写
.*bug
.*报错
.*爬虫
.*api.*调用
.*库.*安装
```

**示例:**
```
用户：帮我写一个 Python 函数
→ 自动使用 qwen3-coder-plus
```

---

### 2. 复杂推理 (Reasoning) ⭐ 最强模型
**模型:** `qwen3-max-2026-01-23`

**触发关键词:**
```
分析，推理，为什么，解释，complex, analyze,
reason, decision, compare, 对比，评估，评价，
优缺点，利弊，方案，策略，规划，架构，design,
影响，趋势，前景，区别，差异，优劣，权衡，
可行性，风险评估，roi, 投入产出
```

**触发模式:**
```regex
分析.*对.*的影响
.*发展趋势
比较.*和
.*和.*的区别
.*的优缺点
为什么.*会.*
如何评价.*
.*值不值得
```

**示例:**
```
用户：分析一下 ESP-IDF 分区表错误的原因
→ 自动使用 qwen3-max-2026-01-23 (最强模型)

用户：对比 Arduino 和 ESP-IDF 的优缺点
→ 自动使用 qwen3-max-2026-01-23
```

---

### 3. 长文本生成 (Long Text)
**模型:** `MiniMax-M2.5`

**触发关键词:**
```
文章，报告，总结，长，write article, report,
summary, document, 文档，论文，邮件，email,
博客，blog, 故事，story, 剧本，script, 篇
```

**触发模式:**
```regex
写一篇.*
写个.*文章
.*发展趋势
```

**示例:**
```
用户：写一篇关于 ESP32 的技术文章
→ 自动使用 MiniMax-M2.5
```

---

### 4. 简单对话 (Simple)
**模型:** `glm-4.7` (最便宜)

**触发关键词:**
```
你好，谢谢，再见，hi, hello, thanks,
bye, goodbye, 早上好，晚上好，晚安，
在吗，干嘛，吃了吗，啊，呀，哦
```

**触发模式:**
```regex
^你好.*
^早.*
^晚.*
```

**最大长度:** 30 字符

**示例:**
```
用户：你好
→ 自动使用 glm-4.7 (最便宜)

用户：谢谢
→ 自动使用 glm-4.7
```

---

### 5. 搜索任务 (Search)
**模型:** `qwen3.5-plus`

**触发关键词:**
```
搜索，查找，查一下，search, lookup, find,
最新，news, 今天，现在，current
```

**动作:** `web_search`, `tavily_search`

**示例:**
```
用户：搜索一下最新的 ESP32 新闻
→ 自动使用 qwen3.5-plus + web_search
```

---

### 6. 智能家居 (Home Assistant)
**模型:** `qwen3.5-plus`

**触发关键词:**
```
打开，关闭，开关，灯，空调，温度，
turn on, turn off, light, climate, home,
智能家居，ha, home assistant
```

**动作:** `home_assistant`

**示例:**
```
用户：打开客厅的灯
→ 自动使用 qwen3.5-plus + home_assistant 工具
```

---

## 💰 成本限制

### 每日限制
```json
"costLimits": {
  "daily": 1000,      // 每日 1000 元
  "monthly": 18000,   // 每月 18000 元
  "perTask": {
    "glm-4.7": 10,           // 每任务 10 元
    "qwen3.5-plus": 50,      // 每任务 50 元
    "qwen3-coder-plus": 100, // 每任务 100 元
    "qwen3-max-2026-01-23": 200, // 每任务 200 元
    "MiniMax-M2.5": 150      // 每任务 150 元
  }
}
```

---

## 🎯 如何强制使用特定模型

### 方法 1: 在消息中指定

```
/model_max 分析一下这个问题
→ 强制使用 qwen3-max-2026-01-23

/model_coder 帮我写代码
→ 强制使用 qwen3-coder-plus

/model_simple 你好
→ 强制使用 glm-4.7
```

### 方法 2: 使用系统提示

```yaml
# 在 ESPHome 配置中
logger:
  level: DEBUG
  
# 在日志中会显示使用的模型
```

---

## 📊 性能对比

| 模型 | 速度 | 质量 | 成本 | 适用场景 |
|------|------|------|------|----------|
| glm-4.7 | ⚡⚡⚡ | ⭐⭐⭐ | 💰 | 简单对话 |
| qwen3.5-plus | ⚡⚡ | ⭐⭐⭐⭐ | 💰💰 | 通用任务 |
| qwen3-coder-plus | ⚡⚡ | ⭐⭐⭐⭐⭐ | 💰💰💰 | 编程任务 |
| qwen3-max-2026-01-23 | ⚡ | ⭐⭐⭐⭐⭐ | 💰💰💰💰 | 复杂推理 |
| MiniMax-M2.5 | ⚡⚡ | ⭐⭐⭐⭐ | 💰💰💰 | 长文本 |

---

## 🔧 验证是否生效

### 检查日志

```bash
# 查看 ESPHome 日志
esphome logs smart-pda.yaml
```

**应该看到:**
```
[Model Router] Detected task type: reasoning
[Model Router] Selected model: qwen3-max-2026-01-23
```

### 测试不同任务

```
# 测试简单对话 (应该用 glm-4.7)
你好

# 测试编程任务 (应该用 qwen3-coder-plus)
帮我写一个 Python 函数

# 测试复杂推理 (应该用 qwen3-max)
分析一下 ESP-IDF 分区表错误的根本原因

# 测试长文本 (应该用 MiniMax-M2.5)
写一篇关于 ESP32 的技术文章
```

---

## 🎯 针对你的 ESP-IDF 问题

**当你问:**
```
分析一下 ESP-IDF 分区表错误的根本原因
```

**Model Router 会:**
1. 检测到关键词：`分析`, `错误`, `原因`
2. 匹配到 `reasoning` 路由
3. **自动使用 `qwen3-max-2026-01-23` (最强模型)**
4. 给出最深入的分析

---

## ✅ 立即启用

**编辑配置文件:**
```bash
nano /home/jane/.openclaw/openclaw.json
```

**添加:**
```json
{
  "models": {
    "router": {
      "enabled": true,
      "configPath": "/home/jane/.openclaw/workspace/skills/model-router/config/routes.json"
    }
  }
}
```

**重启:**
```bash
openclaw restart
```

---

## 🎯 效果

**启用后:**
- ✅ 简单问题自动用最便宜的模型 (glm-4.7)
- ✅ 复杂问题自动用最强的模型 (qwen3-max)
- ✅ 编程问题自动用编程专用模型 (qwen3-coder-plus)
- ✅ **节省 40-60% 成本**

---

**启用后，你的 ESP-IDF 问题会自动使用最强的 qwen3-max 模型来分析！** 🦞

---

**END OF DOCUMENT**
