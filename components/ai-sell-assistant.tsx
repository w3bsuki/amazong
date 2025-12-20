"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { AIChatbot } from "./ai-chatbot"
import { Button } from "@/components/ui/button"
import { Sparkles, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface AiSellAssistantProps {
  onSwitchToForm?: () => void
  className?: string
  /**
   * Embed mode for page-owned chrome (e.g. /sell).
   * Hides the internal AIChatbot header to avoid double headers on mobile.
   */
  embedded?: boolean
}

export function AiSellAssistant({ onSwitchToForm, className, embedded = false }: AiSellAssistantProps) {
  const locale = useLocale()
  const isBg = locale === "bg"
  
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Optional: Toggle to traditional form */}
      {onSwitchToForm && (
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            {isBg ? "AI Асистент за обяви" : "AI Listing Assistant"}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSwitchToForm}
            className="gap-1.5 text-xs"
          >
            <FileText className="size-3.5" />
            {isBg ? "Ръчен формуляр" : "Manual Form"}
          </Button>
        </div>
      )}
      
      {/* AI Chatbot in sell mode - starts directly in sell mode */}
      <div className="flex-1 min-h-0">
        <AIChatbot 
          showClose={false} 
          initialMode="sell"
          autoSendGreeting={true}
          hideHeader={embedded}
        />
      </div>
    </div>
  )
}
