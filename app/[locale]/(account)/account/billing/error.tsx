"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw as ArrowClockwise, CircleAlert as WarningCircle } from "lucide-react";


import { logger } from "@/lib/logger"
export default function BillingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("Account.billingError")

  useEffect(() => {
    logger.error("[account-billing] route_error_boundary", error)
  }, [error])

  return (
    <div className="p-4 lg:p-4">
      <div className="max-w-5xl mx-auto">
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-destructive-subtle p-4 mb-4">
              <WarningCircle className="size-8 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
              {t("title")}
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              {t("description")}
            </p>
            <Button onClick={reset} variant="outline" className="gap-1.5">
              <ArrowClockwise className="size-4" />
              {t("retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
