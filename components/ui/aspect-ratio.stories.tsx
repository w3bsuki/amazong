import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { AspectRatio } from "./aspect-ratio"

const meta: Meta<typeof AspectRatio> = {
  title: "Primitives/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const SixteenByNine: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9}>
        <div className="bg-muted text-muted-foreground grid h-full w-full place-content-center rounded-md text-sm">
          16:9
        </div>
      </AspectRatio>
    </div>
  ),
}

export const OneByOne: Story = {
  render: () => (
    <div className="w-full max-w-xs">
      <AspectRatio ratio={1}>
        <div className="bg-muted text-muted-foreground grid h-full w-full place-content-center rounded-md text-sm">
          1:1
        </div>
      </AspectRatio>
    </div>
  ),
}
