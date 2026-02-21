import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react";


import { Button } from "@/components/ui/button"
import { MobileStepProgress } from "@/components/mobile/chrome/mobile-step-progress"
import { cn } from "@/lib/utils"

export function OnboardingShell({
  title,
  subtitle,
  stepLabel,
  stepProgress,
  onBack,
  backLabel,
  headerAction,
  children,
  footer,
  className,
}: {
  title: string
  subtitle?: string
  stepLabel?: string
  stepProgress?: { current: number; total: number }
  onBack?: (() => void) | undefined
  backLabel?: string
  headerAction?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("min-h-dvh flex flex-col", className)}>
      <div className="sticky top-0 z-10 bg-background border-b border-border pt-safe">
        <div className="flex items-center gap-2 px-4 py-3">
          {onBack ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBack}
              aria-label={backLabel}
            >
              <ArrowLeft className="size-5" />
            </Button>
          ) : (
            <div className="size-11" aria-hidden="true" />
          )}

          <div className="flex-1 text-center">
            {stepLabel ? (
              <p className="text-xs font-medium text-muted-foreground">
                {stepLabel}
              </p>
            ) : null}
          </div>

          {headerAction ? (
            <div className="shrink-0">{headerAction}</div>
          ) : (
            <div className="size-11" aria-hidden="true" />
          )}
        </div>

        {stepProgress ? (
          <div className="px-4 pb-3">
            <MobileStepProgress
              current={stepProgress.current}
              total={stepProgress.total}
              aria-label={stepLabel}
              aria-valuetext={stepLabel}
            />
          </div>
        ) : null}
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        <div className="mt-6">{children}</div>
      </div>

      {footer ? (
        <div className="sticky bottom-0 z-10 bg-background border-t border-border px-4 pt-3 pb-safe-max-sm">
          {footer}
        </div>
      ) : null}
    </div>
  )
}


