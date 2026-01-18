"use client";

// =============================================================================
// DEMO DESKTOP PRODUCT PAGE - Pixel-Perfect Marketplace Design
// =============================================================================
// Design principles:
// - Clean grid layout with proper spacing tokens
// - shadcn/ui components for consistency
// - Semantic Tailwind v4 tokens (no arbitrary values)
// - High readability for specs, description, and buy box
// - Compact seller card with essential info only
// - No gradients, no heavy shadows - border separation only
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
  Copy,
  ShieldCheck,
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
import { Card, CardContent } from "@/components/ui/card";
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
// HELPER COMPONENTS
// =============================================================================

function IconButton({
  children,
  active,
  onClick,
  label,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "size-9 flex items-center justify-center rounded-md border transition-colors",
        active
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
      aria-label={label}
    >
      {children}
    </button>
  );
}

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
    <div className="min-h-screen bg-muted/30 hidden lg:block">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-14 flex items-center justify-between">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm">
              <button type="button" className="size-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <ChevronLeft className="size-4" strokeWidth={2} />
              </button>
              {product.category.map((cat, i) => (
                <span key={cat} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-muted-foreground/50">/</span>}
                  <span
                    className={cn(
                      "transition-colors",
                      i === product.category.length - 1
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground cursor-pointer"
                    )}
                  >
                    {cat}
                  </span>
                </span>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <IconButton label="Copy link">
                <Copy className="size-4" strokeWidth={1.5} />
              </IconButton>
              <IconButton label="Share">
                <Share2 className="size-4" strokeWidth={1.5} />
              </IconButton>
              <IconButton
                active={isFavorited}
                onClick={() => setIsFavorited(!isFavorited)}
                label={isFavorited ? "Remove from favorites" : "Save to favorites"}
              >
                <Heart className={cn("size-4", isFavorited && "fill-current")} strokeWidth={1.5} />
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTAINER ===== */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* ===== LEFT COLUMN: Gallery + Details ===== */}
          <div className="col-span-8 space-y-4">
            
            {/* Title Block */}
            <div>
              <h1 className="text-xl font-semibold text-foreground leading-snug">
                {product.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{product.subtitle}</p>
            </div>
            
            {/* Gallery Card */}
            <Card className="overflow-hidden">
              <div className="relative group">
                <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="w-full">
                  <CarouselContent className="-ml-0">
                    {product.images.map((img, index) => (
                      <CarouselItem key={index} className="pl-0">
                        <div className="aspect-[4/3] flex items-center justify-center p-8 bg-muted/30">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={800}
                            height={600}
                            className="max-h-full max-w-full w-auto h-auto object-contain"
                            priority={index === 0}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                {/* Condition Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="condition" className="text-xs">
                    {product.condition}
                  </Badge>
                </div>

                {/* Navigation */}
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-md bg-background/95 border border-border text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-5" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-md bg-background/95 border border-border text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-5" strokeWidth={1.5} />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-md bg-foreground/80 text-background text-xs font-medium">
                  {currentImage + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 p-3 border-t border-border bg-muted/20">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollTo(i)}
                    className={cn(
                      "relative size-16 rounded-md overflow-hidden transition-all border-2",
                      currentImage === i
                        ? "border-foreground"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Details Tabs */}
            <Card>
              <Tabs defaultValue="description" className="w-full">
                <div className="px-4 pt-3">
                  <TabsList className="inline-flex h-10 items-center justify-start gap-1 bg-muted/50 p-1 rounded-lg">
                    <TabsTrigger 
                      value="description" 
                      className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Description
                    </TabsTrigger>
                    <TabsTrigger 
                      value="specs" 
                      className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Specifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="shipping" 
                      className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Shipping
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <CardContent className="pt-6">
                  {/* Description Tab */}
                  <TabsContent value="description" className="mt-0 space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                        {product.description}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Specifications Tab */}
                  <TabsContent value="specs" className="mt-0">
                    <dl className="grid grid-cols-2 gap-x-8">
                      {product.specs.map((spec, i) => (
                        <div
                          key={spec.label}
                          className={cn(
                            "flex items-center justify-between py-3",
                            i < product.specs.length - 2 && "border-b border-border"
                          )}
                        >
                          <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                          <dd className="text-sm font-medium text-foreground">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </TabsContent>

                  {/* Shipping Tab */}
                  <TabsContent value="shipping" className="mt-0 space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="size-10 rounded-md bg-shipping-free/10 flex items-center justify-center shrink-0">
                        <Truck className="size-5 text-shipping-free" strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {product.shipping.free ? "Free Express Shipping" : product.shipping.method}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Estimated delivery: {product.shipping.estimatedDays}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ships from {product.shipping.from}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="size-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <ShieldCheck className="size-5 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">Buyer Protection</p>
                        <p className="text-sm text-muted-foreground">
                          Full refund if item is not as described or doesn&apos;t arrive
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            {/* Report Link */}
            <div className="flex items-center justify-center py-4">
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Flag className="size-4" strokeWidth={1.5} />
                Report this listing
              </button>
            </div>
          </div>

          {/* ===== RIGHT COLUMN: Buy Box + Seller ===== */}
          <div className="col-span-4">
            <div className="sticky top-20 space-y-3">
              
              {/* Buy Box Card */}
              <Card>
                <CardContent className="p-0">
                  
                  {/* Section 1: Price + Condition */}
                  <div className="p-5 pb-4">
                    {/* Price Row */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-foreground tracking-tight">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-lg text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    {/* Savings + Condition Row */}
                    <div className="flex items-center gap-2 mt-2">
                      {product.originalPrice > product.price && (
                        <span className="text-sm font-medium text-price-savings">
                          Save {formatPrice(product.originalPrice - product.price)} ({discount}% off)
                        </span>
                      )}
                      <Badge variant="condition" className="text-xs">
                        {product.condition}
                      </Badge>
                    </div>
                    
                    {/* Local Currency */}
                    <p className="text-xs text-muted-foreground mt-2">
                      ≈ {Math.round(product.price * 1.96).toLocaleString()} лв.
                    </p>
                  </div>

                  {/* Section 2: Key Specs - Horizontal */}
                  <div className="px-5 py-3 border-y border-border bg-muted/20">
                    <div className="flex items-center divide-x divide-border">
                      {product.specs.slice(0, 4).map((spec, i) => (
                        <div key={spec.label} className={cn("flex-1 text-center", i === 0 ? "pr-3" : "px-3")}>
                          <p className="text-xs text-muted-foreground">{spec.label}</p>
                          <p className="text-sm font-semibold text-foreground">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: CTAs */}
                  <div className="p-5 space-y-3">
                    <Button className="w-full h-12 text-base font-semibold" size="lg">
                      Buy Now
                    </Button>
                    <Button variant="outline" className="w-full h-11" size="default">
                      Make an Offer
                    </Button>
                  </div>

                  {/* Section 4: Trust Signals */}
                  <div className="px-5 pb-5 space-y-2">
                    {/* Free Shipping */}
                    {product.shipping.free && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-shipping-free/5 border border-shipping-free/20">
                        <Truck className="size-5 text-shipping-free shrink-0" strokeWidth={1.5} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">Free Express Shipping</p>
                          <p className="text-xs text-muted-foreground">Delivery in {product.shipping.estimatedDays}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Buyer Protection */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <ShieldCheck className="size-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                      <p className="text-sm text-muted-foreground">Buyer Protection · Full refund if not as described</p>
                    </div>
                  </div>

                  {/* Section 5: Location + Meta */}
                  <div className="px-5 py-3 border-t border-border bg-muted/10">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5" strokeWidth={1.5} />
                        {product.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" strokeWidth={1.5} />
                        {product.postedAt}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compact Seller Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <Avatar className="size-11 border border-border">
                        <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                        <AvatarFallback>{product.seller.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      {product.seller.isVerified && (
                        <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-verified flex items-center justify-center border-2 border-card">
                          <CheckCircle2 className="size-2.5 text-white" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm text-foreground truncate">{product.seller.name}</span>
                        {product.seller.isPro && (
                          <Badge variant="default" className="text-2xs px-1.5 py-0">PRO</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                        <Star className="size-3 fill-foreground text-foreground" />
                        <span className="font-medium text-foreground">{product.seller.rating}</span>
                        <span>· {product.seller.reviewCount} reviews</span>
                      </div>
                    </div>

                    {/* Message Button */}
                    <Button variant="outline" size="sm" className="shrink-0 h-9 px-3">
                      <MessageCircle className="size-4" strokeWidth={1.5} />
                      <span className="ml-1.5">Message</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
