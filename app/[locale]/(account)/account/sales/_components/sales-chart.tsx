"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shared/charts/chart"

interface SalesChartProps {
  data: { date: string; revenue: number; orders: number }[]
  locale: string
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

export function SalesChart({ data, locale }: SalesChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-(--spacing-scroll-md) text-muted-foreground">
        {locale === "bg" ? "Няма данни за показване" : "No data to display"}
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }

  // Format dates for display
  const formattedData = data.map((item) => ({
    ...item,
    dateFormatted: new Date(item.date).toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    }),
  }))

  return (
    <ChartContainer config={chartConfig} className="h-(--spacing-scroll-md) w-full">
      <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
        <XAxis
          dataKey="dateFormatted"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
          className="text-xs text-muted-foreground"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            if (value >= 1000) {
              return `${(value / 1000).toFixed(0)}k`
            }
            return value.toString()
          }}
          className="text-xs text-muted-foreground"
        />
        <ChartTooltip
          cursor={{ stroke: "var(--color-border)" }}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                if (payload?.[0]?.payload?.date) {
                  return new Date(payload[0].payload.date).toLocaleDateString(locale, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                }
                return ""
              }}
              formatter={(value, name) => {
                if (name === "revenue") {
                  return [formatCurrency(Number(value)), locale === "bg" ? "Приходи" : "Revenue"]
                }
                return [value, locale === "bg" ? "Поръчки" : "Orders"]
              }}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          fill="url(#fillRevenue)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
