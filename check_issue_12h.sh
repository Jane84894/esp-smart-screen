#!/bin/bash
# ESPHome Issue #14802 监控脚本
# 每 12 小时检查一次 - 只有新回复时才通知

ISSUE_NUMBER="14802"
REPO="esphome/esphome"
NOTIFICATION_FILE="/home/jane/.openclaw/workspace/.issue_notifications.json"
LOG_FILE="/home/jane/.openclaw/workspace/issue_monitor.log"
STATE_FILE="/home/jane/.openclaw/workspace/.issue_${ISSUE_NUMBER}_state.json"

# 只在有新回复时才输出通知
python3 << 'PYTHON_SCRIPT'
import json
import os
from datetime import datetime

ISSUE_NUMBER = "14802"
REPO = "esphome/esphome"
NOTIFICATION_FILE = "/home/jane/.openclaw/workspace/.issue_notifications.json"
STATE_FILE = "/home/jane/.openclaw/workspace/.issue_14802_state.json"
LOG_FILE = "/home/jane/.openclaw/workspace/issue_monitor.log"

def log(message):
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(f"[{datetime.now().isoformat()}] {message}\n")

def check_issue():
    log(f"开始检查 Issue #{ISSUE_NUMBER}...")
    
    # 加载状态
    last_comment_id = 0
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            state = json.load(f)
            last_comment_id = state.get('last_comment_id', 0)
    
    # 加载通知
    notifications = []
    if os.path.exists(NOTIFICATION_FILE):
        with open(NOTIFICATION_FILE, 'r', encoding='utf-8') as f:
            notifications = json.load(f)
    
    # 检查未通知的评论
    unnotified = [n for n in notifications if not n.get('notified', False)]
    
    if unnotified:
        # 有新回复，发送通知
        print(f"\n{'='*60}")
        print(f"🔔 Issue #{ISSUE_NUMBER} 有新回复！")
        print(f"{'='*60}\n")
        
        for n in unnotified:
            print(f"📌 回复详情:")
            print(f"   👤 用户：{n['author']}")
            print(f"   📅 时间：{n['created_at']}")
            print(f"   🔗 链接：{n['html_url']}")
            print(f"\n📝 内容:")
            print(f"   {n['body']}\n")
            print(f"{'-'*60}\n")
            
            # 标记为已通知
            n['notified'] = True
        
        # 保存更新
        with open(NOTIFICATION_FILE, 'w', encoding='utf-8') as f:
            json.dump(notifications, f, indent=2, ensure_ascii=False)
        
        log(f"发现 {len(unnotified)} 条新回复，已通知用户")
    else:
        # 无新回复，保持沉默
        log("无新回复，不发送通知")
        print("", end='')  # 不输出任何内容

if __name__ == "__main__":
    check_issue()
PYTHON_SCRIPT
