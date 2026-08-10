#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TidyZen S3 准确率评估脚本 v2（并发+重试版）
- 复用 App 的 BUILD_ANALYSIS_PROMPT（逐字，从 ai.ts 提取） + 相同后处理
- JPEG 输入（与 App toJpegBase64 compress 0.8 一致）
- 3 路并发 + 超时 240s + 每张重试 2 次
用法: python3 /tmp/aiw-verify/e2e-accuracy.py
"""
import base64, json, os, re, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

PHOTOS_DIR = '/tmp/aiw-verify/photos-jpg'
ENV_PATH   = '/Users/eeexu/web/ll/proving-ground/TidyZen/.env'
REPORT_DIR = '/tmp/aiw-verify'
TIMEOUT    = 240
MAX_RETRY  = 2
CONCURRENCY = 3

# ── 从 services/ai.ts 提取 BUILD_ANALYSIS_PROMPT（保证逐字一致） ─────────────
def extract_prompt():
    data = open('/Users/eeexu/web/ll/proving-ground/TidyZen/services/ai.ts', 'rb').read().decode('utf-8')
    start = data.index('const BUILD_ANALYSIS_PROMPT = `') + len('const BUILD_ANALYSIS_PROMPT = `')
    end = data.index('`;', start)
    return data[start:end]

BUILD_ANALYSIS_PROMPT = extract_prompt()

CLUTTER_WEIGHTS = {
    'cardboard_box': 1.5, 'trash': 1.4, 'food_container': 1.3,
    'clothing': 1.2, 'cable': 1.0, 'book': 1.0, 'bottle': 0.8,
    'shoe': 0.8, 'pillow_blanket': 0.7, 'other_clutter': 0.6,
}
VALID_SCENES = ['bedroom', 'living_room', 'bathroom', 'desk_area', 'floor']

def calc_score(items, lighting):
    s = sum((CLUTTER_WEIGHTS.get(i['label'], 1.0) * i['area_ratio'] * 100) for i in items)
    s += 5 if lighting == 'dim' else 0
    return max(5, min(100, round(100 - s)))

# ── Ground truth（key 用 .jpg 后缀） ────────────────────────────────────────
GT = {
    'S01-001-bedroom-normal.jpg':      ('bedroom', 'normal', ['clothing']),
    'S01-002-bedroom-bright.jpg':      ('bedroom', 'bright', ['clothing']),
    'S02-001-living_room-normal.jpg':  ('living_room', 'normal', ['cardboard_box']),
    'S02-002-living_room-bright.jpg':  ('living_room', 'bright', ['cardboard_box']),
    'S03-001-desk_area-bright.jpg':    ('desk_area', 'bright', ['other_clutter', 'bottle']),
    'S03-002-desk_area-normal.jpg':    ('desk_area', 'normal', ['other_clutter', 'bottle']),
    'S04-001-floor-normal.jpg':        ('floor', 'normal', ['shoe', 'trash', 'other_clutter']),
    'S04-002-living_room-bright.jpg':  ('living_room', 'bright', ['shoe', 'other_clutter']),
    'S05-001-bedroom-normal.jpg':      ('bedroom', 'normal', ['pillow_blanket', 'clothing']),
    'S05-002-bedroom-dim.jpg':         ('bedroom', 'dim', ['pillow_blanket', 'clothing']),
    'S06-001-desk_area-normal.jpg':    ('desk_area', 'normal', ['cable']),
    'S06-002-desk_area-dim.jpg':       ('desk_area', 'dim', ['cable']),
    'S07-001-bathroom-bright.jpg':     ('bathroom', 'bright', ['bottle']),
    'S07-002-bathroom-normal.jpg':     ('bathroom', 'normal', ['bottle']),
    'S08-001-desk_area-normal.jpg':    ('desk_area', 'normal', ['food_container', 'trash', 'bottle']),
    'S08-002-living_room-dim.jpg':     ('living_room', 'dim', ['food_container', 'trash']),
    'S09-001-bedroom-normal.jpg':      ('bedroom', 'normal', ['book']),
    'S09-002-desk_area-bright.jpg':    ('desk_area', 'bright', ['book']),
    'S10-001-bedroom-dim.jpg':         ('bedroom', 'dim', []),
    'S10-002-living_room-dim.jpg':     ('living_room', 'dim', []),
}

def load_env():
    env = {}
    for line in open(ENV_PATH):
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()
    return env

def call_ai(api_url, api_key, img_path, timeout=TIMEOUT):
    with open(img_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    body = {
        'model': 'doubao-seed-2.0-pro',
        'messages': [{
            'role': 'user',
            'content': [
                {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}},
                {'type': 'text', 'text': BUILD_ANALYSIS_PROMPT},
            ],
        }],
    }
    req = urllib.request.Request(
        api_url,
        data=json.dumps(body).encode(),
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'},
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read().decode())

    msg = data.get('choices', [{}])[0].get('message', {})
    content = (msg.get('content') or '').strip()
    if not content:
        content = (msg.get('reasoning_content') or '').strip()
    m = re.search(r'\{[\s\S]*\}', content)
    if m:
        content = m.group(0)
    content = re.sub(r'^```(?:json)?\s*', '', content.strip(), flags=re.I)
    content = re.sub(r'\s*```$', '', content)
    return json.loads(content)

def evaluate_one(api_url, api_key, fname):
    exp_scene, exp_light, exp_labels = GT[fname]
    path = os.path.join(PHOTOS_DIR, fname)
    last_err = None
    t0 = time.time()
    for attempt in range(MAX_RETRY + 1):
        try:
            raw = call_ai(api_url, api_key, path)
            scene = raw.get('scene')
            lighting = raw.get('lighting')
            items = [it for it in raw.get('clutter_items', []) if it.get('confidence', 0) >= 0.4]
            got_labels = [it['label'] for it in items]
            if scene not in VALID_SCENES:
                scene_ok, scene_note = False, f'invalid/unknown: {scene}'
            else:
                scene_ok, scene_note = (scene == exp_scene), f'{scene} vs {exp_scene}'
            light_ok = (lighting == exp_light)
            missed = [l for l in exp_labels if l not in got_labels]
            spurious = sorted(set(got_labels) - set(exp_labels)) if exp_labels else sorted(set(got_labels))
            score = calc_score(items, lighting)
            return {
                'file': fname, 'scene_ok': scene_ok, 'scene_note': scene_note,
                'light_ok': light_ok, 'light_got': lighting, 'light_exp': exp_light,
                'got_labels': got_labels, 'missed': missed, 'spurious': spurious,
                'score': score, 'elapsed': round(time.time() - t0, 1),
                'notes': (raw.get('overall_notes') or '')[:80],
                'attempts': attempt + 1,
            }
        except Exception as e:
            last_err = f"{type(e).__name__}: {str(e)[:120]}"
            if attempt < MAX_RETRY:
                time.sleep(5 * (attempt + 1))
    return {'file': fname, 'error': last_err, 'elapsed': round(time.time() - t0, 1)}

def main():
    env = load_env()
    api_url = env.get('EXPO_PUBLIC_AI_API_URL', '')
    api_key = env.get('EXPO_PUBLIC_AI_API_KEY', '')
    if not api_url or not api_key:
        print('ERROR: .env 缺少 API 配置'); sys.exit(1)
    print(f"API: {api_url}")
    print(f"Key prefix: {api_key[:8]}...")
    print(f"并发 {CONCURRENCY} · 超时 {TIMEOUT}s · 重试 {MAX_RETRY} 次")
    print(f"prompt 来源: services/ai.ts BUILD_ANALYSIS_PROMPT ({len(BUILD_ANALYSIS_PROMPT)} 字符)\n")

    files = sorted(GT.keys())
    rows = []
    with ThreadPoolExecutor(max_workers=CONCURRENCY) as ex:
        futures = {ex.submit(evaluate_one, api_url, api_key, f): f for f in files}
        done = 0
        for fut in as_completed(futures):
            r = fut.result()
            rows.append(r)
            done += 1
            fname = r['file']
            if 'error' in r:
                print(f"[{done}/{len(files)}] ✗ {fname} ERROR: {r['error'][:90]}")
            else:
                status = '✓' if (r['scene_ok'] and not r['missed']) else '✗'
                print(f"[{done}/{len(files)}] {status} {fname} scene={'✓' if r['scene_ok'] else '✗'} "
                      f"light={'✓' if r['light_ok'] else '✗'} got={r['got_labels']} "
                      f"missed={r['missed'] or '-'} score={r['score']} ({r['elapsed']}s, {r['attempts']}次)")

    rows.sort(key=lambda r: r['file'])
    ok_rows = [r for r in rows if 'error' not in r]
    n = len(ok_rows)
    scene_acc = sum(1 for r in ok_rows if r['scene_ok']) / n * 100 if n else 0
    light_acc = sum(1 for r in ok_rows if r['light_ok']) / n * 100 if n else 0
    total_exp = sum(len(GT[r['file']][2]) for r in ok_rows)
    total_hit = sum(len(GT[r['file']][2]) - len(r['missed']) for r in ok_rows)
    recall = total_hit / total_exp * 100 if total_exp else 100
    avg_score = sum(r['score'] for r in ok_rows) / n if n else 0
    total_time = sum(r['elapsed'] for r in ok_rows)

    print('\n' + '=' * 60)
    print('TidyZen S3 准确率基线报告 v2（S4 prompt 调优后）')
    print('=' * 60)
    print(f"有效样本: {n}/{len(files)}")
    print(f"场景识别率: {scene_acc:.1f}%")
    print(f"光线识别率: {light_acc:.1f}%")
    print(f"杂物检出召回率: {recall:.1f}% ({total_hit}/{total_exp} 标签)")
    print(f"平均评分: {avg_score:.1f} / 100")
    print(f"平均单张耗时: {total_time/n:.0f}s (并发 {CONCURRENCY} 路)")

    report = {
        'samples': n, 'scene_acc': round(scene_acc, 1), 'light_acc': round(light_acc, 1),
        'recall': round(recall, 1), 'total_exp_labels': total_exp, 'total_hit_labels': total_hit,
        'avg_score': round(avg_score, 1), 'rows': rows,
        'prompt_version': 'BUILD_ANALYSIS_PROMPT @ services/ai.ts (S4 调优后, 2026-08-08)',
    }
    with open(os.path.join(REPORT_DIR, 'accuracy-report-v2.json'), 'w') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f'\n报告已存: {REPORT_DIR}/accuracy-report-v2.json')

if __name__ == '__main__':
    main()
