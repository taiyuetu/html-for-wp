/* ==========================================================================
   EVERLEAF TEA INDUSTRIAL GROUP — UI BEHAVIOUR
   Vanilla JS only. Modules:
   01. Shared: header state, mobile nav, reveal, counters, scroll spy,
       back-to-top, inquiry form, footer year
   02. Inner pages: active nav key, filterable collections, lightbox,
       product thumbnail swap, client-side search
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ========================================================================
     01 · SHARED
     ======================================================================== */

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('site-header');

  function onHeaderScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('primary-nav');
  var navLinks = nav.querySelectorAll('.nav__link');

  function closeNav() {
    header.classList.remove('nav-open');
    document.body.classList.remove('nav-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    closeSubmenus();
    closeHsearch();
  }

  navToggle.addEventListener('click', function () {
    var open = header.classList.toggle('nav-open');
    document.body.classList.toggle('nav-open', open);
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  Array.prototype.forEach.call(navLinks, function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) closeNav();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) closeNav();
  });

  /* ---------- Header search dropdown ---------- */
  var hsearch = document.getElementById('header-search');

  function closeHsearch() {
    if (!hsearch) return;
    hsearch.classList.remove('is-open');
    var btn = hsearch.querySelector('.hsearch__btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function openHsearch() {
    if (!hsearch) return;
    hsearch.classList.add('is-open');
    var btn = hsearch.querySelector('.hsearch__btn');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    var input = document.getElementById('hs-input');
    if (input) window.setTimeout(function () { input.focus(); }, 150);
  }

  if (hsearch) {
    var hsBtn = hsearch.querySelector('.hsearch__btn');
    hsBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = hsearch.classList.toggle('is-open');
      hsBtn.setAttribute('aria-expanded', String(open));
      if (open) openHsearch();
    });

    document.addEventListener('click', function (e) {
      if (hsearch.classList.contains('is-open') && !hsearch.contains(e.target)) closeHsearch();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeHsearch();
    });
  }

  /* ---------- Nav submenus: mobile accordion + Escape on desktop ---------- */
  var submenuItems = $all('.nav__item.has-drop, .nav__item.has-mega');

  function closeSubmenus() {
    Array.prototype.forEach.call(submenuItems, function (li) {
      li.classList.remove('is-open');
      var btn = li.querySelector('.nav__subbtn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  Array.prototype.forEach.call(submenuItems, function (li) {
    var btn = li.querySelector('.nav__subbtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = li.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  Array.prototype.forEach.call($all('.drop a, .mega a'), function (link) {
    link.addEventListener('click', closeNav);
  });

  /* "Search the Site" menu item: open the header search panel in place */
  Array.prototype.forEach.call($all('[data-action="open-search"]'), function (el) {
    el.addEventListener('click', function (e) {
      if (!hsearch) return; /* no panel: fall through to search.html */
      e.preventDefault();
      e.stopPropagation(); /* keep the outside-click closer from re-closing the panel */
      closeNav();
      openHsearch();
    });
  });

  /* ---------- Static active nav key (inner pages set body[data-nav]) ---------- */
  var navKey = document.body.getAttribute('data-nav');
  if (navKey) {
    $all('.nav__link[data-navkey="' + navKey + '"]').forEach(function (link) {
      link.classList.add('is-active');
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    $all('.reveal').forEach(function (el) { el.classList.add('in-view'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          if (delay) el.style.transitionDelay = delay + 'ms';
          el.classList.add('in-view');
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(revealEls, function (el) { revealObserver.observe(el); });
  }

  /* ---------- Animated metric counters ---------- */
  var counters = document.querySelectorAll('.metric__num[data-count]');

  function renderCounter(el, value, suffix) {
    el.textContent = value.toLocaleString('en-US') + (suffix || '');
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (prefersReducedMotion) { renderCounter(el, target, suffix); return; }

    var duration = 1600;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* easeOutCubic */
      renderCounter(el, Math.round(eased * target), suffix);
      if (progress < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    Array.prototype.forEach.call(counters, function (el) { counterObserver.observe(el); });
  } else {
    Array.prototype.forEach.call(counters, function (el) {
      renderCounter(el, parseInt(el.getAttribute('data-count'), 10) || 0, el.getAttribute('data-suffix'));
    });
  }

  /* ---------- Active nav link tracking (homepage sections only) ---------- */
  var trackedLinks = Array.prototype.slice.call(nav.querySelectorAll('.nav__link[href^="#"]'));
  var trackedSections = trackedLinks
    .map(function (link) { return document.querySelector(link.hash); })
    .filter(Boolean);

  function updateActiveLink() {
    if (document.body.hasAttribute('data-nav')) return;

    var marker = window.scrollY + header.offsetHeight + 100;
    var currentId = '';

    trackedSections.forEach(function (section) {
      if (section.offsetTop <= marker) currentId = section.id;
    });

    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
      currentId = trackedSections[trackedSections.length - 1].id;
    }

    trackedLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.hash === '#' + currentId);
    });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById('to-top');

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Shared scroll handler (rAF throttled) ---------- */
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onHeaderScroll();
        updateActiveLink();
        toTop.classList.toggle('is-visible', window.scrollY > 600);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Inquiry form validation ---------- */
  var form = document.getElementById('inquiry-form');
  var success = document.getElementById('form-success');
  var resetBtn = document.getElementById('form-reset');

  var validators = {
    name: function (v) { return v.trim().length >= 2; },
    company: function (v) { return v.trim().length >= 2; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    country: function (v) { return v.trim().length >= 2; },
    message: function (v) { return v.trim().length >= 10; }
  };

  function setFieldState(input, valid) {
    var field = input.closest('.field');
    var error = field.querySelector('.field__error');
    field.classList.toggle('is-invalid', !valid);
    input.setAttribute('aria-invalid', String(!valid));
    if (error) error.hidden = valid;
  }

  function validateField(input) {
    var check = validators[input.name];
    if (!check) return true;
    var valid = check(input.value);
    setFieldState(input, valid);
    return valid;
  }

  if (form) {
    var requiredInputs = form.querySelectorAll('input[required], textarea[required]');

    Array.prototype.forEach.call(requiredInputs, function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('is-invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var allValid = true;
      var firstInvalid = null;

      Array.prototype.forEach.call(requiredInputs, function (input) {
        var valid = validateField(input);
        if (!valid && !firstInvalid) firstInvalid = input;
        allValid = allValid && valid;
      });

      if (!allValid) {
        firstInvalid.focus();
        return;
      }

      /* No backend in this build — acknowledge and reset. */
      form.hidden = true;
      success.hidden = false;
      success.focus();
      success.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    });

    resetBtn.addEventListener('click', function () {
      form.reset();
      Array.prototype.forEach.call(requiredInputs, function (input) { setFieldState(input, true); });
      success.hidden = true;
      form.hidden = false;
      form.querySelector('input').focus();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ========================================================================
     02 · INNER PAGES
     ======================================================================== */

  /* ---------- Filterable collections (products / news / gallery) ----------
     Container: [data-filter-group][data-scope="#selector"] holds the chips.
     Items inside the scope carry [data-category].
     Optional live counter: [data-count-label][data-template="Showing {n} of {t} …"] */
  $all('[data-filter-group]').forEach(function (group) {
    var scope = group.getAttribute('data-scope');
    var scopeEl = scope ? document.querySelector(scope) : document;
    if (!scopeEl) return;

    var chips = $all('[data-filter]', group);
    var items = $all('[data-category]', scopeEl);
    var countEl = $('[data-count-label]');
    var template = countEl ? countEl.getAttribute('data-template') : '';

    /* Fill static count badges (sidebar family list) */
    chips.forEach(function (chip) {
      var badge = chip.querySelector('[data-count]');
      var f = chip.getAttribute('data-filter');
      if (!badge || !f) return;
      var n = f === 'all'
        ? items.length
        : items.filter(function (item) {
            return (item.getAttribute('data-category') || '').split(/\s+/).indexOf(f) !== -1;
          }).length;
      badge.textContent = String(n);
    });

    function apply(filter) {
      chips.forEach(function (chip) {
        chip.classList.toggle('is-active', chip.getAttribute('data-filter') === filter);
        chip.setAttribute('aria-pressed', String(chip.getAttribute('data-filter') === filter));
      });

      var shown = 0;
      items.forEach(function (item) {
        var cats = (item.getAttribute('data-category') || '').split(/\s+/);
        var match = filter === 'all' || cats.indexOf(filter) !== -1;
        item.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });

      if (countEl && template) {
        countEl.textContent = template.replace('{n}', String(shown)).replace('{t}', String(items.length));
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        apply(chip.getAttribute('data-filter'));
      });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var gallery = $('[data-lightbox]');
  var lightbox = document.getElementById('lightbox');

  if (gallery && lightbox) {
    var stageSlot = $('.lightbox__stage', lightbox);
    var captionEl = $('.lightbox__caption', lightbox);
    var counterEl = $('.lightbox__counter', lightbox);
    var btnClose = $('.lightbox__close', lightbox);
    var btnPrev = $('.lightbox__nav--prev', lightbox);
    var btnNext = $('.lightbox__nav--next', lightbox);

    var lbItems = [];
    var lbIndex = 0;
    var lbLastFocus = null;

    function visibleItems() {
      return $all('.gitem:not(.is-hidden)', gallery);
    }

    function lightboxRender() {
      var item = lbItems[lbIndex];
      var ph = item.querySelector('.ph');
      if (!ph) return;

      var stale = stageSlot.querySelector('.ph');
      if (stale) stale.remove();

      var clone = ph.cloneNode(true);
      clone.removeAttribute('role');
      clone.setAttribute('aria-hidden', 'true');
      stageSlot.appendChild(clone);

      captionEl.textContent = item.getAttribute('data-caption') || '';
      counterEl.textContent = (lbIndex + 1) + ' / ' + lbItems.length;
    }

    function lightboxOpen(item) {
      lbItems = visibleItems();
      lbIndex = lbItems.indexOf(item);
      if (lbIndex < 0) return;

      lbLastFocus = document.activeElement;
      lightboxRender();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      btnClose.focus();
      document.addEventListener('keydown', lightboxOnKey);
    }

    function lightboxClose() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      document.removeEventListener('keydown', lightboxOnKey);
      if (lbLastFocus && lbLastFocus.focus) lbLastFocus.focus();
    }

    function lightboxStep(delta) {
      lbIndex = (lbIndex + delta + lbItems.length) % lbItems.length;
      lightboxRender();
    }

    function lightboxOnKey(e) {
      if (e.key === 'Escape') lightboxClose();
      else if (e.key === 'ArrowLeft') lightboxStep(-1);
      else if (e.key === 'ArrowRight') lightboxStep(1);
    }

    gallery.addEventListener('click', function (e) {
      var item = e.target.closest('.gitem');
      if (item) lightboxOpen(item);
    });

    btnClose.addEventListener('click', lightboxClose);
    btnPrev.addEventListener('click', function () { lightboxStep(-1); });
    btnNext.addEventListener('click', function () { lightboxStep(1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightboxClose();
    });
  }

  /* ---------- Single product: thumbnail swap ---------- */
  var pswap = $('[data-thumbs]');
  if (pswap) {
    var mainPh = $('.psingle__main .ph', pswap);
    var thumbBtns = $all('.psingle__thumbs button', pswap);
    var variants = ['ph--green', 'ph--slate', 'ph--beige', 'ph--dark'];

    thumbBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var srcPh = btn.querySelector('.ph');
        if (!srcPh || !mainPh) return;

        function swapSel(sel, attr) {
          var src = srcPh.querySelector(sel);
          var dst = mainPh.querySelector(sel);
          if (src && dst) dst.setAttribute(attr, src.getAttribute(attr));
        }

        var srcLabel = srcPh.querySelector('.ph__label');
        var dstLabel = mainPh.querySelector('.ph__label');
        if (srcLabel && dstLabel) dstLabel.textContent = srcLabel.textContent;

        var srcFig = srcPh.querySelector('.ph__fig');
        var dstFig = mainPh.querySelector('.ph__fig');
        if (srcFig && dstFig) dstFig.textContent = srcFig.textContent;

        swapSel('use', 'href');

        variants.forEach(function (v) { mainPh.classList.remove(v); });
        variants.forEach(function (v) { if (srcPh.classList.contains(v)) mainPh.classList.add(v); });

        thumbBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      });
    });
  }

  /* ---------- Client-side search (search page) ---------- */
  var searchApp = document.getElementById('search-app');

  if (searchApp) {
    var SITE_INDEX = [
      { title: 'Everleaf Tea Group — Home', tz: 'Everleaf茶业集团 — 首页', url: 'index.html', type: 'page', excerpt: 'Premium Chinese green tea manufacturer and global export partner. Chunmee, Gunpowder and organic green tea in bulk — OEM support and EU-compliant quality systems.', ez: '优质中国绿茶制造商与全球出口合作伙伴。批量供应珍眉、珠茶与有机绿茶，提供OEM支持与符合欧盟标准的质量体系。' },
      { title: 'Product Catalogue', tz: '产品目录', url: 'products.html', type: 'page', excerpt: 'Twelve commercial grades across six tea families: pan-fired green, rolled green, organic, scented, orthodox black and tea-bag grade. Specifications and packing for every lot.', ez: '六大茶类、十二个商业等级：炒青绿茶、珠形绿茶、有机茶、窨花茶、传统红茶与袋泡茶级，逐批提供规格与包装。' },
      { title: 'About Us — At Origin Since 1987', tz: '关于我们 — 自1987年扎根产地', url: 'about.html', type: 'page', excerpt: 'Thirty-eight years of tea manufacturing in Huangshan, Anhui. Two processing bases, 120 staff and long-term partnerships with importers in 62 countries.', ez: '扎根黄山三十八年的绿茶制造企业。两大加工基地、120名员工，与62个国家的进口商长期合作。' },
      { title: 'Contact & Inquiry', tz: '联系与询盘', url: 'contact.html', type: 'page', excerpt: 'Request a quotation or sample programme. Export sales desk replies within 24 hours with pricing, samples and documentation.', ez: '获取报价或样品方案。出口销售部24小时内回复价格、样品与文件。' },
      { title: 'Image Library', tz: '图片资料库', url: 'gallery.html', type: 'page', excerpt: 'Origin, facility, process, quality and packaging photography for buyer presentations and private-label briefing packs.', ez: '产地、工厂、工艺、品质与包装摄影，用于买家演示与贴牌简报。' },
      { title: 'Chunmee Green Tea 41022', tz: '珍眉绿茶 41022', url: 'chunmee-green-tea.html', type: 'product', excerpt: 'Grades 41022AAA–C, 9371, 3008, 8147. Tight eyebrow leaf, brisk clean cup, moisture ≤ 6.0%. Kraft bags 25–30 kg, MOQ from 500 kg, CIF/FOB Ningbo.', ez: '等级41022AAA–C、9371、3008、8147。眉形紧结，滋味浓爽，水分≤6.0%。25–30公斤牛皮纸袋，MOQ低至500公斤，FOB/CIF宁波。' },
      { title: 'Gunpowder Green Tea 3505', tz: '珠茶绿茶 3505', url: 'products.html', type: 'product', excerpt: 'Dense temple-ball roll, grades 3505, 9372, 9475, 9575. High bulk density and transit stability for Moroccan mint-tea blends.', ez: '颗粒紧实，等级3505、9372、9475、9575。高容重、运输稳定，摩洛哥薄荷茶拼配的支柱原料。' },
      { title: 'Organic Green Tea — EU & USDA NOP', tz: '有机绿茶 — 欧盟与美国NOP认证', url: 'products.html', type: 'product', excerpt: 'Certified organic Chunmee, Gunpowder and Sencha-style green tea. EU 2018/848, USDA NOP and JAS. Full residue screening against EU MRL lists.', ez: '通过欧盟2018/848、美国NOP与JAS认证的珍眉、珠茶与煎茶风格绿茶，出货前按欧盟MRL全项筛查。' },
      { title: 'Jasmine Green Tea', tz: '茉莉花绿茶', url: 'products.html', type: 'product', excerpt: 'Five jasmine scenting cycles on a spring-picked green base. Special, Grade 1 and Grade 2. Scented and packed at origin in Fujian.', ez: '春季绿茶坯经五次茉莉鲜花窨制。特级、一级、二级，产地窨花包装。' },
      { title: 'Keemun Black Tea', tz: '祁门红茶', url: 'products.html', type: 'product', excerpt: 'Orthodox Qi Men black tea, Hao Ya A/B and Grades 1–4. Winey, orchid-scented profile for premium blends and private-label lines.', ez: '传统工艺祁门红茶，Hao Ya A/B与1–4级。具果香与兰花香，适用于高端拼配与贴牌产线。' },
      { title: 'Green Tea Fannings (CTE/BTP)', tz: '绿茶片茶（CTC/BTP）', url: 'products.html', type: 'product', excerpt: 'Tea-bag grade fannings, mesh 40/60/80, moisture ≤ 6.0%. Consistent colour and cup strength for high-speed teabag production.', ez: '袋泡茶级片茶，40/60/80目，水分≤6.0%。汤色与滋味稳定，适配高速袋泡茶生产。' },
      { title: 'OEM & Private Label Programme', tz: 'OEM与贴牌定制项目', url: 'index.html#oem', type: 'page', excerpt: 'Private-label packaging from 500 kg MOQ, custom blend formulation, multilingual artwork and market-compliant labelling at origin.', ez: 'MOQ低至500公斤的贴牌包装、定制拼配、多语种设计与合规标签，产地一站式完成。' },
      { title: 'Manufacturing Capability', tz: '生产制造能力', url: 'index.html#capability', type: 'page', excerpt: '52,000 m² campus, six automated production lines, 90,000 kg daily fresh-leaf intake and 28,000 MT annual capacity.', ez: '52,000平方米园区、六条自动化产线、日收鲜叶90,000公斤、年产能28,000公吨。' },
      { title: 'Quality Assurance & Certifications', tz: '品质保证与认证', url: 'index.html#quality', type: 'page', excerpt: 'ISO 9001, ISO 22000, HACCP, EU organic, USDA NOP, JAS, Rainforest Alliance and FDA registration. In-house HPLC & GC-MS laboratory.', ez: 'ISO 9001、ISO 22000、HACCP、欧盟有机、美国NOP、JAS、雨林联盟与FDA注册。自建HPLC与GC-MS实验室。' },
      { title: 'Global Export & Logistics', tz: '全球出口与物流', url: 'index.html#export', type: 'page', excerpt: '62 export markets, FOB/CIF/DDP from Ningbo–Zhoushan and Shanghai, full documentation set with every container.', ez: '62个出口市场，宁波舟山港与上海港FOB/CIF/DDP，每柜随附全套单证。' },
      { title: 'News & Market Insights', tz: '新闻与市场洞察', url: 'news.html', type: 'news', excerpt: 'Company updates, trade shows, crop reports and compliance briefings for green tea importers and packing houses.', ez: '企业动态、行业展会、收成报告与合规简报，服务绿茶进口商与分装企业。' },
      { title: '2026 Spring Crop Report — Anhui Harvest Outlook', tz: '2026年春茶报告 — 安徽收成展望', url: 'news-post.html', type: 'news', excerpt: 'A colder, later spring shifts the 2026 harvest window. Volume and price outlook for Chunmee and Gunpowder buyers, with sourcing recommendations.', ez: '今春偏冷偏晚，采收窗口推迟。珍眉与珠茶买家的产量与价格展望，以及采购建议。' }
    ];

    var searchInput = document.getElementById('search-input');
    var searchResults = document.getElementById('search-results');
    var searchCount = document.getElementById('search-count');
    var searchChips = $all('.fchip', searchApp);

    var searchState = { query: '', type: 'all' };

    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function escapeRegExp(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlight(text, tokens) {
      var safe = escapeHtml(text);
      tokens.forEach(function (token) {
        safe = safe.replace(new RegExp('(' + escapeRegExp(escapeHtml(token)) + ')', 'gi'), '<mark>$1</mark>');
      });
      return safe;
    }

    var isZh = document.documentElement.lang.indexOf('zh') === 0;
    var TYPE_LABELS = isZh
      ? { page: '页面', product: '产品', news: '新闻' }
      : { page: 'page', product: 'product', news: 'news' };

    function entryTitle(e) { return (isZh && e.tz) ? e.tz : e.title; }
    function entryExcerpt(e) { return (isZh && e.ez) ? e.ez : e.excerpt; }

    function searchMatches(entry, tokens) {
      var haystack = (entry.title + ' ' + entry.excerpt + ' ' + (entry.tz || '') + ' ' + (entry.ez || '')).toLowerCase();
      return tokens.every(function (token) { return haystack.indexOf(token) !== -1; });
    }

    function searchRender() {
      var query = searchState.query.trim();
      var tokens = query.toLowerCase().split(/\s+/).filter(function (t) { return t.length > 0; });

      var matches = SITE_INDEX.filter(function (entry) {
        if (searchState.type !== 'all' && entry.type !== searchState.type) return false;
        return tokens.length === 0 || searchMatches(entry, tokens);
      });

      /* Title hits rank above excerpt-only hits */
      if (tokens.length) {
        matches.sort(function (a, b) {
          var aTitle = tokens.every(function (t) { return entryTitle(a).toLowerCase().indexOf(t) !== -1; }) ? 1 : 0;
          var bTitle = tokens.every(function (t) { return entryTitle(b).toLowerCase().indexOf(t) !== -1; }) ? 1 : 0;
          return bTitle - aTitle;
        });
      }

      if (searchCount) {
        searchCount.textContent = query
          ? (isZh
              ? '与\u201C' + query + '\u201D相关的结果：' + matches.length + ' 条'
              : matches.length + (matches.length === 1 ? ' result' : ' results') + ' for \u201C' + query + '\u201D')
          : (isZh
              ? '已收录 ' + SITE_INDEX.length + ' 个页面 — 输入关键词、等级或主题'
              : SITE_INDEX.length + ' pages indexed — enter a keyword, grade or topic');
      }

      if (!matches.length) {
        searchResults.innerHTML =
          '<div class="no-results">' +
          '<h3>' + (isZh ? '没有找到与\u201C' + escapeHtml(query) + '\u201D相关的结果' : 'No matches for \u201C' + escapeHtml(query) + '\u201D') + '</h3>' +
          '<p>' + (isZh
            ? '试试茶等级（如 41022）、主题（有机、OEM、MOQ），或浏览以下栏目。'
            : 'Try a tea grade (e.g. 41022), a topic (organic, OEM, MOQ) or browse the sections below.') + '</p>' +
          '<div class="error-links">' +
          '<a class="pill" href="products.html">' + (isZh ? '产品目录' : 'Product Catalogue') + '</a>' +
          '<a class="pill" href="about.html">' + (isZh ? '关于我们' : 'About Us') + '</a>' +
          '<a class="pill" href="news.html">' + (isZh ? '新闻' : 'News') + '</a>' +
          '<a class="pill" href="contact.html">' + (isZh ? '联系我们' : 'Contact') + '</a>' +
          '</div></div>';
        return;
      }

      searchResults.innerHTML = matches.map(function (entry) {
        return (
          '<article class="result-item">' +
          '<span class="result-item__type">' + TYPE_LABELS[entry.type] + '</span>' +
          '<h3><a href="' + entry.url + '">' + highlight(entryTitle(entry), tokens) + '</a></h3>' +
          '<p>' + highlight(entryExcerpt(entry), tokens) + '</p>' +
          '<p class="result-item__url">' + entry.url + '</p>' +
          '</article>'
        );
      }).join('');
    }

    searchChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        searchState.type = chip.getAttribute('data-filter');
        searchChips.forEach(function (c) {
          c.classList.toggle('is-active', c === chip);
          c.setAttribute('aria-pressed', String(c === chip));
        });
        searchRender();
      });
    });

    searchInput.addEventListener('input', function () {
      searchState.query = searchInput.value;
      window.clearTimeout(searchInput._t);
      searchInput._t = window.setTimeout(searchRender, 180);
    });

    searchInput.closest('form').addEventListener('submit', function (e) {
      e.preventDefault();
      searchState.query = searchInput.value;
      searchRender();
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', 'search.html' + (searchState.query ? '?q=' + encodeURIComponent(searchState.query) : ''));
      }
    });

    var initialQ = new URLSearchParams(window.location.search).get('q');
    if (initialQ) {
      searchInput.value = initialQ;
      searchState.query = initialQ;
    }
    searchRender();
  }
})();
