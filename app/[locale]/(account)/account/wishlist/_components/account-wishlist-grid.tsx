"use client"

import { useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { getProductUrl } from "@/lib/url-utils"
import { toast } from "sonner"
import {
  Heart,
  ShoppingCart,
  Trash,
  ArrowRight,
  Package,
  XCircle,
  Eye
} from "@phosphor-icons/react"
import { IconHeart, IconTag } from "@tabler/icons-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/providers/cart-context"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

export interface WishlistItem {
  id: string
  product_id: string
  title: string
  price: number
  image: string
  stock: number
  created_at: string
  category_id?: string | null
  category_name?: string | null
  category_slug?: string | null
  /** Product slug for SEO-friendly URLs */
  slug?: string | null
  /** Seller username for SEO-friendly URLs */
  username?: string | null
}

interface WishlistGridProps {
  items: WishlistItem[]
  locale: string
  onRemove: (productId: string) => void
}

export function AccountWishlistGrid({ items, locale, onRemove }: WishlistGridProps) {
  const t = useTranslations("Wishlist")
  const { addToCart } = useCart()
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleMoveToCart = async (item: WishlistItem) => {
    if (item.stock <= 0) {
      toast.error(locale === 'bg' ? 'Продуктът е изчерпан' : 'Product is out of stock')
      return
    }

    addToCart({
      id: item.product_id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    })

    // Remove from wishlist after adding to cart
    await handleRemove(item.product_id)
    toast.success(locale === 'bg' ? 'Преместено в количката' : 'Moved to cart')
    setSelectedItem(null)
  }

  const handleRemove = async (productId: string) => {
    setRemovingId(productId)
    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error(locale === 'bg' ? 'Моля, влезте в профила си' : 'Please sign in')
        return
      }

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) throw error
      onRemove(productId)
      toast.success(locale === 'bg' ? 'Премахнато от любими' : 'Removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error(locale === 'bg' ? 'Грешка при премахване' : 'Failed to remove')
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddAllToCart = () => {
    const inStockItems = items.filter(item => item.stock > 0)
    if (inStockItems.length === 0) {
      toast.error(locale === 'bg' ? 'Няма налични продукти' : 'No items in stock')
      return
    }

    inStockItems.forEach((item) => {
      addToCart({
        id: item.product_id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: 1,
      })
    })
    toast.success(
      locale === 'bg'
        ? `Добавени ${inStockItems.length} артикула в количката`
        : `Added ${inStockItems.length} items to cart`
    )
  }

  const labels = {
    addedOn: locale === 'bg' ? 'Добавено на' : 'Added on',
    price: locale === 'bg' ? 'Цена' : 'Price',
    availability: locale === 'bg' ? 'Наличност' : 'Availability',
    inStock: locale === 'bg' ? 'в наличност' : 'in stock',
    outOfStock: locale === 'bg' ? 'Продадено' : 'Sold',
    moveToCart: locale === 'bg' ? 'В количката' : 'Add to Cart',
    viewProduct: locale === 'bg' ? 'Виж' : 'View',
    remove: locale === 'bg' ? 'Премахни' : 'Remove',
    addAllToCart: locale === 'bg' ? 'Добави всички в количката' : 'Add All to Cart',
    category: locale === 'bg' ? 'Категория' : 'Category',
  }

  // Empty state
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-account-stat-icon-bg border border-account-stat-border mb-4">
            <Heart className="size-8 text-destructive" weight="fill" />
          </div>
          <h3 className="font-semibold text-lg">{t("empty")}</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            {t("emptyDescription")}
          </p>
          <Button asChild className="mt-6">
            <Link href="/search">
              {t("startShopping")}
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Mobile: Vertical 2-column grid - much better for browsing wishlist */}
      {/* pb-20 adds padding for the floating "Add All" button */}
      <div className="grid grid-cols-2 gap-3 pb-20 md:hidden md:pb-0">
        {items.map((item) => (
          <Sheet key={item.id} open={selectedItem?.id === item.id} onOpenChange={(open) => !open && setSelectedItem(null)}>
            <div
              onClick={() => setSelectedItem(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setSelectedItem(item)
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={locale === "bg" ? `Отвори ${item.title}` : `Open ${item.title}`}
              className="flex flex-col rounded-md bg-account-stat-bg border border-account-stat-border overflow-hidden transition-colors active:bg-account-card-hover text-left"
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-account-stat-bg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={cn(
                    "object-cover",
                    item.stock <= 0 && "opacity-60 grayscale-30"
                  )}
                  sizes="(max-width: 768px) 50vw, 200px"
                />
                {/* Stock indicator badge */}
                {item.stock > 0 ? (
                  <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-success">
                    <Package weight="fill" className="size-3.5 text-white" />
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-warning">
                    <XCircle weight="fill" className="size-3 text-white" />
                    <span className="text-2xs font-semibold text-white">{labels.outOfStock}</span>
                  </div>
                )}
                {/* Category badge */}
                {item.category_name && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60">
                    <span className="text-2xs font-medium text-white">{item.category_name}</span>
                  </div>
                )}
                {/* Quick add to cart button overlay */}
                {item.stock > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMoveToCart(item)
                    }}
                    className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full bg-foreground"
                  >
                    <ShoppingCart weight="fill" className="size-4 text-white" />
                  </button>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col p-3 flex-1">
                <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight mb-2">
                  {item.title}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <p className={cn(
                    "text-base font-bold",
                    item.stock > 0
                      ? "text-foreground"
                      : "text-muted-foreground line-through"
                  )}>
                    {formatCurrency(item.price)}
                  </p>
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(item.product_id)
                    }}
                    disabled={removingId === item.product_id}
                    className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Detail Sheet */}
            <SheetContent side="bottom" className="h-auto max-h-(--dialog-h-85vh) rounded-t-3xl">
              <SheetHeader className="text-left pb-4">
                <SheetTitle className="line-clamp-2 text-lg">{item.title}</SheetTitle>
                <SheetDescription className="flex items-center gap-2 flex-wrap">
                  {labels.addedOn} {formatDate(item.created_at)}
                  {item.category_name && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <Badge variant="outline" className="text-xs">
                        <IconTag className="size-3 mr-1" />
                        {item.category_name}
                      </Badge>
                    </>
                  )}
                </SheetDescription>
              </SheetHeader>

              <div className="py-4">
                <div className="relative aspect-square w-full max-w-60 mx-auto rounded-md overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{labels.price}</span>
                    <span className="text-2xl font-bold text-foreground">{formatCurrency(item.price)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{labels.availability}</span>
                    {item.stock > 0 ? (
                      <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
                        <Package weight="fill" className="size-3 mr-1" />
                        {item.stock} {labels.inStock}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
                        <XCircle weight="fill" className="size-3 mr-1" />
                        {labels.outOfStock}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-col pt-4 border-t">
                <Button
                  onClick={() => handleMoveToCart(item)}
                  disabled={item.stock <= 0}
                  className="w-full h-12 text-base"
                >
                  <ShoppingCart className="size-5 mr-2" />
                  {labels.moveToCart}
                </Button>
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1 h-11"
                  >
                    <Link
                      href={getProductUrl({
                        id: item.product_id,
                        slug: item.slug ?? null,
                        username: item.username ?? null,
                      })}
                    >
                      <Eye className="size-4 mr-2" />
                      {labels.viewProduct}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleRemove(item.product_id)
                      setSelectedItem(null)
                    }}
                    disabled={removingId === item.product_id}
                    className="text-destructive hover:text-destructive h-11 px-4"
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </div>

      {/* Desktop: Beautiful card grid with hover effects */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col rounded-md bg-account-stat-bg border border-account-stat-border overflow-hidden transition-colors hover:border-account-accent"
          >
            {/* Product Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-account-stat-bg">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className={cn(
                  "object-cover",
                  item.stock <= 0 && "opacity-60 grayscale-30"
                )}
                sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />

              <Link
                href={getProductUrl({
                  id: item.product_id,
                  slug: item.slug ?? null,
                  username: item.username ?? null,
                })}
                className="absolute inset-0 z-10"
                aria-label={item.title}
              />

              {/* Stock indicator */}
              {item.stock > 0 ? (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success">
                  <Package weight="fill" className="size-3.5 text-white" />
                  <span className="text-xs font-semibold text-white">{item.stock}</span>
                </div>
              ) : (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning">
                  <XCircle weight="fill" className="size-3.5 text-white" />
                  <span className="text-xs font-semibold text-white">{labels.outOfStock}</span>
                </div>
              )}
              {/* Category badge */}
              {item.category_name && (
                <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/60">
                  <span className="text-xs font-medium text-white">{item.category_name}</span>
                </div>
              )}
              {/* Hover overlay with quick actions */}
              <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-background text-foreground hover:bg-muted"
                    asChild
                  >
                    <Link
                      href={getProductUrl({
                        id: item.product_id,
                        slug: item.slug ?? null,
                        username: item.username ?? null,
                      })}
                    >
                      <Eye className="size-4 mr-1.5" />
                      {labels.viewProduct}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col p-4 flex-1">
              <Link
                href={getProductUrl({
                  id: item.product_id,
                  slug: item.slug ?? null,
                  username: item.username ?? null,
                })}
                className="text-sm font-medium text-foreground line-clamp-2 leading-tight hover:text-primary transition-colors mb-2"
              >
                {item.title}
              </Link>

              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    "text-lg font-bold",
                    item.stock > 0
                      ? "text-foreground"
                      : "text-muted-foreground line-through"
                  )}>
                    {formatCurrency(item.price)}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.created_at)}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleMoveToCart(item)}
                    disabled={item.stock <= 0}
                    className="flex-1"
                  >
                    <ShoppingCart className="size-4 mr-1.5" />
                    {labels.moveToCart}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(item.product_id)}
                    disabled={removingId === item.product_id}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Wishlist heart indicator */}
            <div className="absolute top-3 left-3 flex size-8 items-center justify-center rounded-full bg-background/90">
              <IconHeart className="size-4 text-destructive fill-destructive" />
            </div>
          </div>
        ))}
      </div>

      {/* Add All to Cart Button (Desktop only) */}
      {items.some(item => item.stock > 0) && (
        <div className="hidden md:flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={handleAddAllToCart}
            className="border-account-stat-border hover:bg-account-card-hover"
          >
            <ShoppingCart className="size-4 mr-2" />
            {labels.addAllToCart} ({items.filter(i => i.stock > 0).length})
          </Button>
        </div>
      )}

      {/* Mobile: Floating Add All button */}
      {items.some(item => item.stock > 0) && items.length > 2 && (
        <div className="fixed bottom-20 left-4 right-4 md:hidden z-40">
          <Button
            onClick={handleAddAllToCart}
            className="w-full h-12 rounded-full"
          >
            <ShoppingCart className="size-5 mr-2" />
            {labels.addAllToCart} ({items.filter(i => i.stock > 0).length})
          </Button>
        </div>
      )}
    </>
  )
}
