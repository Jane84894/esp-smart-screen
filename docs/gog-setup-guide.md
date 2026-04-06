# 📦 Gog (Google Workspace CLI) 配置攻略

> 让 AI 助手控制你的 Google 账号：Drive/Gmail/Calendar/Docs/Sheets

**作者：** 爪爪 🦞  
**更新时间：** 2026-04-04  
**适用：** OpenClaw + Gog 技能

---

## 🎯 Gog 能做什么？

| 功能 | 说明 | 示例 |
|------|------|------|
| **Google Drive** | 上传/下载/分享文件 | "把这个 PDF 上传到 Drive" |
| **Gmail** | 搜索/读取/发送邮件 | "找出老板发来的邮件" |
| **Calendar** | 创建/查看日程 | "添加明天下午 3 点的会议" |
| **Docs** | 创建/编辑文档 | "创建一个新文档" |
| **Sheets** | 操作电子表格 | "读取这个表格的数据" |

---

## 📋 前置准备

### 1. Google Cloud 账号

**没有的话免费注册一个：**
```
1. 访问 https://console.cloud.google.com/
2. 使用你的 Google 账号登录（Gmail 账号即可）
3. 同意服务条款
```

### 2. 项目创建

**创建一个新项目：**
```
1. 点击顶部项目选择器 → "新建项目"
2. 项目名称：OpenClaw-Google
3. 点击"创建"
4. 等待几秒，项目创建完成
```

### 3. 启用 API

**需要启用 5 个 API：**

访问这个链接快速启用：
```
https://console.cloud.google.com/apis/dashboard
```

**逐个启用以下 API：**

| API 名称 | 搜索关键词 | 状态 |
|---------|-----------|------|
| Google Drive API | "Drive API" | ✅ 启用 |
| Gmail API | "Gmail API" | ✅ 启用 |
| Google Calendar API | "Calendar API" | ✅ 启用 |
| Google Docs API | "Docs API" | ✅ 启用 |
| Google Sheets API | "Sheets API" | ✅ 启用 |

**启用步骤：**
```
1. 点击"启用 API 和服务"
2. 搜索 API 名称
3. 点击"启用"
4. 重复以上步骤启用所有 5 个 API
```

---

## 🔑 创建 OAuth 凭据

### 步骤 1：进入凭据页面

```
访问：https://console.cloud.google.com/apis/credentials
```

### 步骤 2：配置 OAuth 同意屏幕

**首次使用需要配置：**

```
1. 点击"OAuth 同意屏幕"
2. 用户类型选择："外部" (External)
3. 点击"创建"

填写信息：
- 应用名称：OpenClaw Gog
- 用户支持电子邮件：你的 Gmail
- 开发者联系信息：你的 Gmail

4. 点击"保存并继续"
5. 范围页面：直接"保存并继续"（跳过）
6. 测试用户：直接"保存并继续"（跳过）
7. 返回仪表板
```

### 步骤 3：创建 OAuth 客户端 ID

```
1. 点击"创建凭据" → "OAuth 客户端 ID"
2. 应用类型选择："桌面应用" (Desktop app)
3. 名称：Gog-Desktop
4. 点击"创建"
```

### 步骤 4：下载 credentials.json

```
1. 创建成功后会弹出下载提示
2. 点击"下载 JSON"
3. 保存文件名为：credentials.json
```

---

## 📥 放置凭证文件

### 方法 1：放到工作区（推荐）

```bash
# 把 credentials.json 放到这里
~/.openclaw/workspace/credentials.json
```

**验证：**
```bash
ls -la ~/.openclaw/workspace/credentials.json
```

### 方法 2：放到 Gog 技能目录

```bash
# 或者放到这里
~/.openclaw/workspace/skills/jx76-gog/credentials.json
```

---

## 🔐 授权登录

### 步骤 1：进入技能目录

```bash
cd ~/.openclaw/workspace/skills/jx76-gog
```

### 步骤 2：运行授权命令

```bash
# 查看可用命令
gog --help

# 授权登录
gog auth
```

### 步骤 3：浏览器授权

**执行 `gog auth` 后会：**

```
1. 自动打开浏览器（或显示授权链接）
2. 选择你的 Google 账号
3. 点击"允许"授予权限
4. 授权成功后会显示"认证成功"
```

**可能看到的权限请求：**
- ✅ 查看和管理 Google Drive 文件
- ✅ 发送和管理 Gmail 邮件
- ✅ 查看和管理日历事件
- ✅ 创建和编辑 Google 文档

**这些都是正常的，点击"允许"即可。**

### 步骤 4：验证授权

```bash
# 测试 Drive
gog drive list

# 测试 Gmail
gog gmail list --max 5

# 测试日历
gog calendar today
```

**如果看到输出，说明配置成功！** 🎉

---

## 🛠️ 常见问题解决

### 问题 1：找不到 gog 命令

**原因：** Python 依赖未安装

**解决：**
```bash
# 安装依赖
cd ~/.openclaw/workspace/skills/jx76-gog
pip install -r requirements.txt
```

### 问题 2：授权失败/超时

**原因：** 网络问题或浏览器拦截

**解决：**
```bash
# 清除授权缓存
rm -rf ~/.gog/token.json

# 重新授权
gog auth
```

### 问题 3：API 未启用错误

**错误信息：** "Google Drive API has not been used in project"

**解决：**
```
1. 访问 https://console.cloud.google.com/apis/dashboard
2. 确认项目选择正确（OpenClaw-Google）
3. 找到 Google Drive API
4. 点击"启用"
```

