/**
 * Shipping utilities for calculating delivery times based on seller location → buyer location
 * 
 * The key insight: Delivery time is calculated from WHERE the seller is (seller.country_code)
 * to WHERE the buyer wants delivery (their selected shipping region).
 * 
 * A Bulgarian seller shipping to USA = 10-20 days
 * A USA seller shipping to USA = 1-5 days
 * Same destination, different times based on origin!
 * 
 * Updated December 2025: Added UK as separate region (post-Brexit)
 */

// Shipping regions (buyer's delivery destination)
// UK added as separate region post-Brexit (no longer part of EU for shipping)
export type ShippingRegion = 'BG' | 'UK' | 'EU' | 'US' | 'WW';

// Seller origin country codes
export type SellerCountry = 'BG' | 'DE' | 'US' | 'UK' | 'OTHER';

// Delivery time estimate in days
export interface DeliveryEstimate {
  minDays: number;
  maxDays: number;
  label: string;
  labelBg: string;
}

/**
 * Delivery time matrix: [FROM seller country][TO buyer region]
 * 
 * This prevents sellers from accidentally setting wrong delivery times.
 * The system automatically calculates based on their store location.
 */
const DELIVERY_MATRIX: Record<SellerCountry, Record<ShippingRegion, DeliveryEstimate>> = {
  // Bulgarian sellers
  BG: {
    BG: { minDays: 1, maxDays: 3, label: '1-3 days', labelBg: '1-3 дни' },
    UK: { minDays: 5, maxDays: 12, label: '5-12 days', labelBg: '5-12 дни' },
    EU: { minDays: 5, maxDays: 10, label: '5-10 days', labelBg: '5-10 дни' },
    US: { minDays: 10, maxDays: 20, label: '10-20 days', labelBg: '10-20 дни' },
    WW: { minDays: 15, maxDays: 30, label: '15-30 days', labelBg: '15-30 дни' },
  },
  // German sellers (example EU country)
  DE: {
    BG: { minDays: 5, maxDays: 10, label: '5-10 days', labelBg: '5-10 дни' },
    UK: { minDays: 3, maxDays: 7, label: '3-7 days', labelBg: '3-7 дни' },
    EU: { minDays: 2, maxDays: 5, label: '2-5 days', labelBg: '2-5 дни' },
    US: { minDays: 7, maxDays: 14, label: '7-14 days', labelBg: '7-14 дни' },
    WW: { minDays: 10, maxDays: 21, label: '10-21 days', labelBg: '10-21 дни' },
  },
  // USA sellers
  US: {
    BG: { minDays: 10, maxDays: 20, label: '10-20 days', labelBg: '10-20 дни' },
    UK: { minDays: 5, maxDays: 10, label: '5-10 days', labelBg: '5-10 дни' },
    EU: { minDays: 7, maxDays: 14, label: '7-14 days', labelBg: '7-14 дни' },
    US: { minDays: 1, maxDays: 5, label: '1-5 days', labelBg: '1-5 дни' },
    WW: { minDays: 7, maxDays: 21, label: '7-21 days', labelBg: '7-21 дни' },
  },
  // UK sellers
  UK: {
    BG: { minDays: 5, maxDays: 12, label: '5-12 days', labelBg: '5-12 дни' },
    UK: { minDays: 1, maxDays: 3, label: '1-3 days', labelBg: '1-3 дни' },
    EU: { minDays: 3, maxDays: 7, label: '3-7 days', labelBg: '3-7 дни' },
    US: { minDays: 5, maxDays: 10, label: '5-10 days', labelBg: '5-10 дни' },
    WW: { minDays: 10, maxDays: 21, label: '10-21 days', labelBg: '10-21 дни' },
  },
  // Other countries (fallback)
  OTHER: {
    BG: { minDays: 10, maxDays: 25, label: '10-25 days', labelBg: '10-25 дни' },
    UK: { minDays: 7, maxDays: 18, label: '7-18 days', labelBg: '7-18 дни' },
    EU: { minDays: 7, maxDays: 20, label: '7-20 days', labelBg: '7-20 дни' },
    US: { minDays: 7, maxDays: 21, label: '7-21 days', labelBg: '7-21 дни' },
    WW: { minDays: 14, maxDays: 35, label: '14-35 days', labelBg: '14-35 дни' },
  },
};

