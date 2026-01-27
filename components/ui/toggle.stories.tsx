import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Heart } from "lucide-react"

import { Toggle } from "./toggle"

const meta: Meta<typeof Toggle> = {
  title: "Primitives/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle favorite">
      <Heart className="size-4" />
    </Toggle>
  ),
}
