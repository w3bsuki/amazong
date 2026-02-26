import type { Envelope } from "@/lib/api/envelope"

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

export type CheckUsernameAvailabilityResult = Envelope<
  { available: boolean },
  { available: boolean; errorCode: UsernameAvailabilityErrorCode }
>

export type UsernameAccountResult = Envelope<
  Record<string, never>,
  { errorCode: UsernameAccountErrorCode; daysRemaining?: number }
>

export type UpdatePublicProfileResult = Envelope<
  Record<string, never>,
  { errorCode: UsernameProfileErrorCode }
>

export type UploadBannerResult = Envelope<
  { bannerUrl: string },
  { errorCode: UsernameProfileErrorCode }
>

export type UsernameChangeCooldownResult = Envelope<
  { canChange: boolean; daysRemaining?: number },
  { canChange: boolean; error: string }
>

export type PublicProfileEditorServerActions = {
  checkUsernameAvailability: (
    username: string
  ) => Promise<CheckUsernameAvailabilityResult>
  setUsername: (username: string) => Promise<UsernameAccountResult>
  updatePublicProfile: (data: {
    display_name?: string | null
    bio?: string | null
    location?: string | null
    website_url?: string | null
    social_links?: Record<string, string | null | undefined> | null
  }) => Promise<UpdatePublicProfileResult>
  uploadBanner: (formData: FormData) => Promise<UploadBannerResult>
  upgradeToBusinessAccount: (data: {
    business_name: string
    vat_number?: string | null
    business_address?: Record<string, unknown> | null
    website_url?: string | null
    change_username?: boolean
    new_username?: string
  }) => Promise<UsernameAccountResult>
  downgradeToPersonalAccount: () => Promise<UsernameAccountResult>
  getUsernameChangeCooldown: () => Promise<UsernameChangeCooldownResult>
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
