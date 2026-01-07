import { Suspense } from "react";
import { RecentlyViewedTracker } from "@/components/shared/product/recently-viewed-tracker";
import { ProductGalleryHybrid } from "@/components/shared/product/product-gallery-hybrid";
import { ProductBuyBox } from "@/components/shared/product/product-buy-box";
import { SellerProductsGrid } from "@/components/shared/product/seller-products-grid";
import { CustomerReviewsHybrid } from "@/components/shared/product/customer-reviews-hybrid";
import { ItemSpecifics } from "@/components/shared/product/item-specifics";

import { CategoryBadge } from "@/components/shared/product/category-badge";
import { SellerBanner } from "@/components/shared/product/seller-banner";
import { SellersNote } from "@/components/shared/product/sellers-note";
import { TrustBadges } from "@/components/shared/product/trust-badges";
import { Skeleton } from "@/components/ui/skeleton";

import type { ProductPageViewModel } from "@/lib/view-models/product-page";
import type { Database } from "@/lib/supabase/database.types";
import type { CustomerReview } from "@/components/shared/product/customer-reviews-hybrid";
import type { SubmitReviewFn } from "@/components/shared/product/write-review-dialog";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type SellerStatsRow = Database["public"]["Tables"]["seller_stats"]["Row"];
type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"];

type ProductWithSellerStats = ProductRow & { seller_stats?: Partial<SellerStatsRow> | null };

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

// Mobile-specific imports
import { MobileProductPage } from "@/components/mobile/product/mobile-product-page";

// Loading skeletons for Suspense boundaries
function RelatedProductsSkeleton() {
  return (
    <div className="mt-10 space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-3">
            <Skeleton className="aspect-square w-full rounded-lg mb-3" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="pb-8">
      <div className="rounded-md bg-muted/20 p-4 border border-border/50">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-md border border-border/50 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductPageLayoutProps {
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

export function ProductPageLayout(props: ProductPageLayoutProps) {
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

  const primaryImageSrc = viewModel.galleryImages?.[0]?.src ?? null;

  const storeForBuyBox = {
    name: viewModel.sellerName || seller?.username || username || "Seller",
    rating: product.seller_stats?.positive_feedback_pct != null
      ? `${Math.round(Number(product.seller_stats.positive_feedback_pct))}%`
      : "—",
    verified: Boolean(viewModel.sellerVerified),
  };

  return (
    <>
      {/* ===== MOBILE PRODUCT PAGE ===== */}
      <MobileProductPage
        locale={locale}
        username={username}
        productSlug={productSlug}
        product={product}
        seller={seller}
        category={category}
        parentCategory={parentCategory}
        rootCategory={rootCategory}
        relatedProducts={relatedProducts}
        reviews={reviews}
        viewModel={viewModel}
        variants={variants ?? []}
        {...(submitReview && { submitReview })}
      />

      {/* ===== DESKTOP PRODUCT PAGE ===== */}
      <div className="hidden lg:block min-h-screen bg-background pb-10">
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(viewModel.jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(viewModel.breadcrumbJsonLd) }}
        />

        {/* Track this product as recently viewed */}
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

        <div className="container px-6 py-8">
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Left column - Gallery & Details */}
            <div className="col-span-7 flex flex-col gap-3">
              <ProductGalleryHybrid images={viewModel.galleryImages} />

              <div className="flex items-center gap-3">
                <CategoryBadge
                  locale={locale}
                  category={rootCategory}
                  subcategory={category}
                />
              </div>

              <ItemSpecifics
                attributes={viewModel.itemSpecifics.attributes ?? null}
                condition={product.condition ?? ""}
                categoryName={category?.name ?? ""}
                parentCategoryName={parentCategory?.name ?? ""}
              />

              {product.description ? (
                <SellersNote
                  locale={locale}
                  note={product.description}
                />
              ) : null}
            </div>

            {/* Right column - Buy Box & Seller */}
            <div className="col-span-5">
              <div className="sticky top-24 flex flex-col gap-3">
                <SellerBanner
                  locale={locale}
                  seller={seller}
                  stats={product.seller_stats ?? null}
                />

                <ProductBuyBox
                  productId={product.id}
                  productSlug={productSlug}
                  sellerUsername={username}
                  product={{
                    name: product.title,
                    price: {
                      sale: Number(product.price ?? 0),
                      regular: product.list_price != null
                        ? Number(product.list_price)
                        : Number(product.price ?? 0),
                      currency: "EUR",
                    },
                    store: storeForBuyBox,
                    images: viewModel.galleryImages.map((img) => ({ src: img.src, alt: img.alt })),
                    shipping: {
                      text: !product.pickup_only ? "Free shipping" : "Shipping calculated at checkout",
                      canShip: true,
                    },
                    returns: "30 days returns. Buyer pays for return shipping.",
                    ...(product.description ? { description: product.description } : {}),
                    itemSpecifics: (
                      <ItemSpecifics
                        attributes={viewModel.itemSpecifics.attributes ?? null}
                        condition={product.condition ?? ""}
                        categoryName={category?.name ?? ""}
                        parentCategoryName={parentCategory?.name ?? ""}
                      />
                    ),
                  }}
                  variants={variants ?? []}
                />

                <TrustBadges locale={locale} verifiedSeller={viewModel.sellerVerified} />
              </div>
            </div>
          </div>

          {/* More from Seller - Wrapped in Suspense for streaming */}
          <Suspense fallback={<RelatedProductsSkeleton />}>
            <SellerProductsGrid
              products={relatedProducts}
              sellerUsername={username}
            />
          </Suspense>

          {/* Reviews - Wrapped in Suspense for streaming */}
          <Suspense fallback={<ReviewsSkeleton />}>
            <div className="pb-8">
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
          </Suspense>
        </div>
      </div>
    </>
  );
}
