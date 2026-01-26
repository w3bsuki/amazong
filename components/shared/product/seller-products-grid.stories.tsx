/**
 * SellerProductsGrid Stories - "More from Seller" horizontal scroll
 *
 * This is real production UI. Styling changes here = styling changes in main app.
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SellerProductsGrid } from "./seller-products-grid"

// =============================================================================
// MOCK DATA
// =============================================================================

const products = [
  {
    id: "spg-1",
    title: "Google Pixel 8 Pro",
    price: 999,
    originalPrice: null,
    image: "/modern-smartphone.jpg",
    rating: 4.7,
    reviews: 1632,
    sellerName: "Tech Haven",
    sellerVerified: true,
    sellerAvatarUrl: "/placeholder-user.jpg",
    condition: "new",
    freeShipping: true,
    categorySlug: "electronics",
    attributes: {},
    slug: "google-pixel-8-pro",
    storeSlug: "tech_haven",
  },
  {
    id: "spg-2",
    title: "Vintage Camera",
    price: 249,
    originalPrice: 299,
    image: "/vintage-camera-still-life.jpg",
    rating: 4.9,
    reviews: 420,
    sellerName: "Tech Haven",
    sellerVerified: true,
    sellerAvatarUrl: "/placeholder-user.jpg",
    condition: "used",
    freeShipping: false,
    categorySlug: "cameras",
    attributes: {},
    slug: "vintage-camera",
    storeSlug: "tech_haven",
  },
  {
    id: "spg-3",
    title: "Portable Speaker",
    price: 79,
    originalPrice: null,
    image: "/portable-speaker.png",
    rating: 4.5,
    reviews: 1280,
    sellerName: "Tech Haven",
    sellerVerified: true,
    sellerAvatarUrl: "/placeholder-user.jpg",
    condition: "like_new",
    freeShipping: true,
    categorySlug: "audio",
    attributes: {},
    slug: "portable-speaker",
    storeSlug: "tech_haven",
  },
  {
    id: "spg-4",
    title: "Gaming Setup Bundle",
    price: 1499,
    originalPrice: 1699,
    image: "/gaming-setup.png",
    rating: 4.8,
    reviews: 312,
    sellerName: "Tech Haven",
    sellerVerified: true,
    sellerAvatarUrl: "/placeholder-user.jpg",
    condition: "refurbished",
    freeShipping: false,
    categorySlug: "gaming",
    attributes: {},
    slug: "gaming-setup-bundle",
    storeSlug: "tech_haven",
  },
]

// =============================================================================
// STORYBOOK META
// =============================================================================

const meta: Meta<typeof SellerProductsGrid> = {
  title: "Commerce/SellerProductsGrid",
  component: SellerProductsGrid,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-xl mx-auto">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  args: {
    products,
    totalCount: 42,
    sellerUsername: "tech_haven",
  },
}
