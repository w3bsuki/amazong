import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI, normalizeProductRow } from "@/lib/data/products"
import { 
  cachedJsonResponse, 
  dbUnavailableResponse, 
  parsePaginationParams 
} from "@/lib/api/response-helpers"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"

// Type for the nested select with relations
interface ProductRowWithRelations {
  id: string
  title: string
  price: number
  list_price: number | null
  rating: number | null
  review_count: number | null
  images: string[] | null
  product_images?: Array<{
    image_url: string
    thumbnail_url: string | null
    display_order: number | null
    is_primary: boolean | null
  }> | null
  product_attributes: Array<{ name: string; value: string }> | null
  is_boosted: boolean | null
  boost_expires_at: string | null
  created_at: string
  slug: string | null
  attributes?: Record<string, unknown> | null
  category_ancestors: string[] | null
  seller: { username: string | null } | null
  categories: {
    id: string
    slug: string
    name: string
    name_bg: string | null
    icon: string | null
    parent: {
      id: string
      slug: string
      name: string
      name_bg: string | null
      icon: string | null
      parent: {
        id: string
        slug: string
        name: string
        name_bg: string | null
        icon: string | null
        parent: {
          id: string
          slug: string
          name: string
          name_bg: string | null
          icon: string | null
        } | null
      } | null
    } | null
  } | null
}

