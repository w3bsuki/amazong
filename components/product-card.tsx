"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"

interface ProductCardProps {
  id: string
  title: string
  price: number
  image: string
  rating?: number
  reviews?: number
  compact?: boolean // Add compact mode for grid displays
}

export function ProductCard({ id, title, price, image, rating = 4.5, reviews = 120, compact = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const t = useTranslations('Product')
  const tCart = useTranslations('Cart')
  const locale = useLocale()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the button
    addToCart({
      id,
      title,
      price,
      image,
      quantity: 1,
    })
    toast.success(tCart('itemAdded'))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(price)
  }

  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 2)
  const formattedDate = new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'numeric', day: 'numeric' }).format(deliveryDate)

  return (
    <Card className="bg-card overflow-hidden flex flex-col group relative border border-border rounded-md hover:border-ring h-full">
      {/* Hit Area for Nav */}
      <Link href={`/product/${id}`} className="absolute inset-0 z-0" aria-label={`View ${title}`} />

      {/* Image Container - Fixed square aspect ratio */}
      <CardContent className="relative bg-secondary aspect-square p-2 sm:p-3 md:p-4 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain mix-blend-multiply"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        </div>
      </CardContent>

      <CardFooter className="p-2 sm:p-2.5 md:p-3 flex-1 flex flex-col z-10 pointer-events-none bg-card">
        {/* Title - 2 lines max */}
        <h3 className="text-xs sm:text-sm font-medium text-foreground group-hover:text-brand-blue line-clamp-2 mb-1 sm:mb-1.5 leading-snug min-h-8 sm:min-h-10">
          {title}
        </h3>

        {/* Rating - Compact */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex text-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${i < Math.floor(rating) ? "fill-current" : "text-rating-empty fill-current"}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-brand-blue font-medium">{reviews.toLocaleString()}</span>
        </div>

        {/* Price & Button */}
        <div className="mt-auto pointer-events-auto">
          <div className="mb-1">
            <span className="text-sm sm:text-base md:text-lg font-bold text-foreground tracking-tight">{formatPrice(price)}</span>
          </div>

          {!compact && (
            <div className="text-[10px] text-muted-foreground mb-1.5 sm:mb-2 hidden sm:block">
              {t('delivery')} <span className="font-semibold text-foreground">{formattedDate}</span>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            className="w-full min-h-11 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs sm:text-sm font-medium rounded-md transition-colors touch-action-manipulation active:scale-[0.98]"
          >
            {t('addToCart')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
