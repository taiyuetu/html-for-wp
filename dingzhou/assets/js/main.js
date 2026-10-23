/* ==========================================================================
   main.js — 鼎轴底盘 交互（原生 JS，无依赖）
   模块：头部 / 巨型菜单 / 抽屉 / 首屏零件切换 / 滚动入场 / 数字 /
        筛选 / 折叠 / 表单校验 / 产品视图 / 回到顶部
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------ 1. 头部 */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------------------------------------------------------- 2. 巨型菜单 */
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-mega]"));
  var megas = Array.prototype.slice.call(document.querySelectorAll(".mega"));
  var megaTimer = null;

  function closeMegas() {
    megas.forEach(function (m) {
      m.classList.remove("is-open");
    });
    triggers.forEach(function (t) {
      t.setAttribute("aria-expanded", "false");
    });
  }

  function openMega(trigger) {
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;
    window.clearTimeout(megaTimer);
    closeMegas();
    panel.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  triggers.forEach(function (trigger) {
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;
    var hoverable = window.matchMedia("(hover: hover) and (min-width: 1081px)");

    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      if (panel.classList.contains("is-open")) closeMegas();
      else openMega(trigger);
    });

    trigger.addEventListener("mouseenter", function () {
      if (hoverable.matches) openMega(trigger);
    });
    panel.addEventListener("mouseenter", function () {
      if (hoverable.matches) window.clearTimeout(megaTimer);
    });
    [trigger, panel].forEach(function (el) {
      el.addEventListener("mouseleave", function () {
        if (!hoverable.matches) return;
        megaTimer = window.setTimeout(closeMegas, 130);
      });
    });
    panel.addEventListener("focusout", function (e) {
      if (!panel.contains(e.relatedTarget)) closeMegas();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMegas();
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".site-header")) closeMegas();
  });

  /* ------------------------------------------------------------ 3. 抽屉 */
  var drawer = document.getElementById("drawer");
  var openBtn = document.querySelector("[data-drawer-open]");
  var closeBtn = drawer ? drawer.querySelector("[data-drawer-close]") : null;

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.removeAttribute("aria-hidden");
    document.body.classList.add("is-locked");
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");
    var first = drawer.querySelector("a, button");
    if (first) first.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (openBtn) {
      openBtn.setAttribute("aria-expanded", "false");
      openBtn.focus();
    }
  }

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (drawer) {
    drawer.addEventListener("click", function (e) {
      if (e.target === drawer.querySelector(".drawer__scrim")) closeDrawer();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) closeDrawer();
    });
    // 焦点约束
    document.addEventListener("keydown", function (e) {
      if (!drawer.classList.contains("is-open") || e.key !== "Tab") return;
      var panel = drawer.querySelector(".drawer__panel");
      var items = Array.prototype.filter.call(
        panel.querySelectorAll("a[href], button:not([disabled]), input, select, textarea"),
        function (el) { return el.offsetParent !== null; }
      );
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".drawer__toggle"), function (btn) {
    btn.addEventListener("click", function () {
      btn.setAttribute("aria-expanded", btn.getAttribute("aria-expanded") === "true" ? "false" : "true");
    });
  });

  /* --------------------------------------------------- 4. 首屏零件切换 */
  var hero = document.querySelector("[data-hero]");
  if (hero) {
    // 标题逐行上移
    requestAnimationFrame(function () {
      hero.classList.add("is-typed");
    });

    var tabs = Array.prototype.slice.call(hero.querySelectorAll("[data-part-tab]"));
    var views = Array.prototype.slice.call(hero.querySelectorAll("[data-part]"));
    var stageView = hero.querySelector(".stage__view");
    var specFields = {
      material: hero.querySelector('[data-spec="material"]'),
      tol: hero.querySelector('[data-spec="tol"]'),
      fatigue: hero.querySelector('[data-spec="fatigue"]'),
      weight: hero.querySelector('[data-spec="weight"]')
    };
    var caption = hero.querySelector("[data-part-caption]");

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-part-tab");
        tabs.forEach(function (t) {
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });

        var apply = function () {
          views.forEach(function (v) {
            v.hidden = v.getAttribute("data-part") !== key;
          });
          ["material", "tol", "fatigue", "weight"].forEach(function (k) {
            if (specFields[k]) specFields[k].textContent = tab.getAttribute("data-" + k) || "—";
          });
          if (caption) caption.textContent = tab.getAttribute("data-caption") || "";
        };

        if (reduceMotion || !stageView) {
          apply();
          return;
        }
        stageView.classList.add("is-switching");
        window.setTimeout(function () {
          apply();
          stageView.classList.remove("is-switching");
        }, 170);
      });
    });
  }

  /* ------------------------------------------------------- 5. 滚动入场 */
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealTargets.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
        Array.prototype.forEach.call(group.querySelectorAll("[data-reveal]"), function (el, i) {
          if (!el.style.getPropertyValue("--reveal-delay")) {
            el.style.setProperty("--reveal-delay", Math.min(i, 5) * 90 + "ms");
          }
        });
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      revealTargets.forEach(function (el) { io.observe(el); });
    }
  }

  /* --------------------------------------------------------- 6. 数字 */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      if (reduceMotion) {
        el.textContent = target.toFixed(decimals);
        return;
      }
      var start = performance.now();
      var step = function (now) {
        var p = Math.min((now - start) / 1500, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(run);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            run(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ------------------------------------------------------------ 7. 筛选 */
  Array.prototype.forEach.call(document.querySelectorAll("[data-filter-group]"), function (group) {
    var buttons = Array.prototype.slice.call(group.querySelectorAll("[data-filter]"));
    var list = document.querySelector(group.getAttribute("data-filter-group"));
    if (!list) return;
    var items = Array.prototype.slice.call(list.querySelectorAll("[data-tags]"));

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-filter");
        buttons.forEach(function (b) {
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        var cta = list.querySelector(".part--cta");
        if (cta) cta.classList.toggle("is-hidden", value !== "all");
        list.classList.toggle("is-filtered", value !== "all");

        var shown = 0;
        items.forEach(function (item) {
          var tags = (item.getAttribute("data-tags") || "").split(/\s+/);
          var match = value === "all" || tags.indexOf(value) > -1;
          item.classList.toggle("is-hidden", !match);
          if (match) shown++;
        });
        list.classList.toggle("is-empty", shown === 0);
      });
    });
  });

  /* ---------------------------------------------------------- 8. 折叠 */
  Array.prototype.forEach.call(document.querySelectorAll(".acc__item"), function (item) {
    var btn = item.querySelector(".acc__btn");
    var panel = item.querySelector(".acc__panel");
    if (!btn || !panel) return;

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      Array.prototype.forEach.call(item.parentElement.querySelectorAll(".acc__btn"), function (other) {
        if (other !== btn) {
          other.setAttribute("aria-expanded", "false");
          var p = other.parentElement.querySelector(".acc__panel");
          if (p) p.style.maxHeight = "0px";
        }
      });
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      panel.style.maxHeight = open ? "0px" : panel.scrollHeight + "px";
    });
  });

  Array.prototype.forEach.call(
    document.querySelectorAll('.acc__btn[aria-expanded="true"]'),
    function (btn) {
      var panel = btn.parentElement.querySelector(".acc__panel");
      if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
    }
  );

  /* ------------------------------------------------------ 9. 表单校验 */
  Array.prototype.forEach.call(document.querySelectorAll("[data-form]"), function (form) {
    var success = form.parentElement.querySelector(".form__success");
    var submitBtn = form.querySelector("[type=submit]");

    var setError = function (field, message) {
      var wrap = field.closest(".field");
      var err = wrap ? wrap.querySelector(".field__err") : null;
      if (wrap) wrap.classList.toggle("is-invalid", !!message);
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (err) err.textContent = message || "";
    };

    var validate = function (field) {
      var value = (field.value || "").trim();
      var type = field.getAttribute("type");
      var required = field.hasAttribute("required");

      if (required && field.type === "checkbox" && !field.checked) {
        setError(field, "请先同意隐私条款");
        return false;
      }
      if (required && !value) {
        setError(field, "此项为必填");
        return false;
      }
      if (value && type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        setError(field, "邮箱格式不正确");
        return false;
      }
      if (value && type === "tel" && !/^[\d\s+\-()]{7,20}$/.test(value)) {
        setError(field, "电话号码格式不正确");
        return false;
      }
      setError(field, "");
      return true;
    };

    var fields = Array.prototype.slice.call(form.querySelectorAll("input, select, textarea"));

    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        if (field.value || field.hasAttribute("required")) validate(field);
      });
      field.addEventListener("input", function () {
        var wrap = field.closest(".field");
        if (wrap && wrap.classList.contains("is-invalid")) validate(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var firstInvalid = null;
      fields.forEach(function (field) {
        if (field.type === "hidden") return;
        if (!validate(field)) {
          ok = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });
      if (!ok) {
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        }
        return;
      }

      // 静态模板：前端模拟提交，接后端时替换为 fetch
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "提交中…";
      }
      window.setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "提交询价";
        }
        form.reset();
        fields.forEach(function (f) { setError(f, ""); });
        if (success) {
          success.classList.add("is-visible");
          success.setAttribute("tabindex", "-1");
          success.focus();
          success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        }
      }, 700);
    });
  });

  /* --------------------------------------------------- 10. 产品视图切换 */
  Array.prototype.forEach.call(document.querySelectorAll("[data-gallery]"), function (gallery) {
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll("[data-thumb]"));
    var stage = gallery.querySelector("[data-stage]");
    if (!stage) return;
    var views = Array.prototype.slice.call(stage.querySelectorAll("[data-view]"));

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var key = thumb.getAttribute("data-thumb");
        thumbs.forEach(function (t) {
          t.setAttribute("aria-selected", t === thumb ? "true" : "false");
        });
        views.forEach(function (v) {
          v.hidden = v.getAttribute("data-view") !== key;
        });
      });
    });
  });

  /* ------------------------------------------------------- 11. 回到顶部 */
  Array.prototype.forEach.call(document.querySelectorAll("[data-top]"), function (btn) {
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
})();
