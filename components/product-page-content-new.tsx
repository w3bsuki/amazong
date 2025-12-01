"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Share,
  Lightning,
  CaretLeft,
  CaretRight,
  Info,
  CaretRight as ChevronRight,
  ShieldCheck,
  Eye,
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
  }
  seller: {
    id: string
    store_name: string
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
  t: _t,
}: ProductPageContentProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWatching, setIsWatching] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [showStickyBuyBox, setShowStickyBuyBox] = useState(false)
  
  const buyBoxRef = useRef<HTMLDivElement>(null)

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

  // Social proof data
  const soldCount = product.reviews_count ? product.reviews_count * 12 : Math.floor(Math.random() * 500) + 100
  const viewedLast24h = Math.floor(Math.random() * 30) + 10
  const watchCount = Math.floor(soldCount * 0.15)

  // Enhanced seller data
  const sellerData = seller ? {
    ...seller,
    positive_feedback_percentage: 100,
    total_items_sold: 505000,
    response_time_hours: 24,
    feedback_score: Math.floor(Math.random() * 1000) + 500,
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
          <div className="bg-[#f7f7f7] dark:bg-muted/30 py-2.5 px-4 mb-4 rounded-lg">
            <div className="flex items-center gap-3 text-sm overflow-x-auto">
              <span className="text-muted-foreground shrink-0">
                {locale === 'bg' ? 'Подобни артикули от' : 'Find similar items from'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
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
              <div className="hidden md:flex items-center gap-1.5 ml-2">
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

        {/* ===== MAIN PRODUCT GRID - eBay 3-Column Layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[70px_1fr_340px] xl:grid-cols-[70px_1fr_380px] 2xl:grid-cols-[76px_1fr_400px] gap-3 lg:gap-4">
          
          {/* === LEFT: Vertical Thumbnails (Desktop) === */}
          <div className="hidden lg:flex flex-col gap-1">
            {images.slice(0, 7).map((img, index) => (
              <button
                key={index}
                onMouseEnter={() => setSelectedImage(index)}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "w-full aspect-square border-2 overflow-hidden bg-white transition-colors",
                  selectedImage === index 
                    ? "border-foreground" 
                    : "border-border hover:border-foreground/50"
                )}
              >
                <Image 
                  src={img} 
                  alt={`View ${index + 1}`} 
                  width={80}
                  height={80}
                  className="object-contain w-full h-full p-0.5" 
                />
              </button>
            ))}
          </div>

          {/* === CENTER: Main Image === */}
          <div className="relative lg:border lg:border-border lg:rounded-lg lg:overflow-hidden lg:bg-white dark:lg:bg-muted/20">
            {/* Viewed badge - eBay style red banner */}
            {viewedLast24h > 5 && (
              <div className="absolute top-0 left-0 right-0 z-10">
                <div className="bg-red-600 text-white text-xs font-semibold py-1.5 px-3 inline-flex items-center gap-1.5">
                  <Eye weight="bold" className="w-3.5 h-3.5" />
                  {viewedLast24h} {locale === 'bg' ? 'ГЛЕДАНИ ЗА 24Ч' : 'VIEWED IN THE LAST 24 HOURS'}
                </div>
              </div>
            )}
            
            {/* Top Right Actions */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => setIsZoomOpen(true)}
                    className="w-9 h-9 flex items-center justify-center bg-white/90 border border-border rounded-full hover:bg-white transition-colors"
                  >
                    <MagnifyingGlassPlus className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{locale === 'bg' ? 'Увеличи' : 'Enlarge'}</p>
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-1.5 bg-white/90 border border-border rounded-full px-2.5 py-1.5">
                <span className="text-sm font-medium text-muted-foreground">{watchCount}</span>
                <button 
                  onClick={() => setIsWatching(!isWatching)}
                  className="hover:scale-110 transition-transform"
                >
                  <Heart 
                    className={cn("w-5 h-5", isWatching ? "fill-red-500 text-red-500" : "text-muted-foreground")} 
                    weight={isWatching ? "fill" : "regular"}
                  />
                </button>
              </div>
            </div>

            {/* Navigation Arrows - eBay style */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white border border-border rounded-full shadow-sm transition-colors"
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                >
                  <CaretLeft className="w-5 h-5" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white border border-border rounded-full shadow-sm transition-colors"
                  onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                >
                  <CaretRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Main Image - eBay style */}
            <div 
              className="aspect-square lg:aspect-auto lg:h-full bg-white dark:bg-muted/20 relative overflow-hidden border border-border lg:border-0 rounded-lg lg:rounded-none cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)}
            >
              <Image
                src={images[selectedImage]}
                alt={product.title}
                fill
                className="object-contain p-4 lg:p-8"
                sizes="(max-width: 1024px) 100vw, 700px"
                priority
              />
              {/* Image Counter - eBay style */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded">
                  {locale === 'bg' ? 'Снимка' : 'Picture'} {selectedImage + 1} {locale === 'bg' ? 'от' : 'of'} {images.length}
                </div>
              )}
            </div>

            {/* Mobile Thumbnails */}
            <div className="lg:hidden flex gap-1.5 overflow-x-auto py-3 -mx-1 px-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "shrink-0 w-16 h-16 border-2 overflow-hidden bg-white transition-colors",
                    selectedImage === index 
                      ? "border-foreground" 
                      : "border-border"
                  )}
                >
                  <Image src={img} alt={`View ${index + 1}`} width={64} height={64} className="object-contain w-full h-full" />
                </button>
              ))}
            </div>

            {/* Zoom Modal - eBay style fullscreen gallery */}
            <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
              <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-white dark:bg-background">
                <DialogTitle className="sr-only">
                  {locale === 'bg' ? 'Преглед на снимка' : 'Image Preview'}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {product.title} - {locale === 'bg' ? 'Снимка' : 'Image'} {selectedImage + 1} {locale === 'bg' ? 'от' : 'of'} {images.length}
                </DialogDescription>
                <DialogClose className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black rounded-full transition-colors">
                  <X className="w-5 h-5 text-white" weight="bold" />
                </DialogClose>
                <div className="relative w-full h-[85vh] flex items-center justify-center">
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-black rounded-full transition-colors"
                        onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                      >
                        <CaretLeft className="w-6 h-6 text-white" />
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-black rounded-full transition-colors"
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

            {/* Share Button - eBay style */}
            <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 lg:px-3">
              <Share className="w-4 h-4" />
              {locale === 'bg' ? 'Сподели' : 'Share'}
            </button>
          </div>

          {/* === RIGHT: Product Details - eBay Clean Style === */}
          <div className="space-y-2 lg:p-3 lg:rounded-lg lg:border lg:border-border lg:bg-background">
            {/* Title - Large, plain BLACK text like eBay */}
            <h1 className="text-xl lg:text-2xl font-normal text-foreground leading-tight">
              {product.title}
            </h1>

            {/* Product Rating - Text link to scroll to reviews */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-4 h-4",
                      star <= Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    )}
                    weight="fill"
                  />
                ))}
              </div>
              <span className="text-sm text-foreground font-medium ml-0.5">{product.rating.toFixed(1)}</span>
              <button
                onClick={() => {
                  const reviewsSection = document.getElementById('product-reviews-section')
                  reviewsSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-sm text-primary hover:underline"
              >
                {locale === 'bg' ? 'Напиши отзив' : 'Write a review'}
              </button>
            </div>

            {/* Seller Row - Single line with stars */}
            {sellerData && (
              <div className="flex items-center gap-2 py-1">
                <Avatar className="h-7 w-7 border shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {sellerData.store_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Link 
                  href={`/store/${sellerData.id}`} 
                  className="font-medium text-primary hover:underline"
                >
                  {sellerData.store_name}
                </Link>
                <span className="text-muted-foreground text-sm">({sellerData.feedback_score})</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-3 h-3",
                        star <= Math.round(sellerData.ratings?.accuracy || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      )}
                      weight="fill"
                    />
                  ))}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-auto" />
              </div>
            )}

            {/* Price Section */}
            <div className="space-y-1 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                  US ${product.price.toFixed(2)}
                </span>
              </div>
              {product.original_price && discountPercentage > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground line-through">
                    US ${product.original_price.toFixed(2)}
                  </span>
                  <span className="text-deal-text font-medium">({discountPercentage}% off)</span>
                </div>
              )}
            </div>

            {/* Condition Row */}
            <div className="flex items-center gap-2 text-sm">
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

            {/* ===== ACTION BUTTONS - eBay Style ===== */}
            <div ref={buyBoxRef} className="space-y-2.5 pt-2">
              <Button className="w-full h-12 text-base font-semibold rounded-full bg-primary hover:bg-primary/90">
                {locale === 'bg' ? 'Купи сега' : 'Buy It Now'}
              </Button>
              <AddToCart
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: images[0],
                  seller_id: product.seller_id
                }}
                currentUserId={currentUserId}
                variant="outline"
                showBuyNow={false}
                className="h-12 text-base font-semibold rounded-full border-primary text-primary hover:bg-primary/5"
              />
              <Button 
                variant="outline" 
                className={cn(
                  "w-full h-12 text-base font-semibold rounded-full gap-2 border-primary text-primary hover:bg-primary/5",
                  isWatching && "bg-blue-50 border-primary text-primary dark:bg-primary/10"
                )}
                onClick={() => setIsWatching(!isWatching)}
              >
                <Heart className={cn("w-5 h-5", isWatching && "fill-current")} weight={isWatching ? "fill" : "regular"} />
                {isWatching 
                  ? (locale === 'bg' ? 'В списъка' : 'Watching') 
                  : (locale === 'bg' ? 'Добави в списък' : 'Add to Watchlist')
                }
              </Button>
            </div>

            {/* Social Proof - eBay style with BLACK text */}
            <div className="flex items-center gap-2 text-sm py-2 text-foreground">
              <Lightning className="w-5 h-5 text-muted-foreground" />
              <span>
                {locale === 'bg' ? 'Популярно.' : 'People are checking this out.'}
                <span className="font-semibold"> {watchCount} </span>
                {locale === 'bg' ? 'добавили в списъка.' : 'have added this to their watchlist.'}
              </span>
            </div>

            {/* ===== SHIPPING INFO ===== */}
            <div className="border-t border-b py-3 text-sm space-y-1.5">
              <div className="flex gap-2">
                <span className="text-muted-foreground shrink-0">{locale === 'bg' ? 'Доставка:' : 'Shipping:'}</span>
                <div>
                  <span className="font-semibold text-shipping-free">{locale === 'bg' ? 'БЕЗПЛАТНА' : 'FREE'}</span>
                  <span> Standard Shipping </span>
                  <button className="text-primary hover:underline">{locale === 'bg' ? 'Виж детайли' : 'See details'}</button>
                  <div className="text-muted-foreground text-xs">{locale === 'bg' ? 'Местоположение: София, България' : 'Located in: Sofia, Bulgaria'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground shrink-0">{locale === 'bg' ? 'Доставка:' : 'Delivery:'}</span>
                <span>{locale === 'bg' ? 'Очаквано между' : 'Est.'} <span className="font-semibold">{formattedDeliveryDate}</span></span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground shrink-0">{locale === 'bg' ? 'Връщане:' : 'Returns:'}</span>
                <span>{locale === 'bg' ? '30 дни безплатно връщане.' : '30 days returns.'} <button className="text-primary hover:underline">{locale === 'bg' ? 'Виж детайли' : 'See details'}</button></span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-muted-foreground shrink-0">{locale === 'bg' ? 'Плащания:' : 'Payments:'}</span>
                <div className="flex items-center gap-1">
                  <div className="h-5 px-1.5 bg-[#003087] text-white text-[10px] font-bold flex items-center rounded-sm">PayPal</div>
                  <div className="h-5 px-1.5 bg-white border text-[10px] font-bold flex items-center rounded-sm text-gray-700">Visa</div>
                  <div className="h-5 px-1.5 bg-white border text-[10px] font-bold flex items-center rounded-sm text-gray-700">MC</div>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="flex items-start gap-2 py-2">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm">
                <span className="font-medium">{locale === 'bg' ? 'Гаранция за връщане' : 'Money Back Guarantee'}</span>
                <span className="text-muted-foreground"> {locale === 'bg' ? 'Получете артикула или парите си.' : 'Get item or money back.'}</span>
                <Link href="#" className="text-primary hover:underline ml-1">{locale === 'bg' ? 'Научете повече' : 'Learn more'}</Link>
              </p>
            </div>
          </div>
        </div>

        {/* ===== ABOUT THIS ITEM Section ===== */}
        <div className="mt-8">
          {/* ===== PRODUCT INFO CONTAINER - Clean & Compact ===== */}
          <div className="py-6">
            {/* Clean Product Info Card */}
            <div className="bg-muted/30 dark:bg-muted/10 border border-border rounded-lg overflow-hidden">
              
              {/* Product Description */}
              {product.description && (
                <div className="p-5 border-b border-border">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    {locale === 'bg' ? 'Описание на продукта' : 'Product Description'}
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Technical Specifications */}
              <div className="p-5 border-b border-border">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {locale === 'bg' ? 'Технически спецификации' : 'Technical Specifications'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
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
              <div className="p-5">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
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
          </div>
        </div>

        {/* ===== SELLER INFORMATION SECTION ===== */}
        {sellerData && (
          <div className="mt-10 pt-8">
            {/* eBay-style two-column layout: Left = Seller Card, Right = Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">
              
              {/* LEFT COLUMN: About Seller Card with background */}
              <div className="bg-seller-card border border-seller-card-border rounded-lg p-5 space-y-4 h-fit">
                {/* Compact seller header with stars + hover preview */}
                <HoverCard openDelay={200} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Link 
                      href={`/store/${sellerData.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <Avatar className="h-12 w-12 border bg-background shrink-0">
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
                        <div className="flex items-center gap-1.5">
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
                      {images.slice(0, 3).map((img, idx) => (
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
                              ${(product.price * (0.8 + Math.random() * 0.4)).toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      ))}
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
                <div className="pt-4 border-t border-border">
                  <h3 className="font-semibold mb-3">
                    {locale === 'bg' ? 'Подробни оценки' : 'Detailed seller ratings'}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {locale === 'bg' ? 'Средно за последните 12 месеца' : 'Average for the last 12 months'}
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { label: locale === 'bg' ? 'Точно описание' : 'Accurate description', value: sellerData.ratings.accuracy },
                      { label: locale === 'bg' ? 'Цена за доставка' : 'Reasonable shipping cost', value: sellerData.ratings.shipping_cost },
                      { label: locale === 'bg' ? 'Скорост на доставка' : 'Shipping speed', value: sellerData.ratings.shipping_speed },
                      { label: locale === 'bg' ? 'Комуникация' : 'Communication', value: sellerData.ratings.communication },
                    ].map((rating) => (
                      <div key={rating.label} className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground flex-1">{rating.label}</span>
                        <Progress value={(rating.value / 5) * 100} className="h-2 w-24" />
                        <span className="text-sm font-medium w-8 text-right">{rating.value.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Seller Feedback List - fills remaining height */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {locale === 'bg' ? 'Обратна връзка за продавача' : 'Seller feedback'} 
                    <span className="text-muted-foreground font-normal ml-1">({sellerData.feedback_count})</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                      {locale === 'bg' ? 'Филтър:' : 'Filter:'}
                    </span>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[140px] h-9">
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
                </div>
                
                {/* Feedback List - eBay style, expands to fill space */}
                <div className="divide-y divide-border flex-1">
                  {sampleFeedback.map((feedback, idx) => (
                    <div key={idx} className="py-4 first:pt-0">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" weight="fill" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-muted-foreground">{feedback.user} ({feedback.score})</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-sm text-muted-foreground">{feedback.date}</span>
                            <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">
                              {locale === 'bg' ? 'Потвърдена покупка' : 'Verified purchase'}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {feedback.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="link" className="mt-4 h-auto p-0 text-primary self-start">
                  {locale === 'bg' ? 'Виж цялата обратна връзка' : 'See all feedback'} →
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== STICKY BUY BOX - eBay style ===== */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg transition-transform duration-300 lg:hidden",
          showStickyBuyBox ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Mini Product Info */}
          <div className="shrink-0 w-12 h-12 bg-white border rounded overflow-hidden">
            <Image
              src={images[0]}
              alt={product.title}
              width={48}
              height={48}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{product.title}</p>
            <p className="text-lg font-bold text-primary">
              {product.price.toLocaleString(locale === 'bg' ? 'bg-BG' : 'en-US', { style: 'currency', currency: 'BGN' })}
            </p>
          </div>
          {/* Quick Action */}
          <Button className="shrink-0 h-10 px-5 rounded-full bg-primary hover:bg-primary/90 font-semibold">
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
                seller_id: product.seller_id
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
