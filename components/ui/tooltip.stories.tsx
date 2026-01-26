import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent side="top">Buyer protection included</TooltipContent>
    </Tooltip>
  ),
}
