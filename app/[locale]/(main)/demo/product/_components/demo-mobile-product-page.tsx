"use client";

import { useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { 
  Star, ShieldCheck, Truck, RotateCcw, ChevronRight,
  CheckCircle2, Store
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@/i18n/routing";

// Import demo components
import { DemoHeader } from "./demo-header";
import { DemoGalleryWithCounter } from "./demo-gallery-with-counter";
import { DemoUrgencyBanner } from "./demo-urgency-banner";
import { DemoVariantPills } from "./demo-variant-pills";
import { DemoStickyBarV2 } from "./demo-sticky-bar-v2";

interface DemoProduct {
  id: string;
  title: string;
  price: number;
  list_price?: number;
  condition?: string;
  description?: string;
  stock?: number;
  pickup_only?: boolean;
  rating?: number;
  review_count?: number;
  viewers_count?: number;
  sold_count?: number;
  slug?: string;
  seller_stats?: {
    average_rating?: number;
    positive_feedback_pct?: number;
    total_sales?: number;
    followers_count?: number;
  };
}

interface DemoSeller {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  verified?: boolean;
}

interface DemoImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface DemoVariant {
  id: string;
  name: string;
  price_adjustment: number;
  stock: number;
  is_default?: boolean;
}

interface DemoSpec {
  label: string;
  value: string;
}

interface DemoReview {
  id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count?: number;
}

interface DemoRelatedProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  username: string;
}

interface DemoMobileProductPageProps {
  product: DemoProduct;
  seller: DemoSeller;
  images: DemoImage[];
  variants?: DemoVariant[];
  specs?: DemoSpec[];
  reviews?: DemoReview[];
  relatedProducts?: DemoRelatedProduct[];
}

export function DemoMobileProductPage({
  product,
  seller,
  images,
  variants = [],
  specs = [],
  reviews = [],
  relatedProducts = [],
}: DemoMobileProductPageProps) {
  const locale = useLocale();
  const accordionRef = useRef<HTMLDivElement>(null);

  // Variant state
  const defaultVariantId = useMemo(() => {
    const defaultVariant = variants.find((v) => v.is_default) ?? variants[0];
    return defaultVariant?.id ?? null;
  }, [variants]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(defaultVariantId);
  const selectedVariant = useMemo(
    () => (selectedVariantId ? variants.find((v) => v.id === selectedVariantId) ?? null : null),
    [variants, selectedVariantId]
  );

  // Quantity state (NEW)
  const [quantity, setQuantity] = useState(1);

  // Derived data
  const basePrice = product.price;
  const displayPrice = variants.length > 0 ? basePrice + (selectedVariant?.price_adjustment ?? 0) : basePrice;
  const displayRegularPrice = product.list_price ?? null;
  const isOnSale = displayRegularPrice !== null && displayRegularPrice > displayPrice;

  // Stock
  const baseStock = product.stock ?? null;
  const stockQuantity = variants.length > 0 ? (selectedVariant?.stock ?? null) : baseStock;
  const stockStatus = stockQuantity === 0 ? "out_of_stock" : stockQuantity && stockQuantity <= 5 ? "low_stock" : "in_stock";
  const maxQuantity = stockQuantity ?? 10;

  // Seller info
  const sellerInfo = {
    name: seller.display_name || seller.username || "Seller",
    username: seller.username || "seller",
    avatarUrl: seller.avatar_url,
    rating: product.seller_stats?.average_rating ?? null,
    positivePercent: product.seller_stats?.positive_feedback_pct ?? null,
    verified: Boolean(seller.verified),
    followersCount: product.seller_stats?.followers_count ?? null,
  };

  const handleSeeAllSpecs = () => {
    accordionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Cart product for sticky bar
  const cartProduct = {
    id: product.id,
    title: product.title,
    image: images[0]?.src ?? "",
    slug: product.slug || product.id,
    username: seller.username || "seller",
  };

  return (
    <div className="min-h-screen bg-background pb-28 pt-14 lg:hidden">
      {/* Demo Header with back navigation */}
      <DemoHeader />

      {/* Gallery with image counter (IMPROVEMENT #1) */}
      <DemoGalleryWithCounter images={images} />

      {/* Product info section */}
      <section className="flex flex-col gap-2 px-3 pt-3">
        {/* Title */}
        <h1 className="text-base font-medium leading-snug text-foreground line-clamp-3">
          {product.title}
        </h1>

        {/* Price */}
        <MobilePriceBlock 
          salePrice={displayPrice} 
          regularPrice={displayRegularPrice} 
          currency="BGN" 
        />
      </section>

      {/* Badges - horizontally scrollable */}
      <MobileBadgesRow
        condition={product.condition ?? null}
        freeShipping={!product.pickup_only}
        stockQuantity={stockQuantity}
        stockStatus={stockStatus}
        isOnSale={isOnSale}
        locale={locale}
      />

      {/* Urgency banner - shows for ALL products with social proof (IMPROVEMENT #2) */}
      <div className="px-3">
        <DemoUrgencyBanner
          stockQuantity={stockQuantity}
          viewersCount={product.viewers_count ?? null}
          soldCount={product.sold_count ?? null}
          locale={locale}
        />
      </div>

      {/* Variant pills instead of dropdown (IMPROVEMENT #3) */}
      {variants.length > 0 && (
        <div className="px-3 pt-2">
          <DemoVariantPills
            variants={variants}
            selectedVariantId={selectedVariantId}
            onSelect={setSelectedVariantId}
            locale={locale}
          />
        </div>
      )}

      {/* Seller line with followers (IMPROVEMENT #4) */}
      <MobileSellerTrustLine
        sellerName={sellerInfo.name}
        sellerUsername={sellerInfo.username}
        sellerAvatarUrl={sellerInfo.avatarUrl ?? ""}
        rating={sellerInfo.rating}
        positivePercent={sellerInfo.positivePercent}
        isVerified={sellerInfo.verified}
        locale={locale}
      />

      {/* Quick specs */}
      {specs.length > 0 && (
        <div className="px-3 pt-2">
          <MobileQuickSpecs 
            attributes={specs} 
            onSeeAll={handleSeeAllSpecs} 
            locale={locale} 
          />
        </div>
      )}

      {/* Trust block */}
      <div className="border-t border-border mt-3 pt-2">
        <MobileTrustBlock 
          locale={locale} 
          verifiedSeller={sellerInfo.verified} 
          freeShipping={!product.pickup_only} 
        />
      </div>

      {/* Accordions */}
      <div ref={accordionRef} className="border-t border-border mt-2">
        <MobileAccordions
          description={product.description ?? ""}
          details={specs}
          shippingText={!product.pickup_only ? (locale === "bg" ? "Безплатна доставка" : "Free shipping") : ""}
        />
      </div>

      {/* Reviews summary */}
      {reviews.length > 0 && (
        <div className="px-3 mt-4">
          <DemoReviewsSummary
            rating={product.rating ?? 0}
            reviewCount={product.review_count ?? reviews.length}
            reviews={reviews}
            locale={locale}
          />
        </div>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="px-3 mt-4">
          <DemoRelatedProducts products={relatedProducts} locale={locale} />
        </div>
      )}

      {/* Sticky bar with quantity (IMPROVEMENT #5) */}
      <DemoStickyBarV2
        product={cartProduct}
        price={displayPrice}
        originalPrice={displayRegularPrice}
        currency="BGN"
        isOutOfStock={stockStatus === "out_of_stock"}
        quantity={quantity}
        maxQuantity={maxQuantity}
        onQuantityChange={setQuantity}
        {...(selectedVariant?.id && { variantId: selectedVariant.id })}
        {...(selectedVariant?.name && { variantName: selectedVariant.name })}
      />
    </div>
  );
}

// Simple reviews summary for demo
function DemoReviewsSummary({
  rating,
  reviewCount,
  reviews,
  locale,
}: {
  rating: number;
  reviewCount: number;
  reviews: DemoReview[];
  locale: string;
}) {
  const t = {
    reviews: locale === "bg" ? "Отзиви" : "Reviews",
    seeAll: locale === "bg" ? "Виж всички" : "See all",
  };

  return (
    <div className="border border-border rounded-md p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{t.reviews}</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>
      </div>
      <div className="space-y-2">
        {reviews.slice(0, 2).map((review) => (
          <div key={review.id} className="flex gap-2 text-xs">
            <div className="size-6 rounded-full bg-muted overflow-hidden shrink-0">
              {review.user_avatar && (
                <img src={review.user_avatar} alt="" className="size-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-medium truncate">{review.user_name}</span>
                <span className="text-muted-foreground">★ {review.rating}</span>
              </div>
              <p className="text-muted-foreground line-clamp-2 mt-0.5">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
      {reviewCount > 2 && (
        <button className="w-full mt-3 text-xs font-medium text-primary hover:underline">
          {t.seeAll} ({reviewCount})
        </button>
      )}
    </div>
  );
}

// Simple related products for demo
function DemoRelatedProducts({
  products,
  locale,
}: {
  products: DemoRelatedProduct[];
  locale: string;
}) {
  const t = {
    moreFromSeller: locale === "bg" ? "Още от продавача" : "More from seller",
  };

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">{t.moreFromSeller}</h3>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-3 px-3 snap-x pb-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="shrink-0 snap-start w-28 border border-border rounded-md overflow-hidden"
          >
            <div className="aspect-square bg-muted">
              <img src={p.image} alt={p.title} className="size-full object-cover" />
            </div>
            <div className="p-1.5">
              <p className="text-2xs line-clamp-2 leading-tight">{p.title}</p>
              <p className="text-xs font-bold mt-0.5">{p.price} лв.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Internal Components (defined inline to keep demo self-contained)
// ============================================================================

function MobilePriceBlock({
  salePrice,
  regularPrice,
  currency = "BGN",
}: {
  salePrice: number;
  regularPrice?: number | null;
  currency?: string;
}) {
  const locale = useLocale();
  const formatPrice = (p: number) =>
    new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(p);

  const isOnSale = regularPrice && regularPrice > salePrice;
  const discountPct = isOnSale ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-bold text-foreground">{formatPrice(salePrice)}</span>
      {isOnSale && (
        <>
          <span className="text-sm text-muted-foreground line-through">{formatPrice(regularPrice)}</span>
          <Badge variant="destructive" className="text-2xs px-1.5 py-0">-{discountPct}%</Badge>
        </>
      )}
    </div>
  );
}

function MobileBadgesRow({
  condition,
  freeShipping,
  stockQuantity,
  stockStatus,
  isOnSale,
  locale,
}: {
  condition: string | null;
  freeShipping: boolean;
  stockQuantity: number | null;
  stockStatus: string;
  isOnSale: boolean;
  locale: string;
}) {
  const t = {
    freeShipping: locale === "bg" ? "Безплатна доставка" : "Free shipping",
    inStock: locale === "bg" ? "В наличност" : "In stock",
  };

  return (
    <div className="flex gap-1.5 px-3 pt-2 overflow-x-auto scrollbar-hide">
      {condition && (
        <Badge variant="secondary" className="shrink-0 text-2xs">{condition}</Badge>
      )}
      {freeShipping && (
        <Badge variant="outline" className="shrink-0 text-2xs border-green-500/50 text-green-700 dark:text-green-400">
          <Truck className="size-3 mr-1" />
          {t.freeShipping}
        </Badge>
      )}
      {stockStatus === "in_stock" && (
        <Badge variant="outline" className="shrink-0 text-2xs border-green-500/50 text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-3 mr-1" />
          {t.inStock}
        </Badge>
      )}
    </div>
  );
}

function MobileSellerTrustLine({
  sellerName,
  sellerUsername,
  sellerAvatarUrl,
  rating,
  positivePercent,
  isVerified,
  locale,
}: {
  sellerName: string;
  sellerUsername: string;
  sellerAvatarUrl: string;
  rating: number | null;
  positivePercent: number | null;
  isVerified: boolean;
  locale: string;
}) {
  const t = {
    positive: locale === "bg" ? "положителни" : "positive",
    verified: locale === "bg" ? "Проверен" : "Verified",
  };

  return (
    <Link
      href={`/${sellerUsername}`}
      className="flex items-center gap-2.5 px-3 py-2.5 mt-2 border-y border-border bg-muted/30 active:bg-muted/50"
    >
      <Avatar className="size-9 border border-border">
        <AvatarImage src={sellerAvatarUrl} alt={sellerName} />
        <AvatarFallback><Store className="size-4" /></AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium truncate">{sellerName}</span>
          {isVerified && (
            <CheckCircle2 className="size-3.5 text-primary shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {rating && (
            <>
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </>
          )}
          {positivePercent && (
            <span>· {positivePercent}% {t.positive}</span>
          )}
        </div>
      </div>
      <ChevronRight className="size-5 text-muted-foreground shrink-0" />
    </Link>
  );
}

function MobileQuickSpecs({
  attributes,
  onSeeAll,
  locale,
}: {
  attributes: { label: string; value: string }[];
  onSeeAll?: () => void;
  locale: string;
}) {
  const t = {
    specs: locale === "bg" ? "Характеристики" : "Specifications",
    seeAll: locale === "bg" ? "Виж всички" : "See all",
  };

  const visibleSpecs = attributes.slice(0, 4);

  return (
    <div className="border border-border rounded-md p-2.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-foreground">{t.specs}</span>
        {attributes.length > 4 && onSeeAll && (
          <button onClick={onSeeAll} className="text-xs text-primary font-medium">
            {t.seeAll}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {visibleSpecs.map((spec) => (
          <div key={spec.label} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{spec.label}</span>
            <span className="font-medium text-foreground">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileTrustBlock({
  locale,
  verifiedSeller,
  freeShipping,
}: {
  locale: string;
  verifiedSeller: boolean;
  freeShipping: boolean;
}) {
  const t = {
    securePayment: locale === "bg" ? "Сигурно плащане" : "Secure payment",
    freeShipping: locale === "bg" ? "Безплатна доставка" : "Free shipping",
    easyReturns: locale === "bg" ? "Лесно връщане" : "Easy returns",
    verifiedSeller: locale === "bg" ? "Проверен продавач" : "Verified seller",
  };

  const trustItems = [
    { icon: ShieldCheck, label: t.securePayment, show: true },
    { icon: Truck, label: t.freeShipping, show: freeShipping },
    { icon: RotateCcw, label: t.easyReturns, show: true },
    { icon: CheckCircle2, label: t.verifiedSeller, show: verifiedSeller },
  ].filter((item) => item.show);

  return (
    <div className="flex justify-around py-2.5 px-3">
      {trustItems.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1">
          <item.icon className="size-5 text-muted-foreground" />
          <span className="text-2xs text-muted-foreground text-center leading-tight max-w-[70px]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function MobileAccordions({
  description,
  details,
  shippingText,
}: {
  description: string;
  details: { label: string; value: string }[];
  shippingText: string;
}) {
  const locale = useLocale();
  const t = {
    description: locale === "bg" ? "Описание" : "Description",
    specifications: locale === "bg" ? "Характеристики" : "Specifications",
    shipping: locale === "bg" ? "Доставка" : "Shipping",
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {description && (
        <AccordionItem value="description" className="border-b border-border px-3">
          <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
            {t.description}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-3 whitespace-pre-line">
            {description}
          </AccordionContent>
        </AccordionItem>
      )}
      {details.length > 0 && (
        <AccordionItem value="specs" className="border-b border-border px-3">
          <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
            {t.specifications}
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="space-y-1.5">
              {details.map((spec) => (
                <div key={spec.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
      {shippingText && (
        <AccordionItem value="shipping" className="border-b border-border px-3">
          <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
            {t.shipping}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-3">
            {shippingText}
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
