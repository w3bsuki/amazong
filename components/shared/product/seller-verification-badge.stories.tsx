/**
 * SellerVerificationBadge Stories - Tiered seller verification indicator
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SellerVerificationBadge } from "./seller-verification-badge"

const meta: Meta<typeof SellerVerificationBadge> = {
  title: "Commerce/SellerVerificationBadge",
  component: SellerVerificationBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex items-center gap-3">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const EmailVerified: Story = {
  args: {
    emailVerified: true,
    variant: "badge",
  },
}

export const PhoneVerified: Story = {
  args: {
    phoneVerified: true,
    variant: "badge",
  },
}

export const IdVerified: Story = {
  args: {
    idVerified: true,
    variant: "badge",
  },
}

export const VerifiedBusiness: Story = {
  args: {
    isVerifiedBusiness: true,
    variant: "badge",
  },
}

export const IconOnly: Story = {
  args: {
    idVerified: true,
    variant: "icon",
    size: "md",
  },
}
