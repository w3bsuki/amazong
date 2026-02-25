import { Check, LoaderCircle as SpinnerGap, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OnboardingUsernameFieldProps {
  label: string
  placeholder: string
  hint: string
  value: string
  onChange: (value: string) => void
  checkingLabel: string
  availableLabel: string
  unavailableLabel: string
  isChecking: boolean
  isAvailable: boolean | null | undefined
}

export function OnboardingUsernameField({
  label,
  placeholder,
  hint,
  value,
  onChange,
  checkingLabel,
  availableLabel,
  unavailableLabel,
  isChecking,
  isAvailable,
}: OnboardingUsernameFieldProps) {
  const trimmed = value.trim()
  const shouldShowStatus = trimmed.length >= 3

  const indicator = shouldShowStatus ? (
    isChecking ? (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <SpinnerGap className="size-4 animate-spin motion-reduce:animate-none" />
        {checkingLabel}
      </span>
    ) : isAvailable === true ? (
      <span className="flex items-center gap-1.5 text-xs text-success">
        <Check className="size-4" />
        {availableLabel}
      </span>
    ) : isAvailable === false ? (
      <span className="flex items-center gap-1.5 text-xs text-destructive">
        <X className="size-4" />
        {unavailableLabel}
      </span>
    ) : null
  ) : null

  return (
    <div>
      <Label htmlFor="username" className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <div className="relative mt-2">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          @
        </span>
        <Input
          id="username"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-8"
          maxLength={30}
        />
      </div>
      <div className="flex items-center justify-between gap-3 mt-1.5">
        <p className="text-xs text-muted-foreground">{hint}</p>
        {indicator}
      </div>
    </div>
  )
}
