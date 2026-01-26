/**
 * TrustBadges Stories - Trust block used on product pages
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { TrustBadges } from "./trust-badges"

const meta: Meta<typeof TrustBadges> = {
  title: "Commerce/TrustBadges",
  component: TrustBadges,
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
    verifiedSeller: true,
  },
}
