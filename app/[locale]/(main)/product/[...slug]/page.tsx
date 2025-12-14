import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ProductPageContent } from "@/components/product-page-content-new"
import { ProductCard } from "@/components/product-card"
import { RecentlyViewedTracker } from "@/components/recently-viewed-tracker"
import { ReviewsSection } from "@/components/reviews-section"
import { ProductBreadcrumb } from "@/components/product-breadcrumb"

// UUID regex pattern to detect if the id is a full UUID
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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
    slug: string[]  // Catch-all route: can be [id], [productSlug], or [storeSlug, productSlug]
    locale: string
  }>
}

// Parse the URL segments to determine lookup strategy
function parseSlugSegments(segments: string[]): {
  type: 'uuid' | 'product-slug' | 'store-product'
  storeSlug?: string
  productSlug?: string
  uuid?: string
} {
  if (segments.length === 2) {
    // /product/{storeSlug}/{productSlug} - new canonical format
    return { type: 'store-product', storeSlug: segments[0], productSlug: segments[1] }
  }
  
  if (segments.length === 1) {
    const value = segments[0]
    if (UUID_REGEX.test(value)) {
      return { type: 'uuid', uuid: value }
    }
    return { type: 'product-slug', productSlug: value }
  }
  
  // Invalid URL structure
  return { type: 'product-slug', productSlug: segments.join('/') }
}

// Helper to fetch product by store_slug + product_slug (canonical format)
async function fetchProductByStoreAndSlug(
  supabase: Awaited<ReturnType<typeof createClient>>, 
  storeSlug: string, 
  productSlug: string
) {
  if (!supabase) return null
  
  // Fetch product by slug
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", productSlug)
    .single()
  if (error || !product) return null

  // Fetch seller (profile)
  const { data: seller } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", product.seller_id)
    .single()

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

  return { ...product, seller, category }
}

// Helper to fetch product by UUID or product slug (legacy formats)
async function fetchProductByIdOrSlug(
  supabase: Awaited<ReturnType<typeof createClient>>, 
  idOrSlug: string,
  isUUID: boolean
) {
  if (!supabase) return null
  
  let product = null
  if (isUUID) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", idOrSlug)
      .single()
    product = data
  } else {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", idOrSlug)
      .single()
    product = data
    if (!product) {
      // Try to extract short ID from slug (last 8 chars)
      const parts = idOrSlug.split('-')
      const shortId = parts[parts.length - 1]
      if (shortId && shortId.length === 8) {
        const { data: byShortId } = await supabase
          .from("products")
          .select("*")
          .ilike("id", `${shortId}%`)
          .single()
        product = byShortId
      }
    }
  }
  if (!product) return null

  // Fetch seller (profile)
  const { data: seller } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", product.seller_id)
    .single()

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

  return { ...product, seller, category }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug: segments, locale } = await params
  const supabase = await createClient()

  if (!supabase) {
    return {
      title: locale === "bg" ? "Продукт не е намерен" : "Product Not Found",
    }
  }

  const parsed = parseSlugSegments(segments)
  let product = null
  if (parsed.type === 'store-product') {
    product = await fetchProductByStoreAndSlug(supabase, parsed.storeSlug!, parsed.productSlug!)
  } else if (parsed.type === 'uuid') {
    product = await fetchProductByIdOrSlug(supabase, parsed.uuid!, true)
  } else {
    product = await fetchProductByIdOrSlug(supabase, parsed.productSlug!, false)
  }
  if (!product) {
    return {
      title: locale === "bg" ? "Продукт не е намерен" : "Product Not Found",
    }
  }
  // SEO: Use canonical URL with username + product slug
  const username = product.seller?.username
  const productSlug = product.slug || product.id
  const canonicalUrl = username
    ? `/${locale}/product/${username}/${productSlug}`
    : `/${locale}/product/${productSlug}`
  return {
    title: `${product.title}${username ? ` | ${product.seller?.display_name || username}` : ''}`,
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
  const { slug: segments, locale } = await params
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

  // Parse URL segments to determine lookup strategy
  const parsed = parseSlugSegments(segments)
  let product = null
  if (parsed.type === 'store-product') {
    product = await fetchProductByStoreAndSlug(supabase, parsed.storeSlug!, parsed.productSlug!)
  } else if (parsed.type === 'uuid') {
    product = await fetchProductByIdOrSlug(supabase, parsed.uuid!, true)
  } else {
    product = await fetchProductByIdOrSlug(supabase, parsed.productSlug!, false)
  }
  if (!product) {
    notFound()
  }
  const category = product.category
  const seller = product.seller
  // SEO: Redirect legacy URLs to canonical username-based URL (301 redirect)
  if (parsed.type !== 'store-product' && product.slug && seller?.username) {
    redirect(`/${locale}/product/${seller.username}/${product.slug}`)
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

  // Fetch related products (with seller's username for URLs and attributes for badges)
  const { data: relatedProductsRaw } = await supabase
    .from("products")
    .select("*")
    .neq("id", product.id)
    .limit(6)
  // For each related product, fetch its seller and category
  const relatedProducts = relatedProductsRaw
    ? await Promise.all(relatedProductsRaw.map(async (p) => {
        const { data: relSeller } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", p.seller_id)
          .single()
        let relCategory = null
        if (p.category_id) {
          const { data } = await supabase
            .from("categories")
            .select("*")
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
  }

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
            slug: product.slug ?? undefined,
          }}
          seller={seller ? {
            id: seller.id,
            store_name: seller.display_name || seller.username || "Store",
            store_slug: seller.username ?? undefined,
            verified: seller.verified ?? false,
            created_at: seller.created_at,
            stats: null, // Stats need to be fetched separately from seller_stats table
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
                      storeSlug={p.seller?.username}
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
                  storeSlug={p.seller?.username}
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
