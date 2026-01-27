import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Switch } from "./switch"

const meta: Meta<typeof Switch> = {
  title: "Primitives/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <label className="flex items-center gap-3 text-sm">
      <Switch defaultChecked />
      Enable notifications
    </label>
  ),
}