### 问题 4：credentials.json 找不到

**解决：**
```bash
# 检查文件是否存在
ls -la ~/.openclaw/workspace/credentials.json

# 如果不存在，重新下载并放置
```

### 问题 5：权限不足

**错误信息：** "insufficient permission"

**解决：**
```
1. 检查 OAuth 同意屏幕是否配置
2. 确认启用了所有 5 个 API
3. 重新授权：gog auth
```

---

## 📚 常用命令速查

### Google Drive

```bash
# 列出文件
gog drive list

# 搜索文件
gog drive search "文件名"

# 上传文件
gog drive upload ~/file.pdf

# 上传到指定文件夹
gog drive upload ~/file.pdf --folder "大学资料"

# 创建文件夹
gog drive mkdir "新文件夹"

# 下载文件
gog drive download <文件 ID>

# 分享文件
gog drive share <文件 ID> --with "xxx@gmail.com"

# 删除文件
gog drive delete <文件 ID>
```

### Gmail

```bash
# 列出邮件
gog gmail list --max 10

# 搜索邮件
gog gmail search "from:boss after:2026-04-01"

# 读取邮件
gog gmail read <邮件 ID>

# 发送邮件
gog gmail send --to "xxx@example.com" --subject "标题" --body "内容"

# 标记星标
gog gmail star <邮件 ID>

# 删除邮件
gog gmail delete <邮件 ID>
```

### Calendar

```bash
# 查看今日日程
gog calendar today

# 查看 upcoming 事件
gog calendar upcoming

# 创建事件
gog calendar create "下午 3 点开会" --time "15:00" --date "2026-04-05"

# 删除事件
gog calendar delete <事件 ID>
```

### Docs

```bash
# 创建文档
gog docs create "文档标题"

# 读取文档
gog docs read <文档 ID>

# 编辑文档
gog docs edit <文档 ID> --text "新内容"

# 删除文档
gog docs delete <文档 ID>
```

### Sheets

```bash
# 创建表格
gog sheets create "表格标题"

# 读取表格
gog sheets read <表格 ID>

# 编辑单元格
gog sheets edit <表格 ID> --cell "A1" --value "数据"

# 删除表格
gog sheets delete <表格 ID>
```

---

## 💡 实际使用场景

### 场景 1：备份文件到 Drive

```
阿简："爪爪，把 MEMORY.md 备份到我的 Google Drive"

爪爪执行：
gog drive upload ~/.openclaw/workspace/MEMORY.md
```

### 场景 2：创建大学资料文件夹

```
阿简："在 Drive 上创建一个'大学资料'文件夹"

爪爪执行：
gog drive mkdir "大学资料"
```

### 场景 3：上传论文并分享

```
阿简："把这篇论文上传到 Drive 的'大学资料'文件夹，并分享给教授"

爪爪执行：
gog drive upload ~/paper.pdf --folder "大学资料"
gog drive share <文件 ID> --with "professor@university.edu"
```

### 场景 4：查看今天日程

```
阿简："我今天有什么安排？"

爪爪执行：
gog calendar today
```

### 场景 5：添加提醒

```
阿简："提醒我明天下午 3 点买笔记本电脑"

爪爪执行：
gog calendar create "买笔记本电脑" --date "2026-04-05" --time "15:00"
```

### 场景 6：查找重要邮件

```
阿简："找出老板发来的所有带附件的邮件"

爪爪执行：
gog gmail search "from:boss has:attachment"
```

---

## 🔒 安全提示

### 1. 保护 credentials.json

```bash
# 设置正确权限
chmod 600 ~/.openclaw/workspace/credentials.json

# 不要上传到 Git
echo "credentials.json" >> ~/.openclaw/workspace/.gitignore
```

### 2. 定期刷新令牌

```bash
# 令牌有效期：1 小时
# 如需刷新，重新运行
gog auth
```

### 3. 撤销授权

```bash
# 如需撤销所有授权
访问：https://myaccount.google.com/permissions
找到 "OpenClaw Gog" → 点击"撤销访问"
```

---

## 📊 配额限制

| API | 免费配额 | 说明 |
|-----|---------|------|
| Drive | 15GB 免费存储 | 与 Gmail/Photos 共享 |
| Gmail | 1000 次/天 | 个人使用足够 |
| Calendar | 1000 次/天 | 个人使用足够 |
| Docs/Sheets | 无明确限制 | 合理使用 |

---

## ✅ 配置检查清单

配置完成后，逐项检查：

- [ ] Google Cloud 项目已创建
- [ ] 5 个 API 已启用
- [ ] OAuth 同意屏幕已配置
- [ ] credentials.json 已下载
- [ ] credentials.json 已放到正确位置
- [ ] gog auth 授权成功
- [ ] gog drive list 测试成功
- [ ] gog gmail list 测试成功
- [ ] gog calendar today 测试成功

**全部打勾 = 配置成功！** 🎉

---

## 🆘 获取帮助

### 查看帮助
```bash
gog --help
gog drive --help
gog gmail --help
```

### 查看版本
```bash
gog --version
```

### 查看授权状态
```bash
gog auth status
```

---

## 📝 更新日志

| 日期 | 版本 | 更新内容 |
|------|------|---------|
| 2026-04-04 | v1.0 | 初始版本，爪爪编写 |

---

**配置成功后，阿简就可以让爪爪帮你操作 Google Drive/Gmail/Calendar 啦！** 🦞✨

有问题随时问爪爪～
