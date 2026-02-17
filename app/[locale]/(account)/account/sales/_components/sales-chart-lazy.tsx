"use client"

import dynamic from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const SalesChart = dynamic(
  () => import("./sales-chart").then((mod) => mod.SalesChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-(--spacing-scroll-md) w-full rounded-lg" />,
  },
)

interface SalesChartPoint {
  date: string
  revenue: number
  orders: number
}

interface SalesChartLazyProps {
  data: SalesChartPoint[]
  locale: string
}

export function SalesChartLazy({ data, locale }: SalesChartLazyProps) {
  return <SalesChart data={data} locale={locale} />
}
