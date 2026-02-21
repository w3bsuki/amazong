"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { SellingProductsDesktopList } from "./selling-products-desktop-list"
import { SellingProductsDiscountDialog } from "./selling-products-discount-dialog"
import { SellingProductsMobileList } from "./selling-products-mobile-list"
import type { BoostTimeLeft, SellingProduct, SellingProductsListProps } from "./selling-products-list.types"

export type { SellingProductsListServerActions } from "./selling-products-list.types"

export function SellingProductsList({ products, sellerUsername, locale, actions }: SellingProductsListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tBoost = useTranslations("Boost")
  const t = useTranslations("SellingProducts")

  const [productsList, setProductsList] = useState<SellingProduct[]>(products)
  const boostActivationTimerRef = useRef<number | null>(null)
  const boostActivationProductIdRef = useRef<string | null>(null)
  const boostActivationAttemptsRef = useRef(0)

  const [, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [discountProductId, setDiscountProductId] = useState<string | null>(null)
  const [discountPrice, setDiscountPrice] = useState("")
  const [discountingId, setDiscountingId] = useState<string | null>(null)

  const activeDiscountProduct = discountProductId
    ? productsList.find((product) => product.id === discountProductId) || null
    : null

  useEffect(() => {
    setProductsList(products)
  }, [products])

  useEffect(() => {
    return () => {
      if (boostActivationTimerRef.current != null) {
        window.clearInterval(boostActivationTimerRef.current)
        boostActivationTimerRef.current = null
      }
    }
  }, [])

  const handleDelete = async (productId: string) => {
    setDeletingId(productId)
    startTransition(async () => {
      const result = await actions.deleteProduct(productId)
      if (result.success) {
        toast.success(t("deleteSuccess"))
        setProductsList((prev) => prev.filter((product) => product.id !== productId))
        router.refresh()
      } else {
        toast.error(result.error || t("deleteError"))
      }
      setDeletingId(null)
    })
  }

  const handleToggleStatus = async (productId: string, currentStatus?: string) => {
    setTogglingId(productId)
    const newStatus = currentStatus === "active" ? "draft" : "active"

    startTransition(async () => {
      const result = await actions.bulkUpdateProductStatus([productId], newStatus)
      if (result.success) {
        toast.success(newStatus === "draft" ? t("pauseSuccess") : t("activateSuccess"))
        setProductsList((prev) =>
          prev.map((product) => (product.id === productId ? { ...product, status: newStatus } : product))
        )
        router.refresh()
      } else {
        toast.error(result.error || t("updateError"))
      }
      setTogglingId(null)
    })
  }

  useEffect(() => {
    const isSuccess = searchParams.get("boost_success") === "true"
    const isCanceled = searchParams.get("boost_canceled") === "true"

    if (!isSuccess && !isCanceled) return

    const productId = searchParams.get("product_id")

    if (isSuccess) {
      toast.success(tBoost("paymentSuccess"))
    } else if (isCanceled) {
      toast.info(tBoost("paymentCanceled"))
    }

    window.history.replaceState({}, "", window.location.pathname)

    if (!isSuccess || !productId) return

    boostActivationProductIdRef.current = productId
    boostActivationAttemptsRef.current = 0

    if (boostActivationTimerRef.current != null) {
      window.clearInterval(boostActivationTimerRef.current)
      boostActivationTimerRef.current = null
    }

    boostActivationTimerRef.current = window.setInterval(() => {
      boostActivationAttemptsRef.current += 1
      router.refresh()

      if (boostActivationAttemptsRef.current >= 6) {
        window.clearInterval(boostActivationTimerRef.current as number)
        boostActivationTimerRef.current = null
        boostActivationProductIdRef.current = null
        toast.info(tBoost("activationTakingLonger"))
      }
    }, 1500)
  }, [searchParams, router, tBoost])

  useEffect(() => {
    const productId = boostActivationProductIdRef.current
    if (!productId) return

    const target = productsList.find((product) => product.id === productId)
    const isActive =
      Boolean(target?.is_boosted) &&
      !!target?.boost_expires_at &&
      new Date(target.boost_expires_at).getTime() > Date.now()

    if (!isActive) return

    if (boostActivationTimerRef.current != null) {
      window.clearInterval(boostActivationTimerRef.current)
      boostActivationTimerRef.current = null
    }

    boostActivationProductIdRef.current = null
    toast.success(tBoost("activationComplete"))
  }, [productsList, tBoost])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }

  const getSalePercentForDisplay = (product: SellingProduct) => {
    const percent = Number(product.sale_percent || 0)
    if (percent > 0) return Math.round(percent)

    if (product.list_price && product.list_price > product.price) {
      return Math.round(((product.list_price - product.price) / product.list_price) * 100)
    }
    return 0
  }

  const isSaleActive = (product: SellingProduct) => {
    const truth = Boolean(product.is_on_sale) && (Number(product.sale_percent) || 0) > 0
    if (!truth) return false
    if (!product.sale_end_date) return true

    const date = new Date(product.sale_end_date)
    if (Number.isNaN(date.getTime())) return true
    return date.getTime() > Date.now()
  }

  const openDiscountDialog = (product: SellingProduct) => {
    setDiscountProductId(product.id)
    setDiscountPrice(String(Number(product.price)))
  }

  const closeDiscountDialog = () => {
    setDiscountProductId(null)
    setDiscountPrice("")
  }

  const handleApplyDiscount = async () => {
    if (!activeDiscountProduct) return

    const newPrice = Number(discountPrice)
    if (!Number.isFinite(newPrice) || newPrice <= 0) {
      toast.error(t("invalidPrice"))
      return
    }

    const base =
      activeDiscountProduct.list_price && activeDiscountProduct.list_price > activeDiscountProduct.price
        ? Number(activeDiscountProduct.list_price)
        : Number(activeDiscountProduct.price)

    if (!(newPrice < base)) {
      toast.error(t("priceMustBeLower"))
      return
    }

    setDiscountingId(activeDiscountProduct.id)
    startTransition(async () => {
      const result = await actions.setProductDiscountPrice(activeDiscountProduct.id, newPrice)
      if (result.success) {
        toast.success(t("discountSaved"))

        setProductsList((prev) =>
          prev.map((product) => {
            if (product.id !== activeDiscountProduct.id) return product

            const wasDiscounted = product.list_price != null && Number(product.list_price) > Number(product.price)
            const nextListPrice = wasDiscounted ? Number(product.list_price) : Number(product.price)
            return {
              ...product,
              price: newPrice,
              list_price: nextListPrice,
            }
          })
        )

        router.refresh()
        closeDiscountDialog()
      } else {
        toast.error(result.error || t("discountSaveError"))
      }
      setDiscountingId(null)
    })
  }

  const handleClearDiscount = async () => {
    if (!activeDiscountProduct) return

    setDiscountingId(activeDiscountProduct.id)
    startTransition(async () => {
      const result = await actions.clearProductDiscount(activeDiscountProduct.id)
      if (result.success) {
        toast.success(t("discountRemoved"))
        setProductsList((prev) =>
          prev.map((product) => {
            if (product.id !== activeDiscountProduct.id) return product
            if (product.list_price == null) return product
            return {
              ...product,
              price: Number(product.list_price),
              list_price: null,
            }
          })
        )
        router.refresh()
        closeDiscountDialog()
      } else {
        toast.error(result.error || t("discountRemoveError"))
      }
      setDiscountingId(null)
    })
  }

  const isBoostActive = (product: SellingProduct) => {
    if (!product.is_boosted || !product.boost_expires_at) return false
    return new Date(product.boost_expires_at) > new Date()
  }

  const isBoostExpired = (product: SellingProduct) => {
    if (!product.is_boosted || !product.boost_expires_at) return false
    return new Date(product.boost_expires_at) <= new Date()
  }

  const getBoostTimeLeft = (product: SellingProduct): BoostTimeLeft | null => {
    if (!product.boost_expires_at) return null
    const expiresAt = new Date(product.boost_expires_at)
    const now = new Date()
    const diffMs = expiresAt.getTime() - now.getTime()
    if (diffMs <= 0) return null

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return { days, hours }
  }

  const formatBoostExpiry = (dateStr: string) => {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(dateStr))
  }

  if (productsList.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="size-16 sm:size-20 rounded-full mx-auto flex items-center justify-center mb-4 bg-muted border border-border">
          <Package className="size-8 sm:size-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{t("noProductsTitle")}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{t("noProductsDesc")}</p>
        <Button asChild className="rounded-full">
          <Link href="/sell">
            <Plus className="size-4 mr-2" />
            {t("createListing")}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <SellingProductsMobileList
        products={productsList}
        sellerUsername={sellerUsername}
        locale={locale}
        formatCurrency={formatCurrency}
        t={t}
        tBoost={tBoost}
        isBoostActive={isBoostActive}
        isBoostExpired={isBoostExpired}
        getBoostTimeLeft={getBoostTimeLeft}
        isSaleActive={isSaleActive}
        getSalePercentForDisplay={getSalePercentForDisplay}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      <SellingProductsDesktopList
        products={productsList}
        sellerUsername={sellerUsername}
        locale={locale}
        formatCurrency={formatCurrency}
        t={t}
        tBoost={tBoost}
        isBoostActive={isBoostActive}
        isBoostExpired={isBoostExpired}
        getBoostTimeLeft={getBoostTimeLeft}
        isSaleActive={isSaleActive}
        getSalePercentForDisplay={getSalePercentForDisplay}
        formatBoostExpiry={formatBoostExpiry}
        openDiscountDialog={openDiscountDialog}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        togglingId={togglingId}
        deletingId={deletingId}
      />

      <SellingProductsDiscountDialog
        open={!!discountProductId}
        locale={locale}
        t={t}
        activeDiscountProduct={activeDiscountProduct}
        discountPrice={discountPrice}
        onDiscountPriceChange={setDiscountPrice}
        discountingId={discountingId}
        formatCurrency={formatCurrency}
        onClose={closeDiscountDialog}
        onOpenChange={(open) => {
          if (!open) closeDiscountDialog()
        }}
        onApply={handleApplyDiscount}
        onClear={handleClearDiscount}
      />
    </>
  )
}
