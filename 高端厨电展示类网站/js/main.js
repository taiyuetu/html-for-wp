document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal-on-scroll');
    animatedElements.forEach(el => scrollObserver.observe(el));

    // --- Hero Animations on Load ---
    setTimeout(() => {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            el.classList.add('active');
        });
    }, 100);

    // --- Sticky Header ---
    const header = document.getElementById('site-header');

    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Run on load

    // --- Parallax Effect ---
    const parallaxBGs = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        parallaxBGs.forEach(bg => {
            const speed = bg.dataset.speed || 0.5;
            bg.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('is-open');
            mobileToggle.classList.toggle('is-active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu on nav link click
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('is-open');
                mobileToggle.classList.remove('is-active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Progress Indicator (Optional Enhancement) ---
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });

    // --- Hero Slider ---
    const initHeroSlider = () => {
        const slider = document.querySelector('.hero-slider');
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');
        const prevBtn = document.querySelector('.hero-prev');
        const nextBtn = document.querySelector('.hero-next');

        if (!slider || slides.length === 0) return;

        let currentSlide = 0;
        let autoPlayInterval;
        const autoPlayDelay = 6000; // 6 seconds

        // Go to specific slide
        const goToSlide = (index) => {
            // Wrap around
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            // Update slides
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            currentSlide = index;
        };

        // Navigation handlers
        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        // Event listeners for buttons
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        // Event listeners for dots
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
        });

        // Auto-play
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        const resetAutoPlay = () => {
            stopAutoPlay();
            startAutoPlay();
        };

        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoPlay();
        }, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Only trigger if hero is in viewport
            const heroRect = slider.getBoundingClientRect();
            const heroInView = heroRect.top < window.innerHeight && heroRect.bottom > 0;

            if (heroInView) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    resetAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    resetAutoPlay();
                }
            }
        });

        // Start auto-play
        startAutoPlay();
    };

    initHeroSlider();

    // --- Category Carousel ---
    const initCarousel = () => {
        const carousel = document.querySelector('.category-carousel');
        const track = document.querySelector('.carousel-track');
        const cards = document.querySelectorAll('.carousel-track .cat-card');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');

        if (!carousel || !track || cards.length === 0) return;

        let currentIndex = 0;
        let itemsPerView = 3;

        // Determine items per view based on screen width
        const updateItemsPerView = () => {
            if (window.innerWidth <= 600) {
                itemsPerView = 1;
            } else if (window.innerWidth <= 900) {
                itemsPerView = 2;
            } else {
                itemsPerView = 3;
            }
        };

        updateItemsPerView();

        const totalSlides = Math.ceil(cards.length / itemsPerView);

        // Create dots
        const createDots = () => {
            dotsContainer.innerHTML = '';
            const slidesCount = Math.ceil(cards.length / itemsPerView);
            for (let i = 0; i < slidesCount; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        };

        createDots();

        // Update dot states
        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            const slideIndex = Math.floor(currentIndex / itemsPerView);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === slideIndex);
            });
        };

        // Calculate card width dynamically
        const getCardWidth = () => {
            const card = cards[0];
            const style = window.getComputedStyle(card);
            const gap = parseFloat(window.getComputedStyle(track).gap) || 32;
            return card.offsetWidth + gap;
        };

        // Go to specific slide
        const goToSlide = (slideIndex) => {
            const cardWidth = getCardWidth();
            currentIndex = slideIndex * itemsPerView;
            const maxIndex = cards.length - itemsPerView;
            currentIndex = Math.min(currentIndex, maxIndex);
            currentIndex = Math.max(currentIndex, 0);
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            updateDots();
            updateButtons();
        };

        // Update button states
        const updateButtons = () => {
            const maxIndex = cards.length - itemsPerView;
            prevBtn.disabled = currentIndex <= 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        };

        // Navigate
        const navigate = (direction) => {
            const cardWidth = getCardWidth();
            const maxIndex = cards.length - itemsPerView;

            if (direction === 'next' && currentIndex < maxIndex) {
                currentIndex = Math.min(currentIndex + itemsPerView, maxIndex);
            } else if (direction === 'prev' && currentIndex > 0) {
                currentIndex = Math.max(currentIndex - itemsPerView, 0);
            }

            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            updateDots();
            updateButtons();
        };

        // Event listeners
        prevBtn.addEventListener('click', () => navigate('prev'));
        nextBtn.addEventListener('click', () => navigate('next'));

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    navigate('next');
                } else {
                    navigate('prev');
                }
            }
        }, { passive: true });

        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateItemsPerView();
                createDots();
                goToSlide(0);
            }, 200);
        });

        // Initialize button states
        updateButtons();
    };

    initCarousel();

    // --- Testimonial Carousel ---
    const initTestimonialCarousel = () => {
        const wrapper = document.querySelector('.testimonial-carousel-wrapper');
        const track = document.querySelector('.testimonial-track');
        const cards = document.querySelectorAll('.testimonial-track .quote-card');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        const dotsContainer = document.querySelector('.testimonial-dots');

        if (!wrapper || !track || cards.length === 0) return;

        let currentIndex = 0;
        let autoPlayInterval;
        const autoPlayDelay = 5000; // 5 seconds

        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.testimonial-dot');

        // Go to specific slide
        const goToSlide = (index) => {
            if (index < 0) index = cards.length - 1;
            if (index >= cards.length) index = 0;

            cards.forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            currentIndex = index;
        };

        // Navigation
        const nextSlide = () => goToSlide(currentIndex + 1);
        const prevSlide = () => goToSlide(currentIndex - 1);

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        // Auto-play
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        const resetAutoPlay = () => {
            stopAutoPlay();
            startAutoPlay();
        };

        // Pause on hover
        wrapper.addEventListener('mouseenter', stopAutoPlay);
        wrapper.addEventListener('mouseleave', startAutoPlay);

        // Touch support
        let touchStartX = 0;

        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
            }
            startAutoPlay();
        }, { passive: true });

        startAutoPlay();
    };

    initTestimonialCarousel();

    // --- Image Showcase Carousel ---
    const showcaseCarousel = document.querySelector('.showcase-carousel');
    const showcaseTrack = document.querySelector('.showcase-track');
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const showcasePrev = document.querySelector('.showcase-prev');
    const showcaseNext = document.querySelector('.showcase-next');
    const showcaseDotsContainer = document.querySelector('.showcase-dots');

    if (showcaseCarousel && showcaseTrack && showcaseItems.length > 0) {
        let showcaseCurrentIndex = 0;
        const showcaseTotalSlides = showcaseItems.length;

        // Create dots
        for (let i = 0; i < showcaseTotalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('showcase-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to image ${i + 1}`);
            dot.addEventListener('click', () => goToShowcaseSlide(i));
            showcaseDotsContainer.appendChild(dot);
        }

        const showcaseDots = document.querySelectorAll('.showcase-dot');

        function updateShowcaseCarousel() {
            const offset = -showcaseCurrentIndex * 100;
            showcaseTrack.style.transform = `translateX(${offset}%)`;

            // Update dots
            showcaseDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === showcaseCurrentIndex);
            });
        }

        function goToShowcaseSlide(index) {
            showcaseCurrentIndex = index;
            updateShowcaseCarousel();
        }

        function nextShowcaseSlide() {
            showcaseCurrentIndex = (showcaseCurrentIndex + 1) % showcaseTotalSlides;
            updateShowcaseCarousel();
        }

        function prevShowcaseSlide() {
            showcaseCurrentIndex = (showcaseCurrentIndex - 1 + showcaseTotalSlides) % showcaseTotalSlides;
            updateShowcaseCarousel();
        }

        // Event listeners
        if (showcaseNext) {
            showcaseNext.addEventListener('click', nextShowcaseSlide);
        }

        if (showcasePrev) {
            showcasePrev.addEventListener('click', prevShowcaseSlide);
        }

        // Auto-advance carousel
        let showcaseAutoplay = setInterval(nextShowcaseSlide, 5000);

        // Pause on hover
        showcaseCarousel.addEventListener('mouseenter', () => {
            clearInterval(showcaseAutoplay);
        });

        showcaseCarousel.addEventListener('mouseleave', () => {
            showcaseAutoplay = setInterval(nextShowcaseSlide, 5000);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevShowcaseSlide();
                clearInterval(showcaseAutoplay);
                showcaseAutoplay = setInterval(nextShowcaseSlide, 5000);
            } else if (e.key === 'ArrowRight') {
                nextShowcaseSlide();
                clearInterval(showcaseAutoplay);
                showcaseAutoplay = setInterval(nextShowcaseSlide, 5000);
            }
        });

        // Touch/swipe support
        let showcaseTouchStartX = 0;
        let showcaseTouchEndX = 0;

        showcaseCarousel.addEventListener('touchstart', (e) => {
            showcaseTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        showcaseCarousel.addEventListener('touchend', (e) => {
            showcaseTouchEndX = e.changedTouches[0].screenX;
            handleShowcaseSwipe();
        }, { passive: true });

        function handleShowcaseSwipe() {
            if (showcaseTouchStartX - showcaseTouchEndX > 50) {
                // Swipe left
                nextShowcaseSlide();
            }
            if (showcaseTouchEndX - showcaseTouchStartX > 50) {
                // Swipe right
                prevShowcaseSlide();
            }
        }
    }

    // --- Gallery Page Functionality ---
    
    // Gallery Filters
    const galleryFilterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryFilterBtns.length > 0 && galleryItems.length > 0) {
        galleryFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                galleryFilterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                let visibleCount = 0;
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Update count
                const countElement = document.getElementById('imageCount');
                if (countElement) {
                    countElement.textContent = visibleCount;
                }
            });
        });
    }
    
    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryViewBtns = document.querySelectorAll('.gallery-view-btn');
    
    if (lightbox && galleryViewBtns.length > 0) {
        let currentLightboxIndex = 0;
        const allGalleryItems = Array.from(galleryItems);
        
        // Open lightbox
        galleryViewBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const galleryItem = btn.closest('.gallery-item');
                currentLightboxIndex = parseInt(galleryItem.dataset.index);
                openLightbox(currentLightboxIndex);
            });
        });
        
        // Also open on image click
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                currentLightboxIndex = parseInt(this.dataset.index);
                openLightbox(currentLightboxIndex);
            });
        });
        
        function openLightbox(index) {
            const item = allGalleryItems.find(i => parseInt(i.dataset.index) === index);
            if (!item) return;
            
            const img = item.querySelector('.gallery-image img');
            const title = item.querySelector('.gallery-info-overlay h3');
            const desc = item.querySelector('.gallery-info-overlay p');
            
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxTitle.textContent = title ? title.textContent : '';
            lightboxDescription.textContent = desc ? desc.textContent : '';
            lightboxCounter.textContent = `${index + 1} / ${allGalleryItems.length}`;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        function showNextImage() {
            currentLightboxIndex = (currentLightboxIndex + 1) % allGalleryItems.length;
            openLightbox(currentLightboxIndex);
        }
        
        function showPrevImage() {
            currentLightboxIndex = (currentLightboxIndex - 1 + allGalleryItems.length) % allGalleryItems.length;
            openLightbox(currentLightboxIndex);
        }
        
        // Event listeners
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', showNextImage);
        }
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', showPrevImage);
        }
        
        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        });
    }
    
    // Pagination
    const paginationLinks = document.querySelectorAll('.pagination-link[data-page]');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (paginationLinks.length > 0) {
        let currentPage = 1;
        const totalPages = paginationLinks.length;
        
        function updatePagination(page) {
            currentPage = page;
            
            // Update active state
            paginationLinks.forEach(link => {
                link.classList.toggle('active', parseInt(link.dataset.page) === page);
            });
            
            // Update prev/next buttons
            if (prevPageBtn) {
                prevPageBtn.classList.toggle('disabled', page === 1);
            }
            if (nextPageBtn) {
                nextPageBtn.classList.toggle('disabled', page === totalPages);
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        paginationLinks.forEach(link => {
            link.addEventListener('click', function() {
                const page = parseInt(this.dataset.page);
                updatePagination(page);
            });
        });
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    updatePagination(currentPage - 1);
                }
            });
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', function() {
                if (currentPage < totalPages) {
                    updatePagination(currentPage + 1);
                }
            });
        }
    }

    // --- YouTube Video Carousel ---
    const videoCarousel = document.querySelector('.video-carousel');
    const videoTrack = document.querySelector('.video-carousel-track');
    const videoItems = document.querySelectorAll('.video-item');
    const videoPrev = document.querySelector('.video-prev');
    const videoNext = document.querySelector('.video-next');
    const videoDotsContainer = document.querySelector('.video-carousel-dots');

    if (videoCarousel && videoTrack && videoItems.length > 0) {
        let videoCurrentIndex = 0;
        const videoTotalItems = videoItems.length;
        
        // Determine videos per view based on screen size
        function getVideosPerView() {
            if (window.innerWidth > 1200) {
                return 3;
            } else if (window.innerWidth > 768) {
                return 2;
            } else {
                return 1;
            }
        }

        let videosPerView = getVideosPerView();
        const videoTotalPages = Math.ceil(videoTotalItems / videosPerView);

        // Create dots
        function createVideoDots() {
            videoDotsContainer.innerHTML = '';
            for (let i = 0; i < videoTotalPages; i++) {
                const dot = document.createElement('button');
                dot.classList.add('video-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to video group ${i + 1}`);
                dot.addEventListener('click', () => goToVideoPage(i));
                videoDotsContainer.appendChild(dot);
            }
        }

        createVideoDots();
        const videoDots = document.querySelectorAll('.video-dot');

        function updateVideoCarousel() {
            const itemWidth = videoItems[0].offsetWidth;
            const gap = 32; // 2rem = 32px
            const offset = videoCurrentIndex * (itemWidth * videosPerView + gap * videosPerView);
            videoTrack.style.transform = `translateX(-${offset}px)`;

            // Update dots
            videoDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === videoCurrentIndex);
            });

            // Update button states
            if (videoPrev) {
                videoPrev.style.opacity = videoCurrentIndex === 0 ? '0.5' : '1';
                videoPrev.style.cursor = videoCurrentIndex === 0 ? 'not-allowed' : 'pointer';
            }
            if (videoNext) {
                videoNext.style.opacity = videoCurrentIndex >= videoTotalPages - 1 ? '0.5' : '1';
                videoNext.style.cursor = videoCurrentIndex >= videoTotalPages - 1 ? 'not-allowed' : 'pointer';
            }
        }

        function goToVideoPage(pageIndex) {
            if (pageIndex >= 0 && pageIndex < videoTotalPages) {
                videoCurrentIndex = pageIndex;
                updateVideoCarousel();
            }
        }

        function nextVideoPage() {
            if (videoCurrentIndex < videoTotalPages - 1) {
                videoCurrentIndex++;
                updateVideoCarousel();
            }
        }

        function prevVideoPage() {
            if (videoCurrentIndex > 0) {
                videoCurrentIndex--;
                updateVideoCarousel();
            }
        }

        // Event listeners
        if (videoNext) {
            videoNext.addEventListener('click', nextVideoPage);
        }

        if (videoPrev) {
            videoPrev.addEventListener('click', prevVideoPage);
        }

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newVideosPerView = getVideosPerView();
                if (newVideosPerView !== videosPerView) {
                    videosPerView = newVideosPerView;
                    videoCurrentIndex = 0;
                    createVideoDots();
                    updateVideoCarousel();
                }
            }, 250);
        });

        // Initial update
        updateVideoCarousel();
    }

    // --- Videos Page Functionality ---
    
    // Video Category Filters
    const videoFilterBtns = document.querySelectorAll('.video-filters .filter-btn');
    const videoCards = document.querySelectorAll('.video-card');
    
    if (videoFilterBtns.length > 0 && videoCards.length > 0) {
        videoFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.dataset.category;
                
                // Update active button
                videoFilterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter videos
                let visibleCount = 0;
                videoCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Update count
                const countElement = document.getElementById('videoCount');
                if (countElement) {
                    countElement.textContent = visibleCount;
                }
            });
        });
    }
    
    // Video Search Functionality
    const videoSearchInput = document.getElementById('videoSearch');
    
    if (videoSearchInput && videoCards.length > 0) {
        videoSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            let visibleCount = 0;
            
            videoCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const category = card.querySelector('.video-category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Update count
            const countElement = document.getElementById('videoCount');
            if (countElement) {
                countElement.textContent = visibleCount;
            }
            
            // Reset category filter when searching
            if (searchTerm && videoFilterBtns.length > 0) {
                videoFilterBtns.forEach(btn => btn.classList.remove('active'));
            }
        });
    }
    
    // Load More Button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more videos
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                alert('This would load more videos from the server. In a real implementation, this would fetch additional videos via AJAX.');
                this.textContent = 'Load More Videos';
                this.disabled = false;
            }, 1000);
        });
    }

    // --- Search Overlay ---
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    if (searchToggle && searchOverlay && searchClose) {
        // Open search overlay
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Focus on input after animation
            setTimeout(() => {
                searchInput.focus();
            }, 400);
        });

        // Close search overlay
        const closeSearch = () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            searchInput.value = '';
        };

        searchClose.addEventListener('click', closeSearch);

        // Close on overlay click (outside search container)
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });

        // Search functionality (placeholder for actual search implementation)
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            
            // Here you would implement actual search logic
            // For now, this is a placeholder
            if (query.length > 2) {
                console.log('Searching for:', query);
                // You could:
                // - Filter suggestions
                // - Make AJAX calls to search API
                // - Display search results
            }
        });

        // Handle search form submission
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    console.log('Performing search for:', query);
                    // Here you would redirect to search results page
                    // window.location.href = `/search?q=${encodeURIComponent(query)}`;
                    alert(`Search functionality would be implemented here.\nSearching for: ${query}`);
                }
            }
        });
    }
});
