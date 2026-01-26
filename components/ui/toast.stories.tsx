import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import * as React from "react"

import { Button } from "./button"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"

const meta: Meta<typeof Toast> = {
  title: "UI/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false)

    return (
      <ToastProvider swipeDirection="right">
        <Button onClick={() => setOpen(true)}>Show toast</Button>
        <Toast open={open} onOpenChange={setOpen}>
          <div className="grid gap-1">
            <ToastTitle>Saved</ToastTitle>
            <ToastDescription>Your changes have been saved.</ToastDescription>
          </div>
          <ToastAction altText="Undo">Undo</ToastAction>
          <ToastClose aria-label="Close" />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )
  },
}
