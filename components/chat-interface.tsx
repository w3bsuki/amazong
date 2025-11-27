"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useMessages } from "@/lib/message-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Send,
  ArrowLeft,
  Package,
  MoreVertical,
  X,
  Archive,
  Loader2,
  MessageSquare,
  CheckCheck,
  Check
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface ChatInterfaceProps {
  className?: string
  onBack?: () => void
  showHeader?: boolean
}

export function ChatInterface({
  className,
  onBack,
  showHeader = true
}: ChatInterfaceProps) {
  const t = useTranslations("Messages")
  const supabase = createClient()
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  
  const {
    currentConversation,
    messages,
    isLoadingMessages,
    sendMessage,
    closeConversation,
    error
  } = useMessages()

  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setCurrentUserId(data.user.id)
      }
    }
    getUser()
  }, [supabase])

  // Scroll to bottom when messages change
  useEffect(() => {
    // Scroll within the container only, not the entire page
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(inputValue.trim())
      setInputValue("")
    } catch (err) {
      console.error("Error sending message:", err)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // No conversation selected state
  if (!currentConversation) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full bg-secondary/30", className)}>
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground text-sm">{t("selectConversation")}</p>
      </div>
    )
  }

  // Get other party info
  const otherParty = currentConversation.seller?.profile || currentConversation.buyer
  const displayName = currentConversation.seller?.business_name || otherParty?.full_name || t("unknownUser")

  // Check if conversation is closed
  const isClosed = currentConversation.status !== "open"

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header - Amazon style */}
      {showHeader && (
        <div className="shrink-0 border-b bg-secondary/50 px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Back button (mobile) */}
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden -ml-2"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("back")}
              </Button>
            )}

            {/* Seller info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm truncate">{displayName}</h2>
                {isClosed && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">{t("closed")}</span>
                )}
              </div>
              {currentConversation.product && (
                <Link 
                  href={`/product/${currentConversation.product.id}`}
                  className="flex items-center gap-1 text-xs text-brand-blue hover:underline"
                >
                  <Package className="h-3 w-3" />
                  <span className="truncate">{currentConversation.product.title}</span>
                </Link>
              )}
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isClosed && (
                  <DropdownMenuItem onClick={() => closeConversation(currentConversation.id)}>
                    <X className="h-4 w-4 mr-2" />
                    {t("closeConversation")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Archive className="h-4 w-4 mr-2" />
                  {t("archiveConversation")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Messages area - Simple scrollable list */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto overscroll-contain bg-[#f4f4f4]">
        {isLoadingMessages ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("flex", i % 2 === 0 && "justify-end")}>
                <Skeleton className={cn("h-14 rounded", i % 2 === 0 ? "w-48" : "w-56")} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{t("noMessagesYet")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("startConversationHint")}</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {messages.map((message) => {
              const isOwn = message.sender_id === currentUserId
              return (
                <div key={message.id} className={cn("flex", isOwn && "justify-end")}>
                  <div className={cn(
                    "max-w-[75%] rounded px-3 py-2",
                    isOwn 
                      ? "bg-[#067D68] text-white" 
                      : "bg-white border shadow-sm"
                  )}>
                    {/* Sender name for received messages */}
                    {!isOwn && (
                      <p className="text-xs font-medium text-brand-blue mb-1">
                        {message.sender?.full_name || displayName}
                      </p>
                    )}
                    
                    {/* Message content */}
                    <p className="text-sm whitespace-pre-wrap wrap-break-word">
                      {message.content}
                    </p>
                    
                    {/* Time and read status */}
                    <div className={cn(
                      "flex items-center gap-1 mt-1",
                      isOwn ? "justify-end" : "justify-start"
                    )}>
                      <span className={cn(
                        "text-[10px]",
                        isOwn ? "text-white/70" : "text-muted-foreground"
                      )}>
                        {format(new Date(message.created_at), "HH:mm")}
                      </span>
                      {isOwn && (
                        message.is_read ? (
                          <CheckCheck className="h-3 w-3 text-white/70" />
                        ) : (
                          <Check className="h-3 w-3 text-white/70" />
                        )
                      )}
                    </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>      {/* Input area - Amazon style */}
      <div className="shrink-0 border-t bg-white p-3">
        {isClosed ? (
          <p className="text-center text-sm text-muted-foreground py-2">
            {t("conversationClosed")}
          </p>
        ) : (
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("typeMessage")}
              disabled={isSending}
              className="min-h-[40px] max-h-[120px] resize-none text-sm"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isSending}
              className="shrink-0 bg-[#067D68] hover:bg-[#056654] text-white px-4"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
        
        {error && (
          <p className="text-xs text-destructive mt-2">{error}</p>
        )}
      </div>
    </div>
  )
}
