import { createAdminClient, createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { Link } from "@/i18n/routing"
import { getLocale, getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { connection } from "next/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IconExternalLink } from "@tabler/icons-react"

interface AdminProduct {
  id: string
  title: string
  slug: string | null
  price: number
  stock: number
  is_boosted: boolean | null
  created_at: string
  seller_id: string
  profiles: { business_name: string | null; display_name: string | null; username: string | null } | null
}

async function getProducts(): Promise<AdminProduct[]> {
  const adminClient = createAdminClient()

  const { data: products, error } = await adminClient
    .from("products")
    .select(`
      id,
      title,
      slug,
      price,
      stock,
      is_boosted,
      created_at,
      seller_id,
      profiles!products_seller_id_fkey (
        business_name,
        display_name,
        username
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    if (!error.message.includes("During prerendering, fetch() rejects when the prerender is complete")) {
      console.error("Failed to fetch products:", error.message)
    }
    return []
  }

  return (products || []) as AdminProduct[]
}

async function AdminProductsContent() {
  await (await createClient()).auth.getUser()

  const products = await getProducts()
  const t = await getTranslations("AdminProducts")
  const locale = await getLocale()
  const dateLocale = locale === "bg" ? bg : enUS

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "BGN",
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
        <Badge variant="outline" className="text-base">
          {t("summary", { count: products.length })}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>{t("table.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.headers.product")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("table.headers.seller")}</TableHead>
                  <TableHead>{t("table.headers.price")}</TableHead>
                  <TableHead>{t("table.headers.stock")}</TableHead>
                  <TableHead>{t("table.headers.status")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("table.headers.listed")}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <p className="font-medium truncate max-w-52">{product.title}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {product.profiles?.business_name || product.profiles?.display_name || t("fallbacks.unknownSeller")}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? "stock-available" : "stock-out"}>
                        {product.stock > 0
                          ? t("badges.inStock", { count: product.stock })
                          : t("badges.outOfStock")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.is_boosted && (
                        <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
                          {t("badges.boosted")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDistanceToNow(new Date(product.created_at), { addSuffix: true, locale: dateLocale })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={
                            product.profiles?.username
                              ? `/${product.profiles.username}/${product.slug || product.id}`
                              : "#"
                          }
                          target="_blank"
                          aria-label={t("table.headers.product")}
                        >
                          <IconExternalLink className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function AdminProductsFallback() {
  const t = await getTranslations("AdminProducts")

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
        <Badge variant="outline" className="text-base">{t("loading")}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>{t("table.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">{t("loading")}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function AdminProductsPage() {
  await connection()

  return (
    <Suspense fallback={<AdminProductsFallback />}>
      <AdminProductsContent />
    </Suspense>
  )
}
