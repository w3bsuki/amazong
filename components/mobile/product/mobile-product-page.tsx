"use client";

// =============================================================================
// MOBILE PRODUCT PAGE V3 - Two-Tab Layout
// =============================================================================
// Clean, modern mobile product page with two tabs:
// - INFO: Product details, specs, description, delivery, reviews
// - SELLER: Seller profile, stats, listings
//
// Layout:
// ┌─────────────────────────────┐
// │     [GALLERY / IMAGES]      │
// ├─────────────────────────────┤
// │  [ INFO ]     [ SELLER ]    │  ← Two tabs
// ├─────────────────────────────┤
// │ [Category]    [Time • Views]│  ← Inside Info tab
// │   TAB CONTENT (scrollable)  │
// ├─────────────────────────────┤
// │ €59.99  [Chat]  [Add ▶]     │  ← Sticky bottom bar
// └─────────────────────────────┘
// =============================================================================

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { bg, enUS } from "date-fns/locale";
import { Info, User } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";

// V3 Tab Components
import { MobileProductInfoTab } from "./mobile-product-info-tab";
import { MobileProductSellerTab } from "./mobile-product-seller-tab";

// V2 Mobile Components
import { MobileGalleryV2 } from "./mobile-gallery-v2";
import { MobileBottomBarV2 } from "./mobile-bottom-bar-v2";

// Shared Components
import { RecentlyViewedTracker } from "@/components/shared/product/recently-viewed-tracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageShell } from "@/components/shared/page-shell";

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
    rootCategory,
    relatedProducts,
    reviews,
    viewModel,
    variants,
    submitReview,
    favoritesCount,
  } = props;

  // Track active tab for contextual bottom bar
  const [activeTab, setActiveTab] = useState<"info" | "seller">("info");

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
  const displayPrice = safeVariants.length > 0
    ? basePrice + Number(defaultVariant?.price_adjustment ?? 0)
    : basePrice;
  const displayRegularPrice = product.list_price != null ? Number(product.list_price) : null;

  // Locale for date formatting
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

  // View/favorites counts
  const viewCount = product.view_count ?? product.viewers_count ?? null;

  // Seller info for tabs
  const sellerInfoForTab = {
    id: seller.id,
    name: viewModel.sellerName || seller?.display_name || seller?.username || username || t("seller"),
    username: seller?.username ?? null,
    avatarUrl: viewModel.sellerAvatarUrl ?? seller?.avatar_url ?? null,
    verified: Boolean(viewModel.sellerVerified || seller?.verified),
    rating: product.seller_stats?.average_rating != null 
      ? Number(product.seller_stats.average_rating) 
      : null,
    reviewCount: product.seller_stats?.total_reviews != null 
      ? Number(product.seller_stats.total_reviews) 
      : null,
    positivePercent: product.seller_stats?.positive_feedback_pct != null
      ? Number(product.seller_stats.positive_feedback_pct)
      : null,
    totalSales: product.seller_stats?.total_sales != null
      ? Number(product.seller_stats.total_sales)
      : null,
    responseTimeHours: product.seller_stats?.response_time_hours != null
      ? Number(product.seller_stats.response_time_hours)
      : null,
    followers: null, // TODO: Add followers count if available
    joinedAt: seller?.created_at ?? null,
    bio: null, // TODO: Add seller bio if available
  };

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
      <MobileGalleryV2
        images={viewModel.galleryImages}
        product={cartProduct}
      />

      {/* ========== TWO-TAB LAYOUT ========== */}
      <Tabs 
        defaultValue="info" 
        className="bg-surface-card"
        onValueChange={(value) => setActiveTab(value as "info" | "seller")}
      >
        {/* Tab List */}
        <TabsList className="w-full h-12 bg-transparent p-0 rounded-none border-b border-border/40">
            <TabsTrigger
              value="info"
              className="flex-1 h-full gap-1.5 rounded-none bg-transparent text-muted-foreground font-medium data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground transition-colors"
            >
              <Info className="size-4" strokeWidth={1.5} />
              {t("productInfo")}
            </TabsTrigger>
            <TabsTrigger
              value="seller"
              className="flex-1 h-full gap-1.5 rounded-none bg-transparent text-muted-foreground font-medium data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground transition-colors"
            >
              {sellerInfoForTab.avatarUrl ? (
                <UserAvatar
                  name={sellerInfoForTab.name || "?"}
                  avatarUrl={sellerInfoForTab.avatarUrl}
                  size="sm"
                  className="size-5 ring-1 ring-border/50"
                  fallbackClassName="text-[10px] font-medium bg-muted"
                />
              ) : (
                <User className="size-4" strokeWidth={1.5} />
              )}
              {t("sellerInfo")}
            </TabsTrigger>
          </TabsList>

        {/* INFO TAB */}
        <TabsContent value="info" className="mt-0">
          <MobileProductInfoTab
            title={product.title ?? ""}
            condition={product.condition}
            description={product.description}
            pickupOnly={product.pickup_only ?? false}
            specifications={viewModel.itemSpecifics.details || []}
            heroSpecs={viewModel.heroSpecs}
            reviews={reviews}
            rating={Number(product.rating ?? 0)}
            reviewCount={Number(product.review_count ?? 0)}
            productId={product.id}
            locale={locale}
            category={category}
            rootCategory={rootCategory}
            timeAgo={timeAgo}
            viewCount={viewCount}
            {...(submitReview && { submitReview })}
          />
        </TabsContent>

        {/* SELLER TAB */}
        <TabsContent value="seller" className="mt-0">
          <MobileProductSellerTab
            seller={sellerInfoForTab}
            relatedProducts={relatedProducts}
            locale={locale}
          />
        </TabsContent>
      </Tabs>

      {/* ========== BOTTOM BAR ========== */}
      <MobileBottomBarV2
        categoryType={viewModel.categoryType}
        activeTab={activeTab}
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
          displayName: sellerInfoForTab.name,
        }}
      />
    </PageShell>
  );
}
