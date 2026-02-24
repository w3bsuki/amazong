import * as React from "react"
import type { ComponentPropsWithoutRef } from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

type MobileStepProgressProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  current: number
  total: number
}

export function MobileStepProgress({ current, total, className, ...props }: MobileStepProgressProps) {
  const t = useTranslations("MobileStepProgress")
  const safeTotal = Number.isFinite(total) ? Math.max(1, Math.floor(total)) : 1
  const safeCurrent = Number.isFinite(current)
    ? Math.min(safeTotal, Math.max(1, Math.floor(current)))
    : 1

  const ariaLabel = props["aria-label"] ?? t("ariaLabel")
  const ariaValueText =
    props["aria-valuetext"] ?? t("ariaValueText", { current: safeCurrent, total: safeTotal })

  return (
    <div
      data-slot="mobile-step-progress"
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={1}
      aria-valuenow={safeCurrent}
      aria-valuemax={safeTotal}
      aria-valuetext={ariaValueText}
      className={cn("flex w-full items-center gap-2", className)}
      {...props}
    >
      {Array.from({ length: safeTotal }, (_, index) => {
        const step = index + 1
        const isCompleted = step < safeCurrent
        const isCurrent = step === safeCurrent
        const isUpcoming = step > safeCurrent

        const dotClassName = cn(
          "shrink-0 rounded-full",
          isCurrent ? "size-2.5" : "size-2",
          (isCompleted || isCurrent) && "bg-foreground",
          isUpcoming && "bg-background border border-border"
        )

        const connectorClassName = isCompleted ? "bg-foreground" : "bg-border"

        return (
          <React.Fragment key={step}>
            <div aria-hidden="true" className={dotClassName} />
            {step !== safeTotal ? (
              <div aria-hidden="true" className={cn("h-px flex-1", connectorClassName)} />
            ) : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}
