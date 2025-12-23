import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ProductPageContent } from "@/components/shared/product/product-page-content-new"
import { ProductCard } from "@/components/shared/product/product-card"
import { RecentlyViewedTracker } from "@/components/shared/product/recently-viewed-tracker"
import { ReviewsSectionServer } from "@/components/product/reviews/reviews-section-server"
import { ProductBreadcrumb } from "@/components/shared/product/product-breadcrumb"
import { ReviewsLoadingSkeleton } from "./_components/reviews-loading-skeleton"
import {
  extractProductId,
  fetchProductByIdOrSlug,
  getDeliveryDate,
} from "./_components/product-page-utils"

interface ProductPageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id, locale } = await params
  setRequestLocale(locale)
  const supabase = await createClient()

  if (!supabase) {
    return {
      title: locale === "bg" ? "Продукт не е намерен" : "Product Not Found",
    }
  }

  const product = await fetchProductByIdOrSlug(supabase, id)

  if (!product) {
    return {
      title: locale === "bg" ? "Продукт не е намерен" : "Product Not Found",
    }
  }

  // SEO: Use stable URL under /product/{slugOrId}
  // Canonical seller URL is handled via redirect in the page when seller username is known.
  const canonicalSlug = product.slug || product.id
  const canonicalUrl = `/${locale}/product/${canonicalSlug}`

  return {
    title: product.title,
    description: product.description?.slice(0, 160) || `Shop ${product.title}`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160),
      images: product.images?.[0] ? [product.images[0]] : [],
      url: canonicalUrl,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  await connection()
  const { id, locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Product")
  const supabase = await createClient()

  if (!supabase) {
    notFound()
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const currentUserId = user?.id || null

  // Format delivery date
  const formattedDeliveryDate = getDeliveryDate(locale)

  // Determine if we're looking up by UUID or slug
  const { isFullUUID } = extractProductId(id)
  
  // Build query - can lookup by id or slug
  let query = supabase
    .from("products")
    .select("*")
  
  if (isFullUUID) {
    query = query.eq("id", id)
  } else {
    // Try slug first, then short ID
    query = query.eq("slug", id)
  }

  let { data: product, error } = await query.single()
  
  // If slug lookup failed, try short ID extraction
  if (!product && !isFullUUID) {
    const parts = id.split('-')
    const shortId = parts[parts.length - 1]
    if (shortId && shortId.length === 8) {
      const { data: byShortId } = await supabase
        .from("products")
        .select("*")
        .ilike("id", `${shortId}%`)
        .single()
      product = byShortId
      error = null
    }
  }

  if (error || !product) {
    notFound()
  }

  // Fetch category separately (no FK relation in types)
  let category = null
  if (product.category_id) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("*")
      .eq("id", product.category_id)
      .single()
    category = categoryData
  }

  // Fetch seller (profile) and their stats separately
  let seller = null
  let _sellerStats = null
  if (product.seller_id) {
    const { data: sellerData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", product.seller_id)
      .single()
    seller = sellerData

    // Fetch seller stats
    const { data: statsData } = await supabase
      .from("seller_stats")
      .select("*")
      .eq("seller_id", product.seller_id)
      .single()
    _sellerStats = statsData
  }

  // SEO: Redirect to canonical URL with username
  // Canonical pattern: /{locale}/{username}/{productSlug}
  if (product.slug && seller?.username) {
    redirect(`/${locale}/${seller.username}/${product.slug}`)
  }

  // Fetch parent category if exists
  let parentCategory = null
  if (category?.parent_id) {
    const { data: parent } = await supabase
      .from("categories")
      .select("*")
      .eq("id", category.parent_id)
      .single()
    parentCategory = parent
  }

  // Fetch related products
  const { data: relatedProductsRaw } = await supabase
    .from("products")
    .select("*")
    .neq("id", id)
    .limit(6)

  // For each related product, fetch its seller profile (for URLs)
  const relatedProducts = relatedProductsRaw
    ? await Promise.all(relatedProductsRaw.map(async (p) => {
        const { data: relSeller } = await supabase
          .from("profiles")
          .select("id, username, display_name, business_name, avatar_url, tier, account_type, is_verified_business")
          .eq("id", p.seller_id)
          .single()
        return { ...p, seller: relSeller }
      }))
    : []

  // Prepare translations for client component
  const translations = {
    inStock: t("inStock"),
    freeDeliveryDate: t("freeDeliveryDate", { date: formattedDeliveryDate }),
    shipsFrom: t("shipsFrom"),
    amazonStore: t("amazonStore"),
    soldBy: t("soldBy"),
    freeReturns: t("freeReturns"),
    freeDelivery: t("freeDelivery"),
    secureTransaction: t("secureTransaction"),
    aboutThisItem: t("aboutThisItem"),
    ratingLabel: t("ratingLabel", { rating: product.rating || 0, max: 5 }),
    ratings: t("ratings", { count: product.review_count || 0 }),
    // New translation keys for product page
    shipping: t("shipping"),
    deliveryLabel: t("deliveryLabel"),
    returnsLabel: t("returnsLabel"),
    payments: t("payments"),
    condition: t("condition"),
    conditionNew: t("conditionNew"),
    seeDetails: t("seeDetails"),
    viewStore: t("viewStore"),
    enlarge: t("enlarge"),
    addToWatchlist: t("addToWatchlist"),
    removeFromWatchlist: t("removeFromWatchlist"),
    watching: t("watching"),
    picture: t("picture"),
    of: t("of"),
    popularItem: t("popularItem"),
    watchlistCount: t("watchlistCount"),
    freeShipping: t("freeShipping"),
    locatedIn: t("locatedIn"),
    estimatedDelivery: t("estimatedDelivery"),
    returns30Days: t("returns30Days"),
    moneyBackGuarantee: t("moneyBackGuarantee"),
    getItemOrMoneyBack: t("getItemOrMoneyBack"),
    learnMore: t("learnMore"),
    description: t("description"),
    specifications: t("specifications"),
    inTheBox: t("inTheBox"),
    technicalSpecs: t("technicalSpecs"),
    whatsInTheBox: t("whatsInTheBox"),
    itemNumber: t("itemNumber"),
    brand: t("brand"),
    type: t("type"),
    model: t("model"),
    countryOfOrigin: t("countryOfOrigin"),
    warranty: t("warranty"),
    months: t("months"),
    mainProduct: t("mainProduct"),
    userManual: t("userManual"),
    warrantyCard: t("warrantyCard"),
    originalPackaging: t("originalPackaging"),
    detailedSellerRatings: t("detailedSellerRatings"),
    averageLast12Months: t("averageLast12Months"),
    accurateDescription: t("accurateDescription"),
    reasonableShippingCost: t("reasonableShippingCost"),
    shippingSpeed: t("shippingSpeed"),
    communication: t("communication"),
    sellerFeedback: t("sellerFeedback"),
    allRatings: t("allRatings"),
    positive: t("positive"),
    neutral: t("neutral"),
    negative: t("negative"),
    seeAllFeedback: t("seeAllFeedback"),
    noDescriptionAvailable: t("noDescriptionAvailable"),
    previousImage: t("previousImage"),
    nextImage: t("nextImage"),
    imagePreview: t("imagePreview"),
    clickToEnlarge: t("clickToEnlarge"),
    sold: t("sold"),
    positivePercentage: t("positivePercentage"),
    moreFrom: t("moreFrom"),
    similarProduct: t("similarProduct"),
    viewAllItems: t("viewAllItems"),
    noFeedbackYet: t("noFeedbackYet"),
    noRatingsYet: t("noRatingsYet"),
  }

  // Breadcrumb items
  // Breadcrumb data is now built inline in the JSX

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-24 lg:pb-10">
      {/* Track this product as recently viewed */}
      <RecentlyViewedTracker
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || null,
          slug: product.slug || product.id,
          storeSlug: seller?.username,
        }}
      />

      {/* Breadcrumb - Desktop only for cleaner mobile UX */}
      <div className="hidden md:block md:static z-40 bg-background md:border-0">
        <div className="container py-1.5 lg:py-2">
          <ProductBreadcrumb
            locale={locale}
            category={category ? { name: category.name, slug: category.slug } : null}
            parentCategory={parentCategory ? { name: parentCategory.name, slug: parentCategory.slug } : null}
            productTitle={product.title}
          />
        </div>
      </div>

      {/* Main Product Content - Full width layout with proper container */}
      <div className="container pt-2 pb-0 lg:py-4">
        <ProductPageContent
          product={{
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            original_price: product.list_price,
            images: product.images || [],
            rating: product.rating || 0,
            reviews_count: product.review_count || 0,
            tags: product.tags || [],
            is_boosted: product.is_boosted || false,
            seller_id: product.seller_id,
          }}
          seller={seller ? {
            id: seller.id,
            username: seller.username ?? undefined,
            display_name: seller.display_name || seller.username || 'Seller',
            verified: seller.verified ?? false,
            created_at: seller.created_at,
          } : null}
          locale={locale}
          currentUserId={currentUserId}
          formattedDeliveryDate={formattedDeliveryDate}
          t={translations}
        />
      </div>

      {/* Related Products - eBay "People who viewed" style */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="container pt-4 pb-3 lg:py-6">
          <h2 className="text-base lg:text-lg font-semibold text-foreground mb-2 lg:mb-4">
            {locale === "bg" ? "Хората, които разгледаха това, разгледаха и" : "People who viewed this item also viewed"}
          </h2>
          
          {/* Mobile: Horizontal scroll with 2 cards visible */}
          <div className="lg:hidden -mx-3 px-3">
            <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
              {relatedProducts.map((p, idx) => (
                <div key={p.id} className="shrink-0 w-[calc(50%-5px)] snap-start">
                  <ProductCard
                    id={p.id}
                    title={p.title}
                    price={p.price}
                    image={p.images?.[0] || "/placeholder.svg"}
                    rating={p.rating || 0}
                    reviews={p.review_count || 0}
                    originalPrice={p.list_price}
                    tags={p.tags || []}
                    index={idx}
                    slug={p.slug}
                    storeSlug={p.seller?.username}
                    sellerId={p.seller?.id}
                    sellerName={(p.seller?.display_name || p.seller?.business_name || p.seller?.username) || undefined}
                    sellerAvatarUrl={p.seller?.avatar_url || null}
                    sellerTier={p.seller?.account_type === 'business' ? 'business' : (p.seller?.tier === 'premium' ? 'premium' : 'basic')}
                    sellerVerified={Boolean(p.seller?.is_verified_business)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop: Grid layout */}
          <div className="hidden lg:grid lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {relatedProducts.map((p, idx) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.title}
                price={p.price}
                image={p.images?.[0] || "/placeholder.svg"}
                rating={p.rating || 0}
                reviews={p.review_count || 0}
                originalPrice={p.list_price}
                tags={p.tags || []}
                index={idx}
                slug={p.slug}
                storeSlug={p.seller?.username}
                sellerId={p.seller?.id}
                sellerName={(p.seller?.display_name || p.seller?.business_name || p.seller?.username) || undefined}
                sellerAvatarUrl={p.seller?.avatar_url || null}
                sellerTier={p.seller?.account_type === 'business' ? 'business' : (p.seller?.tier === 'premium' ? 'premium' : 'basic')}
                sellerVerified={Boolean(p.seller?.is_verified_business)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Product Reviews Section - Server Component with Suspense */}
      <div id="product-reviews-section" className="border-t bg-background scroll-mt-4">
        <div className="container py-8">
          <Suspense fallback={<ReviewsLoadingSkeleton />}>
            <ReviewsSectionServer
              rating={product.rating || 0}
              reviewCount={product.review_count || 0}
              productId={product.id}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
