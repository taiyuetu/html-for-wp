/* ============================================================
   AXIOM — Architectural Electrical Systems
   main.js · vanilla JS, no dependencies
   ============================================================ */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- 1. Header scroll state ---------- */
  const header = $('.site-header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 2. Mobile navigation ---------- */
  const navToggle = $('.nav-toggle');
  const siteNav = $('#site-nav');

  const closeNav = () => {
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  siteNav.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeNav();
      navToggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1020) closeNav();
  });

  /* ---------- 3. Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  const staggerGroups = $$('[data-stagger]');

  staggerGroups.forEach((group) => {
    $$('.reveal', group).forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 60, 360)}ms`;
    });
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- 4. Active section in navigation ---------- */
  const navLinks = $$('.site-nav a[href^="#"]');
  const sectionById = navLinks
    .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sectionById.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sectionById.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- 5. System family filter ---------- */
  const filterChips = $$('.filter-bar .chip');
  const systemCards = $$('.system-card');

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      filterChips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', String(active));
      });
      systemCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.mount.split(' ').includes(filter);
        card.hidden = !match;
        if (match) {
          card.style.opacity = '0';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .3s cubic-bezier(.22,.61,.36,1)';
            card.style.opacity = '1';
          });
        }
      });
    });
  });

  /* ---------- 6. Finishes scroller ---------- */
  const scroller = $('.h-scroll');
  const prevBtn = $('.scroll-btn[data-scroll="prev"]');
  const nextBtn = $('.scroll-btn[data-scroll="next"]');

  if (scroller && prevBtn && nextBtn) {
    const step = () => {
      const card = scroller.querySelector('.finish-card');
      return card ? card.getBoundingClientRect().width + 24 : 320;
    };

    const updateButtons = () => {
      const max = scroller.scrollWidth - scroller.clientWidth - 1;
      prevBtn.disabled = scroller.scrollLeft <= 1;
      nextBtn.disabled = scroller.scrollLeft >= max;
    };

    prevBtn.addEventListener('click', () => {
      scroller.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      scroller.scrollBy({ left: step(), behavior: 'smooth' });
    });
    scroller.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }

  /* ---------- 7. Inquiry form ---------- */
  const form = $('#inquiry-form');

  if (form) {
    const status = $('.form-status', form);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const setError = (field, message) => {
      const wrap = field.closest('.field');
      wrap.classList.toggle('is-invalid', Boolean(message));
      const slot = $('.field__error', wrap);
      if (slot) slot.textContent = message || '';
    };

    const validators = {
      name: (v) => (v.trim() ? '' : 'Name is required.'),
      email: (v) => {
        if (!v.trim()) return 'Email is required.';
        return emailPattern.test(v.trim()) ? '' : 'Enter a valid email address.';
      },
      'project-type': (v) => (v ? '' : 'Select a project type.'),
      notes: (v) => (v.trim() ? '' : 'Describe the specification briefly.'),
    };

    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      field.addEventListener('input', () => setError(field, ''));
      field.addEventListener('change', () => setError(field, ''));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // honeypot: silently accept bot submissions
      if (form.elements['company-url'] && form.elements['company-url'].value) {
        form.reset();
        return;
      }

      let firstInvalid = null;
      Object.keys(validators).forEach((name) => {
        const field = form.elements[name];
        if (!field) return;
        const message = validators[name](field.value);
        setError(field, message);
        if (message && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const ref = `AX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      status.hidden = false;
      status.textContent = `Inquiry registered · Ref ${ref} — the specification desk responds within 2 business days.`;
      form.reset();
      status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* ---------- 8. Hero slider ---------- */
  const slider = $('#hero-slider');

  if (slider) {
    const slides = $$('.slide', slider);
    const counter = $('.slider__counter', slider);
    const live = $('.slider__live', slider);
    const toggleBtn = $('.slider__toggle', slider);
    const total = String(slides.length).padStart(2, '0');
    const INTERVAL = 6000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let index = 0;
    let timer = null;
    let playing = false;
    let userPaused = false;
    let hovered = false;
    let hoverWasPlaying = false;
    let hiddenWasPlaying = false;

    const pad = (n) => String(n).padStart(2, '0');

    const render = () => {
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      counter.textContent = `${pad(index + 1)} / ${total}`;
      live.textContent = `Slide ${index + 1} of ${slides.length}: ${slides[index].dataset.title || ''}`;
    };

    const go = (i) => {
      index = (i + slides.length) % slides.length;
      render();
    };

    const restartTimer = () => {
      if (playing) { stop(); start(); }
    };

    function start() {
      if (reducedMotion || timer || userPaused) return;
      timer = setInterval(() => go(index + 1), INTERVAL);
      playing = true;
      syncToggle();
    }

    function stop() {
      clearInterval(timer);
      timer = null;
      playing = false;
      syncToggle();
    }

    function syncToggle() {
      toggleBtn.textContent = playing ? 'Pause' : 'Play';
      toggleBtn.setAttribute('aria-label', playing ? 'Pause autoplay' : 'Start autoplay');
    }

    toggleBtn.addEventListener('click', () => {
      userPaused = playing;
      if (playing) stop(); else start();
    });

    $$('.slider__btn', slider).forEach((btn) => {
      btn.addEventListener('click', () => {
        go(index + (btn.dataset.dir === 'next' ? 1 : -1));
        restartTimer();
      });
    });

    slider.addEventListener('mouseenter', () => {
      hovered = true;
      hoverWasPlaying = playing;
      if (playing) stop();
    });
    slider.addEventListener('mouseleave', () => {
      hovered = false;
      if (hoverWasPlaying && !userPaused) start();
      hoverWasPlaying = false;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        hiddenWasPlaying = playing;
        if (playing) stop();
      } else if (hiddenWasPlaying && !userPaused && !hovered) {
        start();
      }
      hiddenWasPlaying = false;
    });

    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { go(index - 1); restartTimer(); }
      if (e.key === 'ArrowRight') { go(index + 1); restartTimer(); }
    });

    let startX = null;
    slider.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    slider.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 48) {
        go(index + (dx < 0 ? 1 : -1));
        restartTimer();
      }
    });
    slider.addEventListener('pointerleave', () => { startX = null; });

    if (reducedMotion) toggleBtn.hidden = true;
    render();
    start();
  }

  /* ---------- 9. Product archive: filters + pagination ---------- */
  const archive = $('#product-archive');

  if (archive) {
    const cards = $$('.product-card', archive);
    const grid = $('.products__grid', archive);
    const empty = $('.archive__empty', archive);
    const countEl = $('#archive-count');
    const pagination = $('.pagination', archive);
    const filtersToggle = $('#filters-toggle');
    const PAGE_SIZE = 9;
    const scrollSmooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let page = 1;
    let totalPages = 1;

    const checkedValues = (cls) =>
      $$(`input[type="checkbox"]${cls}`, archive).filter((i) => i.checked).map((i) => i.value);

    const apply = () => {
      const fams = checkedValues('.js-f-family');
      const fns = checkedValues('.js-f-function');
      const mounts = checkedValues('.js-f-mounting');

      const visible = cards.filter((card) =>
        (!fams.length || fams.includes(card.dataset.family)) &&
        (!fns.length || fns.includes(card.dataset.function)) &&
        (!mounts.length || mounts.includes(card.dataset.mounting)));

      totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
      if (page > totalPages) page = totalPages;

      const startIdx = (page - 1) * PAGE_SIZE;
      const pageItems = visible.slice(startIdx, startIdx + PAGE_SIZE);
      cards.forEach((card) => { card.hidden = !pageItems.includes(card); });

      countEl.textContent = visible.length
        ? `Showing ${startIdx + 1}–${Math.min(startIdx + PAGE_SIZE, visible.length)} of ${visible.length} products`
        : 'No matching products';
      empty.hidden = visible.length > 0;
      grid.style.display = visible.length ? '' : 'none';
      pagination.hidden = totalPages <= 1;

      let html = `<button class="pagination__btn" data-page="prev" aria-label="Previous page"${page === 1 ? ' disabled' : ''}>&#8592;</button>`;
      for (let i = 1; i <= totalPages; i += 1) {
        html += `<button class="pagination__btn${i === page ? ' is-current' : ''}" data-page="${i}"${i === page ? ' aria-current="page"' : ''}>${i}</button>`;
      }
      html += `<button class="pagination__btn" data-page="next" aria-label="Next page"${page === totalPages ? ' disabled' : ''}>&#8594;</button>`;
      pagination.innerHTML = html;
    };

    const resetFilters = () => {
      $$('input[type="checkbox"]', archive).forEach((input) => { input.checked = false; });
      page = 1;
      apply();
    };

    $('#filter-reset').addEventListener('click', resetFilters);
    $('#empty-reset').addEventListener('click', resetFilters);

    $$('.js-f-family, .js-f-function, .js-f-mounting', archive).forEach((input) => {
      input.addEventListener('change', () => { page = 1; apply(); });
    });

    pagination.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-page]');
      if (!btn || btn.disabled) return;
      const target = btn.dataset.page;
      if (target === 'prev') page = Math.max(1, page - 1);
      else if (target === 'next') page = Math.min(totalPages, page + 1);
      else page = Number(target);
      apply();
      const y = grid.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: scrollSmooth ? 'smooth' : 'auto' });
    });

    if (filtersToggle) {
      filtersToggle.addEventListener('click', () => {
        const open = document.body.classList.toggle('filters-open');
        filtersToggle.setAttribute('aria-expanded', String(open));
      });
    }

    // deep link: products.html#stone preselects the STONE LINE filter
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash) {
      const target = $(`input[type="checkbox"][value="${hash}"]`, archive);
      if (target) target.checked = true;
    }
    apply();
  }

  /* ---------- 10. Single product page ---------- */
  const detailPage = $('#product-detail');

  if (detailPage) {
    const SPEC_TEMPLATES = {
      switch: (v) => [
        ['Function', v.fn || '1-way switch (single-pole)'],
        ['Rated current', v.current || '10 AX'],
        ['Rated voltage', '250 V~'],
        ['Contact', 'Snap-action, silver alloy'],
        ['Rated switching life', '40 000 cycles · EN 60669-1'],
        ['Fixing centres', '55 mm'],
        ['Mounting depth', v.depth || '32 mm min. back box'],
        ['Ingress protection', v.ip || 'IP20'],
        ['Glow-wire test', '850 °C · live parts'],
        ['Ambient temperature', '−5 °C … +40 °C'],
        ['Standards', 'EN 60669-1 · CE · ENEC+'],
      ],
      dimmer: () => [
        ['Function', 'Universal push-dimmer'],
        ['Load (LED)', '3–250 W'],
        ['Load (incandescent / halogen)', '20–400 W'],
        ['Control principle', 'Trailing / leading edge, selectable'],
        ['Short-circuit protection', 'Electronic, 2-terminal'],
        ['Fixing centres', '55 mm'],
        ['Mounting depth', '32 mm min. back box'],
        ['Ingress protection', 'IP20'],
        ['Glow-wire test', '850 °C · live parts'],
        ['Ambient temperature', '−5 °C … +40 °C'],
        ['Standards', 'EN 60669-2-1 · CE · ENEC+'],
      ],
      socket: (v) => [
        ['Function', 'Socket outlet with shutters'],
        ['Rated current', '16 A'],
        ['Rated voltage', '250 V~'],
        ['Insertion life', '10 000 cycles · EN 60884-1'],
        ['USB output', v.usb || '—'],
        ['Fixing centres', '55 mm'],
        ['Mounting depth', v.depth || '32 mm min. back box'],
        ['Ingress protection', v.ip || 'IP20'],
        ['Glow-wire test', '850 °C · live parts'],
        ['Ambient temperature', '−5 °C … +40 °C'],
        ['Standards', 'EN 60884-1 · CE · ENEC+'],
      ],
      data: () => [
        ['Function', 'Data outlet'],
        ['Category', 'Cat 6A · ISO/IEC 11801'],
        ['Connector', 'RJ45 8-pole, shielded'],
        ['Shielding', 'Full-metal, 360° termination'],
        ['Transmission', '10GBASE-T capable'],
        ['Fixing centres', '55 mm'],
        ['Mounting depth', '32 mm min. back box'],
        ['Ingress protection', 'IP20'],
        ['Ambient temperature', '−5 °C … +40 °C'],
        ['Standards', 'EN 60603-7 · CE · ENEC+'],
      ],
      touch: (v) => [
        ['Function', v.fn || 'Touch station'],
        ['Touch points', v.points],
        ['Bus system', 'AX-BUS / KNX TP1'],
        ['Supply', 'Bus voltage 24 V (SELV)'],
        ['Operating surface', 'Capacitive glass, backlit'],
        ['Power loss', '< 300 mW'],
        ['Fixing centres', '55 mm'],
        ['Mounting depth', '32 mm min. back box'],
        ['Ingress protection', 'IP20'],
        ['Ambient temperature', '−5 °C … +45 °C'],
        ['Standards', 'EN 60669-2-1 · CE · ENEC+'],
      ],
      control: (v) => [
        ['Function', v.fn],
        ['Outputs', v.ch],
        ['Bus system', 'AX-BUS / KNX TP1'],
        ['Supply', 'Bus voltage 24 V (SELV)'],
        ['Operating surface', 'Capacitive glass'],
        ['Power loss', '< 400 mW'],
        ['Fixing centres', '55 mm'],
        ['Mounting depth', '32 mm min. back box'],
        ['Ingress protection', 'IP20'],
        ['Ambient temperature', '−5 °C … +45 °C'],
        ['Standards', 'EN 60669-2-1 · CE · ENEC+'],
      ],
      frame: (v) => [
        ['Function', 'Multi-gang frame'],
        ['Module capacity', v.modules],
        ['Fixing centres', '55 mm'],
        ['Frame depths', '4 depths · 4–16 mm'],
        ['Material', 'Die-cast zinc / aluminum'],
        ['Surface', '42 batch-controlled finishes'],
        ['Mounting', 'Flush · Surface (adapter)'],
        ['Ingress protection', 'IP20'],
        ['Standards', 'EN 60670-22 · CE'],
      ],
      plate: () => [
        ['Function', 'Center plate (blank position)'],
        ['Finishes', '42 batch-controlled finishes'],
        ['Material', 'Die-cast zinc / aluminum / glass'],
        ['Plate size', '71 × 71 mm'],
        ['Mounting', 'Tool-free clip on carrier'],
        ['Standards', 'EN 60670-22 · CE'],
      ],
    };

    const FUNCTION_BODY = {
      switch: 'Function lives in the insert, not the plate. The switch insert carries a snap-action contact in silver alloy on a glass-fibre carrier, clipped into the standard 55 mm unit and terminated with 0.5 N·m torque terminals. Every rocker across the platform shares the same geometry, so a specification written for one wall type holds for every other.',
      dimmer: 'The dimmer insert dims LED, halogen and incandescent loads universally, with selectable trailing or leading edge. Two-terminal electronic short-circuit protection and thermal fold-back make mixed load groups safe without re-engineering the circuit.',
      socket: 'The socket insert is shuttered and tested to 10 000 insertion cycles. Terminal geometry accepts 2 × 2.5 mm² through-wiring, so circuits continue through the device without joint boxes.',
      data: 'The data insert provides a fully shielded RJ45 outlet with 360° shield termination. Keyed strain relief and tool-free LSA termination sit on the insert rear, behind the finished wall plane.',
      touch: 'The station is bus-native: every touch point is freely assignable and re-addressed on site. Scenes, blind and HVAC logic run on the line bus — no cloud dependency for core functions.',
      control: 'The panel carries integral logic for scenes, timers and automation on the line bus. Outputs are re-configured on site; the plate is never re-commissioned.',
      frame: 'The frame architecture takes mixed-function carriers in one plane — switch, dimmer, socket and data side by side, aligned to a single 55 mm grid with one shadow gap.',
      plate: 'The center plate closes unused positions in a multi-gang layout. It is batch-matched to the surrounding devices, so spare positions never read as spare positions.',
    };

    const FINISH_SETS = {
      full: [
        ['AL-01', 'Brushed Aluminum', 'pf-al', 'mat-al'],
        ['AN-04', 'Anodized Bronze', 'pf-anz', 'mat-anz'],
        ['GL-02', 'Black Glass', 'pf-glass', 'mat-glass'],
        ['CE-01', 'Ceramic White', 'pf-cer', 'mat-cer'],
        ['ST-03', 'Sandstone', 'pf-stone', 'mat-stone'],
        ['CS-01', 'Coated Steel', 'pf-steel', 'mat-steel'],
      ],
      stone: [
        ['ST-03', 'Sandstone', 'pf-stone', 'mat-stone'],
        ['SB-01', 'Basalt', 'pf-basalt', 'mat-basalt'],
        ['TM-01', 'Marble Bianco', 'pf-marble', 'mat-marble'],
      ],
      glass: [
        ['GL-02', 'Black Glass', 'pf-glass', 'mat-glass'],
        ['GW-01', 'White Glass', 'pf-glassw', 'mat-glassw'],
        ['GB-03', 'Bronze Glass', 'pf-anz', 'mat-anz'],
      ],
      tech: [
        ['CS-01', 'Coated Steel', 'pf-steel', 'mat-steel'],
        ['AL-01', 'Brushed Aluminum', 'pf-al', 'mat-al'],
      ],
    };
    const FAM_FINISH = { linea: 'full', modu: 'full', flushzero: 'full', stone: 'stone', axis: 'glass', solid70: 'tech' };

    const CARD_POS = {
      'i-touch4': [130, 160], 'i-touch8': [130, 160], 'i-blind': [130, 160], 'i-scene': [130, 160],
      'i-frame3': [118, 198], 'i-frame5': [70, 198],
    };

    const PRODUCT_LIBRARY = {
      'AX-LN-101': { name: 'Rocker Switch 1-gang', fam: 'linea', famLabel: 'LINEA 55', fn: 'switch', fnLabel: 'Switch', symbol: 'i-rocker1', wall: 'phw-ln', label: 'AX-LN · 1:1.2', draw: [235, 150, 2.43], meta: '10 AX · 250 V~ · Flush-mounted', tags: ['LINEA 55', 'Switch'], intro: 'The base reference of the LINEA 55 platform: a single-pole rocker switch with snap-action silver-alloy contacts on the standard 55 mm carrier.', spec: { fn: '1-way switch (single-pole)' } },
      'AX-LN-102': { name: 'Rocker Switch 2-gang', fam: 'linea', famLabel: 'LINEA 55', fn: 'switch', fnLabel: 'Switch', symbol: 'i-rocker2', wall: 'phw-ln', label: 'AX-LN · 1:1.2', draw: [235, 150, 2.43], meta: '10 AX · 250 V~ · Flush-mounted', tags: ['LINEA 55', 'Switch'], intro: 'Two independent switch circuits behind one square 55 mm plate — the most-specified LINEA configuration.', spec: { fn: '2-way switch · 2-gang' } },
      'AX-LN-210': { name: 'Universal Push-Dimmer', fam: 'linea', famLabel: 'LINEA 55', fn: 'dimmer', fnLabel: 'Dimmer', symbol: 'i-dimmer', wall: 'phw-ln', label: 'AX-LN · 1:1.2', draw: [235, 150, 2.43], meta: 'LED 3–250 W · Leading / trailing edge', tags: ['LINEA 55', 'Dimmer'], intro: 'Universal push-dimmer for LED, halogen and incandescent loads, selectable trailing or leading edge.' },
      'AX-LN-301': { name: 'Socket Outlet', fam: 'linea', famLabel: 'LINEA 55', fn: 'socket', fnLabel: 'Socket', symbol: 'i-socket', wall: 'phw-ln', label: 'AX-LN · 1:1.2', draw: [235, 150, 2.43], meta: '16 A · 250 V~ · Shuttered', tags: ['LINEA 55', 'Socket'], intro: 'Shuttered 16 A socket outlet on the LINEA 55 carrier, with through-wiring for continued circuits.' },
      'AX-LN-311': { name: 'Socket Outlet + USB', fam: 'linea', famLabel: 'LINEA 55', fn: 'socket', fnLabel: 'Socket', symbol: 'i-socket-usb', wall: 'phw-ln', label: 'AX-LN · 1:1.2', draw: [235, 150, 2.43], meta: '16 A · USB A/C · 30 W', tags: ['LINEA 55', 'Socket'], intro: 'Socket outlet with integrated USB A/C charging, 30 W total, on the standard 55 mm grid.', spec: { usb: 'USB A/C · 30 W total' } },
      'AX-LN-401': { name: 'Data Outlet Cat 6A', fam: 'linea', famLabel: 'LINEA 55', fn: 'data', fnLabel: 'Data', symbol: 'i-data', wall: 'phw-ln', label: 'AX-LN · 1:1.2', draw: [235, 150, 2.43], meta: 'RJ45 · Cat 6A · Shielded', tags: ['LINEA 55', 'Data'], intro: 'Fully shielded Cat 6A data outlet with 360° shield termination on the LINEA carrier.' },
      'AX-LN-900': { name: 'Center Plate 1-gang', fam: 'linea', famLabel: 'LINEA 55', fn: 'plate', fnLabel: 'Plate', symbol: 'i-blank', wall: 'phw-ln', label: 'AX-LN · 1:1.2', draw: [235, 150, 2.43], meta: 'Screw-less · All 42 finishes', tags: ['LINEA 55', 'Plate'], intro: 'Screw-less center plate for unused positions — batch-matched to the surrounding devices.' },
      'AX-FZ-101': { name: 'Rocker Switch 1-gang', fam: 'flushzero', famLabel: 'FLUSH ZERO', fn: 'switch', fnLabel: 'Switch', symbol: 'i-rocker1-fz', wall: 'phw-fz', label: 'AX-FZ · 1:1.2', draw: [235, 150, 2.43], meta: '10 AX · 250 V~ · Skim-coat flush', tags: ['FLUSH ZERO', 'Switch'], intro: 'The LINEA switch insert in the FLUSH ZERO frameless program: plate set 0.5 mm proud of finished plaster.', spec: { depth: '25 mm min. (frameless)' } },
      'AX-FZ-301': { name: 'Socket Outlet', fam: 'flushzero', famLabel: 'FLUSH ZERO', fn: 'socket', fnLabel: 'Socket', symbol: 'i-socket-fz', wall: 'phw-fz', label: 'AX-FZ · 1:1.2', draw: [235, 150, 2.43], meta: '16 A · 250 V~ · Frameless', tags: ['FLUSH ZERO', 'Socket'], intro: 'Frameless socket outlet for skim-coat walls; 2 mm shadow gap, no visible frame.' },
      'AX-FZ-401': { name: 'Data Outlet Cat 6A', fam: 'flushzero', famLabel: 'FLUSH ZERO', fn: 'data', fnLabel: 'Data', symbol: 'i-data-fz', wall: 'phw-fz', label: 'AX-FZ · 1:1.2', draw: [235, 150, 2.43], meta: 'RJ45 · Cat 6A · Frameless', tags: ['FLUSH ZERO', 'Data'], intro: 'Frameless Cat 6A data outlet for plaster-flush integration.' },
      'AX-S70-101': { name: 'Rocker Switch IP55', fam: 'solid70', famLabel: 'SOLID 70', fn: 'switch', fnLabel: 'Switch', symbol: 'i-rocker1-s70', wall: 'phw-s70', label: 'AX-S70 · 1:1.2', draw: [235, 150, 2.43], meta: '10 AX · 250 V~ · Surface-mounted', tags: ['SOLID 70', 'Switch', 'IP55'], intro: 'IP55 surface rocker switch for concrete, brick and retrofit; conduit-internal base.', spec: { ip: 'IP55' } },
      'AX-S70-301': { name: 'Socket Outlet IP55', fam: 'solid70', famLabel: 'SOLID 70', fn: 'socket', fnLabel: 'Socket', symbol: 'i-socket-s70', wall: 'phw-s70', label: 'AX-S70 · 1:1.2', draw: [235, 150, 2.43], meta: '16 A · 250 V~ · Gasketed lid', tags: ['SOLID 70', 'Socket', 'IP55'], intro: 'IP55 surface socket outlet with gasketed lid for exposed wall conditions.', spec: { ip: 'IP55' } },
      'AX-S70-311': { name: 'Socket + USB IP55', fam: 'solid70', famLabel: 'SOLID 70', fn: 'socket', fnLabel: 'Socket', symbol: 'i-socket-usb-s70', wall: 'phw-s70', label: 'AX-S70 · 1:1.2', draw: [235, 150, 2.43], meta: '16 A · USB A · 18 W', tags: ['SOLID 70', 'Socket', 'IP55'], intro: 'IP55 surface socket with USB charging for technical and semi-exposed areas.', spec: { usb: 'USB A · 18 W', ip: 'IP55' } },
      'AX-SL-101': { name: 'Rocker Switch Sandstone', fam: 'stone', famLabel: 'STONE LINE', fn: 'switch', fnLabel: 'Switch', symbol: 'i-rocker1', wall: 'phw-sl', label: 'AX-SL · 1:1.2', draw: [235, 150, 2.43], meta: '10 AX · 250 V~ · Quarry-matched', tags: ['STONE LINE', 'Switch', 'Stone'], intro: 'Rocker switch with genuine sandstone front, bonded to an 8 mm composite carrier.' },
      'AX-SL-210': { name: 'Push-Dimmer Sandstone', fam: 'stone', famLabel: 'STONE LINE', fn: 'dimmer', fnLabel: 'Dimmer', symbol: 'i-dimmer', wall: 'phw-sl', label: 'AX-SL · 1:1.2', draw: [235, 150, 2.43], meta: 'LED 3–250 W · Quarry-matched', tags: ['STONE LINE', 'Dimmer', 'Stone'], intro: 'Push-dimmer with honed sandstone front; quarry-batch-matched to the wall build-up.' },
      'AX-SL-301': { name: 'Socket Outlet Sandstone', fam: 'stone', famLabel: 'STONE LINE', fn: 'socket', fnLabel: 'Socket', symbol: 'i-socket', wall: 'phw-sl', label: 'AX-SL · 1:1.2', draw: [235, 150, 2.43], meta: '16 A · 250 V~ · 8 mm composite', tags: ['STONE LINE', 'Socket', 'Stone'], intro: 'Sandstone socket outlet on the 8 mm bonded composite; 16 A, shuttered.' },
      'AX-AT-204': { name: 'Touch Station 4-point', fam: 'axis', famLabel: 'AXIS TOUCH', fn: 'touch', fnLabel: 'Scene', symbol: 'i-touch4', wall: 'phw-at', label: 'AX-AT · 1:1.2', dark: true, draw: [250, 115, 2.15], meta: 'AX-BUS · Capacitive glass', tags: ['AXIS TOUCH', 'Scene'], intro: 'Four freely assignable touch points on back-lit glass — the compact AXIS TOUCH station.', spec: { points: '4 · freely assignable' } },
      'AX-AT-208': { name: 'Touch Station 8-point', fam: 'axis', famLabel: 'AXIS TOUCH', fn: 'touch', fnLabel: 'Scene', symbol: 'i-touch8', wall: 'phw-at', label: 'AX-AT · 1:1.2', dark: true, draw: [250, 115, 2.15], meta: 'AX-BUS · Capacitive glass', tags: ['AXIS TOUCH', 'Scene'], intro: 'Eight-point capacitive station for complete room control on one plate.', spec: { points: '8 · freely assignable' } },
      'AX-AT-212': { name: 'Blind Control Panel', fam: 'axis', famLabel: 'AXIS TOUCH', fn: 'control', fnLabel: 'Blind', symbol: 'i-blind', wall: 'phw-at', label: 'AX-AT · 1:1.2', dark: true, draw: [250, 115, 2.15], meta: 'AX-BUS · 2 drives · Slats', tags: ['AXIS TOUCH', 'Blind'], intro: 'Dedicated blind control panel: two drives with slat position, bus-native.', spec: { fn: 'Blind control panel', ch: '2 drives · slat control' } },
      'AX-AT-230': { name: 'Room Control Panel', fam: 'axis', famLabel: 'AXIS TOUCH', fn: 'control', fnLabel: 'Control', symbol: 'i-scene', wall: 'phw-at', label: 'AX-AT · 1:1.2', dark: true, draw: [250, 115, 2.15], meta: 'AX-BUS · Scene levels · Logic', tags: ['AXIS TOUCH', 'Control'], intro: 'Room control panel with integral scene, timer and automation logic on the line bus.', spec: { fn: 'Room control panel', ch: 'Logic · timers · 12 scenes' } },
      'AX-MF-112': { name: 'Switch Frame 2-gang', fam: 'modu', famLabel: 'MODU FRAME', fn: 'frame', fnLabel: 'Frame', symbol: 'i-rocker2', wall: 'phw-ln', label: 'AX-MF · 1:1.2', draw: [235, 150, 2.43], meta: '55 mm centres · 2 modules', tags: ['MODU FRAME', 'Switch'], intro: 'Two-gang frame of the MODU architecture; mixed carriers in one plane.', spec: { modules: '2 × 55 mm' } },
      'AX-MF-210': { name: 'Dimmer Frame 1-gang', fam: 'modu', famLabel: 'MODU FRAME', fn: 'frame', fnLabel: 'Frame', symbol: 'i-dimmer', wall: 'phw-ln', label: 'AX-MF · 1:1.2', draw: [235, 150, 2.43], meta: '55 mm centres · 1 module', tags: ['MODU FRAME', 'Dimmer'], intro: 'Single-gang MODU frame for dimmer or switch inserts.', spec: { modules: '1 × 55 mm' } },
      'AX-MF-305': { name: 'Frame 3-gang Mixed', fam: 'modu', famLabel: 'MODU FRAME', fn: 'frame', fnLabel: 'Frame', symbol: 'i-frame3', wall: 'phw-ln', label: 'AX-MF · 1:1.2', draw: [200, 195, 2.44], meta: '55 mm centres · Mixed carriers', tags: ['MODU FRAME', 'Frame'], intro: 'Three-gang frame accepting mixed-function carriers — switch, dimmer, socket, data side by side.', spec: { modules: '3 × 55 mm mixed' } },
      'AX-MF-905': { name: 'Frame 5-gang', fam: 'modu', famLabel: 'MODU FRAME', fn: 'frame', fnLabel: 'Frame', symbol: 'i-frame5', wall: 'phw-ln', label: 'AX-MF · 1:1.2', draw: [130, 215, 2.08], meta: '55 mm centres · 5 modules', tags: ['MODU FRAME', 'Frame'], intro: 'Five-gang MODU frame for full control strips on one 55 mm grid.', spec: { modules: '5 × 55 mm' } },
    };

    const DL_ROWS = [
      ['Datasheet', 'PDF', '1.2 MB'],
      ['BIM_Object', 'RVT', '4.8 MB'],
      ['BIM_Object', 'IFC', '2.1 MB'],
      ['Mounting_Details', 'DWG', '860 KB'],
      ['Declaration_of_Performance', 'PDF', '240 KB'],
      ['ENEC_Certificate', 'PDF', '320 KB'],
    ];

    // tabs
    const tabButtons = $$('.tabs__tab', detailPage);
    const tabPanels = $$('.tabs__panel', detailPage);
    const selectTab = (i) => {
      tabButtons.forEach((tab, k) => {
        const on = k === i;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', String(on));
        tab.setAttribute('tabindex', on ? '0' : '-1');
      });
      tabPanels.forEach((panel, k) => {
        panel.hidden = k !== i;
      });
    };
    tabButtons.forEach((tab, i) => tab.addEventListener('click', () => selectTab(i)));
    $('.tabs__nav', detailPage).addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const i = tabButtons.findIndex((t) => t.classList.contains('is-active'));
      const next = e.key === 'ArrowRight' ? (i + 1) % tabButtons.length : (i - 1 + tabButtons.length) % tabButtons.length;
      selectTab(next);
      tabButtons[next].focus();
      e.preventDefault();
    });

    // finish selection
    const stage = $('#pf-stage', detailPage);
    let finishCls = null;

    const applyFinish = (finish) => {
      const [code, label, cls] = finish;
      if (finishCls) stage.classList.remove(finishCls);
      stage.classList.add(cls);
      finishCls = cls;
      $('#pf-finish-label').textContent = `${code} · ${label}`;
      $('#pf-meta-finish').textContent = `${code} · ${label.toUpperCase()}`;
    };

    const renderFinishes = (product) => {
      const set = FINISH_SETS[FAM_FINISH[product.fam]] || FINISH_SETS.full;
      $('#pf-finish-chips').innerHTML = set.map(([code, label, cls, mat], i) =>
        `<button class="finish-chip ${mat}${i === 0 ? ' is-active' : ''}" type="button" data-i="${i}" aria-pressed="${i === 0}" aria-label="Finish ${code} — ${label}"></button>`
      ).join('');
      $$('#pf-finish-chips .finish-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          $$('#pf-finish-chips .finish-chip').forEach((c) => {
            c.classList.toggle('is-active', c === chip);
            c.setAttribute('aria-pressed', String(c === chip));
          });
          applyFinish(set[Number(chip.dataset.i)]);
        });
      });
      applyFinish(set[0]);
    };

    // related products
    const cardHTML = (code) => {
      const p = PRODUCT_LIBRARY[code];
      const pos = CARD_POS[p.symbol] || [132, 182];
      const svgCls = p.fam === 'stone' ? ' class="pf-stone"' : p.fam === 'axis' ? ' class="pf-glass"' : '';
      return `<article class="product-card">
        <figure class="product-card__figure">
          <svg viewBox="0 0 400 500"${svgCls} aria-hidden="true" focusable="false">
            <rect width="400" height="500" fill="url(#${p.wall})"/>
            <rect width="400" height="500" fill="url(#pa-grid)"/>
            <use href="#${p.symbol}" transform="translate(${pos[0]} ${pos[1]})"/>
            <use href="#p-ticks"/>
            <text class="svg-mono${p.dark ? ' svg-mono--lite' : ''}" x="20" y="34">${p.label}</text>
          </svg>
        </figure>
        <div class="product-card__body">
          <p class="product-card__code">${code}</p>
          <h3>${p.name}</h3>
          <p class="product-card__meta">${p.meta}</p>
          <div class="product-card__foot"><a class="card-link" href="product.html?p=${code}">View Product</a></div>
        </div>
      </article>`;
    };

    const renderRelated = (code, product) => {
      const others = Object.keys(PRODUCT_LIBRARY)
        .filter((k) => PRODUCT_LIBRARY[k].fam === product.fam && k !== code)
        .slice(0, 3);
      $('#pf-related').innerHTML = others.map(cardHTML).join('');
      setText('#pf-related-family', product.famLabel);
    };

    const setText = (sel, value) => {
      const el = $(sel);
      if (el) el.textContent = value;
    };

    const renderProduct = (code) => {
      const p = PRODUCT_LIBRARY[code];
      document.title = `${code} — ${p.name} | AXIOM`;
      setText('#pf-crumb', code);
      setText('#pf-title', p.name);
      $('#pf-banner-meta').innerHTML = `${p.famLabel.toUpperCase()} · ${p.fnLabel.toUpperCase()} · ${code}<br>EN 60669-1 · ENEC+`;
      setText('#pf-family-link', p.famLabel);
      $('#pf-family-link').setAttribute('href', `products.html#${p.fam}`);
      $('#pf-back').setAttribute('href', `products.html#${p.fam}`);
      setText('#pf-intro', p.intro);
      setText('#pf-meta', p.meta);
      $('#pf-tags').innerHTML = p.tags.map((t) => `<span class="tag">${t}</span>`).join('');

      $('#pf-use').setAttribute('href', `#${p.symbol}`);
      $('#pf-use').setAttribute('transform', `translate(${p.draw[0]} ${p.draw[1]}) scale(${p.draw[2]})`);
      $('#pf-wall').setAttribute('fill', `url(#${p.wall})`);
      const lbl = $('#pf-svg-label');
      lbl.textContent = p.label;
      lbl.classList.toggle('svg-mono--lite', Boolean(p.dark));
      setText('#pf-meta-code', code);

      const rows = SPEC_TEMPLATES[p.fn](p.spec || {});
      $('#pf-keyfacts').innerHTML = rows.slice(0, 4)
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
      $('#pf-specs').innerHTML = rows
        .map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('');
      setText('#pf-ov-body', FUNCTION_BODY[p.fn]);
      setText('#pf-tech-code', code);
      $('#pf-downloads').innerHTML = DL_ROWS
        .map(([file, type, size]) => `<tr><td>${code}_${file}</td><td class="mono">${type}</td><td class="mono">${size}</td></tr>`).join('');

      renderFinishes(p);
      renderRelated(code, p);
    };

    const requested = new URLSearchParams(window.location.search).get('p');
    const code = requested && PRODUCT_LIBRARY[requested] ? requested : 'AX-LN-101';
    if (code !== 'AX-LN-101') renderProduct(code);

    // finish chips are wired for the static default too
    if (code === 'AX-LN-101') {
      const set = FINISH_SETS.full;
      $$('#pf-finish-chips .finish-chip').forEach((chip, i) => {
        chip.addEventListener('click', () => {
          $$('#pf-finish-chips .finish-chip').forEach((c) => {
            c.classList.toggle('is-active', c === chip);
            c.setAttribute('aria-pressed', String(c === chip));
          });
          applyFinish(set[i]);
        });
      });
    }
  }

  /* ---------- 11. News & press ---------- */
  const NEWS_LIBRARY = {
    lb2026: { title: 'AXIOM at Light + Building 2026', date: '14 October 2026', dateLabel: 'OCT 14 2026', cat: 'fairs', catLabel: 'Fairs', visual: 'nv-fair', min: 3,
      excerpt: 'The complete platform in Hall 8, Stand E40 — with live flush-zero build-ups in five wall conditions, wired and switching at 1:1.',
      quote: { text: 'The wall is the interface. Everything else is infrastructure.', by: 'J. Brandt — Chief Executive' },
      body: [
        'AXIOM presents the complete platform at Light + Building 2026 — Hall 8, Stand E40 — with live flush-zero build-ups in five wall conditions.',
        'The stand is built as a cut-through elevation: stone, veneer, plaster and glass wall build-ups mounted at 1:1, each wired and switching. Visitors handle the carriers, not just the plates — mounting sequences run hourly at the bench.',
        'The AXIS TOUCH generation shown on the stand runs scene logic locally on the line bus, demonstrated against a KNX reference line twice a day.',
        'Registration is free with the AXIOM invitation code AX26-LB. The specification desk holds project consultations on stand — bring the wall build-up, leave with the mounting detail.',
      ] },
    usb45: { title: 'USB-C 45 W across the socket program', date: '29 September 2026', dateLabel: 'SEP 29 2026', cat: 'products', catLabel: 'Products', visual: 'nv-product', min: 2,
      excerpt: '45 W charging becomes standard on LINEA 55, FLUSH ZERO and SOLID 70 socket combinations.',
      body: [
        'USB-C charging at 45 W becomes standard across LINEA 55, FLUSH ZERO and SOLID 70 socket combinations — no dedicated chargers on the wall.',
        'The power stage moves into the insert; heat is dissipated through the carrier, keeping plate surfaces within 4 K of ambient at full load.',
        'Existing installed bases can be retrofitted by swapping the insert alone — plates and frames stay on the wall.',
      ] },
    plant2: { title: 'Second assembly line opens in Meinerzhagen', date: '8 September 2026', dateLabel: 'SEP 08 2026', cat: 'company', catLabel: 'Company', visual: 'nv-plant', min: 2,
      excerpt: 'Line 2 doubles insert capacity to 4.2 million units per year on the same batch archive.',
      body: [
        'Assembly line 2 doubles insert capacity to 4.2 million units per year; the first batch rolled off in September.',
        'The line shares tooling and the batch archive with line 1 — a finish code produced on either line is archived under the same project reference.',
        'Capacity remains allocated to specification business first; OEM allocations shift to line 2 from Q4.',
      ] },
    bim2026: { title: 'BIM library 2026: 480 objects, Revit and IFC', date: '26 August 2026', dateLabel: 'AUG 26 2026', cat: 'technical', catLabel: 'Technical', visual: 'nv-lab', min: 2,
      excerpt: 'Every family, finish group and frame configuration — parameters matching the datasheets.',
      body: [
        'The 2026 BIM library publishes 480 objects — every family, finish group and frame configuration, in Revit and open IFC.',
        'Objects carry LOD 300 geometry with real parameter names matching the datasheets: fixing centres, depths, ingress classes.',
        'Datasheets, DWG details and tender texts link from each object; one download per family.',
      ] },
    meridian: { title: '1 400 rooms: Grand Meridian group specified', date: '4 August 2026', dateLabel: 'AUG 04 2026', cat: 'company', catLabel: 'Company', visual: 'nv-plant', min: 3,
      excerpt: 'Four properties, headboard clusters and wet zones — phase one completes March 2027.',
      body: [
        'Grand Meridian Hotels specified AXIOM across 1 400 rooms in four properties — headboard clusters, bathroom zones and back-of-house.',
        'Bedside control clusters combine AXIS TOUCH 4-point stations with dim glow states; 2 mm shadow-gap frames align with walnut veneer headwalls.',
        'Phase one (620 rooms) completes in March 2027; the finish archive holds the batch for phase two.',
      ] },
    knx2: { title: 'AX-BUS gateway 2.0 with native KNX TP1', date: '15 July 2026', dateLabel: 'JUL 15 2026', cat: 'products', catLabel: 'Products', visual: 'nv-product', min: 2,
      excerpt: 'Scenes still execute on the line; the gateway exposes groups to the building level only.',
      body: [
        'Gateway 2.0 couples AX-BUS lines to KNX TP1 natively — no protocol converters, no vendor lock on the higher level.',
        'Scene logic still executes locally on the line; the gateway exposes groups for building management and visualisation only.',
        'Shipping from October; existing lines update over the bus.',
      ] },
    archive10: { title: 'The ten-year finish archive goes digital', date: '22 June 2026', dateLabel: 'JUN 22 2026', cat: 'technical', catLabel: 'Technical', visual: 'nv-lab', min: 2,
      excerpt: 'Every batch since 2016 queryable by project — re-orders matched spectrally before dispatch.',
      body: [
        'Every finish batch since 2016 is now queryable online: code, quarry lot, anodize bath, lacquer mix — searchable by project.',
        'A re-order against an archived batch is matched spectrally before dispatch; deviation beyond ΔE 1.5 triggers re-finishing, not shipping.',
        'Access is via the specification desk with a project reference.',
      ] },
    bau2026: { title: 'BAU 2026 Munich: FLUSH ZERO live build-ups', date: '5 June 2026', dateLabel: 'JUN 05 2026', cat: 'fairs', catLabel: 'Fairs', visual: 'nv-fair', min: 2,
      excerpt: 'Skim-coat walls plastered on stand in Hall C2 — finished during the fair, switching daily.',
      body: [
        'At BAU 2026 (Hall C2) AXIOM builds FLUSH ZERO into live skim-coat walls — plastered on stand, finished during the fair.',
        'Daily 10:00 demonstrations show the coordination between electrical rough-in and plaster programme; details downloadable on stand.',
        'The SOLID 70 retrofit program is shown for exposed concrete conditions.',
      ] },
    sb01: { title: 'STONE LINE extends: SB-01 basalt, TM-01 marble', date: '19 May 2026', dateLabel: 'MAY 19 2026', cat: 'products', catLabel: 'Products', visual: 'nv-product', min: 2,
      excerpt: 'Two stone fronts join the 8 mm bonded composite program, batch-matched as standard.',
      body: [
        'Two stone fronts join STONE LINE: dark SB-01 basalt and veined TM-01 marble bianco, both on the 8 mm bonded composite.',
        'Both stones are batch-matched like the sandstone program; quarry lots are archived for ten years.',
        'Available from May in switch, dimmer and socket configurations.',
      ] },
    enec: { title: 'In-house lab accredited for ENEC+ routine testing', date: '28 April 2026', dateLabel: 'APR 28 2026', cat: 'company', catLabel: 'Company', visual: 'nv-plant', min: 2,
      excerpt: 'Type tests and routine audits now run on-site; 24 stations cycle continuously.',
      body: [
        'The Meinerzhagen laboratory is accredited for ENEC+ routine testing — type tests and routine audits now run in-house.',
        'The rig cycles 24 rocker stations continuously; 120 000-operation results feed the certification file directly.',
        'External audits remain annual, as required by the scheme.',
      ] },
    tender: { title: 'Tender texts 2026: DIN-aligned modules', date: '31 March 2026', dateLabel: 'MAR 31 2026', cat: 'technical', catLabel: 'Technical', visual: 'nv-lab', min: 2,
      excerpt: 'Copy-ready specification modules per family and function, as DOCX and GAEB.',
      body: [
        'The 2026 tender text set aligns AXIOM specification modules with current DIN tender structure — copy-ready per family and function.',
        'Modules cover mounting conditions, finish codes and control topology; consultants assemble specifications by reference, not by rewriting.',
        'Available as DOCX and GAEB; linked from every product page.',
      ] },
    award: { title: 'LINEA 55 receives Materials in Architecture award', date: '17 February 2026', dateLabel: 'FEB 17 2026', cat: 'company', catLabel: 'Company', visual: 'nv-product', min: 2,
      excerpt: 'Cited for batch control and wall-plane integration in the electrical systems category.',
      body: [
        'LINEA 55 receives the Materials in Architecture award in the electrical systems category — cited for batch control and wall-plane integration.',
        'The jury noted the archive principle: a finish specified in 2016 remains orderable, spectrally matched, in 2026.',
        'The award is displayed at Light + Building on stand E40.',
      ] },
  };
  const NEWS_ORDER = ['lb2026', 'usb45', 'plant2', 'bim2026', 'meridian', 'knx2', 'archive10', 'bau2026', 'sb01', 'enec', 'tender', 'award'];

  // news list page
  const newsList = $('#news-list');
  if (newsList) {
    const newsCard = (k) => {
      const a = NEWS_LIBRARY[k];
      return `<article class="news-card">
        <figure class="news-card__figure"><svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><use href="#${a.visual}"/></svg></figure>
        <p class="news-meta"><span>${a.dateLabel}</span><span class="tag">${a.catLabel}</span></p>
        <h3>${a.title}</h3>
        <p class="excerpt">${a.excerpt}</p>
        <a class="card-link" href="article.html?n=${k}">Read Article</a>
      </article>`;
    };
    const newsFeatured = (k) => {
      const a = NEWS_LIBRARY[k];
      return `<article class="news-featured">
        <figure class="news-featured__figure"><svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><use href="#${a.visual}"/></svg></figure>
        <div class="news-featured__body">
          <p class="news-meta"><span>${a.dateLabel}</span><span class="tag">${a.catLabel}</span></p>
          <h2>${a.title}</h2>
          <p class="excerpt">${a.excerpt}</p>
          <a class="card-link" href="article.html?n=${k}">Read Article</a>
        </div>
      </article>`;
    };
    const renderNews = (cat) => {
      const keys = NEWS_ORDER.filter((k) => cat === 'all' || NEWS_LIBRARY[k].cat === cat);
      if (!keys.length) {
        $('#news-count').textContent = 'NO ENTRIES';
        newsList.innerHTML = '<div class="archive__empty"><p class="eyebrow">No Results</p><h3>No entries in this category.</h3></div>';
        return;
      }
      $('#news-count').textContent = `SHOWING ${keys.length} OF ${NEWS_ORDER.length} ENTRIES`;
      newsList.innerHTML = newsFeatured(keys[0]) +
        `<div class="news-grid">${keys.slice(1).map(newsCard).join('')}</div>`;
    };
    $$('#news-page .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        $$('#news-page .chip').forEach((c) => {
          c.classList.toggle('is-active', c === chip);
          c.setAttribute('aria-pressed', String(c === chip));
        });
        renderNews(chip.dataset.filter);
      });
    });
  }

  // single article page
  const articlePage = $('#article-page');
  if (articlePage) {
    const slug = new URLSearchParams(window.location.search).get('n');
    const a = (slug && NEWS_LIBRARY[slug]) ? NEWS_LIBRARY[slug] : NEWS_LIBRARY[NEWS_ORDER[0]];

    document.title = `${a.title} — AXIOM News`;
    $('#an-title').textContent = a.title;
    $('#an-date').textContent = a.dateLabel;
    $('#an-cat').textContent = a.catLabel;
    $('#an-banner-meta').innerHTML = `NEWSROOM · ${a.dateLabel}<br>${a.min} MIN READ`;
    $('#an-visual').setAttribute('href', `#${a.visual}`);
    $('#an-aside-date').textContent = a.date;
    $('#an-aside-cat').textContent = a.catLabel;
    $('#an-aside-min').textContent = `${a.min} minutes`;
    $('#an-related-cat').textContent = a.catLabel;

    const bodyEl = $('.article-body', articlePage);
    let html = `<p class="lead">${a.body[0]}</p>`;
    a.body.slice(1).forEach((para, i) => {
      html += `<p>${para}</p>`;
      if (a.quote && i === 1) {
        html += `<blockquote class="pull-quote"><p>“${a.quote.text}”</p><cite>${a.quote.by}</cite></blockquote>`;
      }
    });
    bodyEl.innerHTML = html;

    const related = NEWS_ORDER.filter((k) => k !== (slug || 'lb2026') && NEWS_LIBRARY[k].cat === a.cat).slice(0, 3);
    $('#an-related').innerHTML = related.map((k) => {
      const r = NEWS_LIBRARY[k];
      return `<article class="news-card">
        <figure class="news-card__figure"><svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><use href="#${r.visual}"/></svg></figure>
        <p class="news-meta"><span>${r.dateLabel}</span><span class="tag">${r.catLabel}</span></p>
        <h3>${r.title}</h3>
        <a class="card-link" href="article.html?n=${k}">Read Article</a>
      </article>`;
    }).join('');
  }

  /* ---------- 12. Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
