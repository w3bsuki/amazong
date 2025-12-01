"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Heart,
  ShieldCheck,
  CaretLeft,
  CaretRight,
  ChatCircle,
  Storefront,
  CheckCircle,
  Package,
  Eye,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Demo product data matching eBay iPhone listing
const demoProduct = {
  id: "demo-1",
  title: "NEW SEALED APPLE IPHONE 11 64GB BLACK 4G UNLOCKED 6.1\" - 1 YEAR APPLE WARRANTY",
  price: 448.67,
  originalPrice: null,
  condition: "New",
  conditionDetails: "A brand-new, unused, unopened, undamaged item in its original packaging",
  soldCount: 1100,
  soldLast24h: 21,
  watchCount: 5,
  viewedRecently: 21,
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  specs: [
    { label: "Processor", value: "Dual Core" },
    { label: "Storage Capacity", value: "64 GB" },
    { label: "Screen Size", value: '6.1 in' },
    { label: "Lock Status", value: "Factory Unlocked" },
    { label: "Colour", value: "Black" },
    { label: "Network", value: "Unlocked" },
    { label: "Brand", value: "Apple" },
    { label: "Model", value: "Apple iPhone 11" },
  ],
  seller: {
    id: "itemsforlessuk",
    name: "itemsforlessuk",
    feedbackScore: 798,
    positiveFeedback: 100,
    itemsSold: 1100,
    memberSince: "Dec 2020",
    responseTime: 24,
    ratings: {
      accuracy: 5.0,
      shippingCost: 5.0,
      shippingSpeed: 5.0,
      communication: 5.0,
    },
    feedbackCount: 746,
  },
  shipping: {
    cost: 30.02,
    method: "International Priority Shipping",
    location: "London, United Kingdom",
    deliveryStart: "Fri, Dec 12",
    deliveryEnd: "Thu, Dec 18",
    importCharges: 105.21,
    returnsAccepted: false,
  },
  payments: ["paypal", "gpay", "visa", "mastercard", "diners"],
}

