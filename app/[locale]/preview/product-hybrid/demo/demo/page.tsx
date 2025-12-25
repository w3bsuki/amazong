"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  Store,
  Truck,
  ZoomIn,
  Star,
  Share2,
  Heart,
  MessageCircle,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Zap,
  Eye,
} from "lucide-react";
import PhotoSwipeLightbox, { PhotoSwipe } from "photoswipe/lightbox";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ControllerRenderProps,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

import "photoswipe/style.css";

import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// --- Types ---

type StockStatusCode = "IN_STOCK" | "OUT_OF_STOCK";

interface StockInfo {
  stockStatusCode?: StockStatusCode;
  stockQuantity?: number;
}

interface ProductImagesProps {
  images: Array<{
    alt: string;
    width: number;
    height: number;
    srcset?: string;
    src: string;
    sizes?: string;
  }>;
  galleryID: string;
}

interface Option {
  id: string;
  value: string;
  label: string;
  stockInfo: StockInfo;
  price?: price;
}

interface Hinges {
  label: string;
  id: string;
  name: FieldName;
  options?: Option[];
  min?: number;
  max?: number;
}

interface ProductFormProps {
  hinges: Record<FieldName, Hinges>;
  onSubmit: SubmitHandler<FormType>;
  stockInfo?: StockInfo;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  selectedSize?: string;
  productInfo: {
    name: string;
    thumbnail: {
      src: string;
      alt: string;
    };
    price?: price;
  };
}

type price = {
  regular?: number;
  sale?: number;
  currency?: string;
};

interface PriceProps extends price {
  size?: "default" | "sm" | "lg";
}

type FormType = z.infer<typeof formSchema>;
type FieldName = keyof FormType;

interface SizeRadioGroupProps {
  options?: Array<Option>;
  field: ControllerRenderProps<FormType>;
}

interface QuantityProps {
  field: ControllerRenderProps<FormType>;
  max?: number;
  min?: number;
}

import { ProductCard } from "@/components/product/product-card";

// --- Data ---

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

const SELLER_PRODUCTS: SellerProductItem[] = [
  {
    id: "sp-1",
    title: "Vintage 90s Oversized Leather Jacket - Genuine Leather - Black",
    price: 1250000,
    originalPrice: 1500000,
    image: "https://images.unsplash.com/photo-1551028919-ac66c5f8013d?q=80&w=500&auto=format&fit=crop",
    rating: 4.8,
    reviews: 12,
    sellerName: "Barudak Disaster Mall",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    condition: "Used - Excellent",
    freeShipping: true,
    categorySlug: "fashion",
    attributes: { brand: "Vintage", size: "L", material: "Leather" }
  },
  {
    id: "sp-2",
    title: "Classic Denim Jacket - Blue Jean Coat - Unisex Streetwear",
    price: 450000,
    originalPrice: 600000,
    image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?q=80&w=500&auto=format&fit=crop",
    rating: 4.5,
    reviews: 8,
    sellerName: "Barudak Disaster Mall",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    condition: "New with tags",
    freeShipping: false,
    categorySlug: "fashion",
    attributes: { brand: "Levis", size: "M", material: "Denim" }
  },
  {
    id: "sp-3",
    title: "Urban Tactical Cargo Pants - Black - Multi Pocket",
    price: 350000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=500&auto=format&fit=crop",
    rating: 4.9,
    reviews: 42,
    sellerName: "Barudak Disaster Mall",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    condition: "New",
    freeShipping: true,
    categorySlug: "fashion",
    attributes: { brand: "Urban", size: "32", material: "Cotton" }
  },
  {
    id: "sp-4",
    title: "Canvas High Top Sneakers - Black/White - Classic Style",
    price: 280000,
    originalPrice: 350000,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=500&auto=format&fit=crop",
    rating: 4.7,
    reviews: 156,
    sellerName: "Barudak Disaster Mall",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    condition: "New in box",
    freeShipping: true,
    categorySlug: "shoes",
    attributes: { brand: "Generic", size: "42", condition: "New" }
  },
];

