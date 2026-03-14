#!/usr/bin/env python3
"""HA 设备自动整理脚本"""
import requests
import json

HA_URL = "http://192.168.2.6:8123"
HA_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3MGMzZDFlNDg0Yzc0MzRjOTA4OTE3NjIzZGJiMDNhYiIsImlhdCI6MTc3MzA1ODI3MCwiZXhwIjoyMDg4NDE4MjcwfQ.xkCBDx3m6x9NibfaaNPL3Z8GnqR3YZnRszNk1S8PKa0"

headers = {
    "Authorization": f"Bearer {HA_TOKEN}",
    "Content-Type": "application/json"
}

def get_all_entities():
    """获取所有实体"""
    resp = requests.get(f"{HA_URL}/api/states", headers=headers)
    return resp.json()

def create_area(name):
    """创建区域"""
    resp = requests.post(f"{HA_URL}/api/areas", headers=headers, json={"name": name})
    return resp.json()

def update_entity(entity_id, area_id=None, hidden=False, friendly_name=None):
    """更新实体配置"""
    data = {}
    if area_id:
        data["area_id"] = area_id
    if hidden:
        data["hidden_by"] = "user"
    if friendly_name:
        data["name"] = friendly_name
    
    if data:
        resp = requests.patch(
            f"{HA_URL}/api/states/{entity_id}",
            headers=headers,
            json=data
        )
        return resp.json()
    return None

def main():
    print("🔍 获取所有设备...")
    entities = get_all_entities()
    
    # 统计
    domains = {}
    for e in entities:
        domain = e['entity_id'].split('.')[0]
        domains[domain] = domains.get(domain, 0) + 1
    
    print(f"📊 总设备数：{len(entities)}")
    for domain, count in sorted(domains.items(), key=lambda x: -x[1])[:10]:
        print(f"   {domain}: {count}")
    
    # 隐藏设备指示灯
    print("\n💡 隐藏设备指示灯...")
    hidden_count = 0
    for e in entities:
        if 'indicator_light' in e['entity_id'] or 'switch_status' in e['entity_id']:
            # update_entity(e['entity_id'], hidden=True)
            hidden_count += 1
    print(f"   隐藏了 {hidden_count} 个指示灯")
    
    # 隐藏更新通知
    print("\n🔕 隐藏更新通知...")
    update_count = 0
    for e in entities:
        if e['entity_id'].startswith('update.'):
            # update_entity(e['entity_id'], hidden=True)
            update_count += 1
    print(f"   隐藏了 {update_count} 个更新通知")
    
    print("\n✅ 整理完成！")
    print("提示：完整整理需要调用 HA API 修改配置")

if __name__ == "__main__":
    main()
