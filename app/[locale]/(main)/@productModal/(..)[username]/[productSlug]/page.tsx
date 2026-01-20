import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { connection } from "next/server"

import { fetchProductByUsernameAndSlug, fetchProductHeroSpecs } from "@/lib/data/product-page"
import { ProductModalWrapper } from "@/components/desktop/product/product-modal-wrapper"

/**
 * Intercepting Route for Product Modal (Desktop)
 * 
 * Route structure explanation:
 * - We're at: app/[locale]/(main)/@productModal/
 * - Target is: app/[locale]/[username]/[productSlug]
 * - (main) is a route GROUP (not a segment)
 * - @productModal is a SLOT (not a segment)
 * - So from here, we're effectively at [locale] level
 * - (..) goes up one segment = still at [locale] level (where [username] lives)
 * 
 * Soft navigation (click from homepage/categories) → Modal renders
 * Hard navigation (direct URL, refresh) → Full product page renders
 */

interface ModalProductPageProps {
  params: Promise<{
    username: string
    productSlug: string
    locale: string
  }>
}

export default async function ModalProductPage({ params }: ModalProductPageProps) {
  await connection()

  const { username, productSlug, locale } = await params
  setRequestLocale(locale)

  if (username === '__fallback__' || productSlug === '__fallback__') {
    notFound()
  }

  const productData = await fetchProductByUsernameAndSlug(username, productSlug)
  if (!productData) notFound()

  const seller = productData.seller
  if (!seller) notFound()

  const heroSpecs = await fetchProductHeroSpecs(productData.id, locale)

  return (
    <ProductModalWrapper
      locale={locale}
      username={username}
      productSlug={productSlug}
      product={productData}
      seller={seller}
      category={productData.category}
      heroSpecs={heroSpecs}
    />
  )
}
