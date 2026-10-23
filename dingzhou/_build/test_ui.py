import os
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PAGES = [
    "index.html", "products/index.html", "products/control-arm.html", "capability/index.html",
    "case/index.html", "about/index.html", "news/index.html",
    "news/aluminum-control-arm.html", "contact/index.html",
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
            pg.wait_for_timeout(220)
            ow = pg.evaluate("document.documentElement.scrollWidth")
            cw = pg.evaluate("document.documentElement.clientWidth")
            check(ow <= cw + 1, f"无横向溢出 {w}px {rel} ({ow}>{cw})", res)
        pg.close()

    # ---------- 桌面交互 ----------
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto(url("index.html"))
    pg.wait_for_timeout(700)

    pg.hover("[data-mega]")
    pg.wait_for_timeout(350)
    check(pg.eval_on_selector("#mega-parts", "e=>e.classList.contains('is-open')"), "巨型菜单悬停展开", res)
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(250)
    check(not pg.eval_on_selector("#mega-parts", "e=>e.classList.contains('is-open')"), "Esc 关闭巨型菜单", res)

    pg.click('[data-part-tab="bj"]')
    pg.wait_for_timeout(450)
    check(pg.eval_on_selector('[data-part="bj"]', "e=>!e.hidden"), "首屏切换到球头视图", res)
    check(pg.eval_on_selector('[data-part="ca"]', "e=>e.hidden"), "旧零件视图隐藏", res)
    check("40Cr" in pg.eval_on_selector('[data-spec="material"]', "e=>e.textContent"), "参数随零件更新", res)
    check(pg.eval_on_selector('[data-part-tab="bj"]', "e=>e.getAttribute('aria-selected')") == "true", "标签 aria-selected 同步", res)

    pg.goto(url("products/index.html"))
    pg.wait_for_timeout(500)
    pg.click('[data-filter="joint"]')
    pg.wait_for_timeout(250)
    visible = pg.eval_on_selector_all("#productGrid [data-tags]", "els=>els.filter(e=>!e.classList.contains('is-hidden')).length")
    check(visible == 2, f"筛选球头命中 {visible} 个（应为 2）", res)
    check(pg.eval_on_selector(".part--cta", "e=>e.classList.contains('is-hidden')"), "筛选时隐藏收口卡", res)
    pg.click('[data-filter="all"]')
    pg.wait_for_timeout(200)
    visible = pg.eval_on_selector_all("#productGrid [data-tags]", "els=>els.filter(e=>!e.classList.contains('is-hidden')).length")
    check(visible == 9, f"筛选全部命中 {visible} 个（应为 9）", res)
    check(pg.eval_on_selector(".part--cta", "e=>!e.classList.contains('is-hidden')"), "恢复全部时显示收口卡", res)

    pg.goto(url("products/control-arm.html"))
    pg.wait_for_timeout(500)
    pg.click('[data-thumb="section"]')
    pg.wait_for_timeout(250)
    check(pg.eval_on_selector('[data-view="section"]', "e=>!e.hidden"), "产品视图切换", res)
    check(pg.eval_on_selector('[data-view="unit"]', "e=>e.hidden"), "旧视图隐藏", res)

    pg.goto(url("contact/index.html"))
    pg.wait_for_timeout(400)
    pg.click('form[data-form] [type="submit"]')
    pg.wait_for_timeout(400)
    invalid = pg.eval_on_selector_all("form[data-form] .field.is-invalid", "els=>els.length")
    check(invalid >= 3, f"空表单标记 {invalid} 个必填项", res)
    check(pg.eval_on_selector("#ct-name", "e=>e.getAttribute('aria-invalid')") == "true", "必填项 aria-invalid", res)
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
    check(pg.eval_on_selector_all('.acc__btn[aria-expanded="true"]', "els=>els.length") == 1, "同组只展开一个", res)

    # 工序行 hover 反色（检查伪元素已上移，不被背景遮挡）
    pg.goto(url("capability/index.html"))
    pg.wait_for_timeout(500)
    pg.hover(".proc__item")
    pg.wait_for_timeout(500)
    bg = pg.eval_on_selector(".proc__item:hover", "e=>getComputedStyle(e,'::before').transform")
    check(bg not in ("none", "matrix(0, 0, 0, 1, 0, 0)"), f"工序行 hover 填充生效 {bg}", res)
    pg.close()

    # ---------- 移动端 ----------
    pg = b.new_page(viewport={"width": 390, "height": 844})
    pg.goto(url("index.html"))
    pg.wait_for_timeout(500)
    pg.click("[data-drawer-open]")
    pg.wait_for_timeout(600)
    check(pg.eval_on_selector("#drawer", "e=>e.classList.contains('is-open')"), "移动端抽屉打开", res)
    check(pg.evaluate("document.body.classList.contains('is-locked')"), "抽屉锁定滚动", res)
    pg.click(".drawer__toggle")
    pg.wait_for_timeout(400)
    check(pg.eval_on_selector(".drawer__toggle", "e=>e.getAttribute('aria-expanded')") == "true", "抽屉二级菜单展开", res)
    pg.click("[data-drawer-close]")
    pg.wait_for_timeout(500)
    check(not pg.eval_on_selector("#drawer", "e=>e.classList.contains('is-open')"), "抽屉关闭", res)
    pg.close()

    # ---------- 减少动效 ----------
    ctx = b.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    pg = ctx.new_page()
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(url("index.html"))
    pg.wait_for_timeout(600)
    hidden = pg.eval_on_selector_all("[data-reveal]", "els=>els.filter(e=>getComputedStyle(e).opacity!=='1').length")
    check(hidden == 0, f"减少动效下内容直接可见（仍隐藏 {hidden} 个）", res)
    typed = pg.eval_on_selector(".hero", "e=>e.classList.contains('is-typed')")
    check(typed, "首屏标题在减少动效下仍标记显示", res)
    check(not errors, f"无脚本错误 {errors[:1]}", res)
    ctx.close()
    b.close()

for status, msg in res:
    if status == "FAIL":
        print(status, msg)
print("total", len(res), "fail", sum(1 for s, _ in res if s == "FAIL"))
