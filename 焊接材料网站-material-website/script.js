/* ===================================
   PRECISION MATERIALS - JAVASCRIPT
   Interactive Features & Animations
   =================================== */

// ========================================
// UTILITY FUNCTIONS
// ========================================

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ========================================
// HEADER SCROLL BEHAVIOR
// ========================================

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', debounce(() => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
}, 10));

// ========================================
// MOBILE MENU TOGGLE
// ========================================

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });
}

// Close mobile menu when clicking on nav links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href === '#' || href === '#!') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================

const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', debounce(() => {
    const scrollPosition = window.pageYOffset + header.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, 100));

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, delay);
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
    animateOnScroll.observe(el);
});

// ========================================
// PRODUCTS CAROUSEL
// ========================================

class ProductCarousel {
    constructor(carouselId) {
        this.carousel = document.getElementById(carouselId);
        if (!this.carousel) return;

        this.track = this.carousel.querySelector('.carousel-track');
        this.slides = Array.from(this.track.querySelectorAll('.product-slide'));
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.indicatorsContainer = document.querySelector('.carousel-indicators');

        this.currentIndex = 0;
        this.slideWidth = this.slides[0].offsetWidth;
        this.gap = 32; // 2rem gap
        this.slidesPerView = this.getSlidesPerView();
        this.maxIndex = Math.max(0, this.slides.length - this.slidesPerView);

        this.init();
    }

    getSlidesPerView() {
        const containerWidth = this.carousel.offsetWidth;
        const slideWidth = this.slides[0].offsetWidth + this.gap;
        return Math.floor(containerWidth / slideWidth);
    }

    init() {
        this.createIndicators();
        this.attachEventListeners();
        this.updateCarousel();

        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            this.slidesPerView = this.getSlidesPerView();
            this.maxIndex = Math.max(0, this.slides.length - this.slidesPerView);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.updateCarousel();
        }, 250));
    }

    createIndicators() {
        if (!this.indicatorsContainer) return;

        const numIndicators = this.maxIndex + 1;
        for (let i = 0; i < numIndicators; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    attachEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    updateCarousel() {
        const offset = this.currentIndex * (this.slideWidth + this.gap);
        this.track.style.transform = `translateX(-${offset}px)`;

        this.updateIndicators();
        this.updateButtons();
    }

    updateIndicators() {
        const indicators = this.indicatorsContainer?.querySelectorAll('.carousel-indicator');
        if (indicators) {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentIndex);
            });
        }
    }

    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.maxIndex;
            this.nextBtn.style.opacity = this.currentIndex === this.maxIndex ? '0.5' : '1';
        }
    }

    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }

    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        this.updateCarousel();
    }
}

// Initialize carousel only if it exists
let carousel = null;
const carouselElement = document.getElementById('productsCarousel');
if (carouselElement) {
    carousel = new ProductCarousel('productsCarousel');
}

// Auto-play carousel (optional)
let autoPlayInterval;
const startAutoPlay = () => {
    if (!carousel || !carousel.carousel) return;

    autoPlayInterval = setInterval(() => {
        if (carousel && carousel.currentIndex < carousel.maxIndex) {
            carousel.nextSlide();
        } else if (carousel) {
            carousel.goToSlide(0);
        }
    }, 5000);
};

const stopAutoPlay = () => {
    clearInterval(autoPlayInterval);
};

// Start auto-play only if carousel exists
if (carousel && carousel.carousel) {
    startAutoPlay();

    // Pause on hover
    carousel.carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.carousel.addEventListener('mouseleave', startAutoPlay);
}

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.company || !data.email || !data.industry || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitButton.textContent = 'Message Sent!';
            submitButton.style.background = '#2b8a9e';

            // Show success message
            alert('Thank you for your inquiry. Our engineering team will contact you within 24 hours.');

            // Reset form
            contactForm.reset();

            // Reset button after delay
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 3000);
        }, 1500);
    });
}

// ========================================
// NEWSLETTER FORM
// ========================================

const newsletterForms = document.querySelectorAll('.newsletter-form');

newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitButton.textContent = 'Subscribed!';
            submitButton.style.background = '#2b8a9e';

            alert('Thank you for subscribing to our technical updates!');

            form.reset();

            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 3000);
        }, 1000);
    });
});

// ========================================
// PARALLAX EFFECT
// ========================================

const parallaxElements = document.querySelectorAll('.hero-background');

window.addEventListener('scroll', debounce(() => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}, 10));

// ========================================
// COUNTER ANIMATION
// ========================================

const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const targetValue = parseInt(element.textContent);

            if (!isNaN(targetValue)) {
                element.textContent = '0';
                animateCounter(element, targetValue);
            }

            counterObserver.unobserve(element);
        }
    });
}, { threshold: 0.5 });

// Observe stat numbers
document.querySelectorAll('.stat-number, .global-stat .stat-number').forEach(el => {
    const text = el.textContent.trim();
    // Only animate if it contains a number
    if (/\d/.test(text)) {
        const match = text.match(/\d+/);
        if (match) {
            const num = parseInt(match[0]);
            el.dataset.target = num;
            counterObserver.observe(el);
        }
    }
});

// ========================================
// CATEGORY CARD HOVER EFFECTS
// ========================================

const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(card => {
    const image = card.querySelector('.category-image .image-placeholder');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        if (image) {
            image.style.transform = `scale(1.1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        if (image) {
            image.style.transform = 'scale(1) rotateX(0) rotateY(0)';
        }
    });
});

// ========================================
// PRODUCT CARD INTERACTIONS
// ========================================

const productCards = document.querySelectorAll('.product-card, .application-card');

productCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ========================================
// LAZY LOADING OPTIMIZATION
// ========================================

const lazyImages = document.querySelectorAll('.image-placeholder');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
}, { rootMargin: '50px' });

lazyImages.forEach(img => imageObserver.observe(img));

// ========================================
// PREVENT SCROLLING DURING ANIMATIONS
// ========================================

let isScrolling;
window.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        // Scroll has stopped
    }, 100);
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Preload critical assets
const preloadImages = () => {
    const imagePlaceholders = document.querySelectorAll('.hero-image-placeholder');
    imagePlaceholders.forEach(placeholder => {
        // Add preload logic here if using real images
    });
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadImages);
} else {
    preloadImages();
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Keyboard navigation for carousel
if (carousel && carousel.carousel) {
    carousel.carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            carousel.prevSlide();
        } else if (e.key === 'ArrowRight') {
            carousel.nextSlide();
        }
    });
}

// Focus management for mobile menu
if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
        if (mainNav.classList.contains('active')) {
            // Focus first nav link when menu opens
            const firstLink = mainNav.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 300);
            }
        }
    });
}

// ========================================
// CONSOLE BRANDING
// ========================================

console.log('%c Precision Materials Co.', 'font-size: 20px; font-weight: bold; color: #1e5a96;');
console.log('%c Engineering Excellence in Every Bond', 'font-size: 14px; color: #5a6272;');
console.log('%c Website designed for premium industrial manufacturing', 'font-size: 12px; color: #8b939f;');

/* === FACTORY TABS LOGIC === */
document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.factory-tab-item');
    const tabContents = document.querySelectorAll('.factory-tab-content');

    function switchTab(targetTabId) {
        // Remove active class from all buttons
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === targetTabId) {
                btn.classList.add('active');
            }
        });

        // Hide all contents and show target
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetTabId) {
                content.classList.add('active');
            }
        });
    }

    // Add click event listeners
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            if (targetTab) {
                switchTab(targetTab);
            }
        });
    });
});

/* === HEADER INTERACTIONS (Search & Language) === */
document.addEventListener('DOMContentLoaded', () => {
    // --- Search Toggle ---
    const searchToggle = document.getElementById('searchToggle');
    const searchBarContainer = document.getElementById('searchBarContainer');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    const searchInput = document.querySelector('.search-input');

    if (searchToggle && searchBarContainer) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            searchBarContainer.classList.toggle('active');
            if (searchBarContainer.classList.contains('active')) {
                // Focus input after transition
                setTimeout(() => searchInput.focus(), 100);
            }
        });
    }

    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', (e) => {
            searchBarContainer.classList.remove('active');
        });
    }

    // Close search on click outside
    document.addEventListener('click', (e) => {
        if (searchBarContainer && searchBarContainer.classList.contains('active')) {
            if (!searchBarContainer.contains(e.target) && !searchToggle.contains(e.target)) {
                searchBarContainer.classList.remove('active');
            }
        }
    });

    // --- Language Switcher ---
    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');
    const langItems = document.querySelectorAll('.lang-item');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const expanded = langBtn.getAttribute('aria-expanded') === 'true';
            langBtn.setAttribute('aria-expanded', !expanded);
            langMenu.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.remove('active');
                langBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle language selection
        langItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                // Update active state
                langItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Update button text (optional, or just keep as EN/Current)
                // const langText = item.textContent.trim();
                // langBtn.childNodes[0].nodeValue = langText + ' '; 

                // Close menu
                langMenu.classList.remove('active');
                langBtn.setAttribute('aria-expanded', 'false');

                // Simulate Reload or Path change
                console.log('Language switched to:', item.textContent);
            });
        });
    }
});

/* === FLOATING WIDGET (Scroll to Top) === */
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
    // Show/Hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* === SEARCH FUNCTIONALITY === */
const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = searchForm.querySelector('.search-input');
        const query = input.value.trim();
        if (query) {
            // Redirect to search results page with query
            window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
        }
    });
}

// Check if we are on the results page
if (window.location.pathname.includes('search-results.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const displayQuery = document.getElementById('searchQueryDisplay');
    const resultsCount = document.getElementById('resultsCount');
    const resultsList = document.getElementById('resultsList');

    if (query && displayQuery) {
        displayQuery.textContent = `"${query}"`;
        // Update input if exists (to show what was searched)
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.value = query;

        // Mock Results Generator mainly for demo
        const mockResults = [
            {
                title: 'High-Purity Aluminum Brazing Rods',
                category: 'Aluminum Alloys',
                desc: 'Premium grade aluminum-silicon brazing rods designed for complex heat exchanger assemblies.',
                link: 'products.html#aluminum'
            },
            {
                title: 'Flux-Cored Aluminum Filler Wire',
                category: 'Flux-Cored',
                desc: 'Advanced self-fluxing filler wire that eliminates the need for external flux application.',
                link: 'products.html#flux-cored'
            },
            {
                title: 'Copper-Phosphorus Brazing Alloys',
                category: 'Copper Alloys',
                desc: 'Standard compliant copper-phosphorus alloys for refrigeration and air conditioning.',
                link: 'products.html#copper'
            },
            {
                title: 'Automated Brazing Quality Control',
                category: 'Insights',
                desc: 'How our new automated optical inspection system ensures zero-defect manufacturing.',
                link: 'news-single.html'
            },
            {
                title: 'Global Distribution Network Expansion',
                category: 'News',
                desc: 'Precision Materials opens new logistics hubs in Europe and North America.',
                link: 'news.html'
            }
        ];

        // Filter mock results (simple implementation)
        const filteredResults = mockResults.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.desc.toLowerCase().includes(query.toLowerCase())
        );

        if (resultsCount) resultsCount.textContent = filteredResults.length;

        if (resultsList) {
            resultsList.innerHTML = ''; // Clear loading state

            if (filteredResults.length > 0) {
                filteredResults.forEach(item => {
                    const resultHTML = `
                        <div class="result-item">
                            <div class="result-category">${item.category}</div>
                            <h3 class="result-title"><a href="${item.link}">${item.title}</a></h3>
                            <p class="result-snippet">${item.desc}</p>
                        </div>
                    `;
                    resultsList.innerHTML += resultHTML;
                });
            } else {
                resultsList.innerHTML = `
                    <div class="no-results">
                        <p>No matches found for "${query}". Please try different keywords.</p>
                    </div>
                `;
            }
        }
    }
}
