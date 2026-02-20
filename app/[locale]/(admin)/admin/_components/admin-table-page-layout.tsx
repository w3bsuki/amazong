import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table } from "@/components/ui/table"

interface AdminTablePageLayoutProps {
  title: string
  description: string
  headerRight: ReactNode
  tableTitle: string
  tableDescription: ReactNode
  children: ReactNode
}

export function AdminTablePageLayout({
  title,
  description,
  headerRight,
  tableTitle,
  tableDescription,
  children,
}: AdminTablePageLayoutProps) {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {headerRight}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tableTitle}</CardTitle>
          <CardDescription>{tableDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>{children}</Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

