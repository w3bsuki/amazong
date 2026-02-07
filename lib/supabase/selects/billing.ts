export const STRIPE_CUSTOMER_ID_SELECT = "stripe_customer_id" as const

export const ID_AND_STRIPE_CUSTOMER_ID_SELECT = "id,stripe_customer_id" as const

export const USER_PAYMENT_METHOD_VERIFICATION_SELECT =
  "id,user_id,stripe_payment_method_id,stripe_customer_id" as const
