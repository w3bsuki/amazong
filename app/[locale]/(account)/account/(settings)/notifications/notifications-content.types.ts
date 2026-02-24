import type { NotificationType } from "./notification-types"

export type NotificationPreferences = {
  in_app_purchase: boolean
  in_app_order_status: boolean
  in_app_message: boolean
  in_app_review: boolean
  in_app_system: boolean
  in_app_promotion: boolean
  email_purchase: boolean
  email_order_status: boolean
  email_message: boolean
  email_review: boolean
  email_system: boolean
  email_promotion: boolean
  push_enabled: boolean
}

export const DEFAULT_PREFS: NotificationPreferences = {
  in_app_purchase: true,
  in_app_order_status: true,
  in_app_message: true,
  in_app_review: true,
  in_app_system: true,
  in_app_promotion: true,
  email_purchase: false,
  email_order_status: false,
  email_message: false,
  email_review: false,
  email_system: false,
  email_promotion: false,
  push_enabled: false,
}

export const IN_APP_PREFERENCE_ROWS = [
  {
    titleKey: "rows.newSales.title",
    descriptionKey: "rows.newSales.description",
    prefKey: "in_app_purchase",
  },
  {
    titleKey: "rows.orderStatus.title",
    descriptionKey: "rows.orderStatus.description",
    prefKey: "in_app_order_status",
  },
  {
    titleKey: "rows.messages.title",
    descriptionKey: "rows.messages.description",
    prefKey: "in_app_message",
  },
  {
    titleKey: "rows.reviews.title",
    descriptionKey: "rows.reviews.description",
    prefKey: "in_app_review",
  },
  {
    titleKey: "rows.system.title",
    descriptionKey: "rows.system.description",
    prefKey: "in_app_system",
  },
  {
    titleKey: "rows.promotions.title",
    descriptionKey: "rows.promotions.description",
    prefKey: "in_app_promotion",
  },
] as const satisfies ReadonlyArray<{
  titleKey: string
  descriptionKey: string
  prefKey: keyof NotificationPreferences
}>

export const EMAIL_PREFERENCE_ROWS = [
  { titleKey: "rows.newSalesEmail", prefKey: "email_purchase" },
  { titleKey: "rows.orderStatusEmail", prefKey: "email_order_status" },
  { titleKey: "rows.messagesEmail", prefKey: "email_message" },
  { titleKey: "rows.reviewsEmail", prefKey: "email_review" },
  { titleKey: "rows.systemEmail", prefKey: "email_system" },
  { titleKey: "rows.promotionsEmail", prefKey: "email_promotion" },
] as const satisfies ReadonlyArray<{
  titleKey: string
  prefKey: keyof NotificationPreferences
}>

export function isInAppEnabled(prefs: NotificationPreferences, type: NotificationType) {
  switch (type) {
    case "purchase":
      return prefs.in_app_purchase
    case "order_status":
      return prefs.in_app_order_status
    case "message":
      return prefs.in_app_message
    case "review":
      return prefs.in_app_review
    case "system":
      return prefs.in_app_system
    case "promotion":
      return prefs.in_app_promotion
    default:
      return true
  }
}
