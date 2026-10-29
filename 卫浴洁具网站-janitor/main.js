/* =================================================================
   LUXURY SANITARY WARE - CONSOLIDATED SCRIPT
   ---------------------------------------------------------------
   Merged from 6 source scripts into one file.

   - main.base.js          Shared site-wide behaviour (navigation, hero slider, reveal animations, home enquiry form)
   - contact.js            Contact page - form validation and submission
   - gallery.js            Gallery page - lightbox, filtering, stat counters
   - product-detail.js     Product detail page - gallery, options, tabs
   - products-archive.js   Product archive page - filtering, sorting, pagination
   - videos.js             Videos page - modal player, filtering, quality/speed controls

   Every section is already wrapped in an IIFE or a DOMContentLoaded
   callback, so no identifier leaks into the global scope and the
   sections cannot collide with each other.

   Each page-specific section also returns early when the markup it
   drives is not present, so this single bundle is safe to load on
   every page of the site.
   ================================================================= */


/* =================================================================
   main.base.js - Shared site-wide behaviour (navigation, hero slider, reveal animations, home enquiry form)
   ================================================================= */

// ================================================
// LUXURY SANITARY WARE - INTERACTIVE FUNCTIONALITY
// ================================================

(function() {
    'use strict';

    // ================================================
    // NAVIGATION
    // ================================================
    
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navSearchToggle = document.getElementById('navSearchToggle');
    const navSearch = document.getElementById('navSearch');
    
    // Scroll effect for navigation
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for shadow effect (some pages have no navigation)
        if (nav) {
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        const resetToggleIcon = () => {
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        };

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            if (nav) {
                nav.classList.remove('search-open');
            }
            if (navSearchToggle) {
                navSearchToggle.setAttribute('aria-expanded', 'false');
            }
            
            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                resetToggleIcon();
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                if (nav) {
                    nav.classList.remove('search-open');
                }
                if (navSearchToggle) {
                    navSearchToggle.setAttribute('aria-expanded', 'false');
                }
                
                resetToggleIcon();
            });
        });
    }

    // Search toggle
    if (navSearchToggle && navSearch && nav) {
        const searchInput = navSearch.querySelector('input');

        navSearchToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('search-open');
            navSearchToggle.setAttribute('aria-expanded', String(isOpen));
            if (navMenu && navMenu.classList.contains('active') && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
            if (isOpen && searchInput) {
                searchInput.focus();
            }
        });
    }
    
    // ================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ================================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================================
    // FEATURE SLIDER
    // ================================================

    const sliderTrack = document.querySelector('.slider-track');
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');

    if (sliderTrack && sliderPrev && sliderNext) {
        const getSlideOffset = () => {
            const card = sliderTrack.querySelector('.slide-card');
            if (!card) return 0;
            const cardWidth = card.getBoundingClientRect().width;
            const gapValue = parseFloat(getComputedStyle(sliderTrack).columnGap || getComputedStyle(sliderTrack).gap) || 0;
            return cardWidth + gapValue;
        };

        sliderPrev.addEventListener('click', () => {
            sliderTrack.scrollBy({ left: -getSlideOffset(), behavior: 'smooth' });
        });

        sliderNext.addEventListener('click', () => {
            sliderTrack.scrollBy({ left: getSlideOffset(), behavior: 'smooth' });
        });
    }
    
    // ================================================
    // SCROLL REVEAL ANIMATIONS
    // ================================================
    
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally unobserve after revealing
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
    
    // ================================================
    // CONTACT FORM HANDLING
    // ================================================
    
    const contactForm = document.getElementById('contactForm');
    
    // This handler targets the home page enquiry form only. The contact page
    // uses a different form (with #firstName) and has its own handler.
    if (contactForm && contactForm.querySelector('#name')) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                projectType: document.getElementById('projectType').value,
                message: document.getElementById('message').value
            };
            
            // Validate required fields
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Validate email format
            if (!isValidEmail(formData.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            // In production, this would send data to a server
            showNotification('Thank you for your inquiry. We will contact you within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Log form data (for demonstration)
            console.log('Form submitted:', formData);
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification system
    function showNotification(message, type = 'success') {
        // Remove existing notification if present
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: type === 'success' ? '#B8A992' : '#C85A54',
            color: '#FDFBF7',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            fontSize: '0.95rem',
            fontWeight: '500',
            maxWidth: '400px',
            opacity: '0',
            transform: 'translateX(20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // ================================================
    // PRODUCT CARD INTERACTIONS
    // ================================================
    
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        });
    });
    
    // ================================================
    // APPLICATION CARD INTERACTIONS
    // ================================================
    
    const applicationCards = document.querySelectorAll('.application-card');
    
    applicationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.application-overlay');
            if (overlay) {
                overlay.style.background = 'linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3))';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.application-overlay');
            if (overlay) {
                overlay.style.background = 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)';
            }
        });
    });
    
    // ================================================
    // PARALLAX EFFECT FOR HERO
    // ================================================
    
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            // Only apply parallax when hero is in view
            if (scrolled < heroHeight) {
                const parallaxSpeed = 0.5;
                heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    // ================================================
    // HERO SLIDER
    // ================================================

    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrev = document.querySelector('.hero-prev');
    const heroNext = document.querySelector('.hero-next');
    const heroDots = document.querySelectorAll('.hero-dot');

    if (heroSlides.length > 0 && heroPrev && heroNext) {
        let heroIndex = 0;

        const setHeroSlide = (index) => {
            heroSlides.forEach((slide, idx) => {
                slide.classList.toggle('is-active', idx === index);
            });
            heroDots.forEach((dot, idx) => {
                dot.classList.toggle('is-active', idx === index);
                dot.setAttribute('aria-selected', idx === index ? 'true' : 'false');
            });
        };

        heroPrev.addEventListener('click', () => {
            heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
            setHeroSlide(heroIndex);
        });

        heroNext.addEventListener('click', () => {
            heroIndex = (heroIndex + 1) % heroSlides.length;
            setHeroSlide(heroIndex);
        });

        heroDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                heroIndex = idx;
                setHeroSlide(heroIndex);
            });
        });
    }

    // ================================================
    // FLOATING WIDGET (GO TO TOP)
    // ================================================

    const goTopButton = document.querySelector('.floating-top');

    if (goTopButton) {
        // Initial check
        if (window.pageYOffset < 300) {
            goTopButton.classList.add('is-hidden');
        }

        // Scroll check
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                goTopButton.classList.remove('is-hidden');
            } else {
                goTopButton.classList.add('is-hidden');
            }
        });

        goTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            // Fallback for older browsers
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        });
    }

    document.addEventListener('click', (event) => {
        const topButton = event.target.closest('.floating-top');
        if (!topButton) return;
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });
    
    // ================================================
    // IMAGE PLACEHOLDER ENHANCEMENTS
    // ================================================
    
    const imagePlaceholders = document.querySelectorAll('.image-placeholder');
    
    imagePlaceholders.forEach(placeholder => {
        // Add subtle animation on hover
        placeholder.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.6s ease';
            this.style.transform = 'scale(1.05)';
        });
        
        placeholder.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.6s ease';
            this.style.transform = 'scale(1)';
        });
    });
    
    // ================================================
    // LAZY LOADING PREPARATION
    // ================================================
    
    // This function prepares the structure for lazy loading images
    // When real images are added, they can be loaded efficiently
    function prepareLazyLoading() {
        const imageContainers = document.querySelectorAll('.product-image, .craft-image, .application-image, .quality-image, .about-image, .contact-image, .hero-image, .global-map');
        
        imageContainers.forEach(container => {
            container.setAttribute('data-lazy-ready', 'true');
        });
    }
    
    prepareLazyLoading();
    
    // ================================================
    // PERFORMANCE OPTIMIZATION
    // ================================================
    
    // Debounce function for scroll events
    function debounce(func, wait = 10, immediate = false) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // ================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================================
    
    // Add keyboard navigation for product cards
    productCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = this.querySelector('.product-link');
                if (link) {
                    link.click();
                }
            }
        });
    });
    
    // Add keyboard navigation for application cards
    applicationCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                // Could trigger a modal or navigation
                console.log('Application card activated:', this.querySelector('.application-title').textContent);
            }
        });
    });
    
    // ================================================
    // FOCUS MANAGEMENT
    // ================================================
    
    // Add focus styles for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #B8A992';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // ================================================
    // INITIALIZATION COMPLETE
    // ================================================
    
    console.log('Luxury Sanitary Ware Website - Interactive features initialized');
    
    // Log viewport information for debugging
    console.log('Viewport width:', window.innerWidth);
    console.log('Viewport height:', window.innerHeight);
    
})();


