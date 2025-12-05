import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import Link from "next/link"
import Image from "next/image"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Package,
  Eye,
  Pencil,
  Storefront,
  CurrencyCircleDollar,
  ShoppingCart,
  Warning,
  Star,
  TrendUp,
  Clock,
  Tag,
} from "@phosphor-icons/react/dist/ssr"

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4 sm:py-6">
        {/* Breadcrumb */}
        <AppBreadcrumb items={[
          { label: locale === 'bg' ? 'Акаунт' : 'Account', href: '/account' },
          { label: locale === 'bg' ? 'Моят магазин' : 'My Store' }
        ]} />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="size-14 sm:size-16 rounded-xl bg-linear-to-br from-brand to-brand-dark flex items-center justify-center shadow-lg">
              <Storefront weight="fill" className="size-7 sm:size-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{seller.store_name}</h1>
                {seller.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
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
          <Button asChild className="gap-2" size="lg">
            <Link href={`/${locale}/sell`}>
              <Plus weight="bold" className="size-4" />
              {locale === 'bg' ? 'Нова обява' : 'New Listing'}
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="size-10 sm:size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Package weight="duotone" className="size-5 sm:size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{locale === 'bg' ? 'Общо продукти' : 'Total Products'}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="size-10 sm:size-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <CurrencyCircleDollar weight="duotone" className="size-5 sm:size-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{locale === 'bg' ? 'Стойност' : 'Inventory Value'}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="size-10 sm:size-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <ShoppingCart weight="duotone" className="size-5 sm:size-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{locale === 'bg' ? 'Поръчки' : 'Orders'}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={lowStockProducts > 0 ? "border-amber-200 dark:border-amber-800" : ""}>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`size-10 sm:size-12 rounded-xl flex items-center justify-center shrink-0 ${
                  lowStockProducts > 0 
                    ? "bg-amber-100 dark:bg-amber-900/30" 
                    : "bg-muted"
                }`}>
                  <Warning weight="duotone" className={`size-5 sm:size-6 ${
                    lowStockProducts > 0 
                      ? "text-amber-600 dark:text-amber-400" 
                      : "text-muted-foreground"
                  }`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{locale === 'bg' ? 'Нисък склад' : 'Low Stock'}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{lowStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg sm:text-xl">
                  {locale === 'bg' ? 'Вашите продукти' : 'Your Products'}
                </CardTitle>
                <CardDescription>
                  {locale === 'bg' ? 'Управлявайте вашите обяви' : 'Manage your product listings'}
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="self-start sm:self-auto">
                <Link href={`/${locale}/sell`}>
                  <Plus weight="bold" className="size-4 mr-2" />
                  {locale === 'bg' ? 'Добави продукт' : 'Add Product'}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sellerProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="size-16 sm:size-20 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                  <Package weight="duotone" className="size-8 sm:size-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {locale === 'bg' ? 'Нямате продукти все още' : 'No products yet'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {locale === 'bg' 
                    ? 'Започнете да продавате, като създадете първата си обява' 
                    : 'Start selling by creating your first product listing'}
                </p>
                <Button asChild>
                  <Link href={`/${locale}/sell`}>
                    <Plus weight="bold" className="size-4 mr-2" />
                    {locale === 'bg' ? 'Създай обява' : 'Create Listing'}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-border">
                {sellerProducts.map((product) => (
                  <div key={product.id} className="flex items-start sm:items-center gap-3 sm:gap-4 py-4 first:pt-0 last:pb-0">
                    {/* Product Image */}
                    <div className="relative size-16 sm:size-20 rounded-lg overflow-hidden bg-muted shrink-0">
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
                          <Package className="size-6 sm:size-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/${locale}/product/${product.id}`}
                          className="font-medium text-foreground hover:text-brand hover:underline line-clamp-1 text-sm sm:text-base"
                        >
                          {product.title}
                        </Link>
                        {product.list_price && product.list_price > product.price && (
                          <Badge variant="secondary" className="bg-deal/10 text-deal border-0 text-xs shrink-0">
                            <Tag weight="fill" className="size-3 mr-0.5" />
                            -{Math.round(((product.list_price - product.price) / product.list_price) * 100)}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground mt-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className={`font-medium ${product.list_price && product.list_price > product.price ? 'text-deal' : 'text-foreground'}`}>
                            {formatCurrency(Number(product.price))}
                          </span>
                          {product.list_price && product.list_price > product.price && (
                            <span className="text-muted-foreground line-through text-xs">
                              {formatCurrency(Number(product.list_price))}
                            </span>
                          )}
                        </div>
                        <span className={product.stock < 5 ? "text-amber-600 dark:text-amber-400 font-medium" : ""}>
                          {product.stock === 0 
                            ? (locale === 'bg' ? 'Изчерпан' : 'Out of stock')
                            : `${product.stock} ${locale === 'bg' ? 'в склад' : 'in stock'}`
                          }
                        </span>
                        {product.category && (
                          <span className="hidden sm:inline">{(product.category as any).name}</span>
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
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <Button asChild variant="ghost" size="icon" className="size-8 sm:size-9">
                        <Link href={`/${locale}/product/${product.id}`}>
                          <Eye className="size-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="size-8 sm:size-9">
                        <Link href={`/${locale}/account/selling/${product.id}/edit`}>
                          <Pencil className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Tips - Only show if they have products */}
        {sellerProducts.length > 0 && (
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <TrendUp weight="duotone" className="size-5 text-brand" />
                {locale === 'bg' ? 'Съвети за повече продажби' : 'Tips to boost your sales'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Package weight="duotone" className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">
                      {locale === 'bg' ? 'Добавете повече снимки' : 'Add more photos'}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {locale === 'bg' 
                        ? 'Продуктите с 4+ снимки се продават 2x по-бързо' 
                        : 'Products with 4+ photos sell 2x faster'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <CurrencyCircleDollar weight="duotone" className="size-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">
                      {locale === 'bg' ? 'Конкурентни цени' : 'Competitive pricing'}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {locale === 'bg' 
                        ? 'Проверете цените на конкурентите' 
                        : 'Check competitor prices regularly'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                    <Clock weight="duotone" className="size-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">
                      {locale === 'bg' ? 'Бърз отговор' : 'Quick response'}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {locale === 'bg' 
                        ? 'Отговаряйте на съобщенията бързо' 
                        : 'Respond to messages quickly'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
