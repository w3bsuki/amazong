import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { createStaticClient } from "@/lib/supabase/server"
import {
  fetchProductByUsernameAndSlug,
  fetchProductHeroSpecs,
  type ProductPageProduct,
} from "@/lib/data/product-page"
import { buildProductPageViewModel } from "@/lib/view-models/product-page"

import { DesktopGalleryV2 } from "@/components/desktop/product/desktop-gallery-v2"
import { DesktopBuyBoxV2 } from "@/components/desktop/product/desktop-buy-box-v2"
import { ResponsiveOverlay } from "@/components/shared/responsive-overlay"
import { HeroSpecs } from "@/components/shared/product/hero-specs"
import { Badge } from "@/components/ui/badge"

export async function ProductQuickViewRouteOverlay({
  locale,
  username,
  productSlug,
}: {
  locale: string
  username: string
  productSlug: string
}) {
  setRequestLocale(locale)

  const productData = await fetchProductByUsernameAndSlug(username, productSlug)
  if (!productData) notFound()

  const category = productData.category
  const seller = productData.seller
  if (!seller) notFound()

  const supabase = createStaticClient()
  if (!supabase) notFound()

  let parentCategory: ProductPageProduct["category"] | null = null
  if (category?.parent_id) {
    const { data: parent } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, icon, parent_id")
      .eq("id", category.parent_id)
      .maybeSingle()
    parentCategory = (parent as unknown as ProductPageProduct["category"] | null) ?? null
  }

  const heroSpecs = await fetchProductHeroSpecs(productData.id, locale)

  const viewModel = buildProductPageViewModel({
    locale,
    username,
    productSlug,
    product: productData,
    seller,
    category,
    parentCategory,
    relatedProductsRaw: [],
    heroSpecs,
  })

  const primaryImageSrc = viewModel.galleryImages?.[0]?.src ?? null

  const sellerInfo = {
    id: seller.id,
    name: viewModel.sellerName || seller.display_name || seller.username || username,
    username: seller.username ?? null,
    avatarUrl: viewModel.sellerAvatarUrl || seller.avatar_url || "",
    verified: Boolean(viewModel.sellerVerified),
    rating: productData.seller_stats?.average_rating ?? null,
    reviewCount: productData.seller_stats?.total_reviews ?? null,
    responseTime:
      productData.seller_stats?.response_time_hours != null
        ? `${productData.seller_stats.response_time_hours}h`
        : null,
    ordersCompleted: productData.seller_stats?.total_sales ?? null,
    location: null,
  }

  return (
    <ResponsiveOverlay title={productData.title} backOnClose>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <div className="min-w-0">
          <DesktopGalleryV2 images={viewModel.galleryImages} />
          {viewModel.heroSpecs.length > 0 && (
            <div className="mt-4">
              <HeroSpecs specs={viewModel.heroSpecs} variant="desktop" />
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-4">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground leading-tight">
              {productData.title}
            </h1>
            {productData.condition && (
              <Badge variant="condition" className="rounded-full px-3">
                {productData.condition}
              </Badge>
            )}
          </div>

          <DesktopBuyBoxV2
            productId={productData.id}
            productSlug={productSlug}
            title={productData.title}
            price={Number(productData.price ?? 0)}
            originalPrice={productData.list_price != null ? Number(productData.list_price) : null}
            currency="EUR"
            condition={productData.condition}
            stock={productData.stock}
            seller={sellerInfo}
            categoryType={viewModel.categoryType}
            freeShipping={!productData.pickup_only}
            primaryImage={primaryImageSrc}
          />
        </div>
      </div>
    </ResponsiveOverlay>
  )
}

