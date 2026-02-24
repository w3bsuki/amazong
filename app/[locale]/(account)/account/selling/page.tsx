import { createClient } from "@/lib/supabase/server"
import { Link, redirect } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { bulkUpdateProductStatus } from "../../../../actions/products-bulk"
import { clearProductDiscount, setProductDiscountPrice } from "../../../../actions/products-discounts"
import { deleteProduct } from "../../../../actions/products-update"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartLine as ChartLineUp, CircleDollarSign as CurrencyCircleDollar, Package, Plus, ShoppingCart, Star, Store as Storefront, TriangleAlert as Warning } from "lucide-react";

import { SellingProductsList } from "./selling-products-list"

interface SellingPageProps {
  params: Promise<{
    locale: string
  }>
}

interface Product {
  id: string
  slug: string
  title: string
  description: string | null
  price: number
  list_price: number | null
  is_on_sale: boolean | null
  sale_percent: number | null
  sale_end_date: string | null
  stock: number
  images: string[]
  rating: number | null
  review_count: number | null
  created_at: string
  is_boosted: boolean
  boost_expires_at: string | null
  status: 'active' | 'draft' | 'archived' | 'out_of_stock'
  category: {
    name: string
    slug: string
  } | null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "SellerManagement" })
  return {
    title: `${t("selling.pageTitle")} | Treido`,
    description: t("selling.sections.manageListings"),
  }
}

