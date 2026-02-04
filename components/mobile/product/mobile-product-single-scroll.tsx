"use client";

// =============================================================================
// MOBILE PRODUCT PAGE - Single Scroll Layout (TradeSphere Pattern)
// =============================================================================
// Clean, modern mobile product page with single continuous scroll.
// No tabs - all content flows naturally for optimal mobile UX.
// =============================================================================

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { bg, enUS } from "date-fns/locale";

// Mobile-specific components
import { MobileGallery } from "./mobile-gallery";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { MobileSellerPreviewCard } from "./mobile-seller-preview-card";
import { MobileSafetyTips, MobileReportButton } from "./mobile-trust-sections";
import { SellerProfileDrawer } from "@/components/mobile/drawers/seller-profile-drawer";

// Shared product components
import { MetaRow, type CategorySummary } from "@/components/shared/product/meta-row";
import { ProductHeader } from "@/components/shared/product/product-header";
import { SpecificationsList } from "@/components/shared/product/specifications-list";
import { ProductDescription } from "@/components/shared/product/product-description";
import { DeliveryOptions } from "@/components/shared/product/delivery-options";
import { ShippingReturnsInfo } from "@/components/shared/product/shipping-returns-info";
import { SimilarItemsGrid } from "@/components/shared/product/similar-items-grid";
import { RecentlyViewedTracker } from "@/components/shared/product/recently-viewed-tracker";
import { PageShell } from "@/components/shared/page-shell";
import { HeroSpecs } from "@/components/shared/product/hero-specs";
import { CustomerReviewsHybrid } from "@/components/shared/product/customer-reviews-hybrid";

import type { ProductPageViewModel, ResolvedHeroSpec } from "@/lib/view-models/product-page";
import type { Database } from "@/lib/supabase/database.types";
import type { CustomerReview } from "@/components/shared/product/customer-reviews-hybrid";
import type { SubmitReviewFn } from "@/components/shared/product/write-review-dialog";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type SellerStatsRow = Database["public"]["Tables"]["seller_stats"]["Row"];
type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"];

type ProductWithSellerStats = ProductRow & {
  seller_stats?: Partial<SellerStatsRow> | null;
  viewers_count?: number | null;
  sold_count?: number | null;
  is_negotiable?: boolean;
};

type SellerSummary = {
  id: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  verified?: boolean | null;
  created_at?: string | null;
};

