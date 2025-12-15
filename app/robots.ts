import { MetadataRoute } from 'next'

// =============================================================================
// ROBOTS.TXT CONFIGURATION FOR SEO
// Controls search engine crawling behavior
// =============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amazong.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Auth pages - no need to index
          '/auth/',
          '/*/auth/',
          
          // Account/dashboard pages - private
          '/account/',
          '/*/account/',
          '/dashboard/',
          '/*/dashboard/',
          '/admin/',
          '/*/admin/',
          
          // Cart and checkout - private
          '/cart/',
          '/*/cart/',
          '/checkout/',
          '/*/checkout/',
          
          // API routes
          '/api/',
          
          // Search results with parameters (crawl main search page only)
          '/*?*',
          
          // Old URL patterns (redirects exist)
          '/product/',
          '/*/product/',
          '/u/',
          '/*/u/',
          '/store/',
          '/*/store/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/auth/',
          '/*/auth/',
          '/account/',
          '/*/account/',
          '/dashboard/',
          '/*/dashboard/',
          '/admin/',
          '/*/admin/',
          '/cart/',
          '/*/cart/',
          '/checkout/',
          '/*/checkout/',
          '/api/',
        ],
        // Allow Googlebot to crawl search pages with parameters
        // for better discovery
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
