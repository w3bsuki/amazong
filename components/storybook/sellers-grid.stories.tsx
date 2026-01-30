/**
 * SellersGrid Stories - Seller profile cards used in the Sellers directory
 *
 * Note: this is a route-owned component under `app/**`, so the story lives in
 * `components/storybook/**` and imports the real component for showcase.
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import SellersGrid from "@/components/shared/seller/sellers-grid"

const meta: Meta<typeof SellersGrid> = {
  title: "Commerce/SellersGrid",
  component: SellersGrid,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-5xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    sellers: [
      {
        id: "seller-1",
        username: "tech_haven",
        store_name: "Tech Haven",
        description: "Phones, gadgets, and accessories. Fast shipping.",
        verified: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
        product_count: 420,
        total_rating: 4.8,
        avatar_url: "/placeholder-user.jpg",
      },
      {
        id: "seller-2",
        username: "home_depot_bg",
        store_name: "Home Depot BG",
        description: "Home & kitchen essentials. Weekly deals.",
        verified: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 240).toISOString(),
        product_count: 180,
        total_rating: 4.6,
        avatar_url: "/placeholder-user.jpg",
      },
      {
        id: "seller-3",
        username: "auto_dealer",
        store_name: "Auto Dealer",
        description: "Verified cars and parts. Test drive available.",
        verified: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 540).toISOString(),
        product_count: 72,
        total_rating: 4.9,
        avatar_url: "/placeholder-user.jpg",
      },
      {
        id: "seller-4",
        username: "beauty_corner",
        store_name: "Beauty Corner",
        description: "Skincare and cosmetics. Authentic products only.",
        verified: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
        product_count: 93,
        total_rating: null,
        avatar_url: "/placeholder-user.jpg",
      },
    ],
  },
}
