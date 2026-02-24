import type { ProfileActionErrorCode } from "./profile-content.types"

export function getProfileErrorMessage(
  tProfile: (key: string) => string,
  errorCode?: ProfileActionErrorCode
): string {
  switch (errorCode) {
    case "NOT_AUTHENTICATED":
      return tProfile("errors.profile.NOT_AUTHENTICATED")
    case "INVALID_INPUT":
      return tProfile("errors.profile.INVALID_INPUT")
    case "INVALID_EMAIL":
      return tProfile("errors.profile.INVALID_EMAIL")
    case "EMAIL_UNCHANGED":
      return tProfile("errors.profile.EMAIL_UNCHANGED")
    case "EMAIL_ALREADY_REGISTERED":
      return tProfile("errors.profile.EMAIL_ALREADY_REGISTERED")
    case "PROFILE_UPDATE_FAILED":
      return tProfile("errors.profile.PROFILE_UPDATE_FAILED")
    case "EMAIL_UPDATE_FAILED":
      return tProfile("errors.profile.EMAIL_UPDATE_FAILED")
    case "PASSWORD_UPDATE_UNAVAILABLE":
      return tProfile("errors.profile.PASSWORD_UPDATE_UNAVAILABLE")
    case "CURRENT_PASSWORD_INCORRECT":
      return tProfile("errors.profile.CURRENT_PASSWORD_INCORRECT")
    case "PASSWORD_UPDATE_FAILED":
      return tProfile("errors.profile.PASSWORD_UPDATE_FAILED")
    case "NO_FILE":
      return tProfile("errors.profile.NO_FILE")
    case "FILE_TOO_LARGE":
      return tProfile("errors.profile.FILE_TOO_LARGE")
    case "INVALID_FILE_TYPE":
      return tProfile("errors.profile.INVALID_FILE_TYPE")
    case "AVATAR_UPLOAD_FAILED":
      return tProfile("errors.profile.AVATAR_UPLOAD_FAILED")
    case "AVATAR_PROFILE_UPDATE_FAILED":
      return tProfile("errors.profile.AVATAR_PROFILE_UPDATE_FAILED")
    case "AVATAR_UPDATE_FAILED":
      return tProfile("errors.profile.AVATAR_UPDATE_FAILED")
    case "AVATAR_RESET_FAILED":
      return tProfile("errors.profile.AVATAR_RESET_FAILED")
    case "UNKNOWN_ERROR":
    default:
      return tProfile("errors.profile.UNKNOWN_ERROR")
  }
}
