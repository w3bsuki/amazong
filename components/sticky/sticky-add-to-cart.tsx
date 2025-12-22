'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ProductPrice } from '@/components/shared/product/product-price'
import { useCart } from '@/components/providers/cart-context'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ShoppingCart, Check } from '@phosphor-icons/react'

interface StickyAddToCartProps {
  product: {
    id: string
    title: string
    price: number
    image: string
    seller_id?: string
  }
  locale: string
  currentUserId?: string | null
}

export function StickyAddToCart({ product, locale, currentUserId }: StickyAddToCartProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()
  const t = useTranslations('Product')

  // Check if user is trying to buy their own product
  const isOwnProduct = !!(currentUserId && product.seller_id && currentUserId === product.seller_id)

  const handleAddToCart = () => {
    if (isOwnProduct) {
      toast.error("You cannot purchase your own products")
      return
    }
    setIsAdding(true)
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    
    setTimeout(() => {
      setIsAdding(false)
    }, 1500)
  }

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40",
        "lg:hidden safe-area-bottom"
      )}
    >
      <div className="container flex items-center gap-3 py-3 px-4">
        {/* Product thumbnail */}
        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
          <Image 
            src={product.image} 
            alt={product.title} 
            fill 
            className="object-contain"
            sizes="48px"
          />
        </div>
        
        {/* Price */}
        <div className="flex-1 min-w-0">
          <ProductPrice 
            price={product.price} 
            locale={locale} 
            size="sm"
            showAccessibleLabel={false}
          />
          <p className="text-xs text-stock-available font-medium">{t('inStock')}</p>
        </div>
        
        {/* Add to cart button */}
        <Button 
          className={cn(
            "h-11 px-6 font-medium rounded-full",
            isAdding 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-cta-add-cart hover:bg-cta-add-cart-hover text-foreground"
          )}
          onClick={handleAddToCart}
          disabled={isAdding || isOwnProduct}
          title={isOwnProduct ? "You cannot purchase your own products" : undefined}
        >
          {isOwnProduct ? (
            "Your Product"
          ) : isAdding ? (
            <>
              <Check weight="bold" className="w-5 h-5 mr-1" />
              {t('addedToCart')}
            </>
          ) : (
            <>
              <ShoppingCart weight="bold" className="w-5 h-5 mr-1" />
              {t('addToCart')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
