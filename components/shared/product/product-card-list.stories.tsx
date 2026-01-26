/**
 * ProductCardList Stories - Horizontal list view (OLX/Bazar style)
 *
 * This is real production UI. Styling changes here = styling changes in main app.
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ProductCardList } from "./product-card-list"

// =============================================================================
// STORYBOOK META
// =============================================================================

const meta: Meta<typeof ProductCardList> = {
  title: "Commerce/ProductCardList",
  component: ProductCardList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    price: { control: { type: "number", min: 0 } },
    originalPrice: { control: { type: "number", min: 0 } },
    freeShipping: { control: "boolean" },
    inStock: { control: "boolean" },
    isBoosted: { control: "boolean" },
    showWishlist: { control: "boolean" },
    showBuyerProtection: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// BASE PROPS
// =============================================================================

const baseProduct = {
  id: "list-001",
  title: "iPhone 13 Pro Max — 256GB (Sierra Blue)",
  price: 599,
  originalPrice: 999,
  image: "/modern-smartphone.jpg",
  isBoosted: true,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  description: "Excellent condition. Battery health 91%. Includes original box + charger.",
  sellerId: "seller-1",
  sellerName: "tech_haven",
  sellerVerified: true,
  freeShipping: true,
  location: "Sofia",
  slug: "iphone-13-pro-max-256gb",
  username: "tech_haven",
  inStock: true,
  showWishlist: true,
  condition: "used",
  showBuyerProtection: true,
}

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  args: baseProduct,
}

export const OutOfStock: Story = {
  args: {
    ...baseProduct,
    id: "list-002",
    inStock: false,
    showWishlist: false,
    freeShipping: false,
  },
}

export const NoDiscount: Story = {
  args: {
    ...baseProduct,
    id: "list-003",
    title: "Office Chair — Ergonomic Mesh",
    price: 129,
    originalPrice: null,
    image: "/office-chair.jpg",
    isBoosted: false,
    condition: "like_new",
    description: "Used for 2 months. Gives good back support.",
  },
}

export const Minimal: Story = {
  args: {
    id: "list-004",
    title: "Simple Listing",
    price: 29.99,
    image: "/placeholder.jpg",
  },
}
