"use client";

// =============================================================================
// DEMO DESKTOP PRODUCT PAGE - StockX-inspired Premium Layout
// =============================================================================
// A world-class product page with:
// - Bold price hierarchy with semantic colors
// - StockX-style bidding UX with prominent Buy Now / Make Offer
// - Clean gallery with vertical thumbnails
// - Rich product details with proper visual weight
// - Trust signals that actually stand out
// =============================================================================

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  Truck,
  MessageCircle,
  CheckCircle2,
  Flag,
  ShieldCheck,
  Zap,
  TrendingUp,
  Eye,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// =============================================================================
// MOCK DATA
// =============================================================================

const DEMO_PRODUCT = {
  id: "demo-001",
  title: "iPhone 15 Pro Max 256GB",
  subtitle: "Natural Titanium · Unlocked · Excellent Condition",
  price: 1089.0,
  originalPrice: 1199.0,
  currency: "EUR",
  condition: "Like New",
  views: 847,
  favorites: 156,
  location: "Sofia, Bulgaria",
  postedAt: "2 hours ago",
  images: [
    { src: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=1200&fit=crop", alt: "iPhone front view" },
    { src: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1200&h=1200&fit=crop", alt: "iPhone back view" },
    { src: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=1200&h=1200&fit=crop", alt: "iPhone camera detail" },
    { src: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&h=1200&fit=crop", alt: "iPhone in hand" },
  ],
  seller: {
    name: "TechStore Pro",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 4.9,
    reviewCount: 342,
    isVerified: true,
    isPro: true,
    memberSince: "Jan 2021",
  },
  specs: [
    { label: "Brand", value: "Apple" },
    { label: "Model", value: "iPhone 15 Pro Max" },
    { label: "Storage", value: "256GB" },
    { label: "Color", value: "Natural Titanium" },
    { label: "Network", value: "Factory Unlocked" },
    { label: "Battery Health", value: "98%" },
    { label: "Screen", value: "Flawless" },
    { label: "Body", value: "Minimal wear" },
  ],
  description: `Premium iPhone 15 Pro Max in exceptional condition. Purchased in September 2024, used carefully with case and screen protector from day one.

What's included:
• Original packaging with all documentation
• Apple USB-C fast charger (20W)
• Nomad leather case (worth €60)
• Belkin tempered glass protector (installed)

This phone has been my daily driver for just 3 months. Battery health remains at 98%. Zero scratches on screen or body. AppleCare+ is active and transferable until December 2025.

Selling because I'm upgrading to the iPhone 16 Pro Max. Price is firm - this is the best deal you'll find for this condition.`,
  shipping: {
    free: true,
    method: "Express Delivery",
    estimatedDays: "1-2 business days",
    from: "Sofia, Bulgaria",
  },
  category: ["Electronics", "Phones & Tablets", "Apple", "iPhones"],
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DemoDesktopProductPage() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const product = DEMO_PRODUCT;

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCurrentImage(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const scrollTo = useCallback(
    (index: number) => carouselApi?.scrollTo(index),
    [carouselApi]
  );

  const nextImage = useCallback(() => {
    scrollTo(currentImage < product.images.length - 1 ? currentImage + 1 : 0);
  }, [currentImage, product.images.length, scrollTo]);

  const prevImage = useCallback(() => {
    scrollTo(currentImage > 0 ? currentImage - 1 : product.images.length - 1);
  }, [currentImage, product.images.length, scrollTo]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: product.currency,
      minimumFractionDigits: 0,
    }).format(price);

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-background hidden lg:block">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-screen-xl mx-auto px-8 h-14 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm">
            <button type="button" className="size-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ChevronLeft className="size-4" />
            </button>
            {product.category.map((cat, i) => (
              <span key={cat} className="flex items-center gap-2">
                {i > 0 && <span className="text-border">/</span>}
                <span className={i === product.category.length - 1 ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground cursor-pointer transition-colors"}>
                  {cat}
                </span>
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" className="size-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Share2 className="size-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setIsFavorited(!isFavorited)}
              className={cn(
                "size-9 flex items-center justify-center rounded-full transition-colors",
                isFavorited ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Heart className={cn("size-4", isFavorited && "fill-current")} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-10">
          
          {/* LEFT: Gallery */}
          <div className="col-span-7">
            <div className="flex gap-4">
              {/* Vertical Thumbnails */}
              <div className="flex flex-col gap-2 shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollTo(i)}
                    className={cn(
                      "relative size-16 rounded-lg overflow-hidden border-2 transition-all",
                      currentImage === i
                        ? "border-foreground ring-1 ring-foreground"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 relative">
                <div className="aspect-square rounded-xl border border-border bg-muted/30 overflow-hidden">
                  <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="w-full h-full">
                    <CarouselContent className="-ml-0 h-full">
                      {product.images.map((img, index) => (
                        <CarouselItem key={index} className="pl-0 h-full">
                          <div className="w-full h-full flex items-center justify-center p-8">
                            <Image
                              src={img.src}
                              alt={img.alt}
                              width={600}
                              height={600}
                              className="max-h-full max-w-full w-auto h-auto object-contain"
                              priority={index === 0}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>

                {/* Floating Nav */}
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-background shadow-md border border-border text-foreground hover:bg-muted transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="size-5" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-background shadow-md border border-border text-foreground hover:bg-muted transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="size-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info + Buy Box */}
          <div className="col-span-5">
            <div className="sticky top-20 space-y-6">
              
              {/* Title + Condition */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-condition-likenew-bg text-condition-likenew border-0 font-medium">
                    {product.condition}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Eye className="size-3 mr-1" />
                    {product.views} watching
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  {product.title}
                </h1>
                <p className="text-muted-foreground mt-1">{product.subtitle}</p>
              </div>

              {/* Price Box - StockX Style */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                {/* Last Sale Banner */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-shipping-free" strokeWidth={2} />
                    <span className="text-sm font-medium text-foreground">Last Sale</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{formatPrice(1150)}</span>
                </div>

                {/* Price Display */}
                <div className="text-center py-2">
                  <div className="text-sm text-muted-foreground mb-1">Buy Now for</div>
                  <div className="text-4xl font-bold text-foreground tracking-tight">
                    {formatPrice(product.price)}
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-sm font-semibold text-price-savings">
                        Save {discount}%
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    ≈ {Math.round(product.price * 1.96).toLocaleString()} лв.
                  </p>
                </div>

                {/* Dual CTA - StockX style */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" className="h-14 flex-col gap-0.5 font-normal">
                    <span className="text-xs text-muted-foreground">Make Offer</span>
                    <span className="font-semibold">Place Bid</span>
                  </Button>
                  <Button className="h-14 flex-col gap-0.5 font-normal bg-foreground hover:bg-foreground/90">
                    <span className="text-xs text-background/70">Buy Now</span>
                    <span className="font-semibold text-background">{formatPrice(product.price)}</span>
                  </Button>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Brand", value: "Apple" },
                  { label: "Storage", value: "256GB" },
                  { label: "Color", value: "Titanium" },
                  { label: "Battery", value: "98%" },
                ].map((spec) => (
                  <div key={spec.label} className="text-center p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-2xs text-muted-foreground uppercase tracking-wide">{spec.label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Trust Signals */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-shipping-free/5 border border-shipping-free/20">
                  <div className="size-9 rounded-full bg-shipping-free/10 flex items-center justify-center">
                    <Truck className="size-4 text-shipping-free" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Free Express Shipping</p>
                    <p className="text-xs text-muted-foreground">Arrives in {product.shipping.estimatedDays}</p>
                  </div>
                  <Zap className="size-4 text-shipping-free" strokeWidth={2} />
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="size-9 rounded-full bg-verified/10 flex items-center justify-center">
                    <ShieldCheck className="size-4 text-verified" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Buyer Protection</p>
                    <p className="text-xs text-muted-foreground">Full refund if not as described</p>
                  </div>
                </div>
              </div>

              {/* Seller */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                <div className="relative shrink-0">
                  <Avatar className="size-12 border-2 border-background shadow-sm">
                    <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                    <AvatarFallback>{product.seller.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {product.seller.isVerified && (
                    <div className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-verified flex items-center justify-center border-2 border-card">
                      <CheckCircle2 className="size-3 text-white" strokeWidth={2.5} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">{product.seller.name}</span>
                    {product.seller.isPro && (
                      <Badge className="bg-foreground text-background text-2xs px-1.5">PRO</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5 fill-rating text-rating" />
                      <span className="text-sm font-medium text-foreground">{product.seller.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({product.seller.reviewCount} reviews)</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="shrink-0">
                  <MessageCircle className="size-4 mr-1.5" strokeWidth={1.5} />
                  Message
                </Button>
              </div>

              {/* Meta Footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {product.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  Posted {product.postedAt}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12 max-w-4xl">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start gap-0 h-auto p-0 bg-transparent border-b border-border rounded-none">
              <TabsTrigger 
                value="description" 
                className="px-6 py-4 text-base font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specs" 
                className="px-6 py-4 text-base font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="shipping" 
                className="px-6 py-4 text-base font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>
            
            <div className="py-6">
              <TabsContent value="description" className="mt-0">
                <div className="prose prose-neutral max-w-none">
                  <div className="text-base text-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="mt-0">
                <div className="grid grid-cols-2 gap-x-12 gap-y-0">
                  {product.specs.map((spec, i) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between py-4 border-b border-border"
                    >
                      <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                      <dd className="text-sm font-medium text-foreground">{spec.value}</dd>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="mt-0 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-full bg-shipping-free/10 flex items-center justify-center">
                        <Package className="size-5 text-shipping-free" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-semibold text-foreground">Shipping</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.shipping.free ? "Free express shipping included." : product.shipping.method} 
                      Estimated delivery: {product.shipping.estimatedDays}. Ships from {product.shipping.from}.
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-full bg-verified/10 flex items-center justify-center">
                        <ShieldCheck className="size-5 text-verified" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-semibold text-foreground">Buyer Protection</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Full refund if item doesn&apos;t arrive or isn&apos;t as described. 
                      Our team reviews every claim within 24 hours.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Report */}
          <div className="flex justify-start pt-4 border-t border-border">
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Flag className="size-4" strokeWidth={1.5} />
              Report this listing
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
