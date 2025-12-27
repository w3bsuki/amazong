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
export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  // Pass pathname to layout for conditional rendering
  response.headers.set('x-pathname', request.nextUrl.pathname);

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

export default proxy;

export const config = {
  // Match all pathnames except:
  // - API routes (/api/*)
  // - Next.js internals (/_next/*, /_vercel/*)
  // - Auth callbacks and confirm routes
  // - Static files (files with extensions like .ico, .png, etc.)
  matcher: ['/((?!api|_next|_vercel|auth/callback|auth/confirm|.*\\..*).*)']
};
