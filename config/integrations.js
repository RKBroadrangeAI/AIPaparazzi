/**
 * PaparazziByBiz Integration Configuration
 * Configure your CRM, Product Catalog, and third-party service endpoints here.
 */

const PBIZ_CONFIG = {
  // ─── Site Info ───────────────────────────────────────────
  site: {
    name: 'Paparazzi by Biz',
    tagline: 'Women\'s Fashion — Designed in LA',
    domain: 'paparazzibybiz.com',
    currency: 'USD',
    defaultLocale: 'en-US',
  },

  // ─── AI CRM Integration ─────────────────────────────────
  crm: {
    provider: 'custom',
    // CRM API base URL — update to your Railway CRM URL once deployed
    apiEndpoint: 'https://aipapcrm.up.railway.app',
    features: {
      leadCapture: true,
      chatbot: true,
      emailAutomation: true,
      customerSegmentation: true,
      abandonedCartRecovery: true,
    },
    chatbot: {
      enabled: true,
      greeting: "Hi there! 👗 Welcome to Paparazzi by Biz! How can I help you find the perfect style today?",
      quickReplies: [
        "Browse new arrivals",
        "Sizing help",
        "Shipping info",
        "Returns & exchanges",
        "Talk to support"
      ],
      // Uses CRM's /api/public/chat endpoint powered by xAI Grok
      useRemoteAI: true,
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
