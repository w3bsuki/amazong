"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Lightning,
  CaretLeft,
  CaretRight,
  Info,
  CaretRight as ChevronRight,
  ShieldCheck,
  CheckCircle,
  MagnifyingGlassPlus,
  X,
  Star,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format-price"
import { AddToCart } from "@/components/add-to-cart"
import { ContactSellerButton } from "@/components/contact-seller-button"
import { useWishlist } from "@/lib/wishlist-context"

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
    // Real seller stats (optional - show empty state if null)
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
    // New translation keys for product page
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
  formattedDeliveryDate,
  t,
}: ProductPageContentProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [showStickyBuyBox, setShowStickyBuyBox] = useState(false)
  const [isWishlistPending, setIsWishlistPending] = useState(false)
  
  // Use wishlist context for persisting to database
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWatching = isInWishlist(product.id)
  
  const buyBoxRef = useRef<HTMLDivElement>(null)

  // Handle wishlist toggle
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

  // Sticky buy box scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (buyBoxRef.current) {
        const rect = buyBoxRef.current.getBoundingClientRect()
        // Show sticky when buy box is scrolled out of view (above viewport)
        setShowStickyBuyBox(rect.bottom < 100)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate discount percentage
  const discountPercentage = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  // Use real watch count from product or default to 0
  const watchCount = product.watch_count ?? 0

  // Enhanced seller data - uses real data from props, with fallbacks
  const sellerData = seller ? {
    ...seller,
    store_name: seller.display_name || seller.username || 'Seller',
    store_slug: seller.username,
    positive_feedback_percentage: seller.feedback_percentage ?? null,
    total_items_sold: seller.total_sales ?? null,
    feedback_score: seller.feedback_score ?? null,
    feedback_count: seller.feedback_count ?? null,
    member_since: new Date(seller.created_at).getFullYear().toString(),
    ratings: seller.ratings ?? null,
  } : null

  const images = product.images?.length > 0 ? product.images : ["/placeholder.svg"]

  return (
    <TooltipProvider delayDuration={0}>
      {/* eBay-style Main Layout - Full Width */}
      <div className="w-full">
        
        {/* ===== SELLER BANNER - Trust Blue themed (Mobile + Desktop unified) ===== */}
        {sellerData && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-cta-trust-blue -mx-4 lg:mx-0 lg:mb-4 lg:rounded-lg lg:px-5 lg:py-3">
            <Link 
              href={`/${locale}/${sellerData.store_slug || sellerData.id}`}
              className="flex items-center gap-2.5 flex-1 min-w-0"
            >
              <Avatar className="h-9 w-9 lg:h-10 lg:w-10 border border-white/20 bg-white/10 shrink-0">
                <AvatarFallback className="bg-white/20 text-cta-trust-blue-text text-sm font-semibold">
                  {sellerData.store_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-cta-trust-blue-text truncate">{sellerData.store_name}</span>
                  {sellerData.verified && (
                    <CheckCircle className="w-3.5 h-3.5 text-white shrink-0" weight="fill" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-cta-trust-blue-text/80">
                  {sellerData.positive_feedback_percentage !== null && (
                    <>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3 h-3 fill-amber-300 text-amber-300" weight="fill" />
                        ))}
                      </div>
                      <span>{sellerData.positive_feedback_percentage}%</span>
                      {sellerData.feedback_score !== null && (
                        <>
                          <span>·</span>
                          <span>({sellerData.feedback_score})</span>
                        </>
                      )}
                      {/* Desktop: Show items sold */}
                      {sellerData.total_items_sold !== null && (
                        <>
                          <span className="hidden lg:inline">·</span>
                          <span className="hidden lg:inline">{(sellerData.total_items_sold / 1000).toFixed(0)}K {t.sold}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Link>
            <Link 
              href={`/${locale}/${sellerData.store_slug || sellerData.id}`}
              className="shrink-0 px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium text-cta-trust-blue bg-white rounded-full hover:bg-white/90 active:bg-white/80 transition-colors"
            >
              {t.viewStore}
            </Link>
          </div>
        )}

        {/* ===== MAIN PRODUCT GRID - Unified Container Layout (Desktop) ===== */}
        {/* Desktop: Single unified container with image + buybox inside */}
        {/* Mobile: Edge-to-edge seamless design (no container) */}
        <div className="lg:bg-product-container-bg lg:border lg:border-product-container-border lg:rounded-xl lg:overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_440px]">
          
            {/* === LEFT: Main Image with Thumbnails Inside === */}
            <div className="relative overflow-hidden -mx-4 lg:mx-0 lg:border-r lg:border-border/50">
              {/* Container for thumbnails + main image */}
              <div className="flex">
              {/* Vertical Thumbnails (Desktop) - Inside the container */}
              <div className="hidden lg:flex flex-col gap-2 p-3">
                {images.slice(0, 7).map((img, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => setSelectedImage(index)}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-16 h-16 overflow-hidden rounded-lg shrink-0 transition-opacity",
                      selectedImage === index 
                        ? "opacity-100" 
                        : "opacity-40 hover:opacity-70"
                    )}
                  >
                    <Image 
                      src={img} 
                      alt={`View ${index + 1}`} 
                      width={64}
                      height={64}
                      className="object-contain w-full h-full" 
                    />
                  </button>
                ))}
              </div>
              
              {/* Main Image Area */}
              <div className="flex-1 relative min-h-[320px] sm:min-h-[400px] lg:min-h-[600px]">
                
                {/* Top Right Actions - Vertical stack on mobile, horizontal on desktop */}
                <div className="absolute top-2 sm:top-3 right-4 lg:right-3 z-10 flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => setIsZoomOpen(true)}
                        aria-label={t.enlarge}
                        className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full touch-manipulation"
                      >
                        <MagnifyingGlassPlus className="w-5 h-5 text-foreground/70" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{t.enlarge}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex items-center gap-1 bg-white/80 hover:bg-white rounded-full px-2 py-1">
                    <span className="text-xs font-medium text-muted-foreground">{watchCount}</span>
                    <button 
                      onClick={handleWishlistToggle}
                      disabled={isWishlistPending}
                      aria-label={isWatching ? t.removeFromWatchlist : t.addToWatchlist}
                      aria-pressed={isWatching}
                      className={cn("w-7 h-7 flex items-center justify-center touch-manipulation", isWishlistPending && "opacity-50")}
                    >
                      <Heart 
                        className={cn("w-5 h-5", isWatching ? "fill-deal text-deal" : "text-foreground/70")} 
                        weight={isWatching ? "fill" : "regular"}
                      />
                    </button>
                  </div>
                </div>

                {/* Navigation Arrows - eBay style, 44px min touch target on mobile */}
                {images.length > 1 && (
                  <>
                    <button
                      aria-label={t.previousImage}
                      className="absolute left-4 lg:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-white/80 lg:bg-white/90 hover:bg-white lg:border lg:border-border rounded-full lg:shadow-sm touch-manipulation"
                      onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    >
                      <CaretLeft className="w-6 h-6" />
                    </button>
                    <button
                      aria-label={t.nextImage}
                      className="absolute right-4 lg:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-white/80 lg:bg-white/90 hover:bg-white lg:border lg:border-border rounded-full lg:shadow-sm touch-manipulation"
                      onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    >
                      <CaretRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Main Image - Clean on mobile, no extra border on desktop (container provides it) */}
                <div className="w-full bg-white dark:bg-muted/20 overflow-hidden">
                  <div 
                    className="w-full min-h-[280px] sm:min-h-[360px] lg:min-h-[550px] relative cursor-zoom-in"
                    onClick={() => setIsZoomOpen(true)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsZoomOpen(true)}
                    role="button"
                    tabIndex={0}
                    aria-label={t.clickToEnlarge}
                  >
                    <Image
                      src={images[selectedImage]}
                      alt={product.title}
                      fill
                      className="object-contain p-3 sm:p-4 lg:p-8"
                      sizes="(max-width: 1024px) 100vw, 700px"
                      priority
                    />
                    {/* Image Counter - eBay style */}
                    {images.length > 1 && (
                      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded">
                        {t.picture} {selectedImage + 1} {t.of} {images.length}
                      </div>
                    )}
                  </div>

                  {/* Mobile Thumbnails - 48px touch target */}
                  <div className="lg:hidden flex gap-2 overflow-x-auto py-2 px-4 snap-x snap-mandatory no-scrollbar bg-background">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(index); }}
                        className={cn(
                          "shrink-0 w-16 h-16 overflow-hidden bg-white rounded-lg snap-start touch-manipulation border",
                          selectedImage === index 
                            ? "opacity-100 border-primary" 
                            : "opacity-60 border-transparent hover:opacity-90"
                        )}
                      >
                        <Image src={img} alt={`View ${index + 1}`} width={64} height={64} className="object-contain w-full h-full p-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>{/* End Main Image Area */}
            </div>{/* End flex container */}

            {/* Zoom Modal - eBay style fullscreen gallery */}
            <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
              <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-white dark:bg-background">
                <DialogTitle className="sr-only">
                  {t.imagePreview}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {product.title} - {t.picture} {selectedImage + 1} {t.of} {images.length}
                </DialogDescription>
                <DialogClose className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black rounded-full">
                  <X className="w-5 h-5 text-white" weight="bold" />
                </DialogClose>
                <div className="relative w-full h-[85vh] flex items-center justify-center">
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        aria-label={t.previousImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-black rounded-full"
                        onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                      >
                        <CaretLeft className="w-6 h-6 text-white" />
                      </button>
                      <button
                        aria-label={t.nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-black rounded-full"
                        onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                      >
                        <CaretRight className="w-6 h-6 text-white" />
                      </button>
                    </>
                  )}
                  {/* Main Zoomed Image */}
                  <Image
                    src={images[selectedImage]}
                    alt={product.title}
                    fill
                    className="object-contain p-4"
                    sizes="95vw"
                    priority
                  />
                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm font-medium px-4 py-2 rounded-full">
                      {selectedImage + 1} / {images.length}
                    </div>
                  )}
                </div>
                {/* Thumbnails Strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 justify-center py-4 px-4 border-t bg-muted/30">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                          "w-16 h-16 border-2 overflow-hidden bg-white transition-colors rounded",
                          selectedImage === index 
                            ? "border-primary" 
                            : "border-transparent hover:border-muted-foreground/50"
                        )}
                      >
                        <Image src={img} alt={`View ${index + 1}`} width={64} height={64} className="object-contain w-full h-full" />
                      </button>
                    ))}
                  </div>
                )}
              </DialogContent>
            </Dialog>

          </div>

          {/* === RIGHT: Product Details - Clean Buy Box (inside unified container) === */}
          <div className="px-2 sm:px-0 lg:p-5 xl:p-6 lg:bg-background mt-3 lg:mt-0">
            
            {/* Title + Rating inline */}
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground leading-none">
                {product.title}
              </h1>
              {/* Rating inline with title */}
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

            {/* Description - tight to title (mobile only) */}
            {product.description && (
              <p className="text-sm text-muted-foreground leading-snug mt-0.5 lg:hidden">
                {product.description}
              </p>
            )}

            {/* Condition Row - Desktop only, moved up before price */}
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

            {/* Price Section - Hidden on mobile (shown in sticky bar) */}
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

            {/* Seller Section - Desktop only (Mobile has banner above image) */}
            {sellerData && (
              <>
                {/* Desktop: Enhanced seller card */}
                <div className="hidden lg:block mt-4 p-3 bg-muted/30 dark:bg-muted/20 rounded-lg border border-border/50">
                  <Link 
                    href={`/${locale}/${sellerData.store_slug || sellerData.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <Avatar className="h-10 w-10 border bg-background shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {sellerData.store_name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary group-hover:underline text-base">
                          {sellerData.store_name}
                        </span>
                        {sellerData.verified && (
                          <CheckCircle className="w-4 h-4 text-primary" weight="fill" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {sellerData.positive_feedback_percentage !== null && (
                          <>
                            <span>{sellerData.positive_feedback_percentage}% {t.positivePercentage}</span>
                            {sellerData.total_items_sold !== null && (
                              <>
                                <span>·</span>
                                <span>{(sellerData.total_items_sold / 1000).toFixed(0)}K {t.sold}</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </Link>
                </div>
              </>
            )}

            {/* ===== ACTION BUTTONS - Desktop only, mobile uses sticky bar ===== */}
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

            {/* Social Proof - eBay style with BLACK text */}
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
            <div className="border-t border-b py-2.5 text-sm space-y-2 mt-2">
              <div className="flex gap-2">
                <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{t.shipping}</span>
                <div className="flex-1">
                  <span className="font-semibold text-shipping-free">{t.freeShipping}</span>
                  <span> Standard Shipping </span>
                  <button className="text-primary hover:underline">{t.seeDetails}</button>
                  <div className="text-muted-foreground text-xs mt-0.5">{t.locatedIn} Sofia, Bulgaria</div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{t.deliveryLabel}</span>
                <span>{t.estimatedDelivery} <span className="font-semibold">{formattedDeliveryDate}</span></span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{t.returnsLabel}</span>
                <span>{t.returns30Days} <button className="text-primary hover:underline">{t.seeDetails}</button></span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{t.payments}</span>
                <div className="flex items-center gap-1">
                  <div className="h-5 px-1.5 bg-brand-dark text-white text-xs font-bold flex items-center rounded-sm">PayPal</div>
                  <div className="h-5 px-1.5 bg-background border text-xs font-bold flex items-center rounded-sm text-muted-foreground">Visa</div>
                  <div className="h-5 px-1.5 bg-background border text-xs font-bold flex items-center rounded-sm text-muted-foreground">MC</div>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="flex items-start gap-1.5 py-1.5">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm">
                <span className="font-medium">{t.moneyBackGuarantee}</span>
                <span className="text-muted-foreground"> {t.getItemOrMoneyBack}</span>
                <Link href={`/${locale}/help/buyer-protection`} className="text-primary hover:underline ml-1">{t.learnMore}</Link>
              </p>
            </div>
          </div>
        </div>{/* End unified container */}
      </div>{/* End lg:bg-product-container-bg */}

        {/* ===== ABOUT THIS ITEM Section ===== */}
        <div className="mt-4 lg:mt-6">
          {/* ===== MOBILE: Simple stacked sections ===== */}
          <div className="lg:hidden py-3 space-y-4">
            {/* Technical Specifications */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {t.technicalSpecs}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {[
                  { label: t.itemNumber, value: product.id.slice(0, 8) },
                  { label: t.condition.replace(':', ''), value: t.conditionNew },
                  { label: t.brand, value: 'Generic' },
                  { label: t.type, value: 'Standard' },
                  { label: t.model, value: 'N/A' },
                  { label: t.countryOfOrigin, value: 'Bulgaria' },
                  { label: t.warranty, value: `12 ${t.months}` },
                ].map((spec, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{spec.label}</span>
                    <span className="text-sm font-medium text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Contents */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {t.whatsInTheBox}
              </h4>
              <ul className="space-y-1.5">
                {[
                  `1x ${t.mainProduct}`,
                  `1x ${t.userManual}`,
                  `1x ${t.warrantyCard}`,
                  t.originalPackaging,
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ===== DESKTOP: Card-based 3-column layout (Dashboard style) ===== */}
          <div className="hidden lg:block pt-6">
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Description Card */}
              <div className="bg-muted/30 dark:bg-muted/10 border border-border/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full" />
                  {t.description}
                </h3>
                {product.description ? (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/60 italic">
                    {t.noDescriptionAvailable}
                  </p>
                )}
              </div>

              {/* Specifications Card */}
              <div className="bg-muted/30 dark:bg-muted/10 border border-border/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-info rounded-full" />
                  {t.specifications}
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: t.itemNumber, value: product.id.slice(0, 8) },
                    { label: t.condition.replace(':', ''), value: t.conditionNew },
                    { label: t.brand, value: 'Generic' },
                    { label: t.countryOfOrigin, value: 'Bulgaria' },
                    { label: t.warranty, value: `12 ${t.months}` },
                  ].map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0">
                      <span className="text-sm text-muted-foreground">{spec.label}</span>
                      <span className="text-sm font-medium text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contents Card */}
              <div className="bg-muted/30 dark:bg-muted/10 border border-border/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-success rounded-full" />
                  {t.inTheBox}
                </h3>
                <ul className="space-y-2.5">
                  {[
                    { qty: '1×', item: t.mainProduct },
                    { qty: '1×', item: t.userManual },
                    { qty: '1×', item: t.warrantyCard },
                    { qty: '✓', item: t.originalPackaging },
                  ].map((content, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm">
                      <span className="w-6 h-6 flex items-center justify-center bg-success/10 text-success text-xs font-semibold rounded-md shrink-0">
                        {content.qty}
                      </span>
                      <span className="text-foreground">{content.item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SELLER INFORMATION SECTION ===== */}
        {sellerData && (
          <div className="mt-3 lg:mt-8 pt-3 lg:pt-6 border-t border-border">
            {/* eBay-style two-column layout: Left = Seller Card, Right = Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-3 lg:gap-6">
              
              {/* LEFT COLUMN: About Seller Card with background */}
              <div className="bg-seller-card border border-seller-card-border rounded-lg p-4 space-y-3 h-fit">
                {/* Compact seller header with stars + hover preview */}
                <HoverCard openDelay={200} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Link 
                      href={`/${locale}/${sellerData.store_slug || sellerData.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <Avatar className="h-11 w-11 border bg-background shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-base font-semibold">
                          {sellerData.store_name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary group-hover:underline truncate">
                            {sellerData.store_name}
                          </span>
                          {sellerData.feedback_score !== null && (
                            <span className="text-muted-foreground text-sm shrink-0">({sellerData.feedback_score})</span>
                          )}
                        </div>
                        {sellerData.positive_feedback_percentage !== null && (
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                                  weight="fill"
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {sellerData.positive_feedback_percentage}%
                            </span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="w-72 p-0" sideOffset={8}>
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium">
                        {t.moreFrom} {sellerData.store_name}
                      </p>
                    </div>
                    <div className="p-2 space-y-1">
                      {/* Sample seller products - would come from API */}
                      {images.slice(0, 3).map((img, idx) => {
                        // Deterministic price variation based on index
                        const priceMultiplier = [0.85, 1.1, 0.95][idx] || 1
                        return (
                          <Link
                            key={idx}
                            href={`/${locale}/${sellerData.store_slug || sellerData.id}`}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                          >
                            <div className="w-12 h-12 border rounded bg-white shrink-0 overflow-hidden">
                              <Image src={img} alt="" width={48} height={48} className="object-contain w-full h-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">
                                {t.similarProduct} #{idx + 1}
                              </p>
                              <p className="text-sm font-semibold text-primary">
                                {formatPrice(product.price * priceMultiplier, { locale })}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                    <div className="p-2 border-t border-border">
                      <Link
                        href={`/${locale}/${sellerData.store_slug || sellerData.id}`}
                        className="block text-center text-sm text-primary hover:underline py-1"
                      >
                        {t.viewAllItems} →
                      </Link>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {/* Contact Seller Button - Small */}
                <ContactSellerButton
                  sellerId={sellerData.id}
                  productId={product.id}
                  productTitle={product.title}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full"
                  showIcon={true}
                  showLabel={true}
                />

                {/* Detailed Ratings - Under buttons on left side */}
                <div className="pt-3 border-t border-border">
                  <h3 className="font-semibold text-sm mb-2">
                    {t.detailedSellerRatings}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t.averageLast12Months}
                  </p>
                  {sellerData.ratings ? (
                    <div className="space-y-2">
                      {[
                        { label: t.accurateDescription, value: sellerData.ratings.accuracy },
                        { label: t.reasonableShippingCost, value: sellerData.ratings.shipping_cost },
                        { label: t.shippingSpeed, value: sellerData.ratings.shipping_speed },
                        { label: t.communication, value: sellerData.ratings.communication },
                      ].map((rating) => (
                        <div key={rating.label} className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground flex-1">{rating.label}</span>
                          <Progress 
                            value={(rating.value / 5) * 100} 
                            className="h-2 w-20"
                            aria-label={`${rating.label}: ${rating.value} out of 5`}
                          />
                          <span className="text-sm font-medium w-8 text-right">{rating.value.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">{t.noRatingsYet}</p>
                  )}
                </div>
              </div>

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
                
                {/* Feedback List - Compact spacing */}
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
                
                {/* See all feedback button - tight margin */}
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

      {/* ===== MOBILE STICKY BAR - Compact, 44px min touch targets ===== */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-sm border-t shadow-[0_-2px_10px_rgba(0,0,0,0.08)] lg:hidden pb-safe">
        <div className="px-3 py-2.5 flex items-center gap-2.5">
          {/* Title & Price - Compact */}
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
          {/* Watchlist button */}
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
          {/* Buy Now button */}
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



      {/* Desktop Sticky Buy Box - appears at top */}
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-md transition-transform duration-300 hidden lg:block",
          showStickyBuyBox ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4">
          {/* Mini Product Info */}
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
          {/* Quick Actions */}
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
