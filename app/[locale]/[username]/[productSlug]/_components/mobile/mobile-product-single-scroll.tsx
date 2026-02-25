"use client"


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
import { Clock, MapPin } from "lucide-react";
import { useRouter } from "@/i18n/routing";

// Mobile-specific components
import { MobileGallery } from "./mobile-gallery";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { MobileSellerPreviewCard } from "./mobile-seller-preview-card";
import { MobileSafetyTips, MobileReportButton } from "./mobile-trust-sections";
import { SellerProfileDrawer } from "./seller-profile-drawer";

// Shared product components
import { VisualDrawerSurface } from "@/components/shared/visual-drawer-surface";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MetaRow, type CategorySummary } from "../pdp/meta-row";
import { ProductHeader } from "../pdp/product-header";
import { SpecificationsList } from "../pdp/specifications-list";
import { ProductDescription } from "../pdp/product-description";
import { DeliveryOptions } from "../pdp/delivery-options";
import { ShippingReturnsInfo } from "../pdp/shipping-returns-info";
import { SimilarItemsGrid } from "../pdp/similar-items-grid";
import { RecentlyViewedTracker } from "../pdp/recently-viewed-tracker";
import { PageShell } from "../../../../_components/page-shell";
import { HeroSpecs } from "../pdp/hero-specs";
import { CustomerReviewsHybrid } from "../pdp/customer-reviews-hybrid";

import type { ProductPageViewModel } from "@/lib/view-models/product-page";
import type { ProductPageProduct, ProductPageVariant } from "@/lib/data/product-page";
import type { CustomerReview } from "../pdp/customer-reviews-hybrid";
import type { SubmitReviewFn } from "../pdp/write-review-dialog";

type ProductWithSellerStats = ProductPageProduct & {
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
  variants?: ProductPageVariant[];
  submitReview?: SubmitReviewFn;
  favoritesCount?: number | null;
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function MobileProductSingleScroll(props: MobileProductSingleScrollProps) {
  const t = useTranslations("Product");
  const currentLocale = useLocale();
  const router = useRouter();
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
  const displayCurrency = "EUR";

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
    bio: null as string | null, // NOTE (BACKLOG-007): Add seller bio when available.
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

  const pickupOnly = product.pickup_only ?? false;
  const freeShipping = product.free_shipping === true;
  const isNegotiable = Boolean(product.is_negotiable);

  const handleMobileSellerChat = () => {
    if (!seller?.id) return;
    const params = new URLSearchParams({ seller: seller.id });
    if (product.id) params.set("product", String(product.id));
    router.push(`/chat?${params.toString()}`);
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
      <MobileGallery images={viewModel.galleryImages} product={cartProduct} />

      {/* ========== CONTENT (Single Scroll) ========== */}
      <VisualDrawerSurface>
        <div className="space-y-4 px-inset pb-4">
          {/* Meta Row: Category + Time/Views */}
          <MetaRow
            category={category}
            rootCategory={rootCategory}
            timeAgo={timeAgo}
            viewCount={viewCount}
            locale={currentLocale}
          />

          {/* Price + Title + Location (always visible) */}
          <div className="space-y-2">
            <ProductHeader
              title={product.title ?? ""}
              condition={product.condition}
              freeShipping={freeShipping}
              price={displayPrice}
              currency={displayCurrency}
              isNegotiable={isNegotiable}
              locale={currentLocale}
            />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                {product.seller_city ?? t("locationTBA")}
              </span>
              {timeAgo ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                  {timeAgo}
                </span>
              ) : null}
            </div>
          </div>

          {/* Hero Specs (top 4 always visible) */}
          {viewModel.heroSpecs.length > 0 && (
            <HeroSpecs specs={viewModel.heroSpecs.slice(0, 4)} variant="mobile" />
          )}
        </div>

        {/* Expandable sections */}
        <Accordion type="multiple" className="px-inset">
          <AccordionItem value="specs">
            <AccordionTrigger className="min-h-(--control-primary)">{t("fullSpecifications")}</AccordionTrigger>
            <AccordionContent>
              <SpecificationsList specifications={viewModel.itemSpecifics.details || []} />
            </AccordionContent>
          </AccordionItem>

          {product.description ? (
            <AccordionItem value="description">
              <AccordionTrigger className="min-h-(--control-primary)">{t("description")}</AccordionTrigger>
              <AccordionContent>
                <ProductDescription description={product.description} />
              </AccordionContent>
            </AccordionItem>
          ) : null}

          <AccordionItem value="delivery">
            <AccordionTrigger className="min-h-(--control-primary)">{t("delivery")}</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <DeliveryOptions pickupOnly={pickupOnly} freeShipping={freeShipping} />
              <ShippingReturnsInfo pickupOnly={pickupOnly} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="seller">
            <AccordionTrigger className="min-h-(--control-primary)">{t("sellerInfo")}</AccordionTrigger>
            <AccordionContent>
              <MobileSellerPreviewCard
                seller={sellerPreview}
                onViewProfile={() => setSellerDrawerOpen(true)}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reviews">
            <AccordionTrigger className="min-h-(--control-primary)">
              {t("reviews", { count: Number(product.review_count ?? 0) })}
            </AccordionTrigger>
            <AccordionContent>
              <CustomerReviewsHybrid
                rating={Number(product.rating ?? 0)}
                reviewCount={Number(product.review_count ?? 0)}
                reviews={reviews}
                productId={product.id}
                productTitle={product.title ?? ""}
                locale={locale}
                {...(submitReview && { submitReview })}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-4 px-inset pt-4">
          <MobileSafetyTips />
          <MobileReportButton />
        </div>

        {/* Similar items rail */}
        <SimilarItemsGrid products={relatedProducts} rootCategory={rootCategory} />
      </VisualDrawerSurface>

      {/* ========== BOTTOM BAR ========== */}
      <MobileBottomBar
        categoryType={viewModel.categoryType}
        product={{
          id: cartProduct.id,
          title: cartProduct.title,
          price: displayPrice,
          originalPrice: displayRegularPrice,
          currency: displayCurrency,
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
        onChat={handleMobileSellerChat}
      />
    </PageShell>
  );
}
