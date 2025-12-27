import { RecentlyViewedTracker } from "@/components/shared/product/recently-viewed-tracker";
import { ProductGalleryHybrid } from "@/components/shared/product/product-gallery-hybrid";
import { ProductBuyBox } from "@/components/shared/product/product-buy-box";
import { MobileStickyBar } from "@/components/shared/product/mobile-sticky-bar";
import { MobileAccordions } from "@/components/shared/product/mobile-accordions";
import { MobileSellerCard } from "@/components/shared/product/mobile-seller-card";
import { SellerProductsGrid } from "@/components/shared/product/seller-products-grid";
import { CustomerReviewsHybrid } from "@/components/shared/product/customer-reviews-hybrid";
import { ItemSpecifics } from "@/components/shared/product/item-specifics";

import { CategoryBadge } from "@/components/shared/product/category-badge";
import { SellerBanner } from "@/components/shared/product/seller-banner";
import { SellersNote } from "@/components/shared/product/sellers-note";
import { TrustBadges } from "@/components/shared/product/trust-badges";

import type { ProductPageViewModel } from "@/lib/view-models/product-page";

interface ProductPageLayoutProps {
  locale: string;
  username: string;
  productSlug: string;
  product: any;
  seller: any;
  category: any | null;
  parentCategory: any | null;
  rootCategory: any | null;
  relatedProducts: ProductPageViewModel["relatedProducts"];
  reviews: any[];
  viewModel: ProductPageViewModel;
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
  } = props;

  const primaryImageSrc = viewModel.galleryImages?.[0]?.src ?? null;

  const store = {
    name: viewModel.sellerName || seller?.username || username || "Seller",
    rating: product.seller_stats?.positive_feedback_pct != null
      ? `${Math.round(Number(product.seller_stats.positive_feedback_pct))}%`
      : "—",
    verified: Boolean(viewModel.sellerVerified),
    avatarUrl: viewModel.sellerAvatarUrl || undefined,
  };

  const storeForBuyBox = {
    name: store.name,
    rating: store.rating,
    verified: store.verified,
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">

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
          username: seller?.username,
        }}
      />

      <div className="container py-6 lg:py-10">
        <div className="mb-6">
          <SellerBanner
            locale={locale}
            seller={seller}
            stats={product.seller_stats ?? null}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
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
              condition={product.condition ?? null}
              categoryName={category?.name ?? null}
              parentCategoryName={parentCategory?.name ?? null}
            />

            {product.description ? (
              <SellersNote
                locale={locale}
                note={product.description}
              />
            ) : null}
          </div>

          {/* Right column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 flex flex-col gap-6">
              <ProductBuyBox
                product={{
                  name: product.title,
                  price: {
                    sale: Number(product.price ?? 0),
                    regular: product.list_price != null ? Number(product.list_price) : undefined,
                    currency: "BGN",
                  },
                  store: storeForBuyBox,
                  images: viewModel.galleryImages.map((img) => ({ src: img.src, alt: img.alt })),
                  shipping: {
                    text: product.free_shipping ? "Free shipping" : "Shipping calculated at checkout",
                    canShip: true,
                  },
                  returns: "30 days returns. Buyer pays for return shipping.",
                  description: product.description ?? undefined,
                  itemSpecifics: (
                    <ItemSpecifics
                      attributes={viewModel.itemSpecifics.attributes ?? null}
                      condition={product.condition ?? null}
                      categoryName={category?.name ?? null}
                      parentCategoryName={parentCategory?.name ?? null}
                    />
                  ),
                }}
              />

              <TrustBadges locale={locale} verifiedSeller={viewModel.sellerVerified} />

              <div className="lg:hidden">
                <MobileSellerCard
                  store={{
                    ...store,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-6">
          <MobileAccordions
            description={String(product.description ?? "")}
            details={viewModel.itemSpecifics.details}
            shippingText={product.free_shipping ? "Free shipping" : "Shipping calculated at checkout"}
            returnsText="30 days returns. Buyer pays for return shipping."
          />
        </div>

        <SellerProductsGrid
          products={relatedProducts}
          sellerUsername={username}
        />

        <CustomerReviewsHybrid
          rating={Number(product.rating ?? 0)}
          reviewCount={Number(product.review_count ?? 0)}
          reviews={reviews}
        />
      </div>

      <MobileStickyBar
        price={Number(product.price ?? 0)}
        currency="BGN"
        isFreeShipping={Boolean(product.free_shipping)}
      />
    </div>
  );
}
