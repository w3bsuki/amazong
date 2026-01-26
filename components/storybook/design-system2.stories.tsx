import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import DesignSystemV2Page from "@/app/[locale]/design-system2/page"

const meta: Meta<typeof DesignSystemV2Page> = {
  title: "Design System/V2 Sandbox",
  component: DesignSystemV2Page,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  render: () => <DesignSystemV2Page />,
}