/* =================================================================
   contact.js - Contact page - form validation and submission
   ================================================================= */

// ================================================
// CONTACT PAGE SPECIFIC JAVASCRIPT
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // This script targets the contact page form only. The home page enquiry
    // form uses different fields and is handled by main.js.
    if (!document.querySelector('#contactForm #firstName')) return;
    
    // ================================================
    // FORM VALIDATION AND SUBMISSION
    // ================================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Validate required fields
            if (validateForm(data)) {
                // Show success message
                showSuccessMessage();
                
                // Reset form
                contactForm.reset();
                
                // In production, send data to server
                console.log('Form data:', data);
            }
        });
    }
    
    // ================================================
    // FORM VALIDATION
    // ================================================
    function validateForm(data) {
        const requiredFields = ['firstName', 'lastName', 'email', 'inquiryType', 'subject', 'message'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            const value = data[field];
            
            if (!value || value.trim() === '') {
                showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(input);
            }
        });
        
        // Validate email format
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailInput = document.getElementById('email');
            
            if (!emailRegex.test(data.email)) {
                showFieldError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Validate privacy checkbox
        const privacyCheckbox = document.querySelector('input[name="privacy"]');
        if (privacyCheckbox && !privacyCheckbox.checked) {
            showFieldError(privacyCheckbox.parentElement, 'You must agree to the privacy policy');
            isValid = false;
        }
        
        return isValid;
    }
    
    // ================================================
    // ERROR DISPLAY
    // ================================================
    function showFieldError(element, message) {
        // Remove existing error
        clearFieldError(element);
        
        // Add error class
        if (element.tagName === 'LABEL') {
            element.classList.add('error');
        } else {
            element.classList.add('error');
        }
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#d32f2f';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.25rem';
        
        // Insert after element
        if (element.tagName === 'LABEL') {
            element.parentElement.appendChild(errorDiv);
        } else {
            element.parentElement.appendChild(errorDiv);
        }
    }
    
    function clearFieldError(element) {
        element.classList.remove('error');
        const errorDiv = element.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    // ================================================
    // SUCCESS MESSAGE
    // ================================================
    function showSuccessMessage() {
        // Create success overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        // Create success message
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            background: #FDFBF7;
            padding: 3rem;
            border-radius: 4px;
            max-width: 500px;
            text-align: center;
            animation: slideUp 0.3s ease;
        `;
        
        messageBox.innerHTML = `
            <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: #B8A992; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FDFBF7" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </div>
            <h2 style="font-size: 2rem; font-weight: 300; color: #2C2C2C; margin-bottom: 1rem;">Thank You!</h2>
            <p style="font-size: 1.1rem; color: #5A5A5A; margin-bottom: 2rem;">Your message has been sent successfully. We'll get back to you within 24 hours.</p>
            <button class="btn btn-primary" onclick="this.closest('.success-overlay').remove()">Close</button>
        `;
        
        overlay.appendChild(messageBox);
        document.body.appendChild(overlay);
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        }, 5000);
    }
    
    // ================================================
    // LIVE CHAT BUTTON
    // ================================================
    const chatButton = document.querySelector('.method-button');
    
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            alert('Live chat feature would open here. In production, this would connect to your customer service platform.');
        });
    }
    
    // ================================================
    // REAL-TIME INPUT VALIDATION
    // ================================================
    const emailInput = document.getElementById('email');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                showFieldError(this, 'Please enter a valid email address');
            } else {
                clearFieldError(this);
            }
        });
    }
    
    // ================================================
    // CHARACTER COUNTER FOR MESSAGE
    // ================================================
    const messageTextarea = document.getElementById('message');
    
    if (messageTextarea) {
        const maxLength = 1000;
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.85rem;
            color: #5A5A5A;
            margin-top: 0.25rem;
        `;
        counter.textContent = `0 / ${maxLength} characters`;
        
        messageTextarea.parentElement.appendChild(counter);
        
        // Update counter on input
        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length} / ${maxLength} characters`;
            
            if (length > maxLength) {
                counter.style.color = '#d32f2f';
                this.value = this.value.substring(0, maxLength);
            } else if (length > maxLength * 0.9) {
                counter.style.color = '#ff9800';
            } else {
                counter.style.color = '#5A5A5A';
            }
        });
        
        // Set max length
        messageTextarea.setAttribute('maxlength', maxLength);
    }
    
    // ================================================
    // SMOOTH SCROLL TO FORM FROM METHODS
    // ================================================
    const methodCards = document.querySelectorAll('.method-card');
    
    methodCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only scroll if not clicking a link or button
            if (!e.target.closest('a') && !e.target.closest('button')) {
                const formSection = document.querySelector('.contact-form-section');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Focus on first input after scroll
                    setTimeout(() => {
                        document.getElementById('firstName').focus();
                    }, 500);
                }
            }
        });
    });
    
    // ================================================
    // FAQ ACCORDION (OPTIONAL ENHANCEMENT)
    // ================================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', function() {
            // Toggle expanded class
            this.classList.toggle('expanded');
            
            // Optional: Add rotation to question or icon if you want accordion behavior
        });
    });
    
});


/* =================================================================
   gallery.js - Gallery page - lightbox, filtering, stat counters
   ================================================================= */

// ================================================
// GALLERY PAGE JAVASCRIPT
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================================
    // GALLERY DATA
    // ================================================
    const galleryData = [
        {
            title: 'Modern Luxury Suite',
            category: 'Residential',
            description: 'A sophisticated master bathroom featuring our premium ceramic collection with minimalist fixtures and elegant marble accents. Custom-designed washbasin with integrated storage and state-of-the-art shower system.',
            categories: ['residential', 'modern']
        },
        {
            title: 'Executive Washroom',
            category: 'Commercial',
            description: 'High-end corporate bathroom design with contemporary styling. Features include touchless faucets, premium wall-hung toilets, and designer lighting for a professional atmosphere.',
            categories: ['commercial', 'modern']
        },
        {
            title: 'Boutique Hotel Suite',
            category: 'Hotels & Spas',
            description: 'Luxurious hotel bathroom combining classic elegance with modern comfort. Includes freestanding soaking tub, rainfall shower, and custom vanity with marble countertops.',
            categories: ['hotels', 'classic']
        },
        {
            title: 'Minimalist Haven',
            category: 'Residential',
            description: 'Clean lines and pure white surfaces define this zen-inspired bathroom. Features wall-mounted fixtures, hidden storage, and our signature minimalist washbasin collection.',
            categories: ['residential', 'minimalist']
        },
        {
            title: 'Spa Retreat',
            category: 'Hotels & Spas',
            description: 'Resort-style spa bathroom with natural materials and modern technology. Includes chromotherapy shower, heated floors, and luxury bathtub with hydrotherapy features.',
            categories: ['hotels', 'modern']
        },
        {
            title: 'Corporate Restroom',
            category: 'Commercial',
            description: 'Contemporary office bathroom designed for high traffic. Features durable materials, efficient layouts, and sustainable water-saving fixtures.',
            categories: ['commercial', 'modern']
        },
        {
            title: 'Classic Elegance',
            category: 'Residential',
            description: 'Traditional bathroom design with timeless appeal. Features include clawfoot tub, pedestal sink, vintage-inspired fixtures, and intricate tile work.',
            categories: ['residential', 'classic']
        },
        {
            title: 'Contemporary Design',
            category: 'Residential',
            description: 'Modern residential bathroom with bold geometric patterns and innovative fixtures. Includes floating vanity, frameless glass shower, and designer mirrors.',
            categories: ['residential', 'modern']
        },
        {
            title: 'Zen Spa Experience',
            category: 'Hotels & Spas',
            description: 'Tranquil spa bathroom inspired by Japanese design principles. Natural stone, wood accents, and our premium minimalist collection create a peaceful sanctuary.',
            categories: ['hotels', 'minimalist']
        },
        {
            title: 'Modern Office',
            category: 'Commercial',
            description: 'Sleek commercial bathroom with space-efficient design. Features include smart sensors, easy-clean surfaces, and contemporary fixtures for modern workplaces.',
            categories: ['commercial', 'minimalist']
        },
        {
            title: 'Victorian Revival',
            category: 'Residential',
            description: 'Period-inspired bathroom with authentic Victorian details. Features ornate fixtures, traditional freestanding tub, and classic hexagonal floor tiles.',
            categories: ['residential', 'classic']
        },
        {
            title: 'Luxury Resort',
            category: 'Hotels & Spas',
            description: 'Five-star resort bathroom with panoramic views. Includes oversized soaking tub, dual rain showers, heated towel rails, and premium Italian fixtures.',
            categories: ['hotels', 'modern']
        }
    ];
    
    // ================================================
    // LIGHTBOX FUNCTIONALITY
    // ================================================
    const lightbox = document.getElementById('lightbox');
    
    // This script targets the gallery page only.
    if (!lightbox) return;
    
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxCategory = lightbox.querySelector('.lightbox-category');
    const lightboxDescription = lightbox.querySelector('.lightbox-description');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    let currentImageIndex = 0;
    let currentFilter = 'all';
    let filteredItems = [];
    
    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Update lightbox content
    function updateLightboxContent() {
        const data = galleryData[currentImageIndex];
        lightboxTitle.textContent = data.title;
        lightboxCategory.textContent = data.category;
        lightboxDescription.textContent = data.description;
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryData.length}`;
    }
    
    // Navigate to previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
        updateLightboxContent();
    }
    
    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryData.length;
        updateLightboxContent();
    }
    
    // Event listeners for lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // Close on overlay click
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
    
    // Add click event to all zoom buttons
    const zoomButtons = document.querySelectorAll('.gallery-zoom');
    zoomButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            openLightbox(index);
        });
    });
    
    // ================================================
    // FILTER FUNCTIONALITY
    // ================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            
            // Filter gallery items
            filterGallery(filter);
        });
    });
    
    function filterGallery(filter) {
        galleryItems.forEach((item, index) => {
            const categories = item.getAttribute('data-category').split(' ');
            
            if (filter === 'all' || categories.includes(filter)) {
                // Show item with animation
                item.classList.remove('filtering-out', 'hidden');
                item.classList.add('filtering-in');
                
                setTimeout(() => {
                    item.classList.remove('filtering-in');
                }, 500);
            } else {
                // Hide item with animation
                item.classList.add('filtering-out');
                
                setTimeout(() => {
                    item.classList.remove('filtering-out');
                    item.classList.add('hidden');
                }, 300);
            }
        });
    }
    
    // ================================================
    // LOAD MORE FUNCTIONALITY
    // ================================================
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Create loading spinner
            this.innerHTML = '<span class="loading-spinner"></span>';
            this.disabled = true;
            
            // Simulate loading
            setTimeout(() => {
                // In production, this would load more images from the server
                this.innerHTML = 'No More Projects';
                this.classList.add('disabled');
                
                // Could also hide the button
                // this.style.display = 'none';
            }, 1500);
        });
    }
    
    // ================================================
    // GALLERY ITEM HOVER ENHANCEMENTS
    // ================================================
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Add subtle tilt effect
            this.style.transform = 'translateY(-8px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // ================================================
    // LAZY LOADING IMAGES (OPTIONAL)
    // ================================================
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                item.classList.add('loaded');
                observer.unobserve(item);
            }
        });
    }, observerOptions);
    
    galleryItems.forEach(item => {
        imageObserver.observe(item);
    });
    
    // ================================================
    // TOUCH SWIPE SUPPORT FOR LIGHTBOX
    // ================================================
    let touchStartX = 0;
    let touchEndX = 0;
    
    const lightboxContainer = lightbox.querySelector('.lightbox-container');
    
    lightboxContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    lightboxContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next image
                nextImage();
            } else {
                // Swiped right - previous image
                prevImage();
            }
        }
    }
    
    // ================================================
    // GALLERY STATS COUNTER ANIMATION
    // ================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                animateValue(target, finalValue);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    function animateValue(element, finalValue) {
        // Extract number from string (e.g., "500+" -> 500)
        const match = finalValue.match(/\d+/);
        if (!match) return;
        
        const num = parseInt(match[0]);
        const suffix = finalValue.replace(/\d+/, '');
        const duration = 2000;
        const steps = 60;
        const increment = num / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, duration / steps);
    }
    
    // ================================================
    // SMOOTH SCROLL FOR FILTER BAR
    // ================================================
    const galleryFilters = document.querySelector('.gallery-filters');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            galleryFilters.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            galleryFilters.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
    
    // ================================================
    // PRELOAD ADJACENT IMAGES IN LIGHTBOX
    // ================================================
    function preloadAdjacentImages(index) {
        const prevIndex = (index - 1 + galleryData.length) % galleryData.length;
        const nextIndex = (index + 1) % galleryData.length;
        
        // In production, preload actual images
        // const prevImg = new Image();
        // prevImg.src = galleryData[prevIndex].imageSrc;
        // const nextImg = new Image();
        // nextImg.src = galleryData[nextIndex].imageSrc;
    }
    
    // ================================================
    // GALLERY GRID LAYOUT OPTIMIZATION
    // ================================================
    function optimizeGridLayout() {
        const grid = document.querySelector('.gallery-grid');
        if (!grid) return;
        
        // Get all visible items
        const visibleItems = Array.from(galleryItems).filter(item => 
            !item.classList.contains('hidden')
        );
        
        // Recalculate grid if needed
        // This helps maintain masonry layout after filtering
        if (visibleItems.length > 0) {
            grid.style.gridAutoFlow = 'dense';
        }
    }
    
    // Call after filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(optimizeGridLayout, 350);
        });
    });
    
    // ================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================================
    
    // Add ARIA labels
    zoomButtons.forEach((button, index) => {
        button.setAttribute('aria-label', `View ${galleryData[index].title} in lightbox`);
    });
    
    // Trap focus in lightbox when open
    const focusableElements = lightbox.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        lightbox.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }
    
    // ================================================
    // INITIAL SETUP
    // ================================================
    
    // Set initial filter to show all items
    filterGallery('all');
    
    console.log('Gallery initialized with', galleryData.length, 'images');
    
});


