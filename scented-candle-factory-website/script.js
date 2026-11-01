/* ============================================
   LUXURY SCENTED CANDLES WEBSITE - JAVASCRIPT
   Modern Animations & Interactive Features
   ============================================ */

'use strict';

// ============================================
// NAVIGATION MENU
// ============================================

const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

// Show menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Hide menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// ============================================
// DROPDOWN MENU (Mobile)
// ============================================

const dropdownItems = document.querySelectorAll('.nav__item--dropdown');

dropdownItems.forEach(item => {
    const link = item.querySelector('.nav__link');
    
    link.addEventListener('click', (e) => {
        // Only prevent default on mobile (when menu is in mobile mode)
        if (window.innerWidth < 1025) {
            e.preventDefault();
            
            // Close other dropdowns
            dropdownItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            item.classList.toggle('active');
        }
    });
});

// Close dropdowns when clicking dropdown links
const dropdownLinks = document.querySelectorAll('.nav__dropdown-link');
dropdownLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        dropdownItems.forEach(item => {
            item.classList.remove('active');
        });
    });
});

// ============================================
// SEARCH BAR
// ============================================

const searchBtn = document.getElementById('search-btn');
const searchBar = document.getElementById('search-bar');
const searchClose = document.getElementById('search-close');
const searchForm = document.getElementById('search-form');

// Show search bar
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        searchBar.classList.add('show-search');
        // Focus on search input
        setTimeout(() => {
            const searchInput = searchBar.querySelector('.search-bar__input');
            if (searchInput) searchInput.focus();
        }, 300);
    });
}

// Hide search bar
if (searchClose) {
    searchClose.addEventListener('click', () => {
        searchBar.classList.remove('show-search');
    });
}

// Close search bar when clicking outside
document.addEventListener('click', (e) => {
    if (searchBar && searchBar.classList.contains('show-search')) {
        if (!searchBar.contains(e.target) && !searchBtn.contains(e.target)) {
            searchBar.classList.remove('show-search');
        }
    }
});

// Handle search form submission
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = searchForm.querySelector('.search-bar__input');
        const searchQuery = searchInput.value.trim();
        
        if (searchQuery) {
            // Simulate search (replace with actual search functionality)
            showNotification(`Searching for: "${searchQuery}"...`, 'info');
            
            // In production, you would redirect to a search results page or filter products:
            // window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
            
            // Close search bar
            setTimeout(() => {
                searchBar.classList.remove('show-search');
                searchInput.value = '';
            }, 1000);
        }
    });
}

// ============================================
// STICKY HEADER
// ============================================

const header = document.getElementById('header');
const scrollThreshold = 50;

function scrollHeader() {
    if (window.scrollY >= scrollThreshold) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}

window.addEventListener('scroll', scrollHeader);

// ============================================
// ACTIVE LINK ON SCROLL
// ============================================

const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active-link');
            } else {
                navLink.classList.remove('active-link');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

const scrollTop = document.getElementById('scroll-top');

function showScrollTop() {
    if (window.scrollY >= 400) {
        scrollTop.classList.add('show-scroll');
    } else {
        scrollTop.classList.remove('show-scroll');
    }
}

window.addEventListener('scroll', showScrollTop);

if (scrollTop) {
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// SCROLL REVEAL ANIMATIONS (AOS-like)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            // Unobserve after animation to improve performance
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
const elementsToAnimate = document.querySelectorAll('[data-aos]');
elementsToAnimate.forEach(el => {
    // Set initial transform based on animation type
    const animationType = el.getAttribute('data-aos');
    
    switch(animationType) {
        case 'fade-up':
            el.style.transform = 'translateY(50px)';
            break;
        case 'fade-down':
            el.style.transform = 'translateY(-50px)';
            break;
        case 'fade-left':
            el.style.transform = 'translateX(-50px)';
            break;
        case 'fade-right':
            el.style.transform = 'translateX(50px)';
            break;
        case 'zoom-in':
            el.style.transform = 'scale(0.9)';
            break;
    }
    
    animateOnScroll.observe(el);
});

// ============================================
// COUNTER ANIMATION
// ============================================

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

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
}

// Observe counter elements
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            animateCounter(entry.target);
            entry.target.classList.add('counted');
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const counters = document.querySelectorAll('[data-count]');
counters.forEach(counter => counterObserver.observe(counter));

// ============================================
// PRODUCTS CAROUSEL
// ============================================

const productsCarousel = document.querySelector('.products__carousel-track');
const prevBtn = document.querySelector('.products__nav--prev');
const nextBtn = document.querySelector('.products__nav--next');

if (productsCarousel && prevBtn && nextBtn) {
    let scrollAmount = 0;
    const cardWidth = 320; // Approximate card width + gap

    nextBtn.addEventListener('click', () => {
        scrollAmount += cardWidth;
        productsCarousel.style.transform = `translateX(-${scrollAmount}px)`;
        
        // Reset if at end
        const maxScroll = productsCarousel.scrollWidth - productsCarousel.offsetWidth;
        if (scrollAmount >= maxScroll) {
            scrollAmount = 0;
            productsCarousel.style.transform = 'translateX(0)';
        }
    });

    prevBtn.addEventListener('click', () => {
        scrollAmount -= cardWidth;
        if (scrollAmount < 0) {
            scrollAmount = productsCarousel.scrollWidth - productsCarousel.offsetWidth;
        }
        productsCarousel.style.transform = `translateX(-${scrollAmount}px)`;
    });
}

// ============================================
// SMOOTH SCROLL FOR ALL LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip empty hash or javascript:void(0)
        if (href === '#' || href === '#!') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

const contactForm = document.querySelector('.contact__form');
const newsletterForms = document.querySelectorAll('.footer__newsletter');

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission (replace with actual API call)
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
        
        // In production, you would send the data to your backend:
        /*
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            showNotification('Thank you! Your message has been sent.', 'success');
            contactForm.reset();
        })
        .catch(error => {
            showNotification('Sorry, there was an error. Please try again.', 'error');
        });
        */
    });
}

