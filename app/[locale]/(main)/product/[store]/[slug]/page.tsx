import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ProductPageContent } from "@/components/product-page-content-new"
import { ProductCard } from "@/components/product-card"
import { RecentlyViewedTracker } from "@/components/recently-viewed-tracker"
import { ReviewsSection } from "@/components/reviews-section"
import { ProductBreadcrumb } from "@/components/product-breadcrumb"

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
    store: string
    slug: string
    locale: string
  }>
}

// Helper to fetch product by store_slug + product_slug
async function fetchProductByStoreAndSlug(
  supabase: Awaited<ReturnType<typeof createClient>>, 
  storeSlug: string, 
  productSlug: string
) {
  if (!supabase) return null
  
  // Join products with sellers to match both slugs
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug,
        parent_id
      ),
      sellers!inner (
        id,
        store_name,
        store_slug,
        verified,
        created_at
      )
    `)
    .eq("slug", productSlug)
    .eq("sellers.store_slug", storeSlug)
    .single()
  
  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { store, slug, locale } = await params
  const supabase = await createClient()

  if (!supabase) {
    return {
      title: locale === "bg" ? "Продукт не е намерен" : "Product Not Found",
    }
  }

  const product = await fetchProductByStoreAndSlug(supabase, store, slug)

  if (!product) {
    return {
      title: locale === "bg" ? "Продукт не е намерен" : "Product Not Found",
    }
  }

  // SEO: Canonical URL with store and product slug
  const canonicalUrl = `/${locale}/product/${store}/${slug}`

  return {
    title: `${product.title} | ${product.sellers?.store_name || 'Shop'}`,
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
  const { store, slug, locale } = await params
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

  // Fetch product by store_slug + product_slug
  const product = await fetchProductByStoreAndSlug(supabase, store, slug)

  if (!product) {
    notFound()
  }

  const category = product.categories
  const seller = product.sellers

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

  // Fetch related products from the same seller (with their store_slug)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select(`
      *,
      sellers (
        store_slug
      )
    `)
    .neq("id", product.id)
    .limit(6)

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
    ratings: t("ratings", { count: product.reviews_count || 0 }),
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-24 lg:pb-10">
      {/* Track this product as recently viewed */}
      <RecentlyViewedTracker
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || product.image || null,
          slug: product.slug,
          storeSlug: seller?.store_slug,
        }}
      />

      {/* Breadcrumb - Sticky on mobile, below header */}
      <div className="sticky top-[52px] md:static z-40 bg-background border-b md:border-0">
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
            original_price: product.original_price,
            images: product.images || [],
            rating: product.rating || 0,
            reviews_count: product.reviews_count || 0,
            tags: product.tags || [],
            is_boosted: product.is_boosted || false,
            seller_id: product.seller_id,
          }}
          seller={seller}
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
              {relatedProducts.map((p: any, idx: number) => (
                <div key={p.id} className="shrink-0 w-[calc(50%-5px)] snap-start">
                  <ProductCard
                    id={p.id}
                    title={p.title}
                    price={p.price}
                    image={p.images?.[0] || p.image || "/placeholder.svg"}
                    rating={p.rating || 0}
                    reviews={p.review_count || 0}
                    originalPrice={p.list_price}
                    tags={p.tags || []}
                    index={idx}
                    variant="compact"
                    slug={p.slug}
                    storeSlug={p.sellers?.store_slug}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop: Grid layout */}
          <div className="hidden lg:grid lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {relatedProducts.map((p: any, idx: number) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.title}
                price={p.price}
                image={p.images?.[0] || p.image || "/placeholder.svg"}
                rating={p.rating || 0}
                reviews={p.review_count || 0}
                originalPrice={p.list_price}
                tags={p.tags || []}
                index={idx}
                variant="compact"
                slug={p.slug}
                storeSlug={p.sellers?.store_slug}
              />
            ))}
          </div>
        </div>
      )}

      {/* Product Reviews Section - Full width, eBay style */}
      <div id="product-reviews-section" className="border-t bg-background scroll-mt-4">
        <div className="container py-8">
          <ReviewsSection
            rating={product.rating || 0}
            reviewCount={product.reviews_count || 0}
            productId={product.id}
          />
        </div>
      </div>
    </div>
  )
}
