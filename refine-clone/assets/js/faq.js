/* ==========================================================================
   Refine Lab — 結構重寫版：常見問題頁
   原創 vanilla JS：分類篩選、計數、篩選面板開合
   （手風琴展開由 main.js 處理）
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var items = Array.prototype.slice.call(document.querySelectorAll("[data-faq-list] .faq-item"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
  var currentEls = document.querySelectorAll("[data-filter-current], [data-filter-current-static]");
  var countEls = document.querySelectorAll("[data-filter-count], [data-filter-count-static]");
  var emptyState = document.querySelector("[data-filter-empty]");
  var list = document.querySelector("[data-faq-list]");
  var ALL_TAG = "全部問題";

  /* 1. 分類計數 */
  chips.forEach(function (chip) {
    var tag = chip.dataset.tag;
    var count = tag === ALL_TAG
      ? items.length
      : items.filter(function (item) {
          var cats = (item.dataset.cats || "").split("|");
          return cats.indexOf(tag) > -1;
        }).length;
    var countEl = chip.querySelector(".filter-chip__count");
    if (countEl) countEl.textContent = count;
  });

  /* 2. 分類篩選 */
  function applyFilter(tag) {
    var visible = 0;

    items.forEach(function (item) {
      var cats = (item.dataset.cats || "").split("|");
      var show = tag === ALL_TAG || cats.indexOf(tag) > -1;
      item.hidden = !show;
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

    if (list && !reduceMotion) {
      list.classList.remove("is-animating");
      void list.offsetWidth;
      list.classList.add("is-animating");
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

  /* 3. 篩選面板開合 */
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
})();
