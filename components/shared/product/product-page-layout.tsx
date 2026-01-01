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

import type { ProductPageViewModel } from "@/lib/view-models/product-page";
import type { Database } from "@/types/database.types";
import type { CustomerReview } from "@/components/shared/product/customer-reviews-hybrid";
import type { SubmitReviewFn } from "@/components/shared/product/write-review-dialog";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type SellerStatsRow = Database["public"]["Tables"]["seller_stats"]["Row"];

type ProductWithSellerStats = ProductRow & { seller_stats?: SellerStatsRow | null };

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

        <div className="container px-8 py-10">
          <div className="grid grid-cols-12 gap-12 items-start">
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
                  product={{
                    name: product.title,
                    price: {
                      sale: Number(product.price ?? 0),
                      regular: product.list_price != null
                        ? Number(product.list_price)
                        : Number(product.price ?? 0),
                      currency: locale === "bg" ? "BGN" : "EUR",
                    },
                    store: storeForBuyBox,
                    images: viewModel.galleryImages.map((img) => ({ src: img.src, alt: img.alt })),
                    shipping: {
                      text: product.free_shipping ? "Free shipping" : "Shipping calculated at checkout",
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
                />

                <TrustBadges locale={locale} verifiedSeller={viewModel.sellerVerified} />
              </div>
            </div>
          </div>

          {/* More from Seller */}
          <SellerProductsGrid
            products={relatedProducts}
            sellerUsername={username}
          />

          {/* Reviews */}
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
        </div>
      </div>
    </>
  );
}
