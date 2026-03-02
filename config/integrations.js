/**
 * PaparazziByBiz Integration Configuration
 * Configure your CRM, Product Catalog, and third-party service endpoints here.
 */

const PBIZ_CONFIG = {
  // ─── Site Info ───────────────────────────────────────────
  site: {
    name: 'Paparazzi by Biz',
    tagline: 'Stunning $5 Jewelry & Accessories',
    domain: 'paparazzibybiz.com',
    currency: 'USD',
    defaultLocale: 'en-US',
  },

  // ─── AI CRM Integration ─────────────────────────────────
  crm: {
    provider: 'custom', // 'hubspot' | 'salesforce' | 'zoho' | 'custom'
    apiEndpoint: 'https://api.paparazzibybiz.com/crm',
    apiKey: '', // Set via environment or server-side proxy
    features: {
      leadCapture: true,
      chatbot: true,
      emailAutomation: true,
      customerSegmentation: true,
      abandonedCartRecovery: true,
    },
    chatbot: {
      enabled: true,
      greeting: "Hi there! 💎 Welcome to Paparazzi by Biz! How can I help you find the perfect piece today?",
      quickReplies: [
        "Browse new arrivals",
        "Track my order",
        "Help me find a gift",
        "Become a VIP member",
        "Talk to support"
      ],
      aiModel: 'gpt-4', // AI model for chatbot responses
      contextPrompt: 'You are a friendly jewelry consultant for Paparazzi by Biz, a $5 jewelry and accessories brand. Help customers find perfect pieces, answer questions about products, and provide styling advice.',
    },
    // HubSpot-specific config
    hubspot: {
      portalId: '',
      formIds: {
        newsletter: '',
        contact: '',
        leadCapture: '',
      },
    },
    // Salesforce-specific config
    salesforce: {
      instanceUrl: '',
      clientId: '',
    },
  },

  // ─── Product Catalog Integration ─────────────────────────
  catalog: {
    provider: 'custom', // 'shopify' | 'woocommerce' | 'bigcommerce' | 'custom'
    apiEndpoint: 'https://api.paparazzibybiz.com/catalog',
    apiKey: '',
    settings: {
      productsPerPage: 12,
      enableSearch: true,
      enableFilters: true,
      enableWishlist: true,
      enableReviews: true,
      imageOptimization: true,
      lazyLoading: true,
    },
    // Shopify-specific config
    shopify: {
      storeDomain: '',
      storefrontAccessToken: '',
    },
    // WooCommerce-specific config
    woocommerce: {
      storeUrl: '',
      consumerKey: '',
      consumerSecret: '',
    },
    categories: [
      { id: 'necklaces', name: 'Necklaces', icon: '📿' },
      { id: 'earrings', name: 'Earrings', icon: '✨' },
      { id: 'bracelets', name: 'Bracelets', icon: '💫' },
      { id: 'rings', name: 'Rings', icon: '💍' },
      { id: 'hair-accessories', name: 'Hair Accessories', icon: '🎀' },
      { id: 'sets', name: 'Jewelry Sets', icon: '💎' },
    ],
  },

  // ─── Analytics & Tracking ────────────────────────────────
  analytics: {
    googleAnalyticsId: '', // GA4 measurement ID
    facebookPixelId: '',
    tiktokPixelId: '',
    enableHeatmaps: false,
  },

  // ─── Social Media ────────────────────────────────────────
  social: {
    facebook: 'https://facebook.com/paparazzibybiz',
    instagram: 'https://instagram.com/paparazzibybiz',
    tiktok: 'https://tiktok.com/@paparazzibybiz',
    pinterest: 'https://pinterest.com/paparazzibybiz',
    youtube: 'https://youtube.com/@paparazzibybiz',
  },

  // ─── Email Marketing ─────────────────────────────────────
  email: {
    provider: 'custom', // 'mailchimp' | 'klaviyo' | 'sendgrid' | 'custom'
    apiEndpoint: 'https://api.paparazzibybiz.com/email',
    listId: '',
  },

  // ─── Payment & Checkout ──────────────────────────────────
  payment: {
    providers: ['stripe', 'paypal'],
    stripe: {
      publishableKey: '',
    },
    paypal: {
      clientId: '',
    },
  },
};

// Make config available globally
if (typeof window !== 'undefined') {
  window.PBIZ_CONFIG = PBIZ_CONFIG;
}

if (typeof module !== 'undefined') {
  module.exports = PBIZ_CONFIG;
}
