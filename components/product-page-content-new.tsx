"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Heart,
  Lightning,
  Info,
  Star,
  CheckCircle,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format-price"
import { AddToCart } from "@/components/add-to-cart"
import { useWishlist } from "@/components/providers/wishlist-context"

// Import extracted components
import {
  ProductGallery,
  SellerInfoCard,
  ShippingInfo,
  ProductSpecs,
} from "@/components/product"

interface ProductPageContentProps {
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
  sellerFeedback?: Array<{
    id: string
    user: string
    score: number
    text: string
    date: string
  }>
  locale: string
  currentUserId: string | null
  isFollowingSeller?: boolean
  formattedDeliveryDate: string
  t: {
    inStock: string
    freeDeliveryDate: string
    shipsFrom: string
    amazonStore: string
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
    seeDetails: string
    viewStore: string
    enlarge: string
    addToWatchlist: string
    removeFromWatchlist: string
    watching: string
    picture: string
    of: string
    popularItem: string
    watchlistCount: string
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
    detailedSellerRatings: string
    averageLast12Months: string
    accurateDescription: string
    reasonableShippingCost: string
    shippingSpeed: string
    communication: string
    sellerFeedback: string
    allRatings: string
    positive: string
    neutral: string
    negative: string
    seeAllFeedback: string
    noDescriptionAvailable: string
    previousImage: string
    nextImage: string
    imagePreview: string
    clickToEnlarge: string
    sold: string
    positivePercentage: string
    moreFrom: string
    similarProduct: string
    viewAllItems: string
    noFeedbackYet: string
    noRatingsYet: string
  }
}