const PRODUCT_DETAILS = {
  name: "This Ben Hogan Men's Solid Ottoman Golf Polo Shirt",
  rating: 4.8,
  reviewCount: 188,
  sold: "10K+",
  store: {
    name: "Barudak Disaster Mall",
    verified: true,
    rating: "96%",
    location: "Tulungagung",
    ready: "98%",
  },
  price: {
    regular: 250000,
    sale: 187500,
    currency: "IDR",
  },
  images: [
    {
      src: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop",
      alt: "Black Polo Shirt Front",
      width: 1000,
      height: 1000,
    },
    {
      src: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop",
      alt: "Black Polo Shirt Detail",
      width: 1000,
      height: 1000,
    },
    {
      src: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=1000&auto=format&fit=crop",
      alt: "Black Polo Shirt Back",
      width: 1000,
      height: 1000,
    },
    {
      src: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop",
      alt: "Black Polo Shirt Model",
      width: 1000,
      height: 1000,
    },
  ],
  description:
    "This Ben Hogan Men's Solid Ottoman Golf Polo Shirt makes for versatile casual wear or golf apparel. Built-in moisture wicking and sun protection keep you feeling dry while blocking out harmful UV rays. Durable textured Ottoman fabric and a ribbed collar with three-button placket give it classic polo style. The solid color makes this golf top easy to pair up with any pants or shorts for style that looks great both on and off the course.",
  details: [
    { label: "Package Dimensions", value: "27.3 x 24.8 x 4.9 cm; 180 g" },
    { label: "Specification", value: "Moisture Wicking, Stretchy, SPF/UV Protection, Easy Care" },
    { label: "Date First Available", value: "August 08, 2023" },
    { label: "Department", value: "Mens" },
  ],
  hinges: {
    size: {
      label: "Select Size",
      id: "size",
      name: "size",
      options: [
        {
          id: "s",
          value: "s",
          label: "S",
          stockInfo: { stockStatusCode: "IN_STOCK" },
        },
        {
          id: "m",
          value: "m",
          label: "M",
          stockInfo: { stockStatusCode: "IN_STOCK" },
        },
        {
          id: "l",
          value: "l",
          label: "L",
          stockInfo: { stockStatusCode: "IN_STOCK" },
        },
        {
          id: "xl",
          value: "xl",
          label: "XL",
          stockInfo: { stockStatusCode: "IN_STOCK" },
        },
        {
          id: "xxl",
          value: "xxl",
          label: "2XL",
          stockInfo: { stockStatusCode: "IN_STOCK" },
        },
        {
          id: "3xl",
          value: "3xl",
          label: "3XL",
          stockInfo: { stockStatusCode: "OUT_OF_STOCK" },
        },
      ],
    },
    quantity: {
      label: "Quantity",
      id: "quantity",
      name: "quantity",
      min: 1,
      max: 99,
    },
  } as Record<FieldName, Hinges>,
};

const STYLING_IDEAS = [
  {
    name: "George Men's and Big Men's 100% Cotton R...",
    price: 350000,
    sale: 220000,
    image: "https://images.unsplash.com/photo-1542272617-08f086302542?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Men's Easy Reader Date Black/Silver/W...",
    price: 745000,
    sale: 450000,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Sport Running Shoes for Men Mesh Breath...",
    price: 450000,
    sale: 330000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop",
  },
];

