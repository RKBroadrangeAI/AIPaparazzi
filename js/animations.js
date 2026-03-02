/**
 * PaparazziByBiz - Scroll & Interaction Animations
 * Lightweight scroll-triggered animation system
 */

const PBIZAnimations = (() => {
  'use strict';

  let observer = null;

  /**
   * Initialize Intersection Observer for scroll animations
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    if (!animatedElements.length) return;

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-aos-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  /**
   * Counter animation for statistics
   */
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-count'));
          animateNumber(entry.target, 0, target, 2000);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  /**
   * Animate a number from start to end
   */
  function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const format = end >= 1000;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      
      element.textContent = format ? current.toLocaleString() : current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /**
   * Parallax effect for hero section
   */
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const heroCards = hero.querySelectorAll('.hero__image-card');
          
          heroCards.forEach((card, index) => {
            const speed = 0.02 + (index * 0.01);
            card.style.transform = `translateY(${scrolled * speed}px)`;
          });
          
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Smooth reveal on page load
   */
  function initPageReveal() {
    document.body.classList.add('page-loaded');
    
    // Stagger hero animations
    const heroAnimations = document.querySelectorAll('.animate-fade-up, .animate-fade-left');
    heroAnimations.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
    });
  }

  /**
   * Header scroll effect
   */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.pageYOffset;
      
      if (currentScrollY > 100) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  /**
   * Back to top button visibility
   */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Product card hover effects (touch devices)
   */
  function initTouchHover() {
    if (!('ontouchstart' in window)) return;

    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('touchstart', function() {
        // Remove hover state from all other cards
        document.querySelectorAll('.product-card.touch-hover').forEach(c => {
          if (c !== this) c.classList.remove('touch-hover');
        });
        this.classList.toggle('touch-hover');
      }, { passive: true });
    });
  }

  // Public API
  return {
    init() {
      initPageReveal();
      initScrollAnimations();
      animateCounters();
      initParallax();
      initHeaderScroll();
      initBackToTop();
      initTouchHover();
    },
    animateNumber,
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', PBIZAnimations.init);
