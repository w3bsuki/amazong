"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations, useLocale } from "next-intl"
import { bg, enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useMessages } from "@/components/providers/message-context"
import { createClient } from "@/lib/supabase/client"
import { MessageCircle as ChatCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { ChatInterfaceHeader } from "./chat-interface-header"
import { ChatInterfaceInput } from "./chat-interface-input"
import { ChatMessagesPane } from "./chat-interface-messages"
import { useChatInterfaceActions } from "./use-chat-interface-actions"

export type ChatInterfaceServerActions = {
  blockUser: (
    userId: string,
    reason?: string
  ) => Promise<{ success: boolean; error: string | null }>
  reportConversation: (
    conversationId: string,
    reason: "spam" | "harassment" | "scam" | "inappropriate" | "other",
    description?: string
  ) => Promise<{ success: boolean; error: string | null }>
}

interface ChatInterfaceProps {
  className?: string
  onBack?: () => void
  showHeader?: boolean
  actions: ChatInterfaceServerActions
}

export function ChatInterface({
  className,
  onBack,
  showHeader = true,
  actions,
}: ChatInterfaceProps) {
  const t = useTranslations("Messages")
  const tCommon = useTranslations("Common")
  const tFreshness = useTranslations("Freshness")
  const locale = useLocale()
  const dateLocale = locale === "bg" ? bg : enUS
  const supabase = createClient()
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    currentConversation,
    messages,
    isLoadingMessages,
    isOtherUserTyping,
    sendMessage,
    sendTypingIndicator,
    closeConversation,
    error,
  } = useMessages()

  const { toast } = useToast()
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
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  // Auto-resize textarea and send typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    // Auto-resize
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
    // Send typing indicator (throttled in context)
    if (e.target.value.trim()) {
      sendTypingIndicator()
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(inputValue.trim())
      setInputValue("")
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "auto"
      }
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

  const {
    isUploadingImage,
    isBlocking,
    isReporting,
    handleImageUpload,
    handleBlockUser,
    handleReportConversation,
  } = useChatInterfaceActions({
    actions,
    currentConversation,
    currentUserId,
    closeConversation,
    sendMessage,
    fileInputRef,
    toast,
    t,
    tCommon,
  })

  // No conversation selected state - Instagram style
  if (!currentConversation) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full bg-background",
          className
        )}
      >
        <div className="flex flex-col items-center gap-4 p-4 text-center max-w-sm">
          <div className="flex size-20 items-center justify-center rounded-full border-2 border-border">
            <ChatCircle
              size={40}
              className="text-muted-foreground"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {t("selectConversation")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("selectConversationDescription")}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Get other party info based on whether current user is buyer or seller
  const isBuyer = currentUserId === currentConversation.buyer_id
  const otherProfile = isBuyer
    ? currentConversation.seller_profile
    : currentConversation.buyer_profile

  // Fall back to legacy fields if new profile fields not available
  // Type guard for seller_profile which has business_name
  const sellerProfile = currentConversation.seller_profile
  const displayName = isBuyer
    ? (sellerProfile?.business_name || otherProfile?.display_name || otherProfile?.full_name || currentConversation.seller?.business_name || t("unknownUser"))
    : (otherProfile?.display_name || otherProfile?.full_name || currentConversation.buyer?.full_name || t("unknownUser"))

  const avatarUrl = otherProfile?.avatar_url ||
    (isBuyer ? currentConversation.seller?.profile?.avatar_url : currentConversation.buyer?.avatar_url)

  // Check if conversation is closed
  const isClosed = currentConversation.status !== "open"
  const productHref =
    currentConversation.seller_profile?.username && currentConversation.product
      ? `/${currentConversation.seller_profile.username}/${currentConversation.product.id}`
      : "#"

  return (
    <div className={cn("flex h-full flex-col bg-background overflow-hidden", className)}>
      {showHeader && (
        <ChatInterfaceHeader
          t={t}
          displayName={displayName}
          avatarUrl={avatarUrl ?? null}
          sellerId={currentConversation.seller_id}
          productHref={productHref}
          productTitle={currentConversation.product?.title}
          isClosed={isClosed}
          onBack={onBack}
          onCloseConversation={() => closeConversation(currentConversation.id)}
          onReportConversation={handleReportConversation}
          onBlockUser={handleBlockUser}
          isReporting={isReporting}
          isBlocking={isBlocking}
        />
      )}

      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-3"
      >
        <ChatMessagesPane
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          currentUserId={currentUserId}
          displayName={displayName}
          avatarUrl={avatarUrl ?? null}
          currentConversation={currentConversation}
          productHref={productHref}
          t={t}
          tFreshness={tFreshness}
          dateLocale={dateLocale}
        />
      </div>

      <div className="h-6 px-4 flex items-center">
        {isOtherUserTyping && !isClosed && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex gap-1">
              <span
                className="size-1.5 rounded-full bg-muted animate-bounce motion-reduce:animate-none"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="size-1.5 rounded-full bg-muted animate-bounce motion-reduce:animate-none"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="size-1.5 rounded-full bg-muted animate-bounce motion-reduce:animate-none"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span>
              {t("typingIndicator", { name: displayName })}
            </span>
          </div>
        )}
      </div>

      <ChatInterfaceInput
        t={t}
        isClosed={isClosed}
        error={error}
        inputRef={inputRef}
        fileInputRef={fileInputRef}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onSend={handleSend}
        onImageUpload={handleImageUpload}
        isSending={isSending}
        isUploadingImage={isUploadingImage}
      />
    </div>
  )
}
