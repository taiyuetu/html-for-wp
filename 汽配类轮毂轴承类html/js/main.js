    'use strict';

    /* ----------------------------------------------------------
       MODULE: Header — Sticky + Scroll Shrink
    ---------------------------------------------------------- */
    (function initHeader() {
      const header = document.getElementById('header');
      const hamburger = document.getElementById('hamburger');
      const mobileNav = document.getElementById('mobileNav');
      const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
      let lastScroll = 0;

      window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
      }, { passive: true });

      // Hamburger toggle
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        mobileNav.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close mobile nav on link click
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileNav.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          mobileNav.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        });
      });

      function closeDropdowns(except = null) {
        dropdowns.forEach(dropdown => {
          if (dropdown === except) return;
          dropdown.classList.remove('open');
          const toggle = dropdown.querySelector('.nav-dropdown-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
      }

      dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', (event) => {
          event.preventDefault();
          const isOpen = dropdown.classList.contains('open');
          closeDropdowns(dropdown);
          dropdown.classList.toggle('open', !isOpen);
          toggle.setAttribute('aria-expanded', String(!isOpen));
        });

        dropdown.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            closeDropdowns();
          });
        });
      });

      document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-dropdown')) {
          closeDropdowns();
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeDropdowns();
      });
    })();

    /* ----------------------------------------------------------
       MODULE: Product Details - Gallery + Tabs
    ---------------------------------------------------------- */
    (function initProductDetails() {
      const gallery = document.querySelector('[data-product-gallery]');
      const mainImage = document.getElementById('productMainImage');
      const thumbs = Array.from(document.querySelectorAll('[data-product-thumb]'));
      const tabRoot = document.querySelector('[data-product-tabs]');
      if (!gallery || !mainImage) return;

      function activateThumb(thumb) {
        thumbs.forEach(item => item.classList.toggle('is-active', item === thumb));
        const nextImage = thumb.dataset.image;
        if (nextImage) mainImage.src = nextImage;
        if (thumb.dataset.alt) mainImage.alt = thumb.dataset.alt;
      }

      thumbs.forEach(thumb => {
        thumb.addEventListener('mouseenter', () => activateThumb(thumb));
        thumb.addEventListener('focus', () => activateThumb(thumb));
        thumb.addEventListener('click', () => activateThumb(thumb));
      });

      if (!tabRoot) return;
      const tabs = Array.from(tabRoot.querySelectorAll('[data-tab-target]'));
      const panels = Array.from(tabRoot.querySelectorAll('[data-tab-panel]'));

      function activateTab(name) {
        tabs.forEach(tab => {
          const isActive = tab.dataset.tabTarget === name;
          tab.classList.toggle('is-active', isActive);
          tab.setAttribute('aria-selected', String(isActive));
        });
        panels.forEach(panel => {
          const isActive = panel.dataset.tabPanel === name;
          panel.classList.toggle('is-active', isActive);
          panel.hidden = !isActive;
        });
      }

      tabs.forEach(tab => {
        tab.addEventListener('click', () => activateTab(tab.dataset.tabTarget));
      });
    })();

    /* ----------------------------------------------------------
       MODULE: Hero Slider – Auto-play, Dots, Arrows
    ---------------------------------------------------------- */
    (function initHeroSlider() {
      const slides = document.querySelectorAll('.hero-slide');
      const dots = document.querySelectorAll('.hero-dot');
      const prevBtn = document.getElementById('heroPrev');
      const nextBtn = document.getElementById('heroNext');
      const hero = document.getElementById('hero');
      if (!slides.length || !dots.length || !prevBtn || !nextBtn || !hero) return;

      let currentSlide = 0;
      let autoPlayTimer = null;
      const AUTOPLAY_DURATION = 6000;

      function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        dots[currentSlide].setAttribute('aria-selected', 'false');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-selected', 'true');
      }

      function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(() => goToSlide(currentSlide + 1), AUTOPLAY_DURATION);
      }

      function stopAutoPlay() {
        clearInterval(autoPlayTimer);
      }

      // Dot controls
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          goToSlide(i);
          startAutoPlay();
        });
      });

      // Arrow controls
      prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoPlay(); });
      nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoPlay(); });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { goToSlide(currentSlide - 1); startAutoPlay(); }
        if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); startAutoPlay(); }
      });

      // Touch / swipe support
      let touchStartX = 0;
      hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      hero.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
          startAutoPlay();
        }
      }, { passive: true });

      // Pause on hover
      hero.addEventListener('mouseenter', stopAutoPlay);
      hero.addEventListener('mouseleave', startAutoPlay);

      startAutoPlay();
    })();

    /* ----------------------------------------------------------
       MODULE: Scroll Reveal — Intersection Observer
    ---------------------------------------------------------- */
    (function initScrollReveal() {
      const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
      });

      targets.forEach(target => observer.observe(target));
    })();

    /* ----------------------------------------------------------
       MODULE: Count-Up Animation — Stats Section
    ---------------------------------------------------------- */
    (function initCountUp() {
      const counters = document.querySelectorAll('.count-up');
      const duration = 2000; // ms

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const start = Date.now();

          function tick() {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          }

          requestAnimationFrame(tick);
          observer.unobserve(el);
        });
      }, { threshold: 0.5 });

      counters.forEach(c => observer.observe(c));
    })();

    /* ----------------------------------------------------------
       MODULE: Image Showcase Carousel
    ---------------------------------------------------------- */
    (function initShowcase() {
      const wrap = document.getElementById('showcaseWrap');
      const track = document.getElementById('showcaseTrack');
      const prevBtn = document.getElementById('scPrev');
      const nextBtn = document.getElementById('scNext');
      const progressBar = document.getElementById('scProgressBar');
      if (!wrap || !track || !prevBtn || !nextBtn || !progressBar) return;

      const items = track.querySelectorAll('.showcase-item');
      const totalItems = items.length;
      if (!totalItems) return;
      let currentOffset = 0;
      let autoTimer = null;
      const AUTO_DELAY = 3500;

      function getItemWidth() {
        if (items.length === 0) return 0;
        return items[0].getBoundingClientRect().width + 16; // gap
      }

      function getMaxOffset() {
        return Math.max(0, totalItems - 3.5);
      }

      function setOffset(offset) {
        currentOffset = Math.max(0, Math.min(offset, getMaxOffset()));
        const px = currentOffset * getItemWidth();
        track.style.transform = `translateX(-${px}px)`;
        const pct = (currentOffset / getMaxOffset()) * 100;
        progressBar.style.width = Math.max(16.6, pct) + '%';
      }

      function next() { setOffset(currentOffset + 1); }
      function prev() { setOffset(currentOffset - 1); }

      function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => {
          if (currentOffset >= getMaxOffset()) setOffset(0);
          else next();
        }, AUTO_DELAY);
      }
      function stopAuto() { clearInterval(autoTimer); }

      nextBtn.addEventListener('click', () => { next(); startAuto(); });
      prevBtn.addEventListener('click', () => { prev(); startAuto(); });

      // Drag / touch scroll
      let isDragging = false;
      let dragStartX = 0;
      let dragStartOffset = 0;

      wrap.addEventListener('mousedown', e => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartOffset = currentOffset;
        wrap.classList.add('dragging');
        stopAuto();
      });
      document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const delta = dragStartX - e.clientX;
        const itemW = getItemWidth();
        setOffset(dragStartOffset + delta / itemW);
      });
      document.addEventListener('mouseup', () => {
        if (isDragging) { isDragging = false; wrap.classList.remove('dragging'); startAuto(); }
      });

      wrap.addEventListener('touchstart', e => {
        dragStartX = e.touches[0].clientX;
        dragStartOffset = currentOffset;
        stopAuto();
      }, { passive: true });
      wrap.addEventListener('touchmove', e => {
        const delta = dragStartX - e.touches[0].clientX;
        setOffset(dragStartOffset + delta / getItemWidth());
      }, { passive: true });
      wrap.addEventListener('touchend', () => startAuto(), { passive: true });

      wrap.addEventListener('mouseenter', stopAuto);
      wrap.addEventListener('mouseleave', startAuto);

      startAuto();
    })();

    /* ----------------------------------------------------------
       MODULE: Contact Form — Validation + Submit
    ---------------------------------------------------------- */
    (function initContactForm() {
      const form = document.getElementById('contactForm');
      const successBox = document.getElementById('formSuccess');
      if (!form) return;

      const rules = {
        fname:   { required: true },
        lname:   { required: true },
        email:   { required: true, email: true },
        company: { required: true },
        message: { required: true }
      };

      function validateEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      }

      function validateField(field) {
        const name = field.name;
        const rule = rules[name];
        if (!rule) return true;

        const val = field.value.trim();
        const group = field.closest('.form-group');
        let valid = true;

        if (rule.required && !val) valid = false;
        if (rule.email && val && !validateEmail(val)) valid = false;

        group.classList.toggle('has-error', !valid);
        field.classList.toggle('error', !valid);
        return valid;
      }

      // Real-time validation on blur
      form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('error')) validateField(field);
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        let allValid = true;
        Object.keys(rules).forEach(name => {
          const field = form.elements[name];
          if (field && !validateField(field)) allValid = false;
        });

        if (allValid) {
          form.style.display = 'none';
          successBox.classList.add('show');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    })();

    /* ----------------------------------------------------------
       MODULE: Smooth Anchor Scroll (respects header offset)
    ---------------------------------------------------------- */
    (function initSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
          const top = target.getBoundingClientRect().top + window.scrollY - headerH;
          window.scrollTo({ top, behavior: 'smooth' });
        });
      });
    })();

    /* ----------------------------------------------------------
       MODULE: Lazy-Load (native + fallback polyfill shim)
    ---------------------------------------------------------- */
    (function initLazyLoad() {
      // All imgs get loading="lazy" attribute programmatically
      document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
      });
    })();
