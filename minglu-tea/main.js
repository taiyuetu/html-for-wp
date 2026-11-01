/* ═══════════════════════════════════════════════════════
   MÍNG LÙ — main.js
   Scroll reveals · Nav · Parallax · Form
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── NAV SCROLL BEHAVIOUR ──────────────────────────── */
  const nav = document.getElementById('siteNav');

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ─── MOBILE NAV TOGGLE ─────────────────────────────── */
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.querySelector('.nav-links');
  let navOpen = false;

  hamburger?.addEventListener('click', () => {
    navOpen = !navOpen;
    if (navOpen) {
      navLinks.style.cssText = `
        display: flex;
        flex-direction: column;
        position: fixed;
        top: var(--nav-h);
        left: 0; right: 0;
        background: rgba(15,42,31,0.97);
        backdrop-filter: blur(12px);
        padding: 40px var(--gutter);
        gap: 24px;
        z-index: 99;
        animation: navFadeIn 0.3s ease;
      `;
      navLinks.querySelectorAll('a').forEach(a => {
        a.style.fontSize = '14px';
        a.style.letterSpacing = '0.15em';
      });
      hamburger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      hamburger.children[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      navLinks.style.display = 'none';
      hamburger.children[0].style.transform = '';
      hamburger.children[1].style.transform = '';
    }
  });

  // Close nav on link click
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navOpen = false;
      navLinks.style.display = 'none';
      hamburger.children[0].style.transform = '';
      hamburger.children[1].style.transform = '';
    });
  });

  /* ─── SCROLL REVEAL ─────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.reveal-fade, .reveal-up, .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── HERO — SUBTLE MOUSE PARALLAX ──────────────────── */
  const heroInner = document.querySelector('.hero__img-inner');
  const heroFog   = document.querySelector('.hero__fog');

  if (heroInner) {
    let ticking = false;
    let mx = 0, my = 0;

    document.addEventListener('mousemove', (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!ticking) {
        requestAnimationFrame(() => {
          const tx = mx * 8;
          const ty = my * 6;
          heroInner.style.transform = `translate(${tx}px, ${ty}px) scale(1.04)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ─── SCROLL PARALLAX (hero fog + section images) ───── */
  function onScroll() {
    const scrollY = window.scrollY;

    // Hero scroll fade
    const hero = document.querySelector('.hero__content');
    if (hero) {
      const opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.6));
      hero.style.opacity = opacity;
      hero.style.transform = `translateY(${scrollY * 0.18}px)`;
    }

    // Light parallax on image frames
    document.querySelectorAll('.img-frame .img-placeholder').forEach(el => {
      const rect = el.closest('.img-frame').getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const delta = (center - viewCenter) / window.innerHeight;
      el.style.transform = `translateY(${delta * 28}px) scale(1.04)`;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─── TEA CARD HOVER TILT ────────────────────────────── */
  document.querySelectorAll('.tea-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `
        translateY(-6px)
        rotateX(${-dy * 3}deg)
        rotateY(${dx * 3}deg)
      `;
      card.style.transition = 'transform 0.1s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });
  });

  /* ─── CONTACT FORM ───────────────────────────────────── */
  const form    = document.getElementById('contactForm');
  const confirm = document.getElementById('formConfirm');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate async send
    setTimeout(() => {
      form.style.display = 'none';
      confirm.classList.add('visible');
    }, 1200);
  });

  /* ─── SMOOTH ANCHOR SCROLL ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── SECTION NUMBER FADE-IN ON LOAD ─────────────────── */
  document.querySelectorAll('.section-num').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.05}s`;
  });

  /* ─── CRAFT STEP — stagger on enter ─────────────────── */
  const craftObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const steps = entry.target.querySelectorAll('.craft__step');
        steps.forEach((step, i) => {
          setTimeout(() => {
            step.querySelectorAll('.reveal-left, .reveal-right, .reveal-fade').forEach(el => {
              el.classList.add('visible');
            });
          }, i * 150);
        });
        craftObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  const craftSteps = document.querySelector('.craft__steps');
  if (craftSteps) craftObserver.observe(craftSteps);

  /* ─── WORLD MAP — dot pulse animation ────────────────── */
  const mapDots = document.querySelectorAll('.world-map-svg circle');
  mapDots.forEach((dot, i) => {
    dot.style.animation = `dotPulse ${2 + (i % 4) * 0.5}s ease-in-out ${(i * 0.12) % 2}s infinite`;
  });

  // Inject keyframes for dot pulse
  const style = document.createElement('style');
  style.textContent = `
    @keyframes dotPulse {
      0%, 100% { opacity: var(--base-op, 0.8); r: var(--base-r, 3); }
      50%       { opacity: 1; }
    }
    @keyframes navFadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: none; }
    }
  `;
  document.head.appendChild(style);

  /* ─── INIT ───────────────────────────────────────────── */
  // Trigger initial reveals for above-fold elements
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-fade, .hero .reveal-up').forEach(el => {
      el.classList.add('visible');
    });
  }, 200);

})();
