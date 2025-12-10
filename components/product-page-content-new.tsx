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
  }
  seller: {
    id: string
    store_name: string
    store_slug?: string
    verified: boolean
    created_at: string
  } | null
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
  }
}

export function ProductPageContent({
  product,
  seller,
  locale,
  currentUserId,
  formattedDeliveryDate,
  t: _t, // TODO: Replace inline locale checks with t.* translations
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

  // Social proof data - deterministic values based on product data for SSR hydration
  const soldCount = product.reviews_count ? product.reviews_count * 12 : 150
  const watchCount = Math.floor(soldCount * 0.15)

  // Enhanced seller data - deterministic values for SSR
  const sellerData = seller ? {
    ...seller,
    positive_feedback_percentage: 100,
    total_items_sold: 505000,
    response_time_hours: 24,
    feedback_score: 798,
    feedback_count: 746,
    member_since: new Date(seller.created_at).getFullYear().toString(),
    ratings: {
      accuracy: 5.0,
      shipping_cost: 5.0,
      shipping_speed: 5.0,
      communication: 5.0,
    }
  } : null

  // Sample seller feedback data
  const sampleFeedback = [
    { 
      user: "j***n", 
      score: 156, 
      text: locale === 'bg' 
        ? 'Страхотен продавач! Бързо изпращане и добре опаковано.' 
        : 'Great seller! Fast shipping and well packaged.',
      date: locale === 'bg' ? 'Последните 6 месеца' : 'Past 6 months'
    },
    { 
      user: "m***a", 
      score: 89, 
      text: locale === 'bg'
        ? 'Продуктът отговаря на описанието. Препоръчвам!'
        : 'Product matches description. Recommend!',
      date: locale === 'bg' ? 'Последните 6 месеца' : 'Past 6 months'
    },
    { 
      user: "s***k", 
      score: 234, 
      text: locale === 'bg'
        ? 'Отлична комуникация, бърза доставка. Ще купя отново.'
        : 'Excellent communication, fast delivery. Will buy again.',
      date: locale === 'bg' ? 'Последните 6 месеца' : 'Past 6 months'
    },
  ]

  const images = product.images?.length > 0 ? product.images : ["/placeholder.svg"]

  return (
    <TooltipProvider delayDuration={0}>
      {/* eBay-style Main Layout - Full Width */}
      <div className="w-full">
        
        {/* Similar Items Banner - eBay style - full width within container */}
        {sellerData && (
          <div className="bg-[#f7f7f7] dark:bg-muted/30 py-1.5 lg:py-2.5 px-2 sm:px-3 lg:px-4 mb-2 lg:mb-4 rounded-md">
            {/* Mobile: Single row compact layout with truncation */}
            <div className="flex items-center gap-2 lg:hidden text-sm overflow-hidden">
              <span className="text-muted-foreground shrink-0">
                {locale === 'bg' ? 'Подобни артикули от' : 'Similar from'}
              </span>
              <Avatar className="h-4 w-4 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {sellerData.store_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Link href={`/store/${sellerData.id}`} className="font-medium text-primary hover:underline truncate">
                {sellerData.store_name}
              </Link>
              <span className="text-muted-foreground shrink-0">
                ({(sellerData.total_items_sold / 1000).toFixed(0)}K)
              </span>
              <span className="text-muted-foreground/60 text-xs shrink-0 ml-auto">
                {locale === 'bg' ? 'Спонсорирано' : 'Ad'}
              </span>
            </div>
            {/* Desktop: Single row layout */}
            <div className="hidden lg:flex items-center gap-3 text-sm">
              <span className="text-muted-foreground shrink-0">
                {locale === 'bg' ? 'Подобни артикули от' : 'Find similar items from'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {sellerData.store_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Link href={`/store/${sellerData.id}`} className="font-medium text-primary hover:underline">
                  {sellerData.store_name}
                </Link>
                <span className="text-muted-foreground">
                  ({(sellerData.total_items_sold / 1000).toFixed(0)}K {locale === 'bg' ? 'продадени' : 'items sold'})
                </span>
              </div>
              {/* Product thumbnails from seller */}
              <div className="flex items-center gap-1.5 ml-2">
                {images.slice(0, 5).map((img, i) => (
                  <div key={i} className="w-10 h-10 border border-border rounded bg-white overflow-hidden">
                    <Image src={img} alt="" width={40} height={40} className="object-contain w-full h-full" />
                  </div>
                ))}
              </div>
              <Link 
                href={`/store/${sellerData.id}`} 
                className="text-primary hover:underline font-medium shrink-0 ml-auto"
              >
                {locale === 'bg' ? 'Магазин' : 'Shop store on eBay'}
              </Link>
              <span className="text-muted-foreground text-xs shrink-0">
                {locale === 'bg' ? 'Спонсорирано' : 'Sponsored'}
              </span>
            </div>
          </div>
        )}

        {/* ===== MAIN PRODUCT GRID - eBay 2-Column Layout with Thumbnails inside Image Container ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] 2xl:grid-cols-[1fr_400px] lg:gap-4">
          
          {/* === LEFT: Main Image with Thumbnails Inside === */}
          <div className="relative lg:border lg:border-border lg:rounded-lg lg:bg-white dark:lg:bg-muted/20 overflow-hidden">
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
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => setIsZoomOpen(true)}
                        aria-label={locale === 'bg' ? 'Увеличи снимка' : 'Enlarge image'}
                        className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full touch-manipulation"
                      >
                        <MagnifyingGlassPlus className="w-5 h-5 text-foreground/70" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{locale === 'bg' ? 'Увеличи' : 'Enlarge'}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex items-center gap-1 bg-white/80 hover:bg-white rounded-full px-2 py-1">
                    <span className="text-xs font-medium text-muted-foreground">{watchCount}</span>
                    <button 
                      onClick={handleWishlistToggle}
                      disabled={isWishlistPending}
                      aria-label={isWatching ? (locale === 'bg' ? 'Премахни от списък' : 'Remove from watchlist') : (locale === 'bg' ? 'Добави в списък' : 'Add to watchlist')}
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
                      aria-label={locale === 'bg' ? 'Предишна снимка' : 'Previous image'}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-11 sm:h-11 flex items-center justify-center bg-white/90 hover:bg-white border border-border rounded-full shadow-sm touch-manipulation"
                      onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    >
                      <CaretLeft className="w-6 h-6" />
                    </button>
                    <button
                      aria-label={locale === 'bg' ? 'Следваща снимка' : 'Next image'}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-11 sm:h-11 flex items-center justify-center bg-white/90 hover:bg-white border border-border rounded-full shadow-sm touch-manipulation"
                      onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    >
                      <CaretRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Main Image - eBay style */}
                <div className="w-full bg-white dark:bg-muted/20 border border-border lg:border-0 rounded-lg lg:rounded-none overflow-hidden">
                  <div 
                    className="w-full min-h-[280px] sm:min-h-[360px] lg:min-h-[550px] relative cursor-zoom-in"
                    onClick={() => setIsZoomOpen(true)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsZoomOpen(true)}
                    role="button"
                    tabIndex={0}
                    aria-label={locale === 'bg' ? 'Натисни за увеличаване' : 'Click to enlarge'}
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
                        {locale === 'bg' ? 'Снимка' : 'Picture'} {selectedImage + 1} {locale === 'bg' ? 'от' : 'of'} {images.length}
                      </div>
                    )}
                  </div>

                  {/* Mobile Thumbnails - 48px touch target */}
                  <div className="lg:hidden flex gap-2.5 overflow-x-auto py-2.5 px-2 snap-x snap-mandatory no-scrollbar">
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
                  {locale === 'bg' ? 'Преглед на снимка' : 'Image Preview'}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {product.title} - {locale === 'bg' ? 'Снимка' : 'Image'} {selectedImage + 1} {locale === 'bg' ? 'от' : 'of'} {images.length}
                </DialogDescription>
                <DialogClose className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black rounded-full">
                  <X className="w-5 h-5 text-white" weight="bold" />
                </DialogClose>
                <div className="relative w-full h-[85vh] flex items-center justify-center">
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        aria-label={locale === 'bg' ? 'Предишна снимка' : 'Previous image'}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-black rounded-full"
                        onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                      >
                        <CaretLeft className="w-6 h-6 text-white" />
                      </button>
                      <button
                        aria-label={locale === 'bg' ? 'Следваща снимка' : 'Next image'}
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

          {/* === RIGHT: Product Details - eBay Clean Style === */}
          <div className="px-2 sm:px-0 lg:p-3 lg:rounded-lg lg:border lg:border-border lg:bg-background mt-3 lg:mt-0">
            
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
              <span className="text-muted-foreground">{locale === 'bg' ? 'Състояние:' : 'Condition:'}</span>
              <span className="font-medium text-foreground">{locale === 'bg' ? 'Ново' : 'New'}</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{locale === 'bg' ? 'Чисто нов, неизползван продукт' : 'A brand-new, unused item'}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Price Section - Hidden on mobile (shown in sticky bar) */}
            <div className="hidden lg:block mt-3">
              <span className="text-3xl font-bold text-foreground tracking-tight">
                US ${product.price.toFixed(2)}
              </span>
              {product.original_price && discountPercentage > 0 && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="text-muted-foreground line-through">
                    US ${product.original_price.toFixed(2)}
                  </span>
                  <span className="text-deal-text font-semibold">({discountPercentage}% off)</span>
                </div>
              )}
            </div>

            {/* Seller Section - Desktop: Bigger card-like display, Mobile: compact inline */}
            {sellerData && (
              <>
                {/* Mobile: Compact inline seller */}
                <Link 
                  href={`/store/${sellerData.id}`}
                  className="inline-flex items-center gap-1.5 mt-1 text-sm group lg:hidden"
                >
                  <Avatar className="h-5 w-5 border shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {sellerData.store_name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-primary group-hover:underline">{sellerData.store_name}</span>
                  <span className="text-muted-foreground">({sellerData.feedback_score})</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 fill-amber-400 text-amber-400" weight="fill" />
                    ))}
                  </div>
                </Link>

                {/* Desktop: Enhanced seller card */}
                <div className="hidden lg:block mt-4 p-3 bg-muted/30 dark:bg-muted/20 rounded-lg border border-border/50">
                  <Link 
                    href={`/store/${sellerData.id}`}
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
                        <span>{sellerData.positive_feedback_percentage}% {locale === 'bg' ? 'положителни' : 'positive'}</span>
                        <span>·</span>
                        <span>{(sellerData.total_items_sold / 1000).toFixed(0)}K {locale === 'bg' ? 'продадени' : 'sold'}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </Link>
                </div>
              </>
            )}

            {/* ===== ACTION BUTTONS - Desktop only, mobile uses sticky bar ===== */}
            <div ref={buyBoxRef} className="hidden lg:block space-y-2 mt-4 pt-4 border-t border-border/50">
              <Button className="w-full h-12 text-base font-semibold rounded-full bg-primary hover:bg-primary/90 touch-manipulation">
                {locale === 'bg' ? 'Купи сега' : 'Buy It Now'}
              </Button>
              <AddToCart
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: images[0],
                  seller_id: product.seller_id,
                  slug: product.slug,
                  storeSlug: seller?.store_slug,
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
                {isWatching 
                  ? (locale === 'bg' ? 'В списъка' : 'Watching') 
                  : (locale === 'bg' ? 'Добави в списък' : 'Add to Watchlist')
                }
              </Button>
            </div>

            {/* Social Proof - eBay style with BLACK text */}
            <div className="flex items-center gap-1.5 text-sm text-foreground mt-0.5">
              <Lightning className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>
                {locale === 'bg' ? 'Популярно.' : 'People are checking this out.'}
                <span className="font-semibold"> {watchCount} </span>
                {locale === 'bg' ? 'добавили в списъка.' : 'have added this to their watchlist.'}
              </span>
            </div>

            {/* ===== SHIPPING INFO ===== */}
            <div className="border-t border-b py-2.5 text-sm space-y-2 mt-2">
              <div className="flex gap-2">
                <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{locale === 'bg' ? 'Доставка:' : 'Shipping:'}</span>
                <div className="flex-1">
                  <span className="font-semibold text-shipping-free">{locale === 'bg' ? 'БЕЗПЛАТНА' : 'FREE'}</span>
                  <span> Standard Shipping </span>
                  <button className="text-primary hover:underline">{locale === 'bg' ? 'Виж детайли' : 'See details'}</button>
                  <div className="text-muted-foreground text-xs mt-0.5">{locale === 'bg' ? 'Местоположение: София, България' : 'Located in: Sofia, Bulgaria'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{locale === 'bg' ? 'Доставка:' : 'Delivery:'}</span>
                <span>{locale === 'bg' ? 'Очаквано между' : 'Est.'} <span className="font-semibold">{formattedDeliveryDate}</span></span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{locale === 'bg' ? 'Връщане:' : 'Returns:'}</span>
                <span>{locale === 'bg' ? '30 дни безплатно връщане.' : '30 days returns.'} <button className="text-primary hover:underline">{locale === 'bg' ? 'Виж детайли' : 'See details'}</button></span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{locale === 'bg' ? 'Плащания:' : 'Payments:'}</span>
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
                <span className="font-medium">{locale === 'bg' ? 'Гаранция за връщане' : 'Money Back Guarantee'}</span>
                <span className="text-muted-foreground"> {locale === 'bg' ? 'Получете артикула или парите си.' : 'Get item or money back.'}</span>
                <Link href="#" className="text-primary hover:underline ml-1">{locale === 'bg' ? 'Научете повече' : 'Learn more'}</Link>
              </p>
            </div>
          </div>
        </div>

        {/* ===== ABOUT THIS ITEM Section ===== */}
        <div className="mt-4 lg:mt-6">
          {/* ===== MOBILE: Simple stacked sections ===== */}
          <div className="lg:hidden py-3 space-y-4">
            {/* Technical Specifications */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {locale === 'bg' ? 'Технически спецификации' : 'Technical Specifications'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {[
                  { label: locale === 'bg' ? 'Артикул №' : 'Item number', value: product.id.slice(0, 8) },
                  { label: locale === 'bg' ? 'Състояние' : 'Condition', value: locale === 'bg' ? 'Ново' : 'New' },
                  { label: locale === 'bg' ? 'Марка' : 'Brand', value: 'Generic' },
                  { label: locale === 'bg' ? 'Тип' : 'Type', value: 'Standard' },
                  { label: locale === 'bg' ? 'Модел' : 'Model', value: 'N/A' },
                  { label: locale === 'bg' ? 'Произход' : 'Country of Origin', value: locale === 'bg' ? 'България' : 'Bulgaria' },
                  { label: locale === 'bg' ? 'Гаранция' : 'Warranty', value: locale === 'bg' ? '12 месеца' : '12 months' },
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
                {locale === 'bg' ? 'Съдържание на пакета' : "What's in the Box"}
              </h4>
              <ul className="space-y-1.5">
                {[
                  locale === 'bg' ? '1x Основен продукт' : '1x Main Product',
                  locale === 'bg' ? '1x Инструкции за употреба' : '1x User Manual',
                  locale === 'bg' ? '1x Гаранционна карта' : '1x Warranty Card',
                  locale === 'bg' ? 'Оригинална опаковка' : 'Original Packaging',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ===== DESKTOP: 3-column clean text layout ===== */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-12 pt-4 border-t border-border">
            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {locale === 'bg' ? 'Описание' : 'Description'}
              </h3>
              {product.description ? (
                <p className="text-sm text-foreground leading-relaxed">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {locale === 'bg' ? 'Няма налично описание.' : 'No description available.'}
                </p>
              )}
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {locale === 'bg' ? 'Спецификации' : 'Specifications'}
              </h3>
              <div className="space-y-1">
                {[
                  { label: locale === 'bg' ? 'Артикул' : 'Item #', value: product.id.slice(0, 8) },
                  { label: locale === 'bg' ? 'Състояние' : 'Condition', value: locale === 'bg' ? 'Ново' : 'New' },
                  { label: locale === 'bg' ? 'Марка' : 'Brand', value: 'Generic' },
                  { label: locale === 'bg' ? 'Произход' : 'Origin', value: locale === 'bg' ? 'България' : 'Bulgaria' },
                  { label: locale === 'bg' ? 'Гаранция' : 'Warranty', value: locale === 'bg' ? '12 месеца' : '12 months' },
                ].map((spec, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="text-muted-foreground">{spec.label}:</span>{' '}
                    <span className="text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contents */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {locale === 'bg' ? 'Съдържание' : 'In the Box'}
              </h3>
              <div className="space-y-1 text-sm text-foreground">
                <div>1× {locale === 'bg' ? 'Основен продукт' : 'Main Product'}</div>
                <div>1× {locale === 'bg' ? 'Инструкции' : 'User Manual'}</div>
                <div>1× {locale === 'bg' ? 'Гаранционна карта' : 'Warranty Card'}</div>
                <div>{locale === 'bg' ? 'Оригинална опаковка' : 'Original Packaging'}</div>
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
                      href={`/store/${sellerData.id}`}
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
                          <span className="text-muted-foreground text-sm shrink-0">({sellerData.feedback_score})</span>
                        </div>
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
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="w-72 p-0" sideOffset={8}>
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium">
                        {locale === 'bg' ? 'Други артикули от' : 'More from'} {sellerData.store_name}
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
                            href={`/store/${sellerData.id}`}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                          >
                            <div className="w-12 h-12 border rounded bg-white shrink-0 overflow-hidden">
                              <Image src={img} alt="" width={48} height={48} className="object-contain w-full h-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">
                                {locale === 'bg' ? 'Подобен продукт' : 'Similar product'} #{idx + 1}
                              </p>
                              <p className="text-sm font-semibold text-primary">
                                ${(product.price * priceMultiplier).toFixed(2)}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                    <div className="p-2 border-t border-border">
                      <Link
                        href={`/store/${sellerData.id}`}
                        className="block text-center text-sm text-primary hover:underline py-1"
                      >
                        {locale === 'bg' ? 'Виж всички артикули' : 'View all items'} →
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
                    {locale === 'bg' ? 'Подробни оценки' : 'Detailed seller ratings'}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {locale === 'bg' ? 'Средно за последните 12 месеца' : 'Average for the last 12 months'}
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: locale === 'bg' ? 'Точно описание' : 'Accurate description', value: sellerData.ratings.accuracy },
                      { label: locale === 'bg' ? 'Цена за доставка' : 'Reasonable shipping cost', value: sellerData.ratings.shipping_cost },
                      { label: locale === 'bg' ? 'Скорост на доставка' : 'Shipping speed', value: sellerData.ratings.shipping_speed },
                      { label: locale === 'bg' ? 'Комуникация' : 'Communication', value: sellerData.ratings.communication },
                    ].map((rating) => (
                      <div key={rating.label} className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground flex-1">{rating.label}</span>
                        <Progress value={(rating.value / 5) * 100} className="h-2 w-20" />
                        <span className="text-sm font-medium w-8 text-right">{rating.value.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Seller Feedback List */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold">
                    {locale === 'bg' ? 'Обратна връзка за продавача' : 'Seller feedback'} 
                    <span className="text-muted-foreground font-normal ml-1">({sellerData.feedback_count})</span>
                  </h3>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px] h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{locale === 'bg' ? 'Всички оценки' : 'All ratings'}</SelectItem>
                      <SelectItem value="positive">{locale === 'bg' ? 'Положителни' : 'Positive'}</SelectItem>
                      <SelectItem value="neutral">{locale === 'bg' ? 'Неутрални' : 'Neutral'}</SelectItem>
                      <SelectItem value="negative">{locale === 'bg' ? 'Отрицателни' : 'Negative'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Feedback List - Compact spacing */}
                <div className="divide-y divide-border">
                  {sampleFeedback.map((feedback, idx) => (
                    <div key={idx} className="py-3 first:pt-0">
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
                
                {/* See all feedback button - tight margin */}
                <Button variant="link" className="mt-1 mb-0 h-auto p-0 text-sm text-primary self-start">
                  {locale === 'bg' ? 'Виж цялата обратна връзка' : 'See all feedback'} →
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== MOBILE STICKY BAR - Compact, 44px min touch targets ===== */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-sm border-t shadow-[0_-2px_10px_rgba(0,0,0,0.08)] lg:hidden pb-safe">
        <div className="px-3 py-2.5 flex items-center gap-2.5">
          {/* Price - Compact */}
          <div className="flex-1 min-w-0">
            <span className="text-lg font-bold text-foreground tracking-tight">US ${product.price.toFixed(2)}</span>
            {product.original_price && discountPercentage > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground line-through">US ${product.original_price.toFixed(2)}</span>
                <span className="text-destructive font-semibold">-{discountPercentage}%</span>
              </div>
            )}
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
            aria-label={isWatching ? (locale === 'bg' ? 'В списъка' : 'Watching') : (locale === 'bg' ? 'Добави' : 'Watch')}
          >
            <Heart className={cn("size-5", isWatching && "fill-current", isWishlistPending && "animate-pulse")} weight={isWatching ? "fill" : "regular"} />
          </button>
          {/* Buy Now button */}
          <Button 
            size="lg"
            className="shrink-0 h-11 px-6 rounded-full bg-primary hover:bg-primary/90 font-semibold text-sm shadow-sm touch-manipulation"
          >
            {locale === 'bg' ? 'Купи' : 'Buy Now'}
          </Button>
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
                {product.price.toLocaleString(locale === 'bg' ? 'bg-BG' : 'en-US', { style: 'currency', currency: 'BGN' })}
              </span>
              {product.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.original_price.toLocaleString(locale === 'bg' ? 'bg-BG' : 'en-US', { style: 'currency', currency: 'BGN' })}
                </span>
              )}
            </div>
          </div>
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button className="h-10 px-6 rounded-full bg-primary hover:bg-primary/90 font-semibold">
              {locale === 'bg' ? 'Купи сега' : 'Buy It Now'}
            </Button>
            <AddToCart
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: images[0],
                seller_id: product.seller_id,
                slug: product.slug,
                storeSlug: seller?.store_slug,
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
