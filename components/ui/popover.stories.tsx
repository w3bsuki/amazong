import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Separator } from "./separator"

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <div className="text-sm font-semibold">Quick filters</div>
          <div className="text-sm text-muted-foreground">
            Use filters to narrow down your search.
          </div>
          <Separator />
          <div className="text-sm">Example content</div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
