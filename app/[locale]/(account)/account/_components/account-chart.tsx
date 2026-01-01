"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface AccountChartProps {
  locale: string
}

// Generate sample data - in production, this would come from the database
const generateChartData = () => {
  const data = []
  const now = new Date()
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      orders: Math.floor(Math.random() * 5),
      sales: Math.floor(Math.random() * 3),
    })
  }
  return data
}

const chartData = generateChartData()

const chartConfig = {
  activity: {
    label: "Activity",
  },
  orders: {
    label: "Orders",
    color: "var(--color-chart-1)",
  },
  sales: {
    label: "Sales",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

export function AccountChart({ locale }: AccountChartProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [activeChart, setActiveChart] = React.useState<"orders" | "sales">("orders")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    if (!item.date) return false
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })

  const t = {
    title: locale === 'bg' ? 'Дейност' : 'Activity',
    description: locale === 'bg' ? 'Преглед на вашата дейност' : 'Overview of your activity',
    orders: locale === 'bg' ? 'Поръчки' : 'Orders',
    sales: locale === 'bg' ? 'Продажби' : 'Sales',
    last90: locale === 'bg' ? 'Последни 3 месеца' : 'Last 3 months',
    last30: locale === 'bg' ? 'Последни 30 дни' : 'Last 30 days',
    last7: locale === 'bg' ? 'Последни 7 дни' : 'Last 7 days',
  }

  // Hide chart on mobile for cleaner app-like UX
  if (isMobile) {
    return null
  }

  return (
    <Card className="@container/chart">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>
          {t.description}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={activeChart}
            onValueChange={(v) => v && setActiveChart(v as "orders" | "sales")}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/chart:flex"
          >
            <ToggleGroupItem value="orders">{t.orders}</ToggleGroupItem>
            <ToggleGroupItem value="sales">{t.sales}</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/chart:flex"
              aria-label="Select time range"
            >
              <SelectValue placeholder={t.last90} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                {t.last90}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t.last30}
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                {t.last7}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-orders)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-orders)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-US', {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-US', {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey={activeChart}
              type="natural"
              fill={activeChart === "orders" ? "url(#fillOrders)" : "url(#fillSales)"}
              stroke={activeChart === "orders" ? "var(--color-orders)" : "var(--color-sales)"}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
