# -*- coding: utf-8 -*-
"""
build.py — 静态站点装配脚本

用法：
    python _build/build.py

说明：
    页面正文放在 _build/pages/*.html，只写 <main> 内部内容；
    本脚本负责注入 <head>、页头（含巨型菜单）、移动抽屉、页脚与悬浮条，
    并把正文中所有 "/xxx" 形式的站内绝对路径改写为相对当前层级的路径。
    生成结果是可直接双击打开的纯静态 HTML，无任何运行时依赖。
"""

import os
import random
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES_DIR = os.path.join(ROOT, "_build", "pages")

SITE_NAME = "冷杉制冷"
TEL = "400-826-1180"

# ----------------------------------------------------------------------------
# 页面清单
# ----------------------------------------------------------------------------
PAGES = [
    dict(src="index.html", out="index.html", nav="home",
         title="冷杉制冷｜工业制冷设备制造与整库交付",
         desc="冷杉制冷科技（江苏）有限公司 2009 年成立于常州，制造螺杆冷水机组、CO₂ 跨临界机组、蒸发式冷凝机组与冷库一体机，提供 −60℃ 至 +25℃ 的工业制冷整包交付。"),
    dict(src="products.html", out="products/index.html", nav="products",
         title="产品中心｜螺杆冷水机组 · CO₂ 机组 · 冷库一体机｜冷杉制冷",
         desc="冷杉制冷六大产品线：水冷螺杆冷水机组、CO₂ 跨临界机组、蒸发式冷凝机组、冷库一体机、风冷模块机组、工业余热热泵。含选型参数与交付清单。"),
    dict(src="product-detail.html", out="products/lc-s.html", nav="products",
         title="LC-S 水冷螺杆冷水机组｜冷杉制冷",
         desc="LC-S 系列水冷螺杆冷水机组，制冷量 120–2400 kW，出水温度 +12℃ 至 −35℃，支持 R134a / R513A 冷媒，适用于冷链、食品、医药与工艺冷却。"),
    dict(src="solutions.html", out="solutions/index.html", nav="solutions",
         title="行业方案｜冷链 · 食品 · 医药 · 数据中心 · 化工｜冷杉制冷",
         desc="按行业工况配置制冷系统：冷链物流园区、食品加工与速冻、医药与生物制品、数据中心与工艺冷却、化工与新能源，含温区、负荷与冗余策略。"),
    dict(src="cases.html", out="case/index.html", nav="cases",
         title="工程案例｜冷杉制冷",
         desc="冷链物流园、乳品速冻隧道、GSP 疫苗冷库、数据中心间接蒸发冷却与精酿工艺冷却项目实录，附温区、装机容量与实测能耗。"),
    dict(src="about.html", out="about/index.html", nav="about",
         title="关于冷杉｜工业制冷设备制造企业｜冷杉制冷",
         desc="2009 年成立于常州，38,000 ㎡ 制造基地，压力容器 A2 制造资质，126 项专利与软著，产品出口 32 个国家。了解冷杉的产线、检验与质量体系。"),
    dict(src="news.html", out="news/index.html", nav="news",
         title="新闻资讯｜冷杉制冷",
         desc="冷杉制冷的项目进展、产线动态与技术文章：CO₂ 跨临界系统调试、冷媒替代路线、冷凝压力控制与维保清单。"),
    dict(src="news-detail.html", out="news/co2-commissioning.html", nav="news",
         title="CO₂ 跨临界机组在冷链园区的 72 小时调试记录｜冷杉制冷",
         desc="一次 CO₂ 跨临界制冷系统的完整调试记录：气密试验、抽真空、充注、高压控制与部分负荷测试，附实测数据与踩坑清单。"),
    dict(src="contact.html", out="contact/index.html", nav="contact",
         title="联系我们｜获取选型方案｜冷杉制冷",
         desc="冷杉制冷联系方式、常州制造基地地址、各区域服务中心与询价表单。提交工况参数，1 个工作日内获得选型方案与预算区间。"),
]

NAV_ITEMS = [
    ("home", "/index.html", "首页", False),
    ("products", "/products/index.html", "产品中心", True),
    ("solutions", "/solutions/index.html", "行业方案", False),
    ("cases", "/case/index.html", "工程案例", False),
    ("about", "/about/index.html", "关于冷杉", False),
    ("news", "/news/index.html", "新闻资讯", False),
    ("contact", "/contact/index.html", "联系我们", False),
]

LOGO_MARK = """<svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
          <path d="M20 3.5 32.5 19.5h-6.7l9.7 13.3H4.5l9.7-13.3H7.5Z" fill="currentColor"/>
          <rect x="18.6" y="31.4" width="2.8" height="6" fill="currentColor"/>
        </svg>"""