/**
 * Map ISO country codes to seller categories
 */
const COUNTRY_TO_SELLER_CATEGORY: Record<string, SellerCountry> = {
  BG: 'BG',
  // EU countries → treat as German-like delivery times
  AT: 'DE', BE: 'DE', HR: 'DE', CY: 'DE', CZ: 'DE', DK: 'DE',
  EE: 'DE', FI: 'DE', FR: 'DE', DE: 'DE', GR: 'DE', HU: 'DE',
  IE: 'DE', IT: 'DE', LV: 'DE', LT: 'DE', LU: 'DE', MT: 'DE',
  NL: 'DE', PL: 'DE', PT: 'DE', RO: 'DE', SK: 'DE', SI: 'DE',
  ES: 'DE', SE: 'DE', CH: 'DE', NO: 'DE',
  // UK
  GB: 'UK', UK: 'UK',
  // USA
  US: 'US',
};

/**
 * Map ISO country codes to shipping regions (buyer perspective)
 * Updated December 2025: GB/UK now maps to 'UK' region (post-Brexit)
 */
const COUNTRY_TO_REGION: Record<string, ShippingRegion> = {
  BG: 'BG',
  // UK - POST-BREXIT: Separate shipping zone from EU
  GB: 'UK',
  UK: 'UK',
  // EU countries (GB removed post-Brexit)
  AT: 'EU', BE: 'EU', HR: 'EU', CY: 'EU', CZ: 'EU', DK: 'EU',
  EE: 'EU', FI: 'EU', FR: 'EU', DE: 'EU', GR: 'EU', HU: 'EU',
  IE: 'EU', IT: 'EU', LV: 'EU', LT: 'EU', LU: 'EU', MT: 'EU',
  NL: 'EU', PL: 'EU', PT: 'EU', RO: 'EU', SK: 'EU', SI: 'EU',
  ES: 'EU', SE: 'EU', CH: 'EU', NO: 'EU',
  // USA
  US: 'US',
};

/**
 * Get the shipping region for a buyer based on their country code
 */
export function getShippingRegion(countryCode: string): ShippingRegion {
  return COUNTRY_TO_REGION[countryCode.toUpperCase()] || 'WW';
}

/**
 * Get the seller category for delivery time calculation
 */
export function getSellerCategory(countryCode: string): SellerCountry {
  return COUNTRY_TO_SELLER_CATEGORY[countryCode.toUpperCase()] || 'OTHER';
}

/**
 * Calculate delivery estimate from seller to buyer
 * 
 * @param sellerCountryCode - ISO country code where seller is located (e.g., 'BG')
 * @param buyerRegion - The shipping region buyer wants delivery to
 * @returns DeliveryEstimate with min/max days and labels
 * 
 * @example
 * // Bulgarian seller shipping to USA buyer
 * getDeliveryEstimate('BG', 'US') // { minDays: 10, maxDays: 20, label: '10-20 days' }
 * 
 * // USA seller shipping to USA buyer  
 * getDeliveryEstimate('US', 'US') // { minDays: 1, maxDays: 5, label: '1-5 days' }
 */
export function getDeliveryEstimate(
  sellerCountryCode: string,
  buyerRegion: ShippingRegion
): DeliveryEstimate {
  const sellerCategory = getSellerCategory(sellerCountryCode);
  return DELIVERY_MATRIX[sellerCategory][buyerRegion];
}

/**
 * Get formatted delivery label
 */
export function getDeliveryLabel(
  sellerCountryCode: string,
  buyerRegion: ShippingRegion,
  locale: string = 'en'
): string {
  const estimate = getDeliveryEstimate(sellerCountryCode, buyerRegion);
  return locale === 'bg' ? estimate.labelBg : estimate.label;
}

/**
 * Check if a product ships to a given region based on its shipping flags
 * Updated December 2025: Added UK support
 */
