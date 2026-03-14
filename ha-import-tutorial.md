# Home Assistant 导入配置教程 🦞

> 2026 年最新版 · 简单易懂

---

## 📁 方法一：使用 File Editor（推荐新手）

### 步骤 1：安装 File Editor
1. 打开 HA → **设置** → **插件**
2. 点右下角 **商店**
3. 搜索 `File Editor` 或 `Configuration file editor`
4. 点击安装 → 启动

### 步骤 2：导入配置文件
1. 打开 File Editor 插件
2. 导航到 `/config` 目录
3. 上传文件：
   - `ha-areas.yaml` → 复制到 `/config/areas.yaml`
   - `ha-dashboard.yaml` → 复制到 `/config/dashboards/`
4. 点击 **保存**

### 步骤 3：重启 HA
1. 设置 → 系统 → 重启
2. 等待 1-2 分钟

---

## 📁 方法二：使用 Samba 共享（推荐）

### 步骤 1：安装 Samba
1. HA → 设置 → 插件 → 商店
2. 搜索 `Samba share`
3. 安装并启动

### 步骤 2：配置 Samba
```yaml
# Samba 配置
workgroup: WORKGROUP
username: homeassistant
password: 你的密码
allow_hosts:
  - 192.168.2.0/24
```

### 步骤 3：从电脑访问
1. Windows: `\\192.168.2.6\config`
2. Mac: `smb://192.168.2.6/config`
3. 复制配置文件进去

---

## 📁 方法三：使用 SSH（高级）

### 步骤 1：安装 SSH
```bash
# HA 插件商店安装 Terminal & SSH
```

### 步骤 2：上传文件
```bash
# 使用 SCP 上传
scp ha-areas.yaml root@192.168.2.6:/config/
scp ha-dashboard.yaml root@192.168.2.6:/config/dashboards/
```

### 步骤 3：编辑 configuration.yaml
```yaml
# 在 /config/configuration.yaml 添加：
area: !include areas.yaml
dashboard: !include dashboards/ha-dashboard.yaml
```

---

## ✅ 验证导入

### 检查区域
1. 设置 → 区域
2. 应该看到：
   - 潮州枫溪
   - 卧室
   - 客厅
   - 厨房
   - 卫生间
   - 书房
   - 室外

### 检查 Dashboard
1. 侧边栏 → 仪表板
2. 应该看到：
   - 🏠 首页
   - 🛏️ 卧室
   - 🛋️ 客厅
   - 📹 安防
   - 🔧 设备管理

---

## 🔧 故障排除

### 问题 1：配置不生效
**解决**：
1. 开发者工具 → YAML → 检查配置
2. 有错误会显示
3. 修复后重启

### 问题 2：Dashboard 不显示
**解决**：
```yaml
# configuration.yaml 确保有：
dashboards:
  ha-dashboard:
    mode: yaml
    title: 爪爪整理
    icon: mdi:home-assistant
    show_in_sidebar: true
```

### 问题 3：区域无法创建
**解决**：
- HA 2026.x 需要通过前端创建
- 设置 → 区域 → 添加区域
- 手动添加 7 个区域

---

## 📝 文件位置

| 文件 | 目标位置 | 作用 |
|------|---------|------|
| `ha-areas.yaml` | `/config/areas.yaml` | 区域配置 |
| `ha-dashboard.yaml` | `/config/dashboards/` | Dashboard |
| `configuration.yaml` | `/config/configuration.yaml` | 主配置 |

---

## 🎯 快速命令

```bash
# 检查配置
ha core check

# 重启 HA
ha core restart

# 查看日志
ha core logs
```

---

*教程完毕！有问题随时问爪爪 🦞*