PRODUCTS_MEGA_1 = [
    ("水冷螺杆冷水机组", "LC-S", "120–2400 kW"),
    ("CO₂ 跨临界机组", "LC-C", "80–900 kW"),
    ("风冷模块机组", "LC-M", "30–160 kW"),
]
PRODUCTS_MEGA_2 = [
    ("蒸发式冷凝机组", "LC-E", "150–1800 kW"),
    ("冷库一体机", "LC-U", "8–120 kW"),
    ("工业余热热泵", "LC-H", "100–2000 kW"),
]
SERVICES = [
    ("负荷计算与选型", "/contact/index.html#inquiry"),
    ("安装调试与培训", "/solutions/index.html"),
    ("维保与备件供应", "/contact/index.html"),
    ("群控与节能改造", "/case/index.html"),
]


def head(page, root):
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{page['title']}</title>
<meta name="description" content="{page['desc']}">
<meta name="theme-color" content="#0c1114">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{SITE_NAME}">
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
    nav_html = []
    for key, href, label, has_mega in NAV_ITEMS:
        active = " is-active" if key == page["nav"] else ""
        if key == page["nav"]:
            aria = ' aria-current="page"'
        else:
            aria = ""
        if has_mega:
            nav_html.append(
                f"""        <li class="nav__item{active}">
          <button class="nav__link" type="button" data-mega aria-expanded="false" aria-controls="mega-products">{label}<i class="caret" aria-hidden="true"></i></button>
        </li>"""
            )
        else:
            nav_html.append(
                f"""        <li class="nav__item{active}">
          <a class="nav__link" href="{root}{href.lstrip('/')}"{aria}>{label}</a>
        </li>"""
            )

    def mega_links(items):
        out = []
        for name, code, spec in items:
            out.append(
                f'            <li><a href="{root}products/lc-s.html"><span>{name}</span><small>{code} · {spec}</small></a></li>'
            )
        return "\n".join(out)

    services = "\n".join(
        f'            <li><a href="{root}{href.lstrip("/")}"><span>{name}</span></a></li>'
        for name, href in SERVICES
    )

    return f"""<a class="skip-link" href="#main">跳到主要内容</a>

<div class="topbar">
  <div class="wrap topbar__inner">
    <div class="topbar__group">
      <span class="topbar__dot" aria-hidden="true"></span>
      <span>制造基地 · 江苏常州</span>
      <span class="topbar__sep" aria-hidden="true"></span>
      <span>工作日 8:30–18:00</span>
    </div>
    <div class="topbar__group">
      <a class="topbar__tel" href="tel:4008261180">{TEL}</a>
      <span class="topbar__sep" aria-hidden="true"></span>
      <span class="topbar__readout"><i>车间</i><b>−25.0℃</b></span>
      <span class="topbar__readout"><i>室外</i><b>18.4℃</b></span>
    </div>
  </div>
</div>

<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="logo" href="{root}index.html" aria-label="{SITE_NAME} 首页">
      {LOGO_MARK}
      <span class="logo__text"><b>冷杉制冷</b><i>CEDAR COOL</i></span>
    </a>

    <nav class="nav" aria-label="主导航">
      <ul class="nav__list">
{chr(10).join(nav_html)}
      </ul>
    </nav>

    <div class="header-actions">
      <a class="btn btn--solid btn--sm" href="{root}contact/index.html#inquiry">获取选型方案</a>
      <button class="nav-toggle" type="button" data-drawer-open aria-expanded="false" aria-controls="drawer" aria-label="打开菜单">
        <span aria-hidden="true"></span>
      </button>
    </div>
  </div>

  <div class="mega" id="mega-products">
    <div class="wrap mega__inner">
      <div class="mega__col">
        <p class="mega__title">制冷机组</p>
        <ul class="mega__list">
{mega_links(PRODUCTS_MEGA_1)}
        </ul>
      </div>
      <div class="mega__col">
        <p class="mega__title">冷冻与冷库</p>
        <ul class="mega__list">
{mega_links(PRODUCTS_MEGA_2)}
        </ul>
      </div>
      <div class="mega__col">
        <p class="mega__title">工程服务</p>
        <ul class="mega__list">
{services}
        </ul>
      </div>
      <div class="mega__col">
        <div class="mega__promo">
          <span class="mono">NEW / LC-C 480</span>
          <p>CO₂ 跨临界机组，−50℃ 工况下实测 COP 1.62，GWP = 1。</p>
          <a href="{root}products/lc-s.html">查看机型参数 →</a>
        </div>
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
        <span class="logo__text"><b>冷杉制冷</b><i>CEDAR COOL</i></span>
      </a>
      <button class="drawer__close" type="button" data-drawer-close aria-label="关闭菜单">×</button>
    </div>

    <div class="drawer__group"><a class="drawer__link" href="{root}index.html">首页</a></div>
    <div class="drawer__group">
      <button class="drawer__toggle" type="button" aria-expanded="false">产品中心<i class="caret" aria-hidden="true"></i></button>
      <div class="drawer__sub"><div>
        <a href="{root}products/index.html">全部产品</a>
        <a href="{root}products/lc-s.html">水冷螺杆冷水机组 LC-S</a>
        <a href="{root}products/lc-s.html">CO₂ 跨临界机组 LC-C</a>
        <a href="{root}products/lc-s.html">蒸发式冷凝机组 LC-E</a>
        <a href="{root}products/lc-s.html">冷库一体机 LC-U</a>
      </div></div>
    </div>
    <div class="drawer__group"><a class="drawer__link" href="{root}solutions/index.html">行业方案</a></div>
    <div class="drawer__group"><a class="drawer__link" href="{root}case/index.html">工程案例</a></div>
    <div class="drawer__group"><a class="drawer__link" href="{root}about/index.html">关于冷杉</a></div>
    <div class="drawer__group"><a class="drawer__link" href="{root}news/index.html">新闻资讯</a></div>
    <div class="drawer__group"><a class="drawer__link" href="{root}contact/index.html">联系我们</a></div>

    <div class="drawer__foot">
      <span>选型与技术咨询</span>
      <strong>{TEL}</strong>
      <span>sales@cedarcool.cn</span>
      <span>江苏省常州市武进区科创路 18 号</span>
    </div>

    <div style="margin-top:18px">
      <a class="btn btn--solid btn--block" href="{root}contact/index.html#inquiry">提交工况，获取选型方案</a>
    </div>
  </div>
</div>
"""


