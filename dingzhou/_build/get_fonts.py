# -*- coding: utf-8 -*-
"""拉取拉丁字体子集 + 生成 fonts.css（base64 内联）。
中文展示字（Noto Serif SC）在正文完成后用 build_fonts.py 按实际用字生成。
"""
import base64
import os
import re
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "assets", "fonts")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"


def fetch(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    return data if binary else data.decode("utf-8")


def latin_urls(family_css):
    urls = {}
    for block in re.findall(r"@font-face\s*\{[^}]*\}", family_css, re.S):
        if "U+0000-00FF" not in block:
            continue
        weight = re.search(r"font-weight:\s*(\d+)", block).group(1)
        url = re.search(r"url\((https[^)]+)\)", block).group(1)
        urls[weight] = url
    return urls


def main():
    os.makedirs(FONTS, exist_ok=True)

    jb_css = fetch("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap")
    for weight, url in latin_urls(jb_css).items():
        path = os.path.join(FONTS, "jbmono-%s.woff2" % weight)
        with open(path, "wb") as f:
            f.write(fetch(url, True))

    ab_css = fetch("https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap")
    for weight, url in latin_urls(ab_css).items():
        with open(os.path.join(FONTS, "archivo-black.woff2"), "wb") as f:
            f.write(fetch(url, True))

    print("fonts:", os.listdir(FONTS))


if __name__ == "__main__":
    main()
