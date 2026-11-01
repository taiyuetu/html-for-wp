// ============================================
// PRODUCTS PAGE FUNCTIONALITY
// ============================================

// Sample product data
const productsData = [
    {
        id: 1,
        name: "Lavender Dreams",
        category: "botanical",
        price: 45.00,
        oldPrice: null,
        rating: 5,
        reviews: 128,
        size: "medium",
        image: "https://images.unsplash.com/photo-1602874801006-39554e952551?w=500&q=80",
        description: "Calming lavender infused with hints of vanilla and chamomile for a peaceful ambiance.",
        tags: ["bestseller", "organic"],
        badge: "bestseller"
    },
    {
        id: 2,
        name: "Cinnamon Spice",
        category: "oriental",
        price: 52.00,
        oldPrice: 65.00,
        rating: 5,
        reviews: 95,
        size: "large",
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80",
        description: "Warm cinnamon with clove and orange peel creates a cozy, inviting atmosphere.",
        tags: ["sale", "vegan"],
        badge: "sale"
    },
    {
        id: 3,
        name: "Ocean Breeze",
        category: "citrus",
        price: 48.00,
        oldPrice: null,
        rating: 5,
        reviews: 87,
        size: "medium",
        image: "https://images.unsplash.com/photo-1586104895927-a8b90def3584?w=500&q=80",
        description: "Fresh ocean air with notes of sea salt, citrus, and driftwood.",
        tags: ["new", "bestseller"],
        badge: "new"
    },
    {
        id: 4,
        name: "Vanilla Dream",
        category: "cozy",
        price: 42.00,
        oldPrice: null,
        rating: 4,
        reviews: 76,
        size: "small",
        image: "https://images.unsplash.com/photo-1603006904175-6e5de05f9b39?w=500&q=80",
        description: "Rich Madagascar vanilla blended with caramel and warm amber.",
        tags: ["organic", "vegan"],
        badge: null
    },
    {
        id: 5,
        name: "Rose Garden",
        category: "botanical",
        price: 55.00,
        oldPrice: null,
        rating: 5,
        reviews: 112,
        size: "large",
        image: "https://images.unsplash.com/photo-1602874801006-39554e952551?w=500&q=80",
        description: "Delicate rose petals with jasmine and sandalwood for an elegant scent.",
        tags: ["bestseller", "gift"],
        badge: "bestseller"
    },
    {
        id: 6,
        name: "Eucalyptus Mint",
        category: "botanical",
        price: 46.00,
        oldPrice: null,
        rating: 5,
        reviews: 94,
        size: "medium",
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80",
        description: "Refreshing eucalyptus combined with cool peppermint for clarity.",
        tags: ["new", "organic"],
        badge: "new"
    },
    {
        id: 7,
        name: "Amber Sunset",
        category: "oriental",
        price: 58.00,
        oldPrice: 72.00,
        rating: 5,
        reviews: 103,
        size: "large",
        image: "https://images.unsplash.com/photo-1586104895927-a8b90def3584?w=500&q=80",
        description: "Warm amber with hints of musk, patchouli, and exotic spices.",
        tags: ["sale", "bestseller"],
        badge: "sale"
    },
    {
        id: 8,
        name: "Lemon Verbena",
        category: "citrus",
        price: 44.00,
        oldPrice: null,
        rating: 4,
        reviews: 68,
        size: "medium",
        image: "https://images.unsplash.com/photo-1603006904175-6e5de05f9b39?w=500&q=80",
        description: "Bright lemon verbena with bergamot and green tea notes.",
        tags: ["new", "vegan"],
        badge: "new"
    },
    {
        id: 9,
        name: "Cedarwood Forest",
        category: "cozy",
        price: 50.00,
        oldPrice: null,
        rating: 5,
        reviews: 89,
        size: "large",
        image: "https://images.unsplash.com/photo-1602874801006-39554e952551?w=500&q=80",
        description: "Deep cedarwood with pine, moss, and earthy undertones.",
        tags: ["organic", "bestseller"],
        badge: "bestseller"
    },
    {
        id: 10,
        name: "Jasmine Night",
        category: "botanical",
        price: 53.00,
        oldPrice: null,
        rating: 5,
        reviews: 101,
        size: "medium",
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80",
        description: "Exotic jasmine with lily and white musk for a romantic ambiance.",
        tags: ["new", "gift"],
        badge: "new"
    },
    {
        id: 11,
        name: "Grapefruit Zest",
        category: "citrus",
        price: 43.00,
        oldPrice: null,
        rating: 4,
        reviews: 72,
        size: "small",
        image: "https://images.unsplash.com/photo-1586104895927-a8b90def3584?w=500&q=80",
        description: "Tangy grapefruit with lime and mint for an energizing scent.",
        tags: ["vegan", "organic"],
        badge: null
    },
    {
        id: 12,
        name: "Sandalwood Serenity",
        category: "oriental",
        price: 56.00,
        oldPrice: null,
        rating: 5,
        reviews: 97,
        size: "large",
        image: "https://images.unsplash.com/photo-1603006904175-6e5de05f9b39?w=500&q=80",
        description: "Creamy sandalwood with incense and hints of cardamom.",
        tags: ["bestseller", "organic"],
        badge: "bestseller"
    },
    {
        id: 13,
        name: "Peach Blossom",
        category: "botanical",
        price: 47.00,
        oldPrice: null,
        rating: 4,
        reviews: 85,
        size: "medium",
        image: "https://images.unsplash.com/photo-1602874801006-39554e952551?w=500&q=80",
        description: "Sweet peach blossom with cherry and magnolia petals.",
        tags: ["new", "gift"],
        badge: "new"
    },
    {
        id: 14,
        name: "Pumpkin Spice",
        category: "cozy",
        price: 49.00,
        oldPrice: 58.00,
        rating: 5,
        reviews: 134,
        size: "medium",
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80",
        description: "Classic pumpkin with cinnamon, nutmeg, and clove.",
        tags: ["sale", "bestseller"],
        badge: "sale"
    },
    {
        id: 15,
        name: "Bergamot Bliss",
        category: "citrus",
        price: 45.00,
        oldPrice: null,
        rating: 4,
        reviews: 79,
        size: "small",
        image: "https://images.unsplash.com/photo-1586104895927-a8b90def3584?w=500&q=80",
        description: "Aromatic bergamot with earl grey tea and honey notes.",
        tags: ["organic", "vegan"],
        badge: null
    },
    {
        id: 16,
        name: "Fireside Ember",
        category: "cozy",
        price: 54.00,
        oldPrice: null,
        rating: 5,
        reviews: 108,
        size: "large",
        image: "https://images.unsplash.com/photo-1603006904175-6e5de05f9b39?w=500&q=80",
        description: "Smoky firewood with leather, tobacco, and amber.",
        tags: ["bestseller", "gift"],
        badge: "bestseller"
    },
    {
        id: 17,
        name: "Coconut Paradise",
        category: "citrus",
        price: 46.00,
        oldPrice: null,
        rating: 4,
        reviews: 91,
        size: "medium",
        image: "https://images.unsplash.com/photo-1602874801006-39554e952551?w=500&q=80",
        description: "Tropical coconut with pineapple and vanilla cream.",
        tags: ["new", "vegan"],
        badge: "new"
    },
    {
        id: 18,
        name: "Black Orchid",
        category: "oriental",
        price: 62.00,
        oldPrice: null,
        rating: 5,
        reviews: 115,
        size: "large",
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80",
        description: "Mysterious black orchid with dark chocolate and truffle.",
        tags: ["bestseller", "gift"],
        badge: "bestseller"
    }
];

