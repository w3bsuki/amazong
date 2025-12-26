import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import { createClient, createStaticClient } from "@/lib/supabase/server"
import { fetchProductByUsernameAndSlug, fetchSellerProducts } from "@/lib/data/product-page"
import { RecentlyViewedTracker } from "@/components/shared/product/recently-viewed-tracker"

import { ProductGalleryHybrid } from "@/components/shared/product/product-gallery-hybrid"
import { ProductBuyBox } from "@/components/shared/product/product-buy-box"
import { MobileStickyBar } from "@/components/shared/product/mobile-sticky-bar"
import { SimilarItemsBar } from "@/components/shared/product/similar-items-bar"
import { MobileAccordions } from "@/components/shared/product/mobile-accordions"
import { SellerProductsGrid } from "@/components/shared/product/seller-products-grid"
import { MobileSellerCard } from "@/components/shared/product/mobile-seller-card"
import { CustomerReviewsHybrid } from "@/components/shared/product/customer-reviews-hybrid"

import { ItemSpecifics } from "@/components/shared/product/item-specifics"

// =============================================================================
// SEO-OPTIMIZED PRODUCT PAGE
// URL Pattern: /{username}/{productSlug}
// Example: /indecisive_wear/kotka-winter-jacket
// =============================================================================

interface ProductPageProps {
  params: Promise<{
    username: string      // Seller's username (from profiles table)
    productSlug: string   // Product slug
    locale: string
  }>
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
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  await connection()
  const { username, productSlug, locale } = await params
  setRequestLocale(locale)

  // Use static client for public data (can be cached)
  const supabase = createStaticClient()
  // Use auth client only for user check
  await createClient()

  if (!supabase) {
    notFound()
  }

  // Fetch product by username + slug (SEO canonical format)
  const productFromDb = await fetchProductByUsernameAndSlug(supabase, username, productSlug)
  const allowSample = process.env.NODE_ENV !== "production"

  const isSample = !productFromDb
  if (!productFromDb && !allowSample) {
    notFound()
  }

  const sampleSeller = {
    id: "preview-seller",
    username,
    display_name: username || "Seller",
    avatar_url: null,
    verified: true,
    created_at: new Date().toISOString(),
    is_seller: true,
  }

