/* ===================================
   PRODUCTS ARCHIVE PAGE JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // === VIEW TOGGLE (GRID/LIST) ===
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.querySelector('.archive-products-grid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active state
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle grid view
            if (view === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });

    // === FILTER FUNCTIONALITY ===
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Get all checked categories
            const checkedCategories = [];
            document.querySelectorAll('.category-filter input[type="checkbox"]:checked').forEach(cb => {
                const label = cb.closest('.filter-option').querySelector('span:first-of-type').textContent;
                checkedCategories.push(label);
            });
            
            // Filter products based on selection
            filterProducts(checkedCategories);
            updateResultsCount();
        });
    });

    // === SEARCH FUNCTIONALITY ===
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.toLowerCase().trim();
            searchProducts(searchTerm);
            updateResultsCount();
        });
        
        // Real-time search
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            if (searchTerm.length > 2 || searchTerm.length === 0) {
                searchProducts(searchTerm);
                updateResultsCount();
            }
        });
    }

    // === SORT FUNCTIONALITY ===
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            sortProducts(sortBy);
        });
    }

    // === FILTER PRODUCTS FUNCTION ===
    function filterProducts(categories) {
        const products = document.querySelectorAll('.archive-product-card');
        
        products.forEach(product => {
            const productCategory = product.querySelector('.product-category').textContent;
            
            if (categories.length === 0 || categories.includes('All Products')) {
                product.style.display = '';
            } else {
                let shouldShow = false;
                categories.forEach(category => {
                    if (productCategory.toLowerCase().includes(category.toLowerCase())) {
                        shouldShow = true;
                    }
                });
                product.style.display = shouldShow ? '' : 'none';
            }
        });
    }

    // === SEARCH PRODUCTS FUNCTION ===
    function searchProducts(searchTerm) {
        const products = document.querySelectorAll('.archive-product-card');
        
        products.forEach(product => {
            const title = product.querySelector('.product-card-title').textContent.toLowerCase();
            const code = product.querySelector('.product-code').textContent.toLowerCase();
            const desc = product.querySelector('.product-card-desc').textContent.toLowerCase();
            const category = product.querySelector('.product-category').textContent.toLowerCase();
            
            const matches = title.includes(searchTerm) || 
                          code.includes(searchTerm) || 
                          desc.includes(searchTerm) ||
                          category.includes(searchTerm);
            
            product.style.display = matches || searchTerm === '' ? '' : 'none';
        });
    }

    // === SORT PRODUCTS FUNCTION ===
    function sortProducts(sortBy) {
        const productsContainer = document.querySelector('.archive-products-grid');
        const products = Array.from(document.querySelectorAll('.archive-product-card'));
        
        products.sort((a, b) => {
            if (sortBy.includes('Name A-Z')) {
                const nameA = a.querySelector('.product-card-title').textContent;
                const nameB = b.querySelector('.product-card-title').textContent;
                return nameA.localeCompare(nameB);
            } else if (sortBy.includes('Name Z-A')) {
                const nameA = a.querySelector('.product-card-title').textContent;
                const nameB = b.querySelector('.product-card-title').textContent;
                return nameB.localeCompare(nameA);
            } else if (sortBy.includes('Temperature')) {
                const tempA = extractTemperature(a);
                const tempB = extractTemperature(b);
                
                if (sortBy.includes('Low-High')) {
                    return tempA - tempB;
                } else {
                    return tempB - tempA;
                }
            }
            // Default: Latest (no change)
            return 0;
        });
        
        // Re-append sorted products
        products.forEach(product => {
            productsContainer.appendChild(product);
        });
    }

    // === EXTRACT TEMPERATURE FROM PRODUCT ===
    function extractTemperature(product) {
        const specs = product.querySelectorAll('.spec-tag');
        for (let spec of specs) {
            const text = spec.textContent;
            const match = text.match(/(\d+)°C/);
            if (match) {
                return parseInt(match[1]);
            }
        }
        return 0;
    }

    // === UPDATE RESULTS COUNT ===
    function updateResultsCount() {
        const products = document.querySelectorAll('.archive-product-card');
        const visibleProducts = Array.from(products).filter(p => p.style.display !== 'none');
        const resultsText = document.querySelector('.toolbar-results');
        
        const count = visibleProducts.length;
        const end = Math.min(12, count);
        
        if (resultsText) {
            resultsText.innerHTML = `Showing <strong>1-${end}</strong> of <strong>${count}</strong> products`;
        }
    }

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

    // === PAGINATION (DEMO) ===
    const paginationBtns = document.querySelectorAll('.pagination-btn:not(.disabled)');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                paginationBtns.forEach(b => b.classList.remove('active'));
                
                if (!this.getAttribute('aria-label')) {
                    this.classList.add('active');
                }
                
                // Scroll to top of products
                const productsSection = document.querySelector('.products-archive');
                if (productsSection) {
                    window.scrollTo({
                        top: productsSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // === "ALL PRODUCTS" CHECKBOX BEHAVIOR ===
    const allProductsCheckbox = document.querySelector('.category-filter input[type="checkbox"]');
    const otherCheckboxes = document.querySelectorAll('.category-filter input[type="checkbox"]:not(:first-child)');
    
    if (allProductsCheckbox) {
        allProductsCheckbox.addEventListener('change', function() {
            if (this.checked) {
                otherCheckboxes.forEach(cb => cb.checked = false);
            }
        });
        
        otherCheckboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    allProductsCheckbox.checked = false;
                }
                
                // If no checkboxes are checked, check "All Products"
                const anyChecked = Array.from(otherCheckboxes).some(checkbox => checkbox.checked);
                if (!anyChecked) {
                    allProductsCheckbox.checked = true;
                }
            });
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

    // Observe product cards for animation
    document.querySelectorAll('.archive-product-card').forEach(card => {
        observer.observe(card);
    });

});
