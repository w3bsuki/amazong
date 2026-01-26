/**
 * LocaleSwitcher Stories - Real production locale switcher
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { LocaleSwitcher } from "./locale-switcher"

const meta: Meta<typeof LocaleSwitcher> = {
  title: "Shared/LocaleSwitcher",
  component: LocaleSwitcher,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    align: "end",
  },
  argTypes: {
    align: { control: "select", options: ["start", "center", "end"] },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const English: Story = {}

export const Bulgarian: Story = {
  parameters: {
    globals: {
      locale: "bg",
    },
  },
}
