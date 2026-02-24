"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getShippingRegion, type ShippingRegion } from '@/lib/shipping';
import type { Locale } from '@/i18n/routing';

// Storage keys
const STORAGE_KEYS = {
  DISMISSED: 'geo-welcome-dismissed',
  CONFIRMED: 'geo-region-confirmed',
  LAST_SHOWN: 'geo-last-shown',
} as const;

// Cookie names (already used by proxy.ts)
const COOKIE_NAMES = {
  COUNTRY: 'user-country',
  ZONE: 'user-zone',
  LOCALE: 'NEXT_LOCALE',
} as const;
const GEO_WELCOME_COMPLETE_EVENT = "treido:geo-welcome-complete";

const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'bg'] as const;
const SUPPORTED_REGIONS: readonly ShippingRegion[] = ['BG', 'UK', 'EU', 'US', 'WW'] as const;

function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function isShippingRegion(value: string | null | undefined): value is ShippingRegion {
  return typeof value === 'string' && (SUPPORTED_REGIONS as readonly string[]).includes(value);
}

function getErrorMessage(error: unknown): string {
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

function getCurrentLocaleFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split('/').filter(Boolean)[0] || 'en';
  return isSupportedLocale(firstSegment) ? firstSegment : 'en';
}

function getPathWithLocale(targetLocale: Locale): string {
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

function getLocaleForRegion(region: ShippingRegion): Locale {
  // App supports only 'en' and 'bg'. Product requirement:
  // - Selecting BG region should switch to /bg
  // - "Show all products" should stay on /en
  if (region === 'BG') return 'bg';
  return 'en';
}

interface GeoWelcomeState {
  isOpen: boolean;
  detectedCountry: string;
  detectedRegion: ShippingRegion;
  selectedRegion: ShippingRegion;
  isLoading: boolean;
}

export interface UseGeoWelcomeReturn extends GeoWelcomeState {
  setSelectedRegion: (region: ShippingRegion) => void;
  confirmRegion: () => Promise<void>;
  declineAndShowAll: () => void;
  closeModal: () => void;
}

export interface UseGeoWelcomeOptions {
  enabled?: boolean;
}

/**
 * Helper to get cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
}

/**
 * Helper to set cookie
 */
function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Helper to safely access localStorage
 */
function getLocalStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Helper to safely set localStorage
 */
function setLocalStorage(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail for incognito mode or storage full
  }
}

function dispatchGeoWelcomeCompleteEvent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(GEO_WELCOME_COMPLETE_EVENT));
}

/**
 * Custom hook for managing geo-location welcome modal state
 * Handles first-visit detection, cookie management, and Supabase profile sync
 */
