/**
 * FollowSellerButton Stories - Follow/Unfollow CTA used on seller profiles
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { FollowSellerButton } from "./follow-seller-button"

const meta: Meta<typeof FollowSellerButton> = {
  title: "Commerce/FollowSellerButton",
  component: FollowSellerButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

const actions = {
  followSeller: async () => ({ success: true }),
  unfollowSeller: async () => ({ success: true }),
}

export const NotFollowing: Story = {
  args: {
    sellerId: "seller-1",
    initialIsFollowing: false,
    actions,
  },
}

export const Following: Story = {
  args: {
    sellerId: "seller-1",
    initialIsFollowing: true,
    actions,
  },
}
