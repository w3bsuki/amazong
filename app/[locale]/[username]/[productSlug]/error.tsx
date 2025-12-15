"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Product page error:", error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        We couldn&apos;t load this product. This might be a temporary issue.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    </div>
  )
}
