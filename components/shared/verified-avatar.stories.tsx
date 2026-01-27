/**
 * VerifiedAvatar Stories - Real production verified avatar
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { VerifiedAvatar } from "./verified-avatar"

const meta: Meta<typeof VerifiedAvatar> = {
  title: "Commerce/VerifiedAvatar",
  component: VerifiedAvatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    name: "Alex Johnson",
    avatarUrl: "https://i.pravatar.cc/150?u=alex",
    size: "md",
    showRing: true,
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    showRing: { control: "boolean" },
    emailVerified: { control: "boolean" },
    phoneVerified: { control: "boolean" },
    idVerified: { control: "boolean" },
    isVerifiedBusiness: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const EmailVerified: Story = {
  args: { emailVerified: true },
}

export const PhoneVerified: Story = {
  args: { phoneVerified: true },
}

export const IdVerified: Story = {
  args: { idVerified: true },
}

export const BusinessVerified: Story = {
  args: { isVerifiedBusiness: true },
}

export const WithoutRing: Story = {
  args: { showRing: false, emailVerified: true },
}

export const BoringAvatar: Story = {
  args: {
    avatarUrl: "boring-avatar:beam:2:alex",
    emailVerified: true,
  },
}
