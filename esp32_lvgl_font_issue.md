# ESPHome LVGL Font Glyph Handling Issues

## Summary
Three critical issues with how ESPHome's font component parses and compiles the `glyphs` string, forcing developers to manually perform character deduplication and string splitting that should be handled by the compiler.

---

## Issue 1: Hard Compilation Failure on Duplicate Glyphs ❌

### Problem
If the same character appears more than once in the `glyphs` configuration, the ESPHome compiler **crashes completely**.

### Example Config
```yaml
font:
  - file: "fonts/misans.ttf"
    id: font_date
    size: 20
    bpp: 2
    glyphs: "ABCDEFGHIJKLMNOPQRSTUVWXYZ 路由器服务器 PVE" 
    # '器' is duplicated in "路由器" and "服务器"
    # 'P', 'V', 'E' are duplicated in the A-Z alphabet
```

### Error Log
```
INFO ESPHome 2026.2.4
INFO Reading configuration /config/esphome/esphome-web-9b2060.yaml...
Failed config
font: [source /config/esphome/esphome-web-9b2060.yaml:576]
...
 Found duplicate glyphs: 器 (\u5668), V (V), P (P), E (E).
```

### Expected Behavior
The font compiler should **automatically deduplicate** the requested characters using a Set or hash map before generating the C++ font arrays, rather than failing the build.

---

## Issue 2: Silent Truncation of Long Strings 🔇

### Problem
When supplying a very long single-line string (150-200+ Chinese characters) to the `glyphs` parameter, the parser **silently truncates** the string at a certain length. It compiles successfully, but characters at the end are entirely missing from the compiled font.

### Example Config
```yaml
font:
  - file: "fonts/misans.ttf"
    id: font_small
    size: 16
    glyphs: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789...[150+ characters]...系统服务"
```

### Runtime Warning Log
```
[18:28:35.623][W][lvgl:000]: lv_draw_sw_letter: lv_draw_letter: glyph dsc. not found for U+670D (in lv_draw_sw_letter.c line #105) # '服'
[18:28:35.626][W][lvgl:000]: lv_draw_sw_letter: lv_draw_letter: glyph dsc. not found for U+52A1 (in lv_draw_sw_letter.c line #105) # '务'
```

### Expected Behavior
Long strings should be parsed in their entirety **without arbitrary truncation limits**.

---

## Issue 3: YAML Silently Strips Space Character (U+20) 🚫

### Problem
When adding a space to the `glyphs` string (e.g., `glyphs: " abcdefg"` or `glyphs: "abcdefg "`), the YAML parser often trims the leading/trailing spaces. As a result, the U+20 glyph is never included in the font.

### Runtime Warning Log
```
[17:06:23.245][W][lvgl:000]: lv_draw_sw_letter: lv_draw_letter: glyph dsc. not found for U+20 (in lv_draw_sw_letter.c line #105)
```

### Expected Behavior
Spaces should be preserved when explicitly included in the glyphs string, or there should be a clear way to include the space character.

---

## Current Workarounds

To work around all three issues simultaneously, developers are forced to use YAML list syntax and meticulously manually deduplicate every character:

```yaml
font:
  - file: "fonts/misans.ttf"
    id: font_small
    size: 16
    bpp: 2
    glyphs:
      - " " # Isolated space to force inclusion
      - "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.%°/-:●()!·"
      - "体感温度状态应用菜单返回主页路由器中心智能家居存储虚拟机系统设置" # Strictly manually deduplicated
      - "内磁盘在线备上传下载旁连接数去广告已拦截率耗时屏幕亮息间秒重启"
      - "距离还有天今就是月日星期一二三四五六七八九十晴多云阴阵雨雪雷暴风未知"
      - "春节元宵旦清明端午秋阳除夕腊小年国庆劳动建军党妇女青儿童教师父母亲寒衣植树龙抬头"
      - "立水惊蛰分谷满芒种夏至暑大处白露霜降冬服务"
```

---

## Environment

- **ESPHome Version**: 2026.2.4 (and earlier)
- **Operating Environment**: Home Assistant Add-on / CLI
- **Board**: ESP32-S3
- **Display**: LVGL with Chinese font support
- **Font File**: MiSans.ttf (and other TTF fonts)
- **Components**: `font`, `lvgl`

---

## Proposed Solutions / Feature Requests

### 1. Auto-Deduplication ⭐
Update the Python font generation script to **internally cast the glyphs string to a `set()`** before processing, silently discarding duplicates instead of throwing a `Failed config` error.

```python
# Current behavior (fails on duplicates)
glyphs = config['glyphs']  # "ABC 器器器" → FAILS

# Proposed behavior (auto-deduplicate)
glyphs = list(set(config['glyphs']))  # "ABC 器器器" → ['A', 'B', 'C', '器']
```

### 2. Fix Truncation 🔧
Investigate the character/byte limit when parsing single-line strings in `glyphs` and **remove or increase this limitation**.

- Check for hardcoded limits in `esphome/components/font/__init__.py`
- Consider chunking long strings automatically
- Add warning (not error) if string exceeds recommended length

### 3. Space Handling 💬
Either:
- **Explicitly enforce U+20 inclusion** if standard ASCII is detected in the font
- **Provide clearer mechanism/documentation** for including whitespace (e.g., `glyphs: "abc\\u0020def"` or `include_space: true`)
- **Preserve leading/trailing spaces** in YAML parsing

---

## Impact

These issues significantly impact developers creating multilingual UIs, especially for:
- Chinese/Japanese/Korean languages (large character sets)
- Complex dashboards with many labels
- Dynamic content that requires comprehensive font coverage

The current workarounds are error-prone and time-consuming, requiring manual character deduplication that should be handled by the build system.

---

## Additional Context

This appears to be related to ESPHome's font component and how it interfaces with the LVGL graphics library. The issues are particularly problematic for non-Latin scripts where character sets are much larger and manual deduplication is impractical.
