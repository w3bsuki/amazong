"use client"

import { useFormStatus } from "react-dom"
import { SpinnerGap } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  label: string
  pendingLabel: string
  disabled?: boolean
  className?: string
}

export function SubmitButton({
  label,
  pendingLabel,
  disabled,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      size="lg"
      className={className ?? "w-full"}
      disabled={pending || disabled}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <SpinnerGap className="size-5 animate-spin" weight="bold" />
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </Button>
  )
}
