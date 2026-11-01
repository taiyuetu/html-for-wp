/* ============================================================
   Nexora Industrial — vanilla JavaScript
   Replaces the React (Next.js) client-side logic
   ============================================================ */
(function () {
  'use strict';

  var $ = function (selector) { return document.querySelector(selector); };
  var $$ = function (selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); };

  /* ---------- Data ---------- */
  var heroSlides = [
    { eyebrow: 'Global manufacturing excellence', title: 'Engineered for the world.', text: 'Advanced manufacturing solutions built for reliability, precision and long-term performance.' },
    { eyebrow: 'Precision engineering', title: 'Built to perform. Built to last.', text: 'From first specification to final inspection, every detail is made to move industries forward.' },
    { eyebrow: 'Global supply network', title: 'From our factories to the world.', text: 'A responsive, dependable supply partner for customers across automotive and industrial markets.' }
  ];

  var galleryImages = [
    ['Advanced manufacturing facility', 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1600&q=85'],
    ['Precision quality inspection', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85'],
    ['Global distribution center', 'https://images.unsplash.com/photo-1586528116493-da8b3a4d7e1e?auto=format&fit=crop&w=1200&q=85']
  ];

  var PRODUCT_COUNT = 4; // total product cards

  /* ---------- Header scroll state ---------- */
  function onScroll() {
    document.body.classList.toggle('scrolled', window.scrollY > 32);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Hero slider ---------- */
  var heroImages = $$('.hero-image');
  var slide = 0;
  var heroTimer = null;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function renderHero() {
    heroImages.forEach(function (img, index) {
      img.classList.toggle('active', index === slide);
    });
    var active = heroSlides[slide];
    $('#hero-eyebrow').textContent = active.eyebrow;
    $('#hero-title').textContent = active.title;
    $('#hero-text').textContent = active.text;
    $('#slide-current').textContent = pad(slide + 1);
    $('#hero-progress-bar').style.width = ((slide + 1) / heroSlides.length) * 100 + '%';
  }

  function goToSlide(next) {
    slide = (next + heroSlides.length) % heroSlides.length;
    renderHero();
    restartHeroTimer();
  }

  function restartHeroTimer() {
    if (heroTimer) window.clearInterval(heroTimer);
    heroTimer = window.setInterval(function () {
      slide = (slide + 1) % heroSlides.length;
      renderHero();
    }, 6500);
  }

  $('#hero-prev').addEventListener('click', function () { goToSlide(slide - 1); });
  $('#hero-next').addEventListener('click', function () { goToSlide(slide + 1); });
  renderHero();
  restartHeroTimer();

  /* ---------- Mobile menu ---------- */
  var menuToggle = $('#menu-toggle');
  var mainNav = $('#main-nav');

  function setMenu(open) {
    mainNav.classList.toggle('open', open);
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  menuToggle.addEventListener('click', function () {
    setMenu(!mainNav.classList.contains('open'));
  });

  // Close the mobile menu when a nav link is clicked
  $$('[data-nav-link]').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  /* ---------- Products mega menu ---------- */
  var productsButton = $('#nav-products');
  var megaMenu = $('#mega-menu');

  productsButton.addEventListener('click', function () {
    var open = megaMenu.hidden;
    megaMenu.hidden = !open;
    productsButton.classList.toggle('active', open);
    productsButton.setAttribute('aria-expanded', String(open));
  });

  // Close mega menu when clicking outside
  document.addEventListener('click', function (event) {
    if (!megaMenu.hidden && !megaMenu.contains(event.target) && !productsButton.contains(event.target)) {
      megaMenu.hidden = true;
      productsButton.classList.remove('active');
      productsButton.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Product carousel ---------- */
  var productStart = 0;
  var productTrack = $('#product-track');

  function moveProducts(direction) {
    productStart = Math.max(0, Math.min(PRODUCT_COUNT - 1, productStart + direction));
    productTrack.style.transform = 'translateX(calc(-' + productStart + ' * (var(--card-width) + 24px)))';
  }

  $('#products-prev').addEventListener('click', function () { moveProducts(-1); });
  $('#products-next').addEventListener('click', function () { moveProducts(1); });

  /* ---------- Gallery ---------- */
  var galleryIndex = 0;

  function renderGallery() {
    var item = galleryImages[galleryIndex];
    var image = $('#gallery-image');
    image.src = item[1];
    image.alt = item[0];
    $('#gallery-count').textContent = pad(galleryIndex + 1) + ' / ' + pad(galleryImages.length);
    $('#gallery-title').textContent = item[0];
  }

  $('#gallery-prev').addEventListener('click', function () {
    galleryIndex = (galleryIndex + galleryImages.length - 1) % galleryImages.length;
    renderGallery();
  });
  $('#gallery-next').addEventListener('click', function () {
    galleryIndex = (galleryIndex + 1) % galleryImages.length;
    renderGallery();
  });

  /* ---------- Inquiry form ---------- */
  var form = $('#inquiry-form');
  var formFields = $('#form-fields');
  var successState = $('#success-state');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    formFields.hidden = true;
    successState.hidden = false;
  });

  $('#send-another').addEventListener('click', function () {
    form.reset();
    successState.hidden = true;
    formFields.hidden = false;
  });
})();
