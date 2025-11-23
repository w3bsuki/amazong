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
    <Card className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-all duration-200 flex flex-col group relative">
      {/* Hit Area for Nav */}
      <Link href={`/product/${id}`} className="absolute inset-0 z-0" aria-label={`View ${title}`} />

      <CardContent className="relative bg-slate-50 aspect-[4/3] p-6 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain mix-blend-multiply"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardContent>

      <CardFooter className="p-4 flex-1 flex flex-col z-10 pointer-events-none bg-white">
        <h3 className="text-sm font-medium text-slate-900 group-hover:text-amber-600 line-clamp-2 mb-1 leading-snug transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-current" : "text-slate-200 fill-current"}`}
              />
            ))}
          </div>
          <span className="text-xs text-cyan-700">{reviews.toLocaleString()}</span>
        </div>

        <div className="mt-auto pointer-events-auto">
          <div className="flex items-baseline mb-1">
            <span className="text-2xl font-semibold text-slate-900 tracking-tight">{formatPrice(price)}</span>
          </div>

          <div className="text-xs text-slate-500 mb-3">
            {t('delivery')} <span className="font-semibold text-slate-800">{formattedDate}</span>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-semibold py-2 rounded-full transition-colors active:scale-95"
          >
            {t('addToCart')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
