import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Slider } from "./slider"

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <div className="text-sm font-medium">Price range</div>
      <Slider defaultValue={[40]} max={100} step={1} />
    </div>
  ),
}
