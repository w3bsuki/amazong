"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { 
  Star, ShieldCheck, Truck, RotateCcw, ChevronRight, Heart, 
  ShoppingCart, Users, Package, CheckCircle2, Clock, MapPin,
  MessageCircle, Store, ChevronDown, Minus, Plus, Share2, ArrowLeft,
  AlertTriangle, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";

// Types (same as V1)
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

interface DemoProductPageV2Props {
  product: DemoProduct;
  seller: DemoSeller;
  images: DemoImage[];
  variants?: DemoVariant[];
  specs?: DemoSpec[];
  reviews?: DemoReview[];
  relatedProducts?: DemoRelatedProduct[];
}

export function DemoProductPageV2({
  product,
  seller,
  images,
  variants = [],
  specs = [],
  reviews = [],
  relatedProducts = [],
}: DemoProductPageV2Props) {
  const locale = useLocale();
  const router = useRouter();

  // State
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.find((v) => v.is_default)?.id ?? variants[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Derived
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const currentPrice = product.price + (selectedVariant?.price_adjustment ?? 0);
  const currentStock = selectedVariant?.stock ?? product.stock ?? 0;
  const isOutOfStock = currentStock === 0;
  const maxQuantity = Math.min(currentStock, 10);

  // Carousel listener
  useMemo(() => {
    if (!carouselApi) return;
    carouselApi.on("select", () => {
      setCurrentImageIndex(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  return (
    <div className="min-h-screen bg-canvas-default pb-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-12 items-center justify-between bg-header-bg px-2 text-header-text shadow-sm backdrop-blur-md bg-opacity-95">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-header-text hover:bg-header-hover">
          <ArrowLeft className="size-6" />
        </Button>
        <span className="font-semibold text-sm opacity-90">Product Details</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-header-text hover:bg-header-hover">
            <Share2 className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-header-text hover:bg-header-hover relative">
            <ShoppingCart className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border border-header-bg" />
          </Button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="grid gap-3">
        
        {/* Gallery Section */}
        <section className="relative bg-surface-card">
          <Carousel setApi={setCarouselApi} className="w-full">
            <CarouselContent>
              {images.map((img, idx) => (
                <CarouselItem key={idx}>
                  <div className="aspect-[4/3] relative flex items-center justify-center bg-white">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      className="object-contain max-h-full w-auto"
                      priority={idx === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {/* Image Counter Badge */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-2xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        </section>

        {/* Product Info Section */}
        <section className="bg-surface-card px-4 py-3 space-y-3">
          {/* Brand / Condition */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-primary">{product.condition}</span>
            <span>•</span>
            <span>{specs.find(s => s.label === "Brand")?.value ?? "Generic"}</span>
          </div>

          {/* Title */}
          <h1 className="text-lg font-semibold leading-snug text-foreground">
            {product.title}
          </h1>

          {/* Price Block */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-price-sale">
              {new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(currentPrice)}
            </span>
            {product.list_price && product.list_price > currentPrice && (
              <>
                <span className="text-sm text-muted-foreground line-through decoration-1">
                  {new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(product.list_price)}
                </span>
                <Badge variant="destructive" className="h-5 px-1.5 text-2xs font-bold">
                  -{Math.round(((product.list_price - currentPrice) / product.list_price) * 100)}%
                </Badge>
              </>
            )}
          </div>

          {/* Urgency / Social Proof */}
          {(product.viewers_count || product.sold_count) && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md border border-border-subtle">
              {product.viewers_count && (
                <div className="flex items-center gap-1.5">
                  <Users className="size-3.5 text-orange-500" />
                  <span><strong className="text-foreground">{product.viewers_count}</strong> viewing</span>
                </div>
              )}
              {product.sold_count && (
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-green-600" />
                  <span><strong className="text-foreground">{product.sold_count}+</strong> sold</span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Variants Section */}
        {variants.length > 0 && (
          <section className="bg-surface-card px-4 py-3">
            <h3 className="text-sm font-medium mb-2">Select Option</h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => variant.stock > 0 && setSelectedVariantId(variant.id)}
                  disabled={variant.stock === 0}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-all",
                    selectedVariantId === variant.id
                      ? "border-primary bg-primary/5 text-primary font-medium ring-1 ring-primary"
                      : "border-border bg-background text-foreground hover:border-primary/50",
                    variant.stock === 0 && "opacity-50 cursor-not-allowed bg-muted decoration-slate-400"
                  )}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Seller Section */}
        <section className="bg-surface-card px-4 py-3">
          <Link href={`/${seller.username}`} className="flex items-center gap-3 group">
            <Avatar className="size-10 border border-border">
              <AvatarImage src={seller.avatar_url} />
              <AvatarFallback>{seller.display_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                  {seller.display_name}
                </span>
                {seller.verified && <CheckCircle2 className="size-3.5 text-blue-500 fill-blue-500/10" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-0.5 text-yellow-600">
                  <Star className="size-3 fill-current" />
                  <span className="font-medium">{product.seller_stats?.average_rating}</span>
                </div>
                <span>•</span>
                <span>{product.seller_stats?.followers_count} followers</span>
              </div>
            </div>
            <ChevronRight className="size-5 text-muted-foreground/50" />
          </Link>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border-subtle">
            <div className="flex flex-col items-center gap-1 text-center">
              <ShieldCheck className="size-5 text-muted-foreground" />
              <span className="text-2xs text-muted-foreground">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <Truck className="size-5 text-muted-foreground" />
              <span className="text-2xs text-muted-foreground">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <RotateCcw className="size-5 text-muted-foreground" />
              <span className="text-2xs text-muted-foreground">Easy Returns</span>
            </div>
          </div>
        </section>

        {/* Specs & Description */}
        <section className="bg-surface-card px-4 py-3">
          <h3 className="text-sm font-semibold mb-3">Specifications</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
            {specs.slice(0, 6).map((spec, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xs text-muted-foreground">{spec.label}</span>
                <span className="text-xs font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
          
          <Accordion type="single" collapsible className="w-full border-t border-border-subtle">
            <AccordionItem value="description" className="border-none">
              <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                Description
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {product.description}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Reviews Preview */}
        <section className="bg-surface-card px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Reviews ({product.review_count})</h3>
            <Button variant="link" className="h-auto p-0 text-xs">See All</Button>
          </div>
          <div className="space-y-3">
            {reviews.slice(0, 2).map((review) => (
              <div key={review.id} className="bg-muted/20 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={review.user_avatar} />
                      <AvatarFallback>{review.user_name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{review.user_name}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn("size-3", i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        <section className="bg-surface-card px-4 py-3 mb-4">
          <h3 className="text-sm font-semibold mb-3">More from this seller</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/demo/product2`} className="flex-none w-32 group">
                <div className="aspect-square rounded-md bg-muted mb-2 overflow-hidden border border-border-subtle">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    width={200} 
                    height={200} 
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <h4 className="text-xs font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                <span className="text-xs font-bold">{new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(item.price)}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-card border-t border-border-subtle p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <div className="flex items-center border border-border rounded-full h-11 bg-muted/10">
            <Button
              variant="ghost"
              size="icon"
              className="size-11 rounded-full hover:bg-muted/50"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isOutOfStock}
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-11 rounded-full hover:bg-muted/50"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity || isOutOfStock}
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <Button 
            className="flex-1 h-11 rounded-full text-base font-semibold shadow-md" 
            disabled={isOutOfStock}
            onClick={() => toast.success(`Added ${quantity} item(s) to cart`)}
          >
            {isOutOfStock ? "Out of Stock" : `Add to Cart • ${new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(currentPrice * quantity)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
