export type IssueType =
  | "not_received"
  | "wrong_item"
  | "damaged"
  | "not_as_described"
  | "missing_parts"
  | "other"

export type BuyerOrderActionsCopy = {
  confirmDelivery: string
  rateSeller: string
  ratedSeller: string
  chat: string
  cancelOrder: string
  reportIssue: string
  ratingTitle: string
  ratingDescription: string
  commentLabel: string
  commentPlaceholder: string
  submitRating: string
  cancel: string
  cancelTitle: string
  cancelDescription: string
  cancelReasonLabel: string
  cancelReasonPlaceholder: string
  confirmCancel: string
  issueTitle: string
  issueDescription: string
  issueTypeLabel: string
  issueTypePlaceholder: string
  issueDescLabel: string
  issueDescPlaceholder: string
  submitIssue: string
  submitting: string
  errors: {
    failedToConfirmDelivery: string
    failedToSubmitRating: string
    failedToCancelOrder: string
    failedToReportIssue: string
    unexpected: string
    issueTypeRequired: string
    issueDescriptionMinLength: string
  }
  toasts: {
    deliveryConfirmed: string
    feedbackSubmitted: string
    orderCancelled: string
    issueReported: string
  }
  issueTypes: Record<IssueType, string>
}

const BUYER_ORDER_ACTIONS_COPY_EN: BuyerOrderActionsCopy = {
  confirmDelivery: "Confirm Delivery",
  rateSeller: "Rate Seller",
  ratedSeller: "Rated",
  chat: "Chat",
  cancelOrder: "Cancel Order",
  reportIssue: "Report Issue",
  ratingTitle: "How would you rate the seller?",
  ratingDescription: "Your rating helps other buyers make informed decisions.",
  commentLabel: "Comment (optional)",
  commentPlaceholder: "Share your experience with this seller...",
  submitRating: "Submit Review",
  cancel: "Cancel",
  cancelTitle: "Cancel Order",
  cancelDescription: "Are you sure you want to cancel this order? This action cannot be undone.",
  cancelReasonLabel: "Reason for cancellation (optional)",
  cancelReasonPlaceholder: "Describe why you are cancelling...",
  confirmCancel: "Confirm Cancellation",
  issueTitle: "Report an Issue",
  issueDescription: "Describe the issue with your order and we will help.",
  issueTypeLabel: "Issue Type",
  issueTypePlaceholder: "Select issue type",
  issueDescLabel: "Description",
  issueDescPlaceholder: "Describe the issue in detail (minimum 10 characters)...",
  submitIssue: "Submit Report",
  submitting: "Submitting...",
  errors: {
    failedToConfirmDelivery: "Failed to confirm delivery",
    failedToSubmitRating: "Failed to submit rating",
    failedToCancelOrder: "Failed to cancel order",
    failedToReportIssue: "Failed to report issue",
    unexpected: "An unexpected error occurred",
    issueTypeRequired: "Please select an issue type",
    issueDescriptionMinLength: "Description must be at least 10 characters",
  },
  toasts: {
    deliveryConfirmed: "Delivery confirmed!",
    feedbackSubmitted: "Thank you for your feedback!",
    orderCancelled: "Order cancelled!",
    issueReported: "Issue reported!",
  },
  issueTypes: {
    not_received: "Item Not Received",
    wrong_item: "Wrong Item Received",
    damaged: "Item Damaged",
    not_as_described: "Not As Described",
    missing_parts: "Missing Parts",
    other: "Other",
  },
}

const BUYER_ORDER_ACTIONS_COPY_BG: BuyerOrderActionsCopy = {
  confirmDelivery: "Потвърди получаване",
  rateSeller: "Оцени продавача",
  ratedSeller: "Оценено",
  chat: "Чат",
  cancelOrder: "Отмени поръчка",
  reportIssue: "Докладвай проблем",
  ratingTitle: "Как бихте оценили продавача?",
  ratingDescription: "Вашата оценка помага на други купувачи да направят информиран избор.",
  commentLabel: "Коментар (по избор)",
  commentPlaceholder: "Споделете опита си с този продавач...",
  submitRating: "Изпрати отзив",
  cancel: "Отмени",
  cancelTitle: "Отмени поръчка",
  cancelDescription:
    "Сигурни ли сте, че искате да отмените тази поръчка? Това действие не може да бъде отменено.",
  cancelReasonLabel: "Причина за отмяна (по избор)",
  cancelReasonPlaceholder: "Опишете защо отменяте...",
  confirmCancel: "Потвърди отмяна",
  issueTitle: "Докладвай проблем",
  issueDescription: "Опишете проблема с поръчката си и ние ще помогнем.",
  issueTypeLabel: "Тип проблем",
  issueTypePlaceholder: "Изберете тип проблем",
  issueDescLabel: "Описание",
  issueDescPlaceholder: "Опишете проблема подробно (минимум 10 символа)...",
  submitIssue: "Изпрати доклад",
  submitting: "Изпращане...",
  errors: {
    failedToConfirmDelivery: "Неуспешно потвърждение на доставката",
    failedToSubmitRating: "Неуспешно изпращане на оценката",
    failedToCancelOrder: "Неуспешна отмяна на поръчката",
    failedToReportIssue: "Неуспешно докладване на проблема",
    unexpected: "Възникна неочаквана грешка",
    issueTypeRequired: "Моля, изберете тип проблем",
    issueDescriptionMinLength: "Описанието трябва да е поне 10 символа",
  },
  toasts: {
    deliveryConfirmed: "Доставката е потвърдена!",
    feedbackSubmitted: "Благодарим за отзива!",
    orderCancelled: "Поръчката е отменена!",
    issueReported: "Проблемът е докладван!",
  },
  issueTypes: {
    not_received: "Не е получено",
    wrong_item: "Грешен артикул",
    damaged: "Повреден артикул",
    not_as_described: "Не отговаря на описанието",
    missing_parts: "Липсващи части",
    other: "Друго",
  },
}

export function getBuyerOrderActionsCopy(locale: string): BuyerOrderActionsCopy {
  return locale === "bg" ? BUYER_ORDER_ACTIONS_COPY_BG : BUYER_ORDER_ACTIONS_COPY_EN
}
