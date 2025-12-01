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
  const existingCountry = request.cookies.get('user-country')?.value;
  
  if (!existingCountry) {
    // Try to detect country from IP headers (Vercel, Cloudflare, other CDNs)
    const countryCode = 
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-country-code') ||
      'BG'; // Default to Bulgaria for local development
    
    // Calculate shipping region from country code
    const shippingRegion = getShippingRegion(countryCode);

    // Set cookies for 1 year
    response.cookies.set('user-country', countryCode, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
    response.cookies.set('user-zone', shippingRegion, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
  }

  return await updateSession(request, response);
}

export const config = {
  // Match all pathnames except:
  // - API routes (/api/*)
  // - Next.js internals (/_next/*, /_vercel/*)
  // - Auth callbacks
  // - Static files (files with extensions like .ico, .png, etc.)
  matcher: ['/((?!api|_next|_vercel|auth/callback|.*\\..*).*)']
};
