import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Skeleton } from "./skeleton"

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Card: Story = {
  render: () => (
    <div className="w-80 space-y-3 rounded-lg border p-4">
      <Skeleton className="h-32 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  ),
}
