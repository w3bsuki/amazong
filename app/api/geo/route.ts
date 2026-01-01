import { NextRequest, NextResponse } from 'next/server'
import { getShippingRegion } from '@/lib/shipping'

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

function normalizeCountry(code: string) {
  const upper = code.toUpperCase()
  if (upper === 'UK') return 'GB'
  return upper
}

export async function GET(request: NextRequest) {
  // Try multiple headers for country detection
  const countryCode = 
    request.headers.get('x-vercel-ip-country') || // Vercel
    request.headers.get('cf-ipcountry') ||        // Cloudflare
    request.headers.get('x-country-code') ||      // Some CDNs
    'BG' // Default to Bulgaria for local dev / unknown

  const normalizedCountry = normalizeCountry(countryCode)

  // Get the detected shipping zone
  const shippingZone = getShippingRegion(normalizedCountry)

  // Set cookie with 1 year expiry
  const response = NextResponse.json({
    country: normalizedCountry,
    zone: shippingZone,
    detected: true,
  })

  // Varies by request headers/IP and sets cookies; do not cache at CDN.
  response.headers.set('Cache-Control', 'private, no-store')
  response.headers.set('CDN-Cache-Control', 'private, no-store')
  response.headers.set('Vercel-CDN-Cache-Control', 'private, no-store')

  // Set cookies for client-side access
  response.cookies.set('user-country', normalizedCountry, {
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