export function productShipsToRegion(
  product: {
    ships_to_bulgaria?: boolean;
    ships_to_uk?: boolean;
    ships_to_europe?: boolean;
    ships_to_usa?: boolean;
    ships_to_worldwide?: boolean;
    pickup_only?: boolean;
  },
  buyerRegion: ShippingRegion
): boolean {
  // Pickup only = no shipping
  if (product.pickup_only) return false;
  
  // Worldwide covers everything
  if (product.ships_to_worldwide) return true;
  
  switch (buyerRegion) {
    case 'BG':
      // Bulgaria buyers see: BG shippers + EU shippers (since BG is in EU) + Worldwide
      return !!(product.ships_to_bulgaria || product.ships_to_europe || product.ships_to_worldwide);
    case 'UK':
      // UK buyers see: UK shippers + EU shippers (some EU sellers ship to UK) + Worldwide
      return !!(product.ships_to_uk || product.ships_to_europe || product.ships_to_worldwide);
    case 'EU':
      // EU buyers see: EU shippers + Worldwide
      return !!(product.ships_to_europe || product.ships_to_worldwide);
    case 'US':
      // USA buyers see: USA shippers + Worldwide
      return !!(product.ships_to_usa || product.ships_to_worldwide);
    case 'WW':
      // Worldwide = any shipping option
      return !!product.ships_to_worldwide;
    default:
      return !!product.ships_to_worldwide;
  }
}

/**
 * Shipping region display names
 * Updated December 2025: Added UK
 */
export const SHIPPING_REGIONS: Record<ShippingRegion, { en: string; bg: string }> = {
  BG: { en: 'Bulgaria', bg: 'България' },
  UK: { en: 'United Kingdom', bg: 'Великобритания' },
  EU: { en: 'Europe', bg: 'Европа' },
  US: { en: 'United States', bg: 'САЩ' },
  WW: { en: 'Worldwide', bg: 'По целия свят' },
};

/**
 * Get region display name
 */
export function getRegionName(region: ShippingRegion, locale: string = 'en'): string {
  return SHIPPING_REGIONS[region]?.[locale as 'en' | 'bg'] || SHIPPING_REGIONS[region]?.en || region;
}

/**
 * Build Supabase filter string for shipping zone
 * Returns an "or" filter that matches products shipping to the buyer's region
 * Updated December 2025: Added UK support
 * 
 * @example
 * const filter = getShippingFilter('BG')
 * // Returns: "ships_to_bulgaria.eq.true,ships_to_europe.eq.true,ships_to_worldwide.eq.true"
 * 
 * const filterUK = getShippingFilter('UK')
 * // Returns: "ships_to_uk.eq.true,ships_to_europe.eq.true,ships_to_worldwide.eq.true"
 * 
 * supabase.from('products').or(filter)
 */
export function getShippingFilter(buyerRegion: ShippingRegion): string {
  switch (buyerRegion) {
    case 'BG':
      // Bulgaria buyers see: BG + EU (since BG is in EU) + Worldwide
      return 'ships_to_bulgaria.eq.true,ships_to_europe.eq.true,ships_to_worldwide.eq.true';
    case 'UK':
      // UK buyers see: UK + EU (some EU sellers still ship to UK) + Worldwide
      return 'ships_to_uk.eq.true,ships_to_europe.eq.true,ships_to_worldwide.eq.true';
    case 'EU':
      // EU buyers see: EU + Worldwide
      return 'ships_to_europe.eq.true,ships_to_worldwide.eq.true';
    case 'US':
      // USA buyers see: USA + Worldwide
      return 'ships_to_usa.eq.true,ships_to_worldwide.eq.true';
    case 'WW':
    default:
      // Worldwide only sees worldwide shippers
      return 'ships_to_worldwide.eq.true';
  }
}

/**
 * Validate and parse shipping region from cookie/string
 * Updated December 2025: Added UK support
 */
export function parseShippingRegion(value: string | undefined | null): ShippingRegion {
  if (!value) return 'BG'; // Default to Bulgaria
  const upper = value.toUpperCase();
  if (upper === 'BG' || upper === 'UK' || upper === 'EU' || upper === 'US' || upper === 'WW') {
    return upper as ShippingRegion;
  }
  // Handle GB -> UK mapping for backward compatibility
  if (upper === 'GB') {
    return 'UK';
  }
  return 'BG'; // Default fallback
}
