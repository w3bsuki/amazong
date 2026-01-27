import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { DesignSystemClient } from "@/app/[locale]/design-system/_components/design-system-client"

const meta: Meta<typeof DesignSystemClient> = {
  title: "Design System/Tokens",
  component: DesignSystemClient,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => <DesignSystemClient />,
}
