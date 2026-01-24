"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, Clock, Eye, Heart, ChevronRight, Star, CheckCircle2, Shield, Truck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { bg, enUS } from "date-fns/locale";
import { Link } from "@/i18n/routing";
// V2 Mobile Components
import { MobileGalleryV2 } from "./mobile-gallery-v2";
import { MobileBottomBarV2 } from "./mobile-bottom-bar-v2";
// Shared Components
import { MobileSpecsTabs } from "./mobile-specs-tabs";
import { MobileAccordions } from "@/components/shared/product/mobile-accordions";
import { SellerProductsGrid } from "@/components/shared/product/seller-products-grid";
import { CustomerReviewsHybrid } from "@/components/shared/product/customer-reviews-hybrid";
import { RecentlyViewedTracker } from "@/components/shared/product/recently-viewed-tracker";
import { CategoryBadge } from "@/components/shared/product/category-badge";
import { HeroSpecs } from "@/components/shared/product/hero-specs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safeAvatarSrc, cn } from "@/lib/utils";

/** Map condition value to semantic color classes */
function getConditionColorClass(condition: string | undefined | null): string {
  if (!condition) return "bg-condition-new";
  const normalized = condition.toLowerCase().replace(/[\s_-]/g, "");
  switch (normalized) {
    case "new":
    case "newwithtags":
      return "bg-condition-new";
    case "likenew":
    case "usedexcellent":
      return "bg-condition-likenew";
    case "good":
    case "usedgood":
      return "bg-condition-good";
    case "fair":
    case "usedfair":
      return "bg-condition-fair";
    case "used":
      return "bg-condition-used";
    case "refurbished":
    case "refurb":
      return "bg-condition-refurb";
    default:
      return "bg-condition-new";
  }
}

import type { ProductPageViewModel } from "@/lib/view-models/product-page";
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
  variants?: ProductVariantRow[];
  submitReview?: SubmitReviewFn;
  favoritesCount?: number | null;
}

