# -*- coding: utf-8 -*-
"""
build_fonts.py — 生成 assets/css/fonts.css

1. 拉丁展示字（Archivo Black）与等宽字（JetBrains Mono 400/500）：整份子集内联
2. 中文展示字：从生成后的页面里提取标题用字，向 Google Fonts 请求按字子集，
   分批（URL 长度限制）下载后内联，并保留返回的 unicode-range

用法（先 build.py 生成页面，再执行本脚本）：
    python _build/build.py
    python _build/build_fonts.py
"""

import base64
import glob
import os
import re
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "assets", "fonts")
CSS_OUT = os.path.join(ROOT, "assets", "css", "fonts.css")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"

# 只收大字号标题的用字，正文走系统字体
TITLE_SELECTORS = re.compile(
    r'class="[^"]*(hero__title|head__title|page-hero__title|editorial__title|cta__title|'
    r'part__title|program__title|pd-title|news-lead__title|about-quote|quote-block)[^"]*"[^>]*>(.*?)</(?:h1|h2|h3|p|blockquote)>',
    re.S,
)


def b64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()


def fetch(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read()
    return data if binary else data.decode("utf-8")


def collect_chars():
    chars = set()
    for path in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True):
        if "_build" in path:
            continue
        html = open(path, encoding="utf-8").read()
        for m in TITLE_SELECTORS.finditer(html):
            text = re.sub(r"<[^>]+>", "", m.group(2))
            chars.update(re.findall(r"[\u3400-\u9fff]", text))
    return "".join(sorted(chars))


def cjk_faces(chars):
    """分批请求中文子集，返回 @font-face 代码块列表"""
    faces = []
    chunk = 110
    for i in range(0, len(chars), chunk):
        part = chars[i:i + chunk]
        url = ("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@900&text="
               + urllib.parse.quote(part))
        css = fetch(url)
        src = re.search(r"url\((https[^)]+)\)", css)
        rng = re.search(r"unicode-range:\s*([^;]+);", css)
        if not src:
            continue
        data = b64_data = base64.b64encode(fetch(src.group(1), True)).decode()
        faces.append(
            '@font-face {\n'
            '  font-family: "DZ Serif SC";\n'
            '  src: url(data:font/woff2;base64,%s) format("woff2");\n'
            '  font-weight: 900;\n'
            '  font-style: normal;\n'
            '  font-display: swap;\n'
            '  unicode-range: %s;\n'
            '}\n' % (b64_data, rng.group(1).strip() if rng else "U+4E00-9FFF")
        )
    return faces


def main():
    latin = f"""@font-face {{
  font-family: "Archivo Black";
  src: url(data:font/woff2;base64,{b64(os.path.join(FONTS, 'archivo-black.woff2'))}) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+2000-206F, U+2190-21BB, U+2212-2215;
}}

@font-face {{
  font-family: "JetBrains Mono";
  src: url(data:font/woff2;base64,{b64(os.path.join(FONTS, 'jbmono-400.woff2'))}) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+2000-206F, U+2190-21BB, U+2212-2215;
}}

@font-face {{
  font-family: "JetBrains Mono";
  src: url(data:font/woff2;base64,{b64(os.path.join(FONTS, 'jbmono-500.woff2'))}) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+2000-206F, U+2190-21BB, U+2212-2215;
}}
"""

    chars = collect_chars()
    faces = cjk_faces(chars) if chars else []
    print("中文展示字:", len(chars), "字 /", len(faces), "个子集")

    header = """/* ==========================================================================
   fonts.css — 自托管字体内联
   说明：为支持双击打开的离线浏览，字体以 base64 内联，避免 file:// 的 CORS 限制。
        - Archivo Black：拉丁展示字（OFL）
        - JetBrains Mono 400/500：数据与编号（OFL）
        - DZ Serif SC：Noto Serif SC 900 按标题用字生成的子集（OFL）
   ========================================================================== */

"""
    with open(CSS_OUT, "w", encoding="utf-8") as f:
        f.write(header + latin + "\n" + "\n".join(faces))
    print("fonts.css", round(os.path.getsize(CSS_OUT) / 1024), "KB")


if __name__ == "__main__":
    main()
