/* ============================================================================
   SHANYIN 山隐 — interaction layer
   ----------------------------------------------------------------------------
   Vanilla JS, no dependencies. Seven small modules, each one optional: if a
   module's markup is missing, it exits quietly.

   1. header      — paper tab on scroll, auto-hide on scroll down
   2. progress    — 1px reading progress along the top edge
   3. menu        — overlay navigation, focus management, scroll lock
   4. reveal      — IntersectionObserver entrances with per-group stagger
   5. parallax    — very light, capped, transform-only, rAF-throttled
   6. form        — inline validation + optimistic success state
   7. marquee     — duplicate the track so the -50% loop is seamless

   Every animation here is disabled under `prefers-reduced-motion: reduce`.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersReduced = function () { return reduceMotion.matches; };

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ---------------------------------------------------------------- 1. HEAD */
  (function header() {
    var head = $('[data-head]');
    if (!head) return;

    var lastY = window.scrollY;
    var hidden = false;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      var menuOpen = document.body.classList.contains('is-locked');

      head.classList.toggle('is-scrolled', y > 40);

      // Auto-hide only while descending, past the hero, and never with a menu open
      if (!menuOpen && y > 260 && y > lastY + 4) {
        if (!hidden) { head.classList.add('is-hidden'); hidden = true; }
      } else if (y < lastY - 4 || menuOpen) {
        if (hidden) { head.classList.remove('is-hidden'); hidden = false; }
      }

      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });

    update();
  })();

  /* ------------------------------------------------------- 2. PROGRESS BAR */
  (function progress() {
    var bar = $('[data-progress]');
    if (!bar) return;

    var ticking = false;

    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = 'scaleX(' + ratio + ')';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
  })();

  /* ---------------------------------------------------------------- 3. MENU */
  (function menu() {
    var burger = $('[data-burger]');
    var panel  = $('[data-menu]');
    if (!burger || !panel) return;

    var firstLink = $('.menu__list a', panel);
    var closeTimer = null;

    function scrollbarWidth() {
      return window.innerWidth - document.documentElement.clientWidth;
    }

    function open() {
      window.clearTimeout(closeTimer);
      panel.hidden = false;
      document.body.classList.add('is-locked');
      document.body.style.paddingRight = scrollbarWidth() + 'px';
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      // One frame so the opacity transition actually runs
      window.requestAnimationFrame(function () { panel.classList.add('is-open'); });
      if (firstLink) window.setTimeout(function () { firstLink.focus(); }, 60);
    }

    function close(returnFocus) {
      panel.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      document.body.style.paddingRight = '';
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      closeTimer = window.setTimeout(function () {
        panel.hidden = true;
      }, 340);
      if (returnFocus) burger.focus();
    }

    burger.addEventListener('click', function () {
      var isOpen = burger.getAttribute('aria-expanded') === 'true';
      isOpen ? close(true) : open();
    });

    // Any in-page link closes the menu
    $$('a', panel).forEach(function (a) {
      a.addEventListener('click', function () { close(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) close(true);
    });

    // Keep Tab inside the overlay while it is open
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = $$('a[href], button', panel).filter(function (el) {
        return el.offsetParent !== null;
      });
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    // Close if the viewport grows back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100 && panel.classList.contains('is-open')) close(false);
    });
  })();

  /* -------------------------------------------------------------- 4. REVEAL */
  (function reveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (prefersReduced() || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    // Stagger: siblings inside a [data-stagger] group cascade at 90ms
    items.forEach(function (el) {
      var group = el.closest('[data-stagger]');
      if (!group) return;
      var siblings = $$('.reveal', group);
      var i = siblings.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i * 90, 450) + 'ms';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  })();

  /* ------------------------------------------------------------ 5. PARALLAX */
  (function parallax() {
    var targets = $$('[data-parallax]');
    if (!targets.length || prefersReduced()) return;

    // Touch devices scroll the page, not the plate — skip the work entirely
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.innerWidth < 861) return;

    var ticking = false;
    var MAX = 18; // px — small enough that the 1.08 zoom never exposes an edge

    function update() {
      var vh = window.innerHeight;

      targets.forEach(function (el) {
        var rect = el.getBoundingClientRect();

        // Ignore anything far outside the viewport
        if (rect.bottom < -200 || rect.top > vh + 200) return;

        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.04;
        var mid = rect.top + rect.height / 2 - vh / 2;
        var y = Math.max(-MAX, Math.min(MAX, -mid * speed));

        el.style.transform = 'translate3d(0,' + y.toFixed(2) + 'px,0) scale(1.08)';
      });

      ticking = false;
    }

    function schedule() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

    // If the user flips reduced-motion on mid-session, drop all transforms
    var onChange = function () {
      if (!prefersReduced()) return;
      targets.forEach(function (el) { el.style.transform = ''; });
      window.removeEventListener('scroll', schedule);
    };
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onChange);
  })();

  /* ---------------------------------------------------------------- 6. FORM */
  (function form() {
    var form = $('[data-form]');
    if (!form) return;

    var ok = $('[data-form-ok]', form);
    var submit = $('button[type="submit"]', form);
    var nameInput = $('#f-name', form);
    var msgInput = $('#f-message', form);

    function fieldOf(input) { return input.closest('.field'); }

    function setError(input, message) {
      var field = fieldOf(input);
      var slot = $('[data-err-for="' + input.id + '"]', field);
      field.classList.toggle('is-invalid', Boolean(message));
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (slot) slot.textContent = message || '';
    }

    function validate() {
      var firstBad = null;

      if (nameInput && !nameInput.value.trim()) {
        setError(nameInput, 'Please tell us your name.');
        firstBad = firstBad || nameInput;
      } else if (nameInput) {
        setError(nameInput, '');
      }

      if (msgInput && msgInput.value.trim().length < 4) {
        setError(msgInput, 'A line or two about your interest is enough.');
        firstBad = firstBad || msgInput;
      } else if (msgInput) {
        setError(msgInput, '');
      }

      if (firstBad) { firstBad.focus(); return false; }
      return true;
    }

    // Clear the error as soon as the visitor starts fixing it
    [nameInput, msgInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('input', function () {
        if (fieldOf(input).classList.contains('is-invalid')) setError(input, '');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      // Optimistic, no-backend success state. Swap this block for fetch() when
      // the endpoint exists — everything above stays the same.
      if (submit) {
        submit.dataset.state = 'sending';
        submit.textContent = 'Sending…';
      }

      window.setTimeout(function () {
        if (submit) {
          delete submit.dataset.state;
          submit.textContent = 'Send enquiry';
        }
        form.reset();
        if (ok) {
          ok.hidden = false;
          ok.scrollIntoView({ block: 'nearest', behavior: prefersReduced() ? 'auto' : 'smooth' });
        }
      }, 700);
    });
  })();

  /* ------------------------------------------------------------- 7. MARQUEE */
  (function marquee() {
    var track = $('[data-marquee]');
    if (!track || prefersReduced()) return;

    // Duplicate every child once so translateX(-50%) lands on the start of the
    // repeat. The clones are decorative: hidden from assistive tech, so the
    // ports are announced once, not twice.
    var originals = Array.prototype.slice.call(track.children);
    var frag = document.createDocumentFragment();

    originals.forEach(function (node) {
      var clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      frag.appendChild(clone);
    });

    track.appendChild(frag);
  })();

})();
