/* ==========================================================================
   Refine Lab — 結構重寫版：最新消息列表頁
   原創 vanilla JS：文章資料渲染、分類篩選、精選輪播
   （文章標題／日期／分類為事實資料；摘要與示意圖皆為本重寫版自製內容）
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     文章資料集（標題、日期、分類取自原站事實資料；摘要為自寫示意）
     ------------------------------------------------------------------ */
  var POSTS = [
    { title: "AI時代的達克效應：建立真正的判斷力天花板", year: 2026, date: "May 3 2026", iso: "2026-05-03", cats: ["AI 智能"],
      excerpt: "AI 工具人人可用，真正的差距來自判斷力：如何驗證輸出、界定問題，是這個時代的核心能力。" },
    { title: "做網站時應該要準備什麼資料？", year: 2026, date: "May 22 2026", iso: "2026-05-22", cats: ["網站知識"],
      excerpt: "從品牌素材、產品資料到網域與主機，一份完整的籌備清單讓專案少走冤枉路。" },
    { title: "搜尋引擎誕生 25 年最大革命：看懂 Google 的 AI 新時代，如何改變未來的網頁生活", year: 2026, date: "May 20 2026", iso: "2026-05-20", cats: ["GEO", "AI 智能"],
      excerpt: "AI 摘要正在改寫搜尋結果頁的面貌，品牌的內容策略也需要跟著重新想像。" },
    { title: "業績增長 27% 的關鍵：揭開 AI 客服提升轉化率的 3 個秘密", year: 2026, date: "May 2 2026", iso: "2026-05-02", cats: ["AI 智能"],
      excerpt: "即時回應、意圖判斷與商機整理，三個機制讓網站對話真正變成訂單。" },
    { title: "誰能賦權給 AI，誰就能定義新時代的專業價值", year: 2026, date: "Jun 2 2026", iso: "2026-06-02", cats: ["AI 智能"],
      excerpt: "AI 不改變專業的本質，而是放大懂用它的人：重新思考團隊的能力組合。" },
    { title: "點亮未來的五層蛋糕：從黃仁勳的最新洞察，看懂 AI 如何顛覆我們的商業世界", year: 2026, date: "Apr 1 2026", iso: "2026-04-01", cats: ["AI 智能"],
      excerpt: "從運算層到應用層，逐層拆解 AI 產業鏈的分工，看見企業的切入位置。" },
    { title: "AI 客服如何助你每年省下百萬人事成本？", year: 2026, date: "Mar 27 2026", iso: "2026-03-27", cats: ["AI 智能"],
      excerpt: "把重複詢問交給 AI、把複雜決策留給人，客服團隊的成本結構可以這樣重組。" },
    { title: "AI 不是要取代你，而是讓你更有價值：2026 人機協作新定義", year: 2026, date: "Mar 16 2026", iso: "2026-03-16", cats: ["AI 智能"],
      excerpt: "人機協作的新分工：AI 處理規模，人專注判斷與創意，兩者相乘而非相減。" },
    { title: "SEO 還是 GEO？2026 年品牌曝光的雙軌轉型全攻略", year: 2026, date: "Mar 15 2026", iso: "2026-03-15", cats: ["GEO"],
      excerpt: "傳統搜尋與生成式搜尋並行時代，品牌的內容資源該如何在兩條賽道上分配。" },
    { title: "2026 GEO 完整攻略：如何讓 ChatGPT 與 AI 搜尋引擎主動引用你的品牌？", year: 2026, date: "Mar 14 2026", iso: "2026-03-14", cats: ["GEO"],
      excerpt: "從結構化資料到權威訊號，五個讓生成式引擎記住你的關鍵做法。" },
    { title: "2026 AI 客服市場爆發：企業領先佈局的 5 大關鍵趨勢", year: 2026, date: "Mar 13 2026", iso: "2026-03-13", cats: ["AI 智能"],
      excerpt: "AI 客服從選配轉為標配的分水嶺，導入重點與常見誤區一次整理。" },
    { title: "2026 數位轉型下一步：當 AI 開始「互相溝通」，你的企業將進化為智慧有機體", year: 2026, date: "Mar 12 2026", iso: "2026-03-12", cats: ["AI 智能"],
      excerpt: "當 AI 代理之間能互相溝通，企業網站將從工具進化為組織的神經系統。" },
    { title: "2026 年 GEO 六大趨勢：掌握 AI 搜尋引擎的流量新密碼", year: 2026, date: "Mar 10 2026", iso: "2026-03-10", cats: ["GEO"], link: "news-post.html",
      excerpt: "點擊率不再是唯一指標：品牌如何讓 AI 在生成答案時第一個想到你。" },
    { title: "傳統客服升級 AI：企業數位轉型「轉虧為盈」的第一步", year: 2026, date: "Feb 19 2026", iso: "2026-02-19", cats: ["AI 智能"],
      excerpt: "客服是離客戶最近的數位節點，也是轉型最能看到成效的起點。" },
    { title: "AI 瀏覽器來襲，企業網站迎來生態重構", year: 2025, date: "Nov 19 2025", iso: "2025-11-19", cats: ["GEO", "AI 智能"],
      excerpt: "當瀏覽器內建 AI 助理，企業官網的角色從被動等待搜尋，轉為主動被理解與引用。" },
    { title: "2026 GEO全攻略：從EEAT到FAQ，提升AI搜尋曝光率的技術關鍵", year: 2026, date: "Jan 15 2026", iso: "2026-01-15", cats: ["GEO"],
      excerpt: "寫得再好，AI 找不到就沒有流量——從 EEAT 到 FAQ 的技術型優化路線。" },
    { title: "AI智能客服時代", year: 2026, date: "Jan 8 2026", iso: "2026-01-08", cats: ["AI 智能"],
      excerpt: "B2B 買家期待即時回應：當業務無法 24 小時待命，對話就是流失的開始。" }
  ];

  var TONES = ["violet", "steel", "amber", "sand", "graphite", "rose"];
  var ALL_TAG = "所有分類";

  /* 分類縮寫：作為封面示意圖的 monogram */
  function catBadge(cats) {
    if (cats.indexOf("GEO") > -1) return "GEO";
    if (cats.indexOf("AI 智能") > -1) return "AI";
    return "WEB";
  }

  /* ------------------------------------------------------------------
     1. 依日期新→舊排序並渲染文章卡片
     ------------------------------------------------------------------ */
  var grid = document.querySelector("[data-filter-grid]");
  var cards = [];

  var sorted = POSTS.slice().sort(function (a, b) {
    return b.iso.localeCompare(a.iso);
  });

  if (grid) {
    sorted.forEach(function (post, i) {
      var tone = TONES[i % TONES.length];
      var catLabel = post.cats[0];

      var article = document.createElement("article");
      article.className = "post-card";
      article.setAttribute("data-reveal", "");
      article.style.setProperty("--reveal-delay", ((i % 3) * 0.07).toFixed(2) + "s");
      article.dataset.tags = post.cats.join("|");
      article.innerHTML =
        '<a class="post-card__link" href="' + (post.link || "#news-browser") + '" aria-label="閱讀文章：' + post.title + '">' +
          '<figure class="post-card__media">' +
            '<span class="post-card__backdrop" data-tone="' + tone + '" aria-hidden="true"></span>' +
            '<span class="post-card__cat" aria-hidden="true">' + catLabel + "</span>" +
            '<span class="post-card__monogram" aria-hidden="true">' + catBadge(post.cats) + "</span>" +
          "</figure>" +
          '<time class="post-card__date" datetime="' + post.iso + '">' + post.date + "</time>" +
          '<h3 class="post-card__title">' + post.title + "</h3>" +
          '<p class="post-card__excerpt">' + post.excerpt + "</p>" +
          '<span class="post-card__more" aria-hidden="true">Read More<svg viewBox="0 0 16 16" focusable="false"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
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
      ? POSTS.length
      : POSTS.filter(function (p) { return p.cats.indexOf(tag) > -1; }).length;
    el.textContent = count;
  });

  /* ------------------------------------------------------------------
     3. 分類篩選
     ------------------------------------------------------------------ */
  var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
  var currentEls = document.querySelectorAll("[data-filter-current], [data-filter-current-static]");
  var countEls = document.querySelectorAll("[data-filter-count], [data-filter-count-static]");
  var emptyState = document.querySelector("[data-filter-empty]");

  function applyFilter(tag) {
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
      void grid.offsetWidth;
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
     5. 精選文章輪播
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
