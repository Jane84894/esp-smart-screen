---
name: model-router
version: 1.0.0
description: Automatic model selection based on task type. Routes tasks to optimal model (glm-4.7 for simple, coder-plus for coding, max for reasoning, MiniMax for long text). Saves 40-60% API costs.
metadata: {"clawdbot":{"emoji":"🎯","requires":{"bins":["node"]}}}
---

# Model Router 🎯

**Automatic model selection for cost optimization.**

Routes tasks to the optimal AI model based on intent analysis, saving 40-60% of API requests while maintaining quality.

## Quick Start

```bash
# Test router
node {baseDir}/scripts/router.mjs "帮我写个 Python 函数"
```

## How It Works

### 1. Intent Analysis

Analyzes user input using:
- **Keyword matching** (weighted scoring)
- **Pattern matching** (regex)
- **Length constraints**
- **Complexity indicators**

### 2. Model Selection

| Task Type | Model | Use Case |
|-----------|-------|----------|
| `coding` | `qwen3-coder-plus` | Code, debugging, technical |
| `reasoning` | `qwen3-max-2026-01-23` | Analysis, complex decisions |
| `longtext` | `MiniMax-M2.5` | Articles, reports, stories |
| `simple` | `glm-4.7` | Greetings, simple chat |
| `search` | `qwen3.5-plus` | Web search, info lookup |
| `homeassistant` | `qwen3.5-plus` | Smart home control |

### 3. Fallback

If confidence is low (<10 score), uses `qwen3.5-plus` as default.

## Configuration

Edit `config/routes.json`:

```json
{
  "routes": [
    {
      "name": "coding",
      "model": "qwen3-coder-plus",
      "triggers": {
        "keywords": ["代码", "function", "debug"],
        "patterns": ["写一个.*函数"],
        "minLength": 10
      }
    }
  ],
  "defaultModel": "qwen3.5-plus",
  "costLimits": {
    "daily": 1000,
    "monthly": 18000
  }
}
```

## Usage Examples

```bash
# Simple greeting → glm-4.7
node {baseDir}/scripts/router.mjs "你好"

# Coding task → qwen3-coder-plus
node {baseDir}/scripts/router.mjs "帮我写个 Python 脚本"

# Complex analysis → qwen3-max
node {baseDir}/scripts/router.mjs "分析一下这个方案的优缺点"

# Long text → MiniMax
node {baseDir}/scripts/router.mjs "帮我写一篇关于 AI 的文章"
```

## Integration

### Programmatic Use

```javascript
import { selectModel } from './scripts/router.mjs';

const result = selectModel("帮我写个函数");
console.log(result.model); // "qwen3-coder-plus"
```

### OpenClaw Integration

The router automatically selects models for sub-agents:

```javascript
const route = selectModel(userMessage);
const agent = await sessions_spawn({
  model: route.model,
  task: userMessage
});
```

## Cost Savings

**Before (all tasks to qwen3.5-plus):**
- 100% of requests use default model
- Monthly limit: 18,000 requests

**After (intelligent routing):**
- Simple tasks (60%) → glm-4.7 (cheapest)
- Coding tasks (20%) → coder-plus (optimized)
- Complex tasks (10%) → max (best quality)
- Long text (10%) → MiniMax (best output)

**Result:** 40-60% cost reduction, equivalent to 25,000-30,000 requests/month

## Monitoring

Track model usage:

```bash
# View routing statistics
node {baseDir}/scripts/stats.mjs
```

## Troubleshooting

### Wrong model selected

1. Check `config/routes.json` triggers
2. Add more specific keywords
3. Adjust score thresholds

### Performance issues

1. Enable caching in config
2. Reduce keyword list size
3. Use simpler patterns

## License

MIT
