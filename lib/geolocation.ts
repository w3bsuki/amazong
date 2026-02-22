/**
 * Geolocation and Shipping Zone Utilities
 * 
 * This module provides utilities for:
 * - Country detection from IP headers
 * - Mapping countries to shipping zones
 * - Filtering products by shipping availability
 */

// Country code to display name mapping
const COUNTRY_NAMES: Record<string, string> = {
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
const COUNTRY_NAMES_BG: Record<string, string> = {
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

