# -*- coding: utf-8 -*-
"""
build.py — 鼎轴底盘 静态站装配脚本

正文放在 _build/pages/*.html（只写 <main> 内部），本脚本注入 head / 页头 /
移动抽屉 / 页脚 / 悬浮联系，并把正文里的 "/xxx" 站内绝对路径改写为相对路径。

用法：python _build/build.py
"""

import os
import random
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES_DIR = os.path.join(ROOT, "_build", "pages")

SITE = "鼎轴底盘"
TEL = "400-118-0806"

PAGES = [
    dict(src="index.html", out="index.html", nav="home",
         title="鼎轴底盘｜控制臂 · 转向节 · 副车架 制造企业",
         desc="鼎轴底盘科技（苏州）有限公司，2006 年成立，IATF 16949 体系，年产 1200 万件底盘件。控制臂、球头、稳定杆连杆、副车架、转向节、衬套六大产品线，配套 28 家主机厂。"),
    dict(src="products.html", out="products/index.html", nav="products",
         title="产品谱系｜控制臂 · 球头 · 副车架｜鼎轴底盘",
         desc="六大底盘件产品线：锻铝/锻钢控制臂、球头总成、稳定杆连杆、副车架、转向节、衬套与液压衬套。含材料、公差、疲劳寿命与配套车型参数。"),
    dict(src="product-detail.html", out="products/control-arm.html", nav="products",
         title="CA-210 锻铝控制臂总成｜鼎轴底盘",
         desc="CA-210 前下控制臂总成：6082-T6 锻铝，整体重量 3.2 kg，关键孔位公差 ±0.05 mm，200 万次台架疲劳验证，盐雾 720 小时。"),
    dict(src="capability.html", out="capability/index.html", nav="capability",
         title="工艺与检测｜锻造 · 机加 · 疲劳试验｜鼎轴底盘",
         desc="六条热模锻线、五轴机加、机器人焊接、阴极电泳，配材料实验室、200 万次疲劳台架、三坐标与盐雾箱。了解鼎轴的制造与验证能力。"),
    dict(src="cases.html", out="case/index.html", nav="case",
         title="配套项目｜主机厂同步开发案例｜鼎轴底盘",
         desc="长风汽车、瑞驰新能源、恒隆重卡等六个配套项目实录：年供货量、减重比例、疲劳验证与量产节点。"),
    dict(src="about.html", out="about/index.html", nav="about",
         title="关于鼎轴｜苏州 · 柳州双基地｜鼎轴底盘",
         desc="2006 年成立于苏州，两个制造基地、1200 万件年产能、IATF 16949 与 VDA 6.3 体系。了解鼎轴的产线、实验室与质量记录。"),
    dict(src="news.html", out="news/index.html", nav="news",
         title="新闻与工程笔记｜鼎轴底盘",
         desc="鼎轴的产线动态、项目定点与技术笔记：铝合金控制臂的轻量化边界、盐雾试验后的涂层失效分析、锻造模具寿命管理。"),
    dict(src="news-detail.html", out="news/aluminum-control-arm.html", nav="news",
         title="铝合金控制臂的轻量化边界：从 18% 到 26%｜鼎轴底盘",
         desc="一次前下控制臂从锻钢改锻铝的完整记录：减重 26% 的代价、刚度补偿方案、疲劳验证与成本变化。"),
    dict(src="contact.html", out="contact/index.html", nav="contact",
         title="联系我们｜索取报价与 PPAP 资料｜鼎轴底盘",
         desc="鼎轴底盘联系方式：苏州制造基地、柳州基地、华南与华北服务处；提交零件号或图纸，1 个工作日内回复报价与开发周期。"),
]

NAV = [
    ("home", "/index.html", "首页", False),
    ("products", "/products/index.html", "产品谱系", True),
    ("capability", "/capability/index.html", "工艺与检测", False),
    ("case", "/case/index.html", "配套项目", False),
    ("about", "/about/index.html", "关于鼎轴", False),
    ("news", "/news/index.html", "新闻", False),
    ("contact", "/contact/index.html", "联系", False),
]

LOGO_MARK = """<svg class="logo__mark" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.1" aria-hidden="true" focusable="false">
          <circle cx="12.5" cy="27.5" r="7.6"/>
          <circle cx="31" cy="10.5" r="4.8"/>
          <path d="M17.6 22.2 26.8 15"/>
          <circle cx="12.5" cy="27.5" r="2.1" fill="currentColor" stroke="none"/>
        </svg>"""

