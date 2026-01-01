"use client";

import { useRef, useState } from "react";
import { ProductGalleryHybrid } from "@/components/shared/product/product-gallery-hybrid";
import { MobileProductHeader } from "./mobile-product-header";
import { MobilePriceBlock } from "./mobile-price-block";
import { MobileBadgesRow } from "./mobile-badges-row";
import { MobileSellerTrustLine } from "./mobile-seller-trust-line";
import { MobileUrgencyBanner } from "./mobile-urgency-banner";
import { MobileQuickSpecs } from "./mobile-quick-specs";
import { MobileTrustBlock } from "./mobile-trust-block";
import { MobileStickyBarEnhanced } from "./mobile-sticky-bar-enhanced";
import { MobileAccordions } from "@/components/shared/product/mobile-accordions";
import { SellerProductsGrid } from "@/components/shared/product/seller-products-grid";
import { CustomerReviewsHybrid } from "@/components/shared/product/customer-reviews-hybrid";
import { RecentlyViewedTracker } from "@/components/shared/product/recently-viewed-tracker";
import { CategoryBadge } from "@/components/shared/product/category-badge";

import type { ProductPageViewModel } from "@/lib/view-models/product-page";
import type { Database } from "@/lib/supabase/database.types";
import type { CustomerReview } from "@/components/shared/product/customer-reviews-hybrid";
import type { SubmitReviewFn } from "@/components/shared/product/write-review-dialog";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type SellerStatsRow = Database["public"]["Tables"]["seller_stats"]["Row"];

type ProductWithSellerStats = ProductRow & {
  seller_stats?: SellerStatsRow | null;
  viewers_count?: number | null;
  sold_count?: number | null;
};

type SellerSummary = {
  id: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  verified?: boolean | null;
  created_at?: string | null;
};

type CategorySummary = {
  id?: string;
  name: string;
  name_bg?: string | null;
  slug: string;
  icon?: string | null;
  parent_id?: string | null;
};

interface MobileProductPageProps {
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
  submitReview?: SubmitReviewFn;
}

export function MobileProductPage(props: MobileProductPageProps) {
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
    submitReview,
  } = props;

  const accordionRef = useRef<HTMLDivElement>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const primaryImageSrc = viewModel.galleryImages?.[0]?.src ?? null;

  // Cart product info
  const cartProduct = {
    id: String(product.id),
    title: String(product.title ?? ""),
    image: primaryImageSrc ?? "",
    slug: product.slug || product.id,
    username: seller?.username || username,
  };

  // Seller info
  const sellerInfo = {
    name: viewModel.sellerName || seller?.username || username || "Seller",
    username: seller?.username || username,
    avatarUrl: viewModel.sellerAvatarUrl,
    rating: product.seller_stats?.average_rating ?? null,
    positivePercent: product.seller_stats?.positive_feedback_pct ?? null,
    verified: Boolean(viewModel.sellerVerified),
  };

  // Stock info
  const stockQuantity = product.stock ?? null;
  const stockStatus = stockQuantity === 0 
    ? "out_of_stock" 
    : (stockQuantity && stockQuantity <= 5) 
      ? "low_stock" 
      : "in_stock";

  // Quick specs from item specifics
  const quickSpecs = viewModel.itemSpecifics.details?.slice(0, 8) ?? [];

  // Handle scroll to specs accordion
  const handleSeeAllSpecs = () => {
    setOpenAccordion("details");
    setTimeout(() => {
      accordionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-12 lg:hidden">
      {/* Mobile Product Header */}
      <MobileProductHeader />

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

      {/* ===== ABOVE THE FOLD ===== */}
      
      {/* Gallery - Edge to Edge */}
      <div className="w-full">
        <ProductGalleryHybrid images={viewModel.galleryImages} />
      </div>

      {/* Price Block */}
      <div className="px-3 pt-2">
        <MobilePriceBlock
          salePrice={Number(product.price ?? 0)}
          regularPrice={product.list_price != null ? Number(product.list_price) : null}
          currency="BGN"
        />
      </div>

      {/* Urgency Banner (Conditional) - High priority placement */}
      <div className="-mx-1 mt-1 mb-1">
        <MobileUrgencyBanner
          stockQuantity={stockQuantity}
          viewersCount={product.viewers_count ?? null}
          soldCount={product.sold_count ?? null}
          locale={locale}
        />
      </div>

      {/* Title - text-base (16px) for better readability, tight leading */}
      <div className="px-3 pt-1">
        <h1 className="text-base font-medium leading-snug text-foreground line-clamp-3">
          {product.title}
        </h1>
      </div>

      {/* Badges Row - Scrollable */}
      <div className="-ml-1">
        <MobileBadgesRow
          condition={product.condition}
          freeShipping={!product.pickup_only}
          stockQuantity={stockQuantity}
          stockStatus={stockStatus}
          isOnSale={product.list_price != null && product.list_price > product.price}
          locale={locale}
        />
      </div>

      {/* Seller Trust Line */}
      <MobileSellerTrustLine
        sellerName={sellerInfo.name}
        sellerUsername={sellerInfo.username}
        sellerAvatarUrl={sellerInfo.avatarUrl}
        rating={sellerInfo.rating}
        positivePercent={sellerInfo.positivePercent}
        isVerified={sellerInfo.verified}
        locale={locale}
      />

      {/* ===== BELOW THE FOLD ===== */}

      {/* Quick Specs Pills */}
      {quickSpecs.length > 0 && (
        <div className="px-3 mt-2">
          <MobileQuickSpecs
            attributes={quickSpecs}
            onSeeAll={handleSeeAllSpecs}
            locale={locale}
          />
        </div>
      )}

      {/* Trust Block */}
      <div className="border-t border-border/50 mt-2">
        <MobileTrustBlock
          locale={locale}
          verifiedSeller={sellerInfo.verified}
          freeShipping={!product.pickup_only}
        />
      </div>

      {/* Accordions */}
      <div ref={accordionRef} className="border-t border-border mt-2">
        <MobileAccordions
          description={String(product.description ?? "")}
          details={viewModel.itemSpecifics.details}
          shippingText={!product.pickup_only ? (locale === "bg" ? "Безплатна доставка" : "Free shipping") : (locale === "bg" ? "Доставка при поръчка" : "Shipping calculated at checkout")}
          returnsText={locale === "bg" ? "30 дни връщане. Купувачът плаща за връщане." : "30 days returns. Buyer pays for return shipping."}
        />
      </div>

      {/* More from Seller */}
      {relatedProducts.length > 0 && (
        <div className="px-3">
          <SellerProductsGrid
            products={relatedProducts}
            sellerUsername={username}
          />
        </div>
      )}

      {/* Reviews */}
      <div className="px-3 pb-8">
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

      {/* Sticky Bar */}
      <MobileStickyBarEnhanced
        product={cartProduct}
        price={Number(product.price ?? 0)}
        originalPrice={product.list_price != null ? Number(product.list_price) : null}
        currency="BGN"
        isOutOfStock={stockStatus === "out_of_stock"}
      />
    </div>
  );
}
