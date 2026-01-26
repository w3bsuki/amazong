/**
 * Badge Stories - Your REAL production badge component
 * Complete marketplace badge system (condition, shipping, stock, deals)
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Badge } from "./badge"
import { Check, Truck, Star, Zap } from "lucide-react"

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
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
        "deal", "sale", "promoted",
        "verified", "top-rated",
        "category",
      ],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// CORE VARIANTS
// =============================================================================

export const Default: Story = {
  args: { children: "Badge" },
}

export const Secondary: Story = {
  args: { children: "Secondary", variant: "secondary" },
}

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
}

export const Destructive: Story = {
  args: { children: "Error", variant: "destructive" },
}

// =============================================================================
// SEMANTIC STATUS - SOLID
// =============================================================================

export const Success: Story = {
  args: { children: "Success", variant: "success" },
}

export const Warning: Story = {
  args: { children: "Warning", variant: "warning" },
}

export const Critical: Story = {
  args: { children: "Critical", variant: "critical" },
}

export const Info: Story = {
  args: { children: "Info", variant: "info" },
}

// =============================================================================
// SEMANTIC STATUS - SUBTLE
// =============================================================================

export const SuccessSubtle: Story = {
  args: { children: "Completed", variant: "success-subtle" },
}

export const WarningSubtle: Story = {
  args: { children: "Pending", variant: "warning-subtle" },
}

export const CriticalSubtle: Story = {
  args: { children: "Failed", variant: "critical-subtle" },
}

export const InfoSubtle: Story = {
  args: { children: "Processing", variant: "info-subtle" },
}

// =============================================================================
// CONDITION BADGES (C2C Marketplace)
// =============================================================================

export const ConditionNew: Story = {
  args: { children: "New", variant: "condition-new" },
}

export const ConditionLikeNew: Story = {
  args: { children: "Like New", variant: "condition-likenew" },
}

export const ConditionGood: Story = {
  args: { children: "Good", variant: "condition-good" },
}

export const ConditionFair: Story = {
  args: { children: "Fair", variant: "condition-fair" },
}

export const ConditionUsed: Story = {
  args: { children: "Used", variant: "condition-used" },
}

export const ConditionRefurbished: Story = {
  args: { children: "Refurb", variant: "condition-refurb" },
}

// =============================================================================
// SHIPPING BADGES
// =============================================================================

export const FreeShipping: Story = {
  args: {
    children: (
      <>
        <Truck className="size-3" />
        Free Shipping
      </>
    ),
    variant: "shipping",
  },
}

export const ShippingSubtle: Story = {
  args: {
    children: (
      <>
        <Truck className="size-3" />
        Ships in 2 days
      </>
    ),
    variant: "shipping-subtle",
  },
}

export const ExpressShipping: Story = {
  args: {
    children: (
      <>
        <Zap className="size-3" />
        Express
      </>
    ),
    variant: "shipping-express",
  },
}

// =============================================================================
// STOCK STATUS
// =============================================================================

export const InStock: Story = {
  args: {
    children: (
      <>
        <Check className="size-3" />
        In Stock
      </>
    ),
    variant: "stock-available",
  },
}

export const LowStock: Story = {
  args: { children: "Only 3 left!", variant: "stock-low" },
}

export const OutOfStock: Story = {
  args: { children: "Out of Stock", variant: "stock-out" },
}

// =============================================================================
// DEAL/SALE BADGES
// =============================================================================

export const Deal: Story = {
  args: { children: "-25%", variant: "deal" },
}

export const Sale: Story = {
  args: { children: "SALE", variant: "sale" },
}

export const Promoted: Story = {
  args: { children: "Промо", variant: "promoted" },
}

// =============================================================================
// TRUST BADGES
// =============================================================================

export const Verified: Story = {
  args: {
    children: (
      <>
        <Check className="size-3" />
        Verified
      </>
    ),
    variant: "verified",
  },
}

export const TopRated: Story = {
  args: {
    children: (
      <>
        <Star className="size-3" />
        Top Rated
      </>
    ),
    variant: "top-rated",
  },
}

// =============================================================================
// SHOWCASES
// =============================================================================

export const ConditionBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="condition-new">New</Badge>
      <Badge variant="condition-likenew">Like New</Badge>
      <Badge variant="condition-good">Good</Badge>
      <Badge variant="condition-fair">Fair</Badge>
      <Badge variant="condition-used">Used</Badge>
      <Badge variant="condition-refurb">Refurb</Badge>
    </div>
  ),
}

export const ShippingBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="shipping"><Truck className="size-3" />Free</Badge>
      <Badge variant="shipping-subtle"><Truck className="size-3" />2-3 days</Badge>
      <Badge variant="shipping-express"><Zap className="size-3" />Express</Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="critical">Critical</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
}

export const SubtleBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success-subtle">Completed</Badge>
      <Badge variant="warning-subtle">Pending</Badge>
      <Badge variant="critical-subtle">Cancelled</Badge>
      <Badge variant="info-subtle">Processing</Badge>
      <Badge variant="neutral-subtle">Draft</Badge>
    </div>
  ),
}
