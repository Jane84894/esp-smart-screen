# GitHub Skill 安装完成！✅

## 安装状态

| 项目 | 状态 |
|------|------|
| **gh CLI** | ✅ 已安装 (v2.45.0) |
| **GitHub Skill** | ✅ 已启用 |
| **认证状态** | ⚠️ 需要登录 |

---

## 🔐 下一步：认证 GitHub

请在服务器上执行以下命令进行认证：

```bash
gh auth login
```

**认证流程：**

1. 运行 `gh auth login`
2. 选择 **GitHub.com**
3. 选择 **HTTPS** 作为首选协议
4. 选择 **Login with a web browser**
5. 在浏览器中打开显示的 URL
6. 登录 GitHub 并授权
7. 复制验证码并粘贴到终端

**或者使用 Token 认证：**

```bash
gh auth login --with-token <<< "你的_GITHUB_TOKEN"
```

**获取 Token：**
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 选择 scopes: `repo`, `workflow`, `read:org`
4. 生成并复制 token

---

## 📋 验证认证

```bash
gh auth status
```

成功输出示例：
```
github.com
  ✓ Logged in to github.com as your-username (~/.config/gh/hosts.yml)
  ✓ Git operations for github.com configured to use https protocol.
  ✓ Token: gho_*********************
```

---

## 🎯 使用示例

认证后，你可以这样使用：

```
你：查看我最新的 PR
你：创建一个新的 issue
你：检查 CI 状态
你：列出我的仓库
```

---

## 📖 常用命令

### Pull Requests
```bash
gh pr list                    # 列出 PR
gh pr view <PR 号>            # 查看 PR 详情
gh pr checks <PR 号>          # 检查 CI 状态
gh pr create                  # 创建 PR
```

### Issues
```bash
gh issue list                 # 列出 issue
gh issue create               # 创建 issue
gh issue view <issue 号>      # 查看详情
```

### CI/CD
```bash
gh run list                   # 列出工作流运行
gh run view <run 号>          # 查看运行详情
gh run watch <run 号>         # 实时观看运行
```

### 仓库
```bash
gh repo list                  # 列出仓库
gh repo view                  # 查看当前仓库
gh repo create                # 创建仓库
```

---

**安装完成！请执行 `gh auth login` 进行认证。** 🚀
