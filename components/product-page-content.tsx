"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  ShieldCheck,
  CaretLeft,
  CaretRight,
  CheckCircle,
  Eye,
  Package,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
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
    categories?: {
      id: string
      name: string
      slug: string
      parent_id?: string | null
    } | null
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
  formattedDeliveryDate: _formattedDeliveryDate,
  t,
}: ProductPageContentProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWatching, setIsWatching] = useState(false)

  // Social proof data
  const soldCount = product.reviews_count ? product.reviews_count * 12 : Math.floor(Math.random() * 500) + 100
  const viewedLast24h = Math.floor(soldCount * 0.05) + 5
  const watchCount = Math.floor(soldCount * 0.02) + 3

  // Enhanced seller data
  const sellerData = seller ? {
    ...seller,
    positive_feedback_percentage: 98,
    total_items_sold: 1250,
    response_time_hours: 24,
    feedback_score: 798,
    member_since: `${locale === 'bg' ? 'Дек' : 'Dec'} ${new Date(seller.created_at).getFullYear()}`,
    ratings: {
      accuracy: 4.9,
      shipping_cost: 5.0,
      shipping_speed: 4.8,
      communication: 5.0,
    },
    feedback_count: 746,
  } : null

  const images = product.images?.length > 0 ? product.images : ["/placeholder.svg"]

  // Generate item specs from product data
  const itemSpecs = [
    { label: locale === 'bg' ? 'Състояние' : 'Condition', value: locale === 'bg' ? 'Ново' : 'New' },
    { label: locale === 'bg' ? 'Марка' : 'Brand', value: 'AMZN' },
    { label: locale === 'bg' ? 'Модел' : 'Model', value: product.title.split(' ').slice(0, 2).join(' ') },
    { label: locale === 'bg' ? 'Категория' : 'Category', value: product.categories?.name || 'General' },
  ]

  // Sample feedback data
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

  return (
    <TooltipProvider>
      {/* eBay-style Seller Strip at Top */}
      {sellerData && (
        <div className="border-b border-border -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <Link href={`/store/${sellerData.id}`} className="font-medium text-primary hover:underline text-sm">
                {sellerData.store_name}
              </Link>
              <span className="text-sm text-muted-foreground">
                ({sellerData.feedback_score})
              </span>
              <span className="text-sm text-primary">
                {sellerData.positive_feedback_percentage}% {locale === 'bg' ? 'положителни' : 'positive'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/store/${sellerData.id}`} className="text-primary hover:underline">
                {locale === 'bg' ? 'Други артикули' : "Seller's other items"}
              </Link>
              <ContactSellerButton
                sellerId={sellerData.id}
                productId={product.id}
                productTitle={product.title}
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-primary hover:underline text-sm hover:bg-transparent"
                showIcon={false}
                showLabel={true}
              />
            </div>
          </div>
        </div>
      )}

      <div className="py-6 max-w-7xl mx-auto">
        {/* eBay 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          
          {/* LEFT COLUMN - Images & Details */}
          <div className="space-y-6">
            
            {/* Image Gallery */}
            <div className="flex gap-4">
              {/* Thumbnail Strip - Vertical */}
              {images.length > 1 && (
                <div className="hidden md:flex flex-col gap-2 w-16 shrink-0">
                  {images.slice(0, 6).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      onMouseEnter={() => setSelectedImage(index)}
                      className={cn(
                        "w-16 h-16 rounded border-2 overflow-hidden bg-white dark:bg-muted/20 transition-colors",
                        selectedImage === index ? "border-primary" : "border-border hover:border-primary"
                      )}
                    >
                      <div className="relative w-full h-full">
                        <Image 
                          src={img} 
                          alt={`${locale === 'bg' ? 'Миниатюра' : 'Thumbnail'} ${index + 1}`} 
                          fill 
                          className="object-contain" 
                          sizes="64px" 
                        />
                      </div>
                    </button>
                  ))}
                  {images.length > 6 && (
                    <button className="w-16 h-16 rounded border-2 border-border bg-muted/50 flex items-center justify-center text-xs text-muted-foreground hover:border-primary">
                      +{images.length - 6}
                    </button>
                  )}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 relative">
                {/* Viewed Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="secondary" className="bg-white/95 dark:bg-black/90 text-foreground shadow-sm font-normal text-xs px-2.5 py-1">
                    <Eye className="size-3.5 mr-1.5" />
                    {viewedLast24h} {locale === 'bg' ? 'ГЛЕДАНО ЗА 24Ч' : 'VIEWED IN THE LAST 24 HOURS'}
                  </Badge>
                </div>

                {/* Watchlist Count - Top Right */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                  <button 
                    onClick={() => setIsWatching(!isWatching)}
                    className={cn(
                      "flex items-center gap-1.5 bg-white/95 dark:bg-black/90 rounded-full px-3 py-1.5 text-sm shadow-sm transition-colors",
                      isWatching ? "text-red-500" : "text-foreground hover:text-red-500"
                    )}
                  >
                    <span className="font-medium">{watchCount}</span>
                    <Heart weight={isWatching ? "fill" : "regular"} className="size-5" />
                  </button>
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white/95 dark:bg-black/90 shadow-sm flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
                    >
                      <CaretLeft className="size-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white/95 dark:bg-black/90 shadow-sm flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
                    >
                      <CaretRight className="size-5" />
                    </button>
                  </>
                )}

                {/* Main Image Area */}
                <div className="aspect-square rounded-lg bg-muted/30 border border-border overflow-hidden">
                  {images[0] === "/placeholder.svg" ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Package className="size-20 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">{locale === 'bg' ? 'Снимка' : 'Picture'} {selectedImage + 1} {locale === 'bg' ? 'от' : 'of'} {images.length}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={images[selectedImage]}
                        alt={product.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 600px"
                        priority
                      />
                    </div>
                  )}
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2.5 py-1 rounded">
                  {selectedImage + 1} / {images.length}
                </div>
              </div>
            </div>

            {/* Mobile Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:hidden gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "shrink-0 size-16 rounded border-2 overflow-hidden bg-white dark:bg-muted/20",
                      selectedImage === index ? "border-primary" : "border-border"
                    )}
                  >
                    <div className="relative w-full h-full">
                      <Image 
                        src={img} 
                        alt={`${locale === 'bg' ? 'Миниатюра' : 'Thumbnail'} ${index + 1}`} 
                        fill 
                        className="object-contain" 
                        sizes="64px" 
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Shop with Confidence */}
            <Card className="border-border shadow-none">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="size-8 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">
                      {locale === 'bg' ? 'Пазарувай с доверие' : 'Shop with confidence'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'bg' 
                        ? 'AMZN Гаранция за връщане на парите. Получи артикула или парите си обратно.'
                        : 'AMZN Money Back Guarantee. Get the item you ordered or your money back.'
                      }{" "}
                      <Link href="#" className="text-primary hover:underline">
                        {locale === 'bg' ? 'Научи повече' : 'Learn more'}
                      </Link>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About this item */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{t.aboutThisItem}</h2>
              <p className="text-sm text-muted-foreground">
                {product.description || (locale === 'bg' ? 'Продавачът поема цялата отговорност за този артикул.' : 'Seller assumes all responsibility for this listing.')}
              </p>
              <p className="text-sm text-muted-foreground">
                {locale === 'bg' ? 'AMZN номер на артикула' : 'AMZN item number'}: {product.id.slice(0, 12)}
              </p>
            </div>

            {/* Item Specifics */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{locale === 'bg' ? 'Характеристики' : 'Item specifics'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {itemSpecs.map((spec) => (
                  <div key={spec.label} className="flex gap-2 text-sm">
                    <span className="font-medium text-foreground w-32 shrink-0">{spec.label}</span>
                    <span className="text-muted-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About This Seller - Full Card */}
            {sellerData && (
              <Card className="border-border shadow-none">
                <CardContent className="p-5 space-y-5">
                  <h2 className="text-lg font-semibold">{locale === 'bg' ? 'За този продавач' : 'About this seller'}</h2>
                  
                  {/* Seller Header */}
                  <div className="flex items-start gap-4">
                    <Avatar className="size-14 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {sellerData.store_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Link href={`/store/${sellerData.id}`} className="text-lg font-semibold text-primary hover:underline">
                        {sellerData.store_name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className="font-medium">{sellerData.positive_feedback_percentage}% {locale === 'bg' ? 'положителни отзиви' : 'positive feedback'}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{(sellerData.total_items_sold / 1000).toFixed(1)}K {locale === 'bg' ? 'продадени' : 'items sold'}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{locale === 'bg' ? 'Член от' : 'Joined'} {sellerData.member_since}</span>
                        <span>{locale === 'bg' ? 'Обикновено отговаря до' : 'Usually responds within'} {sellerData.response_time_hours} {locale === 'bg' ? 'часа' : 'hours'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 h-10" asChild>
                      <Link href={`/store/${sellerData.id}`}>
                        {locale === 'bg' ? 'Други артикули' : "Seller's other items"}
                      </Link>
                    </Button>
                    <ContactSellerButton
                      sellerId={sellerData.id}
                      productId={product.id}
                      productTitle={product.title}
                      variant="outline"
                      className="flex-1 h-10"
                      showIcon={false}
                      showLabel={true}
                    />
                  </div>

                  <Separator />

                  {/* Detailed Ratings - 2x2 Grid like eBay */}
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{locale === 'bg' ? 'Подробни оценки' : 'Detailed seller ratings'}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{locale === 'bg' ? 'Средно за последните 12 месеца' : 'Average for the last 12 months'}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: locale === 'bg' ? 'Точно описание' : 'Accurate description', value: sellerData.ratings.accuracy },
                        { label: locale === 'bg' ? 'Разумна цена за доставка' : 'Reasonable shipping cost', value: sellerData.ratings.shipping_cost },
                        { label: locale === 'bg' ? 'Скорост на доставка' : 'Shipping speed', value: sellerData.ratings.shipping_speed },
                        { label: locale === 'bg' ? 'Комуникация' : 'Communication', value: sellerData.ratings.communication },
                      ].map((rating) => (
                        <div key={rating.label} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{rating.label}</span>
                            <span className="font-medium">{rating.value}</span>
                          </div>
                          <Progress value={(rating.value / 5) * 100} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seller Feedback */}
            {sellerData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {locale === 'bg' ? 'Отзиви за продавача' : 'Seller feedback'} ({sellerData.feedback_count})
                  </h2>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32 h-8 text-sm">
                      <SelectValue placeholder={locale === 'bg' ? 'Филтър' : 'Filter'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{locale === 'bg' ? 'Всички оценки' : 'All ratings'}</SelectItem>
                      <SelectItem value="positive">{locale === 'bg' ? 'Положителни' : 'Positive'}</SelectItem>
                      <SelectItem value="neutral">{locale === 'bg' ? 'Неутрални' : 'Neutral'}</SelectItem>
                      <SelectItem value="negative">{locale === 'bg' ? 'Отрицателни' : 'Negative'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Feedback Items */}
                <div className="space-y-4">
                  {sampleFeedback.map((feedback, i) => (
                    <div key={i} className="flex gap-3 py-3 border-b border-border last:border-0">
                      <CheckCircle weight="fill" className="size-5 text-green-600 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{feedback.user}</span>
                          <span className="text-muted-foreground">({feedback.score})</span>
                          <span className="text-muted-foreground">• {feedback.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link href="#" className="text-sm text-primary hover:underline inline-block">
                  {locale === 'bg' ? 'Виж всички отзиви' : 'See all feedback'}
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Buy Box */}
          <div className="space-y-4">
            {/* Title */}
            <h1 className="text-xl font-normal leading-snug">
              {product.title}
            </h1>

            {/* Condition */}
            <div className="text-sm">
              <span className="text-muted-foreground">{locale === 'bg' ? 'Състояние' : 'Condition'}: </span>
              <span className="font-medium">{locale === 'bg' ? 'Ново' : 'New'}</span>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold">
              {locale === 'bg' ? '€' : 'US $'}{product.price.toFixed(2)}
            </div>

            {/* Buy Buttons - Pill style like eBay */}
            <div className="space-y-2.5">
              <Button className="w-full h-12 text-base font-semibold rounded-full">
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
                className="h-12 text-base font-semibold rounded-full"
              />
              <Button 
                variant="outline" 
                className={cn(
                  "w-full h-12 text-base font-semibold rounded-full gap-2",
                  isWatching && "border-primary text-primary"
                )}
                onClick={() => setIsWatching(!isWatching)}
              >
                <Heart weight={isWatching ? "fill" : "regular"} className="size-5" />
                {isWatching 
                  ? (locale === 'bg' ? 'В списъка' : 'Watching')
                  : (locale === 'bg' ? 'Добави в списък' : 'Add to Watchlist')
                }
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <Eye className="size-4" />
              <span>{locale === 'bg' ? 'Хората разглеждат това.' : 'People are checking this out.'}</span>
              <span className="font-medium text-foreground">
                {watchCount} {locale === 'bg' ? 'го добавиха в списъка.' : 'have added this to their watchlist.'}
              </span>
            </div>

            <Separator />

            {/* Shipping Info - eBay style detailed */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{locale === 'bg' ? 'Доставка:' : 'Shipping:'}</span>
                <div className="text-right">
                  <span className="font-medium text-green-600">{locale === 'bg' ? 'БЕЗПЛАТНА' : 'FREE'}</span>
                  <p className="text-xs text-muted-foreground">{locale === 'bg' ? 'Стандартна доставка' : 'Standard Shipping'}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{locale === 'bg' ? 'Намира се в:' : 'Located in:'}</span>
                <span>{locale === 'bg' ? 'София, България' : 'Sofia, Bulgaria'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{locale === 'bg' ? 'Доставка:' : 'Delivery:'}</span>
                <div className="text-right">
                  <span>{locale === 'bg' ? 'Очаквана между' : 'Estimated between'} {locale === 'bg' ? 'Пет, 12 Дек' : 'Fri, Dec 12'} {locale === 'bg' ? 'и' : 'and'} {locale === 'bg' ? 'Чет, 18 Дек' : 'Thu, Dec 18'}</span>
                  <p className="text-xs text-muted-foreground">{locale === 'bg' ? 'Включва проследяване' : 'Includes tracking'}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{locale === 'bg' ? 'Връщане:' : 'Returns:'}</span>
                <span className="text-green-600">{locale === 'bg' ? '30 дни безплатно връщане' : '30 days free returns'}</span>
              </div>
            </div>

            <Separator />

            {/* Payments */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">{locale === 'bg' ? 'Плащания:' : 'Payments:'}</span>
              <div className="flex gap-2">
                {['PayPal', 'Visa', 'MC', 'GPay'].map((payment) => (
                  <div key={payment} className="h-6 px-2 bg-muted rounded text-xs flex items-center font-medium">
                    {payment}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Compact Seller Card in Buy Box */}
            {sellerData && (
              <Card className="border-border shadow-none">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{locale === 'bg' ? 'Информация за продавача' : 'Seller information'}</h3>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-primary text-sm font-normal hover:underline hover:bg-transparent">
                      {locale === 'bg' ? 'Запази продавача' : 'Save this seller'}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {sellerData.store_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/store/${sellerData.id}`} className="font-medium text-primary hover:underline text-sm">
                        {sellerData.store_name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {sellerData.positive_feedback_percentage}% {locale === 'bg' ? 'положителни' : 'positive'} • {(sellerData.total_items_sold / 1000).toFixed(1)}K {locale === 'bg' ? 'продадени' : 'sold'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-9 text-xs" asChild>
                      <Link href={`/store/${sellerData.id}`}>
                        {locale === 'bg' ? 'Магазин' : 'Visit store'}
                      </Link>
                    </Button>
                    <ContactSellerButton
                      sellerId={sellerData.id}
                      productId={product.id}
                      productTitle={product.title}
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 text-xs"
                      showIcon={true}
                      showLabel={true}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