/* =================================================================
   product-detail.js - Product detail page - gallery, options, tabs
   ================================================================= */

// ================================================
// PRODUCT DETAIL PAGE - INTERACTIVE FUNCTIONALITY
// ================================================

(function() {
    'use strict';

    // This script targets the product detail page only.
    if (!document.querySelector('.product-gallery')) return;

    // ================================================
    // IMAGE GALLERY
    // ================================================
    
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    const mainImage = document.getElementById('mainImage');
    
    galleryThumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            galleryThumbs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            // In production, this would change to the actual product image
            console.log('Switched to image index:', index);
            
            // Add animation effect
            if (mainImage) {
                mainImage.style.opacity = '0.5';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 200);
            }
        });
    });
    
    // Zoom functionality for main image
    if (mainImage) {
        mainImage.addEventListener('click', function() {
            // In production, this would open a lightbox/zoom modal
            console.log('Image zoom clicked');
            this.style.cursor = 'zoom-out';
            
            // Toggle zoom state
            if (this.style.transform === 'scale(1.5)') {
                this.style.transform = 'scale(1)';
                this.style.cursor = 'zoom-in';
            } else {
                this.style.transform = 'scale(1.5)';
                this.style.cursor = 'zoom-out';
            }
        });
    }
    
    // ================================================
    // PRODUCT OPTIONS
    // ================================================
    
    const optionButtons = document.querySelectorAll('.option-btn');
    
    let selectedOptions = {
        finish: 'white',
        size: 'medium'
    };
    
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const optionType = this.dataset.option;
            const optionValue = this.dataset.value;
            
            // Remove active class from siblings
            const siblings = document.querySelectorAll(`[data-option="${optionType}"]`);
            siblings.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected options
            selectedOptions[optionType] = optionValue;
            
            console.log('Selected options:', selectedOptions);
            
            // In production, this might:
            // 1. Update product price based on options
            // 2. Update product images
            // 3. Check stock availability
        });
    });
    
    // ================================================
    // QUANTITY SELECTOR
    // ================================================
    
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    
    if (decreaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
    
    if (increaseBtn && quantityInput) {
        increaseBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            const maxValue = parseInt(quantityInput.max);
            if (currentValue < maxValue) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    // Validate manual input
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            
            if (isNaN(value) || value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    }
    
    // ================================================
    // ADD TO CART
    // ================================================
    
    const addToCartBtn = document.querySelector('.btn-add-cart');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value);
            
            const cartItem = {
                productId: 'LB-WB-001',
                productName: 'Elegance Countertop Basin',
                price: 850,
                quantity: quantity,
                options: selectedOptions
            };
            
            console.log('Adding to cart:', cartItem);
            
            // Show success feedback
            const originalText = this.textContent;
            this.textContent = '✓ Added to Cart';
            this.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 2000);
            
            // In production, this would:
            // 1. Add item to cart (localStorage or server)
            // 2. Update cart count in navigation
            // 3. Show cart sidebar or notification
        });
    }
    
    // ================================================
    // WISHLIST
    // ================================================
    
    const wishlistBtn = document.querySelector('.btn-wishlist');
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                console.log('Added to wishlist');
                showNotification('Added to wishlist', 'success');
            } else {
                console.log('Removed from wishlist');
                showNotification('Removed from wishlist', 'info');
            }
        });
    }
    
    // ================================================
    // PRODUCT TABS
    // ================================================
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Smooth scroll to tabs section
            const tabsSection = document.querySelector('.product-tabs-section');
            if (tabsSection) {
                const offset = 80; // Nav height
                const top = tabsSection.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
    
    // ================================================
    // REVIEWS - HELPFUL BUTTONS
    // ================================================
    
    const helpfulButtons = document.querySelectorAll('.helpful-btn');
    
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isYes = this.textContent.includes('Yes');
            const currentCount = parseInt(this.textContent.match(/\d+/)[0]);
            
            // Update count
            this.textContent = this.textContent.replace(/\d+/, currentCount + 1);
            
            // Disable after voting
            this.disabled = true;
            this.style.opacity = '0.6';
            this.style.cursor = 'not-allowed';
            
            console.log(`Voted helpful: ${isYes ? 'Yes' : 'No'}`);
        });
    });
    
    // ================================================
    // LOAD MORE REVIEWS
    // ================================================
    
    const loadMoreBtn = document.querySelector('.load-more-reviews');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            console.log('Loading more reviews...');
            
            // Show loading state
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            // Simulate loading
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                
                // In production, this would:
                // 1. Fetch more reviews from server
                // 2. Append to reviews list
                // 3. Update button visibility if no more reviews
            }, 1000);
        });
    }
    
    // ================================================
    // STICKY GALLERY ON SCROLL
    // ================================================
    
    const productGallery = document.querySelector('.product-gallery');
    const productInfo = document.querySelector('.product-info');
    
    if (productGallery && productInfo) {
        window.addEventListener('scroll', () => {
            const galleryHeight = productGallery.offsetHeight;
            const infoHeight = productInfo.offsetHeight;
            
            // Adjust sticky behavior based on content heights
            if (galleryHeight < infoHeight) {
                productGallery.style.position = 'sticky';
            } else {
                productGallery.style.position = 'relative';
            }
        });
    }
    
    // ================================================
    // SHARE PRODUCT (Optional Enhancement)
    // ================================================
    
    function shareProduct() {
        if (navigator.share) {
            navigator.share({
                title: 'Elegance Countertop Basin',
                text: 'Check out this luxury washbasin',
                url: window.location.href
            }).then(() => {
                console.log('Product shared successfully');
            }).catch(err => {
                console.log('Error sharing:', err);
            });
        } else {
            // Fallback: Copy link to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('Link copied to clipboard', 'success');
            });
        }
    }
    
    // ================================================
    // NOTIFICATION SYSTEM
    // ================================================
    
    function showNotification(message, type = 'success') {
        // Remove existing notification if present
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: type === 'success' ? '#4CAF50' : type === 'info' ? '#2196F3' : '#B8A992',
            color: '#FDFBF7',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            fontSize: '0.95rem',
            fontWeight: '500',
            maxWidth: '400px',
            opacity: '0',
            transform: 'translateX(20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // ================================================
    // PRICE FORMATTING
    // ================================================
    
    function formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    }
    
    // ================================================
    // DYNAMIC PRICE UPDATE (Based on Options)
    // ================================================
    
    function updatePrice() {
        const basePrice = 850;
        let additionalCost = 0;
        
        // Add cost based on selected options
        if (selectedOptions.finish === 'matte' || selectedOptions.finish === 'black') {
            additionalCost += 50;
        }
        
        if (selectedOptions.size === 'large') {
            additionalCost += 100;
        } else if (selectedOptions.size === 'small') {
            additionalCost -= 50;
        }
        
        const finalPrice = basePrice + additionalCost;
        
        // Update price display
        const priceElement = document.querySelector('.price-current');
        if (priceElement) {
            priceElement.textContent = formatPrice(finalPrice);
        }
    }
    
    // ================================================
    // URL PARAMETER HANDLING
    // ================================================
    
    function handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for specific option in URL (e.g., ?finish=black&size=large)
        const finishParam = urlParams.get('finish');
        const sizeParam = urlParams.get('size');
        
        if (finishParam) {
            const finishBtn = document.querySelector(`[data-option="finish"][data-value="${finishParam}"]`);
            if (finishBtn) {
                finishBtn.click();
            }
        }
        
        if (sizeParam) {
            const sizeBtn = document.querySelector(`[data-option="size"][data-value="${sizeParam}"]`);
            if (sizeBtn) {
                sizeBtn.click();
            }
        }
    }
    
    // ================================================
    // KEYBOARD SHORTCUTS
    // ================================================
    
    document.addEventListener('keydown', (e) => {
        // Press 'A' to add to cart
        if (e.key === 'a' || e.key === 'A') {
            if (addToCartBtn && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                addToCartBtn.click();
            }
        }
        
        // Press 'W' to toggle wishlist
        if (e.key === 'w' || e.key === 'W') {
            if (wishlistBtn && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                wishlistBtn.click();
            }
        }
        
        // Press number keys 1-4 to switch tabs
        if (e.key >= '1' && e.key <= '4') {
            const tabIndex = parseInt(e.key) - 1;
            if (tabButtons[tabIndex]) {
                e.preventDefault();
                tabButtons[tabIndex].click();
            }
        }
    });
    
    // ================================================
    // INITIALIZE WISHLIST STATE
    // ================================================
    
    function initializeWishlist() {
        // Check if product is in wishlist (from localStorage)
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const productId = 'LB-WB-001';
        
        if (wishlist.includes(productId) && wishlistBtn) {
            wishlistBtn.classList.add('active');
        }
    }
    
    // ================================================
    // RELATED PRODUCTS INTERACTIONS
    // ================================================
    
    const relatedProducts = document.querySelectorAll('.related-products .archive-product-item');
    
    relatedProducts.forEach(product => {
        product.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        });
        
        product.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        });
    });
    
    // ================================================
    // SCROLL TO REVIEWS FROM RATING
    // ================================================
    
    const ratingElement = document.querySelector('.product-rating');
    
    if (ratingElement) {
        ratingElement.style.cursor = 'pointer';
        ratingElement.addEventListener('click', () => {
            const reviewsTab = document.querySelector('[data-tab="reviews"]');
            if (reviewsTab) {
                reviewsTab.click();
            }
        });
    }
    
    // ================================================
    // INITIALIZATION
    // ================================================
    
    // Initialize on page load
    handleURLParameters();
    initializeWishlist();
    
    console.log('Product Detail - Interactive features initialized');
    console.log('Selected options:', selectedOptions);
    
})();


