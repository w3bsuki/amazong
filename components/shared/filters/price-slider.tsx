"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

type PriceValue = string | null

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function parseNonNegativeInt(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (!/^[0-9]+$/.test(trimmed)) return null
  const n = Number(trimmed)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.floor(n)
}

function formatValue(value: number | null): PriceValue {
  if (value === null) return null
  return String(value)
}

export interface PriceSliderValue {
  min: PriceValue
  max: PriceValue
}

interface PriceSliderProps {
  value: PriceSliderValue
  onChange: (value: PriceSliderValue) => void
  /** Inclusive maximum bound for the slider. If omitted, it grows with user input. */
  maxLimit?: number
  /** Step for the range inputs (defaults to 5) */
  step?: number
  className?: string
}

export function PriceSlider({
  value,
  onChange,
  maxLimit,
  step = 5,
  className,
}: PriceSliderProps) {
  const t = useTranslations("SearchFilters")

  const parsedMin = useMemo(() => parseNonNegativeInt(value.min ?? ""), [value.min])
  const parsedMax = useMemo(() => parseNonNegativeInt(value.max ?? ""), [value.max])

  const computedMaxLimit = useMemo(() => {
    const base = maxLimit ?? 500
    const maxCandidate = Math.max(base, parsedMin ?? 0, parsedMax ?? 0)
    const rounded = Math.ceil(maxCandidate / step) * step
    return Math.max(step, rounded)
  }, [maxLimit, parsedMin, parsedMax, step])

  const [minText, setMinText] = useState(value.min ?? "")
  const [maxText, setMaxText] = useState(value.max ?? "")

  useEffect(() => setMinText(value.min ?? ""), [value.min])
  useEffect(() => setMaxText(value.max ?? ""), [value.max])

  const minForSlider = clamp(parsedMin ?? 0, 0, computedMaxLimit)
  const maxForSlider = clamp(parsedMax ?? computedMaxLimit, 0, computedMaxLimit)

  const normalizedMin = Math.min(minForSlider, maxForSlider)
  const normalizedMax = Math.max(minForSlider, maxForSlider)

  const leftPct = (normalizedMin / computedMaxLimit) * 100
  const rightPct = (normalizedMax / computedMaxLimit) * 100

  const trackStyle = {
    background: `linear-gradient(to right, hsl(var(--muted)) 0%, hsl(var(--muted)) ${leftPct}%, hsl(var(--primary)) ${leftPct}%, hsl(var(--primary)) ${rightPct}%, hsl(var(--muted)) ${rightPct}%, hsl(var(--muted)) 100%)`,
  } as const

  const commit = (next: { min: number | null; max: number | null }, changed: "min" | "max") => {
    let nextMin = next.min
    let nextMax = next.max

    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      if (changed === "min") nextMax = nextMin
      else nextMin = nextMax
    }

    onChange({ min: formatValue(nextMin), max: formatValue(nextMax) })
  }

  const handleMinInput = (raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, "")
    setMinText(digitsOnly)
    commit({ min: parseNonNegativeInt(digitsOnly), max: parsedMax }, "min")
  }

  const handleMaxInput = (raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, "")
    setMaxText(digitsOnly)
    commit({ min: parsedMin, max: parseNonNegativeInt(digitsOnly) }, "max")
  }

  const handleMinSlider = (raw: string) => {
    const n = clamp(Number(raw), 0, computedMaxLimit)
    // slider at 0 means "no min"
    const nextMin = n <= 0 ? null : n
    commit({ min: nextMin, max: parsedMax }, "min")
  }

  const handleMaxSlider = (raw: string) => {
    const n = clamp(Number(raw), 0, computedMaxLimit)
    // slider at max means "no max"
    const nextMax = n >= computedMaxLimit ? null : n
    commit({ min: parsedMin, max: nextMax }, "max")
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">{t("min")}</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={minText}
            onChange={(e) => handleMinInput(e.target.value)}
            placeholder="0"
            className={cn(
              "w-full h-10 px-3 rounded-lg",
              "bg-muted/50 border border-border/50",
              "text-sm placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            )}
            aria-label={t("min")}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">{t("max")}</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={maxText}
            onChange={(e) => handleMaxInput(e.target.value)}
            placeholder={String(computedMaxLimit)}
            className={cn(
              "w-full h-10 px-3 rounded-lg",
              "bg-muted/50 border border-border/50",
              "text-sm placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            )}
            aria-label={t("max")}
          />
        </label>
      </div>

      <div className="space-y-2">
        <div className="h-2 rounded-full" style={trackStyle} />

        <div className="relative h-6">
          <input
            type="range"
            min={0}
            max={computedMaxLimit}
            step={step}
            value={normalizedMin}
            onChange={(e) => handleMinSlider(e.target.value)}
            className={cn(
              "absolute inset-0 w-full",
              "bg-transparent",
              "[&::-webkit-slider-runnable-track]:bg-transparent",
              "[&::-moz-range-track]:bg-transparent",
              "[&::-webkit-slider-thumb]:appearance-none",
              "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-border",
              "[&::-webkit-slider-thumb]:shadow-sm",
              "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-border",
              "[&::-moz-range-thumb]:shadow-sm"
            )}
            aria-label={t("min")}
          />
          <input
            type="range"
            min={0}
            max={computedMaxLimit}
            step={step}
            value={normalizedMax}
            onChange={(e) => handleMaxSlider(e.target.value)}
            className={cn(
              "absolute inset-0 w-full",
              "bg-transparent",
              "[&::-webkit-slider-runnable-track]:bg-transparent",
              "[&::-moz-range-track]:bg-transparent",
              "[&::-webkit-slider-thumb]:appearance-none",
              "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-border",
              "[&::-webkit-slider-thumb]:shadow-sm",
              "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-border",
              "[&::-moz-range-thumb]:shadow-sm"
            )}
            aria-label={t("max")}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          {t("min")}: {value.min ?? "—"} · {t("max")}: {value.max ?? "—"}
        </p>
      </div>
    </div>
  )
}
