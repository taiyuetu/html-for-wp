/* ==========================================================================
   Refine Lab — 結構重寫版：作品列表頁
   原創 vanilla JS：精選輪播、案例資料渲染、分類篩選、吸頂篩選列
   （案例名稱／年份／分類為事實資料，描述與示意圖皆為本重寫版自製內容）
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     案例資料集（名稱、年份、分類取自原站事實資料；示意圖以色塊取代）
     ------------------------------------------------------------------ */
  var PROJECTS = [
    { name: "2024 南亞科技 ESG", year: "2024", tags: ["企業形象網站", ".Net", "半導體・LED 與記憶體", "ESG", "熱門精選"] },
    { name: "Diamond Towers 台北之星", year: "2021", tags: ["企業形象網站", "無後台網站", "房地產"] },
    { name: "TRX Residences", year: "2026", tags: ["單頁式網站", "無後台網站", "房地產", "AI 智能", "最新上架"] },
    { name: "中孚科技2025官網", year: "2025", tags: ["企業形象網站", "WordPress", "數位行銷與企業服務", "網路・雲端與資安", "ESG", "最新上架"] },
    { name: "加雲聯網2025官網", year: "2025", tags: ["企業形象網站", "WordPress", "綠能與電力", "ESG", "最新上架"] },
    { name: "宇辰系統科技2025官網", year: "2025", tags: ["企業形象網站", "WordPress", "網路・雲端與資安", "ESG", "投資人專區", "最新上架"] },
    { name: "銳鎂科技股份有限公司", year: "2025", tags: ["企業形象網站", "WordPress", "電子・電腦與製造", "最新上架"] },
    { name: "ASE 日月光半導體", year: "2022", tags: ["企業形象網站", "WordPress", "半導體・LED 與記憶體", "熱門精選"] },
    { name: "明台產物保險", year: "2024", tags: ["企業形象網站", "WordPress", "金融・保險與顧問", "ESG", "投資人專區", "熱門精選"] },
    { name: "SFH Parkside Residences", year: "2025", tags: ["企業形象網站", "WordPress", "房地產", "AI 智能", "最新上架"] },
    { name: "啟端", year: "2025", tags: ["企業形象網站", "WordPress", "教育與公益組織", "AI 智能", "最新上架"] },
    { name: "M31 円星科技", year: "2024", tags: ["企業形象網站", "WordPress", "半導體・LED 與記憶體", "ESG", "投資人專區", "熱門精選"] },
    { name: "威睿科技", year: "2025", tags: ["企業形象網站", "WordPress", "網路・雲端與資安", "投資人專區", "熱門精選"] },
    { name: "柏威年 Pavilion Square", year: "2025", tags: ["單頁式網站", "無後台網站", "房地產", "熱門精選"] },
    { name: "蒙特梭利集團官網", year: "2023", tags: ["企業形象網站", "WordPress", "教育與公益組織", "熱門精選"] },
    { name: "Mission", year: "2021", tags: ["企業形象網站", "WordPress", "金融・保險與顧問", "熱門精選"] },
    { name: "Wearcomeshop", year: "2021", tags: ["電子商務網站", "WooCommerce", "服飾・時尚與潮流", "熱門精選"] },
    { name: "Venus周年慶", year: "2021", tags: ["活動網站", "WordPress", "服飾・時尚與潮流", "熱門精選"] },
    { name: "上銀科技 HIWIN", year: "2024", tags: ["企業形象網站", "無後台網站", "電子・電腦與製造", "UIUX 設計", "熱門精選"] },
    { name: "信義房屋", year: "2017", tags: ["企業形象網站", "無後台網站", "房地產", "熱門精選"] },
    { name: "奇美 Ecologue", year: "2023", tags: ["企業形象網站", "無後台網站", "電子・電腦與製造", "ESG", "熱門精選"] },
    { name: "花旗銀行勸募", year: "2017", tags: ["活動網站", "無後台網站", "金融・保險與顧問", "熱門精選"] },
    { name: "台北醫學院 DeepRad.AI 2023官網", year: "2023", tags: ["企業形象網站", "WordPress", "醫療・醫美・生技與護理", "熱門精選"] },
    { name: "明治菓子", year: "2021", tags: ["企業形象網站", ".Net", "品牌與消費產業", "熱門精選"] },
    { name: "家河廣告", year: "2021", tags: ["企業形象網站", "WordPress", "房地產", "AI 智能"] },
    { name: "The Conlay", year: "2025", tags: ["企業形象網站", "WordPress", "房地產", "AI 智能", "最新上架"] }
  ];

  var TONES = ["violet", "steel", "amber", "sand", "graphite", "rose"];
  var ALL_TAG = "全部作品";

  /* 取樣式字母：有中文取名前兩字，否則取拉丁字首字母 */
  function monogram(name) {
    var cjk = name.match(/[\u4e00-\u9fff]/g);
    if (cjk && cjk.length >= 2) return cjk[0] + cjk[1];
    var latin = name.match(/[A-Za-z0-9]+/g);
    if (latin) return latin[0].slice(0, 3).toUpperCase();
    return name.slice(0, 2);
  }

  /* ------------------------------------------------------------------
     1. 渲染案例卡片
     ------------------------------------------------------------------ */
  var grid = document.querySelector("[data-filter-grid]");
  var cards = [];

  if (grid) {
    PROJECTS.forEach(function (project, i) {
      var tone = TONES[i % TONES.length];
      var mono = monogram(project.name);
      var showTags = project.tags.slice(0, 3);
      var tagHtml = showTags
        .map(function (tag) { return "<li>" + tag + "</li>"; })
        .join("");

      var article = document.createElement("article");
      article.className = "work-card work-card--compact";
      article.setAttribute("data-reveal", "");
      article.style.setProperty("--reveal-delay", ((i % 3) * 0.07).toFixed(2) + "s");
      article.dataset.tags = project.tags.join("|");
      article.innerHTML =
        '<a class="work-card__link" href="#works-browser" aria-label="查看案例：' + project.name + '">' +
          '<figure class="work-card__media">' +
            '<span class="work-card__layer work-card__layer--base" data-tone="' + tone + '" aria-hidden="true"><span class="work-card__monogram">' + mono + '</span></span>' +
            '<span class="work-card__layer work-card__layer--hover" data-tone="' + tone + '-deep" aria-hidden="true"><span class="work-card__monogram">' + mono + '</span></span>' +
          "</figure>" +
          '<div class="work-card__body">' +
            '<div class="work-card__heading">' +
              '<h3 class="work-card__name">' + project.name + "</h3>" +
              '<span class="work-card__year"><time datetime="' + project.year + '">' + project.year + "</time></span>" +
            "</div>" +
            '<ul class="work-card__tags" role="list">' + tagHtml + "</ul>" +
          "</div>" +
          '<span class="work-card__go" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        "</a>";
      grid.appendChild(article);
      cards.push(article);
    });
  }

  /* ------------------------------------------------------------------
     2. 分類計數
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-chip-count]").forEach(function (el) {
    var tag = el.dataset.chipCount;
    var count = tag === ALL_TAG
      ? PROJECTS.length
      : PROJECTS.filter(function (p) { return p.tags.indexOf(tag) > -1; }).length;
    el.textContent = count;
  });

  /* ------------------------------------------------------------------
     3. 分類篩選
     ------------------------------------------------------------------ */
  var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
  var currentEls = document.querySelectorAll("[data-filter-current], [data-filter-current-static]");
  var countEls = document.querySelectorAll("[data-filter-count], [data-filter-count-static]");
  var emptyState = document.querySelector("[data-filter-empty]");
  var currentTag = ALL_TAG;

  function applyFilter(tag) {
    currentTag = tag;
    var visible = 0;

    cards.forEach(function (card) {
      var tags = card.dataset.tags.split("|");
      var show = tag === ALL_TAG || tags.indexOf(tag) > -1;
      card.hidden = !show;
      if (show) visible++;
    });

    currentEls.forEach(function (el) { el.textContent = tag; });
    countEls.forEach(function (el) { el.textContent = visible; });

    if (emptyState) emptyState.hidden = visible > 0;

    chips.forEach(function (chip) {
      var selected = chip.dataset.tag === tag;
      chip.classList.toggle("is-selected", selected);
      chip.setAttribute("aria-pressed", String(selected));
    });

    if (grid && !reduceMotion) {
      grid.classList.remove("is-animating");
      void grid.offsetWidth; // 重觸發動畫
      grid.classList.add("is-animating");
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      applyFilter(chip.dataset.tag);
    });
  });

  var resetBtn = document.querySelector("[data-filter-reset]");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      applyFilter(ALL_TAG);
      window.scrollTo({ top: grid.getBoundingClientRect().top + window.scrollY - 160, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  applyFilter(ALL_TAG);

  /* ------------------------------------------------------------------
     4. 篩選面板開合
     ------------------------------------------------------------------ */
  var toggle = document.querySelector("[data-filter-toggle]");
  var panel = document.querySelector("[data-filter-panel]");
  var toggleLabel = document.querySelector("[data-filter-toggle-label]");

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      panel.classList.toggle("is-closed", expanded);
      if (toggleLabel) toggleLabel.textContent = expanded ? "顯示篩選" : "隱藏篩選";
    });
  }

  /* ------------------------------------------------------------------
     5. 精選輪播
     ------------------------------------------------------------------ */
  var featured = document.querySelector("[data-featured]");
  if (featured) {
    var slides = Array.prototype.slice.call(featured.querySelectorAll(".featured-slide"));
    var nums = Array.prototype.slice.call(featured.querySelectorAll("[data-featured-goto]"));
    var counterEl = featured.querySelector("[data-featured-current]");
    var interval = parseInt(featured.dataset.featuredInterval, 10) || 6500;
    var featuredIndex = 0;
    var timer = null;

    function pad(n) { return ("0" + (n + 1)).slice(-2); }

    function goTo(i) {
      if (i === featuredIndex) return;
      var prevSlide = slides[featuredIndex];
      var nextSlide = slides[i];
      prevSlide.classList.remove("is-active");
      prevSlide.classList.add("is-prev");
      nextSlide.classList.add("is-active");
      window.setTimeout(function () { prevSlide.classList.remove("is-prev"); }, 700);
      featuredIndex = i;
      nums.forEach(function (num, k) { num.classList.toggle("is-active", k === i); });
      if (counterEl) counterEl.textContent = pad(i);
    }

    function restartTimer() {
      if (timer) window.clearInterval(timer);
      if (reduceMotion) return;
      timer = window.setInterval(function () {
        goTo((featuredIndex + 1) % slides.length);
      }, interval);
    }

    nums.forEach(function (num) {
      num.addEventListener("click", function () {
        goTo(parseInt(num.dataset.featuredGoto, 10));
        restartTimer();
      });
    });

    restartTimer();
  }
})();