export function ProductPageContent({
  product,
  seller,
  sellerFeedback = [],
  locale,
  currentUserId,
  isFollowingSeller = false,
  formattedDeliveryDate,
  t,
}: ProductPageContentProps) {
  const [showStickyBuyBox, setShowStickyBuyBox] = useState(false)
  const [isWishlistPending, setIsWishlistPending] = useState(false)
  
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWatching = isInWishlist(product.id)
  
  const buyBoxRef = useRef<HTMLDivElement>(null)

  const handleWishlistToggle = async () => {
    setIsWishlistPending(true)
    try {
      await toggleWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] || "/placeholder.svg",
      })
    } finally {
      setIsWishlistPending(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (buyBoxRef.current) {
        const rect = buyBoxRef.current.getBoundingClientRect()
        setShowStickyBuyBox(rect.bottom < 100)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const discountPercentage = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  const watchCount = product.watch_count ?? 0

  // Transform seller data to match component interface
  const sellerData = seller ? {
    id: seller.id,
    store_name: seller.display_name || seller.username || 'Seller',
    store_slug: seller.username,
    verified: seller.verified,
    positive_feedback_percentage: seller.feedback_percentage ?? null,
    total_items_sold: seller.total_sales ?? null,
    feedback_score: seller.feedback_score ?? null,
    feedback_count: seller.feedback_count ?? null,
    member_since: new Date(seller.created_at).getFullYear().toString(),
    ratings: seller.ratings ?? null,
  } : null

  const images = product.images?.length > 0 ? product.images : ["/placeholder.svg"]

  // Translation objects for sub-components
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
    seeDetails: t.seeDetails,
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
    <TooltipProvider delayDuration={0}>
      <div className="w-full">
        
        {/* ===== SELLER BANNER ===== */}
        {sellerData && (
          <SellerInfoCard
            seller={sellerData}
            productId={product.id}
            productTitle={product.title}
            productPrice={product.price}
            productImages={images}
            variant="banner"
            locale={locale}
            isFollowing={isFollowingSeller}
            currentUserId={currentUserId}
            t={sellerTranslations}
          />
        )}

        {/* ===== MAIN PRODUCT GRID ===== */}
        <div className="lg:bg-product-container-bg lg:border lg:border-product-container-border lg:rounded-xl lg:overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_440px]">
          
            {/* === LEFT: Product Gallery === */}
            <ProductGallery
              images={images}
              title={product.title}
              watchCount={watchCount}
              isWatching={isWatching}
              onWatchlistToggle={handleWishlistToggle}
              isWatchlistPending={isWishlistPending}
              t={galleryTranslations}
            />

            {/* === RIGHT: Product Details Buy Box === */}
            <div className="px-2 sm:px-0 lg:p-5 xl:p-6 lg:bg-background mt-3 lg:mt-0">
              
              {/* Title + Rating inline */}
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground leading-none">
                  {product.title}
                </h1>
                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-3.5 h-3.5 sm:w-4 sm:h-4",
                          star <= Math.round(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        )}
                        weight="fill"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-foreground font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">({product.reviews_count || 0})</span>
                </div>
              </div>

              {/* Description - mobile only */}
              {product.description && (
                <p className="text-sm text-muted-foreground leading-snug mt-0.5 lg:hidden">
                  {product.description}
                </p>
              )}

              {/* Condition Row - Desktop only */}
              <div className="hidden lg:flex items-center gap-2 text-sm mt-2">
                <span className="text-muted-foreground">{t.condition}</span>
                <span className="font-medium text-foreground">{t.conditionNew}</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{t.conditionNew}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Price Section - Desktop only */}
              <div className="hidden lg:block mt-3">
                <span className="text-3xl font-bold text-foreground tracking-tight">
                  {formatPrice(product.price, { locale })}
                </span>
                {product.original_price && discountPercentage > 0 && (
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-muted-foreground line-through">
                      {formatPrice(product.original_price, { locale })}
                    </span>
                    <span className="text-deal-text font-semibold">(-{discountPercentage}%)</span>
                  </div>
                )}
              </div>

              {/* Seller Section - Desktop only (compact card) */}
              {sellerData && (
                <div className="hidden lg:block mt-4">
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
                </div>
              )}

              {/* ===== ACTION BUTTONS - Desktop only ===== */}
              <div ref={buyBoxRef} className="hidden lg:block space-y-2 mt-4 pt-4 border-t border-border/50">
                <AddToCart
                  product={{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: images[0],
                    seller_id: product.seller_id,
                    slug: product.slug,
                    storeSlug: sellerData?.store_slug,
                  }}
                  currentUserId={currentUserId}
                  variant="buyNowOnly"
                  showBuyNow={true}
                  className="h-12 text-base font-semibold rounded-full touch-manipulation"
                />
                <AddToCart
                  product={{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: images[0],
                    seller_id: product.seller_id,
                    slug: product.slug,
                    storeSlug: sellerData?.store_slug,
                  }}
                  currentUserId={currentUserId}
                  variant="outline"
                  showBuyNow={false}
                  className="h-12 text-base font-semibold rounded-full border-primary text-primary hover:bg-primary/5 touch-manipulation"
                />
                <Button 
                  variant="outline" 
                  disabled={isWishlistPending}
                  className={cn(
                    "w-full h-12 text-base font-semibold rounded-full gap-2 border-primary text-primary hover:bg-primary/5 touch-manipulation",
                    isWatching && "bg-blue-50 border-primary text-primary dark:bg-primary/10"
                  )}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={cn("w-5 h-5", isWatching && "fill-current", isWishlistPending && "animate-pulse")} weight={isWatching ? "fill" : "regular"} />
                  {isWatching ? t.watching : t.addToWatchlist}
                </Button>
              </div>

              {/* Social Proof */}
              {watchCount > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-foreground mt-0.5">
                  <Lightning className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>
                    {t.popularItem}
                    <span className="font-semibold"> {watchCount} </span>
                    {t.watchlistCount.replace('{count}', '')}
                  </span>
                </div>
              )}

              {/* ===== SHIPPING INFO ===== */}
              <ShippingInfo
                shippingCost="free"
                location="Sofia, Bulgaria"
                deliveryDate={formattedDeliveryDate}
                locale={locale}
                t={shippingTranslations}
              />
            </div>
          </div>
        </div>

        {/* ===== ABOUT THIS ITEM Section ===== */}
        <div className="mt-4 lg:mt-6">
          {/* Mobile specs */}
          <ProductSpecs
            productId={product.id}
            description={product.description}
            variant="mobile"
            t={specsTranslations}
          />
          {/* Desktop specs */}
          <ProductSpecs
            productId={product.id}
            description={product.description}
            variant="desktop"
            t={specsTranslations}
          />
        </div>

        {/* ===== SELLER INFORMATION SECTION ===== */}
        {sellerData && (
          <div className="mt-3 lg:mt-8 pt-3 lg:pt-6 border-t border-border">
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-3 lg:gap-6">
              
              {/* LEFT COLUMN: Full Seller Card with ratings */}
              <SellerInfoCard
                seller={sellerData}
                productId={product.id}
                productTitle={product.title}
                productPrice={product.price}
                productImages={images}
                variant="full"
                locale={locale}
                isFollowing={isFollowingSeller}
                currentUserId={currentUserId}
                t={sellerTranslations}
              />

              {/* RIGHT COLUMN: Seller Feedback List */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold">
                    {t.sellerFeedback} 
                    {sellerData.feedback_count !== null && (
                      <span className="text-muted-foreground font-normal ml-1">({sellerData.feedback_count})</span>
                    )}
                  </h3>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px] h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allRatings}</SelectItem>
                      <SelectItem value="positive">{t.positive}</SelectItem>
                      <SelectItem value="neutral">{t.neutral}</SelectItem>
                      <SelectItem value="negative">{t.negative}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {sellerFeedback.length > 0 ? (
                  <div className="divide-y divide-border">
                    {sellerFeedback.map((feedback) => (
                      <div key={feedback.id} className="py-3 first:pt-0">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" weight="fill" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="text-sm text-muted-foreground">{feedback.user} ({feedback.score})</span>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-sm text-muted-foreground">{feedback.date}</span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">
                              {feedback.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic py-4">{t.noFeedbackYet}</p>
                )}
                
                {sellerFeedback.length > 0 && (
                  <Button variant="link" className="mt-1 mb-0 h-auto p-0 text-sm text-primary self-start">
                    {t.seeAllFeedback} →
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== MOBILE STICKY BAR ===== */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-sm border-t shadow-[0_-2px_10px_rgba(0,0,0,0.08)] lg:hidden pb-safe">
        <div className="px-3 py-2.5 flex items-center gap-2.5">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate leading-tight">{product.title}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-foreground tracking-tight">{formatPrice(product.price, { locale })}</span>
              {product.original_price && discountPercentage > 0 && (
                <>
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(product.original_price, { locale })}</span>
                  <span className="text-xs text-destructive font-semibold">-{discountPercentage}%</span>
                </>
              )}
            </div>
          </div>
          <button 
            onClick={handleWishlistToggle}
            disabled={isWishlistPending}
            className={cn(
              "shrink-0 size-11 flex items-center justify-center rounded-full border touch-manipulation",
              isWatching 
                ? "bg-primary/10 border-primary text-primary" 
                : "border-input bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20",
              isWishlistPending && "opacity-50"
            )}
            aria-label={isWatching ? t.watching : t.addToWatchlist}
          >
            <Heart className={cn("size-5", isWatching && "fill-current", isWishlistPending && "animate-pulse")} weight={isWatching ? "fill" : "regular"} />
          </button>
          <AddToCart
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              image: images[0],
              seller_id: product.seller_id,
              slug: product.slug,
              storeSlug: sellerData?.store_slug,
            }}
            currentUserId={currentUserId}
            variant="buyNowOnly"
            showBuyNow={true}
            className="flex-1 min-w-0 h-11 px-6 rounded-full font-semibold text-sm shadow-sm touch-manipulation"
          />
        </div>
      </div>

      {/* Desktop Sticky Buy Box */}
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-md transition-transform duration-300 hidden lg:block",
          showStickyBuyBox ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4">
          <div className="shrink-0 w-14 h-14 bg-white border rounded overflow-hidden">
            <Image
              src={images[0]}
              alt={product.title}
              width={56}
              height={56}
              className="object-contain w-full h-full p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate max-w-md">{product.title}</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price, { locale })}
              </span>
              {product.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.original_price, { locale })}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AddToCart
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: images[0],
                seller_id: product.seller_id,
                slug: product.slug,
                storeSlug: sellerData?.store_slug,
              }}
              currentUserId={currentUserId}
              variant="buyNowOnly"
              showBuyNow={true}
              className="h-10 px-6 rounded-full font-semibold"
            />
            <AddToCart
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: images[0],
                seller_id: product.seller_id,
                slug: product.slug,
                storeSlug: sellerData?.store_slug,
              }}
              currentUserId={currentUserId}
              variant="outline"
              showBuyNow={false}
              className="h-10 px-4 rounded-full border-primary text-primary hover:bg-primary/5 font-medium"
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
