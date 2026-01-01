import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WishlistContent } from "./wishlist-content"

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

export default async function WishlistPage({ params, searchParams }: WishlistPageProps) {
  const { locale } = await params
  const { category: categoryFilter, q: searchQuery, stock: stockFilter } = await searchParams
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Best-effort cleanup of sold/out_of_stock items older than 1 day.
  // (Requires the DB migration that defines cleanup_sold_wishlist_items().)
  try {
    await supabase.rpc("cleanup_sold_wishlist_items")
  } catch {
    // Ignore if not deployed yet.
  }

  // Fetch wishlist items
  const { data: wishlistData } = await supabase
    .from("wishlists")
    .select("id, product_id, created_at, share_token, is_public")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const initialShareToken = wishlistData?.[0]?.share_token ?? null
  const initialIsPublic = Boolean(wishlistData?.[0]?.is_public)

  // Fetch products for wishlist items
  const productIds = (wishlistData || []).map((w) => w.product_id)
  const { data: productsData } = productIds.length > 0
    ? await supabase
        .from("products")
        .select("id, title, price, images, stock, category_id")
        .in("id", productIds)
    : { data: [] }

  // Fetch categories for products
  const categoryIds = (productsData || []).map((p) => p.category_id).filter(Boolean) as string[]
  const { data: categoriesData } = categoryIds.length > 0
    ? await supabase
        .from("categories")
        .select("id, name, slug")
        .in("id", categoryIds)
    : { data: [] }

  // Create lookup maps
  const productsMap = new Map((productsData || []).map((p) => [p.id, p]))
  const categoriesLookup = new Map((categoriesData || []).map((c) => [c.id, c]))

  // Transform to expected format with category info
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
  
  const items: WishlistItem[] = (wishlistData || []).map((item) => {
    const product = productsMap.get(item.product_id)
    const category = product?.category_id ? categoriesLookup.get(product.category_id) : null
    return {
      id: item.id,
      product_id: item.product_id,
      title: product?.title || "Unknown Product",
      price: product?.price || 0,
      image: product?.images?.[0] || "/placeholder.svg",
      stock: product?.stock || 0,
      created_at: item.created_at,
      category_id: product?.category_id || null,
      category_name: category?.name || null,
      category_slug: category?.slug || null,
    }
  })

  // Extract unique categories from wishlist items for filtering
  const categoriesMap = new Map<string, { id: string; name: string; slug: string; count: number }>()
  items.forEach((item) => {
    if (item.category_slug && item.category_name) {
      const existing = categoriesMap.get(item.category_slug)
      if (existing) {
        existing.count++
      } else {
        categoriesMap.set(item.category_slug, {
          id: item.category_id || '',
          name: item.category_name,
          slug: item.category_slug,
          count: 1,
        })
      }
    }
  })
  const categories = [...categoriesMap.values()].sort((a, b) => b.count - a.count)

  // Calculate stats (before filtering)
  const stats = {
    total: items.length,
    inStock: items.filter((i) => i.stock > 0).length,
    outOfStock: items.filter((i) => i.stock <= 0).length,
    totalValue: items.reduce((sum, i) => sum + i.price, 0),
  }

  return (
    <div className="flex flex-col gap-4 md:gap-4">
      <h1 className="sr-only">{locale === "bg" ? "Любими продукти" : "Wishlist"}</h1>
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
    </div>
  )
}
