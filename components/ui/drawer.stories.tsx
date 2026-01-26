import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "./button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer"

const meta = {
  title: "UI/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Bottom: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerOverlay />
        <DrawerHeader>
          <DrawerTitle>Quick actions</DrawerTitle>
          <DrawerDescription>Common marketplace actions.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="space-y-2">
          <Button className="w-full">Create listing</Button>
          <Button variant="secondary" className="w-full">
            View messages
          </Button>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" className="w-full">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
