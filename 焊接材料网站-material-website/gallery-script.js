/* ===================================
   GALLERY PAGE JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {

    // Configuration
    const ITEMS_PER_PAGE = 12;
    let currentPage = 1;
    let currentFilter = 'all';
    let currentLightboxIndex = 0;
    let filteredItems = [];

    // DOM Elements
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const filterButtons = document.querySelectorAll('.filter-btn');
    const imageCount = document.getElementById('imageCount');
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');

    // === FILTER FUNCTIONALITY ===
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            currentPage = 1;

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            filterItems(filter);
            updatePagination();
            displayPage(currentPage);
        });
    });

    function filterItems(filter) {
        filteredItems = galleryItems.filter(item => {
            if (filter === 'all') {
                return true;
            }
            return item.getAttribute('data-category') === filter;
        });

        // Update count
        imageCount.textContent = filteredItems.length;

        // Animate filter transition
        galleryItems.forEach(item => {
            item.classList.add('fade-out');
        });

        setTimeout(() => {
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden', 'fade-out');
                    item.classList.add('fade-in');
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('fade-out', 'fade-in');
                }
            });
        }, 300);
    }

    // === PAGINATION ===
    function updatePagination() {
        const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
        
        // Clear pagination numbers
        paginationNumbers.innerHTML = '';

        // Create page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-number';
            pageBtn.textContent = i;
            pageBtn.setAttribute('data-page', i);
            
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }

            pageBtn.addEventListener('click', function() {
                currentPage = parseInt(this.getAttribute('data-page'));
                displayPage(currentPage);
                updatePaginationButtons();
                scrollToGallery();
            });

            paginationNumbers.appendChild(pageBtn);
        }

        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
        
        // Update prev/next buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // Update active page number
        const pageNumbers = document.querySelectorAll('.page-number');
        pageNumbers.forEach(btn => {
            const page = parseInt(btn.getAttribute('data-page'));
            if (page === currentPage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function displayPage(page) {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // Hide all items first
        galleryItems.forEach(item => item.style.display = 'none');

        // Show items for current page
        filteredItems.forEach((item, index) => {
            if (index >= startIndex && index < endIndex) {
                item.style.display = 'block';
            }
        });
    }

    // Prev/Next button handlers
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
            updatePaginationButtons();
            scrollToGallery();
        }
    });

    nextBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(currentPage);
            updatePaginationButtons();
            scrollToGallery();
        }
    });

    function scrollToGallery() {
        const gallerySection = document.querySelector('.gallery-section');
        if (gallerySection) {
            window.scrollTo({
                top: gallerySection.offsetTop - 150,
                behavior: 'smooth'
            });
        }
    }

    // === LIGHTBOX FUNCTIONALITY ===
    
    // Open lightbox
    function openLightbox(index) {
        currentLightboxIndex = index;
        const item = filteredItems[index];
        
        if (!item) return;

        const title = item.getAttribute('data-title');
        const description = item.getAttribute('data-description');
        
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightboxCounter.textContent = `${index + 1} / ${filteredItems.length}`;
        
        // Copy image placeholder to lightbox
        const imageElement = item.querySelector('.image-placeholder').cloneNode(true);
        lightboxImage.innerHTML = '';
        lightboxImage.appendChild(imageElement);
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Navigate lightbox
    function navigateLightbox(direction) {
        if (direction === 'next') {
            currentLightboxIndex = (currentLightboxIndex + 1) % filteredItems.length;
        } else {
            currentLightboxIndex = (currentLightboxIndex - 1 + filteredItems.length) % filteredItems.length;
        }
        openLightbox(currentLightboxIndex);
    }

    // Add click events to gallery items
    galleryItems.forEach((item, index) => {
        const zoomBtn = item.querySelector('.zoom-btn');
        const galleryImage = item.querySelector('.gallery-image');
        
        const openHandler = (e) => {
            e.preventDefault();
            const currentFilteredIndex = filteredItems.indexOf(item);
            if (currentFilteredIndex !== -1) {
                openLightbox(currentFilteredIndex);
            }
        };

        zoomBtn.addEventListener('click', openHandler);
        galleryImage.addEventListener('click', openHandler);
    });

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox('prev');
                break;
            case 'ArrowRight':
                navigateLightbox('next');
                break;
        }
    });

    // Prevent body scroll when swiping in lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next image
            navigateLightbox('next');
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous image
            navigateLightbox('prev');
        }
    }

    // === INITIALIZE ===
    function initialize() {
        filterItems('all');
        updatePagination();
        displayPage(1);
    }

    initialize();

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

    // Observe gallery items
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(item);
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

    // === LAZY LOADING (Optional Enhancement) ===
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    // In production, load actual images here
                    // lazyImage.src = lazyImage.dataset.src;
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        const lazyImages = document.querySelectorAll('.image-placeholder');
        lazyImages.forEach(img => lazyImageObserver.observe(img));
    }

    // === DOWNLOAD IMAGE (Optional) ===
    function downloadImage() {
        // In production, implement actual image download
        console.log('Downloading image...');
        alert('Download functionality would be implemented here in production.');
    }

    // === SHARE IMAGE (Optional) ===
    function shareImage() {
        const item = filteredItems[currentLightboxIndex];
        const title = item.getAttribute('data-title');
        
        if (navigator.share) {
            navigator.share({
                title: title,
                text: 'Check out this image from Precision Materials',
                url: window.location.href
            }).catch(err => console.log('Share failed:', err));
        } else {
            // Fallback: Copy link
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard!');
            });
        }
    }

    // === FULLSCREEN MODE (Optional) ===
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            lightbox.requestFullscreen().catch(err => {
                console.log('Fullscreen failed:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // === KEYBOARD SHORTCUTS INFO ===
    console.log('%c Gallery Keyboard Shortcuts:', 'font-weight: bold; font-size: 14px;');
    console.log('ESC - Close lightbox');
    console.log('← - Previous image');
    console.log('→ - Next image');

});
