"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Package,
  Eye,
  Pencil,
  Star,
  Tag,
  Lightning,
  Trash,
  Pause,
  Play,
} from "@phosphor-icons/react"
import { BoostDialog } from "./_components/boost-dialog"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type SellingProductsListServerActions = {
  deleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>
  bulkUpdateProductStatus: (
    productIds: string[],
    status: "active" | "draft" | "archived" | "out_of_stock"
  ) => Promise<{ success: boolean; error?: string }>
  setProductDiscountPrice: (
    productId: string,
    newPrice: number
  ) => Promise<{ success: boolean; error?: string }>
  clearProductDiscount: (productId: string) => Promise<{ success: boolean; error?: string }>
}


interface Product {
  id: string
  title: string
  description: string | null
  price: number
  list_price: number | null
  is_on_sale: boolean | null
  sale_percent: number | null
  sale_end_date: string | null
  stock: number
  images: string[]
  rating: number | null
  review_count: number | null
  created_at: string
  is_boosted: boolean
  boost_expires_at: string | null
  status?: 'active' | 'draft' | 'archived' | 'out_of_stock'
  category?: {
    name: string
    slug: string
  } | null
}

interface SellingProductsListProps {
  products: Product[]
  locale: string
  actions: SellingProductsListServerActions
}

