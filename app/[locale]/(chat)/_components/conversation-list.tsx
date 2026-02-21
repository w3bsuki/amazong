"use client"

import { useEffect, useMemo } from "react"
import { formatDistanceToNow } from "date-fns"
import { useTranslations, useLocale } from "next-intl"
import { bg, enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useMessages, type Conversation } from "@/components/providers/message-context"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageCircle as ChatCircle, Image as ImageIcon } from "lucide-react";

import Image from "next/image"

// Filter types matching the chat bottom tabs
type MessageFilter = "all" | "unread" | "buying" | "selling"

interface ConversationListProps {
  className?: string
  onSelectConversation?: (conversationId: string) => void
  searchQuery?: string
  filter?: MessageFilter
}

export function ConversationList({
  className,
  onSelectConversation,
  searchQuery = "",
  filter = "all",
}: ConversationListProps) {
  const t = useTranslations("Messages")
  const locale = useLocale()
  const {
    conversations,
    currentConversation,
    currentUserId,
    isLoading,
    loadConversations,
    selectConversation,
  } = useMessages()

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Filter conversations based on search and filter type
  const filteredConversations = useMemo(() => {
    let filtered = conversations

    // Apply filter type
    if (filter !== "all" && currentUserId) {
      filtered = filtered.filter((conv) => {
        switch (filter) {
          case "unread": {
            // Show conversations with unread messages for current user
            const isBuyer = conv.buyer_id === currentUserId
            return isBuyer 
              ? (conv.buyer_unread_count || 0) > 0
              : (conv.seller_unread_count || 0) > 0
          }
          case "buying":
            // Show conversations where user is the buyer
            return conv.buyer_id === currentUserId
          case "selling":
            // Show conversations where user is the seller
            return conv.seller_id === currentUserId
          default:
            return true
        }
      })
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((conv) => {
        // Use new profile fields for search
        const buyerName = conv.buyer_profile?.display_name || conv.buyer_profile?.full_name || conv.buyer?.full_name || ""
        const sellerName = conv.seller_profile?.business_name || conv.seller_profile?.display_name || conv.seller_profile?.full_name || conv.seller?.business_name || ""
        const productTitle = conv.product?.title || ""
        const lastMessage = conv.last_message?.content || ""
        return (
          buyerName.toLowerCase().includes(query) ||
          sellerName.toLowerCase().includes(query) ||
          productTitle.toLowerCase().includes(query) ||
          lastMessage.toLowerCase().includes(query)
        )
      })
    }

    return filtered
  }, [conversations, searchQuery, filter, currentUserId])

  const handleSelectConversation = async (conversationId: string) => {
    await selectConversation(conversationId)
    onSelectConversation?.(conversationId)
  }

  if (isLoading) {
    return (
      <div className={cn("flex flex-col", className)}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 px-inset py-3">
            <Skeleton className="size-12 rounded-full shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-3.5 w-24 mb-1.5" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredConversations.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full p-6",
          className
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-muted mb-3">
          <ChatCircle
            size={28}
            className="text-muted-foreground"
          />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          {searchQuery ? t("noSearchResults") : t("noConversations")}
        </p>
        <p className="text-xs text-muted-foreground text-center">
          {searchQuery ? t("tryDifferentSearch") : t("noConversationsHint")}
        </p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col divide-y divide-border-subtle", className)}>
      {filteredConversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          currentUserId={currentUserId}
          isSelected={currentConversation?.id === conversation.id}
          onClick={() => handleSelectConversation(conversation.id)}
          locale={locale}
        />
      ))}
    </div>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  currentUserId: string | null
  isSelected: boolean
  onClick: () => void
  locale: string
}

