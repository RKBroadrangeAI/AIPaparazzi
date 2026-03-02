/**
 * PaparazziByBiz - Product Catalog Integration
 * Connects to retail product catalog API (Shopify, WooCommerce, or custom)
 */

const PBIZCatalog = (() => {
  'use strict';

  // ─── Sample Product Data (fallback when API is not configured) ───
  const SAMPLE_PRODUCTS = [
    {
      id: 1,
      title: 'Golden Sunrise Pendant',
      category: 'necklaces',
      collection: 'new-arrivals',
      price: 5.00,
      rating: 4.5,
      reviewCount: 42,
      badge: 'new',
      gradient: 'linear-gradient(135deg, #f7d794, #f19066)',
      icon: 'fa-gem',
      description: 'Elevate your everyday look with the stunning Golden Sunrise Pendant.',
      features: ['Lead & Nickel Free', 'Adjustable Length', 'Lobster Claw Clasp'],
    },
    {
      id: 2,
      title: 'Crystal Drop Earrings',
      category: 'earrings',
      collection: 'best-sellers',
      price: 5.00,
      rating: 5.0,
      reviewCount: 89,
      badge: 'hot',
      gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
      icon: 'fa-star',
      description: 'Dazzling crystal drop earrings that catch the light beautifully.',
      features: ['Lead & Nickel Free', 'Fish Hook Style', 'Crystal Accents'],
    },
    {
      id: 3,
      title: 'Rose Gold Charm Bracelet',
      category: 'bracelets',
      collection: 'trending',
      price: 5.00,
      rating: 4.0,
      reviewCount: 56,
      badge: 'trending',
      gradient: 'linear-gradient(135deg, #fad0c4, #ffd1ff)',
      icon: 'fa-circle',
      description: 'A charming rose gold bracelet with delicate charm accents.',
      features: ['Lead & Nickel Free', 'Adjustable', 'Toggle Clasp'],
    },
    {
      id: 4,
      title: 'Amethyst Statement Ring',
      category: 'rings',
      collection: 'best-sellers',
      price: 5.00,
      rating: 4.5,
      reviewCount: 33,
      badge: null,
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      icon: 'fa-ring',
      description: 'Make a bold statement with this eye-catching amethyst-inspired ring.',
      features: ['Lead & Nickel Free', 'Stretchy Band', 'Statement Size'],
    },
    {
      id: 5,
      title: 'Pearl Hair Clip Set',
      category: 'hair-accessories',
      collection: 'new-arrivals',
      price: 5.00,
      rating: 5.0,
      reviewCount: 71,
      badge: 'new',
      gradient: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
      icon: 'fa-ribbon',
      description: 'Elegant pearl-embellished hair clips to elevate any hairstyle.',
      features: ['Set of 3 Clips', 'Secure Grip', 'Pearl Accents'],
    },
    {
      id: 6,
      title: 'Blush Romance Set',
      category: 'sets',
      collection: 'trending',
      price: 5.00,
      rating: 4.5,
      reviewCount: 64,
      badge: 'trending',
      gradient: 'linear-gradient(135deg, #f5c6d0, #e8a0b0)',
      icon: 'fa-gem',
      description: 'A perfectly coordinated set in soft blush tones.',
      features: ['Necklace & Earring Set', 'Lead & Nickel Free', 'Gift Ready'],
    },
    {
      id: 7,
      title: 'Silver Layered Chain',
      category: 'necklaces',
      collection: 'best-sellers',
      price: 5.00,
      rating: 5.0,
      reviewCount: 102,
      badge: 'hot',
      gradient: 'linear-gradient(135deg, #c3cfe2, #f5f7fa)',
      icon: 'fa-link',
      description: 'A versatile layered chain necklace in cool silver tones.',
      features: ['Lead & Nickel Free', 'Layered Design', 'Adjustable'],
    },
    {
      id: 8,
      title: 'Sunshine Stud Earrings',
      category: 'earrings',
      collection: 'new-arrivals',
      price: 5.00,
      rating: 4.0,
      reviewCount: 28,
      badge: 'new',
      gradient: 'linear-gradient(135deg, #fddb92, #d1fdff)',
      icon: 'fa-star',
      description: 'Bright and cheerful stud earrings inspired by sunshine.',
      features: ['Lead & Nickel Free', 'Post Back', 'Hypoallergenic'],
    },
    {
      id: 9,
      title: 'Midnight Velvet Choker',
      category: 'necklaces',
      collection: 'trending',
      price: 5.00,
      rating: 4.8,
      reviewCount: 45,
      badge: 'trending',
      gradient: 'linear-gradient(135deg, #2d3436, #636e72)',
      icon: 'fa-link',
      description: 'A sleek velvet choker for a touch of nighttime glamour.',
      features: ['Lead & Nickel Free', 'Velvet Band', 'Adjustable'],
    },
    {
      id: 10,
      title: 'Daisy Chain Bracelet',
      category: 'bracelets',
      collection: 'new-arrivals',
      price: 5.00,
      rating: 4.7,
      reviewCount: 38,
      badge: 'new',
      gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
      icon: 'fa-circle',
      description: 'A delicate daisy-inspired chain bracelet perfect for spring.',
      features: ['Lead & Nickel Free', 'Chain Link', 'Spring Clasp'],
    },
    {
      id: 11,
      title: 'Emerald Cocktail Ring',
      category: 'rings',
      collection: 'trending',
      price: 5.00,
      rating: 4.3,
      reviewCount: 29,
      badge: null,
      gradient: 'linear-gradient(135deg, #00b894, #00cec9)',
      icon: 'fa-ring',
      description: 'A stunning emerald-colored cocktail ring for special occasions.',
      features: ['Lead & Nickel Free', 'Stretchy Band', 'Faceted Stone'],
    },
    {
      id: 12,
      title: 'Butterfly Hair Comb',
      category: 'hair-accessories',
      collection: 'best-sellers',
      price: 5.00,
      rating: 4.9,
      reviewCount: 55,
      badge: 'hot',
      gradient: 'linear-gradient(135deg, #fd79a8, #e84393)',
      icon: 'fa-ribbon',
      description: 'A beautiful butterfly-adorned hair comb for elegant updos.',
      features: ['Crystal Butterflies', 'Secure Comb Base', 'Crystal Accents'],
    },
  ];

  let allProducts = [...SAMPLE_PRODUCTS];
  let filteredProducts = [];
  let currentPage = 1;
  const productsPerPage = 12;

  /**
   * Fetch products from configured API
   */
  async function fetchProducts(params = {}) {
    const config = window.PBIZ_CONFIG?.catalog;
    
    // If no API is configured, use sample data
    if (!config?.apiEndpoint || !config?.apiKey) {
      return filterLocalProducts(params);
    }

    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${config.apiEndpoint}/products?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Catalog API error');

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Catalog API unavailable, using sample data:', error.message);
      return filterLocalProducts(params);
    }
  }

  /**
   * Filter local sample products
   */
  function filterLocalProducts(params = {}) {
    let results = [...allProducts];

    if (params.category) {
      results = results.filter(p => p.category === params.category);
    }

    if (params.collection) {
      results = results.filter(p => p.collection === params.collection);
    }

    if (params.search) {
      const query = params.search.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    if (params.sort) {
      switch (params.sort) {
        case 'newest':
          results.reverse();
          break;
        case 'best-selling':
          results.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'name-asc':
          results.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name-desc':
          results.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }
    }

    filteredProducts = results;
    return {
      products: results,
      total: results.length,
      page: currentPage,
      perPage: productsPerPage,
    };
  }

  /**
   * Get a single product by ID
   */
  async function getProduct(id) {
    const config = window.PBIZ_CONFIG?.catalog;
    
    if (!config?.apiEndpoint || !config?.apiKey) {
      return allProducts.find(p => p.id === parseInt(id)) || null;
    }

    try {
      const response = await fetch(`${config.apiEndpoint}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      return allProducts.find(p => p.id === parseInt(id)) || null;
    }
  }

  /**
   * Render a product card
   */
  function renderProductCard(product) {
    const starsHtml = renderStars(product.rating);
    const badgeHtml = product.badge 
      ? `<span class="product-card__badge product-card__badge--${product.badge}">${capitalize(product.badge)}</span>` 
      : '';

    return `
      <div class="product-card" data-category="${product.collection}" data-id="${product.id}">
        <a href="product.html?id=${product.id}" class="product-card__image">
          <div class="product-card__placeholder" style="background: ${product.gradient};">
            <i class="fas ${product.icon}"></i>
          </div>
          <div class="product-card__overlay">
            <button class="product-card__action" data-action="quickview" data-id="${product.id}" aria-label="Quick view"><i class="fas fa-eye"></i></button>
            <button class="product-card__action" data-action="wishlist" data-id="${product.id}" aria-label="Add to wishlist"><i class="fas fa-heart"></i></button>
            <button class="product-card__action" data-action="addtocart" data-id="${product.id}" aria-label="Add to cart"><i class="fas fa-shopping-bag"></i></button>
          </div>
          ${badgeHtml}
        </a>
        <div class="product-card__info">
          <span class="product-card__category">${formatCategory(product.category)}</span>
          <h3 class="product-card__title"><a href="product.html?id=${product.id}">${product.title}</a></h3>
          <div class="product-card__rating">
            <div class="stars">${starsHtml}</div>
            <span>(${product.reviewCount})</span>
          </div>
          <div class="product-card__price">
            <span class="product-card__price-current">$${product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render star rating HTML
   */
  function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        html += '<i class="fas fa-star"></i>';
      } else if (i - rating < 1 && i - rating > 0) {
        html += '<i class="fas fa-star-half-alt"></i>';
      } else {
        html += '<i class="far fa-star"></i>';
      }
    }
    return html;
  }

  /**
   * Format category slug to display name
   */
  function formatCategory(slug) {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Capitalize first letter
   */
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Render products into a container
   */
  async function renderProducts(containerId, params = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="products-loading" style="grid-column: 1/-1; text-align: center; padding: 3rem;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #c8658e;"></i></div>';

    const data = await fetchProducts(params);
    
    if (!data.products || data.products.length === 0) {
      container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><p style="color: #888;">No products found. Try adjusting your filters.</p></div>';
      return;
    }

    container.innerHTML = data.products.map(renderProductCard).join('');

    // Update result count
    const resultCount = document.getElementById('resultCount');
    if (resultCount) resultCount.textContent = data.total;

    // Attach event listeners to product card actions
    attachProductActions(container);
  }

  /**
   * Attach click handlers to product card action buttons
   */
  function attachProductActions(container) {
    container.querySelectorAll('.product-card__action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        const productId = parseInt(btn.getAttribute('data-id'));
        const product = allProducts.find(p => p.id === productId);

        switch (action) {
          case 'addtocart':
            if (window.PBIZCart && product) {
              window.PBIZCart.addItem(product);
            }
            break;
          case 'wishlist':
            toggleWishlist(productId);
            break;
          case 'quickview':
            openQuickView(productId);
            break;
        }
      });
    });
  }

  /**
   * Toggle wishlist for a product
   */
  function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('pbiz_wishlist') || '[]');
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
      wishlist.splice(index, 1);
      showToast('Removed from wishlist');
    } else {
      wishlist.push(productId);
      showToast('Added to wishlist! ❤️');
    }
    
    localStorage.setItem('pbiz_wishlist', JSON.stringify(wishlist));
    updateWishlistCount();

    // Track in CRM
    if (window.PBIZCRM) {
      window.PBIZCRM.trackEvent('wishlist_toggle', { productId, action: index > -1 ? 'remove' : 'add' });
    }
  }

  /**
   * Update wishlist badge count
   */
  function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('pbiz_wishlist') || '[]');
    document.querySelectorAll('#wishlistCount').forEach(el => {
      el.textContent = wishlist.length;
    });
  }

  /**
   * Open quick view modal
   */
  function openQuickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    const body = document.getElementById('quickViewBody');
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
        <div class="product-card__placeholder" style="background: ${product.gradient}; min-height: 350px; border-radius: 1rem; display: flex; align-items: center; justify-content: center;">
          <i class="fas ${product.icon}" style="font-size: 4rem; color: rgba(255,255,255,0.8);"></i>
        </div>
        <div>
          <span class="product-detail__category">${formatCategory(product.category)}</span>
          <h2 style="font-size: 1.5rem; margin: 0.5rem 0 1rem;">${product.title}</h2>
          <div class="product-card__rating" style="margin-bottom: 1rem;">
            <div class="stars">${renderStars(product.rating)}</div>
            <span>(${product.reviewCount} reviews)</span>
          </div>
          <p style="font-size: 1.75rem; font-weight: 700; color: #c8658e; margin-bottom: 1rem;">$${product.price.toFixed(2)}</p>
          <p style="color: #555; line-height: 1.6; margin-bottom: 1.5rem;">${product.description}</p>
          <div style="margin-bottom: 1.5rem;">
            ${product.features.map(f => `<div style="font-size: 0.875rem; margin-bottom: 0.25rem;"><i class="fas fa-check-circle" style="color: #00b894; margin-right: 0.5rem;"></i>${f}</div>`).join('')}
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn--primary btn--lg" onclick="PBIZCart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')}); document.getElementById('quickViewModal').classList.remove('active');">
              <i class="fas fa-shopping-bag"></i> Add to Bag
            </button>
            <a href="product.html?id=${product.id}" class="btn btn--outline btn--lg">View Details</a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Show toast notification
   */
  function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast__icon"><i class="fas fa-check-circle"></i></span>
      <span>${message}</span>
      <button class="toast__close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  /**
   * Initialize shop page filters
   */
  function initShopFilters() {
    // URL params
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('cat');
    const initialCollection = params.get('col');
    const initialSearch = params.get('q');

    const filterParams = {};
    if (initialCategory) filterParams.category = initialCategory;
    if (initialCollection) filterParams.collection = initialCollection;
    if (initialSearch) filterParams.search = initialSearch;

    // Pre-check filter checkboxes from URL
    if (initialCategory) {
      const checkbox = document.querySelector(`input[name="category"][value="${initialCategory}"]`);
      if (checkbox) checkbox.checked = true;
    }
    if (initialCollection) {
      const checkbox = document.querySelector(`input[name="collection"][value="${initialCollection}"]`);
      if (checkbox) checkbox.checked = true;
    }

    // Render initial products
    renderProducts('shopProducts', filterParams);

    // Filter change handlers
    document.querySelectorAll('.filter-checkbox input').forEach(input => {
      input.addEventListener('change', applyFilters);
    });

    // Color filter
    document.querySelectorAll('.filter-color').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        applyFilters();
      });
    });

    // Sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', applyFilters);
    }

    // Clear filters
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter-checkbox input').forEach(i => i.checked = false);
        document.querySelectorAll('.filter-color').forEach(b => b.classList.remove('active'));
        if (sortSelect) sortSelect.value = 'featured';
        renderProducts('shopProducts');
      });
    }

    // Mobile filter toggle
    const filterToggle = document.getElementById('filterToggle');
    const sidebar = document.getElementById('shopSidebar');
    if (filterToggle && sidebar) {
      filterToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    // View toggle
    document.querySelectorAll('.shop__view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.shop__view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const grid = document.getElementById('shopProducts');
        if (grid) {
          grid.style.gridTemplateColumns = btn.dataset.view === 'list' ? '1fr' : '';
        }
      });
    });
  }

  /**
   * Apply current filter state
   */
  function applyFilters() {
    const params = {};

    // Categories
    const categories = [...document.querySelectorAll('input[name="category"]:checked')].map(i => i.value);
    if (categories.length === 1) params.category = categories[0];

    // Collections
    const collections = [...document.querySelectorAll('input[name="collection"]:checked')].map(i => i.value);
    if (collections.length === 1) params.collection = collections[0];

    // Sort
    const sort = document.getElementById('sortSelect')?.value;
    if (sort && sort !== 'featured') params.sort = sort;

    renderProducts('shopProducts', params);
  }

  /**
   * Initialize featured product tabs on homepage
   */
  function initFeaturedTabs() {
    const tabs = document.querySelectorAll('.featured__tab');
    const productCards = document.querySelectorAll('#featuredProducts .product-card');
    
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        productCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * Initialize product detail page
   */
  function initProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    
    if (!productId) return;

    getProduct(productId).then(product => {
      if (!product) return;

      // Update page content
      document.getElementById('productTitle')?.textContent && (document.getElementById('productTitle').textContent = product.title);
      document.getElementById('productCategory')?.textContent && (document.getElementById('productCategory').textContent = formatCategory(product.category));
      document.getElementById('productDescription')?.textContent && (document.getElementById('productDescription').textContent = product.description);
      document.getElementById('productBreadcrumb')?.textContent && (document.getElementById('productBreadcrumb').textContent = product.title);
      document.title = `${product.title} | Paparazzi by Biz`;

      // Render related products
      const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
      const relatedContainer = document.getElementById('relatedProducts');
      if (relatedContainer && related.length) {
        relatedContainer.innerHTML = related.map(renderProductCard).join('');
        attachProductActions(relatedContainer);
      }
    });

    // Quantity controls
    const qtyInput = document.getElementById('qtyInput');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');

    if (qtyMinus && qtyPlus && qtyInput) {
      qtyMinus.addEventListener('click', () => {
        const val = parseInt(qtyInput.value);
        if (val > 1) qtyInput.value = val - 1;
      });
      qtyPlus.addEventListener('click', () => {
        const val = parseInt(qtyInput.value);
        if (val < 10) qtyInput.value = val + 1;
      });
    }

    // Add to cart from detail page
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        getProduct(productId).then(product => {
          if (product && window.PBIZCart) {
            const qty = parseInt(document.getElementById('qtyInput')?.value || 1);
            for (let i = 0; i < qty; i++) {
              window.PBIZCart.addItem(product);
            }
          }
        });
      });
    }

    // Product tabs
    document.querySelectorAll('.product-tabs__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.product-tabs__btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.product-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(`tab-${tabId}`)?.classList.add('active');
      });
    });

    // Thumbnail clicks
    document.querySelectorAll('.product-detail__thumb').forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.product-detail__thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }

  // Public API
  return {
    init() {
      updateWishlistCount();
      initFeaturedTabs();
      
      // Shop page
      if (document.getElementById('shopProducts')) {
        initShopFilters();
      }

      // Product detail page
      if (document.querySelector('.product-detail')) {
        initProductDetail();
      }
    },
    fetchProducts,
    getProduct,
    renderProducts,
    renderProductCard,
    showToast,
    allProducts,
    SAMPLE_PRODUCTS,
  };
})();

// Make globally accessible
window.PBIZCatalog = PBIZCatalog;
document.addEventListener('DOMContentLoaded', PBIZCatalog.init);
