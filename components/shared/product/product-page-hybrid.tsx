"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Truck, RotateCcw, Store, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { Star } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

import { useWishlist } from "@/components/providers/wishlist-context"

import {
  ProductGallery,
  ShippingInfo,
  ProductSpecs,
} from "@/components/product"

type SellerData = {
  id: string
  store_name: string
  store_slug: string | undefined
  avatar_url: string | null | undefined
  verified: boolean
  positive_feedback_percentage: number | null
  total_items_sold: number | null
  feedback_score: number | null
  feedback_count: number | null
  member_since: string
  ratings:
    | {
        accuracy: number
        shipping_cost: number
        shipping_speed: number
        communication: number
      }
    | null
}

interface ProductPageHybridProps {
  product: {
    id: string
    title: string
    description: string | null
    price: number
    original_price?: number | null
    images: string[]
    rating: number
    reviews_count: number
    tags?: string[]
    is_boosted?: boolean
    seller_id?: string
    slug?: string
    watch_count?: number
  }
  seller: {
    id: string
    username?: string
    display_name: string
    verified: boolean
    created_at: string
    avatar_url?: string | null
    feedback_percentage?: number | null
    total_sales?: number | null
    feedback_score?: number | null
    feedback_count?: number | null
    ratings?: {
      accuracy: number
      shipping_cost: number
      shipping_speed: number
      communication: number
    } | null
  } | null
  locale: string
  currentUserId: string | null
  isFollowingSeller?: boolean
  formattedDeliveryDate: string
  t: {
    inStock: string
    soldBy: string
    freeReturns: string
    freeDelivery: string
    secureTransaction: string
    aboutThisItem: string
    ratingLabel: string
    ratings: string
    shipping: string
    deliveryLabel: string
    returnsLabel: string
    payments: string
    condition: string
    conditionNew: string
    viewStore: string
    enlarge: string
    addToWatchlist: string
    removeFromWatchlist: string
    watching: string
    picture: string
    of: string
    clickToEnlarge: string
    previousImage: string
    nextImage: string
    imagePreview: string
    freeShipping: string
    locatedIn: string
    estimatedDelivery: string
    returns30Days: string
    moneyBackGuarantee: string
    getItemOrMoneyBack: string
    learnMore: string
    description: string
    specifications: string
    inTheBox: string
    technicalSpecs: string
    whatsInTheBox: string
    itemNumber: string
    brand: string
    type: string
    model: string
    countryOfOrigin: string
    warranty: string
    months: string
    mainProduct: string
    userManual: string
    warrantyCard: string
    originalPackaging: string
    sold: string
    positivePercentage: string
    moreFrom: string
    similarProduct: string
    viewAllItems: string
    detailedSellerRatings: string
    averageLast12Months: string
    accurateDescription: string
    reasonableShippingCost: string
    shippingSpeed: string
    communication: string
    noRatingsYet: string
    noDescriptionAvailable: string
  }
}

