import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Progress } from "./progress"

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    value: { control: { type: "number", min: 0, max: 100 } },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: 45 },
  render: (args) => (
    <div className="w-80">
      <Progress {...args} />
    </div>
  ),
}