  const sampleProduct = {
    id: "preview-product",
    title: "Preview Product (Sample)",
    description:
      "This is sample data because the product lookup did not return a result. The layout and components are what we're previewing.",
    price: 129.99,
    list_price: 159.99,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    rating: 4.6,
    review_count: 128,
    tags: ["New", "Best Seller", "Limited"],
    is_boosted: true,
    seller_id: "preview-seller",
    slug: productSlug,
    sku: null,
    stock: 1,
    attributes: null,
    meta_description: null,
    category_id: null,
    status: "active" as const,
    seller: sampleSeller,
    category: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Use the DB product if available, otherwise use the sample product (if allowed)
  const productData = (productFromDb ?? sampleProduct) as any
  const category = productData.category
  const seller = productData.seller

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
  const relatedProducts = await fetchSellerProducts(supabase, seller.id, productData.id, 10)

  // Build JSON-LD structured data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amazong.com"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData.title,
    description: productData.description,
    image: productData.images || [],
    sku: productData.sku || productData.id,
    brand: (productData.attributes as Record<string, unknown> | null)?.brand
      ? { "@type": "Brand", name: (productData.attributes as Record<string, unknown>).brand as string }
      : undefined,
    offers: {
      "@type": "Offer",
      price: productData.price,
      priceCurrency: "BGN",
      availability: productData.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: seller?.display_name || seller?.username || "Seller",
        url: `${siteUrl}/${locale}/${seller?.username}`,
      },
      url: `${siteUrl}/${locale}/${username}/${productSlug}`,
    },
    aggregateRating: productData.review_count && productData.review_count > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: productData.rating || 0,
          reviewCount: productData.review_count,
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
        name: productData.title,
        item: `${siteUrl}/${locale}/${username}/${productSlug}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      {isSample && allowSample ? (
        <div className="border-b border-border bg-success/10 text-success">
          <div className="container py-2 text-sm">
            ✨ Preview-style fallback: rendering sample product because lookup returned no result.
          </div>
        </div>
      ) : null}

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
          id: productData.id,
          title: productData.title,
          price: productData.price,
          image: productData.images?.[0] || null,
          slug: productData.slug || productData.id,
          username: seller?.username,
        }}
      />

      {/* Breadcrumb - Removed as per user request (eBay style) */}
      {/* <div className="hidden md:block md:static z-40 bg-background md:border-0">
        <div className="container py-1.5 lg:py-2">
          <ProductBreadcrumb
            locale={locale}
            category={category ? { name: category.name, slug: category.slug } : null}
            parentCategory={parentCategory ? { name: parentCategory.name, slug: parentCategory.slug } : null}
            productTitle={productData.title}
          />
        </div>
      </div> */}

      {/* Main content - Hybrid Layout */}
      <div className="container pt-1">
        
        {/* Similar Items Bar */}
        <SimilarItemsBar
            seller={{
                id: seller.id,
                username: seller.username,
                display_name: seller.display_name || seller.username || "Seller",
                avatar_url: seller.avatar_url,
            }}
            thumbnails={(relatedProducts || []).map(p => ({
                src: p.images?.[0] || "",
                alt: p.title
            }))}
        />

        {/* Mobile Seller Card */}
        <MobileSellerCard
            store={{
                name: seller.display_name || seller.username || "Seller",
                rating: "98%", // Placeholder
                verified: seller.verified || false,
                avatarUrl: seller.avatar_url || undefined,
            }}
        />

        <div className="grid grid-cols-1 gap-form lg:grid-cols-[7fr_3fr] lg:items-start mt-form-sm">
            {/* Left Column: Images & Desktop Details */}
            <ProductGalleryHybrid
                images={(productData.images || []).map((src: string) => ({
                    src,
                    alt: productData.title,
                    width: 1000, // Placeholder
                    height: 1000, // Placeholder
                }))}
                galleryID={`gallery-${productData.id}`}
            />

            {/* Right Column: Buy Box */}
            <ProductBuyBox
                product={{
                    name: productData.title,
                    price: {
                        sale: productData.price,
                        regular: productData.list_price || undefined,
                        currency: "BGN",
                    },
                    store: {
                        name: seller.display_name || seller.username || "Seller",
                        rating: "98%", // Placeholder
                        verified: seller.verified || false,
                    },
                    images: (productData.images || []).map((src: string) => ({ src, alt: productData.title })),
                    hinges: {}, // No variants for now as per data model
                    shipping: {
                        text: productData.ships_to_bulgaria 
                            ? "Ships to Bulgaria" 
                            : "Does not ship to Bulgaria",
                        canShip: productData.ships_to_bulgaria || false
                    },
                    returns: "30 days returns. Buyer pays for return shipping.", // Placeholder until we have return policy in DB
                    description: productData.description,
                    itemSpecifics: (
                        <ItemSpecifics 
                            attributes={productData.attributes as Record<string, any>}
                            condition={productData.condition}
                            categoryName={category?.name}
                            parentCategoryName={parentCategory?.name}
                        />
                    )
                }}
            />
        </div>

        {/* Mobile Accordions */}
        <MobileAccordions
            description={productData.description || "No description available."}
            details={[
                { label: "Category", value: category?.name || "N/A" },
                { label: "Condition", value: "New" },
            ]}
        />

        {/* Seller Products Grid */}
        <SellerProductsGrid
            products={(relatedProducts || []).map(p => ({
                id: p.id,
                title: p.title,
                price: p.price,
                originalPrice: p.list_price,
                image: p.images?.[0] || "",
                rating: p.rating || 0,
                reviews: p.review_count || 0,
                sellerName: seller.display_name || seller.username || "Seller",
                sellerVerified: seller.verified || false,
                sellerAvatarUrl: seller.avatar_url || "",
                condition: "New",
                freeShipping: true,
                categorySlug: category?.slug || "",
                attributes: p.attributes as Record<string, string> || {},
            }))}
        />

        {/* Customer Reviews */}
        <CustomerReviewsHybrid
            rating={productData.rating || 0}
            reviewCount={productData.review_count || 0}
            reviews={[]}
        />

        {/* Mobile Sticky Bar */}
        <MobileStickyBar />

      </div>
    </div>
  )
}
