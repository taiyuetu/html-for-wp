/* ==========================================================================
   main.js — 交互（原生 JS，无依赖）
   模块：头部状态 / 巨型菜单 / 移动抽屉 / 首屏轮播 / 滚动入场 /
        数字滚动 / 筛选项 / 折叠面板 / 表单校验 / 产品图切换 / 回到顶部
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- 1. 头部状态 */
  var header = document.querySelector(".site-header");
  if (header) {
    var setHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  /* ------------------------------------------------------------ 2. 巨型下拉菜单 */
  var megaTriggers = Array.prototype.slice.call(document.querySelectorAll("[data-mega]"));
  var megas = Array.prototype.slice.call(document.querySelectorAll(".mega"));
  var megaTimer = null;

  function closeMegas(except) {
    megas.forEach(function (m) {
      if (m !== except) m.classList.remove("is-open");
    });
    megaTriggers.forEach(function (t) {
      if (!except || t.getAttribute("aria-controls") !== except.id) {
        t.setAttribute("aria-expanded", "false");
      }
    });
  }

  function openMega(trigger) {
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;
    window.clearTimeout(megaTimer);
    closeMegas(panel);
    panel.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  megaTriggers.forEach(function (trigger) {
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;

    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      if (panel.classList.contains("is-open")) {
        closeMegas();
      } else {
        openMega(trigger);
      }
    });

    // 桌面端指针悬停展开（带 120ms 关闭延迟，避免鼠标穿越缝隙时闪断）
    var hoverable = window.matchMedia("(hover: hover) and (min-width: 1081px)");
    trigger.addEventListener("mouseenter", function () {
      if (hoverable.matches) openMega(trigger);
    });
    panel.addEventListener("mouseenter", function () {
      if (hoverable.matches) window.clearTimeout(megaTimer);
    });
    [trigger, panel].forEach(function (el) {
      el.addEventListener("mouseleave", function () {
        if (!hoverable.matches) return;
        megaTimer = window.setTimeout(function () {
          closeMegas();
        }, 120);
      });
    });

    // 键盘：面板内的最后一个可聚焦元素 Tab 出去时关闭
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

  /* ---------------------------------------------------------- 3. 移动端抽屉菜单 */
  var drawer = document.getElementById("drawer");
  var drawerOpenBtn = document.querySelector("[data-drawer-open]");
  var drawerCloseBtn = drawer ? drawer.querySelector("[data-drawer-close]") : null;

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.removeAttribute("aria-hidden");
    document.body.classList.add("is-locked");
    if (drawerOpenBtn) drawerOpenBtn.setAttribute("aria-expanded", "true");
    var first = drawer.querySelector("a, button");
    if (first) first.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (drawerOpenBtn) {
      drawerOpenBtn.setAttribute("aria-expanded", "false");
      drawerOpenBtn.focus();
    }
  }

  if (drawerOpenBtn) drawerOpenBtn.addEventListener("click", openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);

  // 抽屉内 Tab 循环，避免焦点跑到遮罩后的页面
  document.addEventListener("keydown", function (e) {
    if (!drawer || !drawer.classList.contains("is-open") || e.key !== "Tab") return;
    var panel = drawer.querySelector(".drawer__panel");
    var items = Array.prototype.filter.call(
      panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea'),
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
  if (drawer) {
    drawer.addEventListener("click", function (e) {
      if (e.target === drawer.querySelector(".drawer__scrim")) closeDrawer();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) closeDrawer();
    });
  }

  // 抽屉内的二级折叠
  Array.prototype.forEach.call(document.querySelectorAll(".drawer__toggle"), function (btn) {
    btn.addEventListener("click", function () {
      btn.setAttribute("aria-expanded", btn.getAttribute("aria-expanded") === "true" ? "false" : "true");
    });
  });

  /* ------------------------------------------------------------ 4. 首屏轮播 */
  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var bars = Array.prototype.slice.call(hero.querySelectorAll(".hero-bar"));
    var countEl = hero.querySelector("[data-hero-count]");
    var idx = 0;
    var timer = null;
    var DURATION = 7000;

    var go = function (next) {
      idx = (next + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        s.classList.toggle("is-active", i === idx);
        s.setAttribute("aria-hidden", i === idx ? "false" : "true");
      });
      bars.forEach(function (b, i) {
        var on = i === idx;
        b.setAttribute("aria-selected", on ? "true" : "false");
        var fill = b.querySelector("span");
        if (fill) {
          fill.style.animation = "none";
          // 强制重排以重启动画
          void fill.offsetWidth;
          fill.style.animation = on ? "barFill " + DURATION + "ms linear forwards" : "none";
        }
      });
      if (countEl) countEl.textContent = ("0" + (idx + 1)).slice(-2);
      restart();
    };

    var restart = function () {
      window.clearInterval(timer);
      if (reduceMotion) return;
      timer = window.setInterval(function () {
        go(idx + 1);
      }, DURATION);
    };

    var stop = function () {
      window.clearInterval(timer);
    };

    bars.forEach(function (b, i) {
      b.addEventListener("click", function () {
        go(i);
      });
    });

    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    if (prev) prev.addEventListener("click", function () { go(idx - 1); });
    if (next) next.addEventListener("click", function () { go(idx + 1); });

    hero.addEventListener("mouseenter", function () {
      hero.classList.add("is-paused");
      stop();
    });
    hero.addEventListener("mouseleave", function () {
      hero.classList.remove("is-paused");
      restart();
    });
    hero.addEventListener("focusin", stop);
    hero.addEventListener("focusout", restart);

    hero.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") go(idx - 1);
      if (e.key === "ArrowRight") go(idx + 1);
    });

    // 触屏滑动
    var sx = 0;
    hero.addEventListener("touchstart", function (e) {
      sx = e.changedTouches[0].clientX;
      stop();
    }, { passive: true });
    hero.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 48) go(idx + (dx < 0 ? 1 : -1));
      restart();
    }, { passive: true });

    go(0);
  }

  /* ------------------------------------------------------ 5. 滚动入场（IO） */
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealTargets.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      // 同一容器内的元素自动错峰 80ms
      document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
        Array.prototype.forEach.call(group.querySelectorAll("[data-reveal]"), function (el, i) {
          if (!el.style.getPropertyValue("--reveal-delay")) {
            el.style.setProperty("--reveal-delay", Math.min(i, 5) * 80 + "ms");
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

  /* --------------------------------------------------------- 6. 数字滚动 */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      if (reduceMotion) {
        el.textContent = target.toFixed(decimals);
        return;
      }
      var start = performance.now();
      var dur = 1400;
      var tick = function (now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCount(entry.target);
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
        var shown = 0;
        // 筛选态下隐藏"非标/更多"收口卡，避免空网格行
        var moreTile = list.querySelector(".pcard--more");
        if (moreTile) moreTile.classList.toggle("is-hidden", value !== "all");
        list.classList.toggle("is-filtered", value !== "all");
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

  /* -------------------------------------------------------- 8. 折叠面板 */
  Array.prototype.forEach.call(document.querySelectorAll(".acc__item"), function (item) {
    var btn = item.querySelector(".acc__btn");
    var panel = item.querySelector(".acc__panel");
    if (!btn || !panel) return;

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      // 同一组内只保持一个展开
      var group = item.parentElement;
      Array.prototype.forEach.call(group.querySelectorAll(".acc__btn"), function (other) {
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

  // 初始展开的面板：按实际内容高度撑开，避免长文案被裁切
  Array.prototype.forEach.call(
    document.querySelectorAll('.acc__btn[aria-expanded="true"]'),
    function (btn) {
      var panel = btn.parentElement.querySelector(".acc__panel");
      if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
    }
  );

  /* -------------------------------------------------------- 9. 表单校验 */
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
        if (field.closest(".field") && field.closest(".field").classList.contains("is-invalid")) {
          validate(field);
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var firstInvalid = null;
      fields.forEach(function (field) {
        if (field.type === "hidden") return;
        var valid = validate(field);
        if (!valid) {
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

      // 静态模板：此处为前端模拟提交。接入后端时替换为 fetch 请求。
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

  /* ------------------------------------------------- 10. 产品图切换（缩略图） */
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

  /* --------------------------------------------------------- 11. 回到顶部 */
  Array.prototype.forEach.call(document.querySelectorAll("[data-top]"), function (btn) {
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
})();
