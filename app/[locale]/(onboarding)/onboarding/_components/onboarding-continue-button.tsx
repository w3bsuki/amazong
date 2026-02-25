import { ArrowRight, LoaderCircle as SpinnerGap } from "lucide-react"

import { Button } from "@/components/ui/button"

interface OnboardingContinueButtonProps {
  continueLabel: string
  processingLabel: string
  disabled?: boolean
  isPending: boolean
  onClick: () => void
}

export function OnboardingContinueButton({
  continueLabel,
  processingLabel,
  disabled,
  isPending,
  onClick,
}: OnboardingContinueButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isPending}
      size="lg"
      className="w-full"
    >
      {isPending ? (
        <>
          <SpinnerGap className="size-5 animate-spin motion-reduce:animate-none" />
          {processingLabel}
        </>
      ) : (
        <>
          {continueLabel}
          <ArrowRight className="size-5" />
        </>
      )}
    </Button>
  )
}
