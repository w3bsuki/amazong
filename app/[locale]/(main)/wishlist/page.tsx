"use client"

import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  ShoppingCart, 
  Trash, 
  ArrowRight, 
  Share,
  Check
} from "@phosphor-icons/react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { toast } from "sonner"
import { useState } from "react"

export default function WishlistPage() {
  const { items, isLoading, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const t = useTranslations("Wishlist")
  const locale = useLocale()
  const [linkCopied, setLinkCopied] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-US', {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(price)
  }

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.product_id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
    removeFromWishlist(item.product_id)
    toast.success(locale === 'bg' ? 'Преместено в количката' : 'Moved to cart')
  }

  const handleAddAllToCart = () => {
    items.forEach(item => {
      addToCart({
        id: item.product_id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: 1,
      })
    })
    toast.success(locale === 'bg' ? 'Всички продукти добавени в количката' : 'All items added to cart')
  }

  const handleShare = async () => {
    const shareUrl = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("title"),
          url: shareUrl,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)
      toast.success(t("linkCopied"))
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary py-4 md:py-6">
        <div className="container px-3 md:px-4">
          {/* Breadcrumb skeleton */}
          <div className="flex gap-2 items-center mb-4">
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
          
          {/* Title skeleton */}
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
          
          {/* Grid skeleton */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-2 sm:p-3">
                <div className="aspect-square bg-muted animate-pulse rounded-lg mb-2" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-full" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-5 bg-muted animate-pulse rounded w-20" />
                  <div className="h-9 bg-muted animate-pulse rounded-full w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary py-4 md:py-6">
        <div className="container px-3 md:px-4">
          {/* Breadcrumb */}
          <nav className="flex gap-2 items-center mb-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              {locale === 'bg' ? 'Начало' : 'Home'}
            </Link>
            <span>/</span>
            <span className="text-foreground">{t("title")}</span>
          </nav>

          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Heart className="h-5 w-5 md:h-6 md:w-6" weight="fill" />
            {t("title")}
          </h1>
          
          <div className="bg-card rounded-xl border border-border p-8 md:p-12 text-center">
            <div className="size-20 md:size-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="size-10 md:size-12 text-muted-foreground" weight="duotone" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
              {t("empty")}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t("emptyDescription")}
            </p>
            <Button asChild className="bg-brand hover:bg-brand-dark text-white">
              <Link href="/search">
                {t("startShopping")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary py-4 md:py-6">
      <div className="container px-3 md:px-4">
        {/* Breadcrumb */}
        <nav className="flex gap-2 items-center mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            {locale === 'bg' ? 'Начало' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-foreground">{t("title")}</span>
        </nav>

        {/* Header with title and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-deal" weight="fill" />
            {t("title")} 
            <span className="text-muted-foreground font-normal">({items.length})</span>
          </h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="gap-2"
            >
              {linkCopied ? (
                <>
                  <Check className="size-4" />
                  {t("linkCopied")}
                </>
              ) : (
                <>
                  <Share className="size-4" />
                  {t("shareWishlist")}
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddAllToCart}
              className="gap-2 bg-brand hover:bg-brand-dark"
            >
              <ShoppingCart className="size-4" />
              {t("addAllToCart")}
            </Button>
          </div>
        </div>

        {/* Product Grid - Responsive */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <Link href={`/product/${item.product_id}`} className="block">
                <div className="relative aspect-square bg-secondary overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                  {/* Remove button - Top right */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeFromWishlist(item.product_id)
                      toast.success(locale === 'bg' ? 'Премахнато от любими' : 'Removed from wishlist')
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white border border-border text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={t("remove")}
                  >
                    <Trash size={16} weight="regular" />
                  </button>
                </div>
              </Link>

              {/* Content */}
              <div className="p-2 sm:p-3">
                {/* Title */}
                <Link href={`/product/${item.product_id}`}>
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-brand transition-colors min-h-[2.5rem]">
                    {item.title}
                  </h3>
                </Link>

                {/* Price */}
                <p className="text-base md:text-lg font-bold text-foreground mb-3">
                  {formatPrice(item.price)}
                </p>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full h-9 text-sm rounded-full bg-cta-add-to-cart hover:bg-cta-add-to-cart-hover text-cta-add-to-cart-text"
                >
                  <ShoppingCart className="size-4 mr-1.5" />
                  {t("moveToCart")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
