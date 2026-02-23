"use client"

import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Package as IconPackage, Image as IconPhoto, ShoppingBag as IconShoppingBag } from "lucide-react";
import { ActivityListShell, ActivitySectionHeader } from "@/components/shared/activity-feed"
import { formatPrice } from "@/lib/price"
import { EmptyStateCTA } from "../../../_components/empty-state-cta"


interface RecentOrder {
  id: string
  total_amount: number
  status: string | null
  created_at: string
  order_items?: Array<{
    id: string
    products: { images?: string[] } | { images?: string[] }[] | null
  }>
}

interface RecentProduct {
  id: string
  title: string
  price: number
  stock: number
  images?: string[]
  slug?: string | null
  username?: string | null
  created_at: string
}

interface RecentSale {
  id: string
  price_at_purchase: number
  quantity: number
  created_at?: string | null
  product_title?: string | null
  product_image?: string | null
}

interface AccountRecentActivityProps {
  orders: RecentOrder[]
  products: RecentProduct[]
  sales: RecentSale[]
  locale: string
}

export function AccountRecentActivity({ orders, products, sales, locale }: AccountRecentActivityProps) {
  const dateLocale = locale === 'bg' ? bg : enUS
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatRelative = (value: string, withSuffix: boolean) => {
    if (!mounted) return ""
    return formatDistanceToNow(new Date(value), { addSuffix: withSuffix, locale: dateLocale })
  }

  const formatCurrency = (value: number) => formatPrice(value, { locale })

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success border-transparent'
      case 'pending':
        return 'bg-warning/10 text-warning border-transparent'
      case 'processing':
        return 'bg-selected text-primary border-transparent'
      case 'shipped':
        return 'bg-info/10 text-info border-transparent'
      case 'delivered':
        return 'bg-success/10 text-success border-transparent'
      case 'cancelled':
        return 'bg-destructive-subtle text-destructive border-transparent'
      default:
        return 'bg-muted text-muted-foreground border-transparent'
    }
  }

  const getStatusText = (status: string | null) => {
    if (locale === 'bg') {
      switch (status) {
        case 'paid': return 'Платена'
        case 'pending': return 'Изчакване'
        case 'processing': return 'Обработка'
        case 'shipped': return 'Изпратена'
        case 'delivered': return 'Доставена'
        case 'cancelled': return 'Отменена'
        default: return status || 'Неизвестен'
      }
    }
    return status || 'Unknown'
  }

  const t = {
    recentOrders: locale === 'bg' ? 'Последни поръчки' : 'Recent Orders',
    myProducts: locale === 'bg' ? 'Моите обяви' : 'My Listings',
    recentSales: locale === 'bg' ? 'Последни продажби' : 'Recent Sales',
    noOrders: locale === 'bg' ? 'Няма поръчки' : 'No orders yet',
    noProducts: locale === 'bg' ? 'Няма продукти' : 'No products yet',
    noSales: locale === 'bg' ? 'Няма продажби' : 'No sales yet',
    inStock: locale === 'bg' ? 'бр.' : 'in stock',
    viewAll: locale === 'bg' ? 'Виж всички' : 'See all',
    activity: locale === 'bg' ? 'Активност' : 'Activity',
  }

  const getProductHref = (product: RecentProduct) => {
    if (!product.username) return "#"
    return `/${product.username}/${product.slug || product.id}`
  }

  return (
    <div className="space-y-6">
      {/* Recent Orders Section - Horizontal scroll on mobile */}
      <div>
        <ActivitySectionHeader title={t.recentOrders} href="/account/orders" actionLabel={t.viewAll} />
        {orders.length === 0 ? (
          <div className="rounded-md border border-border bg-card">
            <EmptyStateCTA variant="no-orders" showCTA={false} className="px-4 py-10" />
          </div>
        ) : (
          <>
            {/* Mobile: Horizontal scroll cards */}
            <div className="md:hidden -mx-inset px-inset overflow-x-auto no-scrollbar">
              <div className="flex gap-3 pb-2 w-max">
                {orders.slice(0, 5).map((order) => {
                  const getProductImage = (products: { images?: string[] } | { images?: string[] }[] | null): string | undefined => {
                    if (!products) return undefined
                    if (Array.isArray(products)) return products[0]?.images?.[0]
                    return products.images?.[0]
                  }
                  const firstImage = order.order_items?.find(item => getProductImage(item.products))
                  const firstImageUrl = firstImage ? getProductImage(firstImage.products) : undefined
                  const itemCount = order.order_items?.length || 0

                  return (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.id}`}
                      className="flex flex-col w-36 rounded-md bg-card border border-border p-3 transition-colors"
                    >
                      {/* Order Image */}
                      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-card border border-border mb-3">
                        {firstImageUrl ? (
                          <>
                            <Image
                              src={firstImageUrl}
                              alt={`Order #${order.id.slice(0, 4)}`}
                              fill
                              className="object-cover"
                              sizes="144px"
                            />
                            {itemCount > 1 && (
                              <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-surface-overlay text-2xs font-bold text-overlay-text">
                                +{itemCount - 1}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <IconShoppingBag className="size-8 text-muted-foreground" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                      {/* Order Info */}
                      <p className="text-sm font-bold text-foreground mb-0.5">
                        {formatCurrency(order.total_amount)}
                      </p>
                      {formatRelative(order.created_at, false) && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {formatRelative(order.created_at, false)}
                        </p>
                      )}
                      <Badge variant="outline" className={`text-2xs font-medium w-fit ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </Badge>
                    </Link>
                  )
                })}
              </div>
             </div>

             {/* Desktop: List view */}
            <ActivityListShell className="hidden md:block">
              {orders.slice(0, 3).map((order) => {
                const getProductImage = (products: { images?: string[] } | { images?: string[] }[] | null): string | undefined => {
                  if (!products) return undefined
                  if (Array.isArray(products)) return products[0]?.images?.[0]
                  return products.images?.[0]
                }
                const firstImage = order.order_items?.find(item => getProductImage(item.products))
                const firstImageUrl = firstImage ? getProductImage(firstImage.products) : undefined
                const itemCount = order.order_items?.length || 0

                return (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-hover active:bg-active transition-colors"
                  >
                    <div className="relative size-11 rounded-md overflow-hidden bg-card border border-border shrink-0">
                      {firstImageUrl ? (
                        <>
                          <Image
                            src={firstImageUrl}
                            alt={`Order #${order.id.slice(0, 4)}`}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                          {itemCount > 1 && (
                            <div className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-2xs font-bold text-primary-foreground shadow-sm">
                              +{itemCount - 1}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <IconPackage className="size-5 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(order.total_amount)}
                      </p>
                      {formatRelative(order.created_at, true) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatRelative(order.created_at, true)}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className={`text-2xs font-medium shrink-0 ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </Link>
                )
              })}
            </ActivityListShell>
          </>
        )}
      </div>

      {/* My Products Section - Only show if has products */}
      {products.length > 0 && (
        <div>
          <ActivitySectionHeader title={t.myProducts} href="/account/selling" actionLabel={t.viewAll} />

          {/* Mobile: Horizontal scroll cards */}
          <div className="md:hidden -mx-inset px-inset overflow-x-auto no-scrollbar">
            <div className="flex gap-3 pb-2 w-max">
              {products.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  href={getProductHref(product)}
                  className="flex flex-col w-36 rounded-md bg-card border border-border p-3 transition-colors"
                >
                  {/* Product Image */}
                  <div className="relative w-full aspect-square rounded-md overflow-hidden bg-card border border-border mb-3">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="144px"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <IconPhoto className="size-8 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                    )}
                    {/* Stock badge */}
                    <div className="absolute top-2 right-2 flex items-center justify-center px-1.5 py-0.5 rounded-full bg-surface-overlay text-2xs font-medium text-overlay-text">
                      {product.stock} {t.inStock}
                    </div>
                  </div>
                  {/* Product Info */}
                  <p className="text-sm font-semibold text-foreground mb-1 line-clamp-2 leading-tight">
                    {product.title}
                  </p>
                  <p className="text-sm font-bold text-success mt-auto">
                    {formatCurrency(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop: List view */}
          <ActivityListShell className="hidden md:block">
            {products.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                href={getProductHref(product)}
                className="flex items-center gap-3 p-4 hover:bg-hover active:bg-active transition-colors"
              >
                <div className="relative size-11 rounded-md overflow-hidden bg-card border border-border shrink-0">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <IconPhoto className="size-5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {product.stock} {t.inStock}
                  </p>
                </div>
                <span className="text-sm font-bold text-success">
                  {formatCurrency(product.price)}
                </span>
              </Link>
            ))}
          </ActivityListShell>
        </div>
      )}

      {/* Recent Sales Section - Only show if has sales */}
      {sales.length > 0 && (
        <div>
          <ActivitySectionHeader title={t.recentSales} href="/account/sales" actionLabel={t.viewAll} />
          <ActivityListShell>
            {sales.slice(0, 3).map((sale, index) => (
              <div key={`${sale.id}-${index}`} className="flex items-center gap-3 p-4">
                {/* Product Image or Quantity Badge */}
                <div className="relative size-11 rounded-md overflow-hidden bg-success/10 shrink-0">
                  {sale.product_image ? (
                    <>
                      <Image
                        src={sale.product_image}
                        alt={sale.product_title || 'Product'}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                      {/* Quantity badge overlay */}
                      <div className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-success text-2xs font-bold text-primary-foreground shadow-sm">
                        {sale.quantity}
                      </div>
                    </>
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <span className="text-sm font-bold text-success">x{sale.quantity}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {sale.product_title || `Item #${sale.id.slice(0, 6)}`}
                  </p>
                  {sale.created_at && formatRelative(sale.created_at, true) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatRelative(sale.created_at, true)}
                    </p>
                  )}
                </div>
                <span className="text-sm font-bold text-success">
                  +{formatCurrency(sale.price_at_purchase * sale.quantity)}
                </span>
              </div>
            ))}
          </ActivityListShell>
        </div>
      )}
    </div>
  )
}