export default function DemoPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWatching, setIsWatching] = useState(false)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* eBay-style Seller Strip - Clean, minimal */}
        <div className="border-b border-border">
          <div className="container flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <Link href="#" className="font-medium text-primary hover:underline text-sm">
                {demoProduct.seller.name}
              </Link>
              <span className="text-sm text-muted-foreground">
                ({demoProduct.seller.feedbackScore})
              </span>
              <span className="text-sm text-primary">
                {demoProduct.seller.positiveFeedback}% positive
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href="#" className="text-primary hover:underline">
                Seller's other items
              </Link>
              <Link href="#" className="text-primary hover:underline">
                Contact seller
              </Link>
            </div>
          </div>
        </div>

        <div className="container py-6">
          {/* eBay 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            
            {/* LEFT COLUMN - Images & Details */}
            <div className="space-y-6">
              
              {/* Image Gallery */}
              <div className="flex gap-4">
                {/* Thumbnail Strip - Vertical */}
                <div className="hidden md:flex flex-col gap-2 w-16 shrink-0">
                  {demoProduct.images.slice(0, 6).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "w-16 h-16 rounded border-2 bg-muted/50 flex items-center justify-center text-xs text-muted-foreground hover:border-primary transition-colors",
                        selectedImage === index ? "border-primary" : "border-border"
                      )}
                    >
                      {index + 1}
                    </button>
                  ))}
                  {demoProduct.images.length > 6 && (
                    <button className="w-16 h-16 rounded border-2 border-border bg-muted/50 flex items-center justify-center text-xs text-muted-foreground hover:border-primary">
                      +{demoProduct.images.length - 6}
                    </button>
                  )}
                </div>

                {/* Main Image */}
                <div className="flex-1 relative">
                  {/* Viewed Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="secondary" className="bg-white/95 text-foreground shadow-sm font-normal text-xs px-2.5 py-1">
                      <Eye className="size-3.5 mr-1.5" />
                      {demoProduct.viewedRecently} VIEWED IN THE LAST 24 HOURS
                    </Badge>
                  </div>

                  {/* Watchlist Count - Top Right */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <button 
                      onClick={() => setIsWatching(!isWatching)}
                      className={cn(
                        "flex items-center gap-1.5 bg-white/95 rounded-full px-3 py-1.5 text-sm shadow-sm transition-colors",
                        isWatching ? "text-red-500" : "text-foreground hover:text-red-500"
                      )}
                    >
                      <span className="font-medium">{demoProduct.watchCount}</span>
                      <Heart weight={isWatching ? "fill" : "regular"} className="size-5" />
                    </button>
                  </div>

                  {/* Navigation Arrows */}
                  {demoProduct.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : demoProduct.images.length - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white/95 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <CaretLeft className="size-5" />
                      </button>
                      <button
                        onClick={() => setSelectedImage(prev => prev < demoProduct.images.length - 1 ? prev + 1 : 0)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white/95 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <CaretRight className="size-5" />
                      </button>
                    </>
                  )}

                  {/* Main Image Area */}
                  <div className="aspect-square rounded-lg bg-muted/30 border border-border overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Package className="size-20 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Picture {selectedImage + 1} of {demoProduct.images.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Image Counter */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2.5 py-1 rounded">
                    {selectedImage + 1} / {demoProduct.images.length}
                  </div>
                </div>
              </div>

              {/* Mobile Thumbnails */}
              <div className="flex md:hidden gap-2 overflow-x-auto pb-2">
                {demoProduct.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "shrink-0 size-16 rounded border-2 bg-muted/50 flex items-center justify-center text-xs text-muted-foreground",
                      selectedImage === index ? "border-primary" : "border-border"
                    )}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Shop with Confidence */}
              <Card className="border-border shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="size-8 text-primary shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Shop with confidence</h3>
                      <p className="text-sm text-muted-foreground">
                        eBay Money Back Guarantee. Get the item you ordered or your money back.{" "}
                        <Link href="#" className="text-primary hover:underline">Learn more</Link>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About this item */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">About this item</h2>
                <p className="text-sm text-muted-foreground">
                  Seller assumes all responsibility for this listing.
                </p>
                <p className="text-sm text-muted-foreground">
                  eBay item number: 306634392084
                </p>
              </div>

              {/* Item Specifics */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Item specifics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex gap-2 text-sm">
                    <span className="font-medium text-foreground w-32 shrink-0">Condition</span>
                    <span className="text-muted-foreground">{demoProduct.condition}</span>
                  </div>
                  {demoProduct.specs.map((spec) => (
                    <div key={spec.label} className="flex gap-2 text-sm">
                      <span className="font-medium text-foreground w-32 shrink-0">{spec.label}</span>
                      <span className="text-muted-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About This Seller - Full Card */}
              <Card className="border-border shadow-none">
                <CardContent className="p-5 space-y-5">
                  <h2 className="text-lg font-semibold">About this seller</h2>
                  
                  {/* Seller Header */}
                  <div className="flex items-start gap-4">
                    <Avatar className="size-14 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {demoProduct.seller.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Link href="#" className="text-lg font-semibold text-primary hover:underline">
                        {demoProduct.seller.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className="font-medium">{demoProduct.seller.positiveFeedback}% positive feedback</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{(demoProduct.seller.itemsSold / 1000).toFixed(1)}K items sold</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Joined {demoProduct.seller.memberSince}</span>
                        <span>Usually responds within {demoProduct.seller.responseTime} hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 h-10">
                      Seller's other items
                    </Button>
                    <Button variant="outline" className="flex-1 h-10">
                      Contact
                    </Button>
                  </div>

                  <Separator />

                  {/* Detailed Ratings */}
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Detailed seller ratings</h3>
                    <p className="text-xs text-muted-foreground mb-4">Average for the last 12 months</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Accurate description", value: demoProduct.seller.ratings.accuracy },
                        { label: "Reasonable shipping cost", value: demoProduct.seller.ratings.shippingCost },
                        { label: "Shipping speed", value: demoProduct.seller.ratings.shippingSpeed },
                        { label: "Communication", value: demoProduct.seller.ratings.communication },
                      ].map((rating) => (
                        <div key={rating.label} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{rating.label}</span>
                            <span className="font-medium">{rating.value}</span>
                          </div>
                          <Progress value={(rating.value / 5) * 100} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Feedback */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Seller feedback ({demoProduct.seller.feedbackCount})</h2>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32 h-8 text-sm">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All ratings</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Feedback Items */}
                <div className="space-y-4">
                  {[
                    { user: "i***m", score: 73, text: "Really great seller to communicate with, phone arrived in perfect condition. Thank you!", date: "Past 6 months" },
                    { user: "6***i", score: 365, text: "Reliable seller. Parcel was promptly dispatched and securely packaged. The item was exactly as described.", date: "Past 6 months" },
                    { user: "l***s", score: 3058, text: "Excellent Seller, Well packaged delivery, Item as described, new, good quality, good price.", date: "Past 6 months" },
                  ].map((feedback, i) => (
                    <div key={i} className="flex gap-3 py-3 border-b border-border last:border-0">
                      <CheckCircle weight="fill" className="size-5 text-green-600 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{feedback.user}</span>
                          <span className="text-muted-foreground">({feedback.score})</span>
                          <span className="text-muted-foreground">• {feedback.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link href="#" className="text-sm text-primary hover:underline inline-block">
                  See all feedback
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN - Buy Box */}
            <div className="space-y-4">
              {/* Title */}
              <h1 className="text-xl font-normal leading-snug">
                {demoProduct.title}
              </h1>

              {/* Condition */}
              <div className="text-sm">
                <span className="text-muted-foreground">Condition: </span>
                <span className="font-medium">{demoProduct.condition}</span>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold">
                US ${demoProduct.price.toFixed(2)}
              </div>

              {/* Buy Buttons */}
              <div className="space-y-2.5">
                <Button className="w-full h-12 text-base font-semibold rounded-full">
                  Buy It Now
                </Button>
                <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-full">
                  Add to cart
                </Button>
                <Button 
                  variant="outline" 
                  className={cn(
                    "w-full h-12 text-base font-semibold rounded-full gap-2",
                    isWatching && "border-primary text-primary"
                  )}
                  onClick={() => setIsWatching(!isWatching)}
                >
                  <Heart weight={isWatching ? "fill" : "regular"} className="size-5" />
                  {isWatching ? "Watching" : "Add to Watchlist"}
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Eye className="size-4" />
                <span>People are checking this out.</span>
                <span className="font-medium text-foreground">{demoProduct.watchCount} have added this to their watchlist.</span>
              </div>

              <Separator />

              {/* Shipping */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <div className="text-right">
                    <span className="font-medium">US ${demoProduct.shipping.cost.toFixed(2)}</span>
                    <p className="text-xs text-muted-foreground">{demoProduct.shipping.method}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Located in:</span>
                  <span>{demoProduct.shipping.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Import charges:</span>
                  <div className="text-right">
                    <span>Est. US ${demoProduct.shipping.importCharges.toFixed(2)}</span>
                    <p className="text-xs text-muted-foreground">Amount confirmed at checkout</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery:</span>
                  <div className="text-right">
                    <span>Estimated between {demoProduct.shipping.deliveryStart} and {demoProduct.shipping.deliveryEnd}</span>
                    <p className="text-xs text-muted-foreground">Includes international tracking</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Returns:</span>
                  <span className="text-red-600">Seller does not accept returns</span>
                </div>
              </div>

              <Separator />

              {/* Payments */}
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Payments:</span>
                <div className="flex gap-2">
                  {demoProduct.payments.map((payment) => (
                    <div key={payment} className="h-6 px-2 bg-muted rounded text-xs flex items-center uppercase font-medium">
                      {payment}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Compact Seller Card */}
              <Card className="border-border shadow-none">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Seller information</h3>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-primary text-sm font-normal hover:underline hover:bg-transparent">
                      Save this seller
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {demoProduct.seller.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href="#" className="font-medium text-primary hover:underline text-sm">
                        {demoProduct.seller.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {demoProduct.seller.positiveFeedback}% positive • {(demoProduct.seller.itemsSold / 1000).toFixed(1)}K sold
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-9 text-xs">
                      <Storefront className="size-3.5 mr-1.5" />
                      Visit store
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-9 text-xs">
                      <ChatCircle className="size-3.5 mr-1.5" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
