'use client'

import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { WarningCircle, ArrowCounterClockwise } from '@phosphor-icons/react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary - A reusable error boundary component
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary fallback={<MyFallback />}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 * 
 * Or with the default fallback:
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call the optional onError callback
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center min-h-[200px] bg-destructive/5 rounded-lg border border-destructive/20">
          <div className="size-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <WarningCircle className="size-6 text-destructive" weight="fill" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Something went wrong
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            We encountered an error loading this content. Please try again.
          </p>
          
          <Button 
            onClick={this.handleRetry}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowCounterClockwise className="size-4" />
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * ProductErrorBoundary - A specialized error boundary for product cards/lists
 * Shows a compact error state suitable for grid layouts
 */
export function ProductErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center p-4 text-center bg-muted/50 rounded-lg border border-border min-h-[200px]">
          <WarningCircle className="size-8 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">Failed to load</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * SectionErrorBoundary - A specialized error boundary for page sections
 * Shows a more prominent error state suitable for larger content areas
 */
export function SectionErrorBoundary({ 
  children, 
  sectionName = "this section" 
}: { 
  children: ReactNode
  sectionName?: string
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border border-border">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <WarningCircle className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Couldn't load {sectionName}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            There was a problem loading this content. Please refresh the page.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowCounterClockwise className="size-4" />
            Refresh page
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