export function ProductPageHybrid({
  product,
  seller,
  locale,
  currentUserId,
  isFollowingSeller = false,
  formattedDeliveryDate,
  t,
}: ProductPageHybridProps) {
  const [isWishlistPending, setIsWishlistPending] = useState(false)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const stickySentinelRef = useRef<HTMLDivElement>(null)
  const buyBoxRef = useRef<HTMLDivElement>(null)

  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWatching = isInWishlist(product.id)

  const images = product.images?.length ? product.images : ["/placeholder.svg"]

  const discountPercentage = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  const sellerData = useMemo<SellerData | null>(() => {
    if (!seller) return null
    return {
      id: seller.id,
      store_name: seller.display_name || seller.username || "Seller",
      store_slug: seller.username,
      avatar_url: seller.avatar_url,
      verified: seller.verified,
      positive_feedback_percentage: seller.feedback_percentage ?? null,
      total_items_sold: seller.total_sales ?? null,
      feedback_score: seller.feedback_score ?? null,
      feedback_count: seller.feedback_count ?? null,
      member_since: new Date(seller.created_at).getFullYear().toString(),
      ratings: seller.ratings ?? null,
    }
  }, [seller])

  const handleWishlistToggle = async () => {
    setIsWishlistPending(true)
    try {
      await toggleWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: images[0] || "/placeholder.svg",
      })
    } finally {
      setIsWishlistPending(false)
    }
  }

  // Desktop sticky header
  useEffect(() => {
    const handler = () => {
      const el = stickySentinelRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setShowStickyHeader(rect.top < 0)
    }
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const galleryTranslations = {
    enlarge: t.enlarge,
    addToWatchlist: t.addToWatchlist,
    removeFromWatchlist: t.removeFromWatchlist,
    previousImage: t.previousImage,
    nextImage: t.nextImage,
    imagePreview: t.imagePreview,
    picture: t.picture,
    of: t.of,
    clickToEnlarge: t.clickToEnlarge,
  }

  const buyBoxTranslations = {
    addToWatchlist: t.addToWatchlist,
    watching: t.watching,
  }

  const sellerTranslations = {
    viewStore: t.viewStore,
    sold: t.sold,
    positivePercentage: t.positivePercentage,
    moreFrom: t.moreFrom,
    similarProduct: t.similarProduct,
    viewAllItems: t.viewAllItems,
    detailedSellerRatings: t.detailedSellerRatings,
    averageLast12Months: t.averageLast12Months,
    accurateDescription: t.accurateDescription,
    reasonableShippingCost: t.reasonableShippingCost,
    shippingSpeed: t.shippingSpeed,
    communication: t.communication,
    noRatingsYet: t.noRatingsYet,
  }

  const shippingTranslations = {
    shipping: t.shipping,
    freeShipping: t.freeShipping,
    seeDetails: "",
    locatedIn: t.locatedIn,
    deliveryLabel: t.deliveryLabel,
    estimatedDelivery: t.estimatedDelivery,
    returnsLabel: t.returnsLabel,
    returns30Days: t.returns30Days,
    payments: t.payments,
    moneyBackGuarantee: t.moneyBackGuarantee,
    getItemOrMoneyBack: t.getItemOrMoneyBack,
    learnMore: t.learnMore,
  }

  const specsTranslations = {
    technicalSpecs: t.technicalSpecs,
    whatsInTheBox: t.whatsInTheBox,
    description: t.description,
    specifications: t.specifications,
    inTheBox: t.inTheBox,
    noDescriptionAvailable: t.noDescriptionAvailable,
    itemNumber: t.itemNumber,
    condition: t.condition,
    conditionNew: t.conditionNew,
    brand: t.brand,
    type: t.type,
    model: t.model,
    countryOfOrigin: t.countryOfOrigin,
    warranty: t.warranty,
    months: t.months,
    mainProduct: t.mainProduct,
    userManual: t.userManual,
    warrantyCard: t.warrantyCard,
    originalPackaging: t.originalPackaging,
  }

  return (
    <div className="w-full pb-20 lg:pb-0">
      {/* Desktop sticky mini header */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 hidden lg:block border-b bg-background transition-transform duration-300",
          showStickyHeader ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container py-2 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate">{product.title}</div>
            <div className="text-sm text-muted-foreground">
              {t.ratingLabel.replace("{rating}", product.rating.toFixed(1)).replace("{max}", "5")}
            </div>
          </div>
          <div className="text-lg font-bold">{product.price.toFixed(2)} BGN</div>
        </div>
      </div>

      <div ref={stickySentinelRef} />

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6">
        {/* Left column */}
        <div className="min-w-0">
          <div className="space-y-4">
            {/* Title & rating section */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">{product.title}</h1>
                {product.is_boosted && (
                  <Badge variant="secondary" className="h-6">Boosted</Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        star <= Math.round(product.rating)
                          ? "fill-verified text-verified"
                          : "fill-muted text-muted"
                      )}
                      weight="fill"
                    />
                  ))}
                  <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews_count || 0})</span>
                </div>

                {sellerData?.store_slug && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">{t.soldBy} </span>
                    <Link
                      href={`/${sellerData.store_slug}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {sellerData.store_name}
                    </Link>
                  </div>
                )}
              </div>

              {product.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 6).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Image gallery - your existing component */}
            <ProductGallery
              images={images}
              title={product.title}
              watchCount={product.watch_count ?? 0}
              isWatching={isWatching}
              onWatchlistToggle={handleWishlistToggle}
              isWatchlistPending={isWishlistPending}
              t={galleryTranslations}
            />

            {/* Mobile: Price display (like product-detail6) */}
            <div className="lg:hidden">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-xl font-semibold text-red-600">
                      {product.price.toFixed(2)} BGN
                    </span>
                  )}
                  <span className={cn(
                    "font-bold",
                    product.original_price && product.original_price > product.price
                      ? "text-base text-muted-foreground line-through"
                      : "text-2xl"
                  )}>
                    {product.original_price && product.original_price > product.price
                      ? `${product.original_price.toFixed(2)} BGN`
                      : `${product.price.toFixed(2)} BGN`
                    }
                  </span>
                  {discountPercentage > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      -{discountPercentage}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile: Product Description - PROMINENT (marketplace priority!) */}
            <div className="lg:hidden">
              <p className="text-base leading-relaxed text-muted-foreground">
                {product.description || t.noDescriptionAvailable}
              </p>
            </div>

            {/* Mobile: Seller Card (like product-detail6 "Related Items") */}
            {sellerData && (
              <div className="lg:hidden">
                <SellerCardSection
                  seller={sellerData}
                  productId={product.id}
                  productTitle={product.title}
                  productPrice={product.price}
                  productImages={images}
                  locale={locale}
                  isFollowing={isFollowingSeller}
                  currentUserId={currentUserId}
                  t={sellerTranslations}
                />
              </div>
            )}

            {/* Mobile: Reference point for sticky buy bar detection */}
            <div ref={buyBoxRef} className="lg:hidden h-px" />

            {/* Mobile: Shipping highlights (like product-detail6) */}
            <div className="lg:hidden flex flex-col gap-4 py-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <span className="text-sm">{t.freeShipping}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                <span className="text-sm">{t.returns30Days}</span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                <span className="text-sm">
                  {locale === 'bg' ? 'Готово за взимане от' : 'Ready for pickup at'} Sofia
                </span>
              </div>
            </div>

            {/* Mobile: Accordion for more product info (like product-detail6) */}
            <div className="lg:hidden">
              <Accordion type="multiple" className="w-full border-b">
                <AccordionItem value="about">
                  <AccordionTrigger className="text-base font-medium">
                    {locale === 'bg' ? 'Преглед на продукта' : 'Product Overview'}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {product.description || t.noDescriptionAvailable}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="specs">
                  <AccordionTrigger className="text-base font-medium">
                    {t.specifications}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ProductSpecs
                      productId={product.id}
                      description={product.description}
                      variant="desktop"
                      t={specsTranslations}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger className="text-base font-medium">
                    {t.shipping} & {t.returnsLabel}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ShippingInfo
                      shippingCost="free"
                      location="Sofia, Bulgaria"
                      deliveryDate={formattedDeliveryDate}
                      locale={locale}
                      t={shippingTranslations}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Desktop: Clean accordions like product-detail6 */}
            <Accordion type="multiple" className="hidden lg:block w-full border-b">
              <AccordionItem value="description">
                <AccordionTrigger className="text-base font-medium">
                  {t.description}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {product.description || t.noDescriptionAvailable}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="specs">
                <AccordionTrigger className="text-base font-medium">
                  {t.specifications}
                </AccordionTrigger>
                <AccordionContent>
                  <ProductSpecs
                    productId={product.id}
                    description={product.description}
                    variant="desktop"
                    t={specsTranslations}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping">
                <AccordionTrigger className="text-base font-medium">
                  {t.shipping} & {t.returnsLabel}
                </AccordionTrigger>
                <AccordionContent>
                  <ShippingInfo
                    shippingCost="free"
                    location="Sofia, Bulgaria"
                    deliveryDate={formattedDeliveryDate}
                    locale={locale}
                    t={shippingTranslations}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Right column - Desktop only (non-sticky like eBay/Amazon for better UX) */}
        <div className="hidden lg:block">
          <div className="flex flex-col gap-6">
            {/* Price display - eBay/Amazon style with clear hierarchy */}
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className={cn(
                  "text-2xl font-bold tracking-tight",
                  product.original_price && product.original_price > product.price
                    ? "text-price-sale"
                    : "text-foreground"
                )}>
                  {product.price.toFixed(2)} BGN
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-base text-muted-foreground line-through">
                    {product.original_price.toFixed(2)} BGN
                  </span>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="destructive" className="text-xs font-semibold">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Product description */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description || t.noDescriptionAvailable}
            </p>

            {/* Buy buttons - Primary CTA stack like Amazon/eBay */}
            <div className="flex flex-col gap-3">
              <Button className="w-full h-12 text-base font-semibold" size="lg">
                {locale === 'bg' ? 'Купи сега' : 'Buy it now'}
              </Button>
              <Button variant="secondary" className="w-full h-11">
                {locale === 'bg' ? 'Добави в количка' : 'Add to Cart'}
              </Button>
            </div>

            {/* Shipping highlights - Clean list with semantic colors */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-shipping-free/10">
                    <Truck className="size-4 text-shipping-free" />
                  </div>
                  <span className="text-sm font-medium">{t.freeShipping}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-success/10">
                    <RotateCcw className="size-4 text-success" />
                  </div>
                  <span className="text-sm font-medium">{t.returns30Days}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-info/10">
                    <Store className="size-4 text-info" />
                  </div>
                  <span className="text-sm font-medium">
                    {locale === 'bg' ? 'Готово за взимане от' : 'Ready for pickup at'} Sofia
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Card (like product-detail6 Related Items) */}
            {sellerData && (
              <SellerCardDesktop
                seller={sellerData}
                locale={locale}
                t={sellerTranslations}
              />
            )}

            {/* Desktop accordions for additional info */}
            <Accordion type="multiple" className="w-full border-b">
              <AccordionItem value="shipping-details">
                <AccordionTrigger className="text-base font-medium">
                  {t.shipping} & {t.returnsLabel}
                </AccordionTrigger>
                <AccordionContent>
                  <ShippingInfo
                    shippingCost="free"
                    location="Sofia, Bulgaria"
                    deliveryDate={formattedDeliveryDate}
                    locale={locale}
                    t={shippingTranslations}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom buy bar (like product-detail6) */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden w-full border-t bg-background">
        <div className="flex items-center justify-between gap-2 px-4 py-2.5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="size-[3.5rem] overflow-hidden rounded-md shrink-0 bg-muted">
              <img
                src={images[0]}
                alt={product.title}
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate max-w-[120px]">{product.title}</div>
              <div className="text-base font-bold">{product.price.toFixed(2)} BGN</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleWishlistToggle}
              disabled={isWishlistPending}
              aria-label={isWatching ? buyBoxTranslations.watching : buyBoxTranslations.addToWatchlist}
              className={cn(
                "size-10 flex items-center justify-center border rounded-full transition-colors",
                isWatching ? "bg-destructive/10 border-destructive/20" : "bg-background",
                isWishlistPending && "opacity-50"
              )}
            >
              <Heart
                className={cn("size-5", isWatching ? "fill-destructive text-destructive" : "")}
                fill={isWatching ? "currentColor" : "none"}
              />
            </button>
            <Button size="sm">
              {locale === 'bg' ? 'Купи' : 'Buy'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Seller card section styled like product-detail6 "Related Items"
function SellerCardSection({
  seller,
  productId: _productId,
  productTitle: _productTitle,
  productPrice: _productPrice,
  productImages: _productImages,
  locale,
  isFollowing: _isFollowing,
  currentUserId: _currentUserId,
  t,
}: {
  seller: SellerData | null
  productId: string
  productTitle: string
  productPrice: number
  productImages: string[]
  locale: string
  isFollowing: boolean
  currentUserId: string | null
  t: any
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(1)

  useEffect(() => {
    if (!api) return
    const updateCurrent = () => setCurrent(api.selectedScrollSnap() + 1)
    updateCurrent()
    api.on("select", updateCurrent)
    return () => {
      api.off("select", updateCurrent)
    }
  }, [api])

  if (!seller) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium tracking-tight">
          {locale === 'bg' ? 'Продавач' : 'Seller'}
        </h3>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => api?.scrollPrev()}>
            <ChevronLeft className="size-4" />
          </Button>
          <div className="min-w-6 text-center text-sm">
            {current}/2
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => api?.scrollNext()}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      
      <Carousel opts={{ loop: true }} setApi={setApi} className="w-full">
        <CarouselContent>
          {/* Seller info card - styled like "Nature's Revival" */}
          <CarouselItem>
            <div className="rounded-[1.25rem] bg-muted p-2.5">
              <div className="grid grid-cols-[minmax(0,4.125rem)_minmax(0,1fr)] items-center gap-3">
                <Link href={`/${seller.store_slug || seller.id}`}>
                  <div className="aspect-square w-full overflow-hidden rounded-[0.625rem] bg-background">
                    {seller.avatar_url ? (
                      <img
                        src={seller.avatar_url}
                        alt={seller.store_name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                        {seller.store_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex flex-col gap-0.5">
                  <div className="text-sm text-foreground/50">
                    {locale === 'bg' ? 'Продавач' : 'Seller'}
                  </div>
                  <Link
                    href={`/${seller.store_slug || seller.id}`}
                    className="relative block h-fit w-fit !p-0 text-lg leading-[1.5] font-medium after:absolute after:start-0 after:bottom-[0.35rem] after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200 after:content-[''] hover:after:origin-left hover:after:scale-x-100"
                  >
                    {seller.store_name}
                  </Link>
                  <div className="mt-1">
                    {seller.positive_feedback_percentage !== null && (
                      <span className="text-sm text-success font-semibold">
                        {seller.positive_feedback_percentage}% {t.positivePercentage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* View store CTA */}
          <CarouselItem>
            <div className="rounded-[1.25rem] bg-muted p-2.5">
              <div className="grid grid-cols-[minmax(0,4.125rem)_minmax(0,1fr)] items-center gap-3">
                <div className="aspect-square w-full overflow-hidden rounded-[0.625rem] bg-primary/10 flex items-center justify-center">
                  <Store className="size-8 text-primary" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-sm text-foreground/50">{t.similarProduct}</div>
                  <Link
                    href={`/${seller.store_slug || seller.id}`}
                    className="relative block h-fit w-fit !p-0 text-lg leading-[1.5] font-medium after:absolute after:start-0 after:bottom-[0.35rem] after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200 after:content-[''] hover:after:origin-left hover:after:scale-x-100"
                  >
                    {t.viewAllItems}
                  </Link>
                  <div className="mt-1">
                    <Button size="sm" variant="outline" asChild className="h-7 text-xs">
                      <Link href={`/${seller.store_slug || seller.id}`}>
                        {t.viewStore}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  )
}

// Desktop seller card - styled like product-detail6 "Related Items" / "Nature's Revival"
function SellerCardDesktop({
  seller,
  locale,
  t,
}: {
  seller: SellerData
  locale: string
  t: any
}) {
  return (
    <div className="rounded-[1.25rem] bg-muted p-2.5">
      <div className="grid grid-cols-[minmax(0,4.125rem)_minmax(0,1fr)] items-center gap-3">
        <Link href={`/${seller.store_slug || seller.id}`}>
          <div className="aspect-square w-full overflow-hidden rounded-[0.625rem] bg-background">
            {seller.avatar_url ? (
              <img
                src={seller.avatar_url}
                alt={seller.store_name}
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                {seller.store_name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </Link>
        <div className="flex flex-col gap-0.5">
          <div className="text-sm text-foreground/50">
            {locale === 'bg' ? 'Продавач' : 'Seller'}
          </div>
          <Link
            href={`/${seller.store_slug || seller.id}`}
            className="relative block h-fit w-fit !p-0 text-lg leading-[1.5] font-medium after:absolute after:start-0 after:bottom-[0.35rem] after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200 after:content-[''] hover:after:origin-left hover:after:scale-x-100"
          >
            {seller.store_name}
          </Link>
          <div className="mt-1">
            {seller.positive_feedback_percentage !== null ? (
              <span className="text-sm text-success font-semibold">
                {seller.positive_feedback_percentage}% {t.positivePercentage}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">{t.noRatingsYet}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
