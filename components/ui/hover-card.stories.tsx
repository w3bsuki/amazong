import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "./button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"

const meta: Meta<typeof HoverCard> = {
  title: "Primitives/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">Seller details</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-1">
          <div className="text-sm font-semibold">tech_haven</div>
          <div className="text-sm text-muted-foreground">
            Verified seller • Ships from Bulgaria
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
