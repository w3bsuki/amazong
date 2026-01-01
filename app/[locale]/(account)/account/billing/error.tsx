"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WarningCircle, ArrowClockwise } from "@phosphor-icons/react"

export default function BillingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Billing page error:', error)
  }, [error])

  return (
    <div className="p-4 lg:p-4">
      <div className="max-w-5xl mx-auto">
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <WarningCircle className="size-8 text-destructive" weight="duotone" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Something went wrong
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              We couldn&apos;t load your billing information. Please try again.
            </p>
            <Button onClick={reset} variant="outline" className="gap-1.5">
              <ArrowClockwise className="size-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
