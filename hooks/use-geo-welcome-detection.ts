import { createClient } from '@/lib/supabase/client';
import { getShippingRegion, type ShippingRegion } from '@/lib/shipping';

import {
  COOKIE_NAMES,
  STORAGE_KEYS,
  getCookie,
  getLocalStorage,
  isShippingRegion,
  setCookie,
  setLocalStorage,
} from './use-geo-welcome.shared';

type GeoWelcomeDetectionResult =
  | {
      shouldOpen: false;
    }
  | {
      shouldOpen: true;
      countryCode: string;
      detectedRegion: ShippingRegion;
    };

export async function detectGeoWelcomeState(): Promise<GeoWelcomeDetectionResult> {
  const dismissed = getLocalStorage(STORAGE_KEYS.DISMISSED);
  if (dismissed === 'true') {
    return { shouldOpen: false };
  }

  const countryCode = getCookie(COOKIE_NAMES.COUNTRY) || 'BG';
  const zoneFromCookie = getCookie(COOKIE_NAMES.ZONE);
  const detectedRegion = isShippingRegion(zoneFromCookie)
    ? zoneFromCookie
    : getShippingRegion(countryCode);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('shipping_region, country_code')
      .eq('id', user.id)
      .single();

    const profileRegion = isShippingRegion(profile?.shipping_region)
      ? profile.shipping_region
      : null;

    if (profileRegion) {
      setCookie(COOKIE_NAMES.ZONE, profileRegion);
      if (profile?.country_code) {
        setCookie(COOKIE_NAMES.COUNTRY, profile.country_code);
      }
      setLocalStorage(STORAGE_KEYS.DISMISSED, 'true');
      return { shouldOpen: false };
    }
  }

  setLocalStorage(STORAGE_KEYS.LAST_SHOWN, Date.now().toString());
  return {
    shouldOpen: true,
    countryCode,
    detectedRegion,
  };
}
