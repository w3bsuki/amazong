import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"

const meta: Meta<typeof ChartContainer> = {
  title: "Primitives/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}

export default meta
type Story = StoryObj<typeof meta>

const data = [
  { label: "Mon", orders: 32, revenue: 240 },
  { label: "Tue", orders: 41, revenue: 310 },
  { label: "Wed", orders: 28, revenue: 220 },
  { label: "Thu", orders: 52, revenue: 460 },
  { label: "Fri", orders: 44, revenue: 390 },
  { label: "Sat", orders: 61, revenue: 540 },
  { label: "Sun", orders: 38, revenue: 330 },
]

export const LineChartExample: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <ChartContainer
        config={{
          revenue: { label: "Revenue", color: "var(--color-chart-1)" },
          orders: { label: "Orders", color: "var(--color-chart-2)" },
        }}
      >
        <LineChart data={data} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  ),
}
