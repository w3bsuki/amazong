"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";

interface SellerProductItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  sellerName: string;
  sellerVerified: boolean;
  sellerAvatarUrl: string;
  condition: string;
  freeShipping: boolean;
  categorySlug: string;
  attributes: Record<string, string>;
}

interface SellerProductsGridProps {
  products: SellerProductItem[];
  totalCount?: number;
}

export function SellerProductsGrid({ products, totalCount = 519 }: SellerProductsGridProps) {
  return (
    <div className="mt-6 rounded-xl bg-muted/40 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">More from this seller</h3>
        <Button variant="link" className="text-primary font-medium hover:underline h-auto p-0">See all ({totalCount})</Button>
      </div>
      <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 snap-x lg:grid lg:grid-cols-5 lg:gap-4 lg:pb-0 lg:mx-0 lg:px-0 no-scrollbar">
        {products.map((product) => (
          <div key={product.id} className="min-w-[160px] lg:min-w-0 h-full bg-background rounded-lg overflow-hidden snap-start border border-border lg:border-none">
            <ProductCard
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              originalPrice={product.originalPrice}
              rating={product.rating}
              reviews={product.reviews}
              sellerName={product.sellerName}
              sellerVerified={product.sellerVerified}
              sellerAvatarUrl={product.sellerAvatarUrl}
              condition="New"
              freeShipping={product.freeShipping}
              categorySlug={product.categorySlug}
              attributes={product.attributes}
              variant="ultimate"
              showQuickAdd={false}
              showSeller={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
