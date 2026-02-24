import type { Locale } from '@/i18n/routing';
import type { ShippingRegion } from '@/lib/shipping';

export const STORAGE_KEYS = {
  DISMISSED: 'geo-welcome-dismissed',
  CONFIRMED: 'geo-region-confirmed',
  LAST_SHOWN: 'geo-last-shown',
} as const;

export const COOKIE_NAMES = {
  COUNTRY: 'user-country',
  ZONE: 'user-zone',
  LOCALE: 'NEXT_LOCALE',
} as const;

export const GEO_WELCOME_COMPLETE_EVENT = 'treido:geo-welcome-complete';

const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'bg'] as const;
const SUPPORTED_REGIONS: readonly ShippingRegion[] = ['BG', 'UK', 'EU', 'US', 'WW'] as const;

export function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function isShippingRegion(value: string | null | undefined): value is ShippingRegion {
  return typeof value === 'string' && (SUPPORTED_REGIONS as readonly string[]).includes(value);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string') return error;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return 'Unknown error';
}

export function getCurrentLocaleFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split('/').filter(Boolean)[0] || 'en';
  return isSupportedLocale(firstSegment) ? firstSegment : 'en';
}

export function getPathWithLocale(targetLocale: Locale): string {
  const { pathname, search, hash } = window.location;
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = getCurrentLocaleFromPathname(pathname);

  if (segments.length === 0) {
    return `/${targetLocale}${search}${hash}`;
  }

  if (segments[0] === currentLocale) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }

  return `/${segments.join('/')}${search}${hash}`;
}

export function getLocaleForRegion(region: ShippingRegion): Locale {
  if (region === 'BG') return 'bg';
  return 'en';
}

export function getRegionCountryCode(region: ShippingRegion): string {
  const regionToCountry: Record<ShippingRegion, string> = {
    BG: 'BG',
    UK: 'GB',
    EU: 'DE',
    US: 'US',
    WW: 'BG',
  };
  return regionToCountry[region];
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
}

export function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function getLocalStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setLocalStorage(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail for incognito mode or storage full
  }
}

export function dispatchGeoWelcomeCompleteEvent() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(GEO_WELCOME_COMPLETE_EVENT));
}
