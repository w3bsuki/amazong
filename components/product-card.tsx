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
}

export function ProductCard({ id, title, price, image, rating = 4.5, reviews = 120 }: ProductCardProps) {
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
  const formattedDate = new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(deliveryDate)

  return (
    <Card className="bg-white overflow-hidden flex flex-col group relative transition-all border-0 rounded-none shadow-none sm:border sm:border-slate-200 sm:rounded-lg sm:shadow-sm sm:hover:border-blue-400 sm:hover:shadow-md">
      {/* Hit Area for Nav */}
      <Link href={`/product/${id}`} className="absolute inset-0 z-0" aria-label={`View ${title}`} />

      <CardContent className="relative bg-slate-50 aspect-square sm:aspect-[4/3] p-3 sm:p-6 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain mix-blend-multiply"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </CardContent>

      <CardFooter className="p-2.5 sm:p-4 flex-1 flex flex-col z-10 pointer-events-none bg-white">
        <h3 className="text-xs sm:text-sm font-medium text-slate-900 group-hover:text-blue-600 line-clamp-2 mb-1 sm:mb-1.5 leading-snug transition-colors min-h-[2rem] sm:min-h-0">
          {title}
        </h3>

        <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(rating) ? "fill-current" : "text-slate-200 fill-current"}`}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-blue-600 font-medium">{reviews.toLocaleString()}</span>
        </div>

        <div className="mt-auto pointer-events-auto">
          <div className="flex items-baseline mb-0.5 sm:mb-1">
            <span className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">{formatPrice(price)}</span>
          </div>

          <div className="text-[10px] sm:text-xs text-slate-500 mb-2 sm:mb-3 hidden sm:block">
            {t('delivery')} <span className="font-semibold text-slate-700">{formattedDate}</span>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 h-9 sm:h-auto rounded transition-colors tap-transparent active-scale"
          >
            {t('addToCart')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
