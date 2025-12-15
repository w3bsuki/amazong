import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import { createClient, createStaticClient } from "@/lib/supabase/server"
import { ProductPageContent } from "@/components/product-page-content-new"
import { ProductCard } from "@/components/product-card"
import { RecentlyViewedTracker } from "@/components/recently-viewed-tracker"
import { ReviewsSection } from "@/components/reviews-section"
import { ProductBreadcrumb } from "@/components/product-breadcrumb"

// =============================================================================
// SEO-OPTIMIZED PRODUCT PAGE
// URL Pattern: /{username}/{productSlug}
// Example: /indecisive_wear/kotka-winter-jacket
// =============================================================================

// Helper function to get delivery date
function getDeliveryDate(locale: string): string {
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 3)
  return deliveryDate.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

interface ProductPageProps {
  params: Promise<{
    username: string      // Seller's username (from profiles table)
    productSlug: string   // Product slug
    locale: string
  }>
}

// Helper to fetch product by username + product slug (SEO canonical format)
async function fetchProductByUsernameAndSlug(
  supabase: ReturnType<typeof createStaticClient>,
  username: string,
  productSlug: string
) {
  if (!supabase) return null

  // First, find the profile by username (case-insensitive)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, verified, is_seller, created_at")
    .ilike("username", username)
    .single()

  if (profileError || !profile) return null

  // Fetch product by slug + seller_id
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("slug", productSlug)
    .eq("seller_id", profile.id)
    .single()

  if (productError || !product) return null

  // Fetch category
  let category = null
  if (product.category_id) {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("id", product.category_id)
      .single()
    category = data
  }

  return { ...product, seller: profile, category }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { username, productSlug, locale } = await params
  const supabase = createStaticClient()

  if (!supabase) {
    return {
      title: locale === "bg" ? "Продукт не е намерен" : "Product Not Found",
    }
  }

  const product = await fetchProductByUsernameAndSlug(supabase, username, productSlug)

  if (!product) {
    return {
      title: locale === "bg" ? "Продукт не е намерен" : "Product Not Found",
    }
  }

  const seller = product.seller
  const displayName = seller?.display_name || seller?.username || username
  const canonicalUrl = `/${locale}/${username}/${productSlug}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amazong.com"
  const fullCanonicalUrl = `${siteUrl}${canonicalUrl}`

  // Build description
  const description = product.meta_description
    || product.description?.slice(0, 155)
    || `Shop ${product.title} from ${displayName}`

  return {
    title: `${product.title} | ${displayName}`,
    description,
    alternates: {
      canonical: fullCanonicalUrl,
      languages: {
        en: `${siteUrl}/en/${username}/${productSlug}`,
        bg: `${siteUrl}/bg/${username}/${productSlug}`,
      },
    },
    openGraph: {
      title: product.title,
      description,
      type: "website",
      url: fullCanonicalUrl,
      siteName: "Amazong",
      images: product.images?.[0]
        ? [{
            url: product.images[0],
            alt: product.title,
            width: 1200,
            height: 630,
          }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
    // JSON-LD will be added in the page component
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  await connection()
  const { username, productSlug, locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Product")

  // Use static client for public data (can be cached)
  const supabase = createStaticClient()
  // Use auth client only for user check
  const authClient = await createClient()

  if (!supabase) {
    notFound()
  }

  // Get current user (requires auth client with cookies)
  let currentUserId: string | null = null
  if (authClient) {
    const { data: { user } } = await authClient.auth.getUser()
    currentUserId = user?.id || null
  }

  // Format delivery date
  const formattedDeliveryDate = getDeliveryDate(locale)

  // Fetch product by username + slug (SEO canonical format)
  const product = await fetchProductByUsernameAndSlug(supabase, username, productSlug)

  if (!product) {
    notFound()
  }

  const category = product.category
  const seller = product.seller

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

  // Fetch related products (with seller's username for URLs and attributes for badges)
  const { data: relatedProductsRaw } = await supabase
    .from("products")
    .select("*")
    .neq("id", product.id)
    .eq("status", "active")
    .limit(6)

  // For each related product, fetch its seller and category
  const relatedProducts = relatedProductsRaw
    ? await Promise.all(relatedProductsRaw.map(async (p) => {
        const { data: relSeller } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, verified")
          .eq("id", p.seller_id)
          .single()
        let relCategory = null
        if (p.category_id) {
          const { data } = await supabase
            .from("categories")
            .select("id, name, slug")
            .eq("id", p.category_id)
            .single()
          relCategory = data
        }
        return { ...p, seller: relSeller, category: relCategory }
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

  // Build JSON-LD structured data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amazong.com"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images || [],
    sku: product.sku || product.id,
    brand: (product.attributes as Record<string, unknown> | null)?.brand
      ? { "@type": "Brand", name: (product.attributes as Record<string, unknown>).brand as string }
      : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BGN",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: seller?.display_name || seller?.username || "Seller",
        url: `${siteUrl}/${locale}/${seller?.username}`,
      },
      url: `${siteUrl}/${locale}/${username}/${productSlug}`,
    },
    aggregateRating: product.review_count && product.review_count > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating || 0,
          reviewCount: product.review_count,
        }
      : undefined,
  }

  // Build BreadcrumbList for rich snippets
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/${locale}`,
      },
      ...(parentCategory
        ? [{
            "@type": "ListItem",
            position: 2,
            name: parentCategory.name,
            item: `${siteUrl}/${locale}/categories/${parentCategory.slug}`,
          }]
        : []),
      ...(category
        ? [{
            "@type": "ListItem",
            position: parentCategory ? 3 : 2,
            name: category.name,
            item: `${siteUrl}/${locale}/categories/${category.slug}`,
          }]
        : []),
      {
        "@type": "ListItem",
        position: (parentCategory ? 3 : 2) + (category ? 1 : 0),
        name: product.title,
        item: `${siteUrl}/${locale}/${username}/${productSlug}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-24 lg:pb-10">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Track this product as recently viewed */}
      <RecentlyViewedTracker
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || null,
          slug: product.slug || product.id,
          username: seller?.username,
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
            slug: product.slug ?? undefined,
          }}
          seller={seller ? {
            id: seller.id,
            username: seller.username ?? undefined,
            display_name: seller.display_name || seller.username || "Seller",
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
              {relatedProducts.map((p, idx) => {
                const attributes = (p.attributes as Record<string, unknown>) || {}
                return (
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
                      variant="compact"
                      slug={p.slug}
                      username={p.seller?.username}
                      categorySlug={p.category?.slug}
                      condition={attributes.condition as string}
                      brand={attributes.brand as string}
                      make={attributes.make as string}
                      model={attributes.model as string}
                      year={attributes.year as string}
                      location={attributes.location as string}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden lg:grid lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {relatedProducts.map((p, idx) => {
              const attributes = (p.attributes as Record<string, unknown>) || {}
              return (
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
                  variant="compact"
                  slug={p.slug}
                  username={p.seller?.username}
                  categorySlug={p.category?.slug}
                  condition={attributes.condition as string}
                  brand={attributes.brand as string}
                  make={attributes.make as string}
                  model={attributes.model as string}
                  year={attributes.year as string}
                  location={attributes.location as string}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Product Reviews Section - Full width, eBay style */}
      <div id="product-reviews-section" className="border-t bg-background scroll-mt-4">
        <div className="container py-8">
          <ReviewsSection
            rating={product.rating || 0}
            reviewCount={product.review_count || 0}
            productId={product.id}
          />
        </div>
      </div>
    </div>
  )
}
