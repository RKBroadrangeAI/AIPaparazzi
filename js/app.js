/**
 * PaparazziByBiz - Main Application
 * Initializes all modules and handles global functionality
 */

const PBIZApp = (() => {
  'use strict';

  function init() {
    initMobileMenu();
    initSearch();
    initModals();
    initPageSpecific();
    initSmoothScroll();
    initLazyLoading();
    console.log('✨ PaparazziByBiz loaded successfully!');
  }

  // ========== MOBILE MENU ==========

  function initMobileMenu() {
    const toggle = document.querySelector('.nav__mobile-toggle');
    const nav = document.querySelector('.nav');
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        overlay.classList.toggle('active', isOpen);
      });

      overlay.addEventListener('click', () => {
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        overlay.classList.remove('active');
      });

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
          nav.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          overlay.classList.remove('active');
        }
      });
    }

    // Dropdown toggles on mobile
    document.querySelectorAll('.nav__link--has-dropdown').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const dropdown = link.nextElementSibling;
          if (dropdown) dropdown.classList.toggle('active');
          link.classList.toggle('active');
        }
      });
    });
  }

  // ========== SEARCH ==========

  function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    if (searchToggle && searchOverlay) {
      searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        searchOverlay.classList.add('active');
        setTimeout(() => searchInput?.focus(), 300);
      });
    }

    if (searchClose && searchOverlay) {
      searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
      });
    }

    if (searchOverlay) {
      searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
          searchOverlay.classList.remove('active');
        }
      });
    }

    // Search functionality
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const query = searchInput.value.trim();
          if (query.length >= 2) {
            performSearch(query);
          }
        }, 300);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value.trim();
          if (query) {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
          }
        }
        if (e.key === 'Escape') {
          searchOverlay?.classList.remove('active');
        }
      });
    }

    // Handle search suggestion clicks
    document.querySelectorAll('.search-suggestion').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.textContent.trim();
        window.location.href = `shop.html?search=${encodeURIComponent(tag)}`;
      });
    });
  }

  function performSearch(query) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer || !window.PBIZCatalog) return;

    const results = window.PBIZCatalog.search(query);

    if (results.length === 0) {
      resultsContainer.innerHTML = `<p style="padding: 1rem; color: var(--color-text-muted);">No results found for "${query}"</p>`;
      return;
    }

    resultsContainer.innerHTML = results.slice(0, 5).map(product => `
      <a href="product.html?id=${product.id}" class="search-result-item" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; text-decoration: none; color: inherit; border-bottom: 1px solid var(--color-border);">
        <div style="width: 48px; height: 48px; background: ${product.gradient}; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <i class="fas ${product.icon}" style="color: rgba(255,255,255,0.8);"></i>
        </div>
        <div>
          <div style="font-weight: 500;">${product.title}</div>
          <div style="font-size: 0.875rem; color: var(--color-primary);">$${product.price.toFixed(2)}</div>
        </div>
      </a>
    `).join('') + `
      <a href="shop.html?search=${encodeURIComponent(query)}" style="display: block; padding: 0.75rem 1rem; text-align: center; color: var(--color-primary); font-weight: 500; text-decoration: none;">
        View all results →
      </a>
    `;
  }

  // ========== MODALS ==========

  function initModals() {
    // Close any modal
    document.querySelectorAll('.modal__close, .modal__overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Quick view close
    const quickView = document.getElementById('quickViewModal');
    if (quickView) {
      quickView.addEventListener('click', (e) => {
        if (e.target === quickView) {
          quickView.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Close modals on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        });
      }
    });
  }

  // ========== PAGE SPECIFIC ==========

  function initPageSpecific() {
    const page = document.body.dataset.page;

    switch (page) {
      case 'contact':
        initContactForm();
        initFAQAccordion();
        break;
      case 'about':
        // About page animations handled by animations.js
        break;
    }
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        name: form.querySelector('#contactName')?.value.trim(),
        email: form.querySelector('#contactEmail')?.value.trim(),
        phone: form.querySelector('#contactPhone')?.value.trim(),
        subject: form.querySelector('#contactSubject')?.value,
        message: form.querySelector('#contactMessage')?.value.trim(),
        newsletter: form.querySelector('#contactNewsletter')?.checked,
      };

      // Validate
      if (!formData.name || !formData.email || !formData.message) {
        if (window.PBIZCatalog) {
          window.PBIZCatalog.showToast('Please fill in all required fields');
        }
        return;
      }

      // Submit to CRM
      if (window.PBIZCRM) {
        window.PBIZCRM.handleContactForm(formData);
      }

      // Show success
      form.innerHTML = `
        <div style="text-align: center; padding: 3rem 2rem;">
          <div style="width: 64px; height: 64px; background: var(--color-success); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.5rem;">
            <i class="fas fa-check"></i>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 0.75rem;">Message Sent!</h3>
          <p style="color: var(--color-text-muted);">Thank you for reaching out! We'll get back to you within 24 hours.</p>
        </div>
      `;
    });
  }

  function initFAQAccordion() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // ========== SMOOTH SCROLL ==========

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ========== LAZY LOADING ==========

  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', PBIZApp.init);
