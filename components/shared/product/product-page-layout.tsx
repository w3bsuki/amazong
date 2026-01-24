import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { RecentlyViewedTracker } from "@/components/shared/product/recently-viewed-tracker";
import { SellerProductsGrid } from "@/components/shared/product/seller-products-grid";
import { CustomerReviewsHybrid } from "@/components/shared/product/customer-reviews-hybrid";

import { CategoryBadge } from "@/components/shared/product/category-badge";
import { TrustBadges } from "@/components/shared/product/trust-badges";
import { ProductSocialProof } from "@/components/shared/product/product-social-proof";
import { FreshnessIndicator } from "@/components/shared/product/freshness-indicator";
import { ViewTracker } from "@/components/shared/product/view-tracker";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductHeaderSync } from "@/components/shared/product/product-header-sync";
import { Star } from "lucide-react";

// V2 Desktop Components
import { DesktopGalleryV2 } from "@/components/desktop/product/desktop-gallery-v2";
import { DesktopBuyBoxV2 } from "@/components/desktop/product/desktop-buy-box-v2";
import { DesktopSpecsAccordion } from "@/components/desktop/product/desktop-specs-accordion";
import { HeroSpecs } from "@/components/shared/product/hero-specs";

import type { ProductPageViewModel } from "@/lib/view-models/product-page";
import type { Database } from "@/lib/supabase/database.types";
import type { CustomerReview } from "@/components/shared/product/customer-reviews-hybrid";
import type { SubmitReviewFn } from "@/components/shared/product/write-review-dialog";
import { PageShell } from "@/components/shared/page-shell";

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
import { MobileProductPage } from "@/components/mobile/product/mobile-product-page";

// Loading skeletons for Suspense boundaries
function RelatedProductsSkeleton() {
  return (
    <div className="mt-10 space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-3">
            <Skeleton className="aspect-square w-full rounded-lg mb-3" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="pb-8">
      <div className="rounded-md bg-muted/20 p-4 border border-border/50">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-md border border-border/50 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <MobileProductPage
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
            <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-12">
              {/* LEFT: Gallery */}
              <div className="space-y-4">
                {/* V2 Gallery with horizontal thumbnails */}
                <DesktopGalleryV2 images={viewModel.galleryImages} />
              </div>

              {/* RIGHT: Product Info + Buy Box */}
              <div className="space-y-4">
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
                    <span className="inline-block px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                      {product.condition}
                    </span>
                  )}

                  {/* Rating */}
                  {Number(product.review_count ?? 0) > 0 && Number(product.rating ?? 0) > 0 && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Star className="size-4 fill-rating text-rating" strokeWidth={1.5} />
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

                {/* V2 Buy Box with embedded seller card */}
                <DesktopBuyBoxV2
                  productId={product.id}
                  productSlug={productSlug}
                  title={product.title}
                  price={Number(product.price ?? 0)}
                  originalPrice={product.list_price != null ? Number(product.list_price) : null}
                  currency="EUR"
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
          <Suspense fallback={<RelatedProductsSkeleton />}>
            <SellerProductsGrid
              products={relatedProducts}
              sellerUsername={username}
            />
          </Suspense>

          {/* Reviews */}
          <Suspense fallback={<ReviewsSkeleton />}>
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
          </Suspense>
        </div>
      </PageShell>
    </>
  );
}
