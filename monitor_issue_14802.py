#!/usr/bin/env python3
"""
ESPHome Issue #14802 Monitor
监控 GitHub Issue 回复并通知用户
"""

import requests
import json
import os
from datetime import datetime

# 配置
ISSUE_NUMBER = "14802"
REPO = "esphome/esphome"
ISSUE_URL = f"https://github.com/{REPO}/issues/{ISSUE_NUMBER}"
STATE_FILE = f"/home/jane/.openclaw/workspace/.issue_{ISSUE_NUMBER}_state.json"
NOTIFICATION_FILE = "/home/jane/.openclaw/workspace/.issue_notifications.json"

# GitHub API (无需认证也可访问公开 issue)
API_URL = f"https://api.github.com/repos/{REPO}/issues/{ISSUE_NUMBER}/comments"

def load_state():
    """加载上次检查的状态"""
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return {"last_check": None, "last_comment_id": None, "comment_count": 0}

def save_state(state):
    """保存检查状态"""
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)

def check_issue():
    """检查 Issue 是否有新回复"""
    print(f"[{datetime.now().isoformat()}] 检查 Issue #{ISSUE_NUMBER}...")
    
    try:
        # 获取评论列表 (使用更高的速率限制)
        response = requests.get(API_URL, headers={
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Issue-Monitor-Bot/1.0',
            'Connection': 'keep-alive'
        }, timeout=10)
        
        # 如果 403，可能是速率限制，等待后重试
        if response.status_code == 403:
            print("⏳ 遇到速率限制，等待 60 秒后重试...")
            import time
            time.sleep(60)
            response = requests.get(API_URL, headers={
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Issue-Monitor-Bot/1.0'
            }, timeout=10)
        
        if response.status_code != 200:
            print(f"❌ API 请求失败：{response.status_code}")
            return False
        
        comments = response.json()
        state = load_state()
        
        # 首次检查
        if state["last_comment_id"] is None:
            state["last_comment_id"] = comments[-1]["id"] if comments else 0
            state["comment_count"] = len(comments)
            state["last_check"] = datetime.now().isoformat()
            save_state(state)
            print(f"✅ 首次检查：{len(comments)} 条评论")
            return False
        
        # 检查是否有新评论
        new_comments = [c for c in comments if c["id"] > state["last_comment_id"]]
        
        if new_comments:
            print(f"🎉 发现 {len(new_comments)} 条新回复！")
            
            # 保存通知信息
            notifications = []
            if os.path.exists(NOTIFICATION_FILE):
                with open(NOTIFICATION_FILE, 'r') as f:
                    notifications = json.load(f)
            
            for comment in new_comments:
                notification = {
                    "issue_number": ISSUE_NUMBER,
                    "comment_id": comment["id"],
                    "author": comment["user"]["login"],
                    "created_at": comment["created_at"],
                    "body": comment["body"],
                    "html_url": comment["html_url"],
                    "notified": False,
                    "created_at_checked": datetime.now().isoformat()
                }
                notifications.append(notification)
                print(f"  📝 {comment['user']['login']}: {comment['body'][:100]}...")
            
            # 保存通知
            with open(NOTIFICATION_FILE, 'w') as f:
                json.dump(notifications, f, indent=2, ensure_ascii=False)
            
            # 更新状态
            state["last_comment_id"] = max(c["id"] for c in comments)
            state["comment_count"] = len(comments)
            state["last_check"] = datetime.now().isoformat()
            save_state(state)
            
            return True
        else:
            print(f"✅ 无新回复 (共 {len(comments)} 条评论)")
            state["last_check"] = datetime.now().isoformat()
            save_state(state)
            return False
            
    except Exception as e:
        print(f"❌ 检查失败：{str(e)}")
        return False

if __name__ == "__main__":
    has_new_reply = check_issue()
    if has_new_reply:
        print(f"\n🔔 发现新回复！请查看通知文件：{NOTIFICATION_FILE}")
    else:
        print(f"\n💤 无新回复")
