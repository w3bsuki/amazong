"use client"

import dynamic from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const AccountChart = dynamic(
  () => import("./account-chart").then((mod) => mod.AccountChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-(--chart-h-sm) w-full rounded-lg" />,
  },
)

interface AccountChartLazyProps {
  locale: string
}

export function AccountChartLazy({ locale }: AccountChartLazyProps) {
  return <AccountChart locale={locale} />
}
