'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { WarningCircle, House, ArrowCounterClockwise } from '@phosphor-icons/react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="size-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <WarningCircle className="size-10 text-destructive" weight="fill" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Something went wrong
        </h1>
        
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Our team has been notified and is working to fix the issue.
        </p>
        
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted px-3 py-2 rounded">
            Error ID: {error.digest}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={reset}
            variant="outline"
            className="gap-2"
          >
            <ArrowCounterClockwise className="size-4" />
            Try again
          </Button>
          
          <Link href="/">
            <Button className="gap-2 bg-brand hover:bg-brand/90 w-full sm:w-auto">
              <House className="size-4" />
              Go to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