export default async function SellingPage({ params }: SellingPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "SellerManagement" })
  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  // Check if user has a seller profile (has username)
  const { data: profile } = await supabase
    .from("profiles")
    .select("id,username,display_name,business_name,verified,created_at")
    .eq("id", user.id)
    .single()

  // If no username, redirect to sell page to set one up
  if (!profile || !profile.username) {
    return redirect({ href: "/sell", locale })
  }

  // Map profile to seller format for compatibility
  const seller = {
    ...profile,
    store_name: profile.display_name || profile.business_name || profile.username,
  }

  // Fetch seller's products
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      title,
      description,
      price,
      list_price,
      is_on_sale,
      sale_percent,
      sale_end_date,
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

  const sellerProducts: Product[] = (products ?? []).map((product): Product => {
    const rawCategory = (product as { category?: unknown }).category
    const categoryRecord =
      Array.isArray(rawCategory) && rawCategory.length > 0
        ? rawCategory[0]
        : rawCategory

    const category =
      categoryRecord &&
      typeof categoryRecord === "object" &&
      "name" in categoryRecord &&
      "slug" in categoryRecord &&
      typeof (categoryRecord as { name?: unknown }).name === "string" &&
      typeof (categoryRecord as { slug?: unknown }).slug === "string"
        ? {
            name: (categoryRecord as { name: string }).name,
            slug: (categoryRecord as { slug: string }).slug,
          }
        : null

    const statusRaw = (product as { status?: unknown }).status
    const status: Product["status"] =
      statusRaw === "active" ||
      statusRaw === "draft" ||
      statusRaw === "archived" ||
      statusRaw === "out_of_stock"
        ? statusRaw
        : "draft"

    return {
      ...(product as Omit<Product, "status" | "category">),
      status,
      category,
    } as Product
  })

  // Calculate stats
  const totalProducts = sellerProducts.length
  const lowStockProducts = sellerProducts.filter(p => p.stock < 5).length
  const totalValue = sellerProducts.reduce((sum, p) => sum + (Number(p.price) * p.stock), 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }

  return (
    <div className="flex flex-col gap-4 md:gap-4">
      <h1 className="sr-only">{t("selling.pageTitle")}</h1>

      {/* Mobile: Revolut-style header with stats pills */}
      <div className="sm:hidden">
        {/* Store info + Add button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-muted border border-border flex items-center justify-center">
              <Storefront className="size-5 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{seller.store_name}</span>
                {seller.verified && (
                  <Star className="size-3.5 text-success" />
                )}
              </div>
            </div>
          </div>
          <Button asChild size="sm" className="gap-1.5 rounded-full px-4">
            <Link href="/sell">
              <Plus className="size-4" />
              {t("selling.actions.add")}
            </Link>
          </Button>
        </div>

        {/* Revolut-style stats pills */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border-subtle">
            <Package className="size-4 text-primary" />
            <span className="font-semibold">{totalProducts}</span>
            <span className="text-muted-foreground">
              {t("selling.stats.productsLabel", { count: totalProducts })}
            </span>
          </div>
          {lowStockProducts > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
              <span className="size-2 rounded-full bg-warning animate-pulse" />
              <span className="font-semibold text-warning">{lowStockProducts}</span>
              <span className="text-warning/70">{t("selling.stats.lowStockLabel")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Full header */}
      <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-md bg-muted border border-border flex items-center justify-center">
            <Storefront className="size-7 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-foreground">{seller.store_name}</h2>
              {seller.verified && (
                <Badge variant="secondary" className="bg-success/10 text-success border-0">
                  <Star className="size-3 mr-1" />
                  {t("selling.badges.verified")}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("selling.labels.memberSince")} {new Date(seller.created_at).toLocaleDateString(locale)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="gap-2 rounded-full">
            <Link href="/account/sales">
              <ChartLineUp className="size-4" />
              {t("selling.actions.sales")}
            </Link>
          </Button>
          <Button asChild className="gap-2 rounded-full">
            <Link href="/sell">
              <Plus className="size-4" />
              {t("selling.actions.newListing")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop: Stats Grid - using account tokens */}
      <div className="hidden sm:grid grid-cols-2 gap-3 @xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader className="p-4">
            <CardDescription className="flex items-center gap-1.5">
              <Package className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{t("selling.stats.products.title")}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalProducts.toLocaleString()}
            </CardTitle>
            <div className="pt-1">
              <Badge variant="outline" className="text-info border-border-subtle bg-info/10">
                {t("selling.badges.active")}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader className="p-4">
            <CardDescription className="flex items-center gap-1.5">
              <CurrencyCircleDollar className="size-4 shrink-0 text-success" />
              <span className="truncate">{t("selling.stats.value.title")}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-success @[250px]/card:text-3xl">
              {formatCurrency(totalValue)}
            </CardTitle>
            <div className="pt-1">
              <Badge variant="outline" className="text-success border-success/20 bg-success/10">
                {t("selling.badges.inventory")}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader className="p-4">
            <CardDescription className="flex items-center gap-1.5">
              <ShoppingCart className="size-4 shrink-0" />
              <span className="truncate">{t("selling.stats.orders.title")}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              0
            </CardTitle>
            <div className="pt-1">
              <Badge variant="outline" className="text-muted-foreground border-border">
                {t("selling.badges.thisMonth")}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className={`@container/card ${lowStockProducts > 0 ? "border-warning/20" : ""}`}>
          <CardHeader className="p-4">
            <CardDescription className="flex items-center gap-1.5">
              <Warning className="size-4 shrink-0" />
              <span className="truncate">{t("selling.stats.lowStock.title")}</span>
            </CardDescription>
            <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${lowStockProducts > 0 ? 'text-warning' : ''}`}>
              {lowStockProducts.toLocaleString()}
            </CardTitle>
            <div className="pt-1">
              {lowStockProducts > 0 ? (
                <Badge variant="outline" className="text-warning border-warning/20 bg-warning/10">
                  {t("selling.badges.attention")}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground border-border">
                  {t("selling.badges.allGood")}
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
            {t("selling.sections.yourProducts")}
          </span>
        </div>
        <SellingProductsList
          products={sellerProducts}
          sellerUsername={profile.username}
          locale={locale}
          actions={{
            deleteProduct,
            bulkUpdateProductStatus,
            setProductDiscountPrice,
            clearProductDiscount,
          }}
        />
      </div>

      {/* Desktop: Products in Card */}
      <Card className="hidden sm:block shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                {t("selling.sections.yourProducts")}
              </CardTitle>
              <CardDescription>
                {t("selling.sections.manageListings")}
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/sell">
                <Plus className="size-4 mr-2" />
                {t("selling.actions.add")}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <SellingProductsList
            products={sellerProducts}
            sellerUsername={profile.username}
            locale={locale}
            actions={{
              deleteProduct,
              bulkUpdateProductStatus,
              setProductDiscountPrice,
              clearProductDiscount,
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
