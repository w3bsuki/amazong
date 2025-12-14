"use client"

import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { IconChevronRight, IconPackage, IconPhoto, IconShoppingBag } from "@tabler/icons-react"

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
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'paid':
        return 'bg-account-success-soft text-account-success border-transparent'
      case 'pending':
        return 'bg-account-warning-soft text-account-warning border-transparent'
      case 'processing':
        return 'bg-account-accent-soft text-account-accent border-transparent'
      case 'shipped':
        return 'bg-account-info-soft text-account-info border-transparent'
      case 'delivered':
        return 'bg-account-success-soft text-account-success border-transparent'
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-transparent dark:bg-red-950/30 dark:text-red-400'
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

  // Minimal section header - Revolut style
  const SectionHeader = ({ title, href }: { title: string; href: string }) => (
    <div className="flex items-center justify-between px-1 mb-3">
      <span className="font-semibold text-base text-foreground">{title}</span>
      <Link 
        href={href} 
        className="text-xs font-medium text-account-accent hover:text-account-accent/80 transition-colors flex items-center gap-0.5"
      >
        {t.viewAll}
        <IconChevronRight className="size-3.5" />
      </Link>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Recent Orders Section - Horizontal scroll on mobile */}
      <div>
        <SectionHeader title={t.recentOrders} href="/account/orders" />
        {orders.length === 0 ? (
          <div className="rounded-2xl bg-account-stat-bg border border-account-stat-border p-8 text-center">
            <div className="flex size-14 mx-auto items-center justify-center rounded-2xl bg-account-stat-icon-bg border border-account-stat-border mb-3">
              <IconPackage className="size-6 text-account-stat-icon" />
            </div>
            <p className="text-sm text-muted-foreground">{t.noOrders}</p>
          </div>
        ) : (
          <>
            {/* Mobile: Horizontal scroll cards */}
            <div className="md:hidden -mx-4 px-4 overflow-x-auto no-scrollbar">
              <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
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
                      className="flex flex-col w-[140px] rounded-2xl bg-account-stat-bg border border-account-stat-border p-3 active:scale-[0.98] transition-all"
                    >
                      {/* Order Image */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-account-stat-bg border border-account-stat-border mb-3">
                        {firstImageUrl ? (
                          <>
                            <Image
                              src={firstImageUrl}
                              alt={`Order #${order.id.slice(0, 4)}`}
                              fill
                              className="object-cover"
                              sizes="140px"
                            />
                            {itemCount > 1 && (
                              <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white">
                                +{itemCount - 1}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <IconShoppingBag className="size-8 text-muted-foreground/40" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                      {/* Order Info */}
                      <p className="text-sm font-bold text-foreground mb-0.5">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <p className="text-[11px] text-muted-foreground mb-2">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: false, locale: dateLocale })}
                      </p>
                      <Badge variant="outline" className={`text-[10px] font-medium w-fit ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </Badge>
                    </Link>
                  )
                })}
              </div>
            </div>
            
            {/* Desktop: List view */}
            <div className="hidden md:block rounded-2xl bg-account-stat-bg border border-account-stat-border overflow-hidden">
              <div className="divide-y divide-account-stat-border/50">
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
                      className="flex items-center gap-3 p-4 hover:bg-account-card-hover transition-colors"
                    >
                      <div className="relative size-11 rounded-xl overflow-hidden bg-account-stat-bg border border-account-stat-border shrink-0">
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
                              <div className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-account-accent text-[9px] font-bold text-white shadow-sm">
                                +{itemCount - 1}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <IconPackage className="size-5 text-account-stat-icon" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-account-stat-value">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <p className="text-xs text-account-stat-label mt-0.5">
                          {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: dateLocale })}
                        </p>
                      </div>
                      <Badge variant="outline" className={`text-[10px] font-medium shrink-0 ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </Badge>
                    </Link>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* My Products Section - Only show if has products */}
      {products.length > 0 && (
        <div>
          <SectionHeader title={t.myProducts} href="/account/selling" />
          
          {/* Mobile: Horizontal scroll cards */}
          <div className="md:hidden -mx-4 px-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
              {products.slice(0, 5).map((product) => (
                <Link 
                  key={product.id} 
                  href={`/product/${product.id}`}
                  className="flex flex-col w-[140px] rounded-2xl bg-account-stat-bg border border-account-stat-border p-3 active:scale-[0.98] transition-all"
                >
                  {/* Product Image */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-account-stat-bg border border-account-stat-border mb-3">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="140px"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <IconPhoto className="size-8 text-muted-foreground/40" strokeWidth={1.5} />
                      </div>
                    )}
                    {/* Stock badge */}
                    <div className="absolute top-2 right-2 flex items-center justify-center px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-medium text-white">
                      {product.stock} {t.inStock}
                    </div>
                  </div>
                  {/* Product Info */}
                  <p className="text-sm font-semibold text-foreground mb-1 line-clamp-2 leading-tight">
                    {product.title}
                  </p>
                  <p className="text-sm font-bold text-account-success mt-auto">
                    {formatCurrency(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop: List view */}
          <div className="hidden md:block rounded-2xl bg-account-stat-bg border border-account-stat-border overflow-hidden">
            <div className="divide-y divide-account-stat-border/50">
              {products.slice(0, 3).map((product) => (
                <Link 
                  key={product.id} 
                  href={`/product/${product.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-account-card-hover transition-colors"
                >
                  <div className="relative size-11 rounded-xl overflow-hidden bg-account-stat-bg border border-account-stat-border shrink-0">
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
                        <IconPhoto className="size-5 text-account-stat-icon" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-account-stat-value truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-account-stat-label mt-0.5">
                      {product.stock} {t.inStock}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-account-success">
                    {formatCurrency(product.price)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Sales Section - Only show if has sales */}
      {sales.length > 0 && (
        <div>
          <SectionHeader title={t.recentSales} href="/account/sales" />
          <div className="rounded-2xl bg-account-stat-bg border border-account-stat-border overflow-hidden">
            <div className="divide-y divide-account-stat-border/50">
            {sales.slice(0, 3).map((sale, index) => (
              <div key={`${sale.id}-${index}`} className="flex items-center gap-3 p-4">
                {/* Product Image or Quantity Badge */}
                <div className="relative size-11 rounded-xl overflow-hidden bg-account-success-soft shrink-0">
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
                      <div className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-sm">
                        {sale.quantity}
                      </div>
                    </>
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <span className="text-sm font-bold text-emerald-500">x{sale.quantity}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-account-stat-value truncate">
                    {sale.product_title || `Item #${sale.id.slice(0, 6)}`}
                  </p>
                  {sale.created_at && (
                    <p className="text-xs text-account-stat-label mt-0.5">
                      {formatDistanceToNow(new Date(sale.created_at), { addSuffix: true, locale: dateLocale })}
                    </p>
                  )}
                </div>
                <span className="text-sm font-bold text-emerald-500">
                  +{formatCurrency(sale.price_at_purchase * sale.quantity)}
                </span>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
