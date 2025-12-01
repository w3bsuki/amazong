import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getTranslations, getLocale } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { CaretRight } from "@phosphor-icons/react/dist/ssr"
import { ProductPageContent } from "@/components/product-page-content-new"
import { ProductCard } from "@/components/product-card"
import { StickyAddToCart } from "@/components/sticky-add-to-cart"
import { RecentlyViewedTracker } from "@/components/recently-viewed-tracker"
import { ReviewsSection } from "@/components/reviews-section"

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
    id: string
    locale: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id, locale } = await params
  const supabase = await createClient()

  if (!supabase) {
    return {
      title: locale === "bg" ? "Продукт не е намерен" : "Product Not Found",
    }
  }

  const { data: product } = await supabase
    .from("products")
    .select("title, description, images")
    .eq("id", id)
    .single()

  if (!product) {
    return {
      title: locale === "bg" ? "Продукт не е намерен" : "Product Not Found",
    }
  }

  return {
    title: product.title,
    description: product.description?.slice(0, 160) || `Shop ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160),
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const locale = await getLocale()
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

  // Fetch product with category and seller
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug,
        parent_id
      ),
      sellers (
        id,
        store_name,
        verified,
        created_at
      )
    `)
    .eq("id", id)
    .single()

  if (error || !product) {
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

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .neq("id", id)
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

  // Breadcrumb items
  const breadcrumbItems = [
    { label: locale === "bg" ? "Начало" : "Home", href: "/" },
    ...(parentCategory
      ? [{ label: parentCategory.name, href: `/search?category=${parentCategory.slug}` }]
      : []),
    ...(category
      ? [{ label: category.name, href: `/search?category=${category.slug}` }]
      : []),
    { label: product.title?.slice(0, 40) + (product.title?.length > 40 ? "..." : ""), href: "#" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-24 lg:pb-10">
      {/* Track this product as recently viewed */}
      <RecentlyViewedTracker
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || product.image || null,
          slug: product.id,
        }}
      />

      {/* Breadcrumb - eBay style: minimal, small text */}
      <div className="container py-2">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto">
          {breadcrumbItems.map((item, index) => (
            <span key={item.href + index} className="flex items-center gap-1.5 shrink-0">
              {index > 0 && <CaretRight className="w-3 h-3 text-muted-foreground/50" />}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-muted-foreground truncate max-w-[200px]">{item.label}</span>
              ) : (
                <Link 
                  href={item.href} 
                  className="hover:text-primary hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Main Product Content - Full width layout with proper container */}
      <div className="container py-4">
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
        <div className="container py-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {locale === "bg" ? "Хората, които разгледаха това, разгледаха и" : "People who viewed this item also viewed"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
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

      {/* Sticky Add to Cart for Mobile */}
      <StickyAddToCart
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || product.image || "/placeholder.svg",
          seller_id: product.seller_id,
        }}
        locale={locale}
        currentUserId={currentUserId}
      />
    </div>
  )
}
