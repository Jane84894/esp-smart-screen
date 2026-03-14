#!/usr/bin/env python3
"""
农历传感器 + 节日倒计时 - 推送到 Home Assistant
功能:
  - 农历日期 (格式：正月初六)
  - 干支纪年
  - 生肖
  - 传统节日倒计时
  - 法定节假日倒计时
"""
from lunardate import LunarDate
from datetime import datetime, timedelta
import requests
import os

HA_URL = os.getenv("HA_URL", "http://192.168.2.6:8123")
HA_TOKEN = os.getenv("HA_TOKEN", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3MGMzZDFlNDg0Yzc0MzRjOTA4OTE3NjIzZGJiMDNhYiIsImlhdCI6MTc3MzA1ODI3MCwiZXhwIjoyMDg4NDE4MjcwfQ.xkCBDx3m6x9NibfaaNPL3Z8GnqR3YZnRszNk1S8PKa0")

MONTH_CN = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"]
DAY_CN = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
          "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
          "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"]

TRADITIONAL_FESTIVALS = {
    "春节": (1, 1),
    "元宵节": (1, 15),
    "龙抬头": (2, 2),
    "上巳节": (3, 3),
    "清明节": (3, 15),
    "端午节": (5, 5),
    "七夕节": (7, 7),
    "中元节": (7, 15),
    "中秋节": (8, 15),
    "重阳节": (9, 9),
    "下元节": (10, 15),
    "腊八节": (12, 8),
    "小年": (12, 23),
    "除夕": (12, 30),
}

PUBLIC_HOLIDAYS = {
    "元旦": (1, 1),
    "妇女节": (3, 8),
    "劳动节": (5, 1),
    "青年节": (5, 4),
    "儿童节": (6, 1),
    "建党节": (7, 1),
    "建军节": (8, 1),
    "教师节": (9, 10),
    "国庆节": (10, 1),
}

def get_lunar_str(month, day):
    month_str = MONTH_CN[month - 1] if month <= 12 else "腊月"
    day_str = DAY_CN[day - 1] if day <= 30 else "初一"
    return f"{month_str}月{day_str}"

def get_gz_year(year):
    stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
    branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    zodiacs = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]
    stem_idx = (year - 4) % 10
    branch_idx = (year - 4) % 12
    return stems[stem_idx] + branches[branch_idx], zodiacs[branch_idx]

def countdown_to_traditional(lunar_today):
    countdowns = []
    for name, (month, day) in TRADITIONAL_FESTIVALS.items():
        if (lunar_today.month < month) or (lunar_today.month == month and lunar_today.day < day):
            target_year = lunar_today.year
        else:
            target_year = lunar_today.year + 1
        days_diff = (target_year - lunar_today.year) * 354 + (month - lunar_today.month) * 29 + (day - lunar_today.day)
        if days_diff > 0:
            countdowns.append({"name": name, "days": days_diff, "date": f"{target_year}年{get_lunar_str(month, day)}"})
    countdowns.sort(key=lambda x: x['days'])
    return countdowns[:3]

def countdown_to_public():
    today = datetime.now()
    countdowns = []
    for name, (month, day) in PUBLIC_HOLIDAYS.items():
        try:
            this_year = today.replace(month=month, day=day)
            if this_year < today:
                next_year = today.replace(year=today.year + 1, month=month, day=day)
                days = (next_year - today).days
            else:
                days = (this_year - today).days
            if days > 0:
                countdowns.append({"name": name, "days": days, "date": f"{today.year if days < 365 else today.year + 1}年{month}月{day}日"})
        except:
            continue
    countdowns.sort(key=lambda x: x['days'])
    return countdowns[:3]

def get_lunar_info():
    lunar = LunarDate.today()
    now = datetime.now()
    gz_year, zodiac = get_gz_year(lunar.year)
    lunar_str = get_lunar_str(lunar.month, lunar.day)
    
    return {
        'gregorian': now.strftime('%Y-%m-%d'),
        'lunar_full': lunar_str,
        'lunar_year': lunar.year,
        'lunar_month': lunar.month,
        'lunar_day': lunar.day,
        'gz_year': gz_year,
        'zodiac': zodiac,
        'week_cn': ['日', '一', '二', '三', '四', '五', '六'][int(now.strftime('%w'))],
        'traditional_countdown': countdown_to_traditional(lunar),
        'public_countdown': countdown_to_public(),
    }

def push_to_ha():
    lunar = get_lunar_info()
    headers = {"Authorization": f"Bearer {HA_TOKEN}", "Content-Type": "application/json"}
    
    next_traditional = lunar['traditional_countdown'][0] if lunar['traditional_countdown'] else None
    next_public = lunar['public_countdown'][0] if lunar['public_countdown'] else None
    
    data = {
        "state": lunar['lunar_full'],
        "attributes": {
            "friendly_name": "农历日期",
            "icon": "mdi:calendar-star",
            "gregorian_date": lunar['gregorian'],
            "lunar_year": lunar['lunar_year'],
            "lunar_month": lunar['lunar_month'],
            "lunar_day": lunar['lunar_day'],
            "gz_year": lunar['gz_year'],
            "zodiac": lunar['zodiac'],
            "week_cn": lunar['week_cn'],
            "next_traditional": next_traditional['name'] if next_traditional else None,
            "next_traditional_days": next_traditional['days'] if next_traditional else None,
            "next_traditional_date": next_traditional['date'] if next_traditional else None,
            "next_public": next_public['name'] if next_public else None,
            "next_public_days": next_public['days'] if next_public else None,
            "next_public_date": next_public['date'] if next_public else None,
        }
    }
    
    url = f"{HA_URL}/api/states/sensor.lunar_date"
    resp = requests.post(url, headers=headers, json=data)
    return resp.status_code == 200, lunar

if __name__ == '__main__':
    success, lunar = push_to_ha()
    if success:
        print(f"✅ 农历更新成功")
        print(f"📅 公历：{lunar['gregorian']} 星期{lunar['week_cn']}")
        print(f"🌙 农历：{lunar['lunar_year']}年{lunar['lunar_full']}")
        print(f"🐴 干支：{lunar['gz_year']}年 生肖：{lunar['zodiac']}")
        if lunar['traditional_countdown']:
            t = lunar['traditional_countdown'][0]
            print(f"🏮 下一个传统节日：{t['name']} - 还有{t['days']}天 ({t['date']})")
        if lunar['public_countdown']:
            p = lunar['public_countdown'][0]
            print(f"🎉 下一个法定节假日：{p['name']} - 还有{p['days']}天 ({p['date']})")
    else:
        print(f"❌ 推送失败")
        exit(1)
