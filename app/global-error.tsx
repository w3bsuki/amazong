"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <WarningCircle className="h-10 w-10 text-destructive" weight="duotone" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight">
              Something went wrong!
            </h1>
            <p className="mb-6 text-muted-foreground">
              An unexpected error occurred. We apologize for the inconvenience.
              {error.digest && (
                <span className="mt-2 block text-xs">
                  Error ID: {error.digest}
                </span>
              )}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={reset} variant="default">
                <ArrowClockwise className="mr-2 h-4 w-4" />
                Try again
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