PARTS = [
    ("01", "控制臂总成", "CA", "/products/control-arm.html"),
    ("02", "球头总成", "BJ", "/products/control-arm.html"),
    ("03", "稳定杆连杆", "SL", "/products/control-arm.html"),
    ("04", "副车架总成", "SF", "/products/control-arm.html"),
    ("05", "转向节", "KN", "/products/control-arm.html"),
    ("06", "衬套 / 液压衬套", "BU", "/products/control-arm.html"),
]

CAPS = [
    ("热模锻", "/capability/index.html"),
    ("五轴机加", "/capability/index.html"),
    ("机器人焊接", "/capability/index.html"),
    ("疲劳与材料实验室", "/capability/index.html"),
    ("PPAP / APQP 资料", "/contact/index.html#inquiry"),
]


def head(page, root):
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{page['title']}</title>
<meta name="description" content="{page['desc']}">
<meta name="theme-color" content="#e8e3d9">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{SITE}">
<meta property="og:title" content="{page['title']}">
<meta property="og:description" content="{page['desc']}">
<link rel="icon" href="{root}assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{root}assets/css/fonts.css">
<link rel="stylesheet" href="{root}assets/css/tokens.css">
<link rel="stylesheet" href="{root}assets/css/base.css">
<link rel="stylesheet" href="{root}assets/css/components.css">
<link rel="stylesheet" href="{root}assets/css/pages.css">
</head>
<body>
"""


def header(page, root):
    items = []
    for key, href, label, has_mega in NAV:
        active = " is-active" if key == page["nav"] else ""
        aria = ' aria-current="page"' if key == page["nav"] else ""
        if has_mega:
            items.append(
                f"""        <li class="nav__item{active}">
          <button class="nav__link" type="button" data-mega aria-expanded="false" aria-controls="mega-parts">{label}<i class="caret" aria-hidden="true"></i></button>
        </li>"""
            )
        else:
            items.append(
                f"""        <li class="nav__item{active}">
          <a class="nav__link" href="{root}{href.lstrip('/')}"{aria}>{label}</a>
        </li>"""
            )

    parts = "\n".join(
        f'            <li><a href="{root}{href.lstrip("/")}"><i>{no}</i>{name}</a></li>'
        for no, name, _code, href in PARTS
    )
    caps = "\n".join(
        f'            <li><a href="{root}{href.lstrip("/")}">{name}</a></li>'
        for name, href in CAPS
    )

    return f"""<a class="skip-link" href="#main">跳到主要内容</a>

<div class="topbar">
  <div class="topbar__inner">
    <div class="topbar__group">
      <span class="topbar__mark" aria-hidden="true"></span>
      <span class="topbar__site">苏州 · 柳州 两基地制造</span>
      <span class="topbar__sep" aria-hidden="true"></span>
      <span class="topbar__cert">IATF 16949 : 2016</span>
    </div>
    <div class="topbar__group">
      <span class="topbar__hours">工作日 8:00–17:30</span>
      <span class="topbar__sep" aria-hidden="true"></span>
      <a class="topbar__tel" href="tel:{TEL.replace('-', '')}">{TEL}</a>
      <span class="topbar__sep" aria-hidden="true"></span>
      <a class="topbar__cta" href="{root}contact/index.html#inquiry">询价 <span>→</span></a>
    </div>
  </div>
</div>

<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="logo" href="{root}index.html" aria-label="{SITE} 首页">
      {LOGO_MARK}
      <span class="logo__text"><b>鼎轴底盘</b><i>DINGZHOU CHASSIS</i></span>
    </a>

    <nav class="nav" aria-label="主导航">
      <ul class="nav__list">
{chr(10).join(items)}
      </ul>
    </nav>

    <div class="header-actions">
      <a class="btn btn--accent btn--sm" href="{root}contact/index.html#inquiry">获取报价</a>
      <button class="nav-toggle" type="button" data-drawer-open aria-expanded="false" aria-controls="drawer" aria-label="打开菜单">
        <span aria-hidden="true"></span>
      </button>
    </div>
  </div>

  <div class="mega" id="mega-parts">
    <div class="wrap mega__inner">
      <div>
        <p class="mega__title">产品谱系 / 六大品类</p>
        <ul class="mega__parts">
{parts}
        </ul>
      </div>
      <div>
        <p class="mega__title">工艺与服务</p>
        <ul class="mega__links">
{caps}
        </ul>
      </div>
      <div class="mega__promo">
        <span class="label">New / CA-210</span>
        <p>6082-T6 锻铝控制臂，单件 3.2 kg，孔位公差 ±0.05 mm。</p>
        <a href="{root}products/control-arm.html">查看零件参数 →</a>
      </div>
    </div>
  </div>
