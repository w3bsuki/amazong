"use client"

import { useWishlist } from "@/components/providers/wishlist-context"
import { useCart } from "@/components/providers/cart-context"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash, ArrowRight, Share, Check, SpinnerGap } from "@phosphor-icons/react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { toast } from "sonner"
import { useState } from "react"

export default function WishlistPageClient() {
  const { items, isLoading, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const t = useTranslations("Wishlist")
  const tNav = useTranslations("Navigation")
  const locale = useLocale()
  const [linkCopied, setLinkCopied] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  // Generate canonical product URL: /{username}/{slug-or-id}
  const getProductUrl = (item: (typeof items)[0]) => {
    if (!item.username) return "#"
    return `/${item.username}/${item.slug || item.product_id}`
  }

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addToCart({
      id: item.product_id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
      ...(item.slug ? { slug: item.slug } : {}),
      ...(item.username ? { username: item.username } : {}),
    })
    removeFromWishlist(item.product_id)
    toast.success(t("movedToCart"))
  }

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addToCart({
        id: item.product_id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: 1,
        ...(item.slug ? { slug: item.slug } : {}),
        ...(item.username ? { username: item.username } : {}),
      })
    })
    toast.success(t("allAddedToCart"))
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
          <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
            <div className="flex flex-col items-center gap-3">
              <SpinnerGap className="size-8 animate-spin text-brand" />
              <p className="text-sm text-muted-foreground">
                {t("loading")}
              </p>
            </div>
          </div>

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
              {tNav("home")}
            </Link>
            <span>/</span>
            <span className="text-foreground">{t("title")}</span>
          </nav>

          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Heart className="h-5 w-5 md:h-6 md:w-6" weight="fill" />
            {t("title")}
          </h1>

          <div className="bg-card rounded-md border border-border p-4 md:p-4 text-center">
            <div className="size-20 md:size-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="size-10 md:size-12 text-muted-foreground" weight="duotone" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">{t("empty")}</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t("emptyDescription")}</p>
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
            {tNav("home")}
          </Link>
          <span>/</span>
          <span className="text-foreground">{t("title")}</span>
        </nav>

        {/* Header with title and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-deal" weight="fill" />
            {t("title")} <span className="text-muted-foreground font-normal">({items.length})</span>
          </h1>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
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
              className="group bg-card rounded-lg border border-border overflow-hidden"
            >
              {/* Image */}
              <Link href={getProductUrl(item)} className="block">
                <div className="relative aspect-square bg-secondary overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                  {/* Remove button - Top right */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeFromWishlist(item.product_id)
                      toast.success(t("removedFromWishlist"))
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-background/90 hover:bg-background border border-border text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={t("remove")}
                  >
                    <Trash size={16} weight="regular" />
                  </button>
                </div>
              </Link>

              {/* Content */}
              <div className="p-2 sm:p-3">
                {/* Title */}
                <Link href={getProductUrl(item)}>
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-brand transition-colors min-h-10">
                    {item.title}
                  </h3>
                </Link>

                {/* Price */}
                <p className="text-base md:text-lg font-bold text-foreground mb-3">{formatPrice(item.price)}</p>

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
