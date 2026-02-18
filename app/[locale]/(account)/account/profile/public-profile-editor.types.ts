export type PublicProfileEditorServerActions = {
  checkUsernameAvailability: (
    username: string
  ) => Promise<{ available: boolean; error?: string }>
  setUsername: (username: string) => Promise<{ success: boolean; error?: string }>
  updatePublicProfile: (data: {
    display_name?: string | null
    bio?: string | null
    location?: string | null
    website_url?: string | null
    social_links?: Record<string, string | null | undefined> | null
  }) => Promise<{ success: boolean; error?: string }>
  uploadBanner: (formData: FormData) => Promise<{
    success: boolean
    bannerUrl?: string
    error?: string
  }>
  upgradeToBusinessAccount: (data: {
    business_name: string
    vat_number?: string | null
    business_address?: Record<string, unknown> | null
    website_url?: string | null
    change_username?: boolean
    new_username?: string
  }) => Promise<{ success: boolean; error?: string }>
  downgradeToPersonalAccount: () => Promise<{ success: boolean; error?: string }>
  getUsernameChangeCooldown: () => Promise<{
    canChange: boolean
    daysRemaining?: number
  }>
}

export interface PublicProfileRecord {
  id: string
  username: string | null
  display_name: string | null
  bio: string | null
  banner_url: string | null
  location: string | null
  website_url: string | null
  social_links: Record<string, string> | null
  account_type: "personal" | "business" | null
  is_seller: boolean
  verified_business: boolean
  business_name: string | null
  vat_number: string | null
  last_username_change: string | null
}

export interface ProfileDataState {
  display_name: string
  bio: string
  location: string
  website_url: string
  social_links: {
    facebook: string
    instagram: string
    twitter: string
    tiktok: string
  }
}

export interface BusinessDataState {
  business_name: string
  vat_number: string
  change_username: boolean
  new_username: string
}
