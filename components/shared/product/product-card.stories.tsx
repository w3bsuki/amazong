/**
 * ProductCard Stories - Your REAL production product card
 * 
 * This is the actual component used on homepage, search, seller pages.
 * Styling changes here = styling changes everywhere.
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ProductCard } from "./product-card"

const meta: Meta<typeof ProductCard> = {
  title: "Commerce/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-56">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    price: { control: { type: "number", min: 0 } },
    originalPrice: { control: { type: "number", min: 0 } },
    rating: { control: { type: "number", min: 0, max: 5, step: 0.1 } },
    reviews: { control: { type: "number", min: 0 } },
    freeShipping: { control: "boolean" },
    inStock: { control: "boolean" },
    isBoosted: { control: "boolean" },
    showWishlist: { control: "boolean" },
    showQuickAdd: { control: "boolean" },
    showSeller: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// BASE PROPS
// =============================================================================

const baseProduct = {
  id: "prod-001",
  title: "Google Pixel 8 Pro",
  price: 999,
  image: "/modern-smartphone.jpg",
  slug: "google-pixel-8-pro",
  username: "tech_haven",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  categoryPath: [
    { slug: "electronics", name: "Електроника" },
    { slug: "smartphones", name: "Смартфони" },
  ],
  sellerName: "tech_haven",
  sellerAvatarUrl: "/placeholder-user.jpg",
  sellerVerified: true,
  rating: 4.7,
  reviews: 1632,
  inStock: true,
  showWishlist: true,
  showQuickAdd: true,
  showSeller: true,
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default product card as it appears in search results
 */
export const Default: Story = {
  args: baseProduct,
}

/**
 * Product with discount - shows crossed price + badge
 */
export const OnSale: Story = {
  args: {
    ...baseProduct,
    id: "prod-002",
    title: "SK-II Facial Treatment Essence",
    price: 185,
    originalPrice: 235,
    isOnSale: true,
    salePercent: 21,
    image: "/abstract-beauty.jpg",
    categoryPath: [{ slug: "beauty", name: "Красота" }],
    rating: 4.5,
    reviews: 5700,
  },
}

/**
 * Promoted/Boosted listing with "Промо" badge
 */
export const Promoted: Story = {
  args: {
    ...baseProduct,
    id: "prod-003",
    isBoosted: true,
  },
}

/**
 * Out of stock state
 */
export const OutOfStock: Story = {
  args: {
    ...baseProduct,
    id: "prod-004",
    inStock: false,
    showQuickAdd: false,
  },
}

/**
 * With free shipping indicator
 */
export const FreeShipping: Story = {
  args: {
    ...baseProduct,
    id: "prod-005",
    freeShipping: true,
  },
}

/**
 * C2C used item with condition badge
 */
export const UsedCondition: Story = {
  args: {
    ...baseProduct,
    id: "prod-006",
    title: "iPhone 13 Pro Max",
    price: 599,
    originalPrice: 999,
    condition: "used",
    image: "/modern-smartphone.png",
    sellerVerified: false,
    location: "Sofia, Bulgaria",
  },
}

/**
 * B2B product with MOQ and business badges
 */
export const B2BProduct: Story = {
  args: {
    ...baseProduct,
    id: "prod-007",
    title: "Industrial LED Panels (Pack of 10)",
    price: 45.99,
    minOrderQuantity: 10,
    businessVerified: true,
    samplesAvailable: true,
    image: "/electronics-components.png",
  },
}

/**
 * Minimal data - sparse product info
 */
export const MinimalData: Story = {
  args: {
    id: "prod-008",
    title: "Simple Product",
    price: 29.99,
    image: "/placeholder.jpg",
  },
}

/**
 * High engagement product
 */
export const HighEngagement: Story = {
  args: {
    ...baseProduct,
    id: "prod-009",
    rating: 4.9,
    reviews: 15420,
    favoritesCount: 2341,
    soldCount: 8500,
  },
}

/**
 * Freshly listed product
 */
export const Fresh: Story = {
  args: {
    ...baseProduct,
    id: "prod-010",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
}

/**
 * Automotive product with smart badge
 */
export const Automotive: Story = {
  args: {
    id: "prod-011",
    title: "BMW 320d xDrive",
    price: 25000,
    image: "/retro-living-room-tv.jpg",
    categoryRootSlug: "automotive",
    categoryPath: [
      { slug: "automotive", name: "Автомобили" },
      { slug: "cars", name: "Коли" },
    ],
    attributes: {
      make: "BMW",
      model: "320d",
      year: 2021,
    },
    location: "Plovdiv",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    sellerName: "auto_dealer",
    sellerVerified: true,
    showSeller: true,
  },
}

/**
 * Fully verified seller
 */
export const VerifiedSeller: Story = {
  args: {
    ...baseProduct,
    id: "prod-012",
    sellerVerified: true,
    sellerEmailVerified: true,
    sellerPhoneVerified: true,
    sellerIdVerified: true,
    showBuyerProtection: true,
  },
}

// =============================================================================
// GRID SHOWCASE
// =============================================================================

export const ProductGrid: Story = {
  decorators: [
    (Story) => (
      <div className="grid w-full max-w-xl grid-cols-2 gap-4">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <ProductCard {...baseProduct} />
      <ProductCard
        {...baseProduct}
        id="prod-grid-2"
        title="SK-II Facial Treatment"
        price={185}
        originalPrice={235}
        image="/abstract-beauty.png"
        isBoosted
      />
      <ProductCard
        {...baseProduct}
        id="prod-grid-3"
        title="RGB Gaming Mouse"
        price={59.99}
        originalPrice={79.99}
        image="/gaming-setup.png"
        freeShipping
      />
      <ProductCard
        {...baseProduct}
        id="prod-grid-4"
        title="Philips Sonicare"
        price={199.99}
        image="/fitness-watch.jpg"
        rating={5.0}
        reviews={2}
      />
    </>
  ),
}
