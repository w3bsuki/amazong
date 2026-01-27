/**
 * Button Stories - Your REAL production button component
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Button } from "./button"
import { Heart, ShoppingCart, Plus, Trash2, Send } from "lucide-react"

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link", "cta", "deal", "black", "brand"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl", "icon", "icon-sm", "icon-lg"],
    },
    disabled: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// VARIANTS
// =============================================================================

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
}

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
}

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
}

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
}

export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
}

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
}

export const Black: Story = {
  args: {
    children: "Add to Cart",
    variant: "black",
  },
}

export const Deal: Story = {
  args: {
    children: "Grab Deal",
    variant: "deal",
  },
}

export const Brand: Story = {
  args: {
    children: "Follow",
    variant: "brand",
  },
}

// =============================================================================
// SIZES
// =============================================================================

export const SizeXS: Story = {
  args: {
    children: "Extra Small",
    size: "xs",
  },
}

export const SizeSM: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
}

export const SizeDefault: Story = {
  args: {
    children: "Default (44px)",
    size: "default",
  },
}

export const SizeLG: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
}

export const SizeXL: Story = {
  args: {
    children: "Hero CTA",
    size: "xl",
  },
}

// =============================================================================
// WITH ICONS
// =============================================================================

export const WithIconLeft: Story = {
  args: {
    children: (
      <>
        <ShoppingCart />
        Add to Cart
      </>
    ),
    variant: "black",
  },
}

export const WithIconRight: Story = {
  args: {
    children: (
      <>
        Send
        <Send />
      </>
    ),
  },
}

export const IconOnly: Story = {
  args: {
    children: <Heart />,
    size: "icon",
    variant: "outline",
    "aria-label": "Add to wishlist",
  },
}

export const IconSmall: Story = {
  args: {
    children: <Plus />,
    size: "icon-sm",
    variant: "ghost",
    "aria-label": "Add item",
  },
}

// =============================================================================
// STATES
// =============================================================================

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
}

export const Loading: Story = {
  args: {
    children: "Processing...",
    disabled: true,
  },
}

// =============================================================================
// ALL VARIANTS SHOWCASE
// =============================================================================

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="black">Black</Button>
      <Button variant="deal">Deal</Button>
      <Button variant="brand">Brand</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="default">Default</Button>
      <Button size="lg">LG</Button>
      <Button size="xl">XL Hero</Button>
    </div>
  ),
}
