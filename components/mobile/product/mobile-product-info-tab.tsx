"use client";

// =============================================================================
// MOBILE PRODUCT INFO TAB
// =============================================================================
// Product information tab containing: title, price, badges, specs, description,
// delivery options, shipping & returns, and customer reviews.
// Part of the two-tab mobile product page layout.
// =============================================================================

import { HeroSpecs } from "@/components/shared/product/hero-specs";
import { CustomerReviewsHybrid } from "@/components/shared/product/customer-reviews-hybrid";
import { MobileSellerPreviewCard } from "./mobile-seller-preview-card";
import { MobileSafetyTips, MobileReportButton } from "./mobile-trust-sections";
import { MetaRow, type CategorySummary } from "@/components/shared/product/meta-row";
import { ProductHeader } from "@/components/shared/product/product-header";
import { SpecificationsList, type SpecItem } from "@/components/shared/product/specifications-list";
import { ProductDescription } from "@/components/shared/product/product-description";
import { DeliveryOptions } from "@/components/shared/product/delivery-options";
import { ShippingReturnsInfo } from "@/components/shared/product/shipping-returns-info";
import { cn } from "@/lib/utils";

import type { ResolvedHeroSpec } from "@/lib/view-models/product-page";
import type { CustomerReview } from "@/components/shared/product/customer-reviews-hybrid";
import type { SubmitReviewFn } from "@/components/shared/product/write-review-dialog";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SellerPreview {
  id: string;
  name: string;
  username?: string | null;
  avatarUrl?: string | null;
  verified?: boolean;
  rating?: number | null;
  reviewCount?: number | null;
  responseTimeHours?: number | null;
  listingsCount?: number | null;
  totalSales?: number | null;
  joinedYear?: string | null;
}

interface MobileProductInfoTabProps {
  /** Product title */
  title: string;
  /** Product condition */
  condition: string | null;
  /** Product description */
  description: string | null;
  /** Whether seller offers shipping */
  pickupOnly: boolean;
  /** Product specifications (key-value pairs) */
  specifications: SpecItem[];
  /** Category-adaptive hero specs (4 pills) */
  heroSpecs: ResolvedHeroSpec[];
  /** Customer reviews */
  reviews: CustomerReview[];
  /** Product rating */
  rating: number;
  /** Total review count */
  reviewCount: number;
  /** Product ID for review submission */
  productId: string;
  /** Current locale */
  locale: string;
  /** Optional submit review function */
  submitReview?: SubmitReviewFn;
  /** Optional className */
  className?: string;
  /** Category info for badge */
  category?: CategorySummary | null;
  /** Root category info for badge */
  rootCategory?: CategorySummary | null;
  /** Time ago string */
  timeAgo?: string | null;
  /** View count */
  viewCount?: number | null;
  /** Product price */
  price?: number | null;
  /** Price currency */
  currency?: string;
  /** Whether price is negotiable */
  isNegotiable?: boolean;
  /** Seller preview info */
  seller?: SellerPreview | null;
  /** Callback when View Profile is clicked */
  onViewSellerProfile?: () => void;
  /** Callback when report is clicked */
  onReport?: () => void;
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function MobileProductInfoTab({
  title,
  condition,
  description,
  pickupOnly,
  specifications,
  heroSpecs,
  reviews,
  rating,
  reviewCount,
  productId,
  locale,
  submitReview,
  className,
  category,
  rootCategory,
  timeAgo,
  viewCount,
  price,
  currency = "EUR",
  isNegotiable,
  seller,
  onViewSellerProfile,
  onReport,
}: MobileProductInfoTabProps) {
  return (
    <div className={cn("space-y-4 py-4", className)}>
      {/* Meta Row: [Category chain] ←→ [Time · Views] */}
      {(category || rootCategory || timeAgo || (viewCount != null && viewCount > 0)) && (
        <div className="px-4">
          <MetaRow
            category={category ?? null}
            rootCategory={rootCategory ?? null}
            timeAgo={timeAgo ?? null}
            viewCount={viewCount ?? null}
            locale={locale}
          />
        </div>
      )}

      {/* Header: price + title + badges */}
      <div className="px-4">
        <ProductHeader
          title={title}
          condition={condition}
          freeShipping={!pickupOnly}
          price={price ?? 0}
          currency={currency}
          isNegotiable={Boolean(isNegotiable)}
          locale={locale}
        />
      </div>

      {/* Hero Specs (if available) */}
      {heroSpecs.length > 0 && (
        <div className="px-4">
          <HeroSpecs specs={heroSpecs.slice(0, 4)} variant="mobile" />
        </div>
      )}

      {/* Seller Preview Card */}
      {seller && (
        <div className="px-4">
          <MobileSellerPreviewCard
            seller={seller}
            onViewProfile={onViewSellerProfile}
          />
        </div>
      )}

      {/* Specifications */}
      <div className="px-4">
        <SpecificationsList specifications={specifications} />
      </div>

      {/* Description */}
      <div className="px-4">
        <ProductDescription description={description} />
      </div>

      {/* Delivery Options */}
      <div className="px-4">
        <DeliveryOptions pickupOnly={pickupOnly} freeShipping={!pickupOnly} />
      </div>

      {/* Shipping & Returns */}
      <div className="px-4">
        <ShippingReturnsInfo pickupOnly={pickupOnly} />
      </div>

      {/* Customer Reviews */}
      <div className="px-4 pt-2">
        <CustomerReviewsHybrid
          rating={rating}
          reviewCount={reviewCount}
          reviews={reviews}
          productId={productId}
          productTitle={title}
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
        <MobileReportButton onReport={onReport} />
      </div>
    </div>
  );
}
