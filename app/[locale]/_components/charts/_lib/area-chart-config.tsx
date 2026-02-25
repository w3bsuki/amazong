"use client"

import type { ReactNode } from "react"
import { AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "../chart"

export interface AreaChartGradient {
  id: string
  color: string
  startOpacity?: number
  endOpacity?: number
}

interface AreaChartScaffoldProps {
  config: ChartConfig
  data: unknown[]
  gradients: readonly AreaChartGradient[]
  tickFormatter: (value: unknown) => string
  tooltipLabelFormatter: (value: unknown) => string
  tooltipDefaultIndex?: number
  children: ReactNode
  className?: string
}

export function AreaChartScaffold({
  config,
  data,
  gradients,
  tickFormatter,
  tooltipLabelFormatter,
  tooltipDefaultIndex,
  children,
  className = "aspect-auto h-(--chart-h-sm) w-full",
}: AreaChartScaffoldProps) {
  return (
    <ChartContainer config={config} className={className}>
      <AreaChart data={data}>
        <defs>
          {gradients.map((gradient) => (
            <linearGradient
              key={gradient.id}
              id={gradient.id}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={gradient.color}
                stopOpacity={gradient.startOpacity ?? 1.0}
              />
              <stop
                offset="95%"
                stopColor={gradient.color}
                stopOpacity={gradient.endOpacity ?? 0.1}
              />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={tickFormatter}
        />
        <ChartTooltip
          cursor={false}
          {...(typeof tooltipDefaultIndex === "number"
            ? { defaultIndex: tooltipDefaultIndex }
            : {})}
          content={
            <ChartTooltipContent
              labelFormatter={tooltipLabelFormatter}
              indicator="dot"
            />
          }
        />
        {children}
      </AreaChart>
    </ChartContainer>
  )
}

