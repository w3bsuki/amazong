import React from "react";
import { Metadata } from "next";
import { 
  ShoppingCart, 
  Heart, 
  Store, 
  Star, 
  Package, 
  ShieldCheck, 
  MapPin, 
  TrendingUp,
  CreditCard,
  Truck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  MoreHorizontal,
  Search,
  ChevronRight,
  Bell,
  Settings,
  Percent,
  Tag,
  ShoppingBag,
  User,
  FileText,
  Activity,
  ArrowRight,
  Briefcase,
  Sparkles,
  Shirt, 
  Laptop, 
  Car
} from "lucide-react";

// NEW V2 COMPONENTS
import { 
  Button, 
  Badge, 
  SellerBadge, 
  CategoryBadge, 
  AvatarGroup, 
  Avatar, 
  AvatarImage, 
  AvatarFallback, 
  SocialProof,
  ProductCard,
  TweetCard,
  FilterSidebar
} from "@/components/design-system2/components";
import "@/components/design-system2/theme.css";  // IMPORT THEME CSS HERE TO ENSURE V2 STYLES APPLY


import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Design System v2 (Live Audit)",
  description: "Live audit of the implemented Tailwind v4 design system.",
};

const ColorSwatch = ({ 
  name, 
  className, 
  hex, 
  variable 
}: { 
  name: string, 
  className: string, 
  hex?: string,
  variable?: string 
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-20 w-full rounded-lg border shadow-sm ${className} flex items-end justify-between p-2`} />
      <div>
         <div className="font-semibold text-sm tracking-tight">{name}</div>
         <div className="text-xs text-muted-foreground font-mono truncate select-all">{className}</div>
         {variable && <div className="text-2xs text-muted-foreground font-mono select-all opacity-50">{variable}</div>}
      </div>
    </div>
  )
}

type TypographySpecProps = {
  role: string
  size: string
  tracking: string
  weight: string
  sample: string
}

const TypographySpec = ({ role, size, tracking, weight, sample }: TypographySpecProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-b last:border-0 items-center">
    <div className="col-span-1">
      <div className="font-semibold text-sm text-foreground">{role}</div>
      <div className="text-xs text-muted-foreground font-mono mt-1 space-y-0.5">
        <div>{size}</div>
        <div>{weight}</div>
        <div>{tracking}</div>
      </div>
    </div>
    <div className="col-span-3">
       <div className={`${size} ${weight} ${tracking} truncate`}>{sample}</div>
    </div>
  </div>
)

export default function DesignSystemV2Page() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-32 font-sans">
      
      {/* Header */}
      <div className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
               <span className="text-primary-foreground font-bold text-sm">DS</span>
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none tracking-tight">Design System v2</h1>
              <p className="text-xs text-muted-foreground mt-1 font-mono">Tailwind v4 • Shadcn • Live Audit</p>
            </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="hidden sm:flex">Documentation</Button>
             <Button size="sm">Download Tokens</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-20 max-w-7xl">

        {/* 1. FOUNDATIONS - COLORS */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">01. Colors</h2>
            <p className="text-muted-foreground text-lg">Core palette using <code>oklch</code> for perceptually uniform colors.</p>
          </div>

          <div className="space-y-8">
            {/* Core Primitives */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Core Primitives</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <ColorSwatch name="Primary" className="bg-primary" variable="--primary" />
                <ColorSwatch name="Primary Fg" className="bg-primary-foreground border" variable="--primary-foreground" />
                <ColorSwatch name="Secondary" className="bg-secondary" variable="--secondary" />
                <ColorSwatch name="Secondary Fg" className="bg-secondary-foreground" variable="--secondary-foreground" />
                <ColorSwatch name="Accent" className="bg-accent" variable="--accent" />
                <ColorSwatch name="Accent Fg" className="bg-accent-foreground" variable="--accent-foreground" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                 <ColorSwatch name="Muted" className="bg-muted" variable="--muted" />
                 <ColorSwatch name="Muted Fg" className="bg-muted-foreground" variable="--muted-foreground" />
                 <ColorSwatch name="Destructive" className="bg-destructive" variable="--destructive" />
                 <ColorSwatch name="Background" className="bg-background border" variable="--background" />
                 <ColorSwatch name="Card" className="bg-card border" variable="--card" />
                 <ColorSwatch name="Border" className="bg-border" variable="--border" />
              </div>
            </div>

            {/* Semantic Status Colors */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Semantic Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorSwatch name="Success" className="bg-success" variable="--success" />
                <ColorSwatch name="Warning" className="bg-warning" variable="--warning" />
                <ColorSwatch name="Error" className="bg-error" variable="--error" />
                <ColorSwatch name="Info" className="bg-info" variable="--info" />
              </div>
            </div>

             {/* Badge System Colors */}
             <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Badge Color System</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ColorSwatch name="Badge Success (Solid)" className="bg-badge-success-solid" variable="--color-badge-success-solid" />
                <ColorSwatch name="Badge Warning (Solid)" className="bg-badge-warning-solid" variable="--color-badge-warning-solid" />
                <ColorSwatch name="Badge Critical (Solid)" className="bg-badge-critical-solid" variable="--color-badge-critical-solid" />
                <ColorSwatch name="Badge Info (Solid)" className="bg-badge-info-solid" variable="--color-badge-info-solid" />
                <ColorSwatch name="Badge Neutral (Solid)" className="bg-badge-neutral-solid" variable="--color-badge-neutral-solid" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                <ColorSwatch name="Badge Success (Subtle)" className="bg-badge-success-subtle-bg" variable="--color-badge-success-subtle-bg" />
                <ColorSwatch name="Badge Warning (Subtle)" className="bg-badge-warning-subtle-bg" variable="--color-badge-warning-subtle-bg" />
                <ColorSwatch name="Badge Critical (Subtle)" className="bg-badge-critical-subtle-bg" variable="--color-badge-critical-subtle-bg" />
                <ColorSwatch name="Badge Info (Subtle)" className="bg-badge-info-subtle-bg" variable="--color-badge-info-subtle-bg" />
                <ColorSwatch name="Badge Neutral (Subtle)" className="bg-badge-neutral-subtle-bg" variable="--color-badge-neutral-subtle-bg" />
              </div>
            </div>

            {/* Specialized Marketplace Colors */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Marketplace Semantic</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <ColorSwatch name="Price Sale" className="bg-price-sale" variable="--color-price-sale" />
                <ColorSwatch name="Price Savings" className="bg-price-savings" variable="--color-price-savings" />
                <ColorSwatch name="Verified" className="bg-verified" variable="--color-verified" />
                <ColorSwatch name="Free Shipping" className="bg-shipping-free" variable="--color-shipping-free" />
                <ColorSwatch name="Cond. New" className="bg-condition-new" variable="--color-condition-new" />
                <ColorSwatch name="Cond. Used" className="bg-condition-used" variable="--color-condition-used" />
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* 2. TYPOGRAPHY */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">02. Typography</h2>
            <p className="text-muted-foreground text-lg">Type scale and weights.</p>
          </div>
          
          <div className="border rounded-xl p-8 bg-card shadow-sm">
             <TypographySpec role="Display / Hero" size="text-4xl md:text-5xl lg:text-6xl" weight="font-extrabold" tracking="tracking-tight" sample="The quick brown fox." />
             <TypographySpec role="H1 Page Title" size="text-3xl md:text-4xl" weight="font-bold" tracking="tracking-tight" sample="Design System v2" />
             <TypographySpec role="H2 Section Title" size="text-2xl md:text-3xl" weight="font-bold" tracking="tracking-tight" sample="Latest Arrivals" />
             <TypographySpec role="H3 Component Title" size="text-xl md:text-2xl" weight="font-semibold" tracking="tracking-tight" sample="Product Specifications" />
             <TypographySpec role="H4 / Card Title" size="text-lg" weight="font-semibold" tracking="tracking-normal" sample="Sony PlayStation 5" />
             <TypographySpec role="Body Large" size="text-lg" weight="font-normal" tracking="tracking-normal" sample="Experience lightning-fast loading with an ultra-high speed SSD." />
             <TypographySpec role="Body Default" size="text-base" weight="font-normal" tracking="tracking-normal" sample="Deeper immersion with support for haptic feedback, adaptive triggers." />
             <TypographySpec role="Body Small" size="text-sm" weight="font-normal" tracking="tracking-normal" sample="Ships within 24 hours. Free returns." />
             <TypographySpec role="Caption / Tiny" size="text-xs" weight="font-medium" tracking="tracking-wide" sample="VERIFIED SELLER • JAN 25, 2026" />
          </div>
        </section>

        <Separator />

        {/* 3. COMPONENTS */}
        <section className="space-y-12">
           <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">03. UI Components</h2>
            <p className="text-muted-foreground text-lg">Interactive elements using the design tokens.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* BUTTONS */}
            <Card>
              <CardHeader><CardTitle>Buttons</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4 items-center">
                   <Button variant="default">Primary Button</Button>
                   <Button variant="secondary">Secondary</Button>
                   <Button variant="outline">Outline</Button>
                   <Button variant="ghost">Ghost</Button>
                   <Button variant="destructive">Destructive</Button>
                   <Button variant="link">Link Style</Button>
                </div>
                 <Separator />
                 <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="brand" size="sm" className="rounded-full">Tweet Action</Button>
                    <Button variant="brand">Tweet Normal</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Pill Outline</Button>
                 </div>
                 <Separator />
                 <div className="flex flex-wrap gap-4 items-center">
                   <Button size="lg">Large</Button>
                  <Button size="default">Default</Button>
                  <Button size="sm">Small</Button>
                  <Button size="icon" variant="outline"><Heart className="w-4 h-4"/></Button>
                </div>
              </CardContent>
            </Card>

            {/* BADGES */}
            <Card>
              <CardHeader><CardTitle>Badges & Status</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                 <div>
                   <div className="text-sm text-muted-foreground mb-2">Standard Variants</div>
                   <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                   </div>
                 </div>
                 
                 <div>
                   <div className="text-sm text-muted-foreground mb-2">Functional Variants (Semantic)</div>
                   <div className="flex flex-wrap gap-2">
                     <Badge variant="success">Success</Badge>
                     <Badge variant="warning">Warning</Badge>
                     <Badge variant="destructive">Error</Badge>
                     <Badge variant="info">Info</Badge>
                   </div>
                 </div>

                 <div>
                    <div className="text-sm text-muted-foreground mb-2">Marketplace Categories</div>
                    <div className="flex flex-wrap gap-2">
                      <CategoryBadge type="fashion" label="Fashion & Apparel" />
                      <CategoryBadge type="tech" label="Electronics" />
                      <CategoryBadge type="auto" label="Automotive" />
                    </div>
                 </div>

                 <div>
                    <div className="text-sm text-muted-foreground mb-2">Seller Status</div>
                    <div className="flex flex-wrap gap-2">
                       <SellerBadge type="business" />
                       <SellerBadge type="verified" />
                       <SellerBadge type="new" />
                    </div>
                 </div>
              </CardContent>
            </Card>

            {/* PRODUCT CARD DEMO */}
            <div className="col-span-1 lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Product Cards (V2)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* Item 1 */}
                 <ProductCard 
                    product={{
                      title: "Sony PlayStation 5 Console (Slim Edition)",
                      price: 499.99,
                      rating: 4.8,
                      reviews: 1240,
                      image: "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?auto=format&fit=crop&q=80&w=600",
                      badges: { bestSeller: true, prime: true }
                    }}
                 />
                 {/* Item 2 */}
                 <ProductCard 
                    product={{
                      title: "Apple MacBook Pro 14 M3 Max 1TB Space Black",
                      price: 3199.00,
                      rating: 4.9,
                      reviews: 85,
                      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=600",
                      badges: { discount: "-15%" }
                    }}
                 />
                 {/* Item 3 */}
                 <ProductCard 
                    product={{
                      title: "Vintage 1996 Chicago Bulls Jersey - Mint Condition",
                      price: 245.50,
                      originalPrice: 350.00,
                      rating: 4.5,
                      reviews: 12,
                      image: "https://images.unsplash.com/photo-1577439360824-7cc99335a968?auto=format&fit=crop&q=80&w=600",
                      badges: {}
                    }}
                 />
                  {/* Item 4 */}
                  <ProductCard 
                    product={{
                      title: "Logitech MX Master 3S Performance Wireless Mouse",
                      price: 99.99,
                      rating: 4.7,
                      reviews: 8543,
                      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600",
                      badges: { prime: true }
                    }}
                 />
              </div>
            </div>

            {/* TWEET CARD */}
            <Card className="bg-transparent border-0 shadow-none col-span-1 lg:col-span-2">
              <CardHeader className="px-0"><CardTitle>Tweet Card (Container Style)</CardTitle></CardHeader>
              <CardContent className="px-0">
                 <TweetCard 
                   author={{
                     name: "Treido Official",
                     handle: "@treido",
                     avatar: "https://github.com/shadcn.png",
                     verified: true
                   }}
                   content="We just launched our new design system v2. It's cleaner, faster, and 100% accessible. Open source soon! 🚀 #designsystem #ui"
                   metrics={{
                     likes: 1240,
                     retweets: 48,
                     replies: 12
                   }}
                   timestamp="2h"
                 />
              </CardContent>
            </Card>


            {/* SOCIAL PROOF */}
            <Card>
              <CardHeader><CardTitle>Social Proof & Avatars</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                   <div className="text-sm text-muted-foreground mb-2">Trust Signals</div>
                   <div className="space-y-2">
                      <SocialProof rating={4.8} reviewCount={1240} verified />
                      <SocialProof rating={3.5} reviewCount={42} label="Satisfactory" />
                      <SocialProof rating={5.0} reviewCount={8} label="New Arrival" />
                   </div>
                </div>

                <Separator />

                <div>
                   <div className="text-sm text-muted-foreground mb-2">Avatar Stacks</div>
                   <div className="flex items-center gap-8">
                      <AvatarGroup 
                        users={[
                          { name: "A", initials: "JD" },
                          { name: "B", initials: "SM" },
                          { name: "C", initials: "TB" },
                          { name: "D", initials: "X" },
                          { name: "E", initials: "Y" },
                        ]} 
                        limit={3}
                      />
                      <AvatarGroup 
                        size="sm"
                        users={[
                          { name: "A", initials: "A" },
                          { name: "B", initials: "B" },
                          { name: "C", initials: "C" },
                        ]} 
                      />
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* B2B DATA TABLE - DENSITY TEST */}
            <div className="col-span-1 lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Marketplace Layout (B2B/C2C)</h3>
              <div className="flex flex-col lg:flex-row gap-8 bg-muted/50 p-6 rounded-2xl border border-dashed border-border">
                 
                 {/* Sidebar Area */}
                 <div className="hidden lg:block shrink-0 w-60">
                    <div className="bg-background rounded-xl p-4 shadow-sm border border-border">
                       <FilterSidebar />
                    </div>
                 </div>

                 {/* Content Area */}
                 <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-bold tracking-tight">Search Results</h2>
                       <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground mr-2">1,240 results</span>
                          <Select defaultValue="rel">
                            <SelectTrigger className="w-36 h-9">
                                <SelectValue placeholder="Sort by" />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="rel">Relevance</SelectItem>
                                <SelectItem value="low">Price: Low to High</SelectItem>
                                <SelectItem value="new">Newest Arrivals</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ProductCard 
                          product={{
                              title: "Sony PlayStation 5 Console (Slim Edition)",
                              price: 499.99,
                              rating: 4.8,
                              reviews: 1240,
                              image: "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?auto=format&fit=crop&q=80&w=600",
                              badges: { bestSeller: true, prime: true }
                          }}
                        />
                        <ProductCard 
                          product={{
                              title: "Apple MacBook Pro 14 M3 Max 1TB Space Black",
                              price: 3199.00,
                              rating: 4.9,
                              reviews: 85,
                              image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=600",
                              badges: { discount: "-15%" }
                          }}
                        />
                        <ProductCard 
                          product={{
                              title: "Logitech MX Master 3S Performance Wireless Mouse",
                              price: 99.99,
                              rating: 4.7,
                              reviews: 8543,
                              image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600",
                              badges: { prime: true }
                          }}
                        />
                    </div>

                    {/* Simple Pagination */}
                    <div className="flex justify-center pt-8">
                       <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" disabled>Previous</Button>
                          <Button variant="outline" size="sm" className="bg-brand-50 border-brand-200 text-brand-600 font-bold">1</Button>
                          <Button variant="outline" size="sm" className="border-transparent">2</Button>
                          <Button variant="outline" size="sm" className="border-transparent">3</Button>
                          <span className="text-muted-foreground/70 px-2">...</span>
                          <Button variant="outline" size="sm">Next</Button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* B2B DATA TABLE - DENSITY TEST */}
            <div className="col-span-1 lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">B2B Data Density</h3>
              <Card>
                 <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-24">Order ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Product</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1,2,3,4,5].map((i) => (
                        <TableRow key={i}>
                           <TableCell className="font-mono text-xs font-medium">#ORD-7{i}29</TableCell>
                           <TableCell>
                              <Badge variant={i%2===0 ? "secondary" : "default"} className="font-mono text-2xs uppercase">
                                 {i%2===0 ? "Pending" : "Paid"}
                              </Badge>
                           </TableCell>
                           <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                 <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-2xs">U{i}</AvatarFallback>
                                 </Avatar>
                                 <span className="text-sm">Acme Corp</span>
                              </div>
                           </TableCell>
                           <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                              Enterprise License (Tier {i})
                           </TableCell>
                           <TableCell className="text-right font-mono text-sm">
                              ${(i * 1200.50).toLocaleString()}
                           </TableCell>
                           <TableCell>
                             <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                 </Table>
              </Card>
            </div>

            {/* FORM INPUTS */}
            <Card>
              <CardHeader><CardTitle>Form Elements</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Email Address</label>
                   <Input placeholder="name@example.com" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select one" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tech">Electronics</SelectItem>
                            <SelectItem value="clothes">Fashion</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Notifications</label>
                       <div className="flex items-center space-x-2 h-10">
                          <Switch id="airplane-mode" />
                          <label htmlFor="airplane-mode" className="text-sm text-muted-foreground">Push enabled</label>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Product Description</label>
                    <Textarea placeholder="Describe the item condition..." className="min-h-20" />
                 </div>
                 <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="terms" />
                    <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I accept terms and conditions
                    </label>
                  </div>
              </CardContent>
            </Card>

             {/* ALERTS & CARDS */}
             <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>
                    You can add components to your app using the cli.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Your session has expired. Please log in again.
                  </AlertDescription>
                </Alert>

                {/* Example Product Card */}
                <Card className="overflow-hidden">
                   <div className="aspect-video bg-muted relative flex items-center justify-center text-muted-foreground">
                      <Package className="w-12 h-12 opacity-20" />
                      <Badge className="absolute top-3 left-3 bg-badge-warning-solid text-badge-fg-on-solid border-transparent">New Arrival</Badge>
                   </div>
                   <CardHeader>
                      <div className="flex justify-between items-start">
                         <div>
                            <CardTitle className="text-lg">Mechanical Keyboard</CardTitle>
                            <CardDescription>Keychron K2 Pro Wireless</CardDescription>
                         </div>
                         <div className="text-right">
                            <div className="font-bold text-lg">$129.00</div>
                            <div className="text-xs text-muted-foreground line-through">$149.00</div>
                         </div>
                      </div>
                   </CardHeader>
                   <CardContent>
                      <div className="flex items-center text-sm gap-4 text-muted-foreground">
                         <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-badge-warning-solid fill-badge-warning-solid" />
                            <span className="font-medium text-foreground">4.8</span>
                            <span>(120)</span>
                         </div>
                         <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>NY, USA</span>
                         </div>
                      </div>
                   </CardContent>
                   <CardFooter className="gap-2">
                      <Button className="w-full">Add to Cart</Button>
                      <Button variant="outline" size="icon"><Heart className="w-4 h-4" /></Button>
                   </CardFooter>
                </Card>
             </div>

          </div>
        </section>

        <Separator />

        {/* 4. LAYOUT & DEPTH */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">04. Layout & Depth</h2>
            <p className="text-muted-foreground text-lg">Elevation, surfaces, and rounded corners.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Shadows */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Elevation (Shadows)</h3>
              <div className="grid grid-cols-2 gap-6">
                 {[
                   { name: "2xs", var: "shadow-2xs" },
                   { name: "xs", var: "shadow-xs" },
                   { name: "sm", var: "shadow-sm" },
                   { name: "md", var: "shadow-md" },
                   { name: "lg", var: "shadow-lg" },
                   { name: "xl", var: "shadow-xl" },
                   { name: "2xl", var: "shadow-2xl" },
                   { name: "Card", var: "shadow-card" }
                 ].map((shadow) => (
                   <div key={shadow.name} className="flex flex-col items-center justify-center p-6 bg-card rounded-lg border border-border/50" style={{ boxShadow: `var(--${shadow.var})` }}>
                     <span className="font-semibold text-sm">Shadow {shadow.name}</span>
                     <span className="text-2xs text-muted-foreground font-mono mt-1">--{shadow.var}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Radius Scale */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Border Radius</h3>
              <div className="flex flex-col gap-4">
                {[
                  { name: "sm", var: "radius-sm" },
                  { name: "md", var: "radius-md" },
                  { name: "lg", var: "radius-lg" },
                  { name: "xl", var: "radius-xl" },
                  { name: "2xl", var: "radius-2xl" },
                  { name: "3xl", var: "radius-3xl" },
                  { name: "4xl", var: "radius-4xl" },
                ].map((radius) => (
                  <div key={radius.name} className="flex items-center gap-4">
                    <div className="h-12 w-24 bg-card border flex items-center justify-center" style={{ borderRadius: `var(--${radius.var})` }}>
                      <span className="text-xs">Box</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Radius {radius.name}</div>
                      <code className="text-2xs text-muted-foreground">var(--{radius.var})</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* 5. E-COMMERCE PATTERNS */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">05. Marketplace Primitives</h2>
            <p className="text-muted-foreground text-lg">Specialized components for commerce data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pricing Patterns */}
            <Card>
              <CardHeader><CardTitle>Price Variants</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">$1,299.00</span>
                  <span className="text-sm text-muted-foreground">Standard Price</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-destructive">$899.00</span>
                  <span className="text-base text-muted-foreground line-through">$1,299.00</span>
                  <Badge variant="destructive" className="ml-2">-30%</Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">B2B Price:</span>
                  <span className="text-lg font-mono text-primary">$850.00</span>
                  <span className="text-xs text-muted-foreground">(Min. 5 units)</span>
                </div>
              </CardContent>
            </Card>

            {/* Seller Badges */}
            <Card>
              <CardHeader><CardTitle>Seller Identify</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="gap-1 border-primary/20 text-primary bg-primary/5">
                    <ShieldCheck className="w-3 h-3" /> Verified Seller
                  </Badge>
                  <Badge variant="outline" className="gap-1 border-warning/20 text-warning bg-warning/10">
                    <Star className="w-3 h-3 fill-current" /> Top Rated
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Store className="w-3 h-3" /> Official Store
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-2">
                     <Avatar className="h-8 w-8 border">
                       <AvatarFallback>AM</AvatarFallback>
                     </Avatar>
                     <div className="text-sm">
                        <div className="font-medium">AudioMaster Pro</div>
                        <div className="text-xs text-muted-foreground">98% Positive • 5k+ Sales</div>
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Condition Tags - Custom OKLCH Tokens */}
            <Card className="md:col-span-2">
              <CardHeader><CardTitle>Product Condition</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge className="border-0 text-white hover:bg-opacity-90" style={{ backgroundColor: 'var(--color-badge-condition-new)' }}>New</Badge>
                  <Badge className="border-0 text-white hover:bg-opacity-90" style={{ backgroundColor: 'var(--color-badge-condition-likenew)' }}>Like New</Badge>
                  <Badge className="border-0 text-white hover:bg-opacity-90" style={{ backgroundColor: 'var(--color-badge-condition-good)' }}>Good</Badge>
                  <Badge className="border-0 text-white hover:bg-opacity-90" style={{ backgroundColor: 'var(--color-badge-condition-fair)' }}>Fair</Badge>
                  <Badge className="border-0 text-white hover:bg-opacity-90" style={{ backgroundColor: 'var(--color-badge-condition-used)' }}>Used</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Using mapped OKLCH values from global tokens.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* 6. DATA DISPLAY */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">06. Data Display</h2>
            <p className="text-muted-foreground text-lg">Tables, lists, and avatars.</p>
          </div>

          {/* Tables */}
          <Card>
            <Table>
              <TableCaption>Recent Orders</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>
                     <Badge variant="outline" className="border-success/20 bg-success/10 text-success">Paid</Badge>
                  </TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV002</TableCell>
                  <TableCell>
                     <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">Pending</Badge>
                  </TableCell>
                  <TableCell>PayPal</TableCell>
                  <TableCell className="text-right">$145.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature List / Key-Value */}
            <Card>
              <CardHeader><CardTitle>Product Specs</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground text-sm">Brand</span>
                  <span className="font-medium text-sm">Sony</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground text-sm">Model</span>
                  <span className="font-medium text-sm">WH-1000XM5</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground text-sm">Connectivity</span>
                  <span className="font-medium text-sm">Bluetooth 5.2</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground text-sm">Battery Life</span>
                  <span className="font-medium text-sm">30 Hours</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Proof / Avatars */}
            <Card>
              <CardHeader><CardTitle>Social Proof</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <Avatar className="border-2 border-background w-10 h-10">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background w-10 h-10">
                      <AvatarImage src="https://github.com/vercel.png" />
                      <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background w-10 h-10">
                      <AvatarImage src="https://github.com/facebook.png" />
                      <AvatarFallback>FB</AvatarFallback>
                    </Avatar>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-background text-xs font-medium">
                      +42
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">148 authors</span> verified
                  </div>
                </div>

                <div className="flex items-center gap-1">
                   {[1,2,3,4,5].map(s => (
                     <Star key={s} className="w-5 h-5 fill-rating text-rating" />
                   ))}
                   <span className="ml-2 font-bold">4.9</span>
                   <span className="text-muted-foreground text-sm">(2,304 reviews)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* 7. FEEDBACK & OVERLAYS */}
        <section className="space-y-8">
           <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">07. Feedback & Overlays</h2>
            <p className="text-muted-foreground text-lg">Loading states and modal surfaces.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle>Loading States</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-2">
                   <div className="text-sm font-medium">Skeleton Card</div>
                   <div className="border rounded-lg p-4 space-y-3">
                      <Skeleton className="h-32 w-full rounded-md" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <div className="text-sm font-medium">Progress Indicator</div>
                   <Progress value={33} className="w-full" />
                   <p className="text-xs text-muted-foreground">33% complete</p>
                 </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
               <Card>
                 <CardHeader><CardTitle>Static Dialog Preview</CardTitle></CardHeader>
                 <CardContent>
                   <div className="border rounded-xl shadow-2xl p-6 bg-popover max-w-sm mx-auto transform scale-95 origin-top">
                      <div className="font-semibold text-lg mb-2">Confirm Action</div>
                      <p className="text-sm text-muted-foreground mb-4">Are you sure you want to purchase this item?</p>
                      <div className="flex justify-end gap-2 text-sm">
                        <Button variant="outline" size="sm">Cancel</Button>
                        <Button size="sm">Confirm</Button>
                      </div>
                   </div>
                 </CardContent>
               </Card>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
