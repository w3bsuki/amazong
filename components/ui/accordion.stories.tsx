import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"

const meta = {
  title: "Primitives/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "item-1",
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <Accordion {...args}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Shipping</AccordionTrigger>
          <AccordionContent>Free shipping on orders over $50.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Returns</AccordionTrigger>
          <AccordionContent>30-day returns with buyer protection.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const Multiple: Story = {
  args: {
    type: "multiple",
    defaultValue: ["item-1", "item-2"],
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <Accordion {...args}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>Compact, accessible, and keyboard-friendly.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Care</AccordionTrigger>
          <AccordionContent>Wipe clean. Keep away from water.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}
