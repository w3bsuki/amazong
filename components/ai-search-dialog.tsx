"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { AIChatbot } from "@/components/ai-chatbot"

type AiSearchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMode?: "buy" | "sell"
  autoSendGreeting?: boolean
}

export function AiSearchDialog({
  open,
  onOpenChange,
  initialMode,
  autoSendGreeting,
}: AiSearchDialogProps) {
  const [isClosing, setIsClosing] = React.useState(false)
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const startY = React.useRef<number | null>(null)
  const currentY = React.useRef<number | null>(null)

  const handleClose = React.useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onOpenChange(false)
    }, 200)
  }, [onOpenChange])

  // Handle escape key
  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, handleClose])

  // Lock body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      // Handle iOS viewport height
      document.documentElement.style.setProperty("--dialog-vh", `${window.innerHeight * 0.01}px`)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Swipe to close on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable swipe from top area on mobile
    if (window.innerWidth >= 640) return
    const touch = e.touches[0]
    startY.current = touch.clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null || window.innerWidth >= 640) return
    currentY.current = e.touches[0].clientY
    const diff = currentY.current - startY.current
    
    // Only allow downward swipe from near top
    if (diff > 0 && startY.current < 100 && dialogRef.current) {
      const translateY = Math.min(diff * 0.5, 100)
      dialogRef.current.style.transform = `translateY(${translateY}px)`
      dialogRef.current.style.transition = "none"
    }
  }

  const handleTouchEnd = () => {
    if (startY.current === null || currentY.current === null || window.innerWidth >= 640) {
      startY.current = null
      currentY.current = null
      return
    }

    const diff = currentY.current - startY.current
    if (dialogRef.current) {
      dialogRef.current.style.transform = ""
      dialogRef.current.style.transition = ""
    }

    // Close if swiped down more than 80px from top
    if (diff > 80 && startY.current < 100) {
      handleClose()
    }

    startY.current = null
    currentY.current = null
  }

  if (!open) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-100 bg-black/60 backdrop-blur-sm",
        "transition-opacity duration-200",
        isClosing ? "opacity-0" : "opacity-100"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="AI Assistant"
      onClick={handleClose}
    >
      <div
        ref={dialogRef}
        className={cn(
          "absolute bg-background transition-all duration-200",
          // Mobile: Full screen with safe areas
          "inset-0",
          "pb-[env(safe-area-inset-bottom)]",
          "pt-[env(safe-area-inset-top)]",
          // Desktop: Large modal with small margins for proper shopping UX
          "sm:inset-4 sm:pb-0 sm:pt-0",
          "sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl",
          // Animation
          isClosing 
            ? "translate-y-full opacity-0 sm:translate-y-0 sm:scale-[0.98] sm:opacity-0" 
            : "translate-y-0 opacity-100 sm:scale-100",
          "overflow-hidden"
        )}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile swipe indicator */}
        <div className="absolute left-1/2 top-2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-muted-foreground/30 sm:hidden" />
        
        <AIChatbot
          className="h-full"
          showClose
          onClose={handleClose}
          initialMode={initialMode}
          autoSendGreeting={autoSendGreeting}
        />
      </div>
    </div>
  )
}
