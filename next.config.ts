import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isE2E = process.env.NEXT_PUBLIC_E2E === 'true'

const nextConfig: NextConfig = {
  // ============================================
  // Next.js 16+ Configuration
  // ============================================

  // Remove console.log in production (keep error/warn for debugging)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Enable cache components for e-commerce performance
  cacheComponents: true,

  // Custom cache life profiles
  cacheLife: {
    // Categories: cached for 1 hour, serve stale for 5 min while revalidating
    categories: {
      stale: 300,       // 5 minutes - serve stale content this long
      revalidate: 3600, // 1 hour - revalidate in background after this
      expire: 86400,    // 1 day - hard expiry, refetch required
    },
    // Products: more frequent updates expected
    products: {
      stale: 60,        // 1 minute
      revalidate: 300,  // 5 minutes
      expire: 3600,     // 1 hour
    },
    // Deals: shorter cache for time-sensitive promotions
    deals: {
      stale: 30,        // 30 seconds - deals change often
      revalidate: 120,  // 2 minutes
      expire: 600,      // 10 minutes - force refresh
    },
    // User data: short cache for personalization
    user: {
      stale: 30,        // 30 seconds
      revalidate: 60,   // 1 minute
      expire: 300,      // 5 minutes
    },
  },

  // Image optimization configuration
  images: {
    // E2E runs should not depend on external image optimization/fetching.
    // This keeps Playwright stable (especially WebKit/mobile-safari).
    unoptimized: isE2E,
    formats: ['image/avif', 'image/webp'],
    // Allow the explicit quality used in a few hot paths (e.g. product gallery).
    qualities: [25, 50, 75, 85, 90, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
    ],
  },

  // Experimental features for better performance
  experimental: {
    // Server Actions configuration - Allow up to 10MB for image uploads
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Persist Turbopack compiler artifacts across restarts for faster local dev.
    turbopackFileSystemCacheForDev: true,
    // Enable optimistic updates for faster navigation
    optimisticClientCache: true,
    // Optimize package imports for smaller bundles
    optimizePackageImports: ['@phosphor-icons/react', 'date-fns', 'recharts'],
  },

  // Compression for production builds
  compress: true,

  // Enable powered by header removal
  poweredByHeader: false,

  // Strict mode for better development warnings
  reactStrictMode: true,

  // ===========================================
  // SEO Redirects - 301 permanent redirects for old URLs
  // ===========================================
  async redirects() {
    return [
      // Redirect old /u/{username} to /{username}
      {
        source: '/:locale/u/:username',
        destination: '/:locale/:username',
        permanent: true,
      },
    ]
  },
} satisfies NextConfig;

export default withBundleAnalyzer(withNextIntl(nextConfig));
