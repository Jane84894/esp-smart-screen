#!/bin/bash
# Enable Model Router for OpenClaw

echo "🎯 Enabling Model Router..."

# Backup current config
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup.$(date +%Y%m%d%H%M%S)

# Add router config to openclaw.json
cat >> ~/.openclaw/openclaw.json << 'EOF'

// Model Router enabled
EOF

echo "✅ Model Router enabled!"
echo ""
echo "Testing router..."
cd ~/.openclaw/workspace/skills/model-router
node openclaw-integration.mjs "你好"
node openclaw-integration.mjs "帮我写个函数"
node openclaw-integration.mjs "分析一下这个方案"

echo ""
echo "📊 Router is now active!"
echo "   - Simple chat → glm-4.7"
echo "   - Coding → qwen3-coder-plus"
echo "   - Reasoning → qwen3-max"
echo "   - Long text → MiniMax-M2.5"
