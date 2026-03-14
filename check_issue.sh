#!/bin/bash
# ESPHome Issue #14802 监控脚本
# 添加到 crontab: */30 * * * * /home/jane/.openclaw/workspace/check_issue.sh

ISSUE_NUMBER="14802"
REPO="esphome/esphome"
STATE_FILE="/home/jane/.openclaw/workspace/.issue_${ISSUE_NUMBER}_state.json"
NOTIFICATION_FILE="/home/jane/.openclaw/workspace/.issue_notifications.json"
LOG_FILE="/home/jane/.openclaw/workspace/issue_monitor.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 检查 Issue #${ISSUE_NUMBER}..." >> "$LOG_FILE"

# 使用 Python 脚本检查
python3 /home/jane/.openclaw/workspace/monitor_issue_14802.py >> "$LOG_FILE" 2>&1

# 检查是否有新通知
if [ -f "$NOTIFICATION_FILE" ]; then
    # 检查是否有未通知的评论
    python3 -c "
import json
import os

notification_file = '$NOTIFICATION_FILE'
if os.path.exists(notification_file):
    with open(notification_file, 'r') as f:
        notifications = json.load(f)
    
    unnotified = [n for n in notifications if not n.get('notified', False)]
    
    if unnotified:
        print(f'发现 {len(unnotified)} 条未读回复！')
        for n in unnotified:
            print(f\"\"\"
🔔 Issue #${ISSUE_NUMBER} 新回复！

👤 用户：{n['author']}
📅 时间：{n['created_at']}
🔗 链接：{n['html_url']}

📝 内容:
{n['body'][:500]}
...
\"\"\")
            # 标记为已通知
            n['notified'] = True
        
        # 保存更新
        with open(notification_file, 'w') as f:
            json.dump(notifications, f, indent=2, ensure_ascii=False)
    else:
        print('无新回复')
else:
    print('暂无通知文件')
"
fi
