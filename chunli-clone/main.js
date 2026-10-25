/* Chunli Tea replica — interaction layer (vanilla JS, written from scratch)
   Every block is guarded so the file works on any page of the replica. */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------------- hero banner slider (home) ---------------- */
  var heroCells = $$("#hero .hero-cell");
  if (heroCells.length) {
    var heroDotsWrap = $("#heroDots");
    var heroIndex = 0;
    var heroTimer = null;

    heroCells.forEach(function (_, i) {
      var dot = document.createElement("span");
      dot.className = "hero-dot" + (i === 0 ? " is-current" : "");
      dot.addEventListener("click", function () { heroGo(i, true); });
      heroDotsWrap.appendChild(dot);
    });
    var heroDots = $$(".hero-dot", heroDotsWrap);

    function heroGo(i, manual) {
      heroIndex = (i + heroCells.length) % heroCells.length;
      heroCells.forEach(function (cell, k) {
        cell.classList.toggle("is-current", k === heroIndex);
        if (k === heroIndex) {
          var img = $("img", cell);
          img.style.animation = "none";
          void img.offsetWidth; // restart the zoom animation
          img.style.animation = "";
        }
      });
      heroDots.forEach(function (dot, k) {
        dot.classList.remove("is-current");
        if (k === heroIndex) {
          void dot.offsetWidth; // restart the fill animation
          dot.classList.add("is-current");
        }
      });
      if (manual) heroRestart();
    }
    function heroRestart() {
      clearInterval(heroTimer);
      heroTimer = setInterval(function () { heroGo(heroIndex + 1); }, 6000);
    }
    $("#heroPrev").addEventListener("click", function () { heroGo(heroIndex - 1, true); });
    $("#heroNext").addEventListener("click", function () { heroGo(heroIndex + 1, true); });
    heroRestart();
  }

  /* ---------------- company intro slider (home) ---------------- */
  var introPanes = $$("#introStage .intro-pane");
  if (introPanes.length) {
    var introRings = $$("#introStage .ring-cell");
    var introIndex = 0;
    var introTimer = setInterval(function () { introGo(introIndex + 1); }, 7000);

    function introGo(i) {
      introIndex = (i + introPanes.length) % introPanes.length;
      introPanes.forEach(function (pane, k) { pane.classList.toggle("is-current", k === introIndex); });
      introRings.forEach(function (ring, k) { ring.classList.toggle("is-current", k === introIndex); });
    }
    introRings.forEach(function (ring, k) {
      ring.addEventListener("click", function () {
        introGo(k);
        clearInterval(introTimer);
        introTimer = setInterval(function () { introGo(introIndex + 1); }, 7000);
      });
    });
    $("#stagePrev").addEventListener("click", function () { introGo(introIndex - 1); });
    $("#stageNext").addEventListener("click", function () { introGo(introIndex + 1); });
  }

  /* ---------------- video showcase carousel (home) ---------------- */
  var showCards = $$("#showcaseRail .show-card");
  if (showCards.length) {
    var showIndex = 1;

    // reorder with flex `order` so the active card sits in the middle; CSS scales it up
    function showGo(i) {
      showIndex = (i + showCards.length) % showCards.length;
      var n = showCards.length;
      showCards.forEach(function (card, k) {
        var rel = (k - showIndex + n) % n;              // 0 = active, grows clockwise
        card.style.order = rel < n / 2 ? rel : rel - n; // place active at center
        card.classList.toggle("is-current", k === showIndex);
      });
    }
    $("#railPrev").addEventListener("click", function () { showGo(showIndex - 1); });
    $("#railNext").addEventListener("click", function () { showGo(showIndex + 1); });
    showGo(1);
  }

  /* ---------------- click-to-play videos ---------------- */
  $$(".video-frame").forEach(function (frame) {
    frame.addEventListener("click", function () {
      if ($("iframe", frame)) return;
      var id = frame.getAttribute("data-videoid");
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      iframe.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
      var badge = $(".play-badge", frame);
      if (badge) badge.style.display = "none";
    });
  });

  /* ---------------- news feed accordion (home) ---------------- */
  $$("#journalFeed .feed-row").forEach(function (row) {
    row.addEventListener("click", function (e) {
      if (e.target.closest("a")) return; // let real links work
      $$("#journalFeed .feed-row").forEach(function (r) { r.classList.remove("is-open"); });
      row.classList.add("is-open");
    });
  });

  /* ---------------- garden tabs (home) ---------------- */
  $$("#gardenTabs li").forEach(function (tab) {
    tab.addEventListener("click", function () {
      $$("#gardenTabs li").forEach(function (t) { t.classList.remove("is-active"); });
      tab.classList.add("is-active");
    });
  });

  /* ---------------- product gallery (detail page) ---------------- */
  var galleryCells = $$(".gallery-strip .gallery-cell");
  if (galleryCells.length) {
    var stageImg = $("#stageShot");
    var countNow = $(".gallery-count .count-now");
    var galleryIdx = 0;

    function galleryShow(i) {
      galleryIdx = (i + galleryCells.length) % galleryCells.length;
      galleryCells.forEach(function (cell, k) { cell.classList.toggle("is-cur", k === galleryIdx); });
      var src = $("img", galleryCells[galleryIdx]).getAttribute("src");
      if (stageImg && src) stageImg.setAttribute("src", src);
      if (countNow) countNow.textContent = galleryIdx + 1;
    }
    galleryCells.forEach(function (cell, k) {
      cell.addEventListener("click", function () { galleryShow(k); });
    });
    $(".g-prev").addEventListener("click", function () { galleryShow(galleryIdx - 1); });
    $(".g-next").addEventListener("click", function () { galleryShow(galleryIdx + 1); });
  }

  /* ---------------- detail tabs (detail page) ---------------- */
  var detailTabs = $$("#detailTabs .detail-tab");
  if (detailTabs.length) {
    var panels = $$(".tab-panel");
    detailTabs.forEach(function (tab, k) {
      tab.addEventListener("click", function () {
        detailTabs.forEach(function (t) { t.classList.toggle("is-open", t === tab); });
        panels.forEach(function (p, j) { p.classList.toggle("is-open", j === k); });
      });
    });
  }

  /* ---------------- send-inquiry shortcut (detail + news pages) ---------------- */
  var sendBtn = $(".action-btn.send");
  if (sendBtn) {
    sendBtn.addEventListener("click", function () {
      var target = $("#toInquiry");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }
  var msgBtn = $(".meta-msg");
  if (msgBtn) {
    msgBtn.addEventListener("click", function () {
      var target = $("#toInquiry");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---------------- FAQ accordion (faq page) ---------------- */
  var faqItems = $$("#faqList .faq-item");
  if (faqItems.length) {
    faqItems.forEach(function (item) {
      $(".faq-q", item).addEventListener("click", function () {
        var opening = !item.classList.contains("is-open");
        faqItems.forEach(function (o) { o.classList.remove("is-open"); });
        if (opening) item.classList.add("is-open");
      });
    });
  }

  /* ---------------- language picker ---------------- */
  var langPicker = $("#langPicker");
  if (langPicker) {
    $(".lang-current", langPicker).addEventListener("click", function (e) {
      e.stopPropagation();
      langPicker.classList.toggle("open");
    });
    document.addEventListener("click", function (e) {
      if (!langPicker.contains(e.target)) langPicker.classList.remove("open");
    });
  }

  /* ---------------- search popup ---------------- */
  var navSearch = $("#navSearch");
  if (navSearch) {
    $(".search-toggle", navSearch).addEventListener("click", function (e) {
      e.stopPropagation();
      $(".search-pop", navSearch).classList.toggle("open");
    });
    document.addEventListener("click", function (e) {
      if (!navSearch.contains(e.target)) $(".search-pop", navSearch).classList.remove("open");
    });
  }

  /* ---------------- mobile drawer ---------------- */
  var burger = $("#burger");
  var primaryNav = $("#primaryNav");
  if (burger && primaryNav) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("open");
      primaryNav.classList.toggle("open");
    });
    // tap a parent item once to expand its submenu on mobile
    $$(".nav-item.has-drop > a", primaryNav).forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (!burger.classList.contains("open")) return; // desktop: normal link
        var li = link.parentElement;
        if (!li.classList.contains("expanded")) {
          e.preventDefault();
          $$(".nav-item.expanded", primaryNav).forEach(function (o) { o.classList.remove("expanded"); });
          li.classList.add("expanded");
        }
      });
    });
  }

  /* ---------------- sticky header + back to top ---------------- */
  var siteHead = $("#siteHead");
  var toTop = $("#toTop");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (siteHead) siteHead.classList.toggle("is-stuck", y > 140);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  var tabTop = $(".tab-top");
  if (tabTop) tabTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------------- scroll reveal ---------------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$("[data-reveal]").forEach(function (el) { io.observe(el); });
  } else {
    $$("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
  }
})();
