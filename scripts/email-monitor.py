#!/usr/bin/env python3
"""邮件监控脚本 - 需要配置 IMAP"""
import imaplib
import email

def check_email():
    """检查重要邮件"""
    # TODO: 配置 IMAP 连接
    print("📬 邮件监控已就绪")
    print("提示：需要配置邮箱账号和密码")

if __name__ == "__main__":
    check_email()
