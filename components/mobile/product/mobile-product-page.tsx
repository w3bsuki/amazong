"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileGalleryOlx } from "./mobile-gallery-olx";
import { MobileProductHeader } from "./mobile-product-header";
import { MobilePriceLocationBlock } from "./mobile-price-location-block";
import { MobileUrgencyBanner } from "./mobile-urgency-banner";
import { MobileTrustBlock } from "./mobile-trust-block";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { MobileBuyerProtectionBadge } from "./mobile-buyer-protection-badge";
import { MobileSellerCard } from "./mobile-seller-card";
import { MobileDetailsSection } from "./mobile-details-section";
import { MobileDescriptionSection } from "./mobile-description-section";
import { MobileAccordions } from "@/components/shared/product/mobile-accordions";
import { SellerProductsGrid } from "@/components/shared/product/seller-products-grid";
import { CustomerReviewsHybrid } from "@/components/shared/product/customer-reviews-hybrid";
import { RecentlyViewedTracker } from "@/components/shared/product/recently-viewed-tracker";
import { CategoryBadge } from "@/components/shared/product/category-badge";
import { useWishlist } from "@/components/providers/wishlist-context";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}

export function MobileProductPage(props: MobileProductPageProps) {
  const t = useTranslations("Product");
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
  } = props;

  const accordionRef = useRef<HTMLDivElement>(null);

  const safeVariants = Array.isArray(variants) ? variants : [];
  const defaultVariantId = useMemo(() => {
    const defaultVariant = safeVariants.find((v) => v.is_default) ?? safeVariants[0];
    return defaultVariant?.id ?? null;
  }, [safeVariants]);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(defaultVariantId);

  const selectedVariant = useMemo(() => {
    if (!selectedVariantId) return null;
    return safeVariants.find((v) => v.id === selectedVariantId) ?? null;
  }, [safeVariants, selectedVariantId]);

  const primaryImageSrc = viewModel.galleryImages?.[0]?.src ?? null;

  // Wishlist integration
  const { isInWishlist, toggleWishlist } = useWishlist();
  const productInWishlist = isInWishlist(product.id);

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

  // Stock info
  const baseStockQuantity = product.stock ?? null;
  const stockQuantity = safeVariants.length > 0
    ? (selectedVariant?.stock ?? null)
    : baseStockQuantity;
  const stockStatus = stockQuantity === 0 
    ? "out_of_stock" 
    : (stockQuantity && stockQuantity <= 5) 
      ? "low_stock" 
      : "in_stock";

  const basePrice = Number(product.price ?? 0);
  const displayPrice = safeVariants.length > 0
    ? basePrice + Number(selectedVariant?.price_adjustment ?? 0)
    : basePrice;

  const displayRegularPrice = product.list_price != null ? Number(product.list_price) : null;

  return (
    <div className="min-h-screen bg-background pb-24 lg:hidden">
      {/* Mobile Product Header - Back, Seller Avatar, Search, Share, Wishlist, Cart */}
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
      
      {/* Gallery - Edge to Edge - OLX Style */}
      <div className="w-full">
        <MobileGalleryOlx images={viewModel.galleryImages} />
      </div>

      {/* Category Badge - FIRST after gallery for context */}
      {(category || rootCategory) && (
        <div className="px-4 pt-2">
          <CategoryBadge
            locale={locale}
            category={rootCategory || category}
            subcategory={category && rootCategory && category.slug !== rootCategory.slug ? category : null}
            size="sm"
          />
        </div>
      )}

      {/* Title + Heart Row (treido-mock style - same line) */}
      <div className="flex items-start justify-between gap-4 px-4 pt-3">
        <h1 className="text-base font-normal leading-snug text-foreground line-clamp-2 flex-1">
          {product.title}
        </h1>
        <button
          type="button"
          onClick={() => toggleWishlist(cartProduct)}
          aria-label={productInWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
          className="text-muted-foreground active:text-destructive pt-0.5"
        >
          <Heart 
            className={cn(
              "size-6",
              productInWishlist 
                ? "fill-destructive text-destructive" 
                : ""
            )} 
            strokeWidth={1.5} 
          />
        </button>
      </div>

      {/* Price + Location + Time Block */}
      <div className="px-4 pt-2">
        <MobilePriceLocationBlock
          price={displayPrice}
          currency="EUR"
          location={product.seller_city ?? null}
          createdAt={product.created_at ?? null}
        />
      </div>

      {/* Buyer Protection Badge - treido-mock style (no Card wrapper, edge-to-edge) */}
      <div className="mt-3">
        <MobileBuyerProtectionBadge />
      </div>

      {/* Seller Card - treido-mock style (no Card wrapper) */}
      <MobileSellerCard
          name={sellerInfo.name}
          username={sellerInfo.username}
          avatarUrl={sellerInfo.avatarUrl}
          rating={sellerInfo.rating}
          reviewCount={product.seller_stats?.total_reviews ?? null}
          isVerified={sellerInfo.verified}
        />

      {/* Urgency Banner (Conditional) */}
      <div className="mx-4">
        <MobileUrgencyBanner
          stockQuantity={stockQuantity}
          viewersCount={product.viewers_count ?? null}
          soldCount={product.sold_count ?? null}
          locale={locale}
        />
      </div>

      {/* Variant Selector (only when variants exist) */}
      {safeVariants.length > 0 ? (
        <div className="px-4 pt-2">
          <div className="text-xs font-medium text-muted-foreground mb-1">
            {t("variant")}
          </div>
          <Select
            value={selectedVariantId ?? undefined}
            onValueChange={(v) => setSelectedVariantId(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("selectVariant")} />
            </SelectTrigger>
            <SelectContent>
              {safeVariants.map((v) => (
                <SelectItem key={v.id} value={v.id} disabled={(v.stock ?? 0) <= 0}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {/* ===== BELOW THE FOLD ===== */}

      {/* Details Section - Clean key-value list (treido-mock style) */}
      {viewModel.itemSpecifics.details && viewModel.itemSpecifics.details.length > 0 && (
        <MobileDetailsSection
          details={viewModel.itemSpecifics.details}
        />
      )}

      {/* Description Section - Visible (not hidden in accordion) */}
      <MobileDescriptionSection
        description={product.description ?? null}
        maxLines={4}
      />

      {/* Shipping & Returns Accordion (for additional info) */}
      <div ref={accordionRef} className="border-t border-border mt-0">
        <MobileAccordions
          description={null}
          details={null}
          shippingText={!product.pickup_only ? t("freeDelivery") : t("defaultShipping")}
          returnsText={t("defaultReturns")}
        />
      </div>

      {/* Trust Block - After accordions */}
      <div className="border-t border-border/50">
        <MobileTrustBlock
          locale={locale}
          verifiedSeller={sellerInfo.verified}
          freeShipping={!product.pickup_only}
        />
      </div>

      {/* More from Seller - treido-mock style (handles its own padding) */}
      {relatedProducts.length > 0 && (
        <SellerProductsGrid
          products={relatedProducts}
          sellerUsername={username}
        />
      )}

      {/* Reviews */}
      <div className="px-4 pb-8">
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

      {/* Bottom Action Bar - OLX Style (Chat + Buy Now) */}
      <MobileBottomBar
        product={cartProduct}
        price={displayPrice}
        isOutOfStock={stockStatus === "out_of_stock"}
        sellerUsername={sellerInfo.username}
        {...(safeVariants.length > 0 && selectedVariant?.id ? { variantId: selectedVariant.id } : {})}
        {...(safeVariants.length > 0 && selectedVariant?.name ? { variantName: selectedVariant.name } : {})}
      />
    </div>
  );
}
