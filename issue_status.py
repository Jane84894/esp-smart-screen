#!/usr/bin/env python3
"""
ESPHome Issue #14802 简单监控
使用 web 页面检查而不是 API（避免速率限制）
"""

import json
import os
from datetime import datetime

ISSUE_NUMBER = "14802"
ISSUE_URL = f"https://github.com/esphome/esphome/issues/{ISSUE_NUMBER}"
STATE_FILE = f"/home/jane/.openclaw/workspace/.issue_{ISSUE_NUMBER}_state.json"

def check_issue_simple():
    """简单检查 Issue 状态"""
    print(f"📊 Issue #{ISSUE_NUMBER} 监控状态")
    print(f"🔗 链接：{ISSUE_URL}")
    print()
    
    # 加载状态
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            state = json.load(f)
        print(f"✅ 监控已设置")
        print(f"   最后检查：{state.get('last_check', '从未')}")
        print(f"   评论数：{state.get('comment_count', 0)}")
    else:
        print(f"⚠️ 监控未初始化")
    
    print()
    print("📝 如何检查回复:")
    print(f"   1. 访问：{ISSUE_URL}")
    print(f"   2. 查看是否有新评论")
    print(f"   3. 如果有回复，我会通知你")
    print()
    print("⏰ 自动检查:")
    print("   运行以下命令添加到 crontab:")
    print("   crontab -e")
    print("   添加：0 */2 * * * bash /home/jane/.openclaw/workspace/check_issue.sh")
    print("   (每 2 小时检查一次)")

if __name__ == "__main__":
    check_issue_simple()
