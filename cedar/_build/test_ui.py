import os
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, "_shots")

PAGES = [
    "index.html", "products/index.html", "products/lc-s.html", "solutions/index.html",
    "case/index.html", "about/index.html", "news/index.html",
    "news/co2-commissioning.html", "contact/index.html",
]


def url(rel):
    return "file:///" + os.path.join(ROOT, rel).replace("\\", "/")


def check(cond, msg, out):
    out.append(("PASS" if cond else "FAIL", msg))


with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    res = []

    # ---------- 横向溢出 ----------
    for w in (375, 768, 1024, 1440):
        pg = b.new_page(viewport={"width": w, "height": 900})
        for rel in PAGES:
            pg.goto(url(rel))
            pg.wait_for_timeout(250)
            ow = pg.evaluate("document.documentElement.scrollWidth")
            cw = pg.evaluate("document.documentElement.clientWidth")
            check(ow <= cw + 1, f"无横向溢出 {w}px {rel} ({ow}>{cw})", res)
        pg.close()

    # ---------- 桌面交互 ----------
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto(url("index.html"))
    pg.wait_for_timeout(600)
    pg.hover("[data-mega]")
    pg.wait_for_timeout(350)
    check(pg.eval_on_selector("#mega-products", "e=>e.classList.contains('is-open')"), "巨型菜单悬停展开", res)
    check(pg.eval_on_selector("[data-mega]", "e=>e.getAttribute('aria-expanded')") == "true", "巨型菜单 aria-expanded=true", res)
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(300)
    check(not pg.eval_on_selector("#mega-products", "e=>e.classList.contains('is-open')"), "Esc 关闭巨型菜单", res)

    pg.click("[data-hero-next]")
    pg.wait_for_timeout(700)
    check(pg.eval_on_selector_all(".hero-slide", "els=>els.findIndex(e=>e.classList.contains('is-active'))") == 1, "轮播下一屏", res)
    check(pg.eval_on_selector("[data-hero-count]", "e=>e.textContent") == "02", "轮播计数同步", res)

    pg.goto(url("products/index.html"))
    pg.wait_for_timeout(500)
    pg.click('[data-filter="co2"]')
    pg.wait_for_timeout(200)
    visible = pg.eval_on_selector_all("#productGrid [data-tags]", "els=>els.filter(e=>!e.classList.contains('is-hidden')).length")
    check(visible == 2, f"筛选 CO₂ 命中 {visible} 个（应为 2）", res)
    pg.click('[data-filter="all"]')
    pg.wait_for_timeout(200)
    visible = pg.eval_on_selector_all("#productGrid [data-tags]", "els=>els.filter(e=>!e.classList.contains('is-hidden')).length")
    check(visible == 9, f"筛选全部命中 {visible} 个（应为 9）", res)

    pg.goto(url("products/lc-s.html"))
    pg.wait_for_timeout(400)
    pg.click('[data-thumb="piping"]')
    pg.wait_for_timeout(200)
    check(pg.eval_on_selector('[data-view="piping"]', "e=>!e.hidden"), "产品视图切换到接管示意", res)
    check(pg.eval_on_selector('[data-view="unit"]', "e=>e.hidden"), "切换后旧视图隐藏", res)

    pg.goto(url("contact/index.html"))
    pg.wait_for_timeout(400)
    pg.click('form[data-form] [type="submit"]')
    pg.wait_for_timeout(400)
    invalid = pg.eval_on_selector_all("form[data-form] .field.is-invalid", "els=>els.length")
    check(invalid >= 3, f"空表单校验标记 {invalid} 个必填项", res)
    check(pg.eval_on_selector(".form__success", "e=>!e.classList.contains('is-visible')"), "校验失败不显示成功态", res)
    check(pg.eval_on_selector("#ct-name", "e=>e.getAttribute('aria-invalid')") == "true", "必填项 aria-invalid=true", res)

    pg.fill("#ct-name", "王工")
    pg.fill("#ct-tel", "13800138000")
    pg.fill("#ct-email", "wang@example.com")
    pg.check("#ct-agree")
    pg.click('form[data-form] [type="submit"]')
    pg.wait_for_timeout(1100)
    check(pg.eval_on_selector(".form__success", "e=>e.classList.contains('is-visible')"), "填写完整后显示成功态", res)

    acc = pg.locator(".acc__btn").nth(1)
    acc.click()
    pg.wait_for_timeout(500)
    check(acc.get_attribute("aria-expanded") == "true", "折叠面板展开", res)
    check(pg.eval_on_selector_all('.acc__btn[aria-expanded="true"]', "els=>els.length") == 1, "同组只展开一个面板", res)
    pg.close()

    # ---------- 移动端抽屉 ----------
    pg = b.new_page(viewport={"width": 390, "height": 844})
    pg.goto(url("index.html"))
    pg.wait_for_timeout(500)
    pg.click("[data-drawer-open]")
    pg.wait_for_timeout(600)
    check(pg.eval_on_selector("#drawer", "e=>e.classList.contains('is-open')"), "移动端抽屉打开", res)
    check(pg.evaluate("document.body.classList.contains('is-locked')"), "抽屉打开时锁定页面滚动", res)
    pg.click(".drawer__toggle")
    pg.wait_for_timeout(400)
    check(pg.eval_on_selector(".drawer__toggle", "e=>e.getAttribute('aria-expanded')") == "true", "抽屉二级菜单展开", res)
    pg.click("[data-drawer-close]")
    pg.wait_for_timeout(500)
    check(not pg.eval_on_selector("#drawer", "e=>e.classList.contains('is-open')"), "抽屉关闭", res)
    pg.close()

    # ---------- 减少动效偏好 ----------
    ctx = b.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    pg = ctx.new_page()
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(url("index.html"))
    pg.wait_for_timeout(600)
    hidden = pg.eval_on_selector_all("[data-reveal]", "els=>els.filter(e=>getComputedStyle(e).opacity!=='1').length")
    check(hidden == 0, f"减少动效下内容直接可见（仍隐藏 {hidden} 个）", res)
    check(not errors, f"无脚本错误 {errors[:1]}", res)
    ctx.close()
    b.close()

for status, msg in res:
    if status == "FAIL":
        print(status, msg)
print("total", len(res), "fail", sum(1 for s, _ in res if s == "FAIL"))
