import type { PublicProfileEditorServerActions } from "./public-profile-editor"
import type { Envelope } from "@/lib/api/envelope"

type ProfileActionErrorCode =
  | "NOT_AUTHENTICATED"
  | "INVALID_INPUT"
  | "INVALID_EMAIL"
  | "EMAIL_UNCHANGED"
  | "EMAIL_ALREADY_REGISTERED"
  | "PROFILE_UPDATE_FAILED"
  | "EMAIL_UPDATE_FAILED"
  | "PASSWORD_UPDATE_UNAVAILABLE"
  | "CURRENT_PASSWORD_INCORRECT"
  | "PASSWORD_UPDATE_FAILED"
  | "NO_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_FILE_TYPE"
  | "AVATAR_UPLOAD_FAILED"
  | "AVATAR_PROFILE_UPDATE_FAILED"
  | "AVATAR_UPDATE_FAILED"
  | "AVATAR_RESET_FAILED"
  | "UNKNOWN_ERROR"

export type ProfileContentServerActions = {
  updateProfile: (formData: FormData) => Promise<Envelope<Record<string, never>, { errorCode: ProfileActionErrorCode }>>
  uploadAvatar: (formData: FormData) => Promise<Envelope<{ avatarUrl: string }, { errorCode: ProfileActionErrorCode }>>
  deleteAvatar: () => Promise<Envelope<{ avatarUrl: string }, { errorCode: ProfileActionErrorCode }>>
  setAvatarUrl: (formData: FormData) => Promise<Envelope<{ avatarUrl: string }, { errorCode: ProfileActionErrorCode }>>
  updateEmail: (formData: FormData) => Promise<Envelope<Record<string, never>, { errorCode: ProfileActionErrorCode }>>
  updatePassword: (formData: FormData) => Promise<Envelope<Record<string, never>, { errorCode: ProfileActionErrorCode }>>
}

export interface ProfileContentProps {
  locale: string
  profile: {
    id: string
    email: string | null
    full_name: string | null
    avatar_url: string | null
    phone: string | null
    shipping_region: string | null
    country_code: string | null
    role: string | null
    created_at: string | null
    username: string | null
    display_name: string | null
    bio: string | null
    banner_url: string | null
    location: string | null
    website_url: string | null
    social_links: Record<string, string> | null
    account_type: string | null
    is_seller: boolean | null
    is_verified_business: boolean | null
    business_name: string | null
    vat_number: string | null
    last_username_change: string | null
    tier?: string | null
  }
  profileActions: ProfileContentServerActions
  publicProfileActions: PublicProfileEditorServerActions
}

export type { ProfileActionErrorCode }
