/* ==========================================================================
   Refine Lab — 結構重寫版
   原創 vanilla JS：頁首主題切換、抽屜選單、捲動顯現、計數、視差、
   跑馬燈、推薦輪播、FAQ 手風琴、關鍵詞輪播、表單示範
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     1. 頁首：捲動狀態 + 依區塊明暗切換 header 主題
     ------------------------------------------------------------------ */
  var header = document.getElementById("site-header");
  var themedSections = document.querySelectorAll("[data-menu-theme]");

  function syncHeaderOnScroll() {
    header.classList.toggle("is-stuck", window.scrollY > 24);
  }
  window.addEventListener("scroll", syncHeaderOnScroll, { passive: true });
  syncHeaderOnScroll();

  if ("IntersectionObserver" in window && themedSections.length) {
    // 只偵測頁首高度那一條水平帶（視窗頂部 140px）
    var themeBand = Math.max(0, window.innerHeight - 140);
    var themeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          document.body.dataset.headerTheme = entry.target.dataset.menuTheme;
        });
      },
      { rootMargin: "0px 0px -" + themeBand + "px 0px", threshold: 0 }
    );
    themedSections.forEach(function (section) {
      themeObserver.observe(section);
    });
  }

  /* ------------------------------------------------------------------
     2. 行動抽屜選單
     ------------------------------------------------------------------ */
  var navToggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("mobile-drawer");

  function setDrawer(open) {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "關閉選單" : "開啟選單");
    drawer.classList.toggle("is-open", open);
    drawer.hidden = false;
    document.body.classList.toggle("menu-open", open);
  }

  if (navToggle && drawer) {
    navToggle.addEventListener("click", function () {
      setDrawer(navToggle.getAttribute("aria-expanded") !== "true");
    });
    drawer.addEventListener("click", function (event) {
      if (event.target.closest("a")) setDrawer(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) {
        setDrawer(false);
        navToggle.focus();
      }
    });
    window.matchMedia("(min-width: 1025px)").addEventListener("change", function (e) {
      if (e.matches) setDrawer(false);
    });
  }

  /* ------------------------------------------------------------------
     3. 語言切換器（示範）
     ------------------------------------------------------------------ */
  var langPicker = document.querySelector(".lang-picker");
  if (langPicker) {
    var langTrigger = langPicker.querySelector(".lang-picker__trigger");
    langTrigger.addEventListener("click", function () {
      var open = langPicker.classList.toggle("is-open");
      langTrigger.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (event) {
      if (!langPicker.contains(event.target)) {
        langPicker.classList.remove("is-open");
        langTrigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------------------
     4. 捲動顯現（IntersectionObserver）
     ------------------------------------------------------------------ */
  var revealables = document.querySelectorAll("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window && revealables.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
    );
    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealables.forEach(function (el) {
      el.classList.add("is-revealed");
    });
  }

  /* ------------------------------------------------------------------
     5. 數字計數
     ------------------------------------------------------------------ */
  var counters = document.querySelectorAll("[data-counter]");
  function animateCounter(el) {
    var target = parseInt(el.dataset.counter, 10) || 0;
    if (reduceMotion) {
      el.textContent = target.toLocaleString();
      return;
    }
    var duration = 1800;
    var start = null;
    function tick(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     6. 視差（rAF + data-parallax-speed）
     ------------------------------------------------------------------ */
  var parallaxEls = Array.prototype.slice.call(
    document.querySelectorAll("[data-parallax]")
  );
  if (!reduceMotion && parallaxEls.length) {
    var ticking = false;
    function applyParallax() {
      var viewportH = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var speed = parseFloat(el.dataset.parallaxSpeed) || 0.1;
        if (rect.bottom < 0 || rect.top > viewportH) return;
        var offset = (rect.top + rect.height / 2 - viewportH / 2) * speed;
        el.style.transform = "translate3d(0," + (-offset).toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(applyParallax);
        }
      },
      { passive: true }
    );
    applyParallax();
  }

  /* ------------------------------------------------------------------
     7. 客戶 Logo 跑馬燈（複製一份以無縫循環）
     ------------------------------------------------------------------ */
  var marqueeTrack = document.querySelector("[data-marquee]");
  if (marqueeTrack) {
    var group = marqueeTrack.querySelector(".logo-marquee__group");
    if (group) {
      var clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      marqueeTrack.appendChild(clone);
    }
  }

  /* ------------------------------------------------------------------
     8. 推薦輪播（自動播放 + 前後頁 + 圓點 + 觸控滑動）
     ------------------------------------------------------------------ */
  var slider = document.querySelector("[data-slider]");
  if (slider) {
    var track = slider.querySelector(".quote-slider__track");
    var slides = slider.querySelectorAll(".quote-slide");
    var dotsWrap = slider.querySelector(".quote-slider__dots");
    var prevBtn = slider.querySelector("[data-slider-prev]");
    var nextBtn = slider.querySelector("[data-slider-next]");
    var interval = parseInt(slider.dataset.sliderInterval, 10) || 6000;
    var current = 0;
    var timer = null;
    var total = slides.length;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "quote-slider__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "第 " + (i + 1) + " 則推薦");
      dot.addEventListener("click", function () {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll(".quote-slider__dot");

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = "translateX(-" + current * 100 + "%)";
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { goTo(current + 1); }, interval);
    }

    prevBtn.addEventListener("click", function () { goTo(current - 1); restart(); });
    nextBtn.addEventListener("click", function () { goTo(current + 1); restart(); });
    slider.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    slider.addEventListener("mouseleave", restart);

    var startX = null;
    track.addEventListener("pointerdown", function (e) { startX = e.clientX; });
    window.addEventListener("pointerup", function (e) {
      if (startX === null) return;
      var delta = e.clientX - startX;
      if (Math.abs(delta) > 48) goTo(current + (delta < 0 ? 1 : -1));
      startX = null;
      restart();
    });

    restart();
  }

  /* ------------------------------------------------------------------
     9. FAQ 手風琴
     ------------------------------------------------------------------ */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var trigger = item.querySelector(".faq-item__trigger");
    var panel = item.querySelector(".faq-item__panel");
    if (!trigger || !panel) return;

    // 移除 no-JS 的 hidden，改用 class 控制摺疊動畫
    panel.removeAttribute("hidden");

    trigger.addEventListener("click", function () {
      var open = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(open));
    });
  });

  /* ------------------------------------------------------------------
     10. Hero 關鍵詞輪播
     ------------------------------------------------------------------ */
  var rotator = document.querySelector("[data-rotator]");
  if (rotator && !reduceMotion) {
    var words = rotator.querySelectorAll(".word-rotator__word");
    var wordIndex = 0;
    setInterval(function () {
      var currentWord = words[wordIndex];
      var nextIndex = (wordIndex + 1) % words.length;
      currentWord.classList.remove("is-active");
      currentWord.classList.add("is-leaving");
      words[nextIndex].classList.add("is-active");
      window.setTimeout(function () {
        currentWord.classList.remove("is-leaving");
      }, 600);
      wordIndex = nextIndex;
    }, 2800);
  } else if (rotator) {
    rotator
      .querySelectorAll(".word-rotator__word")
      .forEach(function (w) { w.classList.add("is-active"); });
  }

  /* ------------------------------------------------------------------
     11. 聯絡表單（前端示範，不送出）
     ------------------------------------------------------------------ */
  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector("[data-form-status]");
      if (!form.checkValidity()) {
        status.textContent = "請完整填寫必填欄位。";
        form.reportValidity();
        return;
      }
      status.textContent = "已收到您的訊息（示範模式，未實際送出）。";
      form.reset();
    });
  }

  /* ------------------------------------------------------------------
     12. 年份
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