function ConversationItem({
  conversation,
  currentUserId,
  isSelected,
  onClick,
  locale,
}: ConversationItemProps) {
  const t = useTranslations("Messages")
  const dateLocale = locale === "bg" ? bg : enUS

  // Determine if current user is buyer or seller in this conversation
  const isBuyer = currentUserId === conversation.buyer_id
  
  // Get the other party's profile using new structure
  const otherProfile = isBuyer 
    ? conversation.seller_profile 
    : conversation.buyer_profile
  
  // Build display name from profile data
  // Type guard for seller_profile which has business_name
  const sellerProfile = conversation.seller_profile
  const displayName = isBuyer
    ? (sellerProfile?.business_name || otherProfile?.display_name || otherProfile?.full_name || conversation.seller?.business_name || t("unknownUser"))
    : (otherProfile?.display_name || otherProfile?.full_name || conversation.buyer?.full_name || t("unknownUser"))
  
  // Get avatar URL from new profile structure with fallback
  const avatarUrl = otherProfile?.avatar_url || 
    (isBuyer ? conversation.seller?.profile?.avatar_url : conversation.buyer?.avatar_url)

  // Get unread count for current user's side
  const unreadCount = isBuyer 
    ? (conversation.buyer_unread_count || 0)
    : (conversation.seller_unread_count || 0)
  const hasUnread = unreadCount > 0

  const lastMessage = conversation.last_message
  // Check if last message was sent by current user
  const isOwnMessage = lastMessage?.sender_id === currentUserId

  // Format last message preview
  let lastMessagePreview = t("noMessages")
  if (lastMessage) {
    if (lastMessage.message_type === "image") {
      lastMessagePreview = t("imageMessage")
    } else if (lastMessage.content.trim()) {
      lastMessagePreview =
        lastMessage.content.length > 55
          ? lastMessage.content.slice(0, 55) + "..."
          : lastMessage.content
    }
  }

  // Format time - Instagram style (1h, 2d, 1w, etc.) using i18n
  const formatTime = (date: string) => {
    const now = new Date()
    const msgDate = new Date(date)
    const diffInHours = Math.floor(
      (now.getTime() - msgDate.getTime()) / (1000 * 60 * 60)
    )

    if (diffInHours < 1) return t("timeNow")
    if (diffInHours < 24) return t("timeHours", { count: diffInHours })

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return t("timeDays", { count: diffInDays })

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return t("timeWeeks", { count: diffInWeeks })

    return formatDistanceToNow(msgDate, { addSuffix: false, locale: dateLocale })
  }

  const timeDisplay = conversation.last_message_at
    ? formatTime(conversation.last_message_at)
    : ""

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-center gap-3 px-inset py-3 transition-colors min-h-touch-lg",
        "hover:bg-hover active:bg-active",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected && "bg-selected hover:bg-selected"
      )}
    >
      {/* Avatar with product thumbnail overlay */}
      <div className="relative shrink-0">
        <UserAvatar
          name={displayName}
          avatarUrl={avatarUrl ?? null}
          size="lg"
          fallbackClassName="bg-primary text-primary-foreground text-sm font-semibold"
        />
        {/* Product thumbnail overlay */}
        {conversation.product?.images?.[0] && (
          <div className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full border-2 border-background overflow-hidden bg-muted">
            <Image
              src={conversation.product.images[0]}
              alt=""
              width={20}
              height={20}
              className="size-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name, time, unread */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "truncate text-body font-semibold",
              hasUnread && "text-foreground"
            )}
          >
            {displayName}
          </span>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            {timeDisplay ? (
              <span className={cn("text-2xs", hasUnread ? "text-foreground" : "text-muted-foreground")}>
                {timeDisplay}
              </span>
            ) : null}
            {hasUnread ? <span aria-hidden="true" className="size-2 rounded-full bg-primary" /> : null}
          </div>
        </div>

        {/* Last message preview */}
        <p
          className={cn(
            "mt-0.5 flex items-center gap-1.5 truncate text-tiny",
            hasUnread ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {lastMessage?.message_type === "image" ? (
            <span className="inline-flex items-center gap-1.5">
              <ImageIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">{isOwnMessage ? `${t("you")}: ${lastMessagePreview}` : lastMessagePreview}</span>
            </span>
          ) : (
            <span className="truncate">{isOwnMessage ? `${t("you")}: ${lastMessagePreview}` : lastMessagePreview}</span>
          )}
        </p>
      </div>
    </button>
  )
}