const REVIEWS = [
  {
    id: 1,
    author: "His favorite shirts!",
    date: "08 August 2023",
    rating: 5,
    content: "They are scoundrels, do not buy this garbage, they give you poor quality rags, do not buy more clothes in Alyexpress, on top of that you want to return it and they block you, it is miserable",
    likes: 22,
    dislikes: 0,
    variant: "Color : Black • Size : XL",
  },
  {
    id: 2,
    author: "Cool as a cucumber",
    date: "12 July 2023",
    rating: 5,
    content: "This shirt is made of polyester and I wasn't sure how that would go for me, but when I received it and tried it on, I realized that the weave is quite different from the polyester shirts of my childhood. There was nothing uncomfortable about it. It had a certain sheen to it, which looked nice. The gray color is great for me, not too dark or light.",
    likes: 34,
    dislikes: 0,
    variant: "Color : Gray • Size : L",
  },
  {
    id: 3,
    author: "My Son inLaw likes these shirts",
    date: "12 July 2023",
    rating: 5,
    content: "this is the perfect shirt for my husband who works county fairs, home shows and the state fair, often outside under a canopy as a vendor marketing his product. light weight fabric that is cooler than most polo shirts with a looser weave that allows air flow. colors are lighter hues for warmer weather and the fit is just right with a little extra room for air and long enough to allow you to bend over comfortably.",
    likes: 21,
    dislikes: 0,
    variant: "Color : Black • Size : 2XL",
  },
  {
    id: 4,
    author: "Best comfortable polo shirt for everyday",
    date: "08 Jun 2023",
    rating: 5,
    content: "The best comfortable and practical polo shorts for summer wear. And you definitely can't beat the price for Hanes. I love it so much, I bought three shades of red, black, and heather gray before the prices started going up.",
    likes: 18,
    dislikes: 1,
    variant: "Color : Black • Size : 2XL",
  },
];

const BEST_SELLERS = [
  {
    name: "UrbanEdge Men's Jeans Collection",
    price: 370000,
    sale: 253000,
    rating: 4.9,
    sold: "10K+",
    image: "https://images.unsplash.com/photo-1542272617-08f086302542?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "SIMANLAN Men's Slip on Shoes Cloth Shoes Dec...",
    price: 225000,
    sale: 179000,
    rating: 4.9,
    sold: "10K+",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Mafoose Adult Male Distressed Cap Men Co...",
    price: 150000,
    sale: 125000,
    rating: 4.9,
    sold: "8K+",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "SCODI Mens Flannel Hoodie Shirts Long Slee...",
    price: 325000,
    sale: null,
    rating: 4.9,
    sold: "5K+",
    image: "https://images.unsplash.com/photo-1617137968427-85924c809a10?q=80&w=300&auto=format&fit=crop",
  },
];

// --- Components ---

const formSchema = z.object({
  quantity: z.number().min(1).max(99),
  size: z.string(),
});

