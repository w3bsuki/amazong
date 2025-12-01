import { NextRequest, NextResponse } from 'next/server'

/**
 * Geo Detection API
 * 
 * Detects user's country from IP address using various headers:
 * - Vercel: x-vercel-ip-country
 * - Cloudflare: cf-ipcountry
 * - Standard: x-real-ip, x-forwarded-for
 * 
 * Falls back to Bulgaria (BG) for local development
 */

// Map of country codes to shipping zone codes
const COUNTRY_TO_ZONE: Record<string, string> = {
  // Bulgaria - BG zone
  BG: 'BG',
  
  // EU countries - EU zone
  AT: 'EU', BE: 'EU', HR: 'EU', CY: 'EU', CZ: 'EU', DK: 'EU', 
  EE: 'EU', FI: 'EU', FR: 'EU', DE: 'EU', GR: 'EU', HU: 'EU', 
  IE: 'EU', IT: 'EU', LV: 'EU', LT: 'EU', LU: 'EU', MT: 'EU', 
  NL: 'EU', PL: 'EU', PT: 'EU', RO: 'EU', SK: 'EU', SI: 'EU', 
  ES: 'EU', SE: 'EU', GB: 'EU', CH: 'EU', NO: 'EU',
}

export async function GET(request: NextRequest) {
  // Try multiple headers for country detection
  const countryCode = 
    request.headers.get('x-vercel-ip-country') || // Vercel
    request.headers.get('cf-ipcountry') ||        // Cloudflare
    request.headers.get('x-country-code') ||      // Some CDNs
    'BG' // Default to Bulgaria for local dev / unknown

  // Get the detected shipping zone
  const shippingZone = COUNTRY_TO_ZONE[countryCode] || 'WW' // Default to Worldwide

  // Set cookie with 1 year expiry
  const response = NextResponse.json({
    country: countryCode,
    zone: shippingZone,
    detected: true,
  })

  // Set cookies for client-side access
  response.cookies.set('user-country', countryCode, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
  })

  response.cookies.set('user-zone', shippingZone, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  })

  return response
}
