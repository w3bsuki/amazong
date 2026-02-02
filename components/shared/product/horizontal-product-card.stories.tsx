/**
 * HorizontalProductCard Stories - Mobile Strip Cards
 * 
 * Used in horizontal scroll strips like:
 * - PromotedListingsStrip
 * - OffersForYou
 * - RecentlyViewed
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { HorizontalProductCard } from "./horizontal-product-card"
import type { UIProduct } from "@/lib/data/products"

const meta: Meta<typeof HorizontalProductCard> = {
  title: "Commerce/ProductCard/HorizontalStrip",
  component: HorizontalProductCard,
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 bg-background">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// SAMPLE DATA
// =============================================================================

const createProduct = (overrides: Partial<UIProduct>): UIProduct => ({
  id: "prod-1",
  title: "Sample Product",
  price: 99,
  image: "/modern-smartphone.jpg",
  slug: "sample-product",
  storeSlug: "seller1",
  rating: 4.5,
  reviews: 100,
  isBoosted: false,
  freeShipping: false,
  ...overrides,
})

// =============================================================================
// STORIES
// =============================================================================

/**
 * Single card (default width 160px)
 */
export const Default: Story = {
  args: {
    product: createProduct({
      id: "hp-1",
      title: "Wireless Bluetooth Headphones",
      price: 79,
      listPrice: 99,
      rating: 4.7,
      reviews: 234,
    }),
  },
}

/**
 * Promoted listing with AD badge
 */
export const Promoted: Story = {
  args: {
    product: createProduct({
      id: "hp-2",
      title: "Premium Noise Cancelling Earbuds",
      price: 149,
      isBoosted: true,
      rating: 4.9,
      reviews: 1523,
    }),
  },
}

/**
 * With free shipping badge
 */
export const FreeShipping: Story = {
  args: {
    product: createProduct({
      id: "hp-3",
      title: "USB-C Fast Charging Cable 2m",
      price: 12.99,
      listPrice: 19.99,
      freeShipping: true,
      rating: 4.3,
      reviews: 856,
    }),
  },
}

/**
 * All badges (promoted + discount + free shipping)
 */
export const AllBadges: Story = {
  args: {
    product: createProduct({
      id: "hp-4",
      title: "Smart Watch Fitness Tracker Pro",
      price: 59,
      listPrice: 129,
      isBoosted: true,
      freeShipping: true,
      rating: 4.8,
      reviews: 2341,
    }),
  },
}

/**
 * No rating (new product)
 */
export const NoRating: Story = {
  args: {
    product: createProduct({
      id: "hp-5",
      title: "New Arrival Gaming Mouse",
      price: 45,
      rating: 0,
      reviews: 0,
    }),
  },
}

/**
 * Horizontal scroll strip (real use case)
 */
export const HorizontalStrip: Story = {
  decorators: [
    (Story) => (
      <div className="py-3">
        <h3 className="px-3 text-sm font-semibold mb-2">Промоции за теб</h3>
        <div className="flex gap-3 overflow-x-auto px-3 pb-1 snap-x snap-mandatory scrollbar-none">
          <Story />
        </div>
      </div>
    ),
  ],
  render: () => (
    <>
      <HorizontalProductCard
        product={createProduct({
          id: "strip-1",
          title: "Черна шапка Хулиганка",
          price: 55,
          listPrice: 77,
          image: "/modern-smartphone.jpg",
          freeShipping: true,
          rating: 4.5,
          reviews: 89,
        })}
      />
      <HorizontalProductCard
        product={createProduct({
          id: "strip-2",
          title: "Audi e-tron Premium",
          price: 5,
          listPrice: 7.5,
          image: "/abstract-beauty.jpg",
          isBoosted: true,
          rating: 4.9,
          reviews: 12,
        })}
      />
      <HorizontalProductCard
        product={createProduct({
          id: "strip-3",
          title: "iPhone 15 Pro Max",
          price: 1299,
          image: "/gaming-setup.png",
          rating: 4.8,
          reviews: 567,
        })}
      />
      <HorizontalProductCard
        product={createProduct({
          id: "strip-4",
          title: "Nike Air Max 90 White",
          price: 149,
          listPrice: 189,
          image: "/fitness-watch.jpg",
          freeShipping: true,
          rating: 4.6,
          reviews: 234,
        })}
      />
      <HorizontalProductCard
        product={createProduct({
          id: "strip-5",
          title: "JBL Portable Speaker",
          price: 89,
          image: "/modern-smartphone.jpg",
          rating: 4.4,
          reviews: 156,
        })}
      />
    </>
  ),
}
