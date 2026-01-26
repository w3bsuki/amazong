import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select defaultValue="relevance">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relevance">Relevance</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="price_low">Price: Low to High</SelectItem>
        <SelectItem value="price_high">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  ),
}
