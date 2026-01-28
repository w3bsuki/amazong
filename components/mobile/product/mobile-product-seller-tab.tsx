"use client";

// =============================================================================
// MOBILE PRODUCT SELLER TAB
// =============================================================================
// Seller information tab containing: profile, stats, bio, listings, and reviews.
// Part of the two-tab mobile product page layout.
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
  Clock,
  ChevronRight,
  ShoppingBag,
  ThumbsUp,
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

/** Seller Profile Header */
function SellerProfileHeader({ seller }: { seller: SellerInfo }) {
  const t = useTranslations("Product");

  return (
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div className="relative shrink-0">
        <UserAvatar
          name={seller.name}
          avatarUrl={seller.avatarUrl}
          size="xl"
          className="ring-2 ring-border"
        />
        {seller.verified && (
          <span className="absolute -bottom-1 -right-1 size-6 bg-verified rounded-full ring-2 ring-surface-card flex items-center justify-center">
            <CheckCircle2 className="size-4 text-primary-foreground" fill="currentColor" />
          </span>
        )}
      </div>

      {/* Name & Meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-text-strong truncate">{seller.name}</h2>
          {seller.verified && (
            <Badge variant="verified" className="shrink-0">
              {t("verified")}
            </Badge>
          )}
        </div>
        {seller.username && (
          <p className="text-sm text-text-muted-alt">@{seller.username}</p>
        )}
        {/* Rating */}
        {seller.rating != null && seller.rating > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <Star className="size-4 fill-rating text-rating" />
            <span className="text-sm font-semibold text-text-strong">
              {seller.rating.toFixed(1)}
            </span>
            {seller.reviewCount != null && seller.reviewCount > 0 && (
              <span className="text-xs text-text-muted-alt">
                ({seller.reviewCount} {t("reviews", { count: seller.reviewCount })})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Stats Grid */
function SellerStatsGrid({ seller }: { seller: SellerInfo }) {
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

  const stats = [
    {
      icon: ShoppingBag,
      label: t("itemsSold"),
      value: seller.totalSales ?? 0,
      color: "text-success",
    },
    {
      icon: ThumbsUp,
      label: t("positiveFeedback"),
      value: seller.positivePercent != null ? `${seller.positivePercent}%` : "—",
      color: "text-success",
    },
    {
      icon: Users,
      label: "Followers",
      value: seller.followers ?? 0,
      color: "text-primary",
    },
    {
      icon: Clock,
      label: "Response",
      value: seller.responseTimeHours != null ? `${Math.round(seller.responseTimeHours)}h` : "—",
      color: "text-info",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-surface-subtle"
          >
            <stat.icon className={cn("size-5 shrink-0", stat.color)} strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="text-xs text-text-muted-alt">{stat.label}</p>
              <p className="text-sm font-semibold text-text-strong">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Joined Date */}
      {joinedText && (
        <div className="flex items-center gap-2 text-xs text-text-muted-alt">
          <Calendar className="size-3.5" strokeWidth={1.5} />
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

/** Action Buttons */
function SellerActions({ seller }: { seller: SellerInfo }) {
  const t = useTranslations("Product");

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="flex-1">
        <Users className="size-4 mr-1.5" />
        {t("follow")}
      </Button>
      <Button variant="outline" size="sm" className="flex-1">
        <MessageCircle className="size-4 mr-1.5" />
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
    <div className={cn("space-y-5 py-4 px-4", className)}>
      {/* Profile Header */}
      <SellerProfileHeader seller={seller} />

      {/* Action Buttons */}
      <SellerActions seller={seller} />

      {/* Stats Grid */}
      <SellerStatsGrid seller={seller} />

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
