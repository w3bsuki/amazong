import type { ChangeEvent } from "react"
import type { CartItem } from "@/components/providers/cart-context"
import type { useTranslations } from "next-intl"
import type { NewAddressForm, SavedAddress, ShippingMethod } from "./checkout-types"

export type TranslationFn = ReturnType<typeof useTranslations>

export type CheckoutNotice = {
  title: string
  description: string
  primaryAction: {
    label: string
    href: string
  }
  showSecondaryCartAction: boolean
}

type UpdateAddressHandler = (
  field: keyof NewAddressForm
) => (event: ChangeEvent<HTMLInputElement>) => void

type BlurFieldHandler = (field: keyof NewAddressForm) => () => void

export type CheckoutLayoutBaseProps = {
  t: TranslationFn
  tAuth: TranslationFn
  checkoutNotice: CheckoutNotice | null
  authLoginHref: string
  isAuthGateActive: boolean
  isAuthenticated: boolean
  isLoadingAddresses: boolean
  savedAddresses: SavedAddress[]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string | null) => void
  useNewAddress: boolean
  setUseNewAddress: (value: boolean) => void
  newAddress: NewAddressForm
  updateNewAddress: UpdateAddressHandler
  handleBlur: BlurFieldHandler
  errors: Partial<Record<keyof NewAddressForm, string>>
  touched: Partial<Record<keyof NewAddressForm, boolean>>
  shippingMethod: ShippingMethod
  setShippingMethod: (method: ShippingMethod) => void
  formatPrice: (price: number) => string
  items: CartItem[]
  totalItems: number
  subtotal: number
  shippingCost: number
  tax: number
  buyerProtectionFee: number
  total: number
  isProcessing: boolean
  canCheckout: boolean
  onCheckout: () => void
}

export type CheckoutLayoutVariant = "mobile" | "desktop"
