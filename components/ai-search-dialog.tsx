"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AIAssistantInterface } from "@/components/ui/ai-assistant-interface"

type AiSearchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AiSearchDialog({ open, onOpenChange }: AiSearchDialogProps) {
  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-100 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="AI Search"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn(
          "absolute inset-0 bg-background",
          "sm:inset-4 sm:rounded-xl sm:border sm:border-border sm:shadow-lg",
          "overflow-hidden"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute right-3 top-3 z-10">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>
        </div>

        <AIAssistantInterface
          api="/api/ai/search"
          className="h-full"
          showClose={false}
        />
      </div>
    </div>
  )
}
