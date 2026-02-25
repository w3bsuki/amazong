import { validateLocale } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { WishlistContent } from "./wishlist-content"
import type { Metadata } from "next"
import { withAccountPageShell } from "../_lib/account-page-shell"

interface WishlistPageProps {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    category?: string
    q?: string
    stock?: string
  }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Wishlist" })
  return {
    title: t("heading"),
    description: t("description"),
  }
}

export default async function WishlistPage({ params, searchParams }: WishlistPageProps) {
  return withAccountPageShell(params, async ({ locale, supabase, user }) => {
    const t = await getTranslations({ locale, namespace: "Wishlist" })
    const { category: categoryFilter, q: searchQuery, stock: stockFilter } =
      await searchParams

    // Best-effort cleanup of sold/out_of_stock items older than 1 day.
    // (Requires the DB migration that defines cleanup_sold_wishlist_items().)
    try {
      await supabase.rpc("cleanup_sold_wishlist_items")
    } catch {
      // Ignore if not deployed yet.
    }

    const { data: wishlistData } = await supabase
      .from("wishlists")
      .select("id, product_id, created_at, share_token, is_public")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    const initialShareToken = wishlistData?.[0]?.share_token ?? null
    const initialIsPublic = Boolean(wishlistData?.[0]?.is_public)

    const productIds = (wishlistData ?? []).map((item) => item.product_id)
    const { data: productsData } =
      productIds.length > 0
        ? await supabase
            .from("products")
            .select("id, title, price, images, stock, category_id")
            .in("id", productIds)
        : { data: [] }

    const categoryIds = (productsData ?? [])
      .map((product) => product.category_id)
      .filter(Boolean) as string[]
    const { data: categoriesData } =
      categoryIds.length > 0
        ? await supabase
            .from("categories")
            .select("id, name, slug")
            .in("id", categoryIds)
        : { data: [] }

    const productsMap = new Map((productsData ?? []).map((product) => [product.id, product]))
    const categoriesLookup = new Map(
      (categoriesData ?? []).map((category) => [category.id, category])
    )

    interface WishlistItem {
      id: string
      product_id: string
      title: string
      price: number
      image: string
      stock: number
      created_at: string
      category_id: string | null
      category_name: string | null
      category_slug: string | null
    }

    const items: WishlistItem[] = (wishlistData ?? []).map((item) => {
      const product = productsMap.get(item.product_id)
      const category = product?.category_id
        ? categoriesLookup.get(product.category_id)
        : null
      return {
        id: item.id,
        product_id: item.product_id,
        title: product?.title || t("unknownProduct"),
        price: product?.price || 0,
        image: product?.images?.[0] || "/placeholder.svg",
        stock: product?.stock || 0,
        created_at: item.created_at,
        category_id: product?.category_id || null,
        category_name: category?.name || null,
        category_slug: category?.slug || null,
      }
    })

    const categoriesMap = new Map<
      string,
      { id: string; name: string; slug: string; count: number }
    >()
    items.forEach((item) => {
      if (item.category_slug && item.category_name) {
        const existing = categoriesMap.get(item.category_slug)
        if (existing) {
          existing.count++
        } else {
          categoriesMap.set(item.category_slug, {
            id: item.category_id || "",
            name: item.category_name,
            slug: item.category_slug,
            count: 1,
          })
        }
      }
    })
    const categories = [...categoriesMap.values()].sort((a, b) => b.count - a.count)

    const stats = {
      total: items.length,
      inStock: items.filter((item) => item.stock > 0).length,
      outOfStock: items.filter((item) => item.stock <= 0).length,
      totalValue: items.reduce((sum, item) => sum + item.price, 0),
    }

    return {
      title: t("title"),
      content: (
        <WishlistContent
          initialItems={items}
          stats={stats}
          locale={locale}
          categories={categories}
          initialCategoryFilter={categoryFilter || null}
          initialSearchQuery={searchQuery || ""}
          initialStockFilter={stockFilter || "all"}
          initialShareToken={initialShareToken}
          initialIsPublic={initialIsPublic}
        />
      ),
    }
  })
}
