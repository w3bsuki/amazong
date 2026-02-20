"use client"

import { ArrowLeft } from "lucide-react"

interface StepHeaderProps {
  onBack: () => void
  title: string
  description: string
}

export function StepHeader({ onBack, title, description }: StepHeaderProps) {
  return (
    <div className="p-4 border-b border-border">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  )
}

