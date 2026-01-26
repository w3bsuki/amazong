import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Separator } from "./separator"

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <div className="text-sm">Top</div>
      <Separator />
      <div className="text-sm">Bottom</div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center gap-3">
      <div className="text-sm">Left</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Right</div>
    </div>
  ),
}
