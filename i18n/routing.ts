import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

/**
 * Supported locales type union
 * Use this type for type-safe locale handling throughout the app
 */
export type Locale = 'en' | 'bg';

/**
 * Array of supported locales
 * Export for use in generateStaticParams and validation
 */
export const locales: readonly Locale[] = ['en', 'bg'] as const;

/**
 * Type guard to check if a string is a valid locale
 * @param locale - The string to validate
 * @returns True if the string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

/**
 * Validates and narrows locale type from params
 * Throws if locale is invalid (should not happen with proper middleware)
 * @param locale - The locale string from params
 * @returns The locale with proper Locale type
 */
export function validateLocale(locale: string): Locale {
  if (isValidLocale(locale)) {
    return locale
  }

  // Fallback to default locale if somehow invalid.
  // This shouldn't happen with proper middleware setup.
  console.warn(`Invalid locale "${locale}", falling back to "en"`)
  return 'en'
}

/**
 * Centralized routing configuration for next-intl 4.x
 * 
 * This configuration is shared between:
 * - Middleware (proxy.ts) for locale routing
 * - Navigation APIs (Link, redirect, useRouter, etc.)
 * - Request config (request.ts) for locale validation
 * 
 * @see https://next-intl-docs.vercel.app/docs/routing/configuration
 */
export const routing = defineRouting({
    // Supported locales: English primary (for tests/international), Bulgarian secondary
    locales: [...locales],

    // Default to English for tests and international users
    defaultLocale: 'en' satisfies Locale,

    // Always prefix locales in URLs for:
    // - Clear URL structure (/en/products, /bg/products)
    // - Stable URLs for SEO
    // - Consistent behavior across all routes
    localePrefix: 'always',

    // Enable automatic locale detection from:
    // - Browser Accept-Language header
    // - Previously stored locale cookie
    localeDetection: true,

    /**
     * Locale cookie configuration
     * Persists user's language preference for return visits
     * 
     * @see https://next-intl-docs.vercel.app/docs/routing/configuration#locale-cookie
     */
  localeCookie: {
    // Standard cookie name recognized by next-intl
    name: 'NEXT_LOCALE',
    // Persist for 1 year (matches geo cookies in proxy.ts)
    maxAge: 60 * 60 * 24 * 365,
    // Lax same-site for security while allowing navigation
    sameSite: 'lax',
    // Available on all paths
    path: '/',
    // Secure in production (HTTPS only)
    // Note: Automatically handled by Next.js based on environment
  },
})

/**
 * Locale-aware navigation APIs
 * 
 * These are lightweight wrappers around Next.js navigation APIs that:
 * - Automatically include the current locale in URLs
 * - Handle locale switching via the `locale` prop
 * - Provide type-safe routing when using typed locales
 * 
 * Usage:
 * ```tsx
 * import { Link, useRouter } from '@/i18n/routing';
 * 
 * // Link automatically includes current locale
 * <Link href="/products">Products</Link>
 * 
 * // Switch to Bulgarian
 * <Link href="/products" locale="bg">Продукти</Link>
 * 
 * // Programmatic navigation
 * const router = useRouter();
 * router.push('/products');
 * router.push('/products', { locale: 'bg' });
 * ```
 */
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } = createNavigation(routing)
