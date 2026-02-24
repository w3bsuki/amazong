export type PlansContentCopy = {
  subscriptionActivated: string
  paymentCancelled: string
  cancelAtPeriodEnd: string
  genericError: string
  subscriptionReactivated: string
  freePlanInfo: string
  checkoutError: string
  portalError: string
  headerTitle: string
  headerDescription: string
  currentPlanPrefix: string
  cancelling: string
  accessEndsOn: (date: string) => string
  nextBilling: (date: string) => string
  cancellationWarning: string
  reactivate: string
  cancelSubscription: string
  cancelDialogTitle: string
  cancelDialogDescription: string
  accessExpiresOn: (date: string) => string
  resubscribeHint: string
  keepSubscription: string
  cancelConfirm: string
  processing: string
  paymentMethods: string
  freeTierHint: string
  monthly: string
  yearly: string
  boostTitle: string
  boostDescription: string
  boostBest: string
  boostFootnote: string
  contactPrefix: string
  contactUs: string
  days7: string
  days14: string
  days30: string
}

const PLANS_CONTENT_COPY_EN: PlansContentCopy = {
  subscriptionActivated: "Subscription activated successfully!",
  paymentCancelled: "Payment was cancelled",
  cancelAtPeriodEnd: "Subscription will be cancelled at the end of the billing period",
  genericError: "Error",
  subscriptionReactivated: "Subscription reactivated!",
  freePlanInfo: "This is a free plan",
  checkoutError: "Error creating payment. Please try again.",
  portalError: "Error opening portal. Please try again.",
  headerTitle: "Choose a Seller Plan",
  headerDescription: "Upgrade your account for lower fees and more features",
  currentPlanPrefix: "Current plan: ",
  cancelling: "Cancelling",
  accessEndsOn: (date) => `Access ends on ${date}`,
  nextBilling: (date) => `Next billing: ${date}`,
  cancellationWarning: "After this date, you'll be moved to the free plan. You can resubscribe anytime.",
  reactivate: "Reactivate",
  cancelSubscription: "Cancel Subscription",
  cancelDialogTitle: "Cancel Subscription",
  cancelDialogDescription:
    "Are you sure? Your subscription will remain active until the end of the current billing period.",
  accessExpiresOn: (date) => `Your access will expire on ${date}`,
  resubscribeHint: "You can resubscribe anytime to restore your access.",
  keepSubscription: "Keep Subscription",
  cancelConfirm: "Yes, Cancel",
  processing: "Processing...",
  paymentMethods: "Payment Methods",
  freeTierHint: "Upgrade your plan for lower fees and more listings",
  monthly: "Monthly",
  yearly: "Yearly",
  boostTitle: "Boost Your Listings",
  boostDescription: "Show your products to more people",
  boostBest: "Best",
  boostFootnote: 'Boosted listings appear in "Recommended" and rank higher in search.',
  contactPrefix: "Have questions? ",
  contactUs: "Contact us",
  days7: "7 days",
  days14: "14 days",
  days30: "30 days",
}

const PLANS_CONTENT_COPY_BG: PlansContentCopy = {
  subscriptionActivated: "Абонаментът е активиран успешно!",
  paymentCancelled: "Плащането беше отменено",
  cancelAtPeriodEnd: "Абонаментът ще бъде прекратен в края на периода",
  genericError: "Грешка",
  subscriptionReactivated: "Абонаментът е активиран отново!",
  freePlanInfo: "Това е безплатен план",
  checkoutError: "Грешка при създаване на плащане. Моля, опитайте отново.",
  portalError: "Грешка при отваряне на портала. Моля, опитайте отново.",
  headerTitle: "Изберете план за продавач",
  headerDescription: "Надградете акаунта си за по-ниски такси и повече възможности",
  currentPlanPrefix: "Текущ план: ",
  cancelling: "Отменен",
  accessEndsOn: (date) => `Достъпът приключва на ${date}`,
  nextBilling: (date) => `Следващо плащане: ${date}`,
  cancellationWarning:
    "След тази дата ще бъдете прехвърлени към безплатния план. Можете да се абонирате отново по всяко време.",
  reactivate: "Активирай отново",
  cancelSubscription: "Отмени абонамент",
  cancelDialogTitle: "Отмяна на абонамента",
  cancelDialogDescription:
    "Сигурни ли сте? Вашият абонамент ще остане активен до края на текущия период за плащане.",
  accessExpiresOn: (date) => `Достъпът ви ще изтече на ${date}`,
  resubscribeHint: "Можете да се абонирате отново по всяко време, за да възстановите достъпа си.",
  keepSubscription: "Откажи",
  cancelConfirm: "Да, отмени",
  processing: "Обработка...",
  paymentMethods: "Методи за плащане",
  freeTierHint: "Надградете плана си за по-ниски такси и повече обяви",
  monthly: "Месечно",
  yearly: "Годишно",
  boostTitle: "Промотирай обявите си",
  boostDescription: "Покажи продуктите си на повече хора",
  boostBest: "Най-добра",
  boostFootnote: 'Промотираните обяви се показват в секцията "Препоръчани" и имат по-високо позициониране.',
  contactPrefix: "Имате въпроси? ",
  contactUs: "Свържете се с нас",
  days7: "7 дни",
  days14: "14 дни",
  days30: "30 дни",
}

export function getPlansContentCopy(locale: string): PlansContentCopy {
  return locale === "bg" ? PLANS_CONTENT_COPY_BG : PLANS_CONTENT_COPY_EN
}
