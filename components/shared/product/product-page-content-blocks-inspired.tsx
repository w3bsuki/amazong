"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { CheckCircle, ShieldCheck } from "lucide-react"
import { Star } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

import { useWishlist } from "@/components/providers/wishlist-context"

import {
  ProductGallery,
  ProductBuyBox,
  SellerInfoCard,
  ShippingInfo,
  ProductSpecs,
} from "@/components/product"

interface ProductPageContentBlocksInspiredProps {
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

export function ProductPageContentBlocksInspired({
  product,
  seller,
  locale,
  currentUserId,
  isFollowingSeller = false,
  formattedDeliveryDate,
  t,
}: ProductPageContentBlocksInspiredProps) {
  const [isWishlistPending, setIsWishlistPending] = useState(false)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const stickySentinelRef = useRef<HTMLDivElement>(null)

  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWatching = isInWishlist(product.id)

  const images = product.images?.length ? product.images : ["/placeholder.svg"]

  const discountPercentage = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  const sellerData = useMemo(() => {
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
    <div className="w-full">
      {/* Desktop sticky mini header */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 hidden lg:block border-b bg-background transition-transform",
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
        {/* Left */}
        <div className="min-w-0">
          <div className="space-y-3">
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

            <ProductGallery
              images={images}
              title={product.title}
              watchCount={product.watch_count ?? 0}
              isWatching={isWatching}
              onWatchlistToggle={handleWishlistToggle}
              isWatchlistPending={isWishlistPending}
              t={galleryTranslations}
            />

            <Card className="p-4">
              <Tabs defaultValue="about">
                <TabsList className="w-full">
                  <TabsTrigger value="about" className="flex-1">
                    {t.aboutThisItem}
                  </TabsTrigger>
                  <TabsTrigger value="specs" className="flex-1">
                    {t.specifications}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="pt-4">
                  <ProductSpecs
                    productId={product.id}
                    description={product.description}
                    variant="desktop"
                    t={specsTranslations}
                  />
                </TabsContent>

                <TabsContent value="specs" className="pt-4">
                  <ProductSpecs
                    productId={product.id}
                    description={product.description}
                    variant="desktop"
                    t={specsTranslations}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Right sticky column */}
        <div className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <Card className="p-4">
              <ProductBuyBox
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  originalPrice: product.original_price,
                  images,
                  sellerId: product.seller_id,
                  slug: product.slug,
                }}
                sellerStoreSlug={sellerData?.store_slug ?? null}
                currentUserId={currentUserId}
                isWatching={isWatching}
                isWishlistPending={isWishlistPending}
                onWatchlistToggle={handleWishlistToggle}
                discountPercentage={discountPercentage}
                locale={locale}
                t={buyBoxTranslations}
              />

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="size-4 text-verified" />
                  <span className="font-medium">{t.secureTransaction ?? "Secure transaction"}</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {[
                    t.freeDelivery ?? "Free delivery",
                    t.freeReturns ?? "Free returns",
                  ].filter(Boolean).map((row) => (
                    <div key={row} className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-verified mt-0.5" />
                      <span>{row}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <ShippingInfo
                shippingCost="free"
                location="Sofia, Bulgaria"
                deliveryDate={formattedDeliveryDate}
                locale={locale}
                t={shippingTranslations}
              />
            </Card>

            {sellerData && (
              <Card className="p-4">
                <SellerInfoCard
                  seller={sellerData}
                  productId={product.id}
                  productTitle={product.title}
                  productPrice={product.price}
                  productImages={images}
                  variant="compact"
                  locale={locale}
                  isFollowing={isFollowingSeller}
                  currentUserId={currentUserId}
                  t={sellerTranslations}
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