/**
 * GET /api/products/newest
 * 
 * Fetch newest products with hierarchical category filtering.
 * When filtering by category, returns ALL products in that category
 * AND all its descendants (L0 -> L1 -> L2 -> L3 -> L4).
 * 
 * Uses the optimized `category_ancestors` GIN index for O(1) lookups.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const { page, limit: safeLimit, offset } = parsePaginationParams(searchParams)
  const category = searchParams.get("category")
  const sort = searchParams.get("sort") || "newest"
  const type = searchParams.get("type") || "newest"

  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const minRating = searchParams.get("minRating")
  const availability = searchParams.get("availability")

  // Extract attr_* params for attribute filtering.
  // Keys are stable, canonical attribute keys (e.g. attr_brand=Apple).
  const attributeFilters: Record<string, string[]> = {}
  for (const [key] of searchParams.entries()) {
    if (!key.startsWith('attr_')) continue
    const rawName = key.slice('attr_'.length)
    if (!rawName) continue

    const name = normalizeAttributeKey(rawName) || rawName
    const values = searchParams.getAll(key).filter((v) => v && v.length > 0)
    if (values.length > 0) {
      attributeFilters[name] = attributeFilters[name]
        ? Array.from(new Set([...(attributeFilters[name] || []), ...values]))
        : values
    }
  }
  
  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return dbUnavailableResponse()
    }

    let productRows: ProductRowWithRelations[] = []
    let totalCount = 0

    // Common select fields for product queries
    // OPTIMIZED: Flat category join - no 4-level nesting!
    const productSelect = `
      id, 
      title, 
      price, 
      list_price, 
      rating, 
      review_count, 
      images,
      free_shipping,
      category_ancestors, 
      is_boosted,
      boost_expires_at,
      created_at, 
      slug,
      seller:profiles(id,username,avatar_url,tier),
      categories(id,slug,name,name_bg,icon)
    `

    if (category) {
      // =================================================================
      // HIERARCHICAL CATEGORY QUERY
      // Uses category_ancestors array with GIN index for fast containment
      // queries. Returns ALL products where the category is in their
      // ancestor chain (Fashion -> Men -> Clothing -> T-shirts).
      // =================================================================
      
      // Step 1: Get category UUID from slug
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .limit(1)
        .maybeSingle()
      
      if (categoryError) {
        console.error("[API] Category lookup error:", categoryError.message)
        return NextResponse.json({ 
          products: [], 
          hasMore: false,
          error: categoryError.message 
        }, { status: 500 })
      }

      if (!categoryData) {
        // Category not found - return empty
        return cachedJsonResponse({
          products: [],
          hasMore: false,
          totalCount: 0,
          page,
        })
      }

      // Step 2: Query products using .filter() with raw PostgREST syntax
      // 'cs' = contains operator (@>), works with array columns
      // This uses the GIN index on category_ancestors for efficient lookups
      let query = supabase
        .from('products')
        .select(productSelect, { count: 'exact' })
        .filter('category_ancestors', 'cs', `{${categoryData.id}}`)
        // Public browsing surfaces must not show non-active listings.
        // Temporary legacy allowance: status can be NULL for older rows.
        .or('status.eq.active,status.is.null')

      // Feed type filters: promoted = active boosts only (is_boosted=true AND boost_expires_at > now)
      if (type === 'promoted') {
        query = query.eq('is_boosted', true)
        query = query.gt('boost_expires_at', new Date().toISOString())
      }

      // Base filters
      if (minPrice) query = query.gte('price', Number(minPrice))
      if (maxPrice) query = query.lte('price', Number(maxPrice))
      if (minRating) query = query.gte('rating', Number(minRating))
      if (availability === 'instock') query = query.gt('stock', 0)

      // Attribute filters (JSONB "attributes")
      for (const [attrName, values] of Object.entries(attributeFilters)) {
        if (values.length === 1) {
          query = query.contains('attributes', { [attrName]: values[0] })
        } else if (values.length > 1) {
          query = query.in(`attributes->>${attrName}`, values)
        }
      }

      // Sorting
      switch (sort) {
        case 'price-asc':
          query = query.order('price', { ascending: true })
          break
        case 'price-desc':
          query = query.order('price', { ascending: false })
          break
        case 'rating':
          query = query.order('rating', { ascending: false, nullsFirst: false })
          query = query.order('review_count', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
      }

      const { data, error, count } = await query
        .range(offset, offset + safeLimit - 1)

      if (error) {
        // Range errors (requesting beyond available data) return malformed errors.
        // If page > 1 and we get an error, treat as empty results (hasMore=false).
        if (page > 1) {
          productRows = []
          totalCount = count ?? 0
        } else {
          console.error("[API] Products by category error:", error)
          return NextResponse.json({ 
            products: [], 
            hasMore: false,
            error: typeof error.message === 'string' ? error.message : 'Query failed'
          }, { status: 500 })
        }
      } else {
        productRows = (data ?? []) as unknown as ProductRowWithRelations[]
        totalCount = count ?? 0
      }
    } else {
      // =================================================================
      // ALL PRODUCTS (no category filter)
      // Simple query with pagination
      // =================================================================
      let query = supabase
        .from('products')
        .select(productSelect, { count: 'exact' })
        // Public browsing surfaces must not show non-active listings.
        // Temporary legacy allowance: status can be NULL for older rows.
        .or('status.eq.active,status.is.null')

      // Feed type filters: promoted = active boosts only (is_boosted=true AND boost_expires_at > now)
      if (type === 'promoted') {
        query = query.eq('is_boosted', true)
        query = query.gt('boost_expires_at', new Date().toISOString())
      }

      // Base filters
      if (minPrice) query = query.gte('price', Number(minPrice))
      if (maxPrice) query = query.lte('price', Number(maxPrice))
      if (minRating) query = query.gte('rating', Number(minRating))
      if (availability === 'instock') query = query.gt('stock', 0)

      // Attribute filters
      for (const [attrName, values] of Object.entries(attributeFilters)) {
        if (values.length === 1) {
          query = query.contains('attributes', { [attrName]: values[0] })
        } else if (values.length > 1) {
          query = query.in(`attributes->>${attrName}`, values)
        }
      }

      // Sorting
      switch (sort) {
        case 'price-asc':
          query = query.order('price', { ascending: true })
          break
        case 'price-desc':
          query = query.order('price', { ascending: false })
          break
        case 'rating':
          query = query.order('rating', { ascending: false, nullsFirst: false })
          query = query.order('review_count', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
      }

      const { data, error, count } = await query
        .range(offset, offset + safeLimit - 1)

      if (error) {
        // Range errors (requesting beyond available data) return malformed errors.
        // If page > 1 and we get an error, treat as empty results (hasMore=false).
        if (page > 1) {
          productRows = []
          totalCount = count ?? 0
        } else {
          console.error("[API] Newest products error:", error)
          return NextResponse.json({ 
            products: [], 
            hasMore: false,
            error: typeof error.message === 'string' ? error.message : 'Query failed'
          }, { status: 500 })
        }
      } else {
        productRows = (data ?? []) as unknown as ProductRowWithRelations[]
        totalCount = count ?? 0
      }
    }

    // Transform to UI format using shared normalizer
    const products = productRows.map((p) => toUI(normalizeProductRow(p)))

    const hasMore = offset + products.length < totalCount

    return cachedJsonResponse({
      products,
      hasMore,
      totalCount,
      page,
    })
  } catch (error) {
    console.error("[API] Newest products exception:", error)
    return NextResponse.json({ 
      products: [], 
      hasMore: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}