def footer(root):
    return f"""<footer class="footer">
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__brand">
        <a class="logo" href="{root}index.html" aria-label="{SITE_NAME} 首页">
          {LOGO_MARK}
          <span class="logo__text"><b>冷杉制冷</b><i>CEDAR COOL</i></span>
        </a>
        <p>冷杉制冷科技（江苏）有限公司<br>工业制冷机组制造 · 冷库与工艺冷却整包交付</p>
        <div class="footer__qr">
          <img src="{root}assets/img/qr.svg" width="76" height="76" alt="微信二维码（示例）">
          <span>扫码添加<br>选型工程师</span>
        </div>
      </div>

      <div class="footer__col">
        <p class="footer__title">产品中心</p>
        <div class="footer__links">
          <a href="{root}products/lc-s.html">水冷螺杆冷水机组</a>
          <a href="{root}products/lc-s.html">CO₂ 跨临界机组</a>
          <a href="{root}products/lc-s.html">蒸发式冷凝机组</a>
          <a href="{root}products/lc-s.html">冷库一体机</a>
        </div>
      </div>

      <div class="footer__col">
        <p class="footer__title">行业方案</p>
        <div class="footer__links">
          <a href="{root}solutions/index.html">冷链物流园区</a>
          <a href="{root}solutions/index.html">食品加工与速冻</a>
          <a href="{root}solutions/index.html">医药与生物制品</a>
          <a href="{root}solutions/index.html">数据中心与工艺冷却</a>
        </div>
      </div>

      <div class="footer__col">
        <p class="footer__title">关于冷杉</p>
        <div class="footer__links">
          <a href="{root}about/index.html">公司简介</a>
          <a href="{root}about/index.html">制造与检验</a>
          <a href="{root}case/index.html">工程案例</a>
          <a href="{root}news/index.html">新闻资讯</a>
        </div>
      </div>

      <div class="footer__col">
        <p class="footer__title">联系我们</p>
        <div class="footer__contact">
          <strong>{TEL}</strong>
          <a href="mailto:sales@cedarcool.cn">sales@cedarcool.cn</a>
          <span>江苏省常州市武进区科创路 18 号</span>
          <span>周一至周六 8:30–18:00</span>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <span>© 2026 冷杉制冷科技（江苏）有限公司　苏ICP备00000000号-1（模板占位）</span>
      <div class="footer__legal">
        <a href="{root}about/index.html">企业资质</a>
        <a href="{root}contact/index.html">隐私条款</a>
        <a href="{root}sitemap.xml">网站地图</a>
        <button class="footer__top-link" type="button" data-top>回到顶部 ↑</button>
      </div>
    </div>
  </div>
  <div class="footer__mark" aria-hidden="true">CEDAR COOL</div>
</footer>

<div class="rail" aria-label="快捷联系">
  <a class="rail__btn" href="tel:4008261180" aria-label="拨打服务热线">
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 3h3l1.6 4-2 1.4a11 11 0 0 0 5 5l1.4-2 4 1.6v3a2 2 0 0 1-2 2A15 15 0 0 1 2 5a2 2 0 0 1 2-2Z"/></svg>
  </a>
  <button class="rail__btn" type="button" aria-label="微信二维码">
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M8 3a6 6 0 0 0-2.4 11.5L5 18l3.2-1.4A6 6 0 1 0 8 3Z"/><path d="M12 8.5a4.5 4.5 0 1 1 3.6 6.9L18 17l-2.3-.9"/></svg>
    <span class="rail__qr"><img src="{root}assets/img/qr.svg" width="104" height="104" alt="微信二维码（示例）"><span>扫码加选型工程师</span></span>
  </button>
  <button class="rail__btn" type="button" data-top aria-label="回到顶部">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>
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
    """把正文中的站内绝对路径 /xxx 改写为相对路径"""
    return re.sub(r'(href|src)="/([^"]*)"', lambda m: f'{m.group(1)}="{root}{m.group(2)}"', body)


def build_qr():
    """生成一张确定性的示意图码（模板占位，非真实可扫二维码）"""
    random.seed(20261022)
    n = 25
    cells = []
    for y in range(n):
        for x in range(n):
            cells.append((x, y))
    finder = set()

    def add_finder(ox, oy):
        for y in range(7):
            for x in range(7):
                edge = x in (0, 6) or y in (0, 6)
                core = 2 <= x <= 4 and 2 <= y <= 4
                if edge or core:
                    finder.add((ox + x, oy + y))
                else:
                    finder.add((ox + x, oy + y, "blank"))

    blocks = []
    add_finder(0, 0)
    add_finder(n - 7, 0)
    add_finder(0, n - 7)

    rects = []
    for y in range(n):
        for x in range(n):
            if (x, y) in finder or (x, y, "blank") in finder:
                continue
            if random.random() < 0.46:
                rects.append(f'<rect x="{x}" y="{y}" width="1" height="1"/>')

    blank = [
        f'<rect x="{x}" y="{y}" width="7" height="7" fill="none" stroke="#12181c" stroke-width="1"/>'
        for x, y in [(0, 0), (n - 7, 0), (0, n - 7)]
    ]
    core = [
        f'<rect x="{x + 2}" y="{y + 2}" width="3" height="3"/>'
        for x, y in [(0, 0), (n - 7, 0), (0, n - 7)]
    ]

    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 27 27" width="104" height="104" '
        'shape-rendering="crispEdges" role="img" aria-label="二维码占位图">'
        '<rect x="-1" y="-1" width="27" height="27" fill="#f7f6f2"/>'
        '<g fill="#12181c">' + "".join(rects) + "".join(core) + "</g>"
        '<g fill="none" stroke="#12181c" stroke-width="1">'
        + "".join(f'<rect x="{x + 0.5}" y="{y + 0.5}" width="6" height="6"/>' for x, y in [(0, 0), (n - 7, 0), (0, n - 7)])
        + "</g></svg>"
    )
    path = os.path.join(ROOT, "assets", "img", "qr.svg")
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg)


def build_favicon():
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">'
        '<rect width="40" height="40" fill="#0c1114"/>'
        '<path d="M20 6 30.5 19.5h-5.6l8.1 11.1H7l8.1-11.1H9.5Z" fill="#35dfc6"/>'
        '<rect x="18.8" y="30.6" width="2.4" height="4.8" fill="#35dfc6"/>'
        "</svg>"
    )
    with open(os.path.join(ROOT, "assets", "img", "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg)


def build_sitemap():
    urls = []
    for p in PAGES:
        urls.append(f"  <url><loc>https://www.cedarcool.cn/{p['out']}</loc></url>")
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>\n"
    )
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(xml)


def main():
    build_qr()
    build_favicon()
    build_sitemap()

    for page in PAGES:
        src_path = os.path.join(PAGES_DIR, page["src"])
        meta, body = read_page(src_path)
        page = dict(page)
        page.update({k: v for k, v in meta.items() if k in ("title", "desc", "nav")})

        out_path = os.path.join(ROOT, page["out"])
        depth = page["out"].count("/")
        root = "../" * depth

        html = head(page, root) + header(page, root) + rewrite(body, root) + footer(root)

        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        print("built", page["out"])


if __name__ == "__main__":
    main()
