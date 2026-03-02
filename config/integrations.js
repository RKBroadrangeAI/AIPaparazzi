/**
 * PaparazziByBiz Integration Configuration
 * Configure your CRM, Product Catalog, and third-party service endpoints here.
 */

const PBIZ_CONFIG = {
  // ─── Site Info ───────────────────────────────────────────
  site: {
    name: 'Paparazzi by Biz',
    tagline: 'Wholesale Women\'s Fashion — Designed in LA',
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
      greeting: "Hi there! � Welcome to Paparazzi by Biz! How can I help you find the perfect style today?",
      quickReplies: [
        "Browse new arrivals",
        "Wholesale pricing",
        "Trade show schedule",
        "Become a retail partner",
        "Talk to support"
      ],
      aiModel: 'gpt-4',
      contextPrompt: 'You are a friendly fashion consultant for Paparazzi by Biz, a wholesale women\'s clothing brand designed in Los Angeles. Help retail partners find styles, answer questions about wholesale pricing, trade shows, and sizing.',
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
      { id: 'dresses', name: 'Dresses', icon: '👗' },
      { id: 'tops', name: 'Tops', icon: '👚' },
      { id: 'jackets', name: 'Jackets & Cardigans', icon: '🧥' },
      { id: 'coordinates', name: 'Coordinates', icon: '✨' },
      { id: 'resort-wear', name: 'Resort Wear', icon: '🌺' },
      { id: 'pants-skirts', name: 'Pants & Skirts', icon: '👖' },
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