export function useGeoWelcome(options: UseGeoWelcomeOptions = {}): UseGeoWelcomeReturn {
  const { enabled = true } = options;
  const isMountedRef = useRef(true);
  const [state, setState] = useState<GeoWelcomeState>({
    isOpen: false,
    detectedCountry: 'BG',
    detectedRegion: 'BG',
    selectedRegion: 'BG',
    isLoading: true,
  });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initialize state on mount
  useEffect(() => {
    let isActive = true;
    const canUpdateState = () => isActive && isMountedRef.current;
    const setClosedState = () => {
      if (!canUpdateState()) return;
      setState(prev => ({ ...prev, isOpen: false, isLoading: false }));
    };
    const setOpenState = (countryCode: string, detectedRegion: ShippingRegion) => {
      if (!canUpdateState()) return;
      setState({
        isOpen: true,
        detectedCountry: countryCode,
        detectedRegion,
        selectedRegion: detectedRegion,
        isLoading: false,
      });
    };

    if (!enabled) {
      setClosedState();
      return () => {
        isActive = false;
      };
    }

    const initializeGeoWelcome = async () => {
      try {
        // Check if already dismissed
        const dismissed = getLocalStorage(STORAGE_KEYS.DISMISSED);
        if (dismissed === 'true') {
          setClosedState();
          return;
        }

        // Get detected country from cookie (set by proxy.ts)
        const countryCode = getCookie(COOKIE_NAMES.COUNTRY) || 'BG';
        const zoneFromCookie = getCookie(COOKIE_NAMES.ZONE);
        const detectedRegion = isShippingRegion(zoneFromCookie)
          ? zoneFromCookie
          : getShippingRegion(countryCode);

        // Check if user is authenticated and has a saved region preference
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!canUpdateState()) return;

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('shipping_region, country_code')
            .eq('id', user.id)
            .single();
          if (!canUpdateState()) return;

          const profileRegion = isShippingRegion(profile?.shipping_region)
            ? profile.shipping_region
            : null;

          // If user has a saved preference, use it and don't show modal
          if (profileRegion) {
            // Sync profile region to cookies
            setCookie(COOKIE_NAMES.ZONE, profileRegion);
            if (profile?.country_code) {
              setCookie(COOKIE_NAMES.COUNTRY, profile.country_code);
            }
            setLocalStorage(STORAGE_KEYS.DISMISSED, 'true');
            setClosedState();
            return;
          }
        }

        // Show the modal for first-time visitors
        setOpenState(countryCode, detectedRegion);

        // Record when modal was shown
        setLocalStorage(STORAGE_KEYS.LAST_SHOWN, Date.now().toString());
      } catch (error: unknown) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('[useGeoWelcome] Failed to initialize geo welcome:', getErrorMessage(error));
        }

        setClosedState();
      }
    };

    void initializeGeoWelcome();

    return () => {
      isActive = false;
    };
  }, [enabled]);

  const { selectedRegion, detectedRegion, detectedCountry } = state;

  /**
   * Update selected region in state
   */
  const setSelectedRegion = useCallback((region: ShippingRegion) => {
    setState(prev => ({ ...prev, selectedRegion: region }));
  }, []);

  /**
   * Confirm region selection - updates cookies and optionally Supabase profile
   */
  const confirmRegion = useCallback(async () => {
    // Determine if this was auto-detected or manually changed
    const isAutoDetected = selectedRegion === detectedRegion;

    // Get country code for the selected region (use detected country if same region)
    const countryCode =
      selectedRegion === 'WW'
        ? detectedCountry
        : (isAutoDetected ? detectedCountry : getRegionCountryCode(selectedRegion));

    // Update cookies
    setCookie(COOKIE_NAMES.ZONE, selectedRegion);
    setCookie(COOKIE_NAMES.COUNTRY, countryCode);

    // Keep locale cookie in sync with region selection.
    // (Locale routing is URL-based, but this preserves preference for future visits.)
    const targetLocale = getLocaleForRegion(selectedRegion);
    setCookie(COOKIE_NAMES.LOCALE, targetLocale);

    // Mark as dismissed
    setLocalStorage(STORAGE_KEYS.DISMISSED, 'true');
    setLocalStorage(STORAGE_KEYS.CONFIRMED, 'true');

    // If authenticated, update Supabase profile
    const supabase = createClient();
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        throw userError;
      }

      if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            shipping_region: selectedRegion,
            country_code: countryCode,
            region_auto_detected: isAutoDetected,
            region_updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) {
          throw updateError;
        }
      }
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[useGeoWelcome] Failed to persist selected region:', getErrorMessage(error));
      }
    }

    // Close modal
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isOpen: false }));
    }
    dispatchGeoWelcomeCompleteEvent();

    // Navigate to the correct locale route (BUG-001 fix).
    // This also refreshes server components with the updated cookies.
    window.location.assign(getPathWithLocale(targetLocale));
  }, [selectedRegion, detectedRegion, detectedCountry]);

  /**
   * Decline region filtering - show all products
   */
  const declineAndShowAll = useCallback(() => {
    // Set to worldwide (no filtering)
    setCookie(COOKIE_NAMES.ZONE, 'WW');

    // Match product expectation: "Show all" keeps English locale.
    setCookie(COOKIE_NAMES.LOCALE, 'en');

    // Mark as dismissed
    setLocalStorage(STORAGE_KEYS.DISMISSED, 'true');

    // Close modal
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isOpen: false }));
    }
    dispatchGeoWelcomeCompleteEvent();

    // Navigate to /en to reflect "show all" behavior.
    window.location.assign(getPathWithLocale('en'));
  }, []);

  /**
   * Close modal without action (just dismiss)
   */
  const closeModal = useCallback(() => {
    setLocalStorage(STORAGE_KEYS.DISMISSED, 'true');
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isOpen: false }));
    }
    dispatchGeoWelcomeCompleteEvent();
  }, []);

  return {
    ...state,
    setSelectedRegion,
    confirmRegion,
    declineAndShowAll,
    closeModal,
  };
}

/**
 * Get a representative country code for a shipping region
 */
function getRegionCountryCode(region: ShippingRegion): string {
  const regionToCountry: Record<ShippingRegion, string> = {
    BG: 'BG',
    UK: 'GB',
    EU: 'DE', // Use Germany as representative EU country
    US: 'US',
    WW: 'BG',
  };
  return regionToCountry[region];
}


