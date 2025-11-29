'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProductPrice } from '@/components/product-price'
import { useCart } from '@/lib/cart-context'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface StickyAddToCartProps {
  product: {
    id: string
    title: string
    price: number
    image: string
  }
  locale: string
}

export function StickyAddToCart({ product, locale }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()
  const t = useTranslations('Product')

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past 400px
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAddToCart = () => {
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
    }, 1000)
  }

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 z-40",
        "lg:hidden transform transition-transform duration-200 shadow-lg",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
      aria-hidden={!isVisible}
    >
      <div className="container flex items-center gap-3">
        <ProductPrice 
          price={product.price} 
          locale={locale} 
          size="sm"
          showAccessibleLabel={false}
        />
        <Button 
          className="flex-1 bg-cta-add-cart hover:bg-cta-add-cart-hover h-11 text-foreground font-medium rounded-sm"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? t('addedToCart') : t('addToCart')}
        </Button>
      </div>
    </div>
  )
}
