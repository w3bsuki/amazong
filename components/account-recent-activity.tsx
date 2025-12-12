"use client"

import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconChevronRight } from "@tabler/icons-react"

interface RecentOrder {
  id: string
  total_amount: number
  status: string | null
  created_at: string
}

interface RecentProduct {
  id: string
  title: string
  price: number
  stock: number
  created_at: string
}

interface RecentSale {
  id: string
  price_at_purchase: number
  quantity: number
  created_at: string
  product_title?: string
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
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
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
    recentOrdersDesc: locale === 'bg' ? 'Вашите последни поръчки' : 'Your latest orders',
    myProducts: locale === 'bg' ? 'Моите продукти' : 'My Products',
    myProductsDesc: locale === 'bg' ? 'Активни обяви' : 'Active listings',
    recentSales: locale === 'bg' ? 'Последни продажби' : 'Recent Sales',
    recentSalesDesc: locale === 'bg' ? 'Последно продадени' : 'Recently sold items',
    noOrders: locale === 'bg' ? 'Няма поръчки' : 'No orders yet',
    noProducts: locale === 'bg' ? 'Няма продукти' : 'No products yet',
    noSales: locale === 'bg' ? 'Няма продажби' : 'No sales yet',
    inStock: locale === 'bg' ? 'В наличност' : 'In stock',
    viewAll: locale === 'bg' ? 'Виж всички' : 'View all',
  }

  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">{t.recentOrders}</CardTitle>
            <CardDescription>{t.recentOrdersDesc}</CardDescription>
          </div>
          <Link 
            href="/account/orders" 
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            {t.viewAll}
            <IconChevronRight className="size-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <div className="divide-y">
              {orders.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">{t.noOrders}</p>
              ) : (
                orders.map((order) => (
                  <Link 
                    key={order.id} 
                    href={`/account/orders/${order.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-xs font-medium text-primary">
                      #{order.id.slice(0, 4)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: dateLocale })}
                      </p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </Link>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* My Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">{t.myProducts}</CardTitle>
            <CardDescription>{t.myProductsDesc}</CardDescription>
          </div>
          <Link 
            href="/account/selling" 
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            {t.viewAll}
            <IconChevronRight className="size-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <div className="divide-y">
              {products.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">{t.noProducts}</p>
              ) : (
                products.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md bg-muted text-xs font-medium">
                      {product.title.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(product.created_at), { addSuffix: true, locale: dateLocale })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-600">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.stock} {t.inStock}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">{t.recentSales}</CardTitle>
            <CardDescription>{t.recentSalesDesc}</CardDescription>
          </div>
          <Link 
            href="/account/sales" 
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            {t.viewAll}
            <IconChevronRight className="size-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <div className="divide-y">
              {sales.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">{t.noSales}</p>
              ) : (
                sales.map((sale, index) => (
                  <div key={`${sale.id}-${index}`} className="flex items-center gap-3 p-4">
                    <div className="flex size-8 items-center justify-center rounded-md bg-emerald-100 text-xs font-medium text-emerald-700">
                      x{sale.quantity}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {sale.product_title || `Item #${sale.id.slice(0, 6)}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(sale.created_at), { addSuffix: true, locale: dateLocale })}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">
                      +{formatCurrency(sale.price_at_purchase * sale.quantity)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