</header>

<div class="drawer" id="drawer" aria-hidden="true">
  <div class="drawer__scrim" aria-hidden="true"></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="站点导航">
    <div class="drawer__head">
      <a class="logo" href="{root}index.html">
        {LOGO_MARK}
        <span class="logo__text"><b>鼎轴底盘</b><i>DINGZHOU</i></span>
      </a>
      <button class="drawer__close" type="button" data-drawer-close aria-label="关闭菜单">×</button>
    </div>

    <div class="drawer__group"><a class="drawer__link" href="{root}index.html">首页</a></div>
    <div class="drawer__group">
      <button class="drawer__toggle" type="button" aria-expanded="false">产品谱系<i class="caret" aria-hidden="true"></i></button>
      <div class="drawer__sub"><div>
        <a href="{root}products/index.html"><i>00</i>全部产品</a>
        <a href="{root}products/control-arm.html"><i>01</i>控制臂总成</a>
        <a href="{root}products/control-arm.html"><i>02</i>球头总成</a>
        <a href="{root}products/control-arm.html"><i>03</i>稳定杆连杆</a>
        <a href="{root}products/control-arm.html"><i>04</i>副车架总成</a>
        <a href="{root}products/control-arm.html"><i>05</i>转向节</a>
        <a href="{root}products/control-arm.html"><i>06</i>衬套 / 液压衬套</a>
      </div></div>
    </div>
    <div class="drawer__group"><a class="drawer__link" href="{root}capability/index.html">工艺与检测</a></div>
    <div class="drawer__group"><a class="drawer__link" href="{root}case/index.html">配套项目</a></div>
    <div class="drawer__group"><a class="drawer__link" href="{root}about/index.html">关于鼎轴</a></div>
    <div class="drawer__group"><a class="drawer__link" href="{root}news/index.html">新闻</a></div>
    <div class="drawer__group"><a class="drawer__link" href="{root}contact/index.html">联系</a></div>

    <div class="drawer__foot">
      <span>询价 / 技术对接</span>
      <strong>{TEL}</strong>
      <span>sales@dingzhou-chassis.cn</span>
      <span>苏州市相城区春申湖西路 66 号</span>
    </div>

    <div style="margin-top:20px">
      <a class="btn btn--accent btn--block" href="{root}contact/index.html#inquiry">提交图纸，获取报价</a>
    </div>
  </div>
</div>
"""


def footer(root):
    return f"""<footer class="footer">
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__brand">
        <a class="logo" href="{root}index.html" aria-label="{SITE} 首页">
          {LOGO_MARK}
          <span class="logo__text"><b>鼎轴底盘</b><i>DINGZHOU CHASSIS</i></span>
        </a>
        <p>鼎轴底盘科技（苏州）有限公司<br>控制臂 · 球头 · 副车架 · 转向节</p>
      </div>

      <div>
        <p class="footer__title">产品</p>
        <div class="footer__links">
          <a href="{root}products/control-arm.html">控制臂总成</a>
          <a href="{root}products/control-arm.html">球头总成</a>
          <a href="{root}products/control-arm.html">稳定杆连杆</a>
          <a href="{root}products/index.html">全部产品</a>
        </div>
      </div>

      <div>
        <p class="footer__title">能力</p>
        <div class="footer__links">
          <a href="{root}capability/index.html">工艺与产线</a>
          <a href="{root}capability/index.html">检测与试验</a>
          <a href="{root}capability/index.html">质量体系</a>
          <a href="{root}case/index.html">配套项目</a>
        </div>
      </div>

      <div>
        <p class="footer__title">公司</p>
        <div class="footer__links">
          <a href="{root}about/index.html">关于鼎轴</a>
          <a href="{root}about/index.html">两基地</a>
          <a href="{root}news/index.html">新闻与笔记</a>
          <a href="{root}contact/index.html">联系我们</a>
        </div>
      </div>

      <div>
        <p class="footer__title">联系</p>
        <div class="footer__contact">
          <strong>{TEL}</strong>
          <a href="mailto:sales@dingzhou-chassis.cn">sales@dingzhou-chassis.cn</a>
          <span>苏州市相城区春申湖西路 66 号</span>
          <span>周一至周六 8:00–17:30</span>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <span>© 2026 鼎轴底盘科技（苏州）有限公司　苏ICP备00000000号-1（模板占位）</span>
      <div class="footer__legal">
        <a href="{root}capability/index.html">质量声明</a>
        <a href="{root}contact/index.html">隐私条款</a>
        <a href="{root}sitemap.xml">网站地图</a>
        <button class="footer__top-link" type="button" data-top>回到顶部 ↑</button>
      </div>
    </div>
  </div>
  <div class="footer__word" aria-hidden="true">DINGZHOU</div>
