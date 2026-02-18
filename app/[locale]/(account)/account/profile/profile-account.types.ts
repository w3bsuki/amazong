export interface ShippingRegionOption {
  value: string
  label: string
  labelBg: string
}

export const SHIPPING_REGIONS: ShippingRegionOption[] = [
  { value: "BG", label: "Bulgaria", labelBg: "България" },
  { value: "UK", label: "United Kingdom", labelBg: "Обединено кралство" },
  { value: "EU", label: "Europe", labelBg: "Европа" },
  { value: "US", label: "United States", labelBg: "САЩ" },
  { value: "WW", label: "Worldwide", labelBg: "Целият свят" },
]

// Format: boring-avatar:variant:paletteIndex:seed
// Variants: marble, pixel, sunset, ring, bauhaus
// Palettes: 0-5 (see lib/avatar-palettes.ts)
export const PRESET_AVATARS = [
  "boring-avatar:marble:0:Nova",
  "boring-avatar:sunset:2:Kai",
  "boring-avatar:bauhaus:3:Zoe",
  "boring-avatar:ring:4:Max",
  "boring-avatar:pixel:5:Luna",
  "boring-avatar:marble:1:Aria",
  "boring-avatar:sunset:4:Theo",
  "boring-avatar:ring:0:Riley",
] as const

export interface ProfileDataState {
  full_name: string
  phone: string
  shipping_region: string
  country_code: string
}

export interface PasswordDataState {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface EmailDataState {
  newEmail: string
}

export interface PasswordStrength {
  label: string
  color: string
  width: string
}
