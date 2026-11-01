/* ===================================
   CONTACT PAGE JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {

    // === CONTACT FORM SUBMISSION ===
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company'),
                inquiryType: formData.get('inquiryType'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                newsletter: formData.get('newsletter') ? 'Yes' : 'No'
            };
            
            // Validate form
            if (!data.firstName || !data.lastName || !data.email || !data.inquiryType || !data.subject || !data.message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Validate email format
            if (!isValidEmail(data.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            submitForm(data);
        });
    }
    
    function submitForm(data) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // In production, replace this with actual API call
            console.log('Form data:', data);
            
            // Show success message
            showFormMessage('Thank you for contacting us! We will get back to you within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        }, 1500);
    }
    
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // === FAQ ACCORDION ===
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // === FORM FIELD VALIDATION ===
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    
    formInputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            
            // Real-time validation
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#e74c3c';
            } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '';
            }
        });
        
        // Clear error styling on input
        input.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    });

    // === PHONE NUMBER FORMATTING ===
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            
            e.target.value = value;
        });
    }

    // === INQUIRY TYPE CHANGE ===
    const inquiryTypeSelect = document.getElementById('inquiryType');
    
    if (inquiryTypeSelect) {
        inquiryTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            const subjectInput = document.getElementById('subject');
            
            // Pre-fill subject based on inquiry type
            if (selectedType && !subjectInput.value) {
                const subjectTemplates = {
                    'product': 'Product Information Request',
                    'quote': 'Request for Quotation',
                    'technical': 'Technical Support Request',
                    'sample': 'Sample Request',
                    'partnership': 'Partnership Inquiry',
                    'other': ''
                };
                
                subjectInput.value = subjectTemplates[selectedType] || '';
            }
        });
    }

    // === SMOOTH SCROLL TO FORM ===
    const getInTouchBtn = document.querySelector('a[href="#contact-form"]');
    
    if (getInTouchBtn) {
        getInTouchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const formSection = document.getElementById('contact-form');
            if (formSection) {
                const offsetTop = formSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // === MAP INTERACTION ===
    const mapContainer = document.querySelector('.map-placeholder');
    
    if (mapContainer) {
        mapContainer.addEventListener('click', function() {
            // In production, this could open the actual Google Maps
            console.log('Opening map...');
        });
    }

    // === SOCIAL SHARE (Optional) ===
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('aria-label');
            console.log(`Opening ${platform}...`);
            // In production, add actual social media links
        });
    });

    // === CHARACTER COUNTER FOR MESSAGE ===
    const messageTextarea = document.getElementById('message');
    
    if (messageTextarea) {
        const maxLength = 1000;
        const counterDiv = document.createElement('div');
        counterDiv.className = 'character-counter';
        counterDiv.style.cssText = 'font-size: 0.85rem; color: var(--color-aluminum); text-align: right; margin-top: 0.25rem;';
        messageTextarea.parentElement.appendChild(counterDiv);
        
        function updateCounter() {
            const remaining = maxLength - messageTextarea.value.length;
            counterDiv.textContent = `${messageTextarea.value.length} / ${maxLength} characters`;
            
            if (remaining < 50) {
                counterDiv.style.color = '#e74c3c';
            } else {
                counterDiv.style.color = 'var(--color-aluminum)';
            }
        }
        
        messageTextarea.addEventListener('input', updateCounter);
        messageTextarea.setAttribute('maxlength', maxLength);
        updateCounter();
    }

    // === AUTO-SAVE FORM DATA (OPTIONAL) ===
    function saveFormData() {
        const formData = {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            company: document.getElementById('company')?.value || '',
            subject: document.getElementById('subject')?.value || '',
            message: document.getElementById('message')?.value || ''
        };
        
        localStorage.setItem('contactFormDraft', JSON.stringify(formData));
    }
    
    function loadFormData() {
        const savedData = localStorage.getItem('contactFormDraft');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = document.getElementById(key);
                if (input && data[key]) {
                    input.value = data[key];
                }
            });
        }
    }
    
    // Load saved data on page load
    loadFormData();
    
    // Auto-save every 30 seconds
    setInterval(saveFormData, 30000);
    
    // Clear saved data on successful submission
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            localStorage.removeItem('contactFormDraft');
        });
    }

    // === ANIMATE ON SCROLL ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.info-card, .sidebar-card, .faq-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });

    // === STICKY HEADER ON SCROLL ===
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // === MOBILE MENU TOGGLE ===
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

});
