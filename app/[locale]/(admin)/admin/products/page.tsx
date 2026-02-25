import { createAdminClient, createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { Link } from "@/i18n/routing"
import { getAdminPageShell } from "../_lib/admin-page-shell"
import { Badge } from "@/components/ui/badge"
import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExternalLink as IconExternalLink } from "lucide-react";
import { AdminTablePageLayout } from "../_components/admin-table-page-layout"


import { logger } from "@/lib/logger"
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
      logger.error("Failed to fetch products:", error.message)
    }
    return []
  }

  return (products || []) as AdminProduct[]
}

async function AdminProductsContent() {
  await (await createClient()).auth.getUser()

  const products = await getProducts()
  const { t, locale, dateLocale } = await getAdminPageShell("AdminProducts")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "BGN",
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <AdminTablePageLayout
      title={t("page.title")}
      description={t("page.description")}
      headerRight={(
        <Badge variant="outline" className="text-base">
          {t("summary", { count: products.length })}
        </Badge>
      )}
      tableTitle={t("table.title")}
      tableDescription={t("table.description")}
    >
      <TableHeader>
        <TableRow>
          <TableHead>{t("table.headers.product")}</TableHead>
          <TableHead className="hidden md:table-cell">{t("table.headers.seller")}</TableHead>
          <TableHead>{t("table.headers.price")}</TableHead>
          <TableHead>{t("table.headers.stock")}</TableHead>
          <TableHead>{t("table.headers.status")}</TableHead>
          <TableHead className="hidden md:table-cell">{t("table.headers.listed")}</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">{t("table.headers.product")}</span>
          </TableHead>
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
              <MarketplaceBadge variant={product.stock > 0 ? "stock-available" : "stock-out"}>
                {product.stock > 0
                  ? t("badges.inStock", { count: product.stock })
                  : t("badges.outOfStock")}
              </MarketplaceBadge>
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
                  aria-label={`${t("table.headers.product")}: ${product.title}`}
                >
                  <IconExternalLink className="size-4" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </AdminTablePageLayout>
  )
}

export const metadata = {
  title: "Admin Products | Treido",
  description: "Review and manage Treido products.",
}

export default async function AdminProductsPage() {
  return <AdminProductsContent />
}
