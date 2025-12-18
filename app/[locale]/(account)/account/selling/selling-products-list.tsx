"use client"

import { useState, useEffect, useTransition } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
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
import { BoostDialog } from "@/components/boost-dialog"
import { toast } from "sonner"
import { deleteProduct, bulkUpdateProductStatus, setProductDiscountPrice, clearProductDiscount } from "@/app/actions/products"
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

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  list_price: number | null
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
}

export function SellingProductsList({ products, locale }: SellingProductsListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [productsList, setProductsList] = useState(products)
  const [_isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [discountProductId, setDiscountProductId] = useState<string | null>(null)
  const [discountPrice, setDiscountPrice] = useState<string>("")
  const [discountingId, setDiscountingId] = useState<string | null>(null)

  const activeDiscountProduct = discountProductId
    ? productsList.find((p) => p.id === discountProductId) || null
    : null

  // Handle delete product
  const handleDelete = async (productId: string) => {
    setDeletingId(productId)
    startTransition(async () => {
      const result = await deleteProduct(productId)
      if (result.success) {
        toast.success(
          locale === 'bg' 
            ? 'Продуктът е изтрит успешно!' 
            : 'Product deleted successfully!'
        )
        setProductsList(prev => prev.filter(p => p.id !== productId))
        router.refresh()
      } else {
        toast.error(result.error || (locale === 'bg' ? 'Грешка при изтриване' : 'Failed to delete'))
      }
      setDeletingId(null)
    })
  }

  // Handle pause/unpause (draft/active toggle)
  const handleToggleStatus = async (productId: string, currentStatus?: string) => {
    setTogglingId(productId)
    const newStatus = currentStatus === 'active' ? 'draft' : 'active'
    startTransition(async () => {
      const result = await bulkUpdateProductStatus([productId], newStatus)
      if (result.success) {
        toast.success(
          locale === 'bg' 
            ? (newStatus === 'draft' ? 'Продуктът е поставен на пауза' : 'Продуктът е активен отново')
            : (newStatus === 'draft' ? 'Product paused' : 'Product activated')
        )
        setProductsList(prev => prev.map(p => 
          p.id === productId ? { ...p, status: newStatus } : p
        ))
        router.refresh()
      } else {
        toast.error(result.error || (locale === 'bg' ? 'Грешка при промяна' : 'Failed to update'))
      }
      setTogglingId(null)
    })
  }

  // Handle boost success/cancel URL params
  useEffect(() => {
    if (searchParams.get('boost_success') === 'true') {
      toast.success(
        locale === 'bg' 
          ? 'Промоцията е активирана успешно!' 
          : 'Boost activated successfully!'
      )
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    } else if (searchParams.get('boost_canceled') === 'true') {
      toast.info(
        locale === 'bg' 
          ? 'Плащането беше отменено' 
          : 'Payment was cancelled'
      )
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams, locale])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
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
      toast.error(locale === 'bg' ? 'Въведете валидна цена' : 'Enter a valid price')
      return
    }

    const base = (activeDiscountProduct.list_price && activeDiscountProduct.list_price > activeDiscountProduct.price)
      ? Number(activeDiscountProduct.list_price)
      : Number(activeDiscountProduct.price)

    if (!(newPrice < base)) {
      toast.error(locale === 'bg' ? 'Новата цена трябва да е по-ниска' : 'New price must be lower')
      return
    }

    setDiscountingId(activeDiscountProduct.id)
    startTransition(async () => {
      const result = await setProductDiscountPrice(activeDiscountProduct.id, newPrice)
      if (result.success) {
        toast.success(locale === 'bg' ? 'Отстъпката е запазена' : 'Discount saved')

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
        toast.error(result.error || (locale === 'bg' ? 'Грешка при запазване' : 'Failed to save'))
      }
      setDiscountingId(null)
    })
  }

  const handleClearDiscount = async () => {
    if (!activeDiscountProduct) return

    setDiscountingId(activeDiscountProduct.id)
    startTransition(async () => {
      const result = await clearProductDiscount(activeDiscountProduct.id)
      if (result.success) {
        toast.success(locale === 'bg' ? 'Отстъпката е премахната' : 'Discount removed')
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
        toast.error(result.error || (locale === 'bg' ? 'Грешка при премахване' : 'Failed to remove'))
      }
      setDiscountingId(null)
    })
  }

  // Check if boost is active (not expired)
  const isBoostActive = (product: Product) => {
    if (!product.is_boosted || !product.boost_expires_at) return false
    return new Date(product.boost_expires_at) > new Date()
  }

  // Get days left for active boost
  const getBoostDaysLeft = (product: Product) => {
    if (!product.boost_expires_at) return 0
    const expiresAt = new Date(product.boost_expires_at)
    const now = new Date()
    return Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  }

  if (productsList.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="size-16 sm:size-20 rounded-full mx-auto flex items-center justify-center mb-4 bg-account-stat-icon-bg border border-account-stat-border">
          <Package weight="duotone" className="size-8 sm:size-10 text-account-stat-icon" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {locale === 'bg' ? 'Нямате продукти все още' : 'No products yet'}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          {locale === 'bg' 
            ? 'Започнете да продавате, като създадете първата си обява' 
            : 'Start selling by creating your first product listing'}
        </p>
        <Button asChild className="rounded-full">
          <Link href={`/${locale}/sell`}>
            <Plus weight="bold" className="size-4 mr-2" />
            {locale === 'bg' ? 'Създай обява' : 'Create Listing'}
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
          const daysLeft = getBoostDaysLeft(product)
          
          return (
            <div 
              key={product.id} 
              className={`flex items-start gap-3 p-3 rounded-2xl bg-account-stat-bg border border-account-stat-border transition-all active:scale-[0.99] ${
                boosted ? 'ring-2 ring-primary/20 border-primary/30' : ''
              }`}
            >
              {/* Product Image */}
              <div className="relative size-20 rounded-xl overflow-hidden bg-account-stat-bg border border-account-stat-border shrink-0">
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
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 gap-0.5 shadow-lg">
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
                      href={`/${locale}/product/${product.id}`}
                      className="font-medium text-foreground hover:text-primary line-clamp-1 text-sm"
                    >
                      {product.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-semibold ${product.list_price && product.list_price > product.price ? 'text-deal' : 'text-foreground'}`}>
                        {formatCurrency(Number(product.price))}
                      </span>
                      {product.list_price && product.list_price > product.price && (
                        <Badge variant="secondary" className="bg-deal/10 text-deal border-0 text-[10px] px-1.5 py-0">
                          <Tag weight="fill" className="size-2.5 mr-0.5" />
                          -{Math.round(((product.list_price - product.price) / product.list_price) * 100)}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span className={product.stock < 5 && product.stock > 0 ? "text-amber-600 dark:text-amber-400 font-medium" : product.stock === 0 ? "text-destructive font-medium" : ""}>
                        {product.stock === 0 
                          ? (locale === 'bg' ? 'Изчерпан' : 'Out of stock')
                          : `${product.stock} ${locale === 'bg' ? 'в склад' : 'in stock'}`
                        }
                      </span>
                      {boosted && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">
                          <Lightning weight="fill" className="size-2.5 mr-0.5" />
                          {daysLeft}d
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
                      <span className="text-[10px] text-muted-foreground">
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
                      title={locale === 'bg' ? 'Отстъпка' : 'Discount'}
                    >
                      <Tag className="size-4" weight="bold" />
                    </Button>
                    {!boosted && (
                      <BoostDialog 
                        product={product} 
                        locale={locale}
                        trigger={
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 text-primary hover:bg-primary/10"
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
                        <Play className="size-4 text-emerald-600" weight="fill" />
                      ) : (
                        <Pause className="size-4 text-amber-600" weight="fill" />
                      )}
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="size-8">
                      <Link href={`/${locale}/account/selling/edit?id=${product.id}`}>
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
                            {locale === 'bg' ? 'Изтриване на продукт' : 'Delete Product'}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {locale === 'bg' 
                              ? `Сигурни ли сте, че искате да изтриете "${product.title}"? Това действие не може да бъде отменено.`
                              : `Are you sure you want to delete "${product.title}"? This action cannot be undone.`
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {locale === 'bg' ? 'Отказ' : 'Cancel'}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {locale === 'bg' ? 'Изтрий' : 'Delete'}
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
          const daysLeft = getBoostDaysLeft(product)
          
          return (
            <div 
              key={product.id} 
              className={`flex items-center gap-4 p-4 hover:bg-account-card-hover transition-colors ${
                boosted ? 'bg-primary/5' : ''
              }`}
            >
              {/* Product Image */}
              <div className="relative size-16 rounded-xl overflow-hidden bg-account-stat-bg border border-account-stat-border shrink-0">
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
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-1 py-0 gap-0.5">
                      <Lightning className="size-2.5" weight="fill" />
                    </Badge>
                  </div>
                )}
              </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link 
                  href={`/${locale}/product/${product.id}`}
                  className="font-medium text-foreground hover:text-primary line-clamp-1"
                >
                  {product.title}
                </Link>
                {product.list_price && product.list_price > product.price && (
                  <Badge variant="secondary" className="bg-deal/10 text-deal border-0 text-xs shrink-0">
                    <Tag weight="fill" className="size-3 mr-0.5" />
                    -{Math.round(((product.list_price - product.price) / product.list_price) * 100)}%
                  </Badge>
                )}
                {boosted && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-xs shrink-0">
                    <Lightning weight="fill" className="size-3 mr-0.5" />
                    {daysLeft} {locale === 'bg' ? 'дни' : 'days'}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-semibold ${product.list_price && product.list_price > product.price ? 'text-deal' : 'text-foreground'}`}>
                    {formatCurrency(Number(product.price))}
                  </span>
                  {product.list_price && product.list_price > product.price && (
                    <span className="text-muted-foreground line-through text-xs">
                      {formatCurrency(Number(product.list_price))}
                    </span>
                  )}
                </div>
                <span className={product.stock < 5 && product.stock > 0 ? "text-amber-600 dark:text-amber-400 font-medium" : product.stock === 0 ? "text-destructive font-medium" : ""}>
                  {product.stock === 0 
                    ? (locale === 'bg' ? 'Изчерпан' : 'Out of stock')
                    : `${product.stock} ${locale === 'bg' ? 'в склад' : 'in stock'}`
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
              {/* Boost Button */}
              {!boosted && (
                <BoostDialog 
                  product={product} 
                  locale={locale}
                  trigger={
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5 text-primary border-primary/30 hover:bg-primary/10 hover:text-primary h-9 px-3 rounded-full"
                    >
                      <Lightning className="size-4" weight="bold" />
                      {locale === 'bg' ? 'Промотирай' : 'Boost'}
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
                title={locale === 'bg' ? 'Отстъпка' : 'Discount'}
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
                  ? (locale === 'bg' ? 'Активирай' : 'Activate') 
                  : (locale === 'bg' ? 'Постави на пауза' : 'Pause')
                }
              >
                {product.status === 'draft' ? (
                  <Play className="size-4 text-emerald-600" weight="fill" />
                ) : (
                  <Pause className="size-4 text-amber-600" weight="fill" />
                )}
              </Button>
              <Button asChild variant="ghost" size="icon" className="size-9">
                <Link href={`/${locale}/product/${product.id}`}>
                  <Eye className="size-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="size-9">
                <Link href={`/${locale}/account/selling/edit?id=${product.id}`}>
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit</span>
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
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {locale === 'bg' ? 'Изтриване на продукт' : 'Delete Product'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {locale === 'bg' 
                        ? `Сигурни ли сте, че искате да изтриете "${product.title}"? Това действие не може да бъде отменено.`
                        : `Are you sure you want to delete "${product.title}"? This action cannot be undone.`
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {locale === 'bg' ? 'Отказ' : 'Cancel'}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(product.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {locale === 'bg' ? 'Изтрий' : 'Delete'}
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
            <DialogTitle>{locale === 'bg' ? 'Задай отстъпка' : 'Set discount'}</DialogTitle>
            <DialogDescription>
              {activeDiscountProduct
                ? (locale === 'bg'
                  ? `Въведете новата цена за "${activeDiscountProduct.title}".`
                  : `Enter the new price for "${activeDiscountProduct.title}".`)
                : (locale === 'bg' ? 'Въведете новата цена.' : 'Enter the new price.')}
            </DialogDescription>
          </DialogHeader>

          {activeDiscountProduct && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {locale === 'bg' ? 'Текуща цена:' : 'Current price:'}
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
                <Label htmlFor="discount-price">{locale === 'bg' ? 'Нова цена' : 'New price'}</Label>
                <Input
                  id="discount-price"
                  inputMode="decimal"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder={locale === 'bg' ? 'напр. 49.99' : 'e.g. 49.99'}
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
                {locale === 'bg' ? 'Премахни отстъпка' : 'Remove discount'}
              </Button>
            ) : null}
            <Button type="button" variant="outline" onClick={closeDiscountDialog}>
              {locale === 'bg' ? 'Отказ' : 'Cancel'}
            </Button>
            <Button
              type="button"
              onClick={handleApplyDiscount}
              disabled={!!activeDiscountProduct && discountingId === activeDiscountProduct.id}
            >
              {locale === 'bg' ? 'Запази' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
