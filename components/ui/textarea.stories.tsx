import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Textarea } from "./textarea"

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <div className="text-sm font-medium">Message</div>
      <Textarea placeholder="Write a message…" />
    </div>
  ),
}
