"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw as ArrowCounterClockwise, Save as FloppyDisk, House, CircleAlert as WarningCircle } from "lucide-react";

import { Link } from "@/i18n/routing";

interface SellErrorBoundaryProps {
  children: ReactNode;
  /** Callback when error occurs - useful for analytics */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Seller ID for draft recovery */
  sellerId?: string;
}

interface SellErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  hasDraft: boolean;
}

/**
 * SellErrorBoundary - Error boundary specifically for the sell form
 * 
 * Features:
 * - Checks for saved drafts in localStorage
 * - Provides recovery options
 * - Styled to match sell page design
 */
export class SellErrorBoundary extends Component<SellErrorBoundaryProps, SellErrorBoundaryState> {
  constructor(props: SellErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      hasDraft: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<SellErrorBoundaryState> {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Check if there's a draft saved
    if (this.props.sellerId) {
      const scopedDraftKey = `sell-form-draft-v4:${this.props.sellerId}`;
      const legacyScopedDraftKey = `sell-draft-${this.props.sellerId}`;
      const legacySharedDraftKey = "sell-form-draft-v4";
      const hasDraft = Boolean(
        localStorage.getItem(scopedDraftKey) ||
        localStorage.getItem(legacyScopedDraftKey) ||
        localStorage.getItem(legacySharedDraftKey)
      );
      this.setState({ hasDraft });
    }

    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="max-w-md w-full rounded-md">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive-subtle">
                <WarningCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-lg font-semibold">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-sm">
                {this.state.error?.message || "An unexpected error occurred while loading the sell form."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {/* Draft recovery notice */}
              {this.state.hasDraft && (
                <div className="flex items-start gap-3 rounded-lg bg-success/10 p-3 text-sm">
                  <FloppyDisk className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-success">
                      Draft available
                    </p>
                    <p className="text-success/90 text-xs mt-0.5">
                      Your progress was saved. It will be restored when you retry.
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={this.handleRetry}
                  className="w-full h-touch gap-2"
                >
                  <ArrowCounterClockwise className="h-4 w-4" />
                  Try again
                </Button>

                <Button
                  variant="outline"
                  asChild
                  className="w-full h-touch gap-2"
                >
                  <Link href="/">
                    <House className="h-4 w-4" />
                    Go to homepage
                  </Link>
                </Button>
              </div>

              {/* Technical details (collapsed by default) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    Technical details
                  </summary>
                  <pre className="mt-2 rounded-lg bg-muted p-3 text-xs overflow-auto max-h-40">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
