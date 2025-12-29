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

// Mobile-specific imports
import { MobileProductPage } from "@/components/mobile/product/mobile-product-page";

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
            username: seller?.username,
          }}
        />

        <div className="container px-8 py-10">
          <div className="grid grid-cols-12 gap-12 items-start">
            {/* Left column - Gallery & Details */}
            <div className="col-span-7 flex flex-col gap-6">
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

            {/* Right column - Buy Box & Seller */}
            <div className="col-span-5">
              <div className="sticky top-24 flex flex-col gap-6">
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
            />
          </div>
        </div>
      </div>
    </>
  );
}
