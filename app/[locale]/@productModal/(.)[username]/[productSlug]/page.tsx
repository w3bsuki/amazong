import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"

import { createStaticClient } from "@/lib/supabase/server"
import {
  fetchProductByUsernameAndSlug,
  fetchSellerProducts,
  fetchProductFavoritesCount,
  fetchProductHeroSpecs,
} from "@/lib/data/product-page"
import { fetchProductReviews, type ProductReview } from "@/lib/data/product-reviews"
import { buildProductPageViewModel, isUuid } from "@/lib/view-models/product-page"
import { ProductPageLayout } from "@/components/shared/product/product-page-layout"
import { ProductModalWrapper } from "@/components/desktop/product/product-modal-wrapper"
import { routing } from "@/i18n/routing"

interface ProductModalPageProps {
  params: Promise<{
    username: string
    productSlug: string
    locale: string
  }>
}

// Intercepted modal routes don't need to generate metadata - returning empty object
// prevents the metadata from being changed when the modal opens
export const metadata: Metadata = {}

// Opt out of static generation for intercepted routes
// This prevents prerendering errors with cacheComponents
export function generateStaticParams() {
  // In Cache Components mode, `generateStaticParams` must return at least one
  // entry for build-time validation. We use a placeholder param so we don't
  // prerender real product modals.
  return routing.locales.map((locale) => ({
    locale,
    username: "__modal__",
    productSlug: "__modal__",
  }))
}

export default async function ProductModalPage({ params }: ProductModalPageProps) {
  const { username, productSlug, locale } = await params
  setRequestLocale(locale)

  // Placeholder entry used only for build-time validation.
  if (username === "__modal__" || productSlug === "__modal__") notFound()

  const productData = await fetchProductByUsernameAndSlug(username, productSlug)
  if (!productData) notFound()

  const category = productData.category
  const seller = productData.seller
  if (!seller) notFound()

  const supabase = createStaticClient()
  if (!supabase) notFound()

  let parentCategory: typeof category | null = null
  if (category?.parent_id) {
    const { data: parent } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, icon, parent_id")
      .eq("id", category.parent_id)
      .maybeSingle()
    parentCategory = (parent as unknown as typeof category | null) ?? null
  }

  const rootCategory = parentCategory?.parent_id ? parentCategory : parentCategory ?? category

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
    heroSpecs,
  })

  return (
    <ProductModalWrapper
      locale={locale}
      username={username}
      productSlug={productSlug}
      title={productData.title}
      description={productData.meta_description ?? productData.description ?? null}
    >
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
        favoritesCount={favoritesCount}
        renderMode="modal"
      />
    </ProductModalWrapper>
  )
}
