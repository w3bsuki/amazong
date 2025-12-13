import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
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
  await connection()
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

  // Fetch wishlist items with product details including stock AND category
  const { data: wishlistData } = await supabase
    .from("wishlists")
    .select(`
      id,
      product_id,
      created_at,
      products (
        id,
        title,
        price,
        images,
        stock,
        category_id,
        categories (
          id,
          name,
          slug
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Transform to expected format with category info
  const items = (wishlistData || []).map((item: any) => ({
    id: item.id,
    product_id: item.product_id,
    title: item.products?.title || "Unknown Product",
    price: item.products?.price || 0,
    image: item.products?.images?.[0] || "/placeholder.svg",
    stock: item.products?.stock || 0,
    created_at: item.created_at,
    category_id: item.products?.category_id || null,
    category_name: item.products?.categories?.name || null,
    category_slug: item.products?.categories?.slug || null,
  }))

  // Extract unique categories from wishlist items for filtering
  const categoriesMap = new Map<string, { id: string; name: string; slug: string; count: number }>()
  items.forEach((item: any) => {
    if (item.category_slug && item.category_name) {
      const existing = categoriesMap.get(item.category_slug)
      if (existing) {
        existing.count++
      } else {
        categoriesMap.set(item.category_slug, {
          id: item.category_id,
          name: item.category_name,
          slug: item.category_slug,
          count: 1,
        })
      }
    }
  })
  const categories = Array.from(categoriesMap.values()).sort((a, b) => b.count - a.count)

  // Calculate stats (before filtering)
  const stats = {
    total: items.length,
    inStock: items.filter((i: any) => i.stock > 0).length,
    outOfStock: items.filter((i: any) => i.stock <= 0).length,
    totalValue: items.reduce((sum: number, i: any) => sum + i.price, 0),
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="sr-only">{locale === "bg" ? "Любими продукти" : "Wishlist"}</h1>
      <WishlistContent 
        initialItems={items} 
        stats={stats} 
        locale={locale} 
        categories={categories}
        initialCategoryFilter={categoryFilter || null}
        initialSearchQuery={searchQuery || ""}
        initialStockFilter={stockFilter || "all"}
      />
    </div>
  )
}
