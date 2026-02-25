"use client"

import { ArrowRight, LoaderCircle as SpinnerGap } from "lucide-react"

import { Button } from "@/components/ui/button"

interface WelcomeStepActionsProps {
  backLabel: string
  continueLabel: string
  isPending: boolean
  onBack: () => void
  onContinue: () => void
}

export function WelcomeStepActions({
  backLabel,
  continueLabel,
  isPending,
  onBack,
  onContinue,
}: WelcomeStepActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <Button variant="outline" onClick={onBack} className="flex-1">
        {backLabel}
      </Button>
      <Button
        onClick={onContinue}
        disabled={isPending}
        className="flex-1 bg-primary text-primary-foreground hover:bg-interactive-hover"
      >
        {isPending ? (
          <SpinnerGap className="size-4 animate-spin motion-reduce:animate-none" />
        ) : (
          <>
            {continueLabel} <ArrowRight className="size-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}

