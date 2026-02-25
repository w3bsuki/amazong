"use client"

import * as React from "react"
import { Area } from "recharts"

import { useIsMobile } from "@/hooks/use-is-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AreaChartScaffold } from "../../../_components/charts/_lib/area-chart-config"
import { type ChartConfig } from "../../../_components/charts/chart"
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

function isDateValue(value: unknown): value is string | number | Date {
  return typeof value === "string" || typeof value === "number" || value instanceof Date
}

function formatChartDate(value: unknown, locale: string) {
  if (!isDateValue(value)) {
    return ""
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", {
    month: "short",
    day: "numeric",
  })
}

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
            <SelectContent className="rounded-md">
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
        <AreaChartScaffold
          config={chartConfig}
          data={filteredData}
          gradients={[
            {
              id: "fillOrders",
              color: "var(--color-orders)",
              startOpacity: 1.0,
              endOpacity: 0.1,
            },
            {
              id: "fillSales",
              color: "var(--color-sales)",
              startOpacity: 0.8,
              endOpacity: 0.1,
            },
          ]}
          tickFormatter={(value) => formatChartDate(value, locale)}
          tooltipLabelFormatter={(value) => formatChartDate(value, locale)}
          tooltipDefaultIndex={isMobile ? -1 : 10}
          className="aspect-auto h-(--chart-h-sm) w-full"
        >
          <Area
            dataKey={activeChart}
            type="natural"
            fill={activeChart === "orders" ? "url(#fillOrders)" : "url(#fillSales)"}
            stroke={activeChart === "orders" ? "var(--color-orders)" : "var(--color-sales)"}
            stackId="a"
          />
        </AreaChartScaffold>
      </CardContent>
    </Card>
  )
}
