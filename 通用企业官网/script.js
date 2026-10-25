/* ============================================================
   NORDAX INDUSTRIAL GROUP — Interactions
   Vanilla JS, no dependencies
   ============================================================ */
(function () {
  'use strict';

  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     0. Image fallback — swap broken remote placeholders
        for a reliable generic image once.
  --------------------------------------------------------- */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.dataset.fbDone) return;
      img.dataset.fbDone = '1';
      img.src = img.dataset.fallback;
    });
  });

  /* ---------------------------------------------------------
     1. Header scroll state + back-to-top visibility
  --------------------------------------------------------- */
  var header = document.getElementById('site-header');
  var backToTop = document.getElementById('back-to-top');
  var scrollTick = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 24);
    backToTop.classList.toggle('is-visible', y > 640);
  }

  window.addEventListener('scroll', function () {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(function () {
      onScroll();
      scrollTick = false;
    });
  }, { passive: true });

  backToTop.removeAttribute('hidden');
  onScroll();

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
  });

  /* ---------------------------------------------------------
     2. Mobile menu
  --------------------------------------------------------- */
  var navToggle = document.getElementById('nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileClose = document.getElementById('mobile-close');

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-locked');
    mobileClose.focus();
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-locked');
    navToggle.focus();
  }

  navToggle.addEventListener('click', openMobileMenu);
  mobileClose.addEventListener('click', closeMobileMenu);

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-locked');
    });
  });

  // Mobile accordion
  var accordionToggle = mobileMenu.querySelector('.accordion-toggle');
  var accordionPanel = mobileMenu.querySelector('.accordion-panel');

  accordionToggle.addEventListener('click', function () {
    var open = accordionToggle.getAttribute('aria-expanded') === 'true';
    accordionToggle.setAttribute('aria-expanded', String(!open));
    accordionPanel.style.maxHeight = open ? '0px' : accordionPanel.scrollHeight + 'px';
  });

  /* ---------------------------------------------------------
     3. Mega menu (click / keyboard / outside-click)
  --------------------------------------------------------- */
  var megaItem = document.querySelector('.has-mega');
  var megaBtn = megaItem.querySelector('.nav-link--btn');

  function closeMega() {
    megaItem.classList.remove('is-open');
    megaBtn.setAttribute('aria-expanded', 'false');
  }

  megaBtn.addEventListener('click', function () {
    var open = megaItem.classList.toggle('is-open');
    megaBtn.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', function (e) {
    if (megaItem.classList.contains('is-open') && !megaItem.contains(e.target)) {
      closeMega();
    }
  });

  /* ---------------------------------------------------------
     4. Search panel
  --------------------------------------------------------- */
  var searchToggle = document.getElementById('search-toggle');
  var searchPanel = document.getElementById('search-panel');
  var searchClose = document.getElementById('search-close');
  var searchInput = document.getElementById('site-search');
  var searchForm = document.getElementById('search-form');

  function openSearch() {
    searchPanel.hidden = false;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        searchPanel.classList.add('is-open');
      });
    });
    searchToggle.setAttribute('aria-expanded', 'true');
    searchInput.focus();
  }

  function closeSearch() {
    searchPanel.classList.remove('is-open');
    searchToggle.setAttribute('aria-expanded', 'false');
    window.setTimeout(function () {
      searchPanel.hidden = true;
    }, 300);
  }

  searchToggle.addEventListener('click', function () {
    if (searchPanel.hidden) openSearch();
    else closeSearch();
  });

  searchClose.addEventListener('click', closeSearch);

  /* ---------------------------------------------------------
     5. Language selector
  --------------------------------------------------------- */
  var lang = document.getElementById('lang');
  var langToggle = lang.querySelector('.lang-toggle');
  var langCurrent = lang.querySelector('.lang-current');

  langToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = lang.classList.toggle('is-open');
    langToggle.setAttribute('aria-expanded', String(open));
  });

  lang.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lang.querySelectorAll('[data-lang]').forEach(function (b) {
        b.setAttribute('aria-selected', 'false');
      });
      btn.setAttribute('aria-selected', 'true');
      langCurrent.textContent = btn.dataset.lang;
      lang.classList.remove('is-open');
      langToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------
     6. Escape key + outside click (shared)
  --------------------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (mobileMenu.classList.contains('is-open')) closeMobileMenu();
    closeMega();
    if (!searchPanel.hidden) closeSearch();
    if (lang.classList.contains('is-open')) {
      lang.classList.remove('is-open');
      langToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', function (e) {
    if (lang.classList.contains('is-open') && !lang.contains(e.target)) {
      lang.classList.remove('is-open');
      langToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------------------------------------------------------
     7. Hero slider
  --------------------------------------------------------- */
  (function heroSlider() {
    var root = document.querySelector('.hero');
    if (!root) return;

    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    var dotsWrap = root.querySelector('.hero-dots');
    var counterCurrent = document.getElementById('hero-counter-current');
    var progressBar = document.getElementById('hero-progress-bar');
    var prevBtn = document.getElementById('hero-prev');
    var nextBtn = document.getElementById('hero-next');

    var DURATION = 6500;
    var index = 0;
    var elapsed = 0;
    var lastTs = 0;
    var rafId = null;
    var hovered = false;
    var playing = false;

    var pad = function (n) { return (n < 10 ? '0' : '') + (n + 1); };

    // Build dots
    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.setAttribute('aria-current', 'true');
      dot.addEventListener('click', function () { goTo(i, true); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(i, manual) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (slide, s) {
        var active = s === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach(function (dot, d) {
        dot.classList.toggle('is-active', d === index);
        if (d === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      counterCurrent.textContent = pad(index);
      elapsed = 0;
      if (manual) setPlaying(!hovered && !document.hidden);
    }

    function tick(now) {
      if (!playing) return;
      elapsed += now - lastTs;
      lastTs = now;
      var pct = Math.min(elapsed / DURATION, 1);
      progressBar.style.width = (pct * 100) + '%';
      if (elapsed >= DURATION) {
        goTo(index + 1);
        if (playing) {
          lastTs = performance.now();
          rafId = requestAnimationFrame(tick);
        }
        return;
      }
      rafId = requestAnimationFrame(tick);
    }

    function setPlaying(on) {
      var should = on && !REDUCED_MOTION;
      if (should === playing) return;
      playing = should;
      if (playing) {
        lastTs = performance.now();
        rafId = requestAnimationFrame(tick);
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    prevBtn.addEventListener('click', function () { goTo(index - 1, true); });
    nextBtn.addEventListener('click', function () { goTo(index + 1, true); });

    root.addEventListener('mouseenter', function () { hovered = true; setPlaying(false); });
    root.addEventListener('mouseleave', function () { hovered = false; setPlaying(true); });
    root.addEventListener('focusin', function () { setPlaying(false); });
    root.addEventListener('focusout', function (e) {
      if (!root.contains(e.relatedTarget)) setPlaying(true);
    });

    document.addEventListener('visibilitychange', function () {
      setPlaying(!document.hidden && !hovered);
    });

    // Touch / pointer swipe
    var startX = 0, startY = 0, swiping = false;
    root.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button')) return;
      swiping = true;
      startX = e.clientX;
      startY = e.clientY;
    });
    root.addEventListener('pointerup', function (e) {
      if (!swiping) return;
      swiping = false;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
        goTo(index + (dx < 0 ? 1 : -1), true);
      }
    });

    // Keyboard arrows (only when hero is on screen and no control focused)
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.target.closest('input, textarea, select, .carousel-track')) return;
      var rect = root.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      if (e.key === 'ArrowRight') goTo(index + 1, true);
      else goTo(index - 1, true);
    });

    // Init
    slides.forEach(function (slide, s) {
      slide.setAttribute('aria-hidden', String(s !== 0));
    });
    if (REDUCED_MOTION) {
      progressBar.style.width = '100%';
    } else {
      setPlaying(true);
    }
  })();

  /* ---------------------------------------------------------
     8. Horizontal sliders (categories / showcase)
        Snap-point paging + mouse drag + touch swipe
  --------------------------------------------------------- */
  ['cat-carousel', 'showcase-carousel'].forEach(function (id) {
    var root = document.getElementById(id);
    if (!root) return;
    var track = root.querySelector('.carousel-track');
    var prev = document.querySelector('[data-carousel-prev="' + id + '"]');
    var next = document.querySelector('[data-carousel-next="' + id + '"]');
    if (!track || !prev || !next) return;

    function maxScroll() {
      return track.scrollWidth - track.clientWidth;
    }

    // scroll offsets at which each card aligns with the snap port
    function snapPositions() {
      var base = track.getBoundingClientRect().left;
      return Array.prototype.map.call(track.children, function (li) {
        return li.getBoundingClientRect().left - base + track.scrollLeft;
      });
    }

    function goTo(pos) {
      var clamped = Math.max(0, Math.min(pos, maxScroll()));
      track.scrollTo({ left: clamped, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
    }

    prev.addEventListener('click', function () {
      var cur = track.scrollLeft;
      var behind = snapPositions().filter(function (p) { return p < cur - 8; });
      goTo(behind.length ? behind[behind.length - 1] : 0);
    });

    next.addEventListener('click', function () {
      var cur = track.scrollLeft;
      var ahead = snapPositions().filter(function (p) { return p > cur + 8; });
      if (ahead.length) goTo(ahead[0]);
    });

    function update() {
      prev.toggleAttribute('disabled', track.scrollLeft <= 4);
      next.toggleAttribute('disabled', track.scrollLeft >= maxScroll() - 4);
    }
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();

    // --- mouse drag to scroll (touch already scrolls natively) ---
    var dragging = false;
    var moved = false;
    var pointerId = null;
    var startX = 0;
    var startLeft = 0;

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      moved = false;
      pointerId = e.pointerId;
      startX = e.clientX;
      startLeft = track.scrollLeft;
    });

    track.addEventListener('pointermove', function (e) {
      if (!dragging || e.pointerId !== pointerId) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        track.classList.add('is-dragging');
        // capture only once a real drag starts — capturing earlier would
        // retarget clicks and break the card links
        try { track.setPointerCapture(pointerId); } catch (err) { /* noop */ }
      }
      if (moved) track.scrollLeft = startLeft - dx;
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      if (!moved) return;
      // settle onto the nearest snap point, then re-enable CSS snapping
      var cur = track.scrollLeft;
      var nearest = snapPositions().reduce(function (best, p) {
        return Math.abs(p - cur) < Math.abs(best - cur) ? p : best;
      }, 0);
      goTo(nearest);
      window.setTimeout(function () {
        track.classList.remove('is-dragging');
      }, REDUCED_MOTION ? 0 : 450);
    }

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', function () {
      if (dragging && !moved) dragging = false;
    });

    // a drag must not trigger the link underneath the pointer
    track.addEventListener('click', function (e) {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    }, true);
  });

  /* ---------------------------------------------------------
     9. Scroll reveal (IntersectionObserver)
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !REDUCED_MOTION) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.dataset.delay || '0', 10);
        if (delay) {
          el.style.transitionDelay = delay + 'ms';
          window.setTimeout(function () { el.style.transitionDelay = ''; }, delay + 900);
        }
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------
     10. Animated counters
  --------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');

  function formatValue(value, el) {
    var out = String(value);
    if (el.dataset.format === 'comma') {
      out = value.toLocaleString('en-US');
    }
    return out + (el.dataset.suffix || '');
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.count, 10) || 0;
    if (REDUCED_MOTION) {
      el.textContent = formatValue(target, el);
      return;
    }
    var duration = 1800;
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatValue(Math.round(target * eased), el);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = formatValue(parseInt(el.dataset.count, 10) || 0, el);
    });
  }

  /* ---------------------------------------------------------
     11. Scrollspy — active nav link
  --------------------------------------------------------- */
  var spyLinks = document.querySelectorAll('.nav-link[data-spy]');
  var spySections = ['home', 'about', 'categories', 'capabilities', 'news', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function setSpy(id) {
    spyLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.dataset.spy === id);
    });
  }

  if ('IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setSpy(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    spySections.forEach(function (section) { spyObserver.observe(section); });
  }

  /* ---------------------------------------------------------
     12. Contact form
  --------------------------------------------------------- */
  var form = document.getElementById('inquiry-form');
  var success = document.getElementById('form-success');
  var submitBtn = document.getElementById('form-submit');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;
      form.querySelectorAll('input, textarea, select').forEach(function (field) {
        field.removeAttribute('aria-invalid');
        if (field.willValidate !== undefined && !field.checkValidity()) {
          field.setAttribute('aria-invalid', 'true');
          if (valid) field.focus();
          valid = false;
        }
      });

      if (!valid) {
        form.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      window.setTimeout(function () {
        form.hidden = true;
        success.hidden = false;
        success.setAttribute('tabindex', '-1');
        success.focus();
      }, 900);
    });

    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.removeAttribute('aria-invalid');
      });
    });
  }

  /* ---------------------------------------------------------
     13. Footer year
  --------------------------------------------------------- */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* =========================================================
     PART 2 — INNER PAGES
     ========================================================= */

  /* ---------------------------------------------------------
     14. Chip filter helper (products / news / gallery)
  --------------------------------------------------------- */
  function initChipFilter(options) {
    var chips = Array.prototype.slice.call(document.querySelectorAll(options.chips + ' .chip'));
    if (!chips.length) return null;
    var items = Array.prototype.slice.call(document.querySelectorAll(options.items));
    var countEl = options.count ? document.getElementById(options.count) : null;
    var emptyEl = options.empty ? document.getElementById(options.empty) : null;
    var total = items.length;
    var label = options.label || 'items';

    function apply() {
      var active = document.querySelector(options.chips + ' .chip.is-active');
      var cat = active ? active.dataset.filter : 'all';
      var visible = 0;
      items.forEach(function (item) {
        var show = cat === 'all' || item.dataset.cat === cat;
        item.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });
      if (countEl) countEl.textContent = 'Showing ' + visible + ' of ' + total + ' ' + label;
      if (emptyEl) emptyEl.classList.toggle('is-visible', visible === 0);
      if (options.onChange) options.onChange();
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        apply();
      });
    });

    return {
      preset: function (value) {
        var target = chips.filter(function (c) { return c.dataset.filter === value; })[0];
        if (!target) return false;
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        target.classList.add('is-active');
        apply();
        return true;
      },
      apply: apply,
      count: function () {
        return items.filter(function (i) { return !i.classList.contains('is-hidden'); }).length;
      }
    };
  }

  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ---------------------------------------------------------
     15. Products archive — category chips + search + sort
  --------------------------------------------------------- */
  (function () {
    var grid = document.getElementById('product-grid');
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.product-card'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('.filter-chips .chip'));
    var sortSel = document.getElementById('sort-select');
    var searchIn = document.getElementById('catalog-search');
    var countEl = document.getElementById('result-count');
    var emptyEl = document.getElementById('catalog-empty');
    var cat = 'all';

    function apply() {
      var q = (searchIn && searchIn.value ? searchIn.value : '').trim().toLowerCase();
      var mode = sortSel ? sortSel.value : 'featured';
      var visible = [];

      cards.forEach(function (card) {
        var okCat = cat === 'all' || card.dataset.cat === cat;
        var hay = (card.dataset.name + ' ' + card.dataset.sku).toLowerCase();
        var okQ = q === '' || hay.indexOf(q) !== -1;
        var show = okCat && okQ;
        card.classList.toggle('is-hidden', !show);
        if (show) visible.push(card);
      });

      if (mode !== 'featured') {
        visible.sort(function (a, b) {
          var A = a.dataset.name.toLowerCase();
          var B = b.dataset.name.toLowerCase();
          return mode === 'name-az' ? A.localeCompare(B) : B.localeCompare(A);
        });
        visible.forEach(function (c) { grid.appendChild(c); });
      }

      if (countEl) countEl.textContent = 'Showing ' + visible.length + ' of ' + cards.length + ' products';
      if (emptyEl) emptyEl.classList.toggle('is-visible', visible.length === 0);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        cat = chip.dataset.filter;
        apply();
      });
    });

    if (sortSel) sortSel.addEventListener('change', apply);
    if (searchIn) searchIn.addEventListener('input', apply);

    var preset = new URLSearchParams(window.location.search).get('cat');
    if (preset) {
      var target = chips.filter(function (c) { return c.dataset.filter === preset; })[0];
      if (target) {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        target.classList.add('is-active');
        cat = preset;
      }
    }
    apply();
  })();

  /* ---------------------------------------------------------
     16. News list — category chips
  --------------------------------------------------------- */
  initChipFilter({
    chips: '.news-filter .filter-chips',
    items: '.news-item',
    count: 'news-count',
    empty: 'news-empty',
    label: 'articles'
  });

  /* ---------------------------------------------------------
     17. Product detail — thumbnail gallery + tabs
  --------------------------------------------------------- */
  (function () {
    var mainImg = document.getElementById('pd-main-img');
    var thumbs = document.querySelectorAll('.pd-thumb');

    if (mainImg && thumbs.length) {
      Array.prototype.forEach.call(thumbs, function (thumb) {
        thumb.addEventListener('click', function () {
          Array.prototype.forEach.call(thumbs, function (t) { t.classList.remove('is-active'); });
          thumb.classList.add('is-active');
          mainImg.src = thumb.dataset.src;
          mainImg.alt = thumb.dataset.alt || mainImg.alt;
        });
      });
    }

    var tabs = document.querySelectorAll('.pd-tab');
    if (tabs.length) {
      Array.prototype.forEach.call(tabs, function (tab) {
        tab.addEventListener('click', function () {
          Array.prototype.forEach.call(tabs, function (t) {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
          document.querySelectorAll('.pd-panel').forEach(function (panel) {
            panel.hidden = panel.id !== tab.dataset.tab;
          });
        });
      });
    }
  })();

  /* ---------------------------------------------------------
     18. Gallery lightbox
  --------------------------------------------------------- */
  (function () {
    var lb = document.getElementById('lightbox');
    if (!lb) return;

    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
    var lbImg = document.getElementById('lb-img');
    var lbCap = document.getElementById('lb-cap');
    var lbCount = document.getElementById('lb-count');
    var list = [];
    var current = 0;

    function render() {
      var item = list[current];
      if (!item) return;
      var img = item.querySelector('img');
      lbImg.src = item.dataset.full || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = item.dataset.caption || '';
      lbCount.textContent = pad2(current + 1) + ' / ' + pad2(list.length);
    }

    function open(index) {
      list = items.filter(function (i) { return !i.classList.contains('is-hidden'); });
      if (!list.length) return;
      current = Math.max(0, Math.min(index, list.length - 1));
      render();
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-locked');
      document.getElementById('lb-close').focus();
    }

    function close() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-locked');
    }

    function step(dir) {
      current = (current + dir + list.length) % list.length;
      render();
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var visible = items.filter(function (i) { return !i.classList.contains('is-hidden'); });
        open(visible.indexOf(item));
      });
    });

    document.getElementById('lb-close').addEventListener('click', close);
    document.getElementById('lb-prev').addEventListener('click', function () { step(-1); });
    document.getElementById('lb-next').addEventListener('click', function () { step(1); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  })();

  /* ---------------------------------------------------------
     19. Search page — render results from a static index
  --------------------------------------------------------- */
  (function () {
    var resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;

    var INDEX = [
      { type: 'Page', title: 'About NORDAX Industrial Group', url: 'about.html', text: 'Company history, global manufacturing capability, milestones, values and certifications.' },
      { type: 'Page', title: 'Contact Us — Request a Quote', url: 'contact.html', text: 'Sales, technical support and logistics contacts. Send an inquiry and we respond within one business day.' },
      { type: 'Page', title: 'News & Insights', url: 'news.html', text: 'Company updates, industry insights, product announcements and trade fair calendar.' },
      { type: 'Page', title: 'Media Gallery', url: 'gallery.html', text: 'Photos of our production campus, CNC machining, quality labs and distribution centers.' },
      { type: 'Page', title: 'Homepage — Precision Wheel-End Components', url: 'index.html', text: 'Wheel hub assemblies, bearings, CV joints and drivetrain components for the global aftermarket.' },
      { type: 'Product', title: 'Gen-3 Wheel Hub Assembly — NX-512410', url: 'product.html', text: '5 × 114.3 mm bolt pattern, integrated ABS sensor, GCr15 bearing steel, 2-year warranty.' },
      { type: 'Product', title: 'Gen-2 Wheel Hub Assembly — NX-512295', url: 'product.html', text: 'Front axle hub unit with pressed-in bearing for passenger platforms.' },
      { type: 'Product', title: 'Gen-1 Hub Bearing Unit — NX-510076', url: 'product.html', text: 'Double-row angular contact bearing with triple-lip sealing.' },
      { type: 'Product', title: 'Tapered Roller Bearing — NX-32314', url: 'product.html', text: 'High-capacity cone and cup set for truck and trailer axles.' },
      { type: 'Product', title: 'Outer CV Joint — NX-CV-881', url: 'product.html', text: 'Fixed outer joint with 47-degree articulation angle.' },
      { type: 'Product', title: 'Universal Joint — NX-UJ-1310', url: 'product.html', text: '1310 series cross-type joint for commercial vehicle drivelines.' },
      { type: 'Product', title: 'Pillow Block Bearing — NX-UCP208', url: 'product.html', text: 'Cast-housing pillow block unit with set-screw lock for industrial equipment.' },
      { type: 'News', title: 'NORDAX Commissions Third Automated Wheel-End Line in Ningbo', url: 'news-single.html', text: 'The new line adds 2.4 million hub units of annual capacity for European OE programs.' },
      { type: 'News', title: 'What Upcoming IATF Audit Cycles Mean for Aftermarket Distributors', url: 'news-single.html', text: 'Tightened traceability rules will reshape supplier selection through 2027.' },
      { type: 'News', title: 'Meet NORDAX at Automechanika Frankfurt — Hall 8.0, Booth C42', url: 'news-single.html', text: 'Live demonstrations of the Gen-5 hub platform and industrial bearing range.' },
      { type: 'News', title: 'Gen-5 Hub Platform Surpasses 500 Active SKUs', url: 'news.html', text: 'The expanded platform now covers 95% of European and North American passenger applications.' },
      { type: 'News', title: 'Hamburg European Distribution Center Now Fully Operational', url: 'news.html', text: 'The 9,000 square meter facility cuts average EU delivery time to 3-5 days.' }
    ];

    var countEl = document.getElementById('search-count');
    var emptyEl = document.getElementById('search-empty');
    var input = document.getElementById('page-search');
    var form = document.getElementById('page-search-form');

    function esc(s) {
      return s.replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }

    function highlight(text, q) {
      var safe = esc(text);
      if (!q) return safe;
      var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      return safe.replace(re, '<mark>$1</mark>');
    }

    function render(q) {
      var query = (q || '').trim().toLowerCase();
      resultsEl.innerHTML = '';

      var matches;
      if (!query) {
        matches = INDEX.filter(function (e) { return e.type === 'Page'; });
        if (countEl) countEl.textContent = 'Suggested pages — enter a search term to look across ' + INDEX.length + ' pages, products and articles.';
      } else {
        matches = INDEX.filter(function (e) {
          return (e.title + ' ' + e.text + ' ' + e.type).toLowerCase().indexOf(query) !== -1;
        });
        if (countEl) countEl.textContent = matches.length + ' result' + (matches.length === 1 ? '' : 's') + ' for \u201C' + q.trim() + '\u201D';
      }

      if (emptyEl) emptyEl.hidden = !(query !== '' && matches.length === 0);

      matches.forEach(function (entry) {
        var a = document.createElement('a');
        a.className = 'result-item';
        a.href = entry.url;
        a.innerHTML =
          '<span class="result-type">' + esc(entry.type) + '</span>' +
          '<h3>' + highlight(entry.title, query) + '</h3>' +
          '<p>' + highlight(entry.text, query) + '</p>' +
          '<span class="result-url">' + esc(entry.url) + '</span>';
        resultsEl.appendChild(a);
      });
    }

    var q = new URLSearchParams(window.location.search).get('q') || '';
    if (input) input.value = q;
    render(q);

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = input ? input.value : '';
        window.history.replaceState({}, '', 'search.html?q=' + encodeURIComponent(v.trim()));
        render(v);
      });
    }

    document.querySelectorAll('.search-hint [data-q]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var q = btn.dataset.q;
        if (input) input.value = q;
        window.history.replaceState({}, '', 'search.html?q=' + encodeURIComponent(q));
        render(q);
      });
    });
  })();

})();
