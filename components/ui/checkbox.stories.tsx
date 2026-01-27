import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Checkbox } from "./checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox defaultChecked />
      Free shipping
    </label>
  ),
}

export const Disabled: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <Checkbox disabled />
      Disabled option
    </label>
  ),
}
