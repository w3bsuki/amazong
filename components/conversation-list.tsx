"use client"

import { useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useMessages, type Conversation } from "@/lib/message-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, ChatCircle } from "@phosphor-icons/react"

interface ConversationListProps {
  className?: string
  onSelectConversation?: (conversationId: string) => void
}

export function ConversationList({
  className,
  onSelectConversation
}: ConversationListProps) {
  const t = useTranslations("Messages")
  const {
    conversations,
    currentConversation,
    isLoading,
    loadConversations,
    selectConversation
  } = useMessages()

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const handleSelectConversation = async (conversationId: string) => {
    await selectConversation(conversationId)
    onSelectConversation?.(conversationId)
  }

  if (isLoading) {
    return (
      <div className={cn("flex flex-col", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-4 py-3 border-b">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-48" />
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full p-6", className)}>
        <ChatCircle size={32} weight="regular" className="text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground text-center">{t("noConversations")}</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col overflow-y-auto", className)}>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={currentConversation?.id === conversation.id}
          onClick={() => handleSelectConversation(conversation.id)}
        />
      ))}
    </div>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}

function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const t = useTranslations("Messages")
  
  const otherParty = conversation.seller?.profile || conversation.buyer
  const displayName = conversation.seller?.business_name || otherParty?.full_name || t("unknownUser")

  const unreadCount = conversation.buyer_unread_count || conversation.seller_unread_count

  const lastMessage = conversation.last_message
  const lastMessagePreview = lastMessage?.content 
    ? lastMessage.content.length > 40 
      ? lastMessage.content.substring(0, 40) + "..."
      : lastMessage.content
    : t("noMessages")

  const timeAgo = conversation.last_message_at
    ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })
    : ""

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 border-b transition-colors",
        "hover:bg-[#F7F8F8]",
        isSelected && "bg-[#F0F2F2] border-l-2 border-l-[#067D68]",
        unreadCount > 0 && "bg-[#FEF9E7]"
      )}
    >
      {/* Seller name and time */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={cn(
          "text-sm truncate",
          unreadCount > 0 ? "font-bold text-foreground" : "font-medium text-foreground"
        )}>
          {displayName}
        </span>
        <span className="text-xs text-muted-foreground shrink-0">
          {timeAgo}
        </span>
      </div>

      {/* Product reference */}
      {conversation.product && (
        <div className="flex items-center gap-1 text-xs text-brand-blue mb-1">
          <Package size={12} weight="regular" />
          <span className="truncate">{conversation.product.title}</span>
        </div>
      )}

      {/* Last message preview */}
      <p className={cn(
        "text-xs truncate",
        unreadCount > 0 ? "text-foreground" : "text-muted-foreground"
      )}>
        {lastMessagePreview}
      </p>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <span className="inline-block mt-1 text-xs bg-[#067D68] text-white px-1.5 py-0.5 rounded">
          {unreadCount} new
        </span>
      )}
    </button>
  )
}
