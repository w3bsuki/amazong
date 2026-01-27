import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ScrollArea } from "./scroll-area"
import { Separator } from "./separator"

const meta: Meta<typeof ScrollArea> = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <ScrollArea className="h-48 rounded-md border p-3">
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-sm font-medium">Item {idx + 1}</div>
              <div className="text-sm text-muted-foreground">
                Scrollable content inside a fixed container.
              </div>
              {idx !== 11 ? <Separator /> : null}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
}
