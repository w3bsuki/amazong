/**
 * QuickViewSellerCard Stories - Seller card used in product quick view
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { QuickViewSellerCard } from "./quick-view-seller-card"

const meta: Meta<typeof QuickViewSellerCard> = {
  title: "Commerce/QuickViewSellerCard",
  component: QuickViewSellerCard,
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

export const Default: Story = {
  args: {
    sellerName: "Tech Haven",
    sellerAvatarUrl: "/placeholder-user.jpg",
    emailVerified: true,
    phoneVerified: true,
    idVerified: false,
    isVerifiedBusiness: false,
    onNavigateToProduct: () => {},
  },
}

export const BusinessVerified: Story = {
  args: {
    sellerName: "Industrial Supply Co.",
    sellerAvatarUrl: "/placeholder-user.jpg",
    isVerifiedBusiness: true,
    onNavigateToProduct: () => {},
  },
}
