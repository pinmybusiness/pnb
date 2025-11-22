// src/config/api.js
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BLOG_BASE_URL || 'http://datacenter.randomstrangerchats.com:8080',
  endpoints: {
    getArticles: '/api/get-website-articles',
    getLatestArticles: '/api/get-latest-website-articles',
    getArticle: '/api/get-article',
    getBreadcrumbs: '/api/get-post-breadcrumbs',
    getAllSlugs: '/api/get-website-articles-slug'
  },
  websiteId: process.env.NEXT_PUBLIC_WEBSITE_ID || '8'
};