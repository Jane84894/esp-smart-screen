# 农历传感器集成 - 实体列表

## 📊 所有实体及标识符

### 主要实体

| 序号 | 实体标识符 (Entity ID) | 实体名称 | 类型 | 说明 | 示例值 |
|------|------------------------|----------|------|------|--------|
| 1 | `sensor.lunar_date` | 农历日期 | sensor | 农历日期显示 | `正月廿六` |
| 2 | `sensor.lunar_year` | 农历年份 | sensor | 农历年份数字 | `2026` |
| 3 | `sensor.lunar_month` | 农历月份 | sensor | 农历月份数字 | `1` |
| 4 | `sensor.lunar_day` | 农历日期 | sensor | 农历日期数字 | `26` |
| 5 | `sensor.lunar_zodiac` | 生肖 | sensor | 生肖 | `马` |
| 6 | `sensor.lunar_gz_year` | 干支年 | sensor | 干支纪年 | `丙午` |
| 7 | `sensor.lunar_next_festival` | 下一个传统节日 | sensor | 下一个节日名称 | `龙抬头` |
| 8 | `sensor.lunar_festival_countdown` | 节日倒计时 | sensor | 距离节日天数 | `5` |

---

## 🔧 ESPHome 配置示例

### 在 ESPHome 中使用这些实体

```yaml
# ESPHome 配置示例
sensor:
  # 农历日期显示
  - platform: homeassistant
    id: lunar_date_sensor
    entity_id: sensor.lunar_date
    internal: true
    on_value:
      then:
        - lambda: |-
            if (id(lunar_label) != nullptr) {
              lv_label_set_text(id(lunar_label), id(lunar_date_sensor).get_state().c_str());
            }

  # 生肖显示
  - platform: homeassistant
    id: zodiac_sensor
    entity_id: sensor.lunar_zodiac
    internal: true
    on_value:
      then:
        - lambda: |-
            if (id(zodiac_label) != nullptr) {
              lv_label_set_text(id(zodiac_label), id(zodiac_sensor).get_state().c_str());
            }

  # 干支年显示
  - platform: homeassistant
    id: gz_year_sensor
    entity_id: sensor.lunar_gz_year
    internal: true

  # 下一个节日显示
  - platform: homeassistant
    id: next_festival_sensor
    entity_id: sensor.lunar_next_festival
    internal: true

  # 节日倒计时显示
  - platform: homeassistant
    id: festival_countdown_sensor
    entity_id: sensor.lunar_festival_countdown
    internal: true
    on_value:
      then:
        - lambda: |-
            if (id(festival_label) != nullptr) {
              char buffer[50];
              sprintf(buffer, "距离%s: %.0f 天", 
                      id(next_festival_sensor).get_state().c_str(),
                      id(festival_countdown_sensor).get_state());
              lv_label_set_text(id(festival_label), buffer);
            }
```

### LVGL 标签配置

```yaml
lvgl:
  widgets:
    # 农历日期标签
    - label:
        id: lunar_label
        text: "农历加载中..."
        align: TOP_LEFT
        x: 10
        y: 100
        text_font: FONT_CHINESE
    
    # 生肖标签
    - label:
        id: zodiac_label
        text: "生肖：加载中"
        align: TOP_LEFT
        x: 10
        y: 130
        text_font: FONT_CHINESE
    
    # 节日倒计时标签
    - label:
        id: festival_label
        text: "距离春节：--天"
        align: TOP_LEFT
        x: 10
        y: 160
        text_font: FONT_CHINESE
```

---

## 🏠 Home Assistant Lovelace 卡片示例

### 基础卡片

```yaml
type: entities
title: 🌙 农历
entities:
  - entity: sensor.lunar_date
    name: 农历日期
    icon: mdi:calendar-star
  - entity: sensor.lunar_zodiac
    name: 生肖
    icon: mdi:dragon
  - entity: sensor.lunar_gz_year
    name: 干支年
    icon: mdi:calendar-text
  - type: divider
  - entity: sensor.lunar_next_festival
    name: 下一个节日
    icon: mdi:celebration
  - entity: sensor.lunar_festival_countdown
    name: 倒计时
    suffix: 天
    icon: mdi:timer-sand
```

