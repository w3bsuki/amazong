export type UsernameAvailabilityErrorCode =
  | "INVALID_USERNAME"
  | "USERNAME_RESERVED"
  | "USERNAME_TAKEN"
  | "CHECK_FAILED"

export type UsernameAccountErrorCode =
  | "NOT_AUTHENTICATED"
  | "INVALID_USERNAME"
  | "USERNAME_RESERVED"
  | "USERNAME_COOLDOWN_ACTIVE"
  | "USERNAME_TAKEN"
  | "USERNAME_UPDATE_FAILED"
  | "INVALID_BUSINESS_DATA"
  | "ACCOUNT_UPGRADE_FAILED"
  | "ACTIVE_BUSINESS_SUBSCRIPTION"
  | "ACCOUNT_DOWNGRADE_FAILED"
  | "UNKNOWN_ERROR"

export type UsernameProfileErrorCode =
  | "NOT_AUTHENTICATED"
  | "INVALID_PROFILE_DATA"
  | "NO_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_FILE_TYPE"
  | "PUBLIC_PROFILE_UPDATE_FAILED"
  | "BANNER_UPLOAD_FAILED"
  | "BANNER_SAVE_FAILED"
  | "PROFILE_NOT_FOUND"
  | "UNKNOWN_ERROR"

export type PublicProfileEditorServerActions = {
  checkUsernameAvailability: (
    username: string
  ) => Promise<{ available: boolean; errorCode?: UsernameAvailabilityErrorCode }>
  setUsername: (username: string) => Promise<{
    success: boolean
    errorCode?: UsernameAccountErrorCode
    daysRemaining?: number
  }>
  updatePublicProfile: (data: {
    display_name?: string | null
    bio?: string | null
    location?: string | null
    website_url?: string | null
    social_links?: Record<string, string | null | undefined> | null
  }) => Promise<{ success: boolean; errorCode?: UsernameProfileErrorCode }>
  uploadBanner: (formData: FormData) => Promise<{
    success: boolean
    bannerUrl?: string
    errorCode?: UsernameProfileErrorCode
  }>
  upgradeToBusinessAccount: (data: {
    business_name: string
    vat_number?: string | null
    business_address?: Record<string, unknown> | null
    website_url?: string | null
    change_username?: boolean
    new_username?: string
  }) => Promise<{
    success: boolean
    errorCode?: UsernameAccountErrorCode
    daysRemaining?: number
  }>
  downgradeToPersonalAccount: () => Promise<{
    success: boolean
    errorCode?: UsernameAccountErrorCode
  }>
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
