"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Store, 
  ChevronRight, 
  ChevronLeft,
  Star,
  Check,
  Info,
  CreditCard,
  Zap,
  Eye
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface ProductPageProps {
  product: {
    id: string
    title: string
    description: string | null
    price: number
    original_price?: number | null
    images: string[]
    rating: number
    reviews_count: number
    tags?: string[]
    is_boosted?: boolean
    seller_id?: string
    slug?: string
    watch_count?: number
    attributes?: Record<string, any> | null
  }
  seller: {
    id: string
    username?: string
    display_name: string
    verified: boolean
    created_at: string
    avatar_url?: string | null
    feedback_percentage?: number | null
    total_sales?: number | null
    feedback_score?: number | null
    feedback_count?: number | null
  } | null
  locale: string
  t: any
}

export function ProductPageDesktopV2({
  product,
  seller,
  locale,
  t,
}: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const images = product.images?.length ? product.images : ["/placeholder.svg"]
  
  const discountPercentage = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  // Mock delivery date
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 3)
  const deliveryDateString = deliveryDate.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-background pb-20 font-sans text-foreground">
      <div className="container py-6">
        
        {/* Top Banner (Trust Blue) */}
        <div className="mb-6 flex items-center justify-between rounded-lg border border-cta-trust-blue/20 bg-cta-trust-blue/5 p-3 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Find similar items from</span>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-xs border border-border">
                {seller?.display_name.charAt(0)}
              </div>
              <span className="font-bold">{seller?.display_name}</span>
            </div>
            <div className="flex gap-1.5">
              {images.slice(0, 4).map((img, i) => (
                <div key={i} className="h-10 w-8 rounded border border-border bg-muted overflow-hidden">
                  <Image src={img} alt="" width={32} height={40} className="object-cover h-full w-full" />
                </div>
              ))}
            </div>
          </div>
          <Link href="#" className="font-bold text-cta-trust-blue hover:underline flex items-center gap-1">
            Shop store <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 2-Column Layout (eBay Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: Gallery (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="flex gap-4">
              {/* Vertical Thumbnails */}
              <div className="hidden lg:flex flex-col gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setSelectedImage(idx)}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "relative size-16 rounded-lg border overflow-hidden bg-muted/30 transition-none",
                      selectedImage === idx 
                        ? "border-primary" 
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`View ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image Container */}
              <div className="flex-1 relative bg-muted/10 rounded-xl border border-border overflow-hidden">
                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.is_boosted && (
                    <Badge className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-none px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-sm">
                      13 Sold in last 24 hours
                    </Badge>
                  )}
                </div>

                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Button variant="secondary" size="icon" className="rounded-full bg-background/90 hover:bg-background border border-border h-10 w-10 transition-none">
                    <Share2 className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full bg-background/90 hover:bg-background border border-border h-10 w-10 transition-none">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>

                {/* Main Image */}
                <div className="relative aspect-square w-full flex items-center justify-center">
                  <Image
                    src={images[selectedImage]}
                    alt={product.title}
                    fill
                    className="object-contain p-8"
                    priority
                  />
                </div>

                {/* Navigation Arrows (Mobile/Tablet) */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between lg:hidden">
                  <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 bg-background/90" onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 bg-background/90" onClick={() => setSelectedImage(prev => Math.min(images.length - 1, prev + 1))}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            </div>

          {/* RIGHT COLUMN: Details & Buy Box (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-6">
            <div className="flex flex-col h-full">
              <div className="space-y-4 flex-1">
                {/* 1. Title */}
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  {product.title}
                </h1>

            {/* 2. Seller Info (eBay style placement) */}
            {seller && (
              <div className="flex items-center gap-3 py-1">
                <div className="h-10 w-10 rounded-full bg-muted overflow-hidden relative border border-border">
                  {seller.avatar_url ? (
                    <Image src={seller.avatar_url} alt={seller.display_name} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground font-bold text-sm">
                      {seller.display_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Link href={`/store/${seller.id}`} className="font-bold text-foreground underline decoration-1 underline-offset-2 hover:text-primary">
                      {seller.display_name}
                    </Link>
                    <span className="text-muted-foreground text-sm">({seller.feedback_score || 24785})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{seller.feedback_percentage || 98.6}% positive feedback</span>
                    <span className="text-border">|</span>
                    <Link href={`/store/${seller.id}`} className="text-cta-trust-blue hover:underline flex items-center gap-1">
                      <Store className="h-3 w-3" /> Visit
                    </Link>
                    <span className="text-border">|</span>
                    <Link href="#" className="text-cta-trust-blue hover:underline">
                      <Share2 className="h-3 w-3 inline mr-1" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Price Section */}
            <div className="space-y-1 pt-2 border-t border-border">
              <div className="flex items-baseline gap-3">
                <span className="text-sm text-muted-foreground">Price:</span>
                <span className="text-3xl font-bold text-foreground">
                  {product.price.toFixed(2)} лв.
                </span>
              </div>
              
              {product.original_price && product.original_price > product.price && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">List price:</span>
                  <span className="text-muted-foreground line-through">BGN {product.original_price.toFixed(2)}</span>
                  <span className="text-muted-foreground">({discountPercentage}% off)</span>
                  <Info className="h-4 w-4 text-muted-foreground/50" />
                </div>
              )}
            </div>

            {/* 4. Condition & Quantity */}
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-sm text-muted-foreground">Condition:</span>
                <div className="font-medium text-foreground">New with tags</div>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-sm text-muted-foreground">Quantity:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-md overflow-hidden">
                    <button className="px-3 py-1 hover:bg-muted border-r border-border">-</button>
                    <input 
                      type="number" 
                      defaultValue="1" 
                      min="1" 
                      className="w-12 h-9 text-center focus:outline-none bg-transparent" 
                    />
                    <button className="px-3 py-1 hover:bg-muted border-l border-border">+</button>
                  </div>
                  <span className="text-sm text-success font-medium">In Stock</span>
                </div>
              </div>
            </div>

            {/* 5. Action Buttons (eBay Style) */}
            <div className="space-y-2 pt-1">
              <Button className="w-full h-12 rounded-full bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text font-bold text-lg transition-none">
                Buy It Now
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-full border-cta-trust-blue text-cta-trust-blue hover:bg-cta-trust-blue/5 font-bold text-lg border-2 transition-none">
                Add to cart
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-full border-border text-foreground hover:bg-muted font-bold text-lg border transition-none flex items-center gap-2">
                <Heart className="h-5 w-5" /> Add to Watchlist
              </Button>
            </div>

            </div>

            {/* 7. Shipping / Returns / Payments Info */}
            <div className="space-y-4 pt-4 border-t border-border mt-auto">
              <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                <div className="text-muted-foreground">Shipping:</div>
                <div>
                  <div className="font-bold text-foreground">Ships to Bulgaria <span className="font-normal text-cta-trust-blue hover:underline cursor-pointer ml-1">| See details</span></div>
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                <div className="text-muted-foreground">Returns:</div>
                <div>
                  <span className="text-foreground">30 days returns. Buyer pays for return shipping.</span>
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-center">
                <div className="text-muted-foreground">Payments:</div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-10 bg-muted/50 rounded border border-border flex items-center justify-center"></div>
                  <div className="h-6 w-10 bg-muted/50 rounded border border-border flex items-center justify-center"></div>
                  <div className="h-6 w-10 bg-muted/50 rounded border border-border flex items-center justify-center"></div>
                  <div className="h-6 w-10 bg-muted/50 rounded border border-border flex items-center justify-center"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Product Details Attributes (Below Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12">
          <div className="lg:col-span-7">
            <div className="space-y-6">
              <div className="border-b border-border pb-2">
                <h2 className="text-xl font-bold text-foreground">Product Details</h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">{product.title}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm">
                  {product.attributes && Object.entries(product.attributes).length > 0 ? (
                    Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24 shrink-0 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-foreground">: {String(value)}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24 shrink-0">Department</span>
                        <span className="font-medium text-foreground">: Accessories</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24 shrink-0">Category</span>
                        <span className="font-medium text-foreground">: Pocket Squares</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24 shrink-0">Condition</span>
                        <span className="font-medium text-foreground">: new</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24 shrink-0">Gender</span>
                        <span className="font-medium text-foreground">: Men</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24 shrink-0">Condition</span>
                        <span className="font-medium text-foreground">: new-with-tags</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lower Section: Description (Full Width) */}
        <div className="mt-16 border-t border-border pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <h2 className="text-xl font-bold text-foreground mb-6">Item description from the seller</h2>
              <div className="richtext max-w-none text-foreground bg-muted/10 p-8 rounded-xl border border-border">
                <p className="whitespace-pre-line leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
