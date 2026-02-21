import { cookies } from "next/headers"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { createStaticClient } from "@/lib/supabase/server"
import { getShippingFilter, parseShippingRegion } from "@/lib/shipping"
import { getCategoryContext, getCategoryHierarchy } from "@/lib/data/categories"
import type { ProductGridProduct } from "@/components/grid/product-grid"
import type { CategoryAttribute } from "@/lib/data/categories"
import { SearchPageLayout } from "./_components/search-page-layout"
import { searchProducts } from "./_lib/search-products"
import { parseSellerSearchFilters, searchSellers } from "./_lib/search-sellers"
import {
  ITEMS_PER_PAGE,
  type BrowseMode,
  type Category,
  type Product,
  type SellerResultCard,
} from "./_lib/types"
import {
  BrowseModeSchema,
  buildModeHref,
  extractAttributeFilters,
  toSingleValue,
  toUrlSearchParams,
} from "./_lib/search-page-helpers"
import { generateSearchPageMetadata } from "./_lib/search-page-metadata"
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; category?: string; mode?: string }>
}) {
  return generateSearchPageMetadata({ params, searchParams })
}
export default async function SearchPage({
  params,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const searchParams = await searchParamsPromise
  const supabase = createStaticClient()

  const parsedMode = BrowseModeSchema.safeParse(toSingleValue(searchParams.mode))
  const browseMode: BrowseMode = parsedMode.success ? parsedMode.data : "listings"

  const query = toSingleValue(searchParams.q) || ""
  const categorySlug = toSingleValue(searchParams.category)
  const currentPage = Math.max(1, Number.parseInt(toSingleValue(searchParams.page) || "1", 10))

  const cookieStore = await cookies()
  const userZone = cookieStore.get("user-zone")?.value
  const parsedZone = parseShippingRegion(userZone)
  const shippingFilter = parsedZone !== "WW" ? (getShippingFilter(parsedZone) || undefined) : undefined

  let products: Product[] = []
  let totalProducts = 0
  let sellers: SellerResultCard[] = []
  let totalSellers = 0
  let currentCategory: Category | null = null
  let subcategories: Category[] = []
  let allCategories: Category[] = []
  let allCategoriesWithSubs: { category: Category; subs: Category[] }[] = []
  let filterableAttributes: CategoryAttribute[] = []
  let categoryIdForFilters: string | undefined

  const searchUrlParams = toUrlSearchParams(searchParams)

  const [categoryHierarchy, categoryContext] = await Promise.all([
    getCategoryHierarchy(null, 1),
    categorySlug ? getCategoryContext(categorySlug) : Promise.resolve(null),
  ])

  const toCategory = (category: {
    id: string
    name: string
    name_bg: string | null
    slug: string
    parent_id: string | null
    image_url?: string | null
  }): Category => ({
    id: category.id,
    name: category.name,
    name_bg: category.name_bg,
    slug: category.slug,
    parent_id: category.parent_id,
    image_url: category.image_url ?? null,
  })

  allCategories = categoryHierarchy.map((category) => toCategory(category))
  allCategoriesWithSubs = categoryHierarchy.map((category) => ({
    category: toCategory(category),
    subs: (category.children ?? []).map((child) => toCategory(child)),
  }))

  if (categoryContext) {
    currentCategory = toCategory(categoryContext.current)
    subcategories = categoryContext.children.map((category) => toCategory(category))

    if (browseMode === "listings") {
      filterableAttributes = categoryContext.attributes
      categoryIdForFilters = categoryContext.current.id
    }
  }

  if (browseMode === "listings") {
    const attributeFilters = extractAttributeFilters(searchParams)

    const result = await searchProducts(
      supabase,
      query,
      categoryIdForFilters ?? null,
      {
        minPrice: toSingleValue(searchParams.minPrice),
        maxPrice: toSingleValue(searchParams.maxPrice),
        tag: toSingleValue(searchParams.tag),
        minRating: toSingleValue(searchParams.minRating),
        deals: toSingleValue(searchParams.deals),
        promoted: toSingleValue(searchParams.promoted),
        nearby: toSingleValue(searchParams.nearby),
        city: toSingleValue(searchParams.city),
        verified: toSingleValue(searchParams.verified),
        availability: toSingleValue(searchParams.availability),
        sort: toSingleValue(searchParams.sort),
        attributes: Object.keys(attributeFilters).length > 0 ? attributeFilters : undefined,
      },
      currentPage,
      ITEMS_PER_PAGE,
      shippingFilter
    )

    products = result.products
    totalProducts = result.total
  } else {
    const sellerSortParam = toSingleValue(searchParams.sellerSort)
    const sellerVerifiedParam = toSingleValue(searchParams.sellerVerified)
    const sellerMinRatingParam = toSingleValue(searchParams.sellerMinRating)
    const sellerMinListingsParam = toSingleValue(searchParams.sellerMinListings)
    const cityParam = toSingleValue(searchParams.city)
    const nearbyParam = toSingleValue(searchParams.nearby)

    const sellerFilters = parseSellerSearchFilters({
      ...(sellerSortParam ? { sellerSort: sellerSortParam } : {}),
      ...(sellerVerifiedParam ? { sellerVerified: sellerVerifiedParam } : {}),
      ...(sellerMinRatingParam ? { sellerMinRating: sellerMinRatingParam } : {}),
      ...(sellerMinListingsParam ? { sellerMinListings: sellerMinListingsParam } : {}),
      ...(cityParam ? { city: cityParam } : {}),
      ...(nearbyParam ? { nearby: nearbyParam } : {}),
    })

    const sellerCategorySlug = currentCategory?.slug ?? categorySlug
    const sellerResults = await searchSellers(supabase, {
      query,
      ...(sellerCategorySlug ? { categorySlug: sellerCategorySlug } : {}),
      filters: sellerFilters,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    })
    sellers = sellerResults.sellers
    totalSellers = sellerResults.total
  }

  const t = await getTranslations("SearchFilters")

  const gridProducts: ProductGridProduct[] = products.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image_url || product.images?.[0] || "/placeholder.svg",
    listPrice: product.list_price ?? undefined,
    rating: product.rating ?? 0,
    reviews: product.review_count ?? 0,
    slug: product.slug ?? null,
    storeSlug: product.profiles?.username ?? null,
    sellerId: product.profiles?.id ?? null,
    sellerName:
      product.profiles?.display_name || product.profiles?.business_name || product.profiles?.username || undefined,
    sellerAvatarUrl: product.profiles?.avatar_url ?? null,
    sellerTier:
      product.profiles?.account_type === "business"
        ? "business"
        : product.profiles?.tier === "premium"
          ? "premium"
          : "basic",
    sellerVerified: Boolean(product.profiles?.is_verified_business),
    condition: product.attributes?.condition,
    tags: product.tags ?? [],
  }))

  const categoryName = currentCategory
    ? locale === "bg" && currentCategory.name_bg
      ? currentCategory.name_bg
      : currentCategory.name
    : undefined

  const totalResults = browseMode === "sellers" ? totalSellers : totalProducts

  const modeListingsHref = buildModeHref(searchUrlParams, "listings")
  const modeSellersHref = buildModeHref(searchUrlParams, "sellers")

  return (
    <SearchPageLayout
      locale={locale}
      browseMode={browseMode}
      query={query}
      categorySlug={categorySlug ?? null}
      currentPage={currentPage}
      currentCategory={currentCategory}
      subcategories={subcategories}
      allCategories={allCategories}
      allCategoriesWithSubs={allCategoriesWithSubs}
      categoryIdForFilters={categoryIdForFilters}
      categoryName={categoryName}
      filterableAttributes={filterableAttributes}
      gridProducts={gridProducts}
      productsCount={products.length}
      sellers={sellers}
      totalProducts={totalProducts}
      totalSellers={totalSellers}
      totalResults={totalResults}
      modeListingsHref={modeListingsHref}
      modeSellersHref={modeSellersHref}
      itemsPerPage={ITEMS_PER_PAGE}
      t={t}
    />
  )
}
