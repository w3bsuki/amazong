/**
 * Avatar Stories - Your REAL production avatar component
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// BASIC
// =============================================================================

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/128?u=seller1" alt="User" />
      <AvatarFallback>US</AvatarFallback>
    </Avatar>
  ),
}

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/broken-image.jpg" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
}

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
}

// =============================================================================
// SIZES (using className)
// =============================================================================

export const Small: Story = {
  render: () => (
    <Avatar className="size-6">
      <AvatarImage src="https://i.pravatar.cc/128?u=small" alt="Small" />
      <AvatarFallback className="text-xs">SM</AvatarFallback>
    </Avatar>
  ),
}

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/128?u=default" alt="Default" />
      <AvatarFallback>DF</AvatarFallback>
    </Avatar>
  ),
}

export const Large: Story = {
  render: () => (
    <Avatar className="size-12">
      <AvatarImage src="https://i.pravatar.cc/128?u=large" alt="Large" />
      <AvatarFallback>LG</AvatarFallback>
    </Avatar>
  ),
}

export const ExtraLarge: Story = {
  render: () => (
    <Avatar className="size-16">
      <AvatarImage src="https://i.pravatar.cc/128?u=xl" alt="Extra Large" />
      <AvatarFallback className="text-xl">XL</AvatarFallback>
    </Avatar>
  ),
}

// =============================================================================
// GROUPS
// =============================================================================

export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://i.pravatar.cc/128?u=user1" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://i.pravatar.cc/128?u=user2" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://i.pravatar.cc/128?u=user3" alt="User 3" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>+5</AvatarFallback>
      </Avatar>
    </div>
  ),
}

// =============================================================================
// WITH STATUS INDICATOR
// =============================================================================

export const WithOnlineStatus: Story = {
  render: () => (
    <div className="relative">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/128?u=online" alt="Online User" />
        <AvatarFallback>ON</AvatarFallback>
      </Avatar>
      <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success border-2 border-background" />
    </div>
  ),
}

export const WithVerifiedBadge: Story = {
  render: () => (
    <div className="relative">
      <Avatar className="size-10">
        <AvatarImage src="https://i.pravatar.cc/128?u=verified" alt="Verified Seller" />
        <AvatarFallback>VS</AvatarFallback>
      </Avatar>
      <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border-2 border-background bg-primary">
        <svg className="size-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </span>
    </div>
  ),
}

// =============================================================================
// SELLER AVATAR SHOWCASE
// =============================================================================

export const SellerAvatars: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarImage src="https://i.pravatar.cc/128?u=techhaven" alt="tech_haven" />
          <AvatarFallback className="bg-muted text-foreground text-xs">TH</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">tech_haven</span>
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarImage src="https://i.pravatar.cc/128?u=shop4e" alt="shop4e" />
          <AvatarFallback className="bg-muted text-foreground text-xs">S4</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">shop4e</span>
      </div>
    </div>
  ),
}
