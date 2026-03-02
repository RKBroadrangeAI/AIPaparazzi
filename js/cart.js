/**
 * PaparazziByBiz - Shopping Cart
 * Client-side cart with localStorage persistence
 */

const PBIZCart = (() => {
  'use strict';

  const STORAGE_KEY = 'pbiz_cart';
  const FREE_SHIPPING_THRESHOLD = 25;
  let cart = [];

  /**
   * Load cart from localStorage
   */
  function load() {
    try {
      cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      cart = [];
    }
    updateUI();
  }

  /**
   * Save cart to localStorage
   */
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateUI();
  }

  /**
   * Add item to cart
   */
  function addItem(product, quantity = 1) {
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 10);
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        gradient: product.gradient,
        icon: product.icon,
        quantity: quantity,
      });
    }

    save();

    // Show toast
    if (window.PBIZCatalog) {
      window.PBIZCatalog.showToast(`${product.title} added to bag! 🛍️`);
    }

    // Track in CRM
    if (window.PBIZCRM) {
      window.PBIZCRM.trackEvent('add_to_cart', {
        productId: product.id,
        productTitle: product.title,
        price: product.price,
        quantity: quantity,
      });
    }
  }

  /**
   * Remove item from cart
   */
  function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    save();
    renderCartPage();
  }

  /**
   * Update item quantity
   */
  function updateQuantity(productId, quantity) {
    const item = cart.find(i => i.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeItem(productId);
      } else {
        item.quantity = Math.min(quantity, 10);
        save();
        renderCartPage();
      }
    }
  }

  /**
   * Clear entire cart
   */
  function clearCart() {
    cart = [];
    save();
    renderCartPage();
  }

  /**
   * Get cart totals
   */
  function getTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99;
    const total = subtotal + shipping;
    const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

    return { subtotal, itemCount, shipping, total, freeShippingRemaining, shippingProgress };
  }

  /**
   * Update cart badge counts across all pages
   */
  function updateUI() {
    const { itemCount } = getTotals();
    document.querySelectorAll('#cartCount').forEach(el => {
      el.textContent = itemCount;
    });
  }

  /**
   * Render cart page content
   */
  function renderCartPage() {
    const cartEmpty = document.getElementById('cartEmpty');
    const cartContent = document.getElementById('cartContent');
    const cartItems = document.getElementById('cartItems');
    
    if (!cartEmpty || !cartContent) return;

    if (cart.length === 0) {
      cartEmpty.style.display = '';
      cartContent.style.display = 'none';
      return;
    }

    cartEmpty.style.display = 'none';
    cartContent.style.display = '';

    // Render cart items
    if (cartItems) {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item__image">
            <div class="product-card__placeholder" style="background: ${item.gradient}; width: 80px; height: 80px; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
              <i class="fas ${item.icon}" style="color: rgba(255,255,255,0.8); font-size: 1.25rem;"></i>
            </div>
          </div>
          <div class="cart-item__info">
            <h3><a href="product.html?id=${item.id}">${item.title}</a></h3>
            <p>${formatCategory(item.category)}</p>
            <div class="quantity-selector" style="margin-top: 0.5rem; display: inline-flex;">
              <button class="quantity-btn" onclick="PBIZCart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
              <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" 
                onchange="PBIZCart.updateQuantity(${item.id}, parseInt(this.value))" style="width: 40px;">
              <button class="quantity-btn" onclick="PBIZCart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
          </div>
          <div class="cart-item__actions">
            <span class="cart-item__price">$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="cart-item__remove" onclick="PBIZCart.removeItem(${item.id})">
              <i class="fas fa-trash-alt"></i> Remove
            </button>
          </div>
        </div>
      `).join('');
    }

    // Update summary
    const totals = getTotals();
    
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const totalEl = document.getElementById('cartTotal');
    const freeShipEl = document.getElementById('freeShippingRemaining');
    const progressEl = document.getElementById('shippingProgress');
    const freeShipMsg = document.getElementById('freeShippingMsg');

    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
    if (progressEl) progressEl.style.width = `${totals.shippingProgress}%`;
    
    if (freeShipMsg) {
      if (totals.freeShippingRemaining === 0) {
        freeShipMsg.innerHTML = '<i class="fas fa-check-circle" style="color: var(--color-success);"></i> <span>You qualify for <strong>FREE shipping!</strong></span>';
      } else {
        freeShipMsg.innerHTML = `<i class="fas fa-truck"></i> <span>Add <strong>$${totals.freeShippingRemaining.toFixed(2)}</strong> more for FREE shipping!</span>`;
      }
    }
  }

  /**
   * Format category slug
   */
  function formatCategory(slug) {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Initialize checkout button
   */
  function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        // Track checkout initiation in CRM
        if (window.PBIZCRM) {
          const totals = getTotals();
          window.PBIZCRM.trackEvent('checkout_initiated', {
            itemCount: totals.itemCount,
            subtotal: totals.subtotal,
            items: cart.map(i => ({ id: i.id, title: i.title, qty: i.quantity })),
          });
        }

        // In production, redirect to payment provider
        if (window.PBIZCatalog) {
          window.PBIZCatalog.showToast('Redirecting to secure checkout... 🔒');
        }
        
        // Simulate checkout redirect
        setTimeout(() => {
          alert('🛒 Checkout Integration Point\n\nThis would redirect to your configured payment provider (Stripe, PayPal, etc.).\n\nConfigure payment settings in config/integrations.js');
        }, 1000);
      });
    }

    // Promo code
    const promoForm = document.getElementById('promoForm');
    if (promoForm) {
      promoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('promoInput')?.value.trim();
        if (code) {
          if (code.toUpperCase() === 'SPARKLE') {
            if (window.PBIZCatalog) window.PBIZCatalog.showToast('Promo code applied! 🎉');
          } else {
            if (window.PBIZCatalog) window.PBIZCatalog.showToast('Invalid promo code');
          }
        }
      });
    }
  }

  // Public API
  return {
    init() {
      load();
      renderCartPage();
      initCheckout();
    },
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotals,
    getItems() { return [...cart]; },
  };
})();

// Make globally accessible
window.PBIZCart = PBIZCart;
document.addEventListener('DOMContentLoaded', PBIZCart.init);