// Global variables
let filteredProducts = [...productsData];
let currentView = 'grid';

// ============================================
// RENDER PRODUCTS
// ============================================

function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.getElementById('products-count');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                <i class="fas fa-search" style="font-size: 4rem; color: var(--color-gray); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--color-secondary); margin-bottom: 0.5rem;">No Products Found</h3>
                <p style="color: var(--color-gray);">Try adjusting your filters</p>
            </div>
        `;
        productsCount.textContent = '0';
        return;
    }
    
    products.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });
    
    productsCount.textContent = products.length;
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-price', product.price);
    card.setAttribute('data-rating', product.rating);
    card.setAttribute('data-size', product.size);
    
    // Generate stars
    const stars = generateStars(product.rating);
    
    // Badge
    const badgeHTML = product.badge ? `
        <div class="product-card__badges">
            <span class="badge badge--${product.badge}">${product.badge}</span>
        </div>
    ` : '';
    
    // Old price
    const oldPriceHTML = product.oldPrice ? `
        <span class="product-card__price--old">$${product.oldPrice.toFixed(2)}</span>
    ` : '';
    
    card.innerHTML = `
        <div class="product-card__image">
            <img src="${product.image}" alt="${product.name}" class="product-card__img">
            ${badgeHTML}
            <div class="product-card__actions">
                <button class="action-btn" data-action="wishlist" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
                </button>
                <button class="action-btn" data-action="quickview" title="Quick View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" data-action="compare" title="Compare">
                    <i class="fas fa-exchange-alt"></i>
                </button>
            </div>
        </div>
        <div class="product-card__content">
            <span class="product-card__category">${getCategoryName(product.category)}</span>
            <h3 class="product-card__title">
                <a href="#">${product.name}</a>
            </h3>
            <div class="product-card__rating">
                <div class="stars">${stars}</div>
                <span class="review-count">(${product.reviews})</span>
            </div>
            <p class="product-card__description">${product.description}</p>
            <div class="product-card__footer">
                <span class="product-card__price">
                    $${product.price.toFixed(2)}
                    ${oldPriceHTML}
                </span>
                <button class="btn btn--small btn--primary" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const wishlistBtn = card.querySelector('[data-action="wishlist"]');
    const quickviewBtn = card.querySelector('[data-action="quickview"]');
    const addToCartBtn = card.querySelector('.btn--primary');
    
    wishlistBtn.addEventListener('click', () => toggleWishlist(product.id, wishlistBtn));
    quickviewBtn.addEventListener('click', () => quickView(product));
    addToCartBtn.addEventListener('click', () => addToCart(product));
    
    return card;
}