### 高级卡片 (带属性)

```yaml
type: glance
entities:
  - entity: sensor.lunar_date
    name: 农历
    icon: mdi:calendar-star
  - entity: sensor.lunar_zodiac
    name: 生肖
    icon: mdi:dragon
  - entity: sensor.lunar_gz_year
    name: 干支
    icon: mdi:calendar-text
  - entity: sensor.lunar_next_festival
    name: 节日
    icon: mdi:gift
```

### 自定义卡片

```yaml
type: custom:button-card
entity: sensor.lunar_date
name: 农历
show_state: true
show_label: true
show_name: true
state:
  - value: "正月"
    styles:
      card:
        - background-color: "#ff6b6b"
      label:
        - color: "#fff"
custom_fields:
  gregorian: >
    [[[ return states['sensor.lunar_date'].attributes.gregorian_date; ]]]
  zodiac: >
    [[[ return '🐴 ' + states['sensor.lunar_zodiac'].state; ]]]
  next_festival: >
    [[[ return '🏮 ' + states['sensor.lunar_next_festival'].state + ' (' + states['sensor.lunar_festival_countdown'].state + '天)'; ]]]
```

---

## 📋 实体属性详情

### `sensor.lunar_date` 属性

| 属性名 | 说明 | 示例值 |
|--------|------|--------|
| `gregorian_date` | 公历日期 | `2026-03-14` |
| `lunar_year` | 农历年份 | `2026` |
| `lunar_month` | 农历月份 | `1` |
| `lunar_day` | 农历日期 | `26` |
| `friendly_name` | 友好名称 | `农历日期` |
| `icon` | 图标 | `mdi:calendar-star` |

### `sensor.lunar_next_festival` 属性

| 属性名 | 说明 | 示例值 |
|--------|------|--------|
| `days_until` | 距离节日天数 | `5` |
| `festival_date` | 节日农历日期 | `二月初二` |
| `friendly_name` | 友好名称 | `下一个传统节日` |
| `icon` | 图标 | `mdi:celebration` |

### `sensor.lunar_festival_countdown` 属性

| 属性名 | 说明 | 示例值 |
|--------|------|--------|
| `unit_of_measurement` | 单位 | `天` |
| `friendly_name` | 友好名称 | `节日倒计时` |
| `icon` | 图标 | `mdi:timer-sand` |

---

## 🔍 快速检查命令

### 在 Home Assistant Developer Tools 中检查

```
sensor.lunar_date
sensor.lunar_zodiac
sensor.lunar_gz_year
sensor.lunar_next_festival
sensor.lunar_festival_countdown
```

### 使用 Template 测试

```jinja2
{{ states('sensor.lunar_date') }}
{{ state_attr('sensor.lunar_date', 'gregorian_date') }}
{{ states('sensor.lunar_zodiac') }}
{{ states('sensor.lunar_gz_year') }}
{{ states('sensor.lunar_next_festival') }}
{{ states('sensor.lunar_festival_countdown') }}
```

---

## 💡 使用建议

1. **ESPHome 显示**: 使用 `sensor.lunar_date` 和 `sensor.lunar_zodiac` 显示基本信息
2. **倒计时功能**: 使用 `sensor.lunar_festival_countdown` 显示距离下一个节日的天数
3. **完整信息**: 在 Home Assistant 中使用所有实体创建完整的农历信息卡片
4. **自动化**: 可以基于这些实体创建自动化，比如节日提醒

---

## 📊 实体状态更新频率

- **自动更新**: 每小时自动更新一次
- **手动刷新**: 重启 Home Assistant 或重新加载集成
- **ESPHome 同步**: 通过 Home Assistant time 组件同步时间

---

**总计：8 个传感器实体** 🦞
