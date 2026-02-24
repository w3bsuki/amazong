import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import type { Product, UIProduct } from "./types"

function normalizeCategoryNode(input: unknown): Product["categories"] {
  if (!input) return null

  const node = Array.isArray(input) ? input[0] : input
  if (!node || typeof node !== "object") return null

  const raw = node as Record<string, unknown>

  const parent = raw.parent
  const normalizedParent = parent ? normalizeCategoryNode(parent) : null

  return {
    ...(typeof raw.id === "string" ? { id: raw.id } : {}),
    ...(typeof raw.slug === "string" ? { slug: raw.slug } : {}),
    ...(typeof raw.name === "string" ? { name: raw.name } : {}),
    ...(typeof raw.name_bg === "string" || raw.name_bg === null
      ? { name_bg: raw.name_bg as string | null }
      : {}),
    ...(typeof raw.icon === "string" || raw.icon === null ? { icon: raw.icon as string | null } : {}),
    ...(normalizedParent ? { parent: normalizedParent } : {}),
  }
}

/**
 * Maps raw DB row to Product with normalized fields.
 * Extracted to avoid duplication across getProducts/getProductsByCategorySlug.
 */
export function mapRowToProduct(p: unknown): Product {
  const row = p && typeof p === "object" ? (p as Record<string, unknown>) : {}
  const categories = normalizeCategoryNode(row.categories)
  const seller =
    row.seller && typeof row.seller === "object" ? (row.seller as Record<string, unknown>) : null
  // Extract nested user_verification from seller
  const uv =
    seller?.user_verification && typeof seller.user_verification === "object"
      ? ((Array.isArray(seller.user_verification)
          ? seller.user_verification[0]
          : seller.user_verification) as Record<string, unknown>)
      : null

  const rawProduct = row as { is_boosted?: boolean | null }
  const baseProduct = row as Partial<Product>

  return {
    ...baseProduct,
    is_boosted: rawProduct.is_boosted ?? null,
    categories,
    category_slug: categories?.slug ?? null,
    store_slug: typeof seller?.username === "string" ? (seller.username as string) : null,
    seller_profile: {
      ...(seller as Product["seller_profile"]),
      email_verified: uv?.email_verified === true ? true : null,
      phone_verified: uv?.phone_verified === true ? true : null,
      id_verified: uv?.id_verified === true ? true : null,
    },
  } as Product
}

function buildCategoryPath(
  leaf: Product["categories"],
): { slug: string; name: string; nameBg?: string | null; icon?: string | null }[] | undefined {
  if (!leaf) return undefined

  const out: { slug: string; name: string; nameBg?: string | null; icon?: string | null }[] = []

  let current: Product["categories"] | null | undefined = leaf
  // Guard against cycles / absurd depth.
  for (let i = 0; i < 8 && current; i++) {
    if (typeof current.slug === "string" && typeof current.name === "string") {
      out.push({
        slug: current.slug,
        name: current.name,
        ...(current.name_bg != null ? { nameBg: current.name_bg } : {}),
        ...(current.icon != null ? { icon: current.icon } : {}),
      })
    }
    current = (current.parent as Product["categories"] | null | undefined) ?? null
  }

  out.reverse()
  return out.length ? out : undefined
}

function buildAttributesMap(p: Product): Record<string, string> {
  const map: Record<string, string> = {}

  // products.attributes jsonb (fast filtering source)
  const raw =
    p.attributes && typeof p.attributes === "object" && !Array.isArray(p.attributes)
      ? (p.attributes as Record<string, unknown>)
      : {}

  for (const [k, v] of Object.entries(raw)) {
    if (v == null) continue
    const key = normalizeAttributeKey(k)
    if (!key) continue
    if (typeof v === "string") map[key] = v
    else if (typeof v === "number" || typeof v === "boolean") map[key] = String(v)
  }

  // product_attributes rows (canonical item specifics)
  for (const row of p.product_attributes ?? []) {
    if (!row?.name || !row?.value) continue
    const key = normalizeAttributeKey(row.name)
    if (!key) continue
    // Prefer explicit row values over jsonb when both exist
    map[key] = row.value
  }

  // Aliases / common synonyms for UI
  if (!map.condition && map.fashion_condition) map.condition = map.fashion_condition
  if (!map.year && map.model_year) map.year = map.model_year
  if (!map.mileage_km && map.mileage) map.mileage_km = map.mileage
  if (!map.mileage && map.mileage_km) map.mileage = map.mileage_km
  if (!map.size && map.clothing_size) map.size = map.clothing_size

  return map
}

function pickPrimaryImage(p: Product): string {
  const fromTable = (p.product_images ?? [])
    .filter((img) => !!img?.image_url)
    .sort((a, b) => {
      const ap = a.is_primary ? 1 : 0
      const bp = b.is_primary ? 1 : 0
      if (ap !== bp) return bp - ap
      const ao = a.display_order ?? 0
      const bo = b.display_order ?? 0
      return ao - bo
    })

  const firstUrl = fromTable[0]?.image_url
  if (firstUrl) return firstUrl
  return p.images?.[0] || "/placeholder.svg"
}

/**
 * Normalize raw Supabase query row to Product type.
 * This helper reduces duplication across API routes by handling the
 * common field mapping (seller -> seller_profile, categories.slug -> category_slug, etc.)
 */
