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
    <div className="min-h-screen bg-white pb-20 font-sans text-[#191919]">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        
        {/* 2-Column Layout (eBay Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
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
                      "relative size-16 rounded-lg border overflow-hidden bg-gray-50 transition-none",
                      selectedImage === idx 
                        ? "border-blue-600 ring-1 ring-blue-600" 
                        : "border-gray-200 hover:border-gray-400"
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
              <div className="flex-1 relative bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.is_boosted && (
                    <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-sm shadow-sm">
                      13 Sold in last 24 hours
                    </Badge>
                  )}
                </div>

                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Button variant="secondary" size="icon" className="rounded-full bg-white/90 hover:bg-white shadow-sm border border-gray-200 h-10 w-10 transition-none">
                    <Share2 className="h-5 w-5 text-gray-700" />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full bg-white/90 hover:bg-white shadow-sm border border-gray-200 h-10 w-10 transition-none">
                    <Heart className="h-5 w-5 text-gray-700" />
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
                  <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 shadow-md bg-white/90" onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 shadow-md bg-white/90" onClick={() => setSelectedImage(prev => Math.min(images.length - 1, prev + 1))}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details & Buy Box (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6">
            
            {/* 1. Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-[#191919] leading-tight">
              {product.title}
            </h1>

            {/* 2. Seller Info (eBay style placement) */}
            {seller && (
              <div className="flex items-center gap-3 py-1">
                <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200">
                  {seller.avatar_url ? (
                    <Image src={seller.avatar_url} alt={seller.display_name} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-sm">
                      {seller.display_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Link href={`/store/${seller.id}`} className="font-bold text-[#191919] underline decoration-1 underline-offset-2 hover:text-blue-700">
                      {seller.display_name}
                    </Link>
                    <span className="text-gray-500 text-sm">({seller.feedback_score || 24785})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">{seller.feedback_percentage || 98.6}% positive</span>
                    <span className="text-gray-300">|</span>
                    <Link href="#" className="text-blue-700 hover:underline">Seller's other items</Link>
                    <span className="text-gray-300">|</span>
                    <Link href="#" className="text-blue-700 hover:underline">Contact seller</Link>
                  </div>
                </div>
              </div>
            )}

            <Separator className="bg-gray-200" />

            {/* 3. Price Section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#191919]">
                  BGN {product.price.toFixed(2)}
                </span>
              </div>
              
              {product.original_price && product.original_price > product.price && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">List price:</span>
                  <span className="text-gray-500 line-through">BGN {product.original_price.toFixed(2)}</span>
                  <span className="text-gray-500">({discountPercentage}% off)</span>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>

            {/* 4. Condition & Quantity */}
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-sm text-gray-600">Condition:</span>
                <div className="font-medium text-[#191919]">New with tags</div>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-sm text-gray-600">Quantity:</span>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number" 
                    defaultValue="1" 
                    min="1" 
                    className="w-20 h-9 border-gray-300 focus:border-blue-600 focus:ring-0" 
                  />
                  {product.watch_count && product.watch_count > 10 && (
                    <span className="text-sm text-red-700 font-medium">
                      {product.watch_count.toLocaleString()} sold
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 5. Action Buttons (eBay Style) */}
            <div className="space-y-3 pt-2">
              <Button className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-sm transition-none">
                Buy It Now
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-lg border-2 transition-none">
                Add to cart
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-lg border-2 transition-none flex items-center gap-2">
                <Heart className="h-5 w-5" /> Add to Watchlist
              </Button>
            </div>

            {/* 6. Social Proof / Trending Box */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-gray-900 fill-gray-900 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900">This one's trending.</span>
                  <span className="text-gray-600 ml-1">1,204 have already sold.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-gray-900 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900">People want this.</span>
                  <span className="text-gray-600 ml-1">542 people are watching this.</span>
                </div>
              </div>
            </div>

            {/* 7. Shipping / Returns / Payments Info */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                <div className="text-gray-600">Shipping:</div>
                <div>
                  <div className="font-bold text-[#191919]">Free Shipping</div>
                  <div className="text-gray-600">Located in: Sofia, Bulgaria</div>
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                <div className="text-gray-600">Delivery:</div>
                <div>
                  <span className="text-gray-600">Estimated between </span>
                  <span className="font-bold text-[#191919]">{deliveryDateString}</span>
                  <span className="text-gray-600"> and </span>
                  <span className="font-bold text-[#191919]">Fri, Jan 5</span>
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                <div className="text-gray-600">Returns:</div>
                <div>
                  <span className="text-[#191919]">30 days returns.</span>
                  <span className="text-gray-600"> Seller pays for return shipping. </span>
                  <Link href="#" className="text-blue-700 hover:underline">See details</Link>
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-center">
                <div className="text-gray-600">Payments:</div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"><span className="text-[10px] font-bold italic text-blue-800">Visa</span></div>
                  <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"><span className="text-[10px] font-bold text-red-600">MC</span></div>
                  <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"><span className="text-[10px] font-bold text-blue-500">Amex</span></div>
                  <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"><span className="text-[10px] font-bold text-blue-600">Pay</span></div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* 8. Shop with Confidence */}
            <div className="space-y-3">
              <h3 className="font-bold text-[#191919]">Shop with confidence</h3>
              <div className="flex gap-3">
                <ShieldCheck className="h-6 w-6 text-gray-900 shrink-0" />
                <div>
                  <div className="font-medium text-[#191919]">eBay Money Back Guarantee</div>
                  <div className="text-sm text-gray-600">Get the item you ordered or your money back. <Link href="#" className="text-blue-700 hover:underline">Learn more</Link></div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Lower Section: Description (Full Width) */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <h2 className="text-xl font-bold text-[#191919] mb-6">Item description from the seller</h2>
              <div className="prose max-w-none text-[#191919] bg-gray-50 p-8 rounded-xl border border-gray-100">
                <p className="whitespace-pre-line leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>
            </div>
            <div className="lg:col-span-4">
              {/* Sidebar for description (optional, maybe similar items) */}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