export function MobileProductPage(props: MobileProductPageProps) {
  const t = useTranslations("Product");
  const {
    locale,
    username,
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

  // Seller info
  const sellerInfo = {
    name: viewModel.sellerName || seller?.username || username || t("seller"),
    username: seller?.username || username,
    avatarUrl: viewModel.sellerAvatarUrl,
    rating: product.seller_stats?.average_rating ?? null,
    positivePercent: product.seller_stats?.positive_feedback_pct ?? null,
    verified: Boolean(viewModel.sellerVerified),
  };

  const basePrice = Number(product.price ?? 0);
  const displayPrice = safeVariants.length > 0
    ? basePrice + Number(defaultVariant?.price_adjustment ?? 0)
    : basePrice;

  const displayRegularPrice = product.list_price != null ? Number(product.list_price) : null;

  // Get locale for date formatting
  const currentLocale = useLocale();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Time ago formatting
  const timeAgo = mounted && product.created_at
    ? formatDistanceToNow(new Date(product.created_at), {
        addSuffix: false,
        locale: currentLocale === "bg" ? bg : enUS,
      })
    : null;

  const viewCount = product.view_count ?? product.viewers_count ?? null;
  const location = product.seller_city ?? null;

  return (
    <div className="min-h-dvh bg-surface-page pb-20 md:pb-28 lg:hidden">
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
      <MobileGalleryV2 
        images={viewModel.galleryImages}
        product={cartProduct}
      />

      {/* ========== META ROW (category + time + views) ========== */}
      <div className="bg-surface-card px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-text-muted-alt">
        <div className="flex min-w-0 items-center gap-3">
          {/* Category Badge */}
          {(category || rootCategory) && (
            <CategoryBadge
              locale={locale}
              category={rootCategory || category}
              subcategory={category && rootCategory && category.slug !== rootCategory.slug ? category : null}
              size="sm"
              className="bg-muted/50"
            />
          )}

          {/* Location (tablet+) */}
          {location && (
            <span className="hidden md:flex items-center gap-1 min-w-0">
              <MapPin className="size-3.5" strokeWidth={1.5} />
              <span className="truncate">{location}</span>
            </span>
          )}

          {/* Time ago */}
          {timeAgo && (
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="size-3.5" strokeWidth={1.5} />
              {timeAgo}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Views */}
          {viewCount != null && viewCount > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" strokeWidth={1.5} />
              {viewCount.toLocaleString()}
            </span>
          )}

          {/* Favorites */}
          {favoritesCount != null && favoritesCount > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="size-3.5 text-favorite" strokeWidth={1.5} />
              {favoritesCount.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* ========== TITLE + TAGS CARD ========== */}
      <div className="bg-surface-card mt-1.5 px-4 py-3">
        <h1 className="text-base font-semibold text-text-strong leading-snug">
          {product.title}
        </h1>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {/* Condition Badge */}
          {product.condition && (
            <span className={cn(
              "px-2 py-0.5 rounded text-primary-foreground text-xs font-bold",
              getConditionColorClass(product.condition)
            )}>
              {product.condition}
            </span>
          )}
          {!product.pickup_only && (
            <Badge variant="shipping">
              <Truck className="size-3" strokeWidth={2} />
              {t("freeShipping")}
            </Badge>
          )}
          {sellerInfo.verified && (
            <Badge variant="top-rated">
              <Shield className="size-3" strokeWidth={2} />
              {t("topRated")}
            </Badge>
          )}
        </div>
      </div>

      {/* ========== HERO SPECS (Category-Adaptive) ========== */}
      {viewModel.heroSpecs.length > 0 && (
        <div className="bg-surface-card mt-1.5 px-4 py-3">
          <HeroSpecs specs={viewModel.heroSpecs.slice(0, 4)} variant="mobile" />
        </div>
      )}

      {/* ========== SELLER CARD ========== */}
      <Link
        href={sellerInfo.username ? `/${sellerInfo.username}` : "#"}
        className="block bg-surface-card mt-1.5 px-4 py-3 active:bg-active"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <Avatar className="size-12 ring-2 ring-border bg-muted">
              <AvatarImage
                src={safeAvatarSrc(sellerInfo.avatarUrl ?? null)}
                alt={sellerInfo.name}
              />
              <AvatarFallback className="text-sm font-medium bg-muted">
                {sellerInfo.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {sellerInfo.verified && (
              <span className="absolute -bottom-0.5 -right-0.5 size-5 bg-verified rounded-full ring-2 ring-surface-card flex items-center justify-center">
                <CheckCircle2 className="size-3 text-primary-foreground" fill="currentColor" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-text-strong">{sellerInfo.name}</span>
            {sellerInfo.rating != null && sellerInfo.rating > 0 && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="size-3.5 fill-rating text-rating" />
                <span className="text-sm font-semibold text-text-strong">
                  {typeof sellerInfo.rating === "number" ? sellerInfo.rating.toFixed(1) : sellerInfo.rating}
                </span>
                {product.seller_stats?.total_reviews != null && product.seller_stats.total_reviews > 0 && (
                  <>
                    <span className="text-xs text-text-muted-alt">·</span>
                    <span className="text-xs text-text-muted-alt">
                      {product.seller_stats.total_reviews} {t("reviews", { count: product.seller_stats.total_reviews })}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <ChevronRight className="size-5 text-text-muted-alt" />
        </div>
      </Link>

      {/* ========== DELIVERY CARD ========== */}
      <div className="bg-surface-card mt-1.5 px-4 py-3">
        <span className="text-xs font-semibold text-text-muted-alt uppercase tracking-wide">
          {t("delivery")}
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/30 text-sm">
            <MapPin className="size-4 text-text-muted-alt" strokeWidth={1.5} />
            {product.pickup_only ? t("pickupOnly") : t("meetup")}
          </span>
          {!product.pickup_only && (
            <>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/30 text-sm">
                <Truck className="size-4 text-text-muted-alt" strokeWidth={1.5} />
                {t("shipping")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-shipping-free/10 text-shipping-free text-sm font-medium">
                {t("freeShipping")}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ========== SPECS/DESCRIPTION TABS ========== */}
      <div className="bg-surface-card mt-1.5">
        <MobileSpecsTabs
          specifications={viewModel.itemSpecifics.details || []}
          description={product.description}
        />
      </div>

      {/* ========== SHIPPING & RETURNS (Accordion) ========== */}
      <div className="bg-surface-card mt-1.5">
        <MobileAccordions
          description={null}
          details={null}
          shippingText={!product.pickup_only ? t("freeDelivery") : t("defaultShipping")}
          returnsText={t("defaultReturns")}
        />
      </div>

      {/* ========== MORE FROM SELLER ========== */}
      {relatedProducts.length > 0 && (
        <div className="bg-surface-card mt-1.5">
          <SellerProductsGrid
            products={relatedProducts}
            sellerUsername={username}
          />
        </div>
      )}

      {/* ========== REVIEWS ========== */}
      <div className="bg-surface-card mt-1.5 px-4 py-4">
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

      {/* ========== BOTTOM BAR ========== */}
      <MobileBottomBarV2
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
          displayName: sellerInfo.name,
        }}
      />
    </div>
  );
}