export function normalizeProductRow(p: {
  id: string
  title: string
  price: number
  created_at?: string | null
  seller_id?: string | null
  list_price?: number | null
  is_on_sale?: boolean | null
  sale_percent?: number | null
  sale_end_date?: string | null
  rating?: number | null
  review_count?: number | null
  images?: string[] | null
  free_shipping?: boolean | null
  seller_city?: string | null
  product_images?: Array<{
    image_url: string
    thumbnail_url?: string | null
    display_order?: number | null
    is_primary?: boolean | null
  }> | null
  product_attributes?: Array<{ name: string; value: string }> | null
  is_boosted?: boolean | null
  boost_expires_at?: string | null
  slug?: string | null
  attributes?: unknown
  seller?: {
    id?: string | null
    username?: string | null
    display_name?: string | null
    business_name?: string | null
    avatar_url?: string | null
    tier?: string | null
    account_type?: string | null
    is_verified_business?: boolean | null
  } | null
  categories?: {
    id?: string
    slug?: string
    name?: string
    name_bg?: string | null
    icon?: string | null
    parent?: unknown
  } | null
}): Product {
  const result: Product = {
    id: p.id,
    title: p.title,
    price: p.price,
    created_at: p.created_at ?? null,
    seller_id: p.seller_id ?? null,
    list_price: p.list_price ?? null,
    is_on_sale: p.is_on_sale ?? null,
    sale_percent: p.sale_percent ?? null,
    sale_end_date: p.sale_end_date ?? null,
    rating: p.rating ?? null,
    review_count: p.review_count ?? null,
    images: p.images ?? null,
    free_shipping: p.free_shipping ?? null,
    seller_city: p.seller_city ?? null,
    product_images: p.product_images ?? null,
    product_attributes: p.product_attributes ?? null,
    // NOTE: This is a raw flag. Active boost status depends on `boost_expires_at` vs "now",
    // and must be computed outside cached functions to keep cache output deterministic.
    is_boosted: p.is_boosted ?? null,
    boost_expires_at: p.boost_expires_at ?? null,
    slug: p.slug ?? null,
    store_slug: p.seller?.username ?? null,
    category_slug: p.categories?.slug ?? null,
    categories: p.categories ?? null,
    seller_profile: p.seller ?? null,
  }
  // Handle optional attributes separately to satisfy exactOptionalPropertyTypes
  const attrs = p.attributes
  if (attrs != null) {
    ;(result as { attributes: typeof attrs }).attributes = attrs
  }
  return result
}

/** Transform to UI format */
export function toUI(p: Product): UIProduct {
  const attrs = buildAttributesMap(p)
  const sellerDisplayName =
    p.seller_profile?.display_name ||
    p.seller_profile?.business_name ||
    p.seller_profile?.username ||
    null
  const rawTier = (p.seller_profile?.tier || "").toLowerCase()
  const accountType = (p.seller_profile?.account_type || "").toLowerCase()
  const sellerTier: UIProduct["sellerTier"] =
    accountType === "business"
      ? "business"
      : rawTier === "premium"
        ? "premium"
        : rawTier === "business"
          ? "business"
          : "basic"
  const sellerVerified = Boolean(p.seller_profile?.is_verified_business)

  const categoryPath = buildCategoryPath(p.categories)
  const categoryRootSlug = categoryPath?.[0]?.slug

  return {
    id: p.id,
    title: p.title,
    price: p.price,
    ...(typeof p.created_at === "string" ? { createdAt: p.created_at } : {}),
    ...(typeof p.list_price === "number" ? { listPrice: p.list_price } : {}),
    ...(typeof p.is_on_sale === "boolean" ? { isOnSale: p.is_on_sale } : {}),
    ...(typeof p.sale_percent === "number" ? { salePercent: p.sale_percent } : {}),
    saleEndDate: p.sale_end_date ?? null,
    isBoosted: Boolean(p.is_boosted),
    boostExpiresAt: p.boost_expires_at ?? null,
    image: pickPrimaryImage(p),
    rating: p.rating ?? 0,
    reviews: p.review_count ?? 0,
    ...(p.category_slug ? { categorySlug: p.category_slug } : {}),
    ...(categoryRootSlug ? { categoryRootSlug } : {}),
    ...(categoryPath ? { categoryPath } : {}),
    slug: p.slug ?? null,
    storeSlug: p.store_slug ?? null,
    sellerId: p.seller_id ?? p.seller_profile?.id ?? null,
    sellerName: sellerDisplayName,
    sellerAvatarUrl: p.seller_profile?.avatar_url ?? null,
    sellerTier,
    sellerVerified,
    sellerEmailVerified: p.seller_profile?.email_verified ?? false,
    sellerPhoneVerified: p.seller_profile?.phone_verified ?? false,
    sellerIdVerified: p.seller_profile?.id_verified ?? false,
    freeShipping: p.free_shipping === true,
    ...(Object.keys(attrs).length ? { attributes: attrs } : {}),
    ...(typeof attrs.condition === "string" ? { condition: attrs.condition } : {}),
    ...(typeof attrs.brand === "string" ? { brand: attrs.brand } : {}),
    ...(typeof attrs.make === "string" ? { make: attrs.make } : {}),
    ...(typeof attrs.model === "string" ? { model: attrs.model } : {}),
    ...(typeof attrs.year === "string" ? { year: attrs.year } : {}),
    // Use attrs.location first, fall back to seller_city
    ...((typeof attrs.location === "string"
      ? { location: attrs.location }
      : p.seller_city
        ? { location: p.seller_city }
        : {}) as Partial<UIProduct>),
  }
}