// Newsletter form submission
newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate subscription (replace with actual API call)
        showNotification('Successfully subscribed to our newsletter!', 'success');
        form.reset();
    });
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification__close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        }
        
        .notification--success {
            border-left: 4px solid #27ae60;
        }
        
        .notification--error {
            border-left: 4px solid #e74c3c;
        }
        
        .notification--info {
            border-left: 4px solid #3498db;
        }
        
        .notification__content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        }
        
        .notification__content i {
            font-size: 1.25rem;
        }
        
        .notification--success .notification__content i {
            color: #27ae60;
        }
        
        .notification--error .notification__content i {
            color: #e74c3c;
        }
        
        .notification--info .notification__content i {
            color: #3498db;
        }
        
        .notification__close {
            background: none;
            border: none;
            cursor: pointer;
            color: #8b8378;
            transition: color 0.2s;
        }
        
        .notification__close:hover {
            color: #2c2416;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            
            // If using data-src attribute
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

// Observe all images
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ============================================
// PRODUCT QUICK VIEW (Modal Functionality)
// ============================================

const quickViewButtons = document.querySelectorAll('.product__action[aria-label="Quick view"]');

quickViewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = button.closest('.product__card');
        const productName = productCard.querySelector('.product__name').textContent;
        const productImage = productCard.querySelector('.product__image').src;
        const productPrice = productCard.querySelector('.product__price').textContent;
        const productDescription = productCard.querySelector('.product__description').textContent;
        
        // Create and show modal (simplified version)
        showNotification(`Quick view for ${productName} - Feature coming soon!`, 'info');
    });
});

// ============================================
// WISHLIST FUNCTIONALITY
// ============================================

const wishlistButtons = document.querySelectorAll('.product__action[aria-label="Add to wishlist"]');
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = button.closest('.product__card');
        const productName = productCard.querySelector('.product__name').textContent;
        const icon = button.querySelector('i');
        
        // Toggle wishlist
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            wishlist.push(productName);
            showNotification(`${productName} added to wishlist!`, 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            wishlist = wishlist.filter(item => item !== productName);
            showNotification(`${productName} removed from wishlist`, 'info');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
    });
});

function updateWishlistCount() {
    const count = wishlist.length;
    // Update UI with wishlist count if needed
    console.log('Wishlist count:', count);
}

// Initialize wishlist on load
updateWishlistCount();

// ============================================
// SHOPPING CART FUNCTIONALITY
// ============================================

const addToCartButtons = document.querySelectorAll('.btn--primary:has(.fa-shopping-cart)');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = button.closest('.product__card');
        
        if (productCard) {
            const productName = productCard.querySelector('.product__name').textContent;
            const productPrice = productCard.querySelector('.product__price').textContent;
            const productImage = productCard.querySelector('.product__image').src;
            
            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            // Check if product already in cart
            const existingProduct = cart.find(item => item.name === productName);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push(product);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`${productName} added to cart!`, 'success');
        }
    });
});

function updateCartCount() {
    const cartCount = document.querySelector('.nav__cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Initialize cart on load
updateCartCount();

// ============================================
// PARALLAX EFFECT
// ============================================

function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero__image');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(parallaxEffect);
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(scrollActive, 10));
window.addEventListener('scroll', debounce(scrollHeader, 10));

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================

console.log('%c🕯️ Lumière Candle Co.', 'font-size: 24px; font-weight: bold; color: #c9a86a;');
console.log('%cWelcome to our premium scented candles website!', 'font-size: 14px; color: #2c2416;');
console.log('%cBuilt with modern web technologies for an immersive experience.', 'font-size: 12px; color: #8b8378;');

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Website fully loaded and interactive');
    
    // Trigger initial scroll functions
    scrollHeader();
    scrollActive();
    showScrollTop();
});
