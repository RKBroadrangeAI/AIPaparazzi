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
      "Hey there! 👗 Welcome to PaparazziByBiz! I'm your personal style assistant. How can I help you today?",
      "Hi! ✨ So glad you're here! Looking for the latest styles from our S/S 2026 collection? I'm here to help!",
      "Welcome! 💕 I'm Biz's Style Assistant. Ask me about our women's fashion, sizing, or shipping!",
    ],
    products: [
      "Great taste! We have beautiful pieces in that category. Check out our newest arrivals from the S/S 2026 collection!",
      "You'll love our selection! From embroidered details to reversible jackets — all designed in LA. Browse our collections!",
      "Fun choice! Here are some gorgeous styles that customers are loving right now!",
    ],
    pricing: [
      "We offer amazing prices on fashion designed right here in LA! Check out our current collection for great deals. 💰",
      "Our prices are designed to make designer-quality fashion accessible to everyone. Browse our shop for the latest styles! 🛍️",
    ],
    shipping: [
      "We ship nationwide! Most orders go out within 1–2 business days. Standard delivery is 3–5 business days. 📦",
      "Shipping is fast — most orders ship in 1–2 days and arrive within 3–5 business days! Contact us for volume shipping rates. 🚚",
    ],
    newArrivals: [
      "We drop new styles every week! Check out our New Arrivals section for the freshest pieces — from embroidered tops to resort-ready coordinates!",
      "New styles just landed! Head to our New Arrivals for the latest from our S/S 2026 collection. They go fast!",
    ],
    returns: [
      "We want you to love your order! If something isn't right, reach out within 30 days and we'll make it right. 💝",
      "No worries! We have a hassle-free 30-day return policy. Just contact us and we'll take care of you!",
    ],
    sizing: [
      "Most of our styles are available from S to XL. Each product page has a detailed size chart. If you're between sizes, we recommend sizing up for a relaxed fit! 📏",
      "Check the size chart on each product page for exact measurements. Most customers find our sizing runs true to standard US sizing!",
    ],
    default: [
      "That's a great question! Let me connect you with our team for the best answer. Reach us at info@paparazzibybiz.com or (213) 748-2900.",
      "I'd love to help with that! For detailed assistance, email info@paparazzibybiz.com or call (213) 748-2900.",
      "Thanks for asking! Browse our collections or contact us directly for more info. Is there anything specific I can help with?",
    ],
  };

  // Quick reply options
  const QUICK_REPLIES = [
    { text: '👗 Browse Styles', action: 'browse' },
    { text: '🆕 New Arrivals', action: 'newarrivals' },
    { text: '🚚 Shipping Info', action: 'shipping' },
    { text: '📏 Sizing Help', action: 'sizing' },
    { text: '💰 Pricing', action: 'pricing' },
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

    // Try remote AI via CRM, fall back to local responses
    showTypingIndicator();
    sendToRemoteAI(text)
      .then(reply => {
        hideTypingIndicator();
        appendBotMessage(reply);
        showQuickReplies();
      })
      .catch(() => {
        hideTypingIndicator();
        const response = generateResponse(text);
        appendBotMessage(response);
        showQuickReplies();
      });
  }

  /**
   * Send message to CRM's public AI chat endpoint
   */
  async function sendToRemoteAI(message) {
    const config = window.PBIZ_CONFIG?.crm;
    if (!config?.apiEndpoint || !config?.chatbot?.useRemoteAI) {
      throw new Error('Remote AI not configured');
    }

    const response = await fetch(`${config.apiEndpoint}/api/public/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: chatHistory.slice(-10).map(h => ({
          role: h.role === 'bot' ? 'assistant' : h.role,
          content: h.text,
        })),
      }),
    });

    if (!response.ok) throw new Error('AI request failed');
    const data = await response.json();
    if (!data.reply) throw new Error('No reply');
    return data.reply;
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
    if (msg.match(/price|cost|how much|\$|dollar|deal|sale|discount/)) {
      return pickRandom(AI_RESPONSES.pricing);
    }
    if (msg.match(/ship|deliver|order|track|arrival/)) {
      return pickRandom(AI_RESPONSES.shipping);
    }
    if (msg.match(/new arrival|new style|latest|just dropped|new drop/)) {
      return pickRandom(AI_RESPONSES.newArrivals);
    }
    if (msg.match(/size|sizing|fit|measurement|chart|xs|xl/)) {
      return pickRandom(AI_RESPONSES.sizing);
    }
    if (msg.match(/return|refund|exchange|broken|damage|wrong/)) {
      return pickRandom(AI_RESPONSES.returns);
    }

    return pickRandom(AI_RESPONSES.default);
  }

  function handleQuickReply(action) {
    const mappings = {
      browse: 'I want to browse your clothing collection!',
      pricing: 'What are the prices?',
      shipping: 'What are the shipping options?',
      newarrivals: 'Show me the new arrivals!',
      sizing: 'What sizes do you carry?',
      
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
    syncNewsletterToCRM(email);

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
    syncContactToCRM(formData);
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

  /**
   * Send newsletter signup to CRM
   */
  async function syncNewsletterToCRM(email) {
    const config = window.PBIZ_CONFIG?.crm;
    if (!config?.apiEndpoint) return;

    try {
      await fetch(`${config.apiEndpoint}/api/public/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: window.location.pathname,
        }),
      });
    } catch (err) {
      console.warn('Newsletter CRM sync error:', err);
    }
  }

  /**
   * Send contact form to CRM
   */
  async function syncContactToCRM(formData) {
    const config = window.PBIZ_CONFIG?.crm;
    if (!config?.apiEndpoint) return;

    try {
      await fetch(`${config.apiEndpoint}/api/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName || formData.name?.split(' ')[0] || 'Unknown',
          lastName: formData.lastName || formData.name?.split(' ').slice(1).join(' ') || 'Visitor',
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          message: formData.message || null,
        }),
      });
    } catch (err) {
      console.warn('Contact CRM sync error:', err);
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