/* =================================================================
   products-archive.js - Product archive page - filtering, sorting, pagination
   ================================================================= */

// ================================================
// PRODUCT ARCHIVE PAGE - INTERACTIVE FUNCTIONALITY
// ================================================

(function() {
    'use strict';

    // This script targets the product archive page only.
    if (!document.getElementById('sidebarFilters')) return;

    // ================================================
    // MOBILE FILTER TOGGLE
    // ================================================
    
    const filterToggle = document.getElementById('filterToggle');
    const sidebarFilters = document.getElementById('sidebarFilters');
    const filterApply = document.getElementById('filterApply');
    
    if (filterToggle && sidebarFilters) {
        filterToggle.addEventListener('click', () => {
            sidebarFilters.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        if (filterApply) {
            filterApply.addEventListener('click', () => {
                sidebarFilters.classList.remove('active');
                document.body.style.overflow = '';
                applyFilters();
            });
        }
        
        // Close filters when clicking outside
        sidebarFilters.addEventListener('click', (e) => {
            if (e.target === sidebarFilters) {
                sidebarFilters.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ================================================
    // FILTER MANAGEMENT
    // ================================================
    
    const filterInputs = document.querySelectorAll('.filter-option input');
    const filterReset = document.getElementById('filterReset');
    const activeFiltersContainer = document.getElementById('activeFilters');
    
    let activeFilters = {
        category: [],
        style: [],
        finish: [],
        price: 'all',
        application: []
    };
    
    // Listen to filter changes
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateActiveFilters();
            renderActiveFilters();
            
            // On desktop, apply immediately
            if (window.innerWidth > 1024) {
                applyFilters();
            }
        });
    });
    
    // Update active filters object
    function updateActiveFilters() {
        // Reset arrays
        activeFilters.category = [];
        activeFilters.style = [];
        activeFilters.finish = [];
        activeFilters.application = [];
        
        // Collect checked checkboxes
        document.querySelectorAll('input[name="category"]:checked').forEach(input => {
            activeFilters.category.push({
                value: input.value,
                label: input.parentElement.querySelector('.filter-label').textContent
            });
        });
        
        document.querySelectorAll('input[name="style"]:checked').forEach(input => {
            activeFilters.style.push({
                value: input.value,
                label: input.parentElement.querySelector('.filter-label').textContent
            });
        });
        
        document.querySelectorAll('input[name="finish"]:checked').forEach(input => {
            activeFilters.finish.push({
                value: input.value,
                label: input.parentElement.querySelector('.filter-label').textContent
            });
        });
        
        document.querySelectorAll('input[name="application"]:checked').forEach(input => {
            activeFilters.application.push({
                value: input.value,
                label: input.parentElement.querySelector('.filter-label').textContent
            });
        });
        
        // Get selected price range
        const priceInput = document.querySelector('input[name="price"]:checked');
        if (priceInput) {
            activeFilters.price = priceInput.value;
        }
    }
    
    // Render active filter tags
    function renderActiveFilters() {
        if (!activeFiltersContainer) return;
        
        activeFiltersContainer.innerHTML = '';
        
        let hasFilters = false;
        
        // Render category filters
        activeFilters.category.forEach(filter => {
            hasFilters = true;
            activeFiltersContainer.appendChild(createFilterTag(filter.label, 'category', filter.value));
        });
        
        // Render style filters
        activeFilters.style.forEach(filter => {
            hasFilters = true;
            activeFiltersContainer.appendChild(createFilterTag(filter.label, 'style', filter.value));
        });
        
        // Render finish filters
        activeFilters.finish.forEach(filter => {
            hasFilters = true;
            activeFiltersContainer.appendChild(createFilterTag(filter.label, 'finish', filter.value));
        });
        
        // Render application filters
        activeFilters.application.forEach(filter => {
            hasFilters = true;
            activeFiltersContainer.appendChild(createFilterTag(filter.label, 'application', filter.value));
        });
        
        // Render price filter if not "all"
        if (activeFilters.price !== 'all') {
            hasFilters = true;
            const priceLabel = document.querySelector(`input[name="price"][value="${activeFilters.price}"]`)
                .parentElement.querySelector('.filter-label').textContent;
            activeFiltersContainer.appendChild(createFilterTag(priceLabel, 'price', activeFilters.price));
        }
        
        // Show/hide container
        activeFiltersContainer.style.display = hasFilters ? 'flex' : 'none';
    }
    
    // Create filter tag element
    function createFilterTag(label, type, value) {
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        tag.innerHTML = `
            ${label}
            <span class="filter-tag-remove" data-type="${type}" data-value="${value}">×</span>
        `;
        
        // Add remove event
        tag.querySelector('.filter-tag-remove').addEventListener('click', function() {
            removeFilter(this.dataset.type, this.dataset.value);
        });
        
        return tag;
    }
    
    // Remove a filter
    function removeFilter(type, value) {
        if (type === 'price') {
            document.querySelector('input[name="price"][value="all"]').checked = true;
        } else {
            const input = document.querySelector(`input[name="${type}"][value="${value}"]`);
            if (input) {
                input.checked = false;
            }
        }
        
        updateActiveFilters();
        renderActiveFilters();
        applyFilters();
    }
    
    // Reset all filters
    if (filterReset) {
        filterReset.addEventListener('click', () => {
            filterInputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else if (input.type === 'radio' && input.value === 'all') {
                    input.checked = true;
                }
            });
            
            updateActiveFilters();
            renderActiveFilters();
            applyFilters();
        });
    }
    
    // Apply filters (would communicate with backend in production)
    function applyFilters() {
        console.log('Applying filters:', activeFilters);
        
        // In production, this would:
        // 1. Make AJAX request to server with filter parameters
        // 2. Update product grid with results
        // 3. Update pagination
        // 4. Update result count
        
        // For demonstration, we'll just log and show a brief loading state
        const productsContainer = document.getElementById('archiveProducts');
        if (productsContainer) {
            productsContainer.style.opacity = '0.5';
            setTimeout(() => {
                productsContainer.style.opacity = '1';
            }, 300);
        }
    }
    
    // ================================================
    // VIEW SWITCHER (Grid/List)
    // ================================================
    
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsContainer = document.getElementById('archiveProducts');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update products container
            if (productsContainer) {
                if (view === 'list') {
                    productsContainer.classList.add('list-view');
                } else {
                    productsContainer.classList.remove('list-view');
                }
            }
            
            // Save preference to localStorage
            localStorage.setItem('productViewMode', view);
        });
    });
    
    // Load saved view preference
    const savedView = localStorage.getItem('productViewMode');
    if (savedView && productsContainer) {
        const viewButton = document.querySelector(`.view-btn[data-view="${savedView}"]`);
        if (viewButton) {
            viewButton.click();
        }
    }
    
    // ================================================
    // SORT FUNCTIONALITY
    // ================================================
    
    const sortSelect = document.getElementById('sortBy');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Sorting by:', sortValue);
            
            // In production, this would:
            // 1. Make AJAX request with sort parameter
            // 2. Update product grid with sorted results
            
            // Show loading state
            if (productsContainer) {
                productsContainer.style.opacity = '0.5';
                setTimeout(() => {
                    productsContainer.style.opacity = '1';
                }, 300);
            }
        });
    }
    
    // ================================================
    // PAGINATION
    // ================================================
    
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const paginationPrev = document.querySelector('.pagination-prev');
    const paginationNext = document.querySelector('.pagination-next');
    
    let currentPage = 1;
    const totalPages = 9; // Would come from server in production
    
    // Handle page number clicks
    paginationNumbers.forEach(button => {
        button.addEventListener('click', function() {
            const pageNum = parseInt(this.textContent);
            if (!isNaN(pageNum)) {
                goToPage(pageNum);
            }
        });
    });
    
    // Handle previous button
    if (paginationPrev) {
        paginationPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });
    }
    
    // Handle next button
    if (paginationNext) {
        paginationNext.addEventListener('click', () => {
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
    }
    
    // Go to specific page
    function goToPage(pageNum) {
        currentPage = pageNum;
        
        // Update active state
        paginationNumbers.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === pageNum) {
                btn.classList.add('active');
            }
        });
        
        // Update prev/next buttons
        if (paginationPrev) {
            paginationPrev.disabled = currentPage === 1;
        }
        if (paginationNext) {
            paginationNext.disabled = currentPage === totalPages;
        }
        
        // Scroll to top of products
        const archiveSection = document.querySelector('.archive-section');
        if (archiveSection) {
            const offset = 100; // Nav height
            const top = archiveSection.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
        
        // In production, this would:
        // 1. Make AJAX request for page data
        // 2. Update product grid
        // 3. Update URL with page parameter
        
        console.log('Loading page:', pageNum);
        
        // Show loading state
        if (productsContainer) {
            productsContainer.style.opacity = '0.5';
            setTimeout(() => {
                productsContainer.style.opacity = '1';
            }, 300);
        }
    }
    
    // ================================================
    // PRODUCT CARD INTERACTIONS
    // ================================================
    
    const productItems = document.querySelectorAll('.archive-product-item');
    
    productItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        });
    });
    
    // ================================================
    // KEYBOARD NAVIGATION
    // ================================================
    
    // Add keyboard support for product cards
    productItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = this.querySelector('.archive-product-link');
                if (link) {
                    e.preventDefault();
                    link.click();
                }
            }
        });
    });
    
    // ================================================
    // RESPONSIVE BEHAVIOR
    // ================================================
    
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close mobile filters on resize to desktop
            if (window.innerWidth > 1024 && sidebarFilters) {
                sidebarFilters.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });
    
    // ================================================
    // SCROLL POSITION RESTORATION
    // ================================================
    
    // Save scroll position before leaving page
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('archiveScrollPos', window.pageYOffset);
    });
    
    // Restore scroll position on page load
    window.addEventListener('load', () => {
        const scrollPos = sessionStorage.getItem('archiveScrollPos');
        if (scrollPos) {
            window.scrollTo(0, parseInt(scrollPos));
            sessionStorage.removeItem('archiveScrollPos');
        }
    });
    
    // ================================================
    // INITIALIZATION
    // ================================================
    
    // Initialize active filters display
    updateActiveFilters();
    renderActiveFilters();
    
    console.log('Product Archive - Interactive features initialized');
    
})();


