import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Package,
  Storefront,
  CurrencyCircleDollar,
  ShoppingCart,
  Warning,
  Star,
  ChartLineUp,
} from "@phosphor-icons/react/dist/ssr"
import { SellingProductsList } from "./selling-products-list"

interface SellingPageProps {
  params: Promise<{
    locale: string
  }>
}

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
  status?: 'active' | 'draft' | 'archived' | 'out_of_stock'
  category?: {
    name: string
    slug: string
  } | null
}

export default async function SellingPage({ params }: SellingPageProps) {
  await connection()
  const { locale } = await params
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has a seller account
  const { data: seller } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", user.id)
    .single()

  // If no seller account, redirect to sell page to create one
  if (!seller) {
    redirect(`/${locale}/sell`)
  }

  // Fetch seller's products
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      title,
      description,
      price,
      list_price,
      stock,
      images,
      rating,
      review_count,
      created_at,
      is_boosted,
      boost_expires_at,
      status,
      category:categories(name, slug)
    `)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })

  const sellerProducts = (products || []) as unknown as Product[]

  // Calculate stats
  const totalProducts = sellerProducts.length
  const lowStockProducts = sellerProducts.filter(p => p.stock < 5).length
  const totalValue = sellerProducts.reduce((sum, p) => sum + (Number(p.price) * p.stock), 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(value)
  }

  const t = {
    products: locale === 'bg' ? 'продукта' : 'products',
    value: locale === 'bg' ? 'стойност' : 'value',
    lowStock: locale === 'bg' ? 'нисък склад' : 'low stock',
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="sr-only">{locale === 'bg' ? 'Моят магазин' : 'My Store'}</h1>
        
        {/* Mobile: Revolut-style header with stats pills */}
        <div className="sm:hidden">
          {/* Store info + Add button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-full bg-account-stat-icon-bg border border-account-stat-border flex items-center justify-center">
                <Storefront weight="fill" className="size-5 text-account-stat-icon" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">{seller.store_name}</span>
                  {seller.verified && (
                    <Star weight="fill" className="size-3.5 text-emerald-500" />
                  )}
                </div>
              </div>
            </div>
            <Button asChild size="sm" className="h-9 gap-1.5 rounded-full px-4">
              <Link href={`/${locale}/sell`}>
                <Plus weight="bold" className="size-4" />
                {locale === 'bg' ? 'Добави' : 'Add'}
              </Link>
            </Button>
          </div>

          {/* Revolut-style stats pills */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-account-stat-bg border border-account-stat-border">
              <Package weight="duotone" className="size-4 text-account-accent" />
              <span className="font-semibold">{totalProducts}</span>
              <span className="text-muted-foreground">{t.products}</span>
            </div>
            {lowStockProducts > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-semibold text-amber-600 dark:text-amber-400">{lowStockProducts}</span>
                <span className="text-amber-600/70 dark:text-amber-400/70">{t.lowStock}</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop: Full header */}
        <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-account-stat-icon-bg border border-account-stat-border flex items-center justify-center">
              <Storefront weight="fill" className="size-7 text-account-stat-icon" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-foreground">{seller.store_name}</h2>
                {seller.verified && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-0">
                    <Star weight="fill" className="size-3 mr-1" />
                    {locale === 'bg' ? 'Потвърден' : 'Verified'}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {locale === 'bg' ? 'Член от' : 'Member since'} {new Date(seller.created_at).toLocaleDateString(locale)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="gap-2 rounded-full">
              <Link href={`/${locale}/account/sales`}>
                <ChartLineUp weight="bold" className="size-4" />
                {locale === 'bg' ? 'Продажби' : 'Sales'}
              </Link>
            </Button>
            <Button asChild className="gap-2 rounded-full">
              <Link href={`/${locale}/sell`}>
                <Plus weight="bold" className="size-4" />
                {locale === 'bg' ? 'Нова обява' : 'New Listing'}
              </Link>
            </Button>
          </div>
        </div>

        {/* Desktop: Stats Grid - using account tokens */}
        <div className="hidden sm:grid grid-cols-2 gap-3 @xl/main:grid-cols-4">
          <Card className="@container/card">
            <CardHeader className="p-4">
              <CardDescription className="flex items-center gap-1.5">
                <Package weight="duotone" className="size-4 shrink-0 text-account-stat-icon" />
                <span className="truncate">{locale === 'bg' ? 'Продукти' : 'Products'}</span>
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {totalProducts.toLocaleString()}
              </CardTitle>
              <div className="pt-1">
                <Badge variant="outline" className="text-account-info border-account-stat-border bg-account-info-soft">
                  {locale === 'bg' ? 'Активни' : 'Active'}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className="@container/card">
            <CardHeader className="p-4">
              <CardDescription className="flex items-center gap-1.5">
                <CurrencyCircleDollar weight="duotone" className="size-4 shrink-0 text-emerald-500" />
                <span className="truncate">{locale === 'bg' ? 'Стойност' : 'Value'}</span>
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400 @[250px]/card:text-3xl">
                {formatCurrency(totalValue)}
              </CardTitle>
              <div className="pt-1">
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400">
                  {locale === 'bg' ? 'Инвентар' : 'Inventory'}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className="@container/card">
            <CardHeader className="p-4">
              <CardDescription className="flex items-center gap-1.5">
                <ShoppingCart weight="duotone" className="size-4 shrink-0" />
                <span className="truncate">{locale === 'bg' ? 'Поръчки' : 'Orders'}</span>
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                0
              </CardTitle>
              <div className="pt-1">
                <Badge variant="outline" className="text-muted-foreground border-border">
                  {locale === 'bg' ? 'Този месец' : 'This month'}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className={`@container/card ${lowStockProducts > 0 ? "border-amber-200 dark:border-amber-800" : ""}`}>
            <CardHeader className="p-4">
              <CardDescription className="flex items-center gap-1.5">
                <Warning weight="duotone" className="size-4 shrink-0" />
                <span className="truncate">{locale === 'bg' ? 'Нисък склад' : 'Low Stock'}</span>
              </CardDescription>
              <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${lowStockProducts > 0 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                {lowStockProducts.toLocaleString()}
              </CardTitle>
              <div className="pt-1">
                {lowStockProducts > 0 ? (
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-400">
                    {locale === 'bg' ? 'Внимание' : 'Attention'}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground border-border">
                    {locale === 'bg' ? 'Всичко е ОК' : 'All good'}
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Products List - No card wrapper on mobile */}
        <div className="sm:hidden mt-4">
          <div className="flex items-center justify-between px-1 mb-3">
            <span className="font-semibold text-base text-foreground">
              {locale === 'bg' ? 'Вашите продукти' : 'Your Products'}
            </span>
          </div>
          <SellingProductsList products={sellerProducts} locale={locale} />
        </div>

        {/* Desktop: Products in Card */}
        <Card className="hidden sm:block shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  {locale === 'bg' ? 'Вашите продукти' : 'Your Products'}
                </CardTitle>
                <CardDescription>
                  {locale === 'bg' ? 'Управлявайте вашите обяви' : 'Manage your product listings'}
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href={`/${locale}/sell`}>
                  <Plus weight="bold" className="size-4 mr-2" />
                  {locale === 'bg' ? 'Добави' : 'Add'}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <SellingProductsList products={sellerProducts} locale={locale} />
          </CardContent>
        </Card>
    </div>
  )
}
