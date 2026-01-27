/**
 * Badge Stories - Professional E-commerce Badge System
 * 
 * Tight palette for B2B/C2C/C2B:
 * 🔴 Red = urgency/deals  🟠 Orange = promo  🟢 Green = success
 * 🔵 Blue = trust         🟡 Amber = warning  ⚫ Gray = muted
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Badge } from "./badge"
import { Check, Truck, Star, Zap, ShieldCheck, Package, Clock, X, Tag, Recycle } from "lucide-react"

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default", "secondary", "destructive", "outline",
        "success", "warning", "critical", "info",
        "success-subtle", "warning-subtle", "critical-subtle", "info-subtle", "neutral-subtle",
        "condition-new", "condition-likenew", "condition-good", "condition-fair", "condition-used", "condition-refurb",
        "shipping", "shipping-subtle", "shipping-express",
        "stock-available", "stock-low", "stock-out",
        "promo", "discount", "deal", "sale", "limited-time", "promoted", "sponsored",
        "verified", "verified-solid", "top-rated",
        "category",
      ],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// INTERACTIVE PLAYGROUND
// =============================================================================

export const Playground: Story = {
  args: { 
    children: "Badge",
    variant: "default",
  },
}

// =============================================================================
// SHOWCASES - Organized by Use Case
// =============================================================================

/**
 * Core base variants - shadcn/ui defaults
 */
export const CoreVariants: Story = {
  name: "Core Variants",
  render: () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-muted-foreground mb-2">Base Variants</div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
    </div>
  ),
}

/**
 * Status badges in SOLID style - high emphasis, alerts
 */
export const StatusSolid: Story = {
  name: "Status — Solid (High Emphasis)",
  render: () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        Use solid badges sparingly for important alerts
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="success"><Check className="size-3" />Success</Badge>
        <Badge variant="warning"><Clock className="size-3" />Warning</Badge>
        <Badge variant="critical"><X className="size-3" />Critical</Badge>
        <Badge variant="info">Info</Badge>
      </div>
    </div>
  ),
}

/**
 * Status badges in SUBTLE style - low emphasis, default choice
 */
export const StatusSubtle: Story = {
  name: "Status — Subtle (Low Emphasis)",
  render: () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        Subtle badges are the default choice for most status indicators
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="success-subtle">In Stock</Badge>
        <Badge variant="warning-subtle">Low Stock</Badge>
        <Badge variant="critical-subtle">Out of Stock</Badge>
        <Badge variant="info-subtle">Pre-order</Badge>
        <Badge variant="neutral-subtle">Draft</Badge>
      </div>
    </div>
  ),
}

/**
 * Product Condition badges (C2C marketplace)
 * Clean, professional look inspired by eBay
 */
export const ProductCondition: Story = {
  name: "Product Condition (C2C)",
  render: () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        eBay-style condition badges — outline style, semantically colored
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="condition-new"><Tag className="size-3" />New</Badge>
        <Badge variant="condition-likenew">Like New</Badge>
        <Badge variant="condition-good">Good</Badge>
        <Badge variant="condition-fair">Fair</Badge>
        <Badge variant="condition-used">Used</Badge>
        <Badge variant="condition-refurb"><Recycle className="size-3" />Refurb</Badge>
      </div>
    </div>
  ),
}

/**
 * E-commerce specific badges
 */
export const ECommerce: Story = {
  name: "E-Commerce",
  render: () => (
    <div className="space-y-6">
      {/* Shipping & Trust */}
      <div>
        <div className="text-sm font-medium text-muted-foreground mb-2">Shipping & Trust</div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="shipping"><Truck className="size-3" />Free Shipping</Badge>
          <Badge variant="shipping-express"><Zap className="size-3" />Express</Badge>
          <Badge variant="verified"><ShieldCheck className="size-3" />Verified Seller</Badge>
          <Badge variant="verified-solid"><ShieldCheck className="size-3" />Verified</Badge>
          <Badge variant="top-rated"><Star className="size-3" />Top Rated</Badge>
        </div>
      </div>
      
      {/* Deals & Promotions */}
      <div>
        <div className="text-sm font-medium text-muted-foreground mb-2">Deals & Promotions</div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="promo">Promo</Badge>
          <Badge variant="discount">-29%</Badge>
          <Badge variant="discount">-15%</Badge>
          <Badge variant="deal">Hot Deal</Badge>
          <Badge variant="sale">Sale</Badge>
          <Badge variant="limited-time"><Clock className="size-3" />Limited Time</Badge>
          <Badge variant="promoted">Ad</Badge>
          <Badge variant="sponsored">Sponsored</Badge>
        </div>
      </div>
      
      {/* Stock Status */}
      <div>
        <div className="text-sm font-medium text-muted-foreground mb-2">Stock Status</div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="stock-available"><Check className="size-3" />In Stock</Badge>
          <Badge variant="stock-low"><Clock className="size-3" />Only 3 left</Badge>
          <Badge variant="stock-out"><X className="size-3" />Sold Out</Badge>
        </div>
      </div>
    </div>
  ),
}

/**
 * Real-world product card example
 */
export const ProductCardExample: Story = {
  name: "Product Card Context",
  render: () => (
    <div className="w-64 rounded-lg border bg-card p-4 space-y-3">
      {/* Image placeholder */}
      <div className="aspect-square rounded-md bg-muted relative">
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge variant="promo">Promo</Badge>
          <Badge variant="discount">-25%</Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="condition-likenew">Like New</Badge>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-medium text-sm">iPhone 14 Pro Max 256GB</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">$899</span>
          <span className="text-sm text-muted-foreground line-through">$1,199</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="shipping-subtle"><Truck className="size-3" />Free</Badge>
          <Badge variant="verified"><ShieldCheck className="size-3" />Verified</Badge>
        </div>
        <Badge variant="stock-low">Only 2 left</Badge>
      </div>
    </div>
  ),
}
