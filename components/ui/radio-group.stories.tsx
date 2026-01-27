import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Label } from "./label"
import { RadioGroup, RadioGroupItem } from "./radio-group"

const meta: Meta<typeof RadioGroup> = {
  title: "Primitives/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="standard" className="grid gap-3">
      <label className="flex items-center gap-2 text-sm">
        <RadioGroupItem value="standard" id="shipping-standard" />
        <Label htmlFor="shipping-standard">Standard shipping</Label>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <RadioGroupItem value="express" id="shipping-express" />
        <Label htmlFor="shipping-express">Express shipping</Label>
      </label>
    </RadioGroup>
  ),
}