function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    return starsHTML;
}

function getCategoryName(category) {
    const categories = {
        'botanical': 'Botanical Garden',
        'oriental': 'Oriental Spice',
        'citrus': 'Citrus Refresh',
        'cozy': 'Cozy Comfort'
    };
    return categories[category] || category;
}

// ============================================
// SIDEBAR TOGGLE (Mobile)
// ============================================

const filterToggle = document.getElementById('filter-toggle');
const sidebar = document.getElementById('products-sidebar');
const sidebarClose = document.getElementById('sidebar-close');

// Create overlay
const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

if (filterToggle) {
    filterToggle.addEventListener('click', () => {
        sidebar.classList.add('show-sidebar');
        overlay.classList.add('show-overlay');
        document.body.style.overflow = 'hidden';
    });
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

overlay.addEventListener('click', closeSidebar);

function closeSidebar() {
    sidebar.classList.remove('show-sidebar');
    overlay.classList.remove('show-overlay');
    document.body.style.overflow = '';
}

// ============================================
// VIEW MODE TOGGLE
// ============================================

const viewModeBtns = document.querySelectorAll('.view-mode__btn');
const productsGrid = document.getElementById('products-grid');

viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        
        // Update active button
        viewModeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update grid view
        if (view === 'list') {
            productsGrid.classList.add('list-view');
            currentView = 'list';
        } else {
            productsGrid.classList.remove('list-view');
            currentView = 'grid';
        }
    });
});