/* =================================================================
   videos.js - Videos page - modal player, filtering, quality/speed controls
   ================================================================= */

// ================================================
// VIDEOS PAGE JAVASCRIPT
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================================
    // VIDEO MODAL FUNCTIONALITY
    // ================================================
    const videoModal = document.getElementById('videoModal');
    
    // This script targets the videos page only.
    if (!videoModal) return;
    
    const videoModalClose = document.getElementById('videoModalClose');
    const youtubePlayer = document.getElementById('youtubePlayer');
    const customPlayer = document.getElementById('customPlayer');
    const youtubeIframe = document.getElementById('youtubeIframe');
    const videoElement = document.getElementById('videoElement');
    
    let currentVideoType = null;
    
    // Open video modal
    function openVideoModal(videoId, type) {
        currentVideoType = type;
        
        if (type === 'youtube') {
            // Show YouTube player
            youtubePlayer.style.display = 'block';
            customPlayer.style.display = 'none';
            
            // Set YouTube iframe src
            youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        } else if (type === 'hosted') {
            // Show custom video player
            youtubePlayer.style.display = 'none';
            customPlayer.style.display = 'block';
            
            // Set video source
            videoElement.src = videoId;
            videoElement.load();
            videoElement.play();
        }
        
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close video modal
    function closeVideoModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Stop YouTube video
        if (currentVideoType === 'youtube') {
            youtubeIframe.src = '';
        }
        
        // Stop hosted video
        if (currentVideoType === 'hosted') {
            videoElement.pause();
            videoElement.src = '';
        }
        
        currentVideoType = null;
    }
    
    // Event listeners for modal
    videoModalClose.addEventListener('click', closeVideoModal);
    videoModal.querySelector('.video-modal-overlay').addEventListener('click', closeVideoModal);
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (videoModal.classList.contains('active') && e.key === 'Escape') {
            closeVideoModal();
        }
    });
    
    // ================================================
    // VIDEO THUMBNAIL CLICK HANDLERS
    // ================================================
    
    // Featured video
    const featuredPlayer = document.getElementById('featuredPlayer');
    if (featuredPlayer) {
        featuredPlayer.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            const type = this.getAttribute('data-type');
            openVideoModal(videoId, type);
        });
    }
    
    // All video thumbnails
    const videoThumbnails = document.querySelectorAll('.video-card .video-thumbnail');
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id') || this.getAttribute('data-video-src');
            const type = this.getAttribute('data-type');
            openVideoModal(videoId, type);
        });
    });
    
    // ================================================
    // FILTER FUNCTIONALITY
    // ================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const typeButtons = document.querySelectorAll('.type-btn');
    const videoCards = document.querySelectorAll('.video-card');
    
    let currentCategoryFilter = 'all';
    let currentTypeFilter = 'all';
    
    // Category filters
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            currentCategoryFilter = this.getAttribute('data-filter');
            
            // Apply filters
            applyFilters();
        });
    });
    
    // Type filters (YouTube/Hosted)
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            typeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            currentTypeFilter = this.getAttribute('data-type');
            
            // Apply filters
            applyFilters();
        });
    });
    
    function applyFilters() {
        videoCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const type = card.getAttribute('data-type');
            
            const categoryMatch = currentCategoryFilter === 'all' || category === currentCategoryFilter;
            const typeMatch = currentTypeFilter === 'all' || type === currentTypeFilter;
            
            if (categoryMatch && typeMatch) {
                // Show card with animation
                card.classList.remove('filtering-out', 'hidden');
                card.classList.add('filtering-in');
                
                setTimeout(() => {
                    card.classList.remove('filtering-in');
                }, 500);
            } else {
                // Hide card with animation
                card.classList.add('filtering-out');
                
                setTimeout(() => {
                    card.classList.remove('filtering-out');
                    card.classList.add('hidden');
                }, 300);
            }
        });
        
        // Update visible count
        updateVisibleCount();
    }
    
    function updateVisibleCount() {
        const visibleCards = Array.from(videoCards).filter(card => 
            !card.classList.contains('hidden')
        );
        
        console.log(`Showing ${visibleCards.length} of ${videoCards.length} videos`);
    }
    
    // ================================================
    // LOAD MORE FUNCTIONALITY
    // ================================================
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Create loading state
            this.innerHTML = '<span class="loading-spinner"></span>';
            this.disabled = true;
            
            // Simulate loading more videos
            setTimeout(() => {
                this.innerHTML = 'No More Videos';
                this.classList.add('disabled');
                
                // In production, this would load more videos from the server
                // and append them to the grid
            }, 1500);
        });
    }
    
    // ================================================
    // VIDEO CARD HOVER ENHANCEMENTS
    // ================================================
    videoCards.forEach(card => {
        const thumbnail = card.querySelector('.video-thumbnail');
        const playButton = card.querySelector('.play-button');
        
        // Add ripple effect on click
        thumbnail.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
                animation: ripple 0.6s;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = e.clientX - rect.left + 'px';
            ripple.style.top = e.clientY - rect.top + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ================================================
    // LAZY LOADING FOR VIDEO THUMBNAILS
    // ================================================
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
    };
    
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('loaded');
                
                // In production, load actual thumbnail image here
                
                observer.unobserve(card);
            }
        });
    }, observerOptions);
    
    videoCards.forEach(card => {
        videoObserver.observe(card);
    });
    
    // ================================================
    // CUSTOM VIDEO PLAYER CONTROLS ENHANCEMENT
    // ================================================
    if (videoElement) {
        // Add keyboard shortcuts
        videoElement.addEventListener('keydown', function(e) {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    if (this.paused) {
                        this.play();
                    } else {
                        this.pause();
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.currentTime += 10;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.currentTime -= 10;
                    break;
                case 'f':
                    e.preventDefault();
                    if (this.requestFullscreen) {
                        this.requestFullscreen();
                    }
                    break;
                case 'm':
                    e.preventDefault();
                    this.muted = !this.muted;
                    break;
            }
        });
        
        // Show video loading state
        videoElement.addEventListener('loadstart', function() {
            console.log('Video loading started...');
        });
        
        videoElement.addEventListener('canplay', function() {
            console.log('Video ready to play');
        });
        
        // Handle video errors
        videoElement.addEventListener('error', function() {
            console.error('Error loading video');
            alert('Unable to load video. Please check your connection or try again later.');
        });
    }
    
    // ================================================
    // PLAYLIST FUNCTIONALITY
    // ================================================
    const playlistCards = document.querySelectorAll('.playlist-card');
    
    playlistCards.forEach(card => {
        card.addEventListener('click', function() {
            const playlistTitle = this.querySelector('.playlist-title').textContent;
            alert(`Opening playlist: ${playlistTitle}\n\nIn production, this would open a playlist view with all videos from this collection.`);
        });
    });
    
    // ================================================
    // VIDEO STATISTICS TRACKING
    // ================================================
    function trackVideoView(videoId, type) {
        // In production, send analytics to server
        console.log(`Video viewed: ${videoId} (${type})`);
        
        // Example: Send to analytics service
        // analytics.track('video_view', {
        //     video_id: videoId,
        //     video_type: type,
        //     timestamp: new Date().toISOString()
        // });
    }
    
    // Track when videos are opened
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id') || this.getAttribute('data-video-src');
            const type = this.getAttribute('data-type');
            trackVideoView(videoId, type);
        });
    });
    
    // ================================================
    // SHARE VIDEO FUNCTIONALITY
    // ================================================
    function shareVideo(videoTitle, videoUrl) {
        if (navigator.share) {
            navigator.share({
                title: videoTitle,
                text: `Check out this video: ${videoTitle}`,
                url: videoUrl
            }).then(() => {
                console.log('Video shared successfully');
            }).catch((error) => {
                console.log('Error sharing:', error);
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(videoUrl).then(() => {
                alert('Video link copied to clipboard!');
            });
        }
    }
    
    // ================================================
    // VIDEO QUALITY SELECTOR (for hosted videos)
    // ================================================
    function createQualitySelector() {
        const qualityOptions = ['360p', '720p', '1080p', '4K'];
        let currentQuality = '1080p';
        
        // In production, create UI for quality selection
        // and switch video sources based on selection
        
        return {
            getCurrentQuality: () => currentQuality,
            setQuality: (quality) => {
                if (qualityOptions.includes(quality)) {
                    currentQuality = quality;
                    console.log(`Video quality set to ${quality}`);
                    // Switch video source here
                }
            }
        };
    }
    
    const qualitySelector = createQualitySelector();
    
    // ================================================
    // PLAYBACK SPEED CONTROL
    // ================================================
    const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    let currentSpeedIndex = 3; // Default to 1x
    
    function changePlaybackSpeed(direction) {
        if (!videoElement) return;
        
        if (direction === 'increase' && currentSpeedIndex < playbackSpeeds.length - 1) {
            currentSpeedIndex++;
        } else if (direction === 'decrease' && currentSpeedIndex > 0) {
            currentSpeedIndex--;
        }
        
        videoElement.playbackRate = playbackSpeeds[currentSpeedIndex];
        console.log(`Playback speed: ${playbackSpeeds[currentSpeedIndex]}x`);
    }
    
    // ================================================
    // THUMBNAIL GENERATION (for hosted videos)
    // ================================================
    function generateThumbnail(videoUrl) {
        // Create a video element to capture thumbnail
        const video = document.createElement('video');
        video.src = videoUrl;
        video.crossOrigin = 'anonymous';
        
        video.addEventListener('loadeddata', function() {
            // Seek to 5 seconds
            video.currentTime = 5;
        });
        
        video.addEventListener('seeked', function() {
            // Create canvas and capture frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Get thumbnail as data URL
            const thumbnailUrl = canvas.toDataURL('image/jpeg');
            console.log('Thumbnail generated:', thumbnailUrl);
            
            // In production, save or use this thumbnail
        });
    }
    
    // ================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================================
    
    // Add ARIA labels to play buttons
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach((button, index) => {
        const card = button.closest('.video-card');
        if (card) {
            const title = card.querySelector('.video-title');
            if (title) {
                button.setAttribute('aria-label', `Play video: ${title.textContent}`);
            }
        }
    });
    
    // Add keyboard navigation for video cards
    videoCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const thumbnail = this.querySelector('.video-thumbnail');
                if (thumbnail) {
                    thumbnail.click();
                }
            }
        });
    });
    
    // ================================================
    // VIDEO DURATION FORMATTER
    // ================================================
    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    // ================================================
    // WATCH LATER / FAVORITES FUNCTIONALITY
    // ================================================
    let watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    function addToWatchLater(videoId) {
        if (!watchLater.includes(videoId)) {
            watchLater.push(videoId);
            localStorage.setItem('watchLater', JSON.stringify(watchLater));
            console.log('Added to Watch Later:', videoId);
        }
    }
    
    function addToFavorites(videoId) {
        if (!favorites.includes(videoId)) {
            favorites.push(videoId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            console.log('Added to Favorites:', videoId);
        }
    }
    
    function removeFromWatchLater(videoId) {
        watchLater = watchLater.filter(id => id !== videoId);
        localStorage.setItem('watchLater', JSON.stringify(watchLater));
    }
    
    function removeFromFavorites(videoId) {
        favorites = favorites.filter(id => id !== videoId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    // ================================================
    // SMOOTH SCROLL FOR FILTER BAR
    // ================================================
    const videoFilters = document.querySelector('.video-filters');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            videoFilters.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            videoFilters.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
    
    // ================================================
    // INITIAL SETUP
    // ================================================
    
    console.log('Video library initialized');
    console.log(`Total videos: ${videoCards.length}`);
    
    // Initial filter application
    applyFilters();
    
});

