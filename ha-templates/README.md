# Home Assistant 农历传感器模板

## 📋 功能

- 🌙 农历日期显示 (格式：正月廿六)
- 🐴 生肖计算
- 📅 干支纪年
- 🏮 传统节日倒计时
- 🎉 法定节假日倒计时

## 🔧 安装方法

### 方法 1: 添加到 configuration.yaml

```yaml
# configuration.yaml
python_script:
  lunar_sensor:
```

然后将 `lunar_sensor.py` 放到 HA 的 `config/python_scripts/` 目录。

### 方法 2: 使用自动化定时运行

```yaml
# automation.yaml
automation:
  - alias: "🌙 每日更新农历"
    trigger:
      - platform: time
        hours: 0
        minutes: 0
    action:
      - service: python_script.lunar_sensor
```

## 📦 文件

- `lunar_sensor.py` - 农历计算脚本 (需要 `lunardate` 库)
- `lunar_automation.yaml` - HA 自动化配置

## 🚀 使用

### 1️⃣ 安装依赖

```bash
# 在 HA 终端运行
pip3 install lunardate
```

### 2️⃣ 复制文件

```bash
# 复制脚本到 HA 配置目录
cp lunar_sensor.py /config/python_scripts/
cp lunar_automation.yaml /config/automations/
```

### 3️⃣ 重启 HA

```bash
# 重启 Home Assistant
ha core restart
```

### 4️⃣ 运行脚本

```bash
# 手动运行测试
python3 /config/python_scripts/lunar_sensor.py

# 或在 HA 开发者工具 → 服务 中调用
service: python_script.lunar_sensor
```

## 📊 生成的实体

运行后会自动创建以下实体：

### 主实体
```yaml
sensor.lunar_date
  state: "正月廿六"
  attributes:
    gregorian_date: "2026-03-14"
    lunar_year: 2026
    lunar_month: 1
    lunar_day: 26
    lunar_year_full: "2026 年正月廿六"
    gz_year: "丙午"
    zodiac: "马"
    week_cn: "六"
    next_traditional: "龙抬头"
    next_traditional_days: 5
    next_traditional_date: "2026 年二月初二"
    next_public: "劳动节"
    next_public_days: 48
    next_public_date: "2026 年 5 月 1 日"
```

## 🔍 在 ESPHome 中使用

```yaml
# ESPHome 配置示例
text_sensor:
  # 农历日期
  - platform: homeassistant
    id: ha_lunar_date
    entity_id: sensor.lunar_date
  
  # 生肖
  - platform: homeassistant
    id: ha_zodiac
    entity_id: sensor.lunar_date
    attribute: zodiac
  
  # 干支
  - platform: homeassistant
    id: ha_gz_year
    entity_id: sensor.lunar_date
    attribute: gz_year
  
  # 下一个节日
  - platform: homeassistant
    id: ha_next_festival
    entity_id: sensor.lunar_date
    attribute: next_traditional

sensor:
  # 农历月份
  - platform: homeassistant
    id: ha_lunar_month
    entity_id: sensor.lunar_date
    attribute: lunar_month
  
  # 农历日期 (数字)
  - platform: homeassistant
    id: ha_lunar_day
    entity_id: sensor.lunar_date
    attribute: lunar_day
  
  # 节日倒计时
  - platform: homeassistant
    id: ha_festival_days
    entity_id: sensor.lunar_date
    attribute: next_traditional_days
```

## 🛠️ 故障排除

### 脚本运行失败
```bash
# 检查 lunardate 是否安装
pip3 list | grep lunar

# 手动测试脚本
python3 /config/python_scripts/lunar_sensor.py
```

### 实体未创建
- 确认 `python_script:` 已在 configuration.yaml 中启用
- 检查 HA 日志是否有错误
- 手动运行脚本查看输出

### 农历日期不准确
- 脚本使用 `lunardate` 库计算，确保库是最新版
- 每天午夜自动更新，或手动调用服务刷新

---

**作者**: D1ts1337
**版本**: 1.0
**许可证**: MIT
