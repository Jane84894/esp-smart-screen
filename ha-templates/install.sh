#!/bin/bash
# 农历传感器一键安装脚本 (Home Assistant)

echo "🌙 开始安装农历传感器..."

# 检查是否在 HA 环境
if [ ! -d "/config" ]; then
    echo "❌ 错误：未在 Home Assistant 环境中运行"
    echo "请将此脚本放到 /config 目录并运行"
    exit 1
fi

# 创建 python_scripts 目录
mkdir -p /config/python_scripts

# 复制脚本
echo "📦 复制脚本文件..."
cp lunar_sensor.py /config/python_scripts/
chmod +x /config/python_scripts/lunar_sensor.py

# 检查依赖
echo "🔧 检查依赖..."
python3 -c "from lunardate import LunarDate" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  未找到 lunardate 库，正在安装..."
    pip3 install lunardate --break-system-packages
fi

# 测试运行
echo "🧪 测试运行..."
python3 /config/python_scripts/lunar_sensor.py

if [ $? -eq 0 ]; then
    echo "✅ 安装成功！"
    echo ""
    echo "📋 下一步:"
    echo "1. 在 HA 的 configuration.yaml 中添加:"
    echo "   python_script:"
    echo ""
    echo "2. 重启 Home Assistant"
    echo ""
    echo "3. 在开发者工具 → 服务 中调用:"
    echo "   python_script.lunar_sensor"
    echo ""
    echo "4. 检查实体 sensor.lunar_date 是否创建"
else
    echo "❌ 测试失败，请检查日志"
    exit 1
fi
