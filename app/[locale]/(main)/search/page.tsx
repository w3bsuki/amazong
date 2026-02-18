import { cookies } from "next/headers"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { createStaticClient } from "@/lib/supabase/server"
import { getShippingFilter, parseShippingRegion } from "@/lib/shipping"
import { getCategoryContext } from "@/lib/data/categories"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import type { CategoryPillRailItem } from "@/components/mobile/category-nav"
import type { ProductGridProduct } from "@/components/grid"
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
  buildCategoryHref,
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
  let siblingCategories: Category[] = []
  let subcategories: Category[] = []
  let allCategories: Category[] = []
  let allCategoriesWithSubs: { category: Category; subs: Category[] }[] = []
  let filterableAttributes: CategoryAttribute[] = []
  let categoryIdForFilters: string | undefined

  const searchUrlParams = toUrlSearchParams(searchParams)

  if (supabase) {
    const { data: rootCats, error: rootError } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, parent_id, image_url, display_order")
      .is("parent_id", null)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true })

    if (rootError) {
      console.error("[SearchPage] Root categories fetch error:", rootError)
    }

    if (rootCats && rootCats.length > 0) {
      allCategories = rootCats

      const rootIds = rootCats.map((c) => c.id)
      const { data: subCats } = await supabase
        .from("categories")
        .select("id, name, name_bg, slug, parent_id, image_url, display_order")
        .in("parent_id", rootIds)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true })

      allCategoriesWithSubs = rootCats.map((cat) => ({
        category: cat,
        subs: (subCats || []).filter((c) => c.parent_id === cat.id),
      }))

      const allCats = [...rootCats, ...(subCats || [])]

      if (categorySlug) {
        const categoryData = allCats.find((c) => c.slug === categorySlug) || null

        if (categoryData) {
          currentCategory = categoryData
          categoryIdForFilters = categoryData.id

          if (categoryData.parent_id) {
            siblingCategories = allCats.filter((c) => c.parent_id === categoryData.parent_id)
            subcategories = []
          } else {
            subcategories = allCats.filter((c) => c.parent_id === categoryData.id)
            siblingCategories = []
          }
        }
      }

      if (browseMode === "listings") {
        const attributeFilters = extractAttributeFilters(searchParams)
        const categoryIds =
          currentCategory != null
            ? currentCategory.parent_id
              ? [currentCategory.id]
              : [currentCategory.id, ...subcategories.map((s) => s.id)]
            : null

        const result = await searchProducts(
          supabase,
          query,
          categoryIds,
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
    }
  }

  if (browseMode === "listings" && categorySlug) {
    const ctx = await getCategoryContext(categorySlug)
    if (ctx) {
      filterableAttributes = ctx.attributes
      categoryIdForFilters = ctx.current.id
    }
  }

  const t = await getTranslations("SearchFilters")
  const tCategories = await getTranslations("Categories")

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

  const railCategories = currentCategory
    ? (subcategories.length > 0 ? subcategories : siblingCategories).filter((cat) => cat.slug !== currentCategory.slug)
    : allCategories.slice(0, 8)

  const allRailLabel = currentCategory
    ? tCategories("allIn", {
        category:
          categoryName ??
          tCategories("shortName", {
            slug: currentCategory ? getCategorySlugKey(currentCategory.slug) : "other",
            name: currentCategory?.name ?? "",
          }),
      })
    : tCategories("headerTitleAll")

  const railItems: CategoryPillRailItem[] = [
    {
      id: "all-categories",
      label: allRailLabel,
      href: buildCategoryHref(searchUrlParams, browseMode, currentCategory ? currentCategory.slug : null),
      active: !currentCategory || Boolean(currentCategory),
      title: allRailLabel,
    },
    ...railCategories.map((category) => ({
      id: category.id,
      label: tCategories("shortName", {
        slug: getCategorySlugKey(category.slug),
        name: getCategoryName(category, locale),
      }),
      href: buildCategoryHref(searchUrlParams, browseMode, category.slug),
      active: currentCategory?.slug === category.slug,
      title: locale === "bg" && category.name_bg ? category.name_bg : category.name,
    })),
  ]

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
      userZone={userZone ?? null}
      gridProducts={gridProducts}
      productsCount={products.length}
      sellers={sellers}
      totalProducts={totalProducts}
      totalSellers={totalSellers}
      totalResults={totalResults}
      modeListingsHref={modeListingsHref}
      modeSellersHref={modeSellersHref}
      railItems={railItems}
      itemsPerPage={ITEMS_PER_PAGE}
      t={t}
      tCategories={tCategories}
    />
  )
}