</footer>

<div class="rail" aria-label="快捷联系">
  <a class="rail__btn" href="tel:{TEL.replace('-', '')}" aria-label="拨打询价电话">
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 3h3l1.6 4-2 1.4a11 11 0 0 0 5 5l1.4-2 4 1.6v3a2 2 0 0 1-2 2A15 15 0 0 1 2 5a2 2 0 0 1 2-2Z"/></svg>
  </a>
  <button class="rail__btn" type="button" aria-label="微信二维码">
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M8 3a6 6 0 0 0-2.4 11.5L5 18l3.2-1.4A6 6 0 1 0 8 3Z"/><path d="M12 8.5a4.5 4.5 0 1 1 3.6 6.9L18 17l-2.3-.9"/></svg>
    <span class="rail__qr"><img src="{root}assets/img/qr.svg" width="108" height="108" alt="微信二维码（示意）"><span>扫码加销售工程师</span></span>
  </button>
  <button class="rail__btn" type="button" data-top aria-label="回到顶部">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>
  </button>
</div>

<script src="{root}assets/js/main.js"></script>
</body>
</html>
"""


def read_page(path):
    with open(path, encoding="utf-8") as f:
        raw = f.read()
    meta = {}
    m = re.match(r"\s*<!--@(.*?)-->\s*", raw, re.S)
    if m:
        for line in m.group(1).strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        raw = raw[m.end():]
    return meta, raw


def rewrite(body, root):
    return re.sub(r'(href|src)="/([^"]*)"', lambda m: f'{m.group(1)}="{root}{m.group(2)}"', body)


def build_qr():
    """占位二维码：确定性图案，不可扫"""
    random.seed(20261023)
    n = 25
    rects, finders = [], []
    for x, y in [(0, 0), (n - 7, 0), (0, n - 7)]:
        finders.append(f'<rect x="{x + 0.5}" y="{y + 0.5}" width="6" height="6" fill="none" stroke="#1b1b1e"/>')
        finders.append(f'<rect x="{x + 2}" y="{y + 2}" width="3" height="3"/>')
    for y in range(n):
        for x in range(n):
            if (x < 8 and y < 8) or (x > n - 9 and y < 8) or (x < 8 and y > n - 9):
                continue
            if random.random() < 0.46:
                rects.append(f'<rect x="{x}" y="{y}" width="1" height="1"/>')

    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 27 27" width="108" height="108" '
        'shape-rendering="crispEdges" role="img" aria-label="二维码占位图">'
        '<rect x="-1" y="-1" width="27" height="27" fill="#f3efe6"/>'
        '<g fill="#1b1b1e">' + "".join(rects + finders) + "</g></svg>"
    )
    with open(os.path.join(ROOT, "assets", "img", "qr.svg"), "w", encoding="utf-8") as f:
        f.write(svg)


def build_favicon():
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">'
        '<rect width="40" height="40" fill="#17171a"/>'
        '<g fill="none" stroke="#ff6a33" stroke-width="2.4">'
        '<circle cx="12.5" cy="27.5" r="7.4"/><circle cx="31" cy="10.5" r="4.6"/>'
        '<path d="M17.6 22.2 26.8 15"/></g>'
        '<circle cx="12.5" cy="27.5" r="2.2" fill="#ff6a33"/></svg>'
    )
    with open(os.path.join(ROOT, "assets", "img", "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg)


def build_sitemap():
    urls = "\n".join(f"  <url><loc>https://www.dingzhou-chassis.cn/{p['out']}</loc></url>" for p in PAGES)
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "\n</urlset>\n")
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(xml)


def main():
    build_qr()
    build_favicon()
    build_sitemap()

    for page in PAGES:
        meta, body = read_page(os.path.join(PAGES_DIR, page["src"]))
        page = dict(page)
        page.update({k: v for k, v in meta.items() if k in ("title", "desc", "nav")})

        out_path = os.path.join(ROOT, page["out"])
        root = "../" * page["out"].count("/")

        html = head(page, root) + header(page, root) + rewrite(body, root) + footer(root)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        print("built", page["out"])


if __name__ == "__main__":
    main()