export function SellingProductsList({ products, locale, actions }: SellingProductsListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tBoost = useTranslations("Boost")
  const t = useTranslations("SellingProducts")
  const [productsList, setProductsList] = useState(products)
  const boostActivationTimerRef = useRef<number | null>(null)
  const boostActivationProductIdRef = useRef<string | null>(null)
  const boostActivationAttemptsRef = useRef(0)
  const [_isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [discountProductId, setDiscountProductId] = useState<string | null>(null)
  const [discountPrice, setDiscountPrice] = useState<string>("")
  const [discountingId, setDiscountingId] = useState<string | null>(null)

  const activeDiscountProduct = discountProductId
    ? productsList.find((p) => p.id === discountProductId) || null
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

  // Handle delete product
  const handleDelete = async (productId: string) => {
    setDeletingId(productId)
    startTransition(async () => {
      const result = await actions.deleteProduct(productId)
      if (result.success) {
        toast.success(t('deleteSuccess'))
        setProductsList(prev => prev.filter(p => p.id !== productId))
        router.refresh()
      } else {
        toast.error(result.error || t('deleteError'))
      }
      setDeletingId(null)
    })
  }

  // Handle pause/unpause (draft/active toggle)
  const handleToggleStatus = async (productId: string, currentStatus?: string) => {
    setTogglingId(productId)
    const newStatus = currentStatus === 'active' ? 'draft' : 'active'
    startTransition(async () => {
      const result = await actions.bulkUpdateProductStatus([productId], newStatus)
      if (result.success) {
        toast.success(
          newStatus === 'draft' ? t('pauseSuccess') : t('activateSuccess')      
        )
        setProductsList(prev => prev.map(p =>
          p.id === productId ? { ...p, status: newStatus } : p
        ))
        router.refresh()
      } else {
        toast.error(result.error || t('updateError'))
      }
      setTogglingId(null)
    })
  }

  // Handle boost success/cancel URL params
  useEffect(() => {
    const isSuccess = searchParams.get('boost_success') === 'true'
    const isCanceled = searchParams.get('boost_canceled') === 'true'

    if (!isSuccess && !isCanceled) return

    const productId = searchParams.get("product_id")

    if (isSuccess) {
      toast.success(tBoost('paymentSuccess'))
    } else if (isCanceled) {
      toast.info(tBoost('paymentCanceled'))
    }

    // Clean up URL (avoid double-toasts on refresh)
    window.history.replaceState({}, '', window.location.pathname)

    if (!isSuccess || !productId) return

    // Poll for webhook activation (best-effort) by refreshing server props a few times.
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

    const target = productsList.find((p) => p.id === productId)
    const isActive = Boolean(target?.is_boosted) && !!target?.boost_expires_at && new Date(target.boost_expires_at).getTime() > Date.now()

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
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }

  const getSalePercentForDisplay = (product: Product) => {
    const percent = Number(product.sale_percent || 0)
    if (percent > 0) return Math.round(percent)

    if (product.list_price && product.list_price > product.price) {
      return Math.round(((product.list_price - product.price) / product.list_price) * 100)
    }
    return 0
  }

  const isSaleActive = (product: Product) => {
    const truth = Boolean(product.is_on_sale) && (Number(product.sale_percent) || 0) > 0
    if (!truth) return false
    if (!product.sale_end_date) return true
    const d = new Date(product.sale_end_date)
    if (Number.isNaN(d.getTime())) return true
    return d.getTime() > Date.now()
  }

  const openDiscountDialog = (product: Product) => {
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
      toast.error(t('invalidPrice'))
      return
    }

    const base = (activeDiscountProduct.list_price && activeDiscountProduct.list_price > activeDiscountProduct.price)
      ? Number(activeDiscountProduct.list_price)
      : Number(activeDiscountProduct.price)

    if (!(newPrice < base)) {
      toast.error(t('priceMustBeLower'))
      return
    }

    setDiscountingId(activeDiscountProduct.id)
    startTransition(async () => {
      const result = await actions.setProductDiscountPrice(activeDiscountProduct.id, newPrice)
      if (result.success) {
        toast.success(t('discountSaved'))

        setProductsList((prev) =>
          prev.map((p) => {
            if (p.id !== activeDiscountProduct.id) return p

            const wasDiscounted = p.list_price != null && Number(p.list_price) > Number(p.price)
            const nextListPrice = wasDiscounted ? Number(p.list_price) : Number(p.price)
            return {
              ...p,
              price: newPrice,
              list_price: nextListPrice,
            }
          })
        )
        router.refresh()
        closeDiscountDialog()
      } else {
        toast.error(result.error || t('discountSaveError'))
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
        toast.success(t('discountRemoved'))
        setProductsList((prev) =>
          prev.map((p) => {
            if (p.id !== activeDiscountProduct.id) return p
            if (p.list_price == null) return p
            return {
              ...p,
              price: Number(p.list_price),
              list_price: null,
            }
          })
        )
        router.refresh()
        closeDiscountDialog()
      } else {
        toast.error(result.error || t('discountRemoveError'))
      }
      setDiscountingId(null)
    })
  }

  // Check if boost is active (not expired)
  const isBoostActive = (product: Product) => {
    if (!product.is_boosted || !product.boost_expires_at) return false
    return new Date(product.boost_expires_at) > new Date()
  }

  // Check if there was a boost that has now expired (allow re-boost)
  const isBoostExpired = (product: Product) => {
    if (!product.is_boosted || !product.boost_expires_at) return false
    return new Date(product.boost_expires_at) <= new Date()
  }

  // Get days and hours left for active boost
  const getBoostTimeLeft = (product: Product) => {
    if (!product.boost_expires_at) return null
    const expiresAt = new Date(product.boost_expires_at)
    const now = new Date()
    const diffMs = expiresAt.getTime() - now.getTime()
    if (diffMs <= 0) return null
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return { days, hours }
  }

  // Format boost expiration date for display
  const formatBoostExpiry = (dateStr: string) => {
    return new Intl.DateTimeFormat(locale, { 
      dateStyle: 'short', 
      timeStyle: 'short' 
    }).format(new Date(dateStr))
  }

  // Legacy helper for backwards compatibility
  const getBoostDaysLeft = (product: Product) => {
    const timeLeft = getBoostTimeLeft(product)
    return timeLeft?.days ?? 0
  }

  if (productsList.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="size-16 sm:size-20 rounded-full mx-auto flex items-center justify-center mb-4 bg-muted border border-border">
          <Package weight="duotone" className="size-8 sm:size-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('noProductsTitle')}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          {t('noProductsDesc')}
        </p>
        <Button asChild className="rounded-full">
          <Link href="/sell">
            <Plus weight="bold" className="size-4 mr-2" />
            {t('createListing')}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile: Card-style list */}
      <div className="space-y-3 md:hidden">
        {productsList.map((product) => {
          const boosted = isBoostActive(product)
          const boostExpired = isBoostExpired(product)
          const timeLeft = getBoostTimeLeft(product)
          const saleActive = isSaleActive(product)
          const salePercent = getSalePercentForDisplay(product)

          return (
            <div
              key={product.id}
              className={`flex items-start gap-3 p-3 rounded-md bg-card border border-border ${boosted ? 'ring-2 ring-selected-border border-selected-border' : ''
                }`}
            >
              {/* Product Image */}
              <div className="relative size-20 rounded-md overflow-hidden bg-card border border-border shrink-0">
                {product.images?.[0] && product.images[0].startsWith('http') ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="size-8 text-muted-foreground/40" weight="duotone" />
                  </div>
                )}
                {boosted && (
                  <div className="absolute top-1.5 left-1.5">
                    <Badge className="bg-primary text-primary-foreground text-2xs px-1.5 py-0.5 gap-0.5 shadow-sm">
                      <Lightning className="size-2.5" weight="fill" />
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${product.id}`}
                      className="font-medium text-foreground hover:text-primary line-clamp-1 text-sm"
                    >
                      {product.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-semibold ${saleActive ? 'text-deal' : 'text-foreground'}`}>
                        {formatCurrency(Number(product.price))}
                      </span>
                      {saleActive && salePercent > 0 && (
                        <Badge variant="secondary" className="bg-deal/10 text-deal border-0 text-2xs px-1.5 py-0">
                          <Tag weight="fill" className="size-2.5 mr-0.5" />
                          -{salePercent}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span className={product.stock < 5 && product.stock > 0 ? "text-warning font-medium" : product.stock === 0 ? "text-destructive font-medium" : ""}>
                        {product.stock === 0
                          ? t('outOfStock')
                          : t('inStock', { count: product.stock })
                        }
                      </span>
                      {boosted && timeLeft && (
                        <Badge variant="secondary" className="bg-selected text-primary border-0 text-2xs px-1.5 py-0">
                          <Lightning weight="fill" className="size-2.5 mr-0.5" />
                          {tBoost('timeLeft', { days: timeLeft.days, hours: timeLeft.hours })}
                        </Badge>
                      )}
                      {boostExpired && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-2xs px-1.5 py-0">
                          {tBoost('boostExpired')}
                        </Badge>
                      )}
                    </div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="flex text-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            weight={i < Math.floor(product.rating || 0) ? "fill" : "regular"}
                            className="text-rating"
                          />
                        ))}
                      </div>
                      <span className="text-2xs text-muted-foreground">
                        ({product.review_count || 0})
                      </span>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => openDiscountDialog(product)}
                      title={t('discountTooltip')}
                    >
                      <Tag className="size-4" weight="bold" />
                    </Button>
                    {/* Show boost dialog if not currently boosted OR if boost expired (re-boost) */}
                    {(!boosted) && (
                      <BoostDialog
                        product={product}
                        locale={locale}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`size-8 ${boostExpired ? 'text-muted-foreground hover:text-primary' : 'text-primary'} hover:bg-hover`}
                            title={boostExpired ? tBoost('reboost') : tBoost('trigger')}
                          >
                            <Lightning className="size-4" weight="bold" />
                          </Button>
                        }
                      />
                    )}
                    {/* Pause/Unpause button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => handleToggleStatus(product.id, product.status)}
                      disabled={togglingId === product.id}
                    >
                      {product.status === 'draft' ? (
                        <Play className="size-4 text-success" weight="fill" />
                      ) : (
                        <Pause className="size-4 text-warning" weight="fill" />
                      )}
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="size-8">
                      <Link href={`/account/selling/edit?id=${product.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    {/* Delete button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:bg-destructive/10"
                          disabled={deletingId === product.id}
                        >
                          <Trash className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t('deleteDialogTitle')}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('deleteDialogDesc', { title: product.title })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t('cancelButton')}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t('deleteButton')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop: Table-like list */}
      <div className="hidden md:block divide-y divide-border">
        {productsList.map((product) => {
          const boosted = isBoostActive(product)
          const boostExpired = isBoostExpired(product)
          const timeLeft = getBoostTimeLeft(product)
          const saleActive = isSaleActive(product)
          const salePercent = getSalePercentForDisplay(product)

          return (
            <div
              key={product.id}
              className={`flex items-center gap-4 p-4 hover:bg-hover transition-colors ${boosted ? 'bg-selected' : ''
                }`}
            >
              {/* Product Image */}
              <div className="relative size-16 rounded-md overflow-hidden bg-card border border-border shrink-0">
                {product.images?.[0] && product.images[0].startsWith('http') ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="size-6 text-muted-foreground/40" weight="duotone" />
                  </div>
                )}
                {boosted && (
                  <div className="absolute top-1 left-1">
                    <Badge className="bg-primary text-primary-foreground text-2xs px-1 py-0 gap-0.5">
                      <Lightning className="size-2.5" weight="fill" />
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/product/${product.id}`}
                    className="font-medium text-foreground hover:text-primary line-clamp-1"
                  >
                    {product.title}
                  </Link>
                  {saleActive && salePercent > 0 && (
                    <Badge variant="secondary" className="bg-deal/10 text-deal border-0 text-xs shrink-0">
                      <Tag weight="fill" className="size-3 mr-0.5" />
                      -{salePercent}%
                    </Badge>
                  )}
                  {boosted && timeLeft && (
                    <Badge variant="secondary" className="bg-selected text-primary border-0 text-xs shrink-0" title={product.boost_expires_at ? tBoost('boostActiveUntil', { date: formatBoostExpiry(product.boost_expires_at) }) : undefined}>
                      <Lightning weight="fill" className="size-3 mr-0.5" />
                      {tBoost('timeLeft', { days: timeLeft.days, hours: timeLeft.hours })}
                    </Badge>
                  )}
                  {boostExpired && (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-xs shrink-0">
                      {tBoost('boostExpired')}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`font-semibold ${saleActive ? 'text-deal' : 'text-foreground'}`}>
                      {formatCurrency(Number(product.price))}
                    </span>
                    {product.list_price && product.list_price > product.price && (
                      <span className="text-muted-foreground line-through text-xs">
                        {formatCurrency(Number(product.list_price))}
                      </span>
                    )}
                  </div>
                  <span className={product.stock < 5 && product.stock > 0 ? "text-warning font-medium" : product.stock === 0 ? "text-destructive font-medium" : ""}>
                    {product.stock === 0
                      ? t('outOfStock')
                      : t('inStock', { count: product.stock })
                    }
                  </span>
                  {product.category && (
                    <span className="text-muted-foreground">{product.category.name}</span>
                  )}
                </div>
                {/* Rating */}
                <div className="flex items-center gap-1 mt-1.5">
                  <div className="flex text-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        weight={i < Math.floor(product.rating || 0) ? "fill" : "regular"}
                        className="text-rating"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.review_count || 0})
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Boost/Reboost Button - show if not currently active (includes expired) */}
                {!boosted && (
                  <BoostDialog
                    product={product}
                    locale={locale}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className={`gap-1.5 ${boostExpired ? 'text-muted-foreground border-muted-foreground/30 hover:text-primary hover:border-selected-border' : 'text-primary border-selected-border'} hover:bg-hover h-9 px-3 rounded-full`}
                      >
                        <Lightning className="size-4" weight="bold" />
                        {boostExpired ? tBoost('reboost') : tBoost('trigger')}
                      </Button>
                    }
                  />
                )}
                {/* Discount Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  onClick={() => openDiscountDialog(product)}
                  title={t('discountTooltip')}
                >
                  <Tag className="size-4" weight="bold" />
                </Button>
                {/* Pause/Unpause Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  onClick={() => handleToggleStatus(product.id, product.status)}
                  disabled={togglingId === product.id}
                  title={product.status === 'draft'
                    ? t('activateTooltip')
                    : t('pauseTooltip')
                  }
                >
                  {product.status === 'draft' ? (
                    <Play className="size-4 text-success" weight="fill" />
                  ) : (
                    <Pause className="size-4 text-warning" weight="fill" />
                  )}
                </Button>
                <Button asChild variant="ghost" size="icon" className="size-9">
                  <Link href={`/product/${product.id}`}>
                    <Eye className="size-4" />
                    <span className="sr-only">{t('viewSrOnly')}</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="size-9">
                  <Link href={`/account/selling/edit?id=${product.id}`}>
                    <Pencil className="size-4" />
                    <span className="sr-only">{t('editSrOnly')}</span>
                  </Link>
                </Button>
                {/* Delete Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 text-destructive hover:bg-destructive/10"
                      disabled={deletingId === product.id}
                    >
                      <Trash className="size-4" />
                      <span className="sr-only">{t('deleteSrOnly')}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t('deleteDialogTitle')}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('deleteDialogDesc', { title: product.title })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t('cancelButton')}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(product.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t('deleteButton')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )
        })}
      </div>

      {/* Discount Dialog */}
      <Dialog open={!!discountProductId} onOpenChange={(open) => { if (!open) closeDiscountDialog() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('setDiscountTitle')}</DialogTitle>
            <DialogDescription>
              {activeDiscountProduct
                ? t('setDiscountDesc', { title: activeDiscountProduct.title })
                : t('setDiscountDescGeneric')}
            </DialogDescription>
          </DialogHeader>

          {activeDiscountProduct && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {t('currentPriceLabel')}
                </span>{" "}
                {formatCurrency(Number(activeDiscountProduct.price))}
                {activeDiscountProduct.list_price && Number(activeDiscountProduct.list_price) > Number(activeDiscountProduct.price) && (
                  <>
                    {" "}·{" "}
                    <span className="line-through">
                      {formatCurrency(Number(activeDiscountProduct.list_price))}
                    </span>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount-price">{t('newPriceLabel')}</Label>
                <Input
                  id="discount-price"
                  inputMode="decimal"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder={t('newPricePlaceholder')}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {activeDiscountProduct?.list_price && Number(activeDiscountProduct.list_price) > Number(activeDiscountProduct.price) ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearDiscount}
                disabled={discountingId === activeDiscountProduct.id}
              >
                {t('removeDiscountButton')}
              </Button>
            ) : null}
            <Button type="button" variant="outline" onClick={closeDiscountDialog}>
              {t('cancelButton')}
            </Button>
            <Button
              type="button"
              onClick={handleApplyDiscount}
              disabled={!!activeDiscountProduct && discountingId === activeDiscountProduct.id}
            >
              {t('saveButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
