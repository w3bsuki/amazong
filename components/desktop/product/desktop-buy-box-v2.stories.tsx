/**
 * DesktopBuyBoxV2 Stories - Sticky buy box with embedded seller
 *
 * This is real production UI. Styling changes here = styling changes in main app.
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { DesktopBuyBoxV2 } from "./desktop-buy-box-v2"

const meta: Meta<typeof DesktopBuyBoxV2> = {
  title: "Commerce/DesktopBuyBoxV2",
  component: DesktopBuyBoxV2,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const baseArgs = {
  productId: "prod-001",
  productSlug: "google-pixel-8-pro",
  title: "Google Pixel 8 Pro",
  price: 999,
  originalPrice: 1199,
  condition: "New",
  stock: 12,
  seller: {
    id: "seller-1",
    name: "Tech Haven",
    username: "tech_haven",
    avatarUrl: "/placeholder-user.jpg",
    verified: true,
    rating: 4.8,
    reviewCount: 1632,
    responseTime: "Typically replies in 10 minutes",
    ordersCompleted: 1240,
    location: "Sofia",
  },
  freeShipping: true,
  location: "Sofia",
  primaryImage: "/modern-smartphone.jpg",
}

export const Default: Story = {
  args: baseArgs,
}

export const LowStock: Story = {
  args: {
    ...baseArgs,
    stock: 3,
  },
}

export const OutOfStock: Story = {
  args: {
    ...baseArgs,
    stock: 0,
  },
}
