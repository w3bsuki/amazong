import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { connection } from "next/server"

import { createStaticClient } from "@/lib/supabase/server"
import { fetchProductByUsernameAndSlug, fetchSellerProducts, type ProductPageProduct } from "@/lib/data/product-page"
import { fetchProductReviews, type ProductReview } from "@/lib/data/product-reviews"
import { submitReview } from "@/app/actions/reviews"

import { ProductPageLayout } from "@/components/shared/product/product-page-layout"
import {
  buildProductPageMetadata,
  buildProductPageViewModel,
  isUuid,
} from "@/lib/view-models/product-page"

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
      .select("id, name, name_bg, slug, icon, parent_id, image_url")
      .eq("id", category.parent_id)
      .maybeSingle()
    parentCategory = (parent as unknown as ProductPageProduct["category"] | null) ?? null
  }

  const rootCategory = parentCategory?.parent_id ? parentCategory : parentCategory ?? category

  const relatedProductsRaw = await fetchSellerProducts(seller.id, productData.id, 10)

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
    />
  )
}
