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
      // Worldwide = no filter (show everything). Callers should NOT apply `.or()`.
      return '';
  }
}

/**
 * Validate and parse shipping region from cookie/string
 * Updated December 2025: Added UK support
 */
export function parseShippingRegion(value: string | undefined | null): ShippingRegion {
  if (!value) return 'WW'; // Default to Worldwide (show all)
  const upper = value.toUpperCase();
  if (upper === 'BG' || upper === 'UK' || upper === 'EU' || upper === 'US' || upper === 'WW') {
    return upper as ShippingRegion;
  }
  // Handle GB -> UK mapping for backward compatibility
  if (upper === 'GB') {
    return 'UK';
  }
  return 'WW'; // Default fallback
}
