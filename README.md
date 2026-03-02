# PaparazziByBiz.com - Modern B2C Website

A modern, responsive B2C website for Paparazzi by Biz jewelry and accessories.

## Features

- **Modern Design** - Clean, elegant UI with smooth animations
- **AI CRM Integration** - Built-in chatbot, lead capture, and customer data management
- **Product Catalog** - Dynamic product catalog with API integration to retail site
- **Responsive** - Fully responsive across all devices
- **SEO Optimized** - Semantic HTML, meta tags, and structured data
- **Fast Performance** - Optimized assets, lazy loading, minimal dependencies

## Project Structure

```
pbizwebsite/
├── index.html              # Homepage
├── shop.html               # Product catalog/shop page
├── product.html            # Product detail page
├── about.html              # About page
├── contact.html            # Contact page
├── cart.html               # Shopping cart page
├── css/
│   ├── styles.css          # Main stylesheet
│   ├── components.css      # Reusable components
│   └── responsive.css      # Responsive breakpoints
├── js/
│   ├── app.js              # Main application logic
│   ├── catalog.js          # Product catalog integration
│   ├── cart.js             # Shopping cart functionality
│   ├── crm.js              # AI CRM integration module
│   └── animations.js       # Scroll & interaction animations
├── assets/
│   ├── images/             # Image assets
│   └── icons/              # SVG icons
└── config/
    └── integrations.js     # CRM & catalog API configuration
```

## Getting Started

```bash
# Serve locally
npx live-server --port=3000

# Or use any static file server
python3 -m http.server 3000
```

## Integration Points

### AI CRM Integration
- Configure CRM endpoint in `config/integrations.js`
- Supports HubSpot, Salesforce, Zoho, and custom CRM APIs
- Built-in lead capture forms and chatbot widget

### Product Catalog
- REST API integration for product data
- Configurable endpoints for your retail platform
- Supports Shopify, WooCommerce, BigCommerce, and custom APIs

## Deployment

This is a static site that can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting provider
