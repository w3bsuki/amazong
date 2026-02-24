import { cookies } from "next/headers"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { createStaticClient } from "@/lib/supabase/server"
import { getShippingFilter, parseShippingRegion } from "@/lib/shipping"
import { getCategoryContext, getCategoryHierarchy } from "@/lib/data/categories"
import type { ProductGridProduct } from "@/components/shared/product/product-grid"
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

type RawCategory = {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
}

type CategoryHierarchyItem = RawCategory & {
  children?: RawCategory[]
}

type CategoryContextData = Awaited<ReturnType<typeof getCategoryContext>>

function toCategory(category: RawCategory): Category {
  return {
    id: category.id,
    name: category.name,
    name_bg: category.name_bg,
    slug: category.slug,
    parent_id: category.parent_id,
    image_url: category.image_url ?? null,
  }
}

function mapCategoryHierarchy(categoryHierarchy: CategoryHierarchyItem[]) {
  const allCategories = categoryHierarchy.map((category) => toCategory(category))
  const allCategoriesWithSubs = categoryHierarchy.map((category) => ({
    category: toCategory(category),
    subs: (category.children ?? []).map((child) => toCategory(child)),
  }))

  return { allCategories, allCategoriesWithSubs }
}

function resolveCategoryContextData(
  categoryContext: CategoryContextData,
  browseMode: BrowseMode
) {
  if (!categoryContext) {
    return {
      currentCategory: null as Category | null,
      parentCategory: null as Category | null,
      subcategories: [] as Category[],
      filterableAttributes: [] as CategoryAttribute[],
      categoryIdForFilters: undefined as string | undefined,
    }
  }

  return {
    currentCategory: toCategory(categoryContext.current),
    parentCategory: categoryContext.parent ? toCategory(categoryContext.parent) : null,
    subcategories: categoryContext.children.map((category) => toCategory(category)),
    filterableAttributes: browseMode === "listings" ? categoryContext.attributes : [],
    categoryIdForFilters: browseMode === "listings" ? categoryContext.current.id : undefined,
  }
}

function toSellerFilters(
  searchParams: Record<string, string | string[] | undefined>
) {
  const sellerSortParam = toSingleValue(searchParams.sellerSort)
  const sellerVerifiedParam = toSingleValue(searchParams.sellerVerified)
  const sellerMinRatingParam = toSingleValue(searchParams.sellerMinRating)
  const sellerMinListingsParam = toSingleValue(searchParams.sellerMinListings)
  const cityParam = toSingleValue(searchParams.city)
  const nearbyParam = toSingleValue(searchParams.nearby)

  return parseSellerSearchFilters({
    ...(sellerSortParam ? { sellerSort: sellerSortParam } : {}),
    ...(sellerVerifiedParam ? { sellerVerified: sellerVerifiedParam } : {}),
    ...(sellerMinRatingParam ? { sellerMinRating: sellerMinRatingParam } : {}),
    ...(sellerMinListingsParam ? { sellerMinListings: sellerMinListingsParam } : {}),
    ...(cityParam ? { city: cityParam } : {}),
    ...(nearbyParam ? { nearby: nearbyParam } : {}),
  })
}

async function loadListingsData({
  supabase,
  query,
  categoryIdForFilters,
  searchParams,
  currentPage,
  shippingFilter,
}: {
  supabase: ReturnType<typeof createStaticClient>
  query: string
  categoryIdForFilters: string | undefined
  searchParams: Record<string, string | string[] | undefined>
  currentPage: number
  shippingFilter: ReturnType<typeof getShippingFilter> | undefined
}) {
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

  return {
    products: result.products,
    totalProducts: result.total,
  }
}

async function loadSellersData({
  supabase,
  query,
  currentCategory,
  categorySlug,
  searchParams,
  currentPage,
}: {
  supabase: ReturnType<typeof createStaticClient>
  query: string
  currentCategory: Category | null
  categorySlug: string | undefined
  searchParams: Record<string, string | string[] | undefined>
  currentPage: number
}) {
  const sellerFilters = toSellerFilters(searchParams)
  const sellerCategorySlug = currentCategory?.slug ?? categorySlug

  const sellerResults = await searchSellers(supabase, {
    query,
    ...(sellerCategorySlug ? { categorySlug: sellerCategorySlug } : {}),
    filters: sellerFilters,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  })

  return {
    sellers: sellerResults.sellers,
    totalSellers: sellerResults.total,
  }
}

function toGridProduct(product: Product): ProductGridProduct {
  return {
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
  }
}

function getCategoryDisplayName(category: Category | null, locale: string) {
  if (!category) return
  if (locale === "bg" && category.name_bg) return category.name_bg
  return category.name
}

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

  const searchUrlParams = toUrlSearchParams(searchParams)

  const [categoryHierarchy, categoryContext] = await Promise.all([
    getCategoryHierarchy(null, 1),
    categorySlug ? getCategoryContext(categorySlug) : Promise.resolve(null),
  ])

  const { allCategories, allCategoriesWithSubs } = mapCategoryHierarchy(
    categoryHierarchy as CategoryHierarchyItem[]
  )

  const {
    currentCategory,
    parentCategory,
    subcategories,
    filterableAttributes,
    categoryIdForFilters,
  } = resolveCategoryContextData(categoryContext, browseMode)

  const listingsData =
    browseMode === "listings"
      ? await loadListingsData({
          supabase,
          query,
          categoryIdForFilters,
          searchParams,
          currentPage,
          shippingFilter,
        })
      : { products: [] as Product[], totalProducts: 0 }

  const sellersData =
    browseMode === "sellers"
      ? await loadSellersData({
          supabase,
          query,
          currentCategory,
          categorySlug,
          searchParams,
          currentPage,
        })
      : { sellers: [] as SellerResultCard[], totalSellers: 0 }

  const t = await getTranslations("SearchFilters")

  const gridProducts: ProductGridProduct[] = listingsData.products.map((product) =>
    toGridProduct(product)
  )
  const categoryName = getCategoryDisplayName(currentCategory, locale)
  const totalResults =
    browseMode === "sellers" ? sellersData.totalSellers : listingsData.totalProducts

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
      parentCategory={parentCategory}
      subcategories={subcategories}
      allCategories={allCategories}
      allCategoriesWithSubs={allCategoriesWithSubs}
      categoryIdForFilters={categoryIdForFilters}
      categoryName={categoryName}
      filterableAttributes={filterableAttributes}
      gridProducts={gridProducts}
      productsCount={listingsData.products.length}
      sellers={sellersData.sellers}
      totalProducts={listingsData.totalProducts}
      totalSellers={sellersData.totalSellers}
      totalResults={totalResults}
      modeListingsHref={modeListingsHref}
      modeSellersHref={modeSellersHref}
      itemsPerPage={ITEMS_PER_PAGE}
      t={t}
    />
  )
}