interface MobileProductSingleScrollProps {
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
  favoritesCount?: number | null;
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function MobileProductSingleScroll(props: MobileProductSingleScrollProps) {
  const t = useTranslations("Product");
  const currentLocale = useLocale();
  const {
    locale,
    username,
    product,
    seller,
    category,
    rootCategory,
    relatedProducts,
    reviews,
    viewModel,
    variants,
    submitReview,
  } = props;

  const safeVariants = Array.isArray(variants) ? variants : [];
  const defaultVariant = safeVariants.find((v) => v.is_default) ?? safeVariants[0] ?? null;

  const primaryImageSrc = viewModel.galleryImages?.[0]?.src ?? null;

  // Cart/wishlist product info
  const cartProduct = {
    id: String(product.id),
    title: String(product.title ?? ""),
    price: Number(product.price ?? 0),
    image: primaryImageSrc ?? "",
    slug: product.slug || product.id,
    username: seller?.username || username,
  };

  // Base/display prices
  const basePrice = Number(product.price ?? 0);
  const displayPrice =
    safeVariants.length > 0
      ? basePrice + Number(defaultVariant?.price_adjustment ?? 0)
      : basePrice;
  const displayRegularPrice = product.list_price != null ? Number(product.list_price) : null;

  // Time ago formatting
  const [mounted, setMounted] = useState(false);
  const [sellerDrawerOpen, setSellerDrawerOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const timeAgo =
    mounted && product.created_at
      ? formatDistanceToNow(new Date(product.created_at), {
          addSuffix: false,
          locale: currentLocale === "bg" ? bg : enUS,
        })
      : null;

  // View/favorites counts
  const viewCount = product.view_count ?? product.viewers_count ?? null;

  // Seller preview info
  const sellerPreview = {
    id: seller.id,
    name:
      viewModel.sellerName || seller?.display_name || seller?.username || username || t("seller"),
    username: seller?.username ?? null,
    avatarUrl: viewModel.sellerAvatarUrl ?? seller?.avatar_url ?? null,
    verified: Boolean(viewModel.sellerVerified || seller?.verified),
    rating:
      product.seller_stats?.average_rating != null
        ? Number(product.seller_stats.average_rating)
        : null,
    reviewCount:
      product.seller_stats?.total_reviews != null
        ? Number(product.seller_stats.total_reviews)
        : null,
    responseTimeHours:
      product.seller_stats?.response_time_hours != null
        ? Number(product.seller_stats.response_time_hours)
        : null,
    listingsCount:
      product.seller_stats?.active_listings != null
        ? Number(product.seller_stats.active_listings)
        : null,
    totalSales:
      product.seller_stats?.total_sales != null ? Number(product.seller_stats.total_sales) : null,
    positivePercent:
      product.seller_stats?.positive_feedback_pct != null
        ? Number(product.seller_stats.positive_feedback_pct)
        : null,
    joinedAt: seller?.created_at ?? null,
    joinedYear: seller?.created_at ? new Date(seller.created_at).getFullYear().toString() : null,
    bio: null as string | null, // TODO: Add seller bio when available
  };

  // Convert relatedProducts to drawer-compatible format
  const sellerProducts = relatedProducts.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    slug: p.slug ?? null,
    storeSlug: p.storeSlug ?? null,
  }));

  // Handle report (placeholder)
  const handleReport = () => {
    // TODO: Implement report modal/flow
    console.log("Report listing:", product.id);
  };

  const pickupOnly = product.pickup_only ?? false;
  const freeShipping = Boolean(product.free_shipping);
  const isNegotiable = Boolean(product.is_negotiable);

  return (
    <PageShell variant="muted" className="pb-20 md:pb-28 lg:hidden">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(viewModel.jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(viewModel.breadcrumbJsonLd) }}
      />

      {/* Track Recently Viewed */}
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

      {/* ========== GALLERY ========== */}
      <MobileGallery images={viewModel.galleryImages} product={cartProduct} />

      {/* ========== CONTENT (Single Scroll) ========== */}
      <div className="bg-card space-y-4 py-4">
        {/* Meta Row: Category + Time/Views */}
        <div className="px-4">
          <MetaRow
            category={category}
            rootCategory={rootCategory}
            timeAgo={timeAgo}
            viewCount={viewCount}
            locale={currentLocale}
          />
        </div>

        {/* Price + Title + Badges (compact TradeSphere pattern) */}
        <div className="px-4">
          <ProductHeader
            title={product.title ?? ""}
            condition={product.condition}
            freeShipping={freeShipping}
            price={displayPrice}
            currency="EUR"
            isNegotiable={isNegotiable}
            locale={currentLocale}
          />
        </div>

        {/* Hero Specs */}
        {viewModel.heroSpecs.length > 0 && (
          <div className="px-4">
            <HeroSpecs specs={viewModel.heroSpecs.slice(0, 4)} variant="mobile" />
          </div>
        )}

        {/* Specifications */}
        <div className="px-4">
          <SpecificationsList specifications={viewModel.itemSpecifics.details || []} />
        </div>

        {/* Description */}
        <div className="px-4">
          <ProductDescription description={product.description} />
        </div>

        {/* Delivery Options */}
        <div className="px-4">
          <DeliveryOptions pickupOnly={pickupOnly} freeShipping={freeShipping} />
        </div>

        {/* Shipping & Returns */}
        <div className="px-4">
          <ShippingReturnsInfo pickupOnly={pickupOnly} />
        </div>

        {/* Seller Preview Card (above reviews) */}
        <div className="px-4">
          <MobileSellerPreviewCard 
            seller={sellerPreview} 
            onViewProfile={() => setSellerDrawerOpen(true)}
          />
        </div>

        {/* Customer Reviews */}
        <div className="px-4 pt-2">
          <CustomerReviewsHybrid
            rating={Number(product.rating ?? 0)}
            reviewCount={Number(product.review_count ?? 0)}
            reviews={reviews}
            productId={product.id}
            productTitle={product.title ?? ""}
            locale={locale}
            {...(submitReview && { submitReview })}
          />
        </div>

        {/* Safety Tips */}
        <div className="px-4 pt-2">
          <MobileSafetyTips />
        </div>

        {/* Report Listing */}
        <div className="px-4">
          <MobileReportButton onReport={handleReport} />
        </div>
      </div>

      {/* ========== SIMILAR ITEMS ========== */}
      <SimilarItemsGrid products={relatedProducts} rootCategory={rootCategory} />

      {/* ========== BOTTOM BAR ========== */}
      <MobileBottomBar
        categoryType={viewModel.categoryType}
        product={{
          id: cartProduct.id,
          title: cartProduct.title,
          price: displayPrice,
          originalPrice: displayRegularPrice,
          currency: "EUR",
          image: cartProduct.image,
          slug: cartProduct.slug,
          username: cartProduct.username,
        }}
        seller={{
          id: seller.id,
          displayName: sellerPreview.name,
        }}
      />

      {/* ========== SELLER PROFILE DRAWER ========== */}
      <SellerProfileDrawer
        open={sellerDrawerOpen}
        onOpenChange={setSellerDrawerOpen}
        seller={sellerPreview}
        products={sellerProducts}
      />
    </PageShell>
  );
}
