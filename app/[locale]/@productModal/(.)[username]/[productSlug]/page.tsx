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

interface ProductModalPageProps {
  params: Promise<{
    username: string
    productSlug: string
    locale: string
  }>
}

// The intercepted modal route should not change document metadata.
// Keeping metadata static prevents Next.js from attempting to prerender dynamic metadata for this slot.
export async function generateMetadata(): Promise<Metadata> {
  return {}
}

export default async function ProductModalPage({ params }: ProductModalPageProps) {
  const { username, productSlug, locale } = await params
  setRequestLocale(locale)

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
