"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Slider } from "@/components/ui/slider"

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

  const handleSlider = (values: number[]) => {
    const nextMinRaw = clamp(values[0] ?? 0, 0, computedMaxLimit)
    const nextMaxRaw = clamp(values[1] ?? computedMaxLimit, 0, computedMaxLimit)

    const nextMin = nextMinRaw <= 0 ? null : nextMinRaw
    const nextMax = nextMaxRaw >= computedMaxLimit ? null : nextMaxRaw

    onChange({ min: formatValue(nextMin), max: formatValue(nextMax) })
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
              "w-full h-10 px-3 rounded-md",
              "bg-surface-subtle border border-border-subtle",
              "text-sm placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary"
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
              "w-full h-10 px-3 rounded-md",
              "bg-surface-subtle border border-border-subtle",
              "text-sm placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary"
            )}
            aria-label={t("max")}
          />
        </label>
      </div>

      <div className="space-y-2">
        <Slider
          min={0}
          max={computedMaxLimit}
          step={step}
          value={[normalizedMin, normalizedMax]}
          onValueChange={handleSlider}
          thumbLabels={[t("min"), t("max")]}
        />

        <p className="text-xs text-muted-foreground">
          {t("min")}: {value.min ?? "—"} · {t("max")}: {value.max ?? "—"}
        </p>
      </div>
    </div>
  )
}
