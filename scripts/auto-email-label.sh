#!/bin/bash
# 邮箱自动分类脚本
# 功能：检查新邮件并自动打标签

export GOG_KEYRING_PASSWORD="gog"
export GOG_ACCOUNT="qwe2526425zxc@gmail.com"

LOG_FILE="/home/jane/.openclaw/workspace/logs/email-label.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

log "=== 开始邮箱自动分类 ==="

# 获取最近 24 小时的新邮件
log "检查最近 24 小时的新邮件..."
NEW_EMAILS=$(gog gmail search 'newer_than:1d -label:🔐安全 -label:💻开发 -label:☁️云服务 -label:🎮游戏 -label:⚠️待处理' --max 100 2>&1)

# 解析邮件 ID
EMAIL_IDS=$(echo "$NEW_EMAILS" | grep "^1[0-9a-z]\{15,\}" | awk '{print $1}')

if [ -z "$EMAIL_IDS" ]; then
    log "没有新邮件需要分类"
    log "=== 邮箱自动分类完成 ==="
    exit 0
fi

# 分类规则
count=0
while IFS= read -r email_id; do
    if [ -z "$email_id" ]; then
        continue
    fi
    
    # 获取邮件详情
    email_info=$(gog gmail show "$email_id" 2>&1)
    subject=$(echo "$email_info" | grep -i "subject:" | head -1 | cut -d: -f2-)
    from=$(echo "$email_info" | grep -i "from:" | head -1 | cut -d: -f2-)
    
    log "处理邮件：$subject"
    
    # 分类逻辑
    label=""
    
    # 安全相关
    if echo "$subject $from" | grep -qiE "security|安全 |login|登录|verify|验证|password|密码|alert|警告|signin|sign-in"; then
        label="🔐安全"
        log "  → 分类：安全"
    
    # 开发相关
    elif echo "$subject $from" | grep -qiE "github|gitlab|netdata|termius|adobe|developer|开发|code|代码|api|webhook"; then
        label="💻开发"
        log "  → 分类：开发"
    
    # 云服务相关
    elif echo "$subject $from" | grep -qiE "google|cloud|openai|cloudflare|tailscale|aws|azure|aliyun|腾讯 | 阿里|华为"; then
        label="☁️云服务"
        log "  → 分类：云服务"
    
    # 游戏相关
    elif echo "$subject $from" | grep -qiE "twitch|discord|steam|epic|game|游戏|live|直播|stream|主播"; then
        label="🎮游戏"
        log "  → 分类：游戏"
    
    # 待处理事项
    elif echo "$subject $from" | grep -qiE "action required|需要处理|pending|待处理|reminder|提醒|invoice|账单|payment|付款"; then
        label="⚠️待处理"
        log "  → 分类：待处理"
    
    else
        log "  → 无法分类，跳过"
        continue
    fi
    
    # 应用标签
    if [ -n "$label" ]; then
        gog gmail labels modify "$email_id" --add "$label" 2>&1 | grep -q "ok"
        if [ $? -eq 0 ]; then
            log "  ✓ 标签应用成功"
            ((count++))
        else
            log "  ✗ 标签应用失败"
        fi
    fi
    
done <<< "$EMAIL_IDS"

log "本次处理完成，共分类 $count 封邮件"
log "=== 邮箱自动分类结束 ==="
echo ""
