import { useTranslations } from "next-intl";
import { RecentlyViewedTracker } from "./pdp/recently-viewed-tracker";
import { SellerProductsGrid } from "./pdp/seller-products-grid";
import { CustomerReviewsHybrid } from "./pdp/customer-reviews-hybrid";

import { CategoryBadge } from "@/components/shared/product/category-badge";
import { TrustBadges } from "./pdp/trust-badges";
import { ProductSocialProof } from "./pdp/product-social-proof";
import { FreshnessIndicator } from "@/components/shared/product/freshness-indicator";
import { ViewTracker } from "./pdp/view-tracker";
import { ProductHeaderSync } from "./pdp/product-header-sync";
import { Star } from "lucide-react";
import { MarketplaceBadge } from "@/components/shared/marketplace-badge";
import { getConditionBadgeVariant, getConditionKey } from "@/components/shared/product/condition";

import { DesktopGallery } from "./desktop/desktop-gallery";
import { DesktopBuyBox } from "./desktop/desktop-buy-box";
import { DesktopSpecsAccordion } from "./desktop/desktop-specs-accordion";
import { HeroSpecs } from "./pdp/hero-specs";

import type { ProductPageViewModel } from "@/lib/view-models/product-page";
import type { Database } from "@/lib/supabase/database.types";
import type { CustomerReview } from "./pdp/customer-reviews-hybrid";
import type { SubmitReviewFn } from "./pdp/write-review-dialog";
import { PageShell } from "../../../_components/page-shell";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type SellerStatsRow = Database["public"]["Tables"]["seller_stats"]["Row"];
type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"];

type ProductWithSellerStats = ProductRow & { seller_stats?: Partial<SellerStatsRow> | null };

type SellerSummary = {
  id: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  verified?: boolean | null;
  created_at?: string | null;
  last_active?: string | null;
};

type CategorySummary = {
  id?: string;
  name: string;
  name_bg?: string | null;
  slug: string;
  icon?: string | null;
  parent_id?: string | null;
};

// Mobile-specific imports
import { MobileProductSingleScroll } from "./mobile/mobile-product-single-scroll";

interface ProductPageLayoutProps {
  locale: string;
  username: string;
  productSlug: string;
  product: ProductWithSellerStats;
  seller: SellerSummary;
  category: CategorySummary | null;
  parentCategory: CategorySummary | null;
  rootCategory: CategorySummary | null;
  relatedProducts: ProductPageViewModel["relatedProducts"];
  reviews: CustomerReview[];
  viewModel: ProductPageViewModel;
  variants?: ProductVariantRow[];
  submitReview?: SubmitReviewFn;
  favoritesCount?: number;
}

