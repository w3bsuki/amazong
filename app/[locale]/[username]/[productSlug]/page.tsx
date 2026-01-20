import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { connection } from "next/server"

import { createStaticClient } from "@/lib/supabase/server"
import { fetchProductByUsernameAndSlug, fetchSellerProducts, fetchProductFavoritesCount, fetchProductHeroSpecs, type ProductPageProduct, type HeroSpec } from "@/lib/data/product-page"
import { fetchProductReviews, type ProductReview } from "@/lib/data/product-reviews"
import { submitReview } from "@/app/actions/reviews"

import { ProductPageLayout } from "@/components/shared/product/product-page-layout"
import {
  buildProductPageMetadata,
  buildProductPageViewModel,
  isUuid,
} from "@/lib/view-models/product-page"
import { routing } from "@/i18n/routing"

// =============================================================================
// SEO-OPTIMIZED PRODUCT PAGE
// URL Pattern: /{username}/{productSlug}
// Example: /indecisive_wear/vintage-leather-jacket
// 
// ISR OPTIMIZATION:
// - generateStaticParams fetches top 25 products for build-time pre-rendering
// - High-traffic product pages are pre-built for fast first loads + SEO
// - New/less-popular products are rendered on-demand (ISR)
// =============================================================================

// Pre-generate top 25 products (by views/sales) for fast SEO pages
export async function generateStaticParams() {
  const supabase = createStaticClient()
  
  // Fallback when Supabase isn't configured (e.g. local/E2E)
  if (!supabase) {
    return routing.locales.map((locale) => ({ 
      locale, 
      username: '__fallback__',
      productSlug: '__fallback__'
    }))
  }

  const nowIso = new Date().toISOString()

  // Fetch top products with seller usernames.
  // Important: Only prioritize ACTIVE boosts (boost_expires_at > now).
  const boostedResult = await supabase
    .from("products")
    .select("slug, seller:profiles!products_seller_id_fkey(username)")
    .eq("status", "active")
    .not("slug", "is", null)
    .eq("is_boosted", true)
    .gt("boost_expires_at", nowIso)
    .order("boost_expires_at", { ascending: false, nullsFirst: false })
    .order("review_count", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(25)

  const boosted = boostedResult.data || []

  const remaining = 25 - boosted.length
  const restResult = remaining > 0
    ? await supabase
        .from("products")
        .select("slug, seller:profiles!products_seller_id_fkey(username)")
        .eq("status", "active")
        .not("slug", "is", null)
        .or(`boost_expires_at.is.null,boost_expires_at.lte.${nowIso}`)
        .order("review_count", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(remaining)
    : { data: [] as any[] }

  const products = [...boosted, ...(restResult.data || [])]

  if (!products || products.length === 0) {
    return routing.locales.map((locale) => ({ 
      locale, 
      username: '__fallback__',
      productSlug: '__fallback__'
    }))
  }

  // Build locale × username × productSlug combinations
  const params: Array<{ locale: string; username: string; productSlug: string }> = []
  
  for (const product of products) {
    const slug = product.slug
    // Seller is returned as object from Supabase relation
    const seller = product.seller as { username: string | null } | null
    const username = seller?.username
    
    if (slug && username) {
      for (const locale of routing.locales) {
        params.push({ locale, username, productSlug: slug })
      }
    }
  }

  // Fallback if no valid products found
  if (params.length === 0) {
    return routing.locales.map((locale) => ({ 
      locale, 
      username: '__fallback__',
      productSlug: '__fallback__'
    }))
  }

  return params
}

interface ProductPageProps {
  params: Promise<{
    username: string
    productSlug: string
    locale: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { username, productSlug, locale } = await params
  const product = await fetchProductByUsernameAndSlug(username, productSlug)

  if (!product) {
    return {
      title: locale === "bg" ? "Продукт не е намерен" : "Product Not Found",
    }
  }

  return buildProductPageMetadata({
    locale,
    username,
    productSlug,
    product,
    seller: product.seller ?? null,
  })
}

export default async function ProductPage({ params }: ProductPageProps) {
  await connection()

  const { username, productSlug, locale } = await params
  setRequestLocale(locale)

  // Handle fallback from generateStaticParams (when Supabase unavailable at build)
  if (username === '__fallback__' || productSlug === '__fallback__') {
    notFound()
  }

  const supabase = createStaticClient()
  if (!supabase) notFound()

  const productData = await fetchProductByUsernameAndSlug(username, productSlug)
  if (!productData) notFound()

  const category = productData.category
  const seller = productData.seller
  if (!seller) notFound()

  let parentCategory: ProductPageProduct["category"] | null = null
  if (category?.parent_id) {
    const { data: parent } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, icon, parent_id")
      .eq("id", category.parent_id)
      .maybeSingle()
    parentCategory = (parent as unknown as ProductPageProduct["category"] | null) ?? null
  }

  const rootCategory = parentCategory?.parent_id ? parentCategory : parentCategory ?? category

  // Fetch related products, favorites count, and hero specs in parallel
  const [relatedProductsRaw, favoritesCount, heroSpecs] = await Promise.all([
    fetchSellerProducts(seller.id, productData.id, 10),
    fetchProductFavoritesCount(productData.id),
    fetchProductHeroSpecs(productData.id, locale),
  ])

  const reviews: ProductReview[] = isUuid(productData.id)
    ? await fetchProductReviews(productData.id, 8)
    : []

  const viewModel = buildProductPageViewModel({
    locale,
    username,
    productSlug,
    product: productData,
    seller,
    category,
    parentCategory,
    relatedProductsRaw: relatedProductsRaw || [],
    heroSpecs, // Pass database-driven hero specs
  })

  return (
    <ProductPageLayout
      locale={locale}
      username={username}
      productSlug={productSlug}
      product={productData}
      seller={seller}
      category={category}
      parentCategory={parentCategory}
      rootCategory={rootCategory}
      relatedProducts={viewModel.relatedProducts}
      reviews={reviews}
      viewModel={viewModel}
      variants={productData.product_variants ?? []}
      submitReview={submitReview}
      favoritesCount={favoritesCount}
    />
  )
}
