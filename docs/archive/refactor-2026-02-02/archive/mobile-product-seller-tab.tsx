"use client";

// =============================================================================
// MOBILE PRODUCT SELLER TAB
// =============================================================================
// Seller information tab containing: profile, stats, bio, listings, and reviews.
// Part of the two-tab mobile product page layout.
// Redesigned: compact inline stats, "new seller" badge, tighter hierarchy.
// =============================================================================

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { bg, enUS } from "date-fns/locale";
import {
  Star,
  CheckCircle2,
  Calendar,
  Package,
  Users,
  MessageCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { cn } from "@/lib/utils";

import type { ProductPageViewModel } from "@/lib/view-models/product-page";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SellerInfo {
  id: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  verified: boolean;
  rating: number | null;
  reviewCount: number | null;
  positivePercent: number | null;
  totalSales: number | null;
  responseTimeHours: number | null;
  followers: number | null;
  joinedAt: string | null;
  bio: string | null;
}

interface MobileProductSellerTabProps {
  /** Seller information */
  seller: SellerInfo;
  /** Related products from this seller */
  relatedProducts: ProductPageViewModel["relatedProducts"];
  /** Current locale */
  locale: string;
  /** Optional className */
  className?: string;
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

/** Check if seller is "new" (no sales or feedback) */
function isNewSeller(seller: SellerInfo): boolean {
  return (seller.totalSales ?? 0) === 0 || (seller.positivePercent ?? 0) === 0;
}

/** Seller Profile Header - Tighter layout with inline badge */
function SellerProfileHeader({ seller }: { seller: SellerInfo }) {
  const t = useTranslations("Product");
  const tVerif = useTranslations("SellerVerification");

  const showNewSellerBadge = isNewSeller(seller);

  return (
    <div className="flex items-start gap-3">
      {/* Avatar - no ring for cleaner look */}
      <div className="relative shrink-0">
        <UserAvatar
          name={seller.name}
          avatarUrl={seller.avatarUrl}
          size="xl"
        />
        {seller.verified && (
          <span className="absolute -bottom-1 -right-1 size-5 bg-verified rounded-full ring-2 ring-surface-card flex items-center justify-center">
            <CheckCircle2 className="size-3 text-primary-foreground" fill="currentColor" />
          </span>
        )}
      </div>

      {/* Name & Meta - tighter spacing */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h2 className="text-base font-bold text-text-strong truncate">{seller.name}</h2>
          {seller.verified && (
            <Badge variant="verified" className="shrink-0 text-2xs px-1.5 py-0">
              {t("verified")}
            </Badge>
          )}
          {showNewSellerBadge && (
            <Badge variant="secondary" className="shrink-0 text-2xs px-1.5 py-0 gap-1">
              <Sparkles className="size-2.5" />
              {tVerif("newSeller")}
            </Badge>
          )}
        </div>
        {seller.username && (
          <p className="text-sm text-text-muted-alt">@{seller.username}</p>
        )}
        {/* Rating - inline */}
        {seller.rating != null && seller.rating > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="size-3.5 fill-rating text-rating" />
            <span className="text-sm font-semibold text-text-strong">
              {seller.rating.toFixed(1)}
            </span>
            {seller.reviewCount != null && seller.reviewCount > 0 && (
              <span className="text-xs text-text-muted-alt">
                ({seller.reviewCount})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Compact Inline Stats Row - replaces bloated 2x2 grid */
function SellerStatsRow({ seller }: { seller: SellerInfo }) {
  const t = useTranslations("Seller");
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const joinedText = mounted && seller.joinedAt
    ? formatDistanceToNow(new Date(seller.joinedAt), {
        addSuffix: false,
        locale: locale === "bg" ? bg : enUS,
      })
    : null;

  const isNew = isNewSeller(seller);

  // Build stats parts - skip zeros for new sellers
  const parts: string[] = [];

  if (seller.totalSales != null && seller.totalSales > 0) {
    parts.push(`${seller.totalSales} ${t("itemsSold")}`);
  }

  if (!isNew && seller.positivePercent != null) {
    parts.push(`${seller.positivePercent}% ${t("positive")}`);
  }

  if (seller.responseTimeHours != null && seller.responseTimeHours > 1) {
    const hoursText = locale === "bg" ? "ч отговор" : "h response";
    parts.push(`${Math.round(seller.responseTimeHours)}${hoursText}`);
  }

  return (
    <div className="rounded-xl bg-surface-subtle px-3 py-2.5">
      {/* Stats Row */}
      {parts.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {parts.map((part, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-1.5 text-border">·</span>}
              <span className="text-foreground font-medium">
                {part.split(" ")[0]}
              </span>{" "}
              {part.split(" ").slice(1).join(" ")}
            </span>
          ))}
        </p>
      )}

      {/* Joined Date - always show as trust signal */}
      {joinedText && (
        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
          <Calendar className="size-3" strokeWidth={1.5} />
          <span>{t("memberSince", { date: joinedText })}</span>
        </div>
      )}
    </div>
  );
}

/** Seller Bio */
function SellerBio({ bio }: { bio: string | null }) {
  const t = useTranslations("Seller");

  if (!bio) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-text-muted-alt uppercase tracking-wide">
        {t("aboutThisSeller")}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed">{bio}</p>
    </div>
  );
}

/** Action Buttons - Follow is primary CTA */
function SellerActions({ seller }: { seller: SellerInfo }) {
  const t = useTranslations("Product");

  return (
    <div className="flex gap-2">
      <Button variant="default" className="flex-1 h-9 gap-1.5 rounded-lg text-sm">
        <Users className="size-3.5" />
        {t("follow")}
      </Button>
      <Button variant="outline" className="flex-1 h-9 gap-1.5 rounded-lg text-sm">
        <MessageCircle className="size-3.5" />
        {t("contact")}
      </Button>
    </div>
  );
}

/** Related Products from Seller */
function SellerListings({
  products,
  sellerUsername,
}: {
  products: ProductPageViewModel["relatedProducts"];
  sellerUsername: string | null;
}) {
  const t = useTranslations("Product");
  const tCommon = useTranslations("Common");

  if (!products || products.length === 0) return null;

  const getProductHref = (product: ProductPageViewModel["relatedProducts"][0]) => {
    const resolvedSellerSlug = product.storeSlug || sellerUsername;
    const resolvedProductSlug = product.slug || product.id;
    return resolvedSellerSlug ? `/${resolvedSellerSlug}/${resolvedProductSlug}` : "#";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-text-muted-alt uppercase tracking-wide">
          {t("moreFromSeller")}
        </h3>
        {sellerUsername && (
          <Link
            href={`/${sellerUsername}`}
            className="text-xs font-medium text-primary flex items-center gap-0.5"
          >
            {tCommon("viewAll")}
            <ChevronRight className="size-3.5" />
          </Link>
        )}
      </div>

      {/* Products Grid (2 columns) */}
      <div className="grid grid-cols-2 gap-2">
        {products.slice(0, 6).map((product) => (
          <Link
            key={product.id}
            href={getProductHref(product)}
            className="group block rounded-lg border border-border/50 bg-surface-card overflow-hidden active:opacity-90 transition-opacity"
          >
            {/* Image */}
            <div className="aspect-square relative bg-surface-subtle">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="size-8 text-text-muted-alt" />
                </div>
              )}
            </div>
            {/* Info */}
            <div className="p-2.5">
              <p className="text-xs font-medium text-text-strong line-clamp-2 leading-snug">
                {product.title}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-sm font-bold text-text-strong">
                  €{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-text-muted-alt line-through">
                    €{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      {sellerUsername && products.length > 6 && (
        <Link
          href={`/${sellerUsername}`}
          className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-primary"
        >
          {t("viewAllListings", { count: products.length })}
          <ChevronRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

/** View Full Profile Link */
function ViewProfileLink({ username }: { username: string | null }) {
  const t = useTranslations("Product");

  if (!username) return null;

  return (
    <Link
      href={`/${username}`}
      className="flex items-center justify-between p-4 -mx-4 mt-2 bg-surface-subtle active:bg-active transition-colors"
    >
      <span className="text-sm font-medium text-text-strong">
        {t("viewFullProfile")}
      </span>
      <ChevronRight className="size-5 text-text-muted-alt" />
    </Link>
  );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function MobileProductSellerTab({
  seller,
  relatedProducts,
  locale,
  className,
}: MobileProductSellerTabProps) {
  return (
    <div className={cn("space-y-4 py-4 px-4", className)}>
      {/* Profile Header */}
      <SellerProfileHeader seller={seller} />

      {/* Action Buttons */}
      <SellerActions seller={seller} />

      {/* Compact Stats Row */}
      <SellerStatsRow seller={seller} />

      {/* Bio */}
      <SellerBio bio={seller.bio} />

      {/* Seller's Listings */}
      <SellerListings
        products={relatedProducts}
        sellerUsername={seller.username}
      />

      {/* View Full Profile */}
      <ViewProfileLink username={seller.username} />
    </div>
  );
}
