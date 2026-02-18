import type { useTranslations } from "next-intl"

type Translator = ReturnType<typeof useTranslations>

export type CheckoutErrorKind = "authRequired" | "ownProducts" | "generic" | null

export function getCheckoutErrorKind(errorMessage: string): CheckoutErrorKind {
  const normalized = errorMessage.trim()
  if (normalized === "Please sign in to checkout.") return "authRequired"
  if (normalized.startsWith("You cannot purchase your own products:")) return "ownProducts"
  return "generic"
}

export function buildCheckoutNotice({
  checkoutError,
  isAuthGateActive,
  authLoginHref,
  t,
  tAuth,
}: {
  checkoutError: CheckoutErrorKind
  isAuthGateActive: boolean
  authLoginHref: string
  t: Translator
  tAuth: Translator
}) {
  if (isAuthGateActive || checkoutError === "authRequired") {
    return {
      title: t("authRequiredTitle"),
      description: t("authRequiredDescription"),
      primaryAction: {
        label: tAuth("signIn"),
        href: authLoginHref,
      },
      showSecondaryCartAction: true,
    }
  }

  if (!checkoutError) return null

  if (checkoutError === "ownProducts") {
    return {
      title: t("ownProductsTitle"),
      description: t("ownProductsDescription"),
      primaryAction: {
        label: t("backToCart"),
        href: "/cart",
      },
      showSecondaryCartAction: false,
    }
  }

  return {
    title: t("checkoutErrorTitle"),
    description: t("checkoutError"),
    primaryAction: {
      label: t("backToCart"),
      href: "/cart",
    },
    showSecondaryCartAction: false,
  }
}

