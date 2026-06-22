#!/usr/bin/env python3
"""
build_single_file.py
把 v2/ 多文件项目（index.html + css/*.css + js/*.js）合并成单一HTML文件。

用法：python3 build_single_file.py
输出：single_file/oasis_game.html

设计目的：以后每组新增节点内容，依然在 v2/ 的多文件结构里开发
（多文件结构对我来说更容易维护、不容易出错），开发完成后跑这个脚本，
自动生成一份单文件版本交付给用户测试 —— 不需要手动复制粘贴，
不会因为手动操作漏掉某次更新或拼错顺序。
"""

import re
import os

BASE = os.path.dirname(os.path.abspath(__file__))
INDEX_PATH = os.path.join(BASE, 'index.html')
OUTPUT_DIR = os.path.join(BASE, '..', 'single_file')
OUTPUT_PATH = os.path.join(OUTPUT_DIR, 'oasis_game.html')

os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(INDEX_PATH, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. 替换所有 <link rel="stylesheet" href="css/xxx.css"> 为内联 <style>
def replace_css_link(match):
    href = match.group(1)
    css_path = os.path.join(BASE, href)
    with open(css_path, 'r', encoding='utf-8') as cf:
        css_content = cf.read()
    return f'<style>\n{css_content}\n</style>'

html = re.sub(
    r'<link rel="stylesheet" href="(css/[^"]+)">',
    replace_css_link,
    html
)

# 2. 替换所有 <script src="js/xxx.js"></script> 为内联 <script>，严格保持原有顺序
def replace_script_src(match):
    src = match.group(1)
    js_path = os.path.join(BASE, src)
    with open(js_path, 'r', encoding='utf-8') as jf:
        js_content = jf.read()
    return f'<script>\n{js_content}\n</script>'

html = re.sub(
    r'<script src="(js/[^"]+\.js)"></script>',
    replace_script_src,
    html
)

with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print(f'✅ 已生成单文件版本: {OUTPUT_PATH}')
print(f'   文件大小: {os.path.getsize(OUTPUT_PATH)} 字节')
