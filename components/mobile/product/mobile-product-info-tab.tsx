"use client";

// =============================================================================
// MOBILE PRODUCT INFO TAB
// =============================================================================
// Product information tab containing: title, price, badges, specs, description,
// delivery options, shipping & returns, and customer reviews.
// Part of the two-tab mobile product page layout.
// =============================================================================

import { useTranslations, useLocale } from "next-intl";
import { MapPin, Truck, Package, ShieldCheck, RotateCcw, Clock, Eye, Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HeroSpecs } from "@/components/shared/product/hero-specs";
import { CustomerReviewsHybrid } from "@/components/shared/product/customer-reviews-hybrid";
import { cn, getConditionBadgeVariant, getConditionLabel } from "@/lib/utils";

import type { ResolvedHeroSpec } from "@/lib/view-models/product-page";
import type { CustomerReview } from "@/components/shared/product/customer-reviews-hybrid";
import type { SubmitReviewFn } from "@/components/shared/product/write-review-dialog";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SpecItem {
  label: string;
  value: string | number | undefined | null;
}

interface CategorySummary {
  id?: string;
  name: string;
  name_bg?: string | null;
  slug: string;
  icon?: string | null;
  parent_id?: string | null;
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
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

/** Title + Condition + Trust Badges */
function ProductHeader({
  title,
  condition,
  pickupOnly,
}: {
  title: string;
  condition: string | null;
  pickupOnly: boolean;
}) {
  const t = useTranslations("Product");

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold text-text-strong leading-snug">
        {title}
      </h1>
      <div className="flex items-center gap-2 flex-wrap">
        {condition && (
          <Badge variant={getConditionBadgeVariant(condition)}>
            {getConditionLabel(condition)}
          </Badge>
        )}
        {!pickupOnly && (
          <Badge variant="shipping">
            <Truck className="size-3" strokeWidth={2} />
            {t("freeShipping")}
          </Badge>
        )}
      </div>
    </div>
  );
}

/** Specifications List */
function SpecificationsList({ specifications }: { specifications: SpecItem[] }) {
  const t = useTranslations("Product");
  const validSpecs = specifications.filter(
    (spec) => spec.value !== undefined && spec.value !== null && spec.value !== ""
  );

  if (validSpecs.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-text-muted-alt uppercase tracking-wide">
        {t("specifications")}
      </h3>
      <div className="rounded-lg border border-border/50 overflow-hidden divide-y divide-border/50">
        {validSpecs.map((spec, index) => (
          <div
            key={index}
            className={cn(
              "flex justify-between items-center px-3 py-2.5",
              index % 2 === 1 && "bg-muted/20"
            )}
          >
            <span className="text-sm text-text-muted-alt">{spec.label}</span>
            <span className="text-sm font-medium text-text-strong">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Product Description */
function ProductDescription({ description }: { description: string | null }) {
  const t = useTranslations("Product");

  if (!description) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-text-muted-alt uppercase tracking-wide">
        {t("description")}
      </h3>
      <div className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
        {description}
      </div>
    </div>
  );
}

/** Delivery Options */
function DeliveryOptions({ pickupOnly }: { pickupOnly: boolean }) {
  const t = useTranslations("Product");

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-text-muted-alt uppercase tracking-wide">
        {t("delivery")}
      </h3>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/30 text-sm">
          <MapPin className="size-4 text-text-muted-alt" strokeWidth={1.5} />
          {pickupOnly ? t("pickupOnly") : t("meetup")}
        </span>
        {!pickupOnly && (
          <>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/30 text-sm">
              <Truck className="size-4 text-text-muted-alt" strokeWidth={1.5} />
              {t("shipping")}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-shipping-free/10 text-shipping-free text-sm font-medium">
              {t("freeShipping")}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/** Shipping & Returns Info */
function ShippingReturnsInfo({ pickupOnly }: { pickupOnly: boolean }) {
  const t = useTranslations("Product");

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-text-muted-alt uppercase tracking-wide">
        {t("shippingReturns")}
      </h3>
      <div className="space-y-2">
        {/* Shipping */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
          <Package className="size-5 text-text-muted-alt shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-text-strong">{t("shippingTitle")}</p>
            <p className="text-xs text-text-muted-alt mt-0.5">
              {!pickupOnly ? t("freeDelivery") : t("defaultShipping")}
            </p>
          </div>
        </div>
        {/* Returns */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
          <RotateCcw className="size-5 text-text-muted-alt shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-text-strong">{t("returnsTitle")}</p>
            <p className="text-xs text-text-muted-alt mt-0.5">{t("defaultReturns")}</p>
          </div>
        </div>
        {/* Buyer Protection */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
          <ShieldCheck className="size-5 text-success shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-success">{t("buyerProtection")}</p>
            <p className="text-xs text-text-muted-alt mt-0.5">{t("buyerProtectionDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
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
}: MobileProductInfoTabProps) {
  const currentLocale = useLocale();

  // Get display names
  const rootCategoryName = rootCategory 
    ? (currentLocale === "bg" && rootCategory.name_bg ? rootCategory.name_bg : rootCategory.name)
    : null;
  const categoryName = category 
    ? (currentLocale === "bg" && category.name_bg ? category.name_bg : category.name)
    : null;
  const showSubcategory = category && rootCategory && category.slug !== rootCategory.slug;
  
  return (
    <div className={cn("space-y-4 py-4", className)}>
      {/* Meta Row: [Category chain] ←→ [Time · Views] */}
      {(category || rootCategory || timeAgo || (viewCount != null && viewCount > 0)) && (
        <div className="px-4 flex items-center justify-between gap-3">
          {/* Left: Category badge */}
          {(category || rootCategory) && (
            <div className="flex items-center gap-1.5 min-w-0">
              <span 
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                  "bg-zinc-100 dark:bg-zinc-800",
                  "text-xs font-medium text-zinc-700 dark:text-zinc-300",
                  "truncate max-w-45"
                )}
              >
                <Folder className="size-3 shrink-0 text-zinc-500" strokeWidth={2} />
                <span className="truncate">
                  {rootCategoryName || categoryName}
                  {showSubcategory && (
                    <span className="text-zinc-400 dark:text-zinc-500"> · {categoryName}</span>
                  )}
                </span>
              </span>
            </div>
          )}
          
          {/* Right: Time & Views */}
          {(timeAgo || (viewCount != null && viewCount > 0)) && (
            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
              {timeAgo && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" strokeWidth={1.5} />
                  {timeAgo}
                </span>
              )}
              {viewCount != null && viewCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-3.5" strokeWidth={1.5} />
                  {viewCount.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Title + Badges */}
      <div className="px-4">
        <ProductHeader title={title} condition={condition} pickupOnly={pickupOnly} />
      </div>

      {/* Hero Specs (if available) */}
      {heroSpecs.length > 0 && (
        <div className="px-4">
          <HeroSpecs specs={heroSpecs.slice(0, 4)} variant="mobile" />
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
        <DeliveryOptions pickupOnly={pickupOnly} />
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
    </div>
  );
}
