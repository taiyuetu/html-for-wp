/* ============================================================
   PREMIUM AUTOMOTIVE INDUSTRIAL MANUFACTURER WEBSITE
   JavaScript: All Interactive Features
   Company: Apex Bearing Technologies
   ============================================================ */

(function () {
    'use strict';

    /* ==========================================================
       DOM REFERENCES (Cached for Performance)
       ========================================================== */
    const DOM = {
        loader: document.getElementById('loader'),
        header: document.getElementById('header'),
        hamburger: document.getElementById('hamburger'),
        mobileMenu: document.getElementById('mobileMenu'),
        mainNav: document.getElementById('mainNav'),
        searchToggle: document.getElementById('searchToggle'),
        searchOverlay: document.getElementById('searchOverlay'),
        searchClose: document.getElementById('searchClose'),
        searchInput: document.querySelector('.search-overlay__input'),
        themeToggle: document.getElementById('themeToggle'),
        backToTop: document.getElementById('backToTop'),
        testimonialTrack: document.getElementById('testimonialTrack'),
        testimonialPrev: document.getElementById('testimonialPrev'),
        testimonialNext: document.getElementById('testimonialNext'),
        testimonialDots: document.getElementById('testimonialDots'),
        featuredGrid: document.getElementById('featuredGrid'),
        inquiryForm: document.getElementById('inquiryForm'),
        formSuccess: document.getElementById('formSuccess'),
        heroParticles: document.getElementById('heroParticles'),
        mobileMenuLinks: document.querySelectorAll('.mobile-menu__nav a, .mobile-menu__cta a'),
    };

    /* ==========================================================
       LOADING SCREEN
       ========================================================== */
    function initLoader() {
        // Remove loading state after page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                DOM.loader.classList.add('loader--hidden');
                document.body.classList.remove('loading');
                // Remove loader from DOM after transition
                DOM.loader.addEventListener('transitionend', () => {
                    // Keep in DOM but hidden for fast revisits
                }, { once: true });
            }, 600);
        });

        // Fallback: hide loader after 3 seconds max
        setTimeout(() => {
            if (!DOM.loader.classList.contains('loader--hidden')) {
                DOM.loader.classList.add('loader--hidden');
                document.body.classList.remove('loading');
            }
        }, 3000);
    }

    /* ==========================================================
       STICKY HEADER SCROLL EFFECT
       ========================================================== */
    function initStickyHeader() {
        let lastScroll = 0;
        const scrollThreshold = 80;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Add scrolled class for background
            if (scrollY > scrollThreshold) {
                DOM.header.classList.add('header--scrolled');
            } else {
                DOM.header.classList.remove('header--scrolled');
            }

            lastScroll = scrollY;
        }, { passive: true });
    }

    /* ==========================================================
       MOBILE MENU TOGGLE
       ========================================================== */
    function initMobileMenu() {
        DOM.hamburger.addEventListener('click', () => {
            const isActive = DOM.mobileMenu.classList.contains('mobile-menu--active');

            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close on link click
        DOM.mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.mobileMenu.classList.contains('mobile-menu--active')) {
                closeMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        DOM.mobileMenu.classList.add('mobile-menu--active');
        DOM.hamburger.classList.add('header__hamburger--active');
        DOM.hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        DOM.mobileMenu.classList.remove('mobile-menu--active');
        DOM.hamburger.classList.remove('header__hamburger--active');
        DOM.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /* ==========================================================
       SEARCH OVERLAY
       ========================================================== */
    function initSearch() {
        DOM.searchToggle.addEventListener('click', () => {
            const isActive = DOM.searchOverlay.classList.contains('search-overlay--active');
            if (isActive) {
                closeSearch();
            } else {
                openSearch();
            }
        });

        DOM.searchClose.addEventListener('click', closeSearch);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.searchOverlay.classList.contains('search-overlay--active')) {
                closeSearch();
            }
            // Ctrl+K / Cmd+K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
        });

        // Search functionality
        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('input', debounce(function () {
                const query = this.value.toLowerCase().trim();
                if (query.length >= 2) {
                    highlightSearchResults(query);
                }
            }, 300));
        }
    }

    function openSearch() {
        DOM.searchOverlay.classList.add('search-overlay--active');
        if (DOM.searchInput) {
            setTimeout(() => DOM.searchInput.focus(), 100);
        }
    }

    function closeSearch() {
        DOM.searchOverlay.classList.remove('search-overlay--active');
        if (DOM.searchInput) {
            DOM.searchInput.value = '';
        }
    }

    function highlightSearchResults(query) {
        // Simple search highlight - finds matching product cards
        const cards = document.querySelectorAll('.featured-card, .product-card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.style.outline = '2px solid var(--accent-primary)';
                card.style.outlineOffset = '2px';
                setTimeout(() => {
                    card.style.outline = '';
                    card.style.outlineOffset = '';
                }, 2000);
            }
        });
    }

    /* ==========================================================
       DARK / LIGHT MODE TOGGLE
       ========================================================== */
    function initThemeToggle() {
        // Check saved preference
        const savedTheme = localStorage.getItem('apex-theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // Check system preference
        if (!savedTheme) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }

        DOM.themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('apex-theme', next);
        });

        // Listen for system changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('apex-theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }

    /* ==========================================================
       ANIMATED COUNTERS (Intersection Observer)
       ========================================================== */
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    animateCounter(counter);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (target - startValue) * eased);

            counter.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString() + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    /* ==========================================================
       AOS - ANIMATE ON SCROLL (Intersection Observer)
       ========================================================== */
    function initAOS() {
        const elements = document.querySelectorAll('[data-aos]');
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.getAttribute('data-aos-delay');

                    if (delay) {
                        setTimeout(() => {
                            el.classList.add('aos-animate');
                        }, parseInt(delay, 10));
                    } else {
                        el.classList.add('aos-animate');
                    }

                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px',
        });

        elements.forEach(el => observer.observe(el));
    }

    /* ==========================================================
       PRODUCT FILTERING
       ========================================================== */
    function initProductFilters() {
        const filterBtns = document.querySelectorAll('.featured__filter');
        const cards = document.querySelectorAll('.featured-card');

        if (filterBtns.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('featured__filter--active'));
                btn.classList.add('featured__filter--active');

                const filter = btn.getAttribute('data-filter');

                // Filter cards
                cards.forEach((card, index) => {
                    card.style.transitionDelay = `${index * 50}ms`;

                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.classList.remove('hidden');
                        // Re-trigger animation
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    /* ==========================================================
       TESTIMONIALS CAROUSEL
       ========================================================== */
    function initTestimonialsCarousel() {
        const track = DOM.testimonialTrack;
        if (!track) return;

        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        let currentIndex = 0;
        let autoPlayInterval;

        // Create dots
        if (DOM.testimonialDots) {
            for (let i = 0; i < totalCards; i++) {
                const dot = document.createElement('button');
                dot.classList.add('testimonials__dot');
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                DOM.testimonialDots.appendChild(dot);
            }
            updateDots();
        }

        function goToSlide(index) {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = totalCards - 1;
            if (currentIndex >= totalCards) currentIndex = 0;

            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function updateDots() {
            const dots = DOM.testimonialDots.querySelectorAll('.testimonials__dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('testimonials__dot--active', i === currentIndex);
            });
        }

        // Navigation
        if (DOM.testimonialPrev) DOM.testimonialPrev.addEventListener('click', prevSlide);
        if (DOM.testimonialNext) DOM.testimonialNext.addEventListener('click', nextSlide);

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        }, { passive: true });

        // Auto-play
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        }

        startAutoPlay();

        // Pause on hover
        const carousel = document.querySelector('.testimonials__carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
    }

    /* ==========================================================
       FORM VALIDATION
       ========================================================== */
    function initFormValidation() {
        const form = DOM.inquiryForm;
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Clear previous errors
            clearFormErrors();

            // Validate
            const errors = validateForm(form);

            if (errors.length === 0) {
                // Success
                submitForm(form);
            } else {
                // Show errors
                errors.forEach(err => {
                    const field = form.querySelector(`#${err.field}`);
                    const errorSpan = field?.closest('.contact__field')?.querySelector('.contact__field-error');
                    if (field) field.closest('.contact__field').classList.add('contact__field--error');
                    if (errorSpan) errorSpan.textContent = err.message;
                });

                // Scroll to first error
                const firstError = form.querySelector('.contact__field--error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.querySelector('input, select, textarea')?.focus();
                }
            }
        });

        // Real-time validation on blur
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => {
                const fieldName = field.name;
                const value = field.value.trim();
                const errorSpan = field.closest('.contact__field')?.querySelector('.contact__field-error');
                const wrapper = field.closest('.contact__field');

                if (field.hasAttribute('required') && !value) {
                    wrapper?.classList.add('contact__field--error');
                    if (errorSpan) errorSpan.textContent = getFieldLabel(fieldName) + ' is required';
                } else if (fieldName === 'email' && value && !isValidEmail(value)) {
                    wrapper?.classList.add('contact__field--error');
                    if (errorSpan) errorSpan.textContent = 'Please enter a valid email address';
                } else {
                    wrapper?.classList.remove('contact__field--error');
                    if (errorSpan) errorSpan.textContent = '';
                }
            });
        });
    }

    function validateForm(form) {
        const errors = [];
        const data = new FormData(form);

        // Required fields
        const requiredFields = ['name', 'company', 'country', 'email', 'interest'];
        requiredFields.forEach(fieldName => {
            const value = data.get(fieldName)?.trim();
            if (!value) {
                errors.push({
                    field: fieldName,
                    message: getFieldLabel(fieldName) + ' is required',
                });
            }
        });

        // Email validation
        const email = data.get('email')?.trim();
        if (email && !isValidEmail(email)) {
            errors.push({
                field: 'email',
                message: 'Please enter a valid email address',
            });
        }

        return errors;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function getFieldLabel(fieldName) {
        const labels = {
            name: 'Full Name',
            company: 'Company',
            country: 'Country',
            email: 'Email',
            interest: 'Product Interest',
            message: 'Message',
        };
        return labels[fieldName] || fieldName;
    }

    function clearFormErrors() {
        DOM.inquiryForm.querySelectorAll('.contact__field--error').forEach(field => {
            field.classList.remove('contact__field--error');
        });
        DOM.inquiryForm.querySelectorAll('.contact__field-error').forEach(span => {
            span.textContent = '';
        });
    }

    function submitForm(form) {
        // Show success state
        const formFields = form.querySelectorAll('.contact__form-row, .contact__field, .contact__submit');
        formFields.forEach(el => {
            el.style.display = 'none';
        });

        if (DOM.formSuccess) {
            DOM.formSuccess.style.display = 'block';
            DOM.formSuccess.classList.add('show');
            DOM.formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // In production: send AJAX request here
        // fetch('/api/inquiry', { method: 'POST', body: new FormData(form) });

        // Reset after 8 seconds (demo)
        setTimeout(() => {
            if (DOM.formSuccess) {
                DOM.formSuccess.style.display = 'none';
                DOM.formSuccess.classList.remove('show');
            }
            formFields.forEach(el => {
                el.style.display = '';
            });
            form.reset();
        }, 8000);
    }

    /* ==========================================================
       BACK TO TOP BUTTON
       ========================================================== */
    function initBackToTop() {
        if (!DOM.backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                DOM.backToTop.classList.add('back-to-top--visible');
            } else {
                DOM.backToTop.classList.remove('back-to-top--visible');
            }
        }, { passive: true });

        DOM.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    }

    /* ==========================================================
       PARALLAX EFFECTS
       ========================================================== */
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.hero__bg-img, .distributor__bg img');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = 0.3;
                const offset = scrollY * speed;
                el.style.transform = `translateY(${offset}px) scale(1.05)`;
            });
        }, { passive: true });
    }

    /* ==========================================================
       HERO PARTICLES
       ========================================================== */
    function initHeroParticles() {
        const container = DOM.heroParticles;
        if (!container) return;

        const particleCount = 40;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero__particle');

            // Random properties
            const size = Math.random() * 3 + 1;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 15;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                bottom: -10px;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${Math.random() * 0.5 + 0.1};
            `;

            container.appendChild(particle);
        }
    }

    /* ==========================================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ========================================================== */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = DOM.header.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth',
                    });
                }
            });
        });
    }

    /* ==========================================================
       ACTIVE NAV LINK HIGHLIGHT ON SCROLL
       ========================================================== */
    function initActiveNavHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.header__nav-link');

        if (sections.length === 0 || navLinks.length === 0) return;

        window.addEventListener('scroll', () => {
            let current = '';
            const headerHeight = DOM.header.offsetHeight + 50;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    link.style.color = 'var(--accent-primary)';
                } else {
                    link.style.color = '';
                }
            });
        }, { passive: true });
    }

    /* ==========================================================
       UTILITY FUNCTIONS
       ========================================================== */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /* ==========================================================
       INITIALIZATION
       ========================================================== */
    function init() {
        // Set loading state
        document.body.classList.add('loading');

        // Initialize all features
        initLoader();
        initStickyHeader();
        initMobileMenu();
        initSearch();
        initThemeToggle();
        initCounters();
        initAOS();
        initProductFilters();
        initTestimonialsCarousel();
        initFormValidation();
        initBackToTop();
        initParallax();
        initHeroParticles();
        initSmoothScroll();
        initActiveNavHighlight();

        // Log ready state
        console.log(
            '%c🔧 Apex Bearing Technologies %cWebsite Ready',
            'color: #0066cc; font-weight: bold; font-size: 16px;',
            'color: #a0a0a0;'
        );
        console.log(
            '%cPremium Wheel Hub Bearings | %c4000+ SKU | %cGlobal Export',
            'color: #f0f0f0;',
            'color: #0088ff;',
            'color: #00cc88;'
        );
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
