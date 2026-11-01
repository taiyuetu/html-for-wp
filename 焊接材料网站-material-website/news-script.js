/* ===================================
   NEWS PAGE JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {

    // === FILTER FUNCTIONALITY ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');
    const searchInput = document.querySelector('.search-input');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter news cards
            filterNews(filter);
        });
    });

    function filterNews(filter) {
        newsCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // === SEARCH FUNCTIONALITY ===
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            newsCards.forEach(card => {
                const title = card.querySelector('.news-title').textContent.toLowerCase();
                const excerpt = card.querySelector('.news-excerpt').textContent.toLowerCase();
                const category = card.querySelector('.news-category').textContent.toLowerCase();
                
                const matches = title.includes(searchTerm) || 
                              excerpt.includes(searchTerm) || 
                              category.includes(searchTerm);
                
                if (matches || searchTerm === '') {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    // === NEWSLETTER FORM ===
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Validate email
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate subscription
            console.log('Newsletter subscription:', email);
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // === SHARE BUTTONS (Single Article Page) ===
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const title = document.querySelector('.article-title')?.textContent || 'Check out this article';
            const url = window.location.href;
            const buttonText = this.textContent.trim();
            
            if (buttonText === '🔗') {
                // Copy link to clipboard
                navigator.clipboard.writeText(url).then(() => {
                    alert('Link copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            } else if (navigator.share && buttonText !== 'in' && buttonText !== '𝕏' && buttonText !== 'f') {
                // Use native share if available
                navigator.share({
                    title: title,
                    url: url
                }).catch(err => console.log('Share failed:', err));
            } else {
                // Simulate social sharing
                let platform = 'social media';
                if (buttonText === 'in') platform = 'LinkedIn';
                if (buttonText === '𝕏') platform = 'Twitter';
                if (buttonText === 'f') platform = 'Facebook';
                
                console.log(`Sharing to ${platform}:`, { title, url });
                alert(`Sharing to ${platform}...`);
            }
        });
    });

    // === PAGINATION ===
    const paginationBtns = document.querySelectorAll('.pagination-btn:not(.disabled)');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active') && !this.hasAttribute('aria-label')) {
                // Remove active from all buttons
                paginationBtns.forEach(b => b.classList.remove('active'));
                
                // Add active to clicked button
                this.classList.add('active');
                
                // Scroll to top of news section
                const newsSection = document.querySelector('.news-grid-section');
                if (newsSection) {
                    window.scrollTo({
                        top: newsSection.offsetTop - 150,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

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

    // Observe news cards
    newsCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(card);
    });

    // Observe related articles
    const relatedCards = document.querySelectorAll('.related-card');
    relatedCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // === READING PROGRESS BAR (Single Article) ===
    const article = document.querySelector('.article-body');
    
    if (article) {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: var(--header-height);
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--color-main);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const articleStart = articleTop - windowHeight / 2;
            const articleEnd = articleTop + articleHeight;
            const scrollProgress = (scrollTop - articleStart) / (articleEnd - articleStart);
            
            const progress = Math.max(0, Math.min(100, scrollProgress * 100));
            progressBar.style.width = `${progress}%`;
        });
    }

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

    // === ESTIMATED READ TIME (Single Article) ===
    const articleBody = document.querySelector('.article-body');
    const readTimeElement = document.querySelector('.meta-item-single:last-child span:last-child');
    
    if (articleBody && readTimeElement) {
        const text = articleBody.textContent;
        const wordCount = text.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
        
        // Update read time if it's a placeholder
        if (readTimeElement.textContent.includes('min read')) {
            readTimeElement.textContent = `${readTime} min read`;
        }
    }

    // === PRINT ARTICLE ===
    function printArticle() {
        window.print();
    }

    // Add print button functionality if exists
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', printArticle);
    }

    // === COPY CODE BLOCKS (if any) ===
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.className = 'copy-code-btn';
        copyBtn.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            padding: 0.25rem 0.75rem;
            background: var(--color-main);
            color: var(--color-white);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
        `;
        
        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 2000);
            });
        });
    });

    // === HIGHLIGHT CURRENT SECTION IN TOC (if Table of Contents exists) ===
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.article-body h2[id]');
    
    if (tocLinks.length > 0 && sections.length > 0) {
        // Highlight on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            tocLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
        
        // Smooth scroll on click
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 120;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // === SIDEBAR SHARE BUTTONS ===
    const sidebarShareButtons = document.querySelectorAll('.share-btn-sidebar');
    
    sidebarShareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const title = document.querySelector('.article-title')?.textContent || 'Check out this article';
            const url = window.location.href;
            
            if (this.classList.contains('share-copy')) {
                // Copy link to clipboard
                navigator.clipboard.writeText(url).then(() => {
                    const originalText = this.querySelector('span:last-child').textContent;
                    this.querySelector('span:last-child').textContent = 'Copied!';
                    setTimeout(() => {
                        this.querySelector('span:last-child').textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            } else {
                let platform = 'social media';
                if (this.classList.contains('share-linkedin')) platform = 'LinkedIn';
                if (this.classList.contains('share-twitter')) platform = 'Twitter';
                if (this.classList.contains('share-facebook')) platform = 'Facebook';
                
                console.log(`Sharing to ${platform}:`, { title, url });
                
                // In production, add actual sharing URLs
                let shareUrl = '';
                if (this.classList.contains('share-linkedin')) {
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                } else if (this.classList.contains('share-twitter')) {
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                } else if (this.classList.contains('share-facebook')) {
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            }
        });
    });
    
    // === SIDEBAR NEWSLETTER FORM ===
    const sidebarNewsletterForm = document.querySelector('.sidebar-newsletter-form');
    
    if (sidebarNewsletterForm) {
        sidebarNewsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            console.log('Newsletter subscription:', email);
            alert('Thank you for subscribing!');
            emailInput.value = '';
        });
    }
    
    // === POPULAR ARTICLES CLICK ===
    const popularItems = document.querySelectorAll('.popular-item');
    
    popularItems.forEach(item => {
        item.addEventListener('click', function() {
            // In production, navigate to the article
            console.log('Navigating to popular article');
            // window.location.href = 'news-single.html';
        });
    });

    // === LAZY LOAD IMAGES ===
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
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

    console.log('News page initialized successfully!');

});
