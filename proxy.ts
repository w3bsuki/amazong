import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';
import { updateSession } from "@/lib/supabase/middleware"
import { getShippingRegion } from '@/lib/shipping';

// Create the i18n routing handler
const handleI18nRouting = createMiddleware(routing);

/**
 * Next.js 16 Proxy (renamed from middleware)
 * Handles i18n routing, geo-detection, and session management
 */
export default async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  // Pass pathname to layout for conditional rendering (request headers, not response headers)
  const overrideHeaders = response.headers.get('x-middleware-override-headers');
  const overrideList = new Set(
    (overrideHeaders ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );

  overrideList.add('x-pathname');
  response.headers.set(
    'x-middleware-override-headers',
    Array.from(overrideList).join(',')
  );
  response.headers.set('x-middleware-request-x-pathname', request.nextUrl.pathname);

  // Geo-detection: Set user-country and user-zone cookies if not present
  const existingCountryRaw = request.cookies.get('user-country')?.value;
  const existingZone = request.cookies.get('user-zone')?.value;

  // Prefer existing cookie country; otherwise detect from headers
  const detectedCountryRaw =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    'BG'; // Default to Bulgaria for local development

  // Normalize legacy/alternate values
  const normalizeCountry = (code: string) => {
    const upper = code.toUpperCase();
    if (upper === 'UK') return 'GB';
    if (upper === 'WW') return 'BG';
    return upper;
  };

  const countryCode = normalizeCountry(existingCountryRaw || detectedCountryRaw);
  const shippingRegion = existingZone || getShippingRegion(countryCode);

  // Set cookies for 1 year (only if missing)
  if (!existingCountryRaw) {
    response.cookies.set('user-country', countryCode, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
  }

  if (!existingZone) {
    response.cookies.set('user-zone', shippingRegion, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
  }

  return await updateSession(request, response);
}

// Named export for tests and internal usage.
export { proxy }

export const config = {
  // Run proxy only for actual app routes.
  // Avoid executing on:
  // - API routes
  // - Next.js internals
  // - common static files (icons, images, maps, etc.)
  // - robots/sitemap
  matcher: [
    '/((?!api(?:/|$)|_next(?:/|$)|_vercel(?:/|$)|favicon\\.ico$|robots\\.txt$|sitemap\\.xml$|manifest\\.webmanifest$|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|js|mjs|map|txt|xml|json|woff|woff2|ttf|otf)$).*)',
  ],
};