// ============================================
// SORTING
// ============================================

const sortSelect = document.getElementById('sort-select');

if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        const sortValue = e.target.value;
        sortProducts(sortValue);
    });
}

function sortProducts(sortBy) {
    switch (sortBy) {
        case 'popularity':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            filteredProducts = [...productsData];
    }
    
    renderProducts(filteredProducts);
}

// ============================================
// FILTERING
// ============================================

const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
const priceRange = document.getElementById('price-range');
const maxPriceDisplay = document.getElementById('max-price');
const tagButtons = document.querySelectorAll('.tag');
const clearFiltersBtn = document.querySelector('.clear-filters');

// Price range filter
if (priceRange) {
    priceRange.addEventListener('input', (e) => {
        const maxPrice = e.target.value;
        maxPriceDisplay.textContent = `$${maxPrice}`;
        applyFilters();
    });
}

// Checkbox filters
filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

// Tag filters
tagButtons.forEach(tag => {
    tag.addEventListener('click', () => {
        tag.classList.toggle('active');
        applyFilters();
    });
});

// Clear filters
if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
        // Reset checkboxes
        filterCheckboxes.forEach(cb => cb.checked = false);
        
        // Reset price range
        if (priceRange) {
            priceRange.value = 100;
            maxPriceDisplay.textContent = '$100';
        }
        
        // Reset tags
        tagButtons.forEach(tag => tag.classList.remove('active'));
        
        // Reset filters
        filteredProducts = [...productsData];
        renderProducts(filteredProducts);
    });
}

function applyFilters() {
    let products = [...productsData];
    
    // Category filter
    const selectedCategories = Array.from(document.querySelectorAll('.filter-checkbox[data-filter="category"]:checked'))
        .map(cb => cb.value)
        .filter(val => val !== 'all');
    
    if (selectedCategories.length > 0) {
        products = products.filter(p => selectedCategories.includes(p.category));
    }
    
    // Size filter
    const selectedSizes = Array.from(document.querySelectorAll('.filter-checkbox[data-filter="size"]:checked'))
        .map(cb => cb.value);
    
    if (selectedSizes.length > 0) {
        products = products.filter(p => selectedSizes.includes(p.size));
    }
    
    // Rating filter
    const selectedRatings = Array.from(document.querySelectorAll('.filter-checkbox[data-filter="rating"]:checked'))
        .map(cb => parseInt(cb.value));
    
    if (selectedRatings.length > 0) {
        const minRating = Math.min(...selectedRatings);
        products = products.filter(p => p.rating >= minRating);
    }
    
    // Price filter
    const maxPrice = priceRange ? parseFloat(priceRange.value) : 100;
    products = products.filter(p => p.price <= maxPrice);
    
    // Tag filter
    const activeTags = Array.from(document.querySelectorAll('.tag.active'))
        .map(tag => tag.getAttribute('data-tag'));
    
    if (activeTags.length > 0) {
        products = products.filter(p => 
            p.tags.some(tag => activeTags.includes(tag))
        );
    }
    
    filteredProducts = products;
    renderProducts(filteredProducts);
}

// ============================================
// PRODUCT ACTIONS
// ============================================

function toggleWishlist(productId, btn) {
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    
    if (btn.classList.contains('active')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('Added to wishlist!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('Removed from wishlist', 'info');
    }
}

function quickView(product) {
    showNotification(`Quick view for ${product.name}`, 'info');
    // Implement quick view modal here
}

function addToCart(product) {
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Update cart count
    const cartCount = document.querySelector('.nav__cart-count');
    if (cartCount) {
        const currentCount = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = currentCount + 1;
    }
}

// ============================================
// PAGINATION (Basic)
// ============================================

const paginationBtns = document.querySelectorAll('.pagination__btn:not(.pagination__btn--prev):not(.pagination__btn--next)');

paginationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        paginationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(filteredProducts);
});
