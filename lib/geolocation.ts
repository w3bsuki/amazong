/**
 * Geolocation and Shipping Zone Utilities
 * 
 * This module provides utilities for:
 * - Country detection from IP headers
 * - Mapping countries to shipping zones
 * - Filtering products by shipping availability
 */

// Country code to display name mapping
export const COUNTRY_NAMES: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    ES: "Spain",
    IT: "Italy",
    JP: "Japan",
    CN: "China",
    IN: "India",
    BR: "Brazil",
    MX: "Mexico",
    RU: "Russia",
    ZA: "South Africa",
    BG: "Bulgaria",
    AT: "Austria",
    BE: "Belgium",
    HR: "Croatia",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DK: "Denmark",
    EE: "Estonia",
    FI: "Finland",
    GR: "Greece",
    HU: "Hungary",
    IE: "Ireland",
    LV: "Latvia",
    LT: "Lithuania",
    LU: "Luxembourg",
    MT: "Malta",
    NL: "Netherlands",
    PL: "Poland",
    PT: "Portugal",
    RO: "Romania",
    SK: "Slovakia",
    SI: "Slovenia",
    SE: "Sweden",
    CH: "Switzerland",
    NO: "Norway",
}

// Bulgarian names for countries
export const COUNTRY_NAMES_BG: Record<string, string> = {
    US: "САЩ",
    GB: "Великобритания",
    CA: "Канада",
    AU: "Австралия",
    DE: "Германия",
    FR: "Франция",
    ES: "Испания",
    IT: "Италия",
    JP: "Япония",
    CN: "Китай",
    IN: "Индия",
    BR: "Бразилия",
    MX: "Мексико",
    RU: "Русия",
    ZA: "Южна Африка",
    BG: "България",
    AT: "Австрия",
    BE: "Белгия",
    HR: "Хърватия",
    CY: "Кипър",
    CZ: "Чехия",
    DK: "Дания",
    EE: "Естония",
    FI: "Финландия",
    GR: "Гърция",
    HU: "Унгария",
    IE: "Ирландия",
    LV: "Латвия",
    LT: "Литва",
    LU: "Люксембург",
    MT: "Малта",
    NL: "Нидерландия",
    PL: "Полша",
    PT: "Португалия",
    RO: "Румъния",
    SK: "Словакия",
    SI: "Словения",
    SE: "Швеция",
    CH: "Швейцария",
    NO: "Норвегия",
}

// Shipping zone definitions
export const SHIPPING_ZONES = {
    BG: {
        code: 'BG',
        name: 'Bulgaria Only',
        name_bg: 'Само България',
        countries: ['BG'],
    },
    EU: {
        code: 'EU',
        name: 'Europe',
        name_bg: 'Европа',
        countries: [
            'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 
            'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 
            'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH', 'NO'
        ],
    },
    WW: {
        code: 'WW',
        name: 'Worldwide',
        name_bg: 'Целият свят',
        countries: [], // Empty means all countries
    },
} as const

export type ShippingZoneCode = keyof typeof SHIPPING_ZONES

// Map country codes to their shipping zones (what zone are they IN)
export const COUNTRY_TO_ZONE: Record<string, ShippingZoneCode> = {
    BG: 'BG',
    // EU countries
    AT: 'EU', BE: 'EU', HR: 'EU', CY: 'EU', CZ: 'EU', DK: 'EU', 
    EE: 'EU', FI: 'EU', FR: 'EU', DE: 'EU', GR: 'EU', HU: 'EU', 
    IE: 'EU', IT: 'EU', LV: 'EU', LT: 'EU', LU: 'EU', MT: 'EU', 
    NL: 'EU', PL: 'EU', PT: 'EU', RO: 'EU', SK: 'EU', SI: 'EU', 
    ES: 'EU', SE: 'EU', GB: 'EU', CH: 'EU', NO: 'EU',
}

/**
 * Get localized country name
 */
export function getCountryName(code: string, locale: string = 'en'): string {
    const upperCode = code.toUpperCase()
    if (locale === 'bg') {
        return COUNTRY_NAMES_BG[upperCode] || COUNTRY_NAMES[upperCode] || code
    }
    return COUNTRY_NAMES[upperCode] || code
}

/**
 * Get the shipping zone for a country
 * @returns The zone code (BG, EU, or WW)
 */
export function getZoneForCountry(countryCode: string): ShippingZoneCode {
    return COUNTRY_TO_ZONE[countryCode.toUpperCase()] || 'WW'
}

/**
 * Check if a product can ship to a user's country
 * 
 * Hierarchy:
 * - WW (Worldwide) ships to everyone
 * - EU ships to Bulgaria and Europe
 * - BG only ships to Bulgaria
 */
export function canShipTo(productZone: string, userCountryCode: string): boolean {
    const userZone = getZoneForCountry(userCountryCode)
    
    // Worldwide ships everywhere
    if (productZone === 'WW') return true
    
    // EU zone ships to EU countries and Bulgaria
    if (productZone === 'EU') {
        return userZone === 'EU' || userZone === 'BG'
    }
    
    // BG only ships to Bulgaria
    if (productZone === 'BG') {
        return userZone === 'BG'
    }
    
    return false
}

/**
 * Get compatible shipping zones for filtering products
 * 
 * For a user in Bulgaria: show BG, EU, and WW products
 * For a user in Germany: show EU and WW products  
 * For a user in USA: show only WW products
 */
export function getCompatibleZones(userCountryCode: string): ShippingZoneCode[] {
    const userZone = getZoneForCountry(userCountryCode)
    
    if (userZone === 'BG') {
        return ['BG', 'EU', 'WW'] // Bulgaria sees all products
    }
    
    if (userZone === 'EU') {
        return ['EU', 'WW'] // EU sees EU and Worldwide products
    }
    
    return ['WW'] // Rest of world sees only Worldwide products
}

/**
 * Build Supabase filter for shipping zones
 * @returns A comma-separated string for .in() filter
 */
export function getShippingZoneFilter(userCountryCode: string): string {
    const zones = getCompatibleZones(userCountryCode)
    return zones.join(',')
}

/**
 * Get shipping zone info for display
 */
export function getShippingZoneInfo(zoneCode: string, locale: string = 'en') {
    const zone = SHIPPING_ZONES[zoneCode as ShippingZoneCode]
    if (!zone) return { code: 'WW', name: 'Worldwide', name_bg: 'Целият свят' }
    
    return {
        code: zone.code,
        name: locale === 'bg' ? zone.name_bg : zone.name,
    }
}