export default function ProductPage() {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: "m",
      quantity: 1,
    },
  });

  const sizeHinges = PRODUCT_DETAILS.hinges?.size;
  const size = form.watch("size");

  const selectedItem = useMemo(() => {
    return sizeHinges?.options?.find((item) => item.value === size);
  }, [size, sizeHinges]);

  const stockInfo = selectedItem?.stockInfo;

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-24 lg:pb-0">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Home</span>
          <span className="text-muted-foreground/50">/</span>
          <span>Product</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-slate-900 font-medium truncate">{PRODUCT_DETAILS.name}</span>
        </div>

        {/* Find Similar Items Bar */}
        <div className="hidden md:block mb-4 rounded-lg border border-border bg-gray-50 p-3">
           <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                 <span className="text-xs sm:text-sm font-bold text-slate-900 shrink-0">Find similar items from</span>
                 <Avatar className="h-5 w-5 sm:h-6 sm:w-6 border border-border shrink-0">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>BD</AvatarFallback>
                 </Avatar>
                 <div className="flex items-baseline gap-1 min-w-0 overflow-hidden">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 underline decoration-dotted underline-offset-2 cursor-pointer hover:text-cta-trust-blue truncate">
                        {PRODUCT_DETAILS.store.name}
                    </span>
                    <span className="text-[10px] sm:text-sm text-muted-foreground shrink-0">({PRODUCT_DETAILS.sold} sold)</span>
                 </div>
              </div>
              <div className="shrink-0">
                 <span className="text-xs sm:text-sm font-bold text-cta-trust-blue hover:underline cursor-pointer">Shop store</span>
              </div>
           </div>
           {/* Mobile-only horizontal scroll images */}
           <div className="mt-3 flex md:hidden gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
              {[1,2,3,4,1,2].map((i, idx) => (
                 <div key={idx} className="h-12 w-12 shrink-0 rounded border border-border bg-background p-0.5">
                    <img src={PRODUCT_DETAILS.images[i % PRODUCT_DETAILS.images.length].src} className="h-full w-full object-contain" alt="" />
                 </div>
              ))}
           </div>
           {/* Desktop images */}
           <div className="hidden md:flex items-center gap-2 mt-3 pt-3 border-t border-gray-200/60">
              {[1,2,3,4].map(i => (
                 <div key={i} className="h-10 w-10 rounded border border-border bg-background p-0.5">
                    <img src={PRODUCT_DETAILS.images[i % PRODUCT_DETAILS.images.length].src} className="h-full w-full object-contain" alt="" />
                 </div>
              ))}
              <span className="text-xs text-muted-foreground ml-auto">Sponsored</span>
           </div>
        </div>

        {/* Mobile Seller Card */}
        <div className="lg:hidden mb-4">
            <div className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-xl shadow-sm">
               <Avatar className="h-10 w-10 border border-border shrink-0">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>BD</AvatarFallback>
               </Avatar>
               <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm hover:underline cursor-pointer truncate">
                     {PRODUCT_DETAILS.store.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                     {PRODUCT_DETAILS.store.rating} positive feedback
                  </div>
               </div>
               <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-border text-muted-foreground hover:bg-background hover:text-foreground rounded-full bg-background">
                     <Store className="mr-1.5 h-3.5 w-3.5" /> Visit
                  </Button>
               </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Left Column: Images */}
          <div>
            <ProductImages
              images={PRODUCT_DETAILS.images}
              galleryID="gallery-demo"
            />

            {/* Tabs / Details Section - Desktop Only */}
            <div className="mt-8 hidden lg:block">
              <div className="py-6">
                <h3 className="mb-3 text-lg font-bold text-slate-900">Product Details</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground mb-6">
                  <p className="leading-relaxed">
                    {PRODUCT_DETAILS.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2 gap-x-8">
                  {PRODUCT_DETAILS.details.map((detail, idx) => (
                    <div key={idx} className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="text-muted-foreground">{detail.label}</span>
                      <span className="font-medium text-foreground truncate">: {detail.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end border-t border-border pt-4">
                   <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2 h-auto p-0 hover:bg-transparent">
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span className="text-xs">Report this item</span>
                   </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div>
            <Card className="rounded-none border-none shadow-none sticky top-24">
              <CardContent className="p-0 space-y-4">
                 {/* Title & Seller Info */}
                 <div>
                    <h1 className="text-xl lg:text-2xl font-bold leading-snug text-slate-900 mb-4">
                      {PRODUCT_DETAILS.name}
                    </h1>
                    
                    <div className="hidden lg:flex items-center gap-3 bg-seller-card border border-seller-card-border p-3 rounded-xl">
                       <Avatar className="h-10 w-10 border border-border shrink-0">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>BD</AvatarFallback>
                       </Avatar>
                       <div className="flex-1 min-w-0">
                          <div className="font-bold text-foreground text-sm hover:underline cursor-pointer truncate">
                             {PRODUCT_DETAILS.store.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                             {PRODUCT_DETAILS.store.rating} positive feedback
                          </div>
                       </div>
                       <div className="flex items-center gap-2 shrink-0">
                          <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-border text-muted-foreground hover:bg-background hover:text-foreground rounded-full bg-background">
                             <Store className="mr-1.5 h-3.5 w-3.5" /> Visit
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:bg-background/50 hover:text-foreground rounded-full">
                             <MessageCircle className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                 </div>

                 <Separator className="bg-border" />

                 {/* Price Section */}
                 <div className="flex items-baseline gap-2 lg:grid lg:grid-cols-[90px_1fr] lg:gap-3">
                     <span className="text-sm font-normal text-slate-900 hidden lg:block">Price:</span>
                     <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(PRODUCT_DETAILS.price.sale || 0)}
                        </span>
                        {PRODUCT_DETAILS.price.regular && (
                           <span className="text-sm text-muted-foreground">
                              <span className="lg:hidden">Was: </span>
                              <span className="line-through">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(PRODUCT_DETAILS.price.regular)}</span>
                           </span>
                        )}
                     </div>
                 </div>

                 {/* Condition */}
                 <div className="flex items-center gap-2 lg:grid lg:grid-cols-[90px_1fr] lg:gap-3">
                    <span className="text-sm font-normal text-slate-900">Condition:</span>
                    <span className="font-bold text-slate-900">New with tags</span>
                 </div>

                 {/* Color Selection */}
                 <div className="flex items-start gap-2 lg:grid lg:grid-cols-[90px_1fr] lg:gap-3">
                    <span className="text-sm font-normal text-slate-900 mt-2 lg:mt-1.5">Color:</span>
                    <div>
                       <div className="flex gap-2 mb-1">
                         <div className="h-9 w-9 cursor-pointer border-2 border-foreground p-0.5 bg-background">
                            <img src={PRODUCT_DETAILS.images[0].src} className="h-full w-full object-cover" alt="Black" />
                         </div>
                         <div className="h-9 w-9 cursor-pointer border border-border p-0.5 bg-background hover:border-muted-foreground transition-colors">
                            <img src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=100&auto=format&fit=crop" className="h-full w-full object-cover grayscale opacity-70" alt="White" />
                         </div>
                       </div>
                       <span className="text-xs text-muted-foreground">Black</span>
                    </div>
                 </div>

                 {/* Form (Size & Buttons) */}
                 <ProductForm
                   hinges={PRODUCT_DETAILS.hinges}
                   form={form}
                   onSubmit={onSubmit}
                   selectedSize={selectedItem?.label}
                   stockInfo={stockInfo}
                   productInfo={{
                     name: PRODUCT_DETAILS.name,
                     price: PRODUCT_DETAILS.price,
                     thumbnail: { src: PRODUCT_DETAILS.images[0].src, alt: PRODUCT_DETAILS.name },
                   }}
                 />

                 {/* Shipping, Returns, Payments - Styled like Urgency Box */}
                 <div className="hidden lg:block bg-gray-100 p-4 rounded-lg space-y-3 mt-4">
                    {/* Shipping */}
                    <div className="grid grid-cols-[90px_1fr] gap-2 text-sm">
                        <div className="text-slate-900 font-medium">Shipping:</div>
                        <div className="text-slate-900">
                           <span className="font-bold">Does not ship to Bulgaria</span>
                           <span className="text-muted-foreground mx-1">|</span>
                           <span className="text-cta-trust-blue hover:underline cursor-pointer">See details</span>
                        </div>
                    </div>
                    
                    {/* Returns */}
                    <div className="grid grid-cols-[90px_1fr] gap-2 text-sm">
                        <div className="text-slate-900 font-medium">Returns:</div>
                        <div className="text-slate-900">
                           30 days returns. Buyer pays for return shipping.
                        </div>
                    </div>

                    {/* Payments */}
                    <div className="grid grid-cols-[90px_1fr] gap-2 text-sm items-center">
                        <div className="text-slate-900 font-medium">Payments:</div>
                        <div className="flex gap-1">
                           <div className="h-5 w-8 bg-white border border-gray-200 rounded-sm"></div>
                           <div className="h-5 w-8 bg-white border border-gray-200 rounded-sm"></div>
                           <div className="h-5 w-8 bg-white border border-gray-200 rounded-sm"></div>
                           <div className="h-5 w-8 bg-white border border-gray-200 rounded-sm"></div>
                        </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Accordions */}
        <div className="mt-6 lg:hidden">
           <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description">
                 <AccordionTrigger className="font-bold text-slate-900">Description</AccordionTrigger>
                 <AccordionContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                       <p>{PRODUCT_DETAILS.description}</p>
                    </div>
                 </AccordionContent>
              </AccordionItem>
              <AccordionItem value="details">
                 <AccordionTrigger className="font-bold text-slate-900">Product Details</AccordionTrigger>
                 <AccordionContent>
                    <div className="grid grid-cols-1 gap-y-2 text-sm">
                       {PRODUCT_DETAILS.details.map((detail, idx) => (
                          <div key={idx} className="grid grid-cols-[140px_1fr] items-baseline">
                             <span className="text-muted-foreground">{detail.label}</span>
                             <span className="font-medium text-foreground truncate">: {detail.value}</span>
                          </div>
                       ))}
                    </div>
                 </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                 <AccordionTrigger className="font-bold text-slate-900">Shipping & Returns</AccordionTrigger>
                 <AccordionContent>
                    <div className="space-y-3 text-sm">
                       <div className="grid grid-cols-[90px_1fr] gap-2">
                           <div className="font-medium">Shipping:</div>
                           <div>Does not ship to Bulgaria</div>
                       </div>
                       <div className="grid grid-cols-[90px_1fr] gap-2">
                           <div className="font-medium">Returns:</div>
                           <div>30 days returns. Buyer pays for return shipping.</div>
                       </div>
                    </div>
                 </AccordionContent>
              </AccordionItem>
           </Accordion>
        </div>

        {/* More from this seller */}
        <div className="mt-6 rounded-xl bg-gray-100 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">More from this seller</h3>
            <Button variant="link" className="text-cta-trust-blue font-medium hover:underline h-auto p-0">See all (519)</Button>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 snap-x lg:grid lg:grid-cols-5 lg:gap-4 lg:pb-0 lg:mx-0 lg:px-0 no-scrollbar">
             {SELLER_PRODUCTS.map((product) => (
                <div key={product.id} className="min-w-[160px] lg:min-w-0 h-full bg-white rounded-lg overflow-hidden snap-start border border-gray-200 lg:border-none">
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

        {/* Customer Reviews */}
        <div className="mt-12 rounded-xl bg-gray-100 p-6">
          <h3 className="mb-6 text-lg font-bold text-slate-900">Customer Reviews</h3>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
            {/* Summary Column */}
            <div className="flex flex-col gap-6">
               <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-foreground text-2xl font-bold text-foreground">
                     4.8
                  </div>
                  <div>
                     <div className="flex gap-0.5 text-orange-400 mb-1.5">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                     </div>
                     <div className="font-bold text-foreground text-sm mb-0.5">95% of buyers are satisfied</div>
                     <div className="text-xs text-muted-foreground">98 rating • 125 Reviews</div>
                  </div>
               </div>

               <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 w-8">
                       <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                       <span className="font-medium text-muted-foreground">{star}</span>
                    </div>
                    <Progress value={star === 5 ? 80 : star === 4 ? 15 : 2} className="h-1.5 bg-muted [&>div]:bg-foreground" />
                    <span className="w-8 text-right text-muted-foreground text-xs">
                      {star === 5 ? 136 : star === 4 ? 33 : star === 3 ? 9 : star === 2 ? 10 : 2}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Column */}
            <div>
               <div className="mb-6 flex flex-wrap gap-2">
                  <Button variant="default" size="sm" className="h-7 text-xs bg-slate-900 text-white hover:bg-slate-800 rounded-full px-4 border-none shadow-none">All (190)</Button>
                  <Button variant="secondary" size="sm" className="h-7 text-xs bg-white text-slate-900 hover:bg-gray-200 rounded-full px-4 border-none shadow-none">Pic Review (12)</Button>
                  <Button variant="secondary" size="sm" className="h-7 text-xs bg-white text-slate-900 hover:bg-gray-200 rounded-full px-4 border-none shadow-none">Fast Shipping (12)</Button>
                  <Button variant="secondary" size="sm" className="h-7 text-xs bg-white text-slate-900 hover:bg-gray-200 rounded-full px-4 border-none shadow-none">5 Stars (136)</Button>
                  <Button variant="secondary" size="sm" className="h-7 text-xs bg-white text-slate-900 hover:bg-gray-200 rounded-full px-4 border-none shadow-none">4 Stars (33)</Button>
                  <Button variant="secondary" size="sm" className="h-7 text-xs bg-white text-slate-900 hover:bg-gray-200 rounded-full px-4 border-none shadow-none">3 Stars (9)</Button>
                  <Button variant="secondary" size="sm" className="h-7 text-xs bg-white text-slate-900 hover:bg-gray-200 rounded-full px-4 border-none shadow-none">Good Quality (12)</Button>
               </div>

               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {REVIEWS.map((review) => (
                  <Card key={review.id} className="border-none shadow-none bg-white">
                     <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex text-orange-400 gap-0.5">
                           {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-muted-foreground/30"}`} />
                           ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground">{review.date}</span>
                        </div>
                        <h4 className="font-bold text-foreground text-sm mb-0.5">{review.author}</h4>
                        <div className="text-[10px] text-muted-foreground mb-3">{review.variant}</div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {review.content}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                           <ThumbsUp className="h-3.5 w-3.5" /> {review.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                           <ThumbsDown className="h-3.5 w-3.5" /> {review.dislikes}
                        </button>
                        </div>
                     </CardContent>
                  </Card>
                  ))}
               </div>
               <div className="mt-6 text-center">
                  <Button variant="outline" className="h-9 px-6 border-border text-sm font-medium text-foreground hover:bg-muted rounded-full">See All Reviews</Button>
               </div>
            </div>
          </div>
        </div>


        {/* Mobile Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <div className="flex gap-3 items-center max-w-md mx-auto">
              <Button variant="outline" size="icon" className="shrink-0 border-gray-300 h-11 w-11 rounded-full text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors active:scale-95">
                 <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="flex-1 border-cta-trust-blue text-cta-trust-blue font-bold rounded-full h-11 text-sm uppercase tracking-wide hover:bg-blue-50 active:scale-[0.98] transition-transform">
                 Add to cart
              </Button>
              <Button className="flex-1 bg-cta-trust-blue text-cta-trust-blue-text font-bold rounded-full h-11 text-sm uppercase tracking-wide hover:bg-cta-trust-blue-hover shadow-sm active:scale-[0.98] transition-transform">
                 Buy It Now
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
}

// --- Subcomponents ---

const ProductImages = ({ images, galleryID }: ProductImagesProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#" + galleryID,
      children: "a",
      bgOpacity: 1,
      wheelToZoom: true,
      arrowPrev: false,
      arrowNext: false,
      close: false,
      zoom: false,
      counter: false,
      mainClass: "[&>div:first-child]:!bg-background",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    lightboxRef.current = lightbox;
    return () => lightbox.destroy();
  }, [galleryID]);

  useEffect(() => {
    if (!api) return;
    const updateCurrent = () => setCurrent(api.selectedScrollSnap());
    updateCurrent();
    api.on("select", updateCurrent);
    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  if (!images) return null;

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {/* Thumbnails (Left on Desktop) */}
      <div className="hidden w-[100px] flex-col gap-3 lg:flex shrink-0">
        {images.map((img, index) => (
          <div
            key={index}
            className={cn(
              "cursor-pointer overflow-hidden rounded-lg border-2 transition-all aspect-square",
              current === index ? "border-foreground" : "border-transparent hover:border-border"
            )}
            onClick={() => api?.scrollTo(index)}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 overflow-hidden rounded-2xl bg-muted relative group aspect-square lg:aspect-auto" id={galleryID}>
        <Carousel setApi={setApi} className="w-full h-full">
          <CarouselContent className="h-full">
            {images.map((img, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="flex h-full w-full items-center justify-center p-8 aspect-square lg:aspect-auto lg:h-[600px]">
                  <a
                    href={img.src}
                    data-pswp-width={img.width}
                    data-pswp-height={img.height}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-full w-full items-center justify-center"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </a>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute bottom-4 right-4">
           <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full bg-background shadow-md hover:bg-muted/50">
              <ZoomIn className="h-5 w-5 text-foreground" />
           </Button>
        </div>
      </div>
    </div>
  );
};

const ProductForm = ({
  hinges,
  form,
  onSubmit,
  stockInfo,
  selectedSize,
}: ProductFormProps) => {
  const sizeHinges = hinges?.size;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {sizeHinges && (
          <FormField
            control={form.control}
            name={sizeHinges.name}
            render={({ field }) => (
              <FormItem>
                <div className="mb-2 flex items-center justify-between">
                  <FormLabel className="text-sm font-bold text-slate-900">
                    Select Size
                  </FormLabel>
                  <span className="text-sm text-cta-trust-blue cursor-pointer hover:underline">Size Guide</span>
                </div>
                <FormControl>
                  <SizeRadioGroup field={field} options={sizeHinges.options} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {/* Quantity Field */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="flex flex-col lg:grid lg:grid-cols-[90px_1fr] lg:items-center gap-2 lg:gap-3 space-y-0">
               <FormLabel className="text-sm font-normal text-slate-900">Quantity:</FormLabel>
               <FormControl>
                 <div className="flex items-center gap-3">
                    <div className="flex items-center">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-l-md rounded-r-none border-r-0"
                            onClick={() => field.onChange(Math.max(1, field.value - 1))}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <div className="h-10 w-14 border-y border-input flex items-center justify-center text-sm font-medium">
                            {field.value}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-r-md rounded-l-none border-l-0"
                            onClick={() => field.onChange(Math.min(99, field.value + 1))}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                       {stockInfo?.stockQuantity ? `${stockInfo.stockQuantity} available` : "9 available"} <span className="mx-1">·</span> <span className="text-destructive font-medium">104 sold</span>
                    </span>
                 </div>
               </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 mt-2 hidden lg:flex">
          <Button className="w-full bg-cta-trust-blue text-cta-trust-blue-text hover:bg-cta-trust-blue-hover h-12 text-lg font-bold rounded-full" size="lg">
            Buy It Now
          </Button>
          <Button variant="outline" className="w-full border-cta-trust-blue text-cta-trust-blue hover:bg-cta-trust-blue/10 h-12 text-lg font-bold rounded-full" size="lg">
            Add to cart
          </Button>
           <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted h-12 text-lg font-bold rounded-full" size="lg">
            <Heart className="mr-2 h-5 w-5" /> Add to Watchlist
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

const SizeRadioGroup = ({ options, field }: SizeRadioGroupProps) => {
  if (!options) return null;

  return (
    <RadioGroup
      {...field}
      value={`${field.value}`}
      onValueChange={field.onChange}
      className="flex flex-wrap gap-2 lg:gap-3"
    >
      {options.map((item) => (
        <FormItem key={item.id}>
          <FormLabel className="cursor-pointer">
            <RadioGroupItem
              value={item.value}
              id={item.id}
              className="peer sr-only"
              disabled={item.stockInfo.stockStatusCode === "OUT_OF_STOCK"}
            />
            <div className="flex h-9 min-w-[2.5rem] lg:h-10 lg:min-w-[3.5rem] items-center justify-center rounded-md border border-border bg-background px-2 lg:px-3 text-xs lg:text-sm font-medium text-foreground transition-all hover:border-foreground peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:bg-muted peer-disabled:text-muted-foreground">
              {item.label}
            </div>
          </FormLabel>
        </FormItem>
      ))}
    </RadioGroup>
  );
};
