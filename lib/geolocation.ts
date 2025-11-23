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
    // Add more as needed
}

export function getCountryName(code: string): string {
    return COUNTRY_NAMES[code.toUpperCase()] || code
}
