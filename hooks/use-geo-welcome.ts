"use client"


import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type ShippingRegion } from '@/lib/shipping';

import { detectGeoWelcomeState } from './use-geo-welcome-detection';
import {
  COOKIE_NAMES,
  STORAGE_KEYS,
  dispatchGeoWelcomeCompleteEvent,
  getErrorMessage,
  getLocaleForRegion,
  getPathWithLocale,
  getRegionCountryCode,
  setCookie,
  setLocalStorage,
} from './use-geo-welcome.shared';

import { logger } from "@/lib/logger"
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
        const detection = await detectGeoWelcomeState();
        if (!canUpdateState()) return;

        if (!detection.shouldOpen) {
          setClosedState();
          return;
        }

        setOpenState(detection.countryCode, detection.detectedRegion);
      } catch (error: unknown) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('[useGeoWelcome] Failed to initialize geo welcome', { error: getErrorMessage(error) });
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
        logger.debug('[useGeoWelcome] Failed to persist selected region', { error: getErrorMessage(error) });
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