export function ProductPageLayout(props: ProductPageLayoutProps) {
  const tProduct = useTranslations("Product");
  const {
    locale,
    username,
    productSlug,
    product,
    seller,
    category,
    parentCategory,
    rootCategory,
    relatedProducts,
    reviews,
    viewModel,
    variants,
    submitReview,
    favoritesCount,
  } = props;

  const primaryImageSrc = viewModel.galleryImages?.[0]?.src ?? null;

  // V2: Build seller info for embedded seller card in buy box
  const sellerInfo = {
    id: seller.id,
    name: viewModel.sellerName || seller?.display_name || seller?.username || username || tProduct("seller"),
    username: seller?.username ?? null,
    avatarUrl: (viewModel.sellerAvatarUrl || seller?.avatar_url) ?? null,
    verified: viewModel.sellerVerified,
    rating: product.seller_stats?.average_rating
      ? Number(product.seller_stats.average_rating)
      : null,
    reviewCount: product.seller_stats?.total_reviews
      ? Number(product.seller_stats.total_reviews)
      : null,
    responseTime: product.seller_stats?.response_time_hours
      ? `${Math.round(Number(product.seller_stats.response_time_hours))}h`
      : null,
    ordersCompleted: product.seller_stats?.total_sales
      ? Number(product.seller_stats.total_sales)
      : null,
    location: product.seller_city ?? null,
  };

  return (
    <>
      <ProductHeaderSync
        productTitle={product.title ?? null}
        sellerName={sellerInfo.name}
        sellerUsername={sellerInfo.username}
        sellerAvatarUrl={sellerInfo.avatarUrl}
        productId={product.id}
        productPrice={Number(product.price ?? 0)}
        productImage={primaryImageSrc}
      />

      {/* ===== MOBILE PRODUCT PAGE ===== */}
      <MobileProductSingleScroll
        locale={locale}
        username={username}
        productSlug={productSlug}
        product={product}
        seller={seller}
        category={category}
        parentCategory={parentCategory}
        rootCategory={rootCategory}
        relatedProducts={relatedProducts}
        reviews={reviews}
        viewModel={viewModel}
        variants={variants ?? []}
        favoritesCount={favoritesCount ?? null}
        {...(submitReview && { submitReview })}
      />

      {/* ===== DESKTOP PRODUCT PAGE (V2) ===== */}
      <PageShell variant="muted" className="hidden lg:block pb-10">
        {/* JSON-LD Structured Data for SEO */}
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(viewModel.jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(viewModel.breadcrumbJsonLd) }}
          />
        </>

        {/* Track this product as recently viewed */}
        <RecentlyViewedTracker
          product={{
            id: product.id,
            title: product.title,
            price: Number(product.price ?? 0),
            image: primaryImageSrc,
            slug: product.slug || product.id,
            username: seller?.username ?? null,
          }}
        />

        {/* Track view count */}
        <ViewTracker productId={product.id} />

        <div className="container px-6 py-8">
          {/* Main Product Card */}
          <div className="bg-background rounded-xl border border-border p-6 lg:p-8">
            {/* Two-column layout (gallery left, info right) */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-9 lg:gap-12">
              {/* LEFT: Gallery */}
              <div className="space-y-4 lg:col-span-5">
                <DesktopGallery images={viewModel.galleryImages} />
              </div>

              {/* RIGHT: Product Info + Buy Box */}
              <div className="space-y-4 lg:col-span-4">
                {/* Meta row: Category badge + Freshness */}
                <div className="flex flex-wrap items-center gap-3">
                  <CategoryBadge
                    locale={locale}
                    category={rootCategory}
                    subcategory={category}
                  />
                  <FreshnessIndicator createdAt={product.created_at} variant="badge" showIcon />
                </div>

                {/* Product Title & Price Header */}
                <div className="space-y-2">
                  <h1 className="text-xl font-semibold text-foreground leading-tight">
                    {product.title}
                  </h1>
                  {product.condition && (
                    <MarketplaceBadge variant={getConditionBadgeVariant(product.condition)}>
                      {(() => {
                        const key = getConditionKey(product.condition);
                        return key ? tProduct(key) : product.condition;
                      })()}
                    </MarketplaceBadge>
                  )}

                  {/* Rating */}
                  {Number(product.review_count ?? 0) > 0 && Number(product.rating ?? 0) > 0 && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Star className="size-4 fill-current text-muted-foreground" strokeWidth={1.5} />
                      <span className="font-medium text-foreground">
                        {Number(product.rating ?? 0).toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({tProduct("reviews", { count: Number(product.review_count ?? 0) })})
                      </span>
                    </div>
                  )}
                </div>

                {/* Social Proof */}
                <ProductSocialProof
                  viewCount={product.view_count ?? null}
                  favoritesCount={favoritesCount ?? null}
                  showHotIndicator
                />

                {/* Category-Adaptive Hero Specs (4-pill grid) */}
                {viewModel.heroSpecs.length > 0 && (
                  <HeroSpecs specs={viewModel.heroSpecs} variant="desktop" />
                )}

                <DesktopBuyBox
                  productId={product.id}
                  productSlug={productSlug}
                  title={product.title}
                  price={Number(product.price ?? 0)}
                  originalPrice={product.list_price != null ? Number(product.list_price) : null}
                  currency="BGN"
                  condition={null}
                  stock={product.stock}
                  seller={sellerInfo}
                  categoryType={viewModel.categoryType}
                  freeShipping={!product.pickup_only}
                  location={product.seller_city}
                  primaryImage={primaryImageSrc}
                />

                {/* Trust Badges */}
                <TrustBadges verifiedSeller={viewModel.sellerVerified} />
              </div>
            </div>
          </div>

          {/* Specifications & Description Section */}
          <div className="mt-6">
            <DesktopSpecsAccordion
              specifications={viewModel.itemSpecifics.details}
              description={product.description}
            />
          </div>

          {/* More from Seller */}
          <SellerProductsGrid
            products={relatedProducts}
            sellerUsername={username}
          />

          {/* Reviews */}
          <div className="pb-8">
            <CustomerReviewsHybrid
              rating={Number(product.rating ?? 0)}
              reviewCount={Number(product.review_count ?? 0)}
              reviews={reviews}
              productId={product.id}
              productTitle={product.title}
              locale={locale}
              {...(submitReview && { submitReview })}
            />
          </div>
        </div>
      </PageShell>
    </>
  );
}

