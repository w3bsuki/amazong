/**
 * Mobile ProductCard Stories
 * 
 * Optimized showcase for mobile product cards at realistic viewport widths.
 * Uses 2-column grid like actual mobile search results.
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ProductCard } from "./product-card"

const meta: Meta<typeof ProductCard> = {
  title: "Commerce/ProductCard/Mobile",
  component: ProductCard,
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 bg-background min-h-screen">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// SAMPLE DATA (matching screenshot issues)
// =============================================================================

const sampleProducts = [
  {
    id: "prod-pants",
    title: "Панталони",
    price: 55,
    originalPrice: 77,
    image: "/modern-smartphone.jpg",
    slug: "pantalone-123",
    username: "seller1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(), // 3 weeks ago
    freeShipping: true,
    inStock: true,
  },
  {
    id: "prod-audi",
    title: "Audi e-tron",
    price: 5,
    originalPrice: 7.5,
    image: "/abstract-beauty.jpg",
    slug: "audi-etron-xyz",
    username: "auto_trader",
    createdAt: new Date(2025, 11, 23).toISOString(), // Dec 23, 2025
    categoryPath: [
      { slug: "automotive", name: "Автомобили", nameBg: "Автомобили" },
      { slug: "electric", name: "Electric", nameBg: "Електрически" },
    ],
    sellerName: "Айсифон",
    sellerVerified: true,
    inStock: true,
  },
]

// =============================================================================
// STORIES - MOBILE GRID VIEW
// =============================================================================

/**
 * Mobile 2-column grid - the actual mobile search layout
 */
export const MobileGrid: Story = {
  decorators: [
    (Story) => (
      <div className="p-3 bg-background">
        <div className="grid grid-cols-2 gap-2">
          <Story />
        </div>
      </div>
    ),
  ],
  render: () => (
    <>
      <ProductCard
        id="m1"
        title="Хулиганка Black Bucket Hat"
        price={55}
        originalPrice={77}
        image="/modern-smartphone.jpg"
        slug="huliganka-hat"
        username="streetwear_bg"
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString()}
        freeShipping={true}
        inStock={true}
        showSeller={false}
      />
      <ProductCard
        id="m2"
        title="Audi e-tron Premium Electric SUV"
        price={5}
        originalPrice={7.5}
        image="/abstract-beauty.jpg"
        slug="audi-etron"
        username="auto_lux"
        createdAt={new Date(2025, 11, 23).toISOString()}
        sellerName="Айсифон"
        showSeller={false}
        inStock={true}
      />
      <ProductCard
        id="m3"
        title="iPhone 15 Pro Max 256GB"
        price={1299}
        image="/gaming-setup.png"
        slug="iphone-15-pro"
        username="techstore"
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()}
        rating={4.9}
        reviews={127}
        inStock={true}
        showSeller={false}
      />
      <ProductCard
        id="m4"
        title="Nike Air Max 90"
        price={149}
        originalPrice={189}
        image="/fitness-watch.jpg"
        slug="nike-air-max"
        username="sneakers_hub"
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()}
        freeShipping={true}
        rating={4.7}
        reviews={89}
        inStock={true}
        showSeller={false}
      />
    </>
  ),
}

/**
 * Single card at mobile width
 */
export const SingleCard: Story = {
  decorators: [
    (Story) => (
      <div className="w-44">
        <Story />
      </div>
    ),
  ],
  args: {
    id: "single-1",
    title: "Samsung Galaxy S24 Ultra",
    price: 999,
    originalPrice: 1199,
    image: "/modern-smartphone.jpg",
    slug: "samsung-s24",
    username: "tech_bg",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    freeShipping: true,
    rating: 4.8,
    reviews: 234,
    inStock: true,
    showSeller: false,
  },
}

/**
 * With all badges visible
 */
export const AllBadges: Story = {
  decorators: [
    (Story) => (
      <div className="w-44">
        <Story />
      </div>
    ),
  ],
  args: {
    id: "badges-1",
    title: "Premium Designer Jacket",
    price: 89,
    originalPrice: 199,
    image: "/abstract-beauty.jpg",
    slug: "designer-jacket",
    username: "fashion_outlet",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    freeShipping: true,
    isBoosted: true,
    rating: 5.0,
    reviews: 12,
    soldCount: 156,
    favoritesCount: 89,
    inStock: true,
    showSeller: false,
  },
}

/**
 * Out of stock state
 */
export const OutOfStock: Story = {
  decorators: [
    (Story) => (
      <div className="w-44">
        <Story />
      </div>
    ),
  ],
  args: {
    id: "oos-1",
    title: "Limited Edition Sneakers",
    price: 299,
    image: "/fitness-watch.jpg",
    slug: "limited-sneakers",
    username: "rare_kicks",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    inStock: false,
    showSeller: false,
  },
}

/**
 * Used/C2C item with condition
 */
export const UsedItem: Story = {
  decorators: [
    (Story) => (
      <div className="w-44">
        <Story />
      </div>
    ),
  ],
  args: {
    id: "used-1",
    title: "MacBook Pro 14\" M3",
    price: 1499,
    originalPrice: 2499,
    image: "/gaming-setup.png",
    slug: "macbook-pro",
    username: "tech_reseller",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    condition: "like_new",
    location: "София",
    inStock: true,
    showSeller: false,
  },
}

/**
 * Comparison: Before/After improvements
 */
export const DesignComparison: Story = {
  decorators: [
    (Story) => (
      <div className="space-y-6 max-w-md">
        <h3 className="text-lg font-semibold text-center">Mobile Card Grid</h3>
        <div className="grid grid-cols-2 gap-2">
          <Story />
        </div>
      </div>
    ),
  ],
  render: () => (
    <>
      {/* Sale + Free Shipping */}
      <ProductCard
        id="comp-1"
        title="Черна шапка Хулиганка"
        price={55}
        originalPrice={77}
        image="/modern-smartphone.jpg"
        slug="black-hat"
        username="street_bg"
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString()}
        freeShipping={true}
        inStock={true}
        showSeller={false}
      />
      {/* Regular price */}
      <ProductCard
        id="comp-2"
        title="Audi e-tron GT quattro"
        price={89999}
        image="/abstract-beauty.jpg"
        slug="audi-etron-gt"
        username="auto_lux"
        createdAt={new Date(2025, 11, 23).toISOString()}
        categoryPath={[
          { slug: "auto", name: "Auto", nameBg: "Автомобили" },
        ]}
        location="Пловдив"
        inStock={true}
        showSeller={false}
      />
      {/* Fresh listing */}
      <ProductCard
        id="comp-3"
        title="AirPods Pro 2nd Gen"
        price={249}
        image="/gaming-setup.png"
        slug="airpods-pro"
        username="tech_store"
        createdAt={new Date(Date.now() - 1000 * 60 * 10).toISOString()}
        rating={4.9}
        reviews={1523}
        inStock={true}
        showSeller={false}
      />
      {/* Big discount */}
      <ProductCard
        id="comp-4"
        title="North Face Puffer Jacket"
        price={159}
        originalPrice={329}
        image="/fitness-watch.jpg"
        slug="north-face"
        username="outdoor_gear"
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()}
        freeShipping={true}
        favoritesCount={234}
        inStock={true}
        showSeller={false}
      />
    </>
  ),
}
