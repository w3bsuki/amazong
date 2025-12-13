"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Package,
  Eye,
  Pencil,
  Star,
  Tag,
  Lightning,
} from "@phosphor-icons/react"
import { BoostDialog } from "@/components/boost-dialog"
import { toast } from "sonner"

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  list_price: number | null
  stock: number
  images: string[]
  rating: number | null
  review_count: number | null
  created_at: string
  is_boosted: boolean
  boost_expires_at: string | null
  category?: {
    name: string
    slug: string
  } | null
}

interface SellingProductsListProps {
  products: Product[]
  locale: string
}

export function SellingProductsList({ products, locale }: SellingProductsListProps) {
  const searchParams = useSearchParams()
  const [productsList] = useState(products)

  // Handle boost success/cancel URL params
  useEffect(() => {
    if (searchParams.get('boost_success') === 'true') {
      toast.success(
        locale === 'bg' 
          ? 'Промоцията е активирана успешно!' 
          : 'Boost activated successfully!'
      )
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    } else if (searchParams.get('boost_canceled') === 'true') {
      toast.info(
        locale === 'bg' 
          ? 'Плащането беше отменено' 
          : 'Payment was cancelled'
      )
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams, locale])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(value)
  }

  // Check if boost is active (not expired)
  const isBoostActive = (product: Product) => {
    if (!product.is_boosted || !product.boost_expires_at) return false
    return new Date(product.boost_expires_at) > new Date()
  }

  // Get days left for active boost
  const getBoostDaysLeft = (product: Product) => {
    if (!product.boost_expires_at) return 0
    const expiresAt = new Date(product.boost_expires_at)
    const now = new Date()
    return Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  }

  if (productsList.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="size-16 sm:size-20 rounded-full mx-auto flex items-center justify-center mb-4 bg-account-stat-icon-bg border border-account-stat-border">
          <Package weight="duotone" className="size-8 sm:size-10 text-account-stat-icon" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {locale === 'bg' ? 'Нямате продукти все още' : 'No products yet'}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          {locale === 'bg' 
            ? 'Започнете да продавате, като създадете първата си обява' 
            : 'Start selling by creating your first product listing'}
        </p>
        <Button asChild className="rounded-full">
          <Link href={`/${locale}/sell`}>
            <Plus weight="bold" className="size-4 mr-2" />
            {locale === 'bg' ? 'Създай обява' : 'Create Listing'}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile: Card-style list */}
      <div className="space-y-3 md:hidden">
        {productsList.map((product) => {
          const boosted = isBoostActive(product)
          const daysLeft = getBoostDaysLeft(product)
          
          return (
            <div 
              key={product.id} 
              className={`flex items-start gap-3 p-3 rounded-2xl bg-account-stat-bg border border-account-stat-border transition-all active:scale-[0.99] ${
                boosted ? 'ring-2 ring-primary/20 border-primary/30' : ''
              }`}
            >
              {/* Product Image */}
              <div className="relative size-20 rounded-xl overflow-hidden bg-account-stat-bg border border-account-stat-border shrink-0">
                {product.images?.[0] && product.images[0].startsWith('http') ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="size-8 text-muted-foreground/40" weight="duotone" />
                  </div>
                )}
                {boosted && (
                  <div className="absolute top-1.5 left-1.5">
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 gap-0.5 shadow-lg">
                      <Lightning className="size-2.5" weight="fill" />
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <Link 
                      href={`/${locale}/product/${product.id}`}
                      className="font-medium text-foreground hover:text-primary line-clamp-1 text-sm"
                    >
                      {product.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-semibold ${product.list_price && product.list_price > product.price ? 'text-deal' : 'text-foreground'}`}>
                        {formatCurrency(Number(product.price))}
                      </span>
                      {product.list_price && product.list_price > product.price && (
                        <Badge variant="secondary" className="bg-deal/10 text-deal border-0 text-[10px] px-1.5 py-0">
                          <Tag weight="fill" className="size-2.5 mr-0.5" />
                          -{Math.round(((product.list_price - product.price) / product.list_price) * 100)}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span className={product.stock < 5 && product.stock > 0 ? "text-amber-600 dark:text-amber-400 font-medium" : product.stock === 0 ? "text-destructive font-medium" : ""}>
                        {product.stock === 0 
                          ? (locale === 'bg' ? 'Изчерпан' : 'Out of stock')
                          : `${product.stock} ${locale === 'bg' ? 'в склад' : 'in stock'}`
                        }
                      </span>
                      {boosted && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">
                          <Lightning weight="fill" className="size-2.5 mr-0.5" />
                          {daysLeft}d
                        </Badge>
                      )}
                    </div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="flex text-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            weight={i < Math.floor(product.rating || 0) ? "fill" : "regular"}
                            className="text-rating"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        ({product.review_count || 0})
                      </span>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {!boosted && (
                      <BoostDialog 
                        product={product} 
                        locale={locale}
                        trigger={
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 text-primary hover:bg-primary/10"
                          >
                            <Lightning className="size-4" weight="bold" />
                          </Button>
                        }
                      />
                    )}
                    <Button asChild variant="ghost" size="icon" className="size-8">
                      <Link href={`/${locale}/account/selling/edit?id=${product.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop: Table-like list */}
      <div className="hidden md:block divide-y divide-border">
        {productsList.map((product) => {
          const boosted = isBoostActive(product)
          const daysLeft = getBoostDaysLeft(product)
          
          return (
            <div 
              key={product.id} 
              className={`flex items-center gap-4 p-4 hover:bg-account-card-hover transition-colors ${
                boosted ? 'bg-primary/5' : ''
              }`}
            >
              {/* Product Image */}
              <div className="relative size-16 rounded-xl overflow-hidden bg-account-stat-bg border border-account-stat-border shrink-0">
                {product.images?.[0] && product.images[0].startsWith('http') ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="size-6 text-muted-foreground/40" weight="duotone" />
                  </div>
                )}
                {boosted && (
                  <div className="absolute top-1 left-1">
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-1 py-0 gap-0.5">
                      <Lightning className="size-2.5" weight="fill" />
                    </Badge>
                  </div>
                )}
              </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link 
                  href={`/${locale}/product/${product.id}`}
                  className="font-medium text-foreground hover:text-primary line-clamp-1"
                >
                  {product.title}
                </Link>
                {product.list_price && product.list_price > product.price && (
                  <Badge variant="secondary" className="bg-deal/10 text-deal border-0 text-xs shrink-0">
                    <Tag weight="fill" className="size-3 mr-0.5" />
                    -{Math.round(((product.list_price - product.price) / product.list_price) * 100)}%
                  </Badge>
                )}
                {boosted && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-xs shrink-0">
                    <Lightning weight="fill" className="size-3 mr-0.5" />
                    {daysLeft} {locale === 'bg' ? 'дни' : 'days'}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-semibold ${product.list_price && product.list_price > product.price ? 'text-deal' : 'text-foreground'}`}>
                    {formatCurrency(Number(product.price))}
                  </span>
                  {product.list_price && product.list_price > product.price && (
                    <span className="text-muted-foreground line-through text-xs">
                      {formatCurrency(Number(product.list_price))}
                    </span>
                  )}
                </div>
                <span className={product.stock < 5 && product.stock > 0 ? "text-amber-600 dark:text-amber-400 font-medium" : product.stock === 0 ? "text-destructive font-medium" : ""}>
                  {product.stock === 0 
                    ? (locale === 'bg' ? 'Изчерпан' : 'Out of stock')
                    : `${product.stock} ${locale === 'bg' ? 'в склад' : 'in stock'}`
                  }
                </span>
                {product.category && (
                  <span className="text-muted-foreground">{(product.category as any).name}</span>
                )}
              </div>
              {/* Rating */}
              <div className="flex items-center gap-1 mt-1.5">
                <div className="flex text-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      weight={i < Math.floor(product.rating || 0) ? "fill" : "regular"}
                      className="text-rating"
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.review_count || 0})
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Boost Button */}
              {!boosted && (
                <BoostDialog 
                  product={product} 
                  locale={locale}
                  trigger={
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5 text-primary border-primary/30 hover:bg-primary/10 hover:text-primary h-9 px-3 rounded-full"
                    >
                      <Lightning className="size-4" weight="bold" />
                      {locale === 'bg' ? 'Промотирай' : 'Boost'}
                    </Button>
                  }
                />
              )}
              <Button asChild variant="ghost" size="icon" className="size-9">
                <Link href={`/${locale}/product/${product.id}`}>
                  <Eye className="size-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="size-9">
                <Link href={`/${locale}/account/selling/edit?id=${product.id}`}>
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
            </div>
          </div>
        )
      })}
      </div>
    </>
  )
}
