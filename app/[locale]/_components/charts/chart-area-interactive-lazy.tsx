"use client"

import dynamic from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const ChartAreaInteractive = dynamic(
  () => import("./chart-area-interactive").then((mod) => mod.ChartAreaInteractive),
  {
    ssr: false,
    loading: () => <Skeleton className="h-(--chart-h-sm) w-full rounded-lg" />,
  }
)

export function ChartAreaInteractiveLazy() {
  return <ChartAreaInteractive />
}
