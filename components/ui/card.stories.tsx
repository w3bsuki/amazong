/**
 * Card Stories - Your REAL production card component
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "./card"
import { Button } from "./button"
import { Badge } from "./badge"

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// BASIC CARDS
// =============================================================================

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area for any elements.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details below</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Fill in the form to create your account.
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button className="w-full">Sign Up</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages</CardDescription>
        <CardAction>
          <Badge variant="info">3 new</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Click to view your notifications.</p>
      </CardContent>
    </Card>
  ),
}

// =============================================================================
// PRODUCT CARD STYLE
// =============================================================================

export const ProductStyle: Story = {
  render: () => (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-muted" />
      <CardContent className="pt-3">
        <p className="font-medium line-clamp-2">
          Google Pixel 8 Pro - 256GB Obsidian
        </p>
        <p className="text-sm text-muted-foreground">Electronics</p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold">999 €</span>
          <span className="text-sm text-muted-foreground line-through">1099 €</span>
          <Badge variant="deal">-9%</Badge>
        </div>
      </CardContent>
    </Card>
  ),
}

// =============================================================================
// STATS CARD
// =============================================================================

export const StatsCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-2xl">€45,231.89</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          <span className="text-success">+20.1%</span> from last month
        </p>
      </CardContent>
    </Card>
  ),
}

// =============================================================================
// INTERACTIVE CARD
// =============================================================================

export const Interactive: Story = {
  render: () => (
    <Card className="cursor-pointer hover:border-hover-border transition-colors">
      <CardHeader>
        <CardTitle>Premium Plan</CardTitle>
        <CardDescription>For power sellers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">€29/mo</div>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>✓ Unlimited listings</li>
          <li>✓ Priority support</li>
          <li>✓ Analytics dashboard</li>
        </ul>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button className="w-full" variant="black">
          Upgrade Now
        </Button>
      </CardFooter>
    </Card>
  ),
}
