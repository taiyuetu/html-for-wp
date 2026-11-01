/* ===================================
   PRODUCT DETAIL PAGE JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {

    // === GALLERY THUMBNAILS ===
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image .image-placeholder');
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // In a real scenario, you would update the main image src here
            // mainImage.style.backgroundImage = `url('${imageUrls[index]}')`;
        });
    });

    // === PRODUCT TABS ===
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Smooth scroll to tabs section
            const tabsSection = document.querySelector('.product-tabs-section');
            if (tabsSection && window.innerWidth < 768) {
                window.scrollTo({
                    top: tabsSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === FAVORITE BUTTON ===
    const favoriteBtn = document.querySelector('.btn-icon');
    let isFavorite = false;
    
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            isFavorite = !isFavorite;
            const heart = this.querySelector('span');
            
            if (isFavorite) {
                heart.textContent = '♥';
                heart.style.color = 'var(--color-main)';
                this.style.borderColor = 'var(--color-main)';
                this.style.background = 'rgba(232, 7, 23, 0.05)';
            } else {
                heart.textContent = '♡';
                heart.style.color = '';
                this.style.borderColor = '';
                this.style.background = '';
            }
        });
    }

    // === PRODUCT OPTIONS CHANGE ===
    const optionSelects = document.querySelectorAll('.option-select');
    
    optionSelects.forEach(select => {
        select.addEventListener('change', function() {
            const selectedValue = this.value;
            console.log(`Selected: ${this.previousElementSibling.textContent} - ${selectedValue}`);
            
            // In a real scenario, you might update price, availability, etc.
            // updateProductInfo(selectedValue);
        });
    });

    // === REQUEST SAMPLE BUTTON ===
    const requestSampleBtn = document.querySelector('.btn-primary.btn-large');
    
    if (requestSampleBtn) {
        requestSampleBtn.addEventListener('click', function() {
            // Get selected options
            const diameter = document.querySelector('.option-select:nth-of-type(1)').value;
            const length = document.querySelector('.option-select:nth-of-type(2)').value;
            const packaging = document.querySelector('.option-select:nth-of-type(3)').value;
            
            // In a real scenario, open a modal or redirect to contact form
            alert(`Sample Request:\n\nProduct: Aluminum Silicon Brazing Rod (PM-AL-4047)\nDiameter: ${diameter}\nLength: ${length}\nPackaging: ${packaging}\n\nRedirecting to contact form...`);
            
            // Optionally redirect to contact page with pre-filled data
            // window.location.href = 'index.html#contact';
        });
    }

    // === DOWNLOAD DATASHEET BUTTON ===
    const downloadBtn = document.querySelector('.btn-secondary.btn-large');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // In a real scenario, trigger download or open PDF
            alert('Downloading Technical Datasheet...\n\nIn production, this would download the actual PDF file.');
            
            // Example: window.open('path/to/datasheet.pdf', '_blank');
        });
    }

    // === DOCUMENT DOWNLOAD BUTTONS ===
    const documentBtns = document.querySelectorAll('.document-list .btn');
    
    documentBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const documentName = this.closest('li').querySelector('span').textContent;
            
            if (this.textContent.includes('Request')) {
                alert(`Requesting: ${documentName}\n\nOur team will send this document to your email within 24 hours.`);
            } else {
                alert(`Downloading: ${documentName}\n\nIn production, this would download the actual document.`);
            }
        });
    });

    // === STICKY HEADER ON SCROLL ===
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
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

    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // === IMAGE ZOOM ON CLICK (Optional Enhancement) ===
    const mainImageContainer = document.querySelector('.main-image');
    
    if (mainImageContainer) {
        mainImageContainer.addEventListener('click', function() {
            this.classList.toggle('zoomed');
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
    document.querySelectorAll('.application-card, .cert-card, .product-card-mini').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // === PRINT SPECIFICATIONS ===
    function printSpecifications() {
        window.print();
    }

    // === SHARE PRODUCT (Optional Enhancement) ===
    function shareProduct() {
        if (navigator.share) {
            navigator.share({
                title: document.querySelector('.product-title').textContent,
                text: document.querySelector('.product-description').textContent,
                url: window.location.href
            }).catch(err => console.log('Share failed:', err));
        } else {
            // Fallback: Copy link to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Product link copied to clipboard!');
            });
        }
    }

    // === RELATED PRODUCTS INTERACTION ===
    const relatedProductCards = document.querySelectorAll('.product-card-mini');
    
    relatedProductCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // If clicking the button, don't trigger card click
            if (!e.target.classList.contains('btn')) {
                const link = this.querySelector('.btn');
                if (link) {
                    window.location.href = link.getAttribute('href');
                }
            }
        });
    });

    // === KEYBOARD NAVIGATION FOR TABS ===
    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            let newIndex;
            
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                newIndex = (index + 1) % tabButtons.length;
                tabButtons[newIndex].click();
                tabButtons[newIndex].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
                tabButtons[newIndex].click();
                tabButtons[newIndex].focus();
            }
        });
    });

    // === LAZY LOAD IMAGES (if using real images) ===
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));

    // === TABLE RESPONSIVE WRAPPER (for small screens) ===
    const tables = document.querySelectorAll('.specs-table');
    
    tables.forEach(table => {
        if (!table.parentElement.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('table-responsive');
            wrapper.style.overflowX = 'auto';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });

});

// === UTILITY FUNCTIONS ===

// Update product availability display
function updateAvailability(inStock) {
    const availabilityElement = document.querySelector('.meta-value.in-stock');
    if (availabilityElement) {
        if (inStock) {
            availabilityElement.textContent = 'In Stock';
            availabilityElement.style.color = '#27ae60';
        } else {
            availabilityElement.textContent = 'Out of Stock';
            availabilityElement.style.color = '#e74c3c';
        }
    }
}

// Format price (if you add pricing)
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}
