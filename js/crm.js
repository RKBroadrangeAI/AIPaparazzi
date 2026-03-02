/**
 * PaparazziByBiz - AI CRM Integration
 * Handles chatbot, lead capture, customer tracking, and CRM syncing
 */

const PBIZCRM = (() => {
  'use strict';

  const STORAGE_KEY = 'pbiz_crm_session';
  const LEADS_KEY = 'pbiz_leads';
  let sessionData = {};
  let chatHistory = [];
  let isTyping = false;

  // AI Response templates for the fashion consultant chatbot
  const AI_RESPONSES = {
    greetings: [
      "Hey there! 👗 Welcome to PaparazziByBiz! I'm your wholesale style consultant. How can I help you today?",
      "Hi! ✨ So glad you're here! Looking for the latest styles from our S/S 2026 collection? I'm here to help!",
      "Welcome! 💕 I'm Biz's Style Assistant. Ask me about our wholesale women's fashion, trade shows, or sizing!",
    ],
    products: [
      "Great taste! We have beautiful pieces in that category. Check out our newest arrivals from the S/S 2026 collection!",
      "You'll love our selection! From embroidered details to reversible jackets — all designed in LA. Browse our collections!",
      "Fun choice! Here are some gorgeous styles that boutique owners are loving right now!",
    ],
    pricing: [
      "We offer competitive wholesale pricing for retail partners and boutique owners. Contact us or visit our Faire Market storefront for full pricing details! 💰",
      "Our wholesale pricing is designed to give retailers great margins. Reach out to info@paparazzibybiz.com for a price list and minimum order details! 🛍️",
    ],
    shipping: [
      "We ship nationwide! Most wholesale orders go out within 1–2 business days. Standard delivery is 3–5 business days. 📦",
      "Shipping is fast — most orders ship in 1–2 days and arrive within 3–5 business days! Contact us for volume shipping rates. 🚚",
    ],
    retailPartner: [
      "Becoming a Paparazzi by Biz retail partner is easy! Visit us at trade shows like Atlanta Apparel Market, browse our Faire storefront, or contact us directly. We'd love to work with your boutique!",
      "We love working with boutique owners! You can order through Faire Market, meet us at upcoming trade shows, or email info@paparazzibybiz.com to get started.",
    ],
    returns: [
      "We want you to love your order! If something isn't right, reach out within 30 days and we'll make it right. 💝",
      "No worries! We have a hassle-free 30-day return policy. Just contact us and we'll take care of you!",
    ],
    tradeShows: [
      "You can find us at these upcoming shows: Atlanta Apparel Market (March 30–April 2) and Trendz (April 19–21). We'd love to see you there! 🎪",
      "We exhibit at major trade shows! Catch us at Atlanta Apparel Market and Trendz. We're also on Faire Market for easy online wholesale ordering.",
    ],
    default: [
      "That's a great question! Let me connect you with our team for the best answer. Reach us at info@paparazzibybiz.com or (213) 748-2900.",
      "I'd love to help with that! For detailed assistance, email info@paparazzibybiz.com or call (213) 748-2900.",
      "Thanks for asking! Browse our collections or contact us directly for more info. Is there anything specific I can help with?",
    ],
  };

  // Quick reply options
  const QUICK_REPLIES = [
    { text: '� Browse Styles', action: 'browse' },
    { text: '💰 Wholesale Pricing', action: 'pricing' },
    { text: '🚚 Shipping Details', action: 'shipping' },
    { text: '🎪 Trade Shows', action: 'tradeshows' },
    { text: '🤝 Become a Partner', action: 'partner' },
  ];

  /**
   * Initialize CRM session
   */
  function init() {
    loadSession();
    initChatbot();
    initLeadCapture();
    initAbandonedCartTracking();
    trackPageView();
  }

  /**
   * Load/create session
   */
  function loadSession() {
    try {
      sessionData = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      sessionData = {};
    }

    if (!sessionData.sessionId) {
      sessionData = {
        sessionId: generateId(),
        startTime: Date.now(),
        pageViews: [],
        events: [],
        source: document.referrer || 'direct',
        utm: parseUTMParams(),
      };
    }
    saveSession();
  }

  function saveSession() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  }

  function generateId() {
    return 'pbiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function parseUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign'),
      content: params.get('utm_content'),
    };
  }

  /**
   * Track page view
   */
  function trackPageView() {
    const view = {
      url: window.location.pathname,
      title: document.title,
      timestamp: Date.now(),
    };
    sessionData.pageViews = sessionData.pageViews || [];
    sessionData.pageViews.push(view);
    saveSession();
  }

  /**
   * Track custom events
   */
  function trackEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      data,
      timestamp: Date.now(),
      url: window.location.pathname,
    };
    sessionData.events = sessionData.events || [];
    sessionData.events.push(event);
    saveSession();

    // Send to configured CRM if available
    syncToCRM(event);
  }

  /**
   * Sync events to external CRM
   */
  async function syncToCRM(event) {
    const config = window.PBIZ_CONFIG?.crm;
    if (!config || !config.provider || config.provider === 'custom') return;

    try {
      // HubSpot tracking
      if (config.provider === 'hubspot' && window._hsq) {
        window._hsq.push(['trackCustomBehavioralEvent', {
          name: event.name,
          properties: event.data,
        }]);
      }

      // Salesforce tracking
      if (config.provider === 'salesforce' && config.salesforce?.instanceUrl) {
        // Would POST to Salesforce REST API
      }

      // Zoho tracking
      if (config.provider === 'zoho' && config.zoho?.orgId) {
        // Would POST to Zoho CRM API
      }
    } catch (err) {
      console.warn('CRM sync error:', err);
    }
  }

  // ========== CHATBOT ==========

  function initChatbot() {
    const trigger = document.getElementById('chatbotTrigger');
    const widget = document.getElementById('chatbotWidget');
    const closeBtn = document.getElementById('chatbotClose');
    const sendBtn = document.getElementById('chatbotSend');
    const input = document.getElementById('chatbotInput');

    if (!trigger || !widget) return;

    // Toggle chatbot
    trigger.addEventListener('click', () => {
      const isOpen = widget.classList.toggle('active');
      trigger.style.display = isOpen ? 'none' : '';

      if (isOpen && chatHistory.length === 0) {
        sendGreeting();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        widget.classList.remove('active');
        trigger.style.display = '';
      });
    }

    // Send message
    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => sendUserMessage(input));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendUserMessage(input);
        }
      });
    }
  }

  function sendGreeting() {
    const greeting = pickRandom(AI_RESPONSES.greetings);
    appendBotMessage(greeting);
    showQuickReplies();
  }

  function sendUserMessage(input) {
    const text = input.value.trim();
    if (!text || isTyping) return;

    appendUserMessage(text);
    input.value = '';

    // Track in CRM
    trackEvent('chatbot_message', { message: text });

    // Generate response
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      const response = generateResponse(text);
      appendBotMessage(response);
      showQuickReplies();
    }, 800 + Math.random() * 1200);
  }

  function generateResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    // Intent detection
    if (msg.match(/hi|hello|hey|sup|what's up/)) {
      return pickRandom(AI_RESPONSES.greetings);
    }
    if (msg.match(/dress|top|blouse|jacket|cardigan|coordinate|resort|pant|skirt|kimono|clothing|fashion|style|product/)) {
      return pickRandom(AI_RESPONSES.products);
    }
    if (msg.match(/price|cost|how much|\$|dollar|wholesale|minimum|order/)) {
      return pickRandom(AI_RESPONSES.pricing);
    }
    if (msg.match(/ship|deliver|order|track|arrival/)) {
      return pickRandom(AI_RESPONSES.shipping);
    }
    if (msg.match(/partner|retail|boutique|store|buyer|wholesale account/)) {
      return pickRandom(AI_RESPONSES.retailPartner);
    }
    if (msg.match(/trade show|atlanta|apparel|market|faire|trendz|exhibit/)) {
      return pickRandom(AI_RESPONSES.tradeShows);
    }
    if (msg.match(/return|refund|exchange|broken|damage|wrong/)) {
      return pickRandom(AI_RESPONSES.returns);
    }

    return pickRandom(AI_RESPONSES.default);
  }

  function handleQuickReply(action) {
    const mappings = {
      browse: 'I want to browse your clothing collection!',
      pricing: 'What are the wholesale prices?',
      shipping: 'What are the shipping options?',
      tradeshows: 'What trade shows will you be at?',
      partner: "I'm interested in becoming a retail partner",
      contact: 'How can I contact you?',
    };

    const text = mappings[action] || action;
    const input = document.getElementById('chatbotInput');
    if (input) {
      input.value = text;
      sendUserMessage(input);
    }
  }

  function appendUserMessage(text) {
    const messages = document.getElementById('chatbotMessages');
    if (!messages) return;

    chatHistory.push({ role: 'user', text });

    const div = document.createElement('div');
    div.className = 'chatbot-message chatbot-message--user';
    div.innerHTML = `<div class="chatbot-message__content">${escapeHtml(text)}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function appendBotMessage(text) {
    const messages = document.getElementById('chatbotMessages');
    if (!messages) return;

    chatHistory.push({ role: 'bot', text });

    const div = document.createElement('div');
    div.className = 'chatbot-message chatbot-message--bot';
    div.innerHTML = `
      <div class="chatbot-message__avatar">
        <i class="fas fa-shirt"></i>
      </div>
      <div class="chatbot-message__content">${text}</div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showQuickReplies() {
    const messages = document.getElementById('chatbotMessages');
    if (!messages) return;

    // Remove existing quick replies
    messages.querySelectorAll('.chatbot-quick-replies').forEach(el => el.remove());

    const div = document.createElement('div');
    div.className = 'chatbot-quick-replies';
    div.innerHTML = QUICK_REPLIES.map(qr =>
      `<button class="chatbot-quick-reply" onclick="PBIZCRM.handleQuickReply('${qr.action}')">${qr.text}</button>`
    ).join('');
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTypingIndicator() {
    isTyping = true;
    const messages = document.getElementById('chatbotMessages');
    if (!messages) return;

    const div = document.createElement('div');
    div.className = 'chatbot-message chatbot-message--bot chatbot-typing';
    div.innerHTML = `
      <div class="chatbot-message__avatar"><i class="fas fa-shirt"></i></div>
      <div class="chatbot-message__content">
        <div class="chatbot-typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTypingIndicator() {
    isTyping = false;
    document.querySelectorAll('.chatbot-typing').forEach(el => el.remove());
  }

  // ========== LEAD CAPTURE ==========

  function initLeadCapture() {
    // Newsletter forms
    document.querySelectorAll('.newsletter__form, #newsletterForm').forEach(form => {
      form.addEventListener('submit', handleNewsletterSignup);
    });
  }

  function handleNewsletterSignup(e) {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput?.value.trim();

    if (!email) return;

    const lead = {
      type: 'newsletter',
      email,
      timestamp: Date.now(),
      source: window.location.pathname,
      sessionId: sessionData.sessionId,
    };

    saveLead(lead);
    syncLeadToCRM(lead);

    // Track the event
    trackEvent('newsletter_signup', { email });

    // Show success
    emailInput.value = '';
    if (window.PBIZCatalog) {
      window.PBIZCatalog.showToast('Welcome to the VIP list! 🎉 Check your inbox for a surprise!');
    }

    // Update form
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
      }, 3000);
    }
  }

  /**
   * Handle contact form submission
   */
  function handleContactForm(formData) {
    const lead = {
      type: 'contact',
      ...formData,
      timestamp: Date.now(),
      sessionId: sessionData.sessionId,
    };

    saveLead(lead);
    syncLeadToCRM(lead);
    trackEvent('contact_form_submit', formData);

    return true;
  }

  function saveLead(lead) {
    try {
      const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
      leads.push(lead);
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } catch (err) {
      console.warn('Failed to save lead:', err);
    }
  }

  async function syncLeadToCRM(lead) {
    const config = window.PBIZ_CONFIG?.crm;
    if (!config) return;

    try {
      // HubSpot
      if (config.provider === 'hubspot' && config.hubspot?.portalId) {
        const formId = config.hubspot.forms?.[lead.type];
        if (formId) {
          await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${config.hubspot.portalId}/${formId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: Object.entries(lead).map(([name, value]) => ({ name, value: String(value) })),
            }),
          });
        }
      }

      // Email marketing sync
      const emailConfig = window.PBIZ_CONFIG?.email;
      if (emailConfig?.provider === 'mailchimp' && lead.email) {
        // Would POST to Mailchimp API
      }
    } catch (err) {
      console.warn('Lead sync error:', err);
    }
  }

  // ========== ABANDONED CART ==========

  function initAbandonedCartTracking() {
    let hasItems = false;
    
    // Check periodically if cart has items
    setInterval(() => {
      if (window.PBIZCart) {
        const totals = window.PBIZCart.getTotals();
        if (totals.itemCount > 0 && !hasItems) {
          hasItems = true;
          trackEvent('cart_active', { itemCount: totals.itemCount, subtotal: totals.subtotal });
        }
      }
    }, 30000);

    // Track page exit with items in cart
    window.addEventListener('beforeunload', () => {
      if (window.PBIZCart) {
        const totals = window.PBIZCart.getTotals();
        if (totals.itemCount > 0) {
          trackEvent('potential_abandoned_cart', {
            itemCount: totals.itemCount,
            subtotal: totals.subtotal,
            items: window.PBIZCart.getItems().map(i => i.title),
          });
        }
      }
    });
  }

  // ========== UTILITIES ==========

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Public API
  return {
    init,
    trackEvent,
    handleContactForm,
    handleQuickReply,
    getSession() { return { ...sessionData }; },
    getChatHistory() { return [...chatHistory]; },
  };
})();

// Make globally accessible
window.PBIZCRM = PBIZCRM;
document.addEventListener('DOMContentLoaded', PBIZCRM.init);
