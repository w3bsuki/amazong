"use client"

import { useEffect, useMemo } from "react"
import { formatDistanceToNow } from "date-fns"
import { useTranslations, useLocale } from "next-intl"
import { bg, enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useMessages, type Conversation } from "@/components/providers/message-context"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatCircle, Check, Checks } from "@phosphor-icons/react"
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
    if (filter !== "all") {
      filtered = filtered.filter((conv) => {
        switch (filter) {
          case "unread":
            // Show conversations with unread messages
            return (
              (conv.buyer_unread_count || 0) > 0 ||
              (conv.seller_unread_count || 0) > 0
            )
          case "buying":
            // Show conversations where user is the buyer (has buyer field but not seller)
            return conv.buyer && !conv.seller
          case "selling":
            // Show conversations where user is the seller
            return conv.seller !== null && conv.seller !== undefined
          default:
            return true
        }
      })
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((conv) => {
        const displayName =
          conv.seller?.business_name ||
          conv.seller?.profile?.full_name ||
          conv.buyer?.full_name ||
          ""
        const productTitle = conv.product?.title || ""
        const lastMessage = conv.last_message?.content || ""
        return (
          displayName.toLowerCase().includes(query) ||
          productTitle.toLowerCase().includes(query) ||
          lastMessage.toLowerCase().includes(query)
        )
      })
    }

    return filtered
  }, [conversations, searchQuery, filter])

  const handleSelectConversation = async (conversationId: string) => {
    await selectConversation(conversationId)
    onSelectConversation?.(conversationId)
  }

  if (isLoading) {
    return (
      <div className={cn("flex flex-col", className)}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="size-14 rounded-full shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-3 w-40" />
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
          "flex flex-col items-center justify-center h-full p-8",
          className
        )}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
          <ChatCircle
            size={32}
            weight="regular"
            className="text-muted-foreground"
          />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          {searchQuery
            ? t("noSearchResults") || "No results found"
            : t("noConversations")}
        </p>
        <p className="text-xs text-muted-foreground text-center">
          {searchQuery
            ? t("tryDifferentSearch") || "Try a different search term"
            : t("noConversationsHint") || "Messages from sellers will appear here"}
        </p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {filteredConversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
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
  isSelected: boolean
  onClick: () => void
  locale: string
}

function ConversationItem({
  conversation,
  isSelected,
  onClick,
  locale,
}: ConversationItemProps) {
  const t = useTranslations("Messages")
  const dateLocale = locale === "bg" ? bg : enUS

  const otherParty = conversation.seller?.profile || conversation.buyer
  const displayName =
    conversation.seller?.business_name || otherParty?.full_name || t("unknownUser")
  const avatarUrl = otherParty?.avatar_url
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const unreadCount = conversation.buyer_unread_count || conversation.seller_unread_count
  const hasUnread = unreadCount > 0

  const lastMessage = conversation.last_message
  const isOwnMessage = false // TODO: Check if last message was sent by current user

  // Format last message preview
  let lastMessagePreview = ""
  if (lastMessage?.content) {
    lastMessagePreview =
      lastMessage.content.length > 35
        ? lastMessage.content.substring(0, 35) + "..."
        : lastMessage.content
  } else {
    lastMessagePreview = t("noMessages")
  }

  // Format time - Instagram style (1h, 2d, 1w, etc.)
  const formatTime = (date: string) => {
    const now = new Date()
    const msgDate = new Date(date)
    const diffInHours = Math.floor(
      (now.getTime() - msgDate.getTime()) / (1000 * 60 * 60)
    )

    if (diffInHours < 1) return locale === "bg" ? "сега" : "now"
    if (diffInHours < 24)
      return `${diffInHours}${locale === "bg" ? "ч" : "h"}`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}${locale === "bg" ? "д" : "d"}`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks}${locale === "bg" ? "сд" : "w"}`

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
        "w-full text-left flex items-center gap-3 px-4 py-3 transition-colors",
        "hover:bg-muted/60",
        isSelected && "bg-muted/80"
      )}
    >
      {/* Avatar with online indicator */}
      <div className="relative shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={56}
            height={56}
            className="size-14 rounded-full object-cover ring-2 ring-transparent"
          />
        ) : (
          <div
            className={cn(
              "flex size-14 items-center justify-center rounded-full text-base font-semibold",
              "bg-purple-600 text-white"
            )}
          >
            {initials}
          </div>
        )}
        {/* Product thumbnail overlay */}
        {conversation.product?.images?.[0] && (
          <div className="absolute -bottom-1 -right-1 size-6 rounded-full border-2 border-background overflow-hidden bg-muted">
            <Image
              src={conversation.product.images[0]}
              alt=""
              width={24}
              height={24}
              className="size-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name and time row */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span
            className={cn(
              "text-sm truncate",
              hasUnread ? "font-bold text-foreground" : "font-medium text-foreground"
            )}
          >
            {displayName}
          </span>
          <span
            className={cn(
              "text-xs shrink-0",
              hasUnread ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            {timeDisplay}
          </span>
        </div>

        {/* Product title if exists */}
        {conversation.product && (
          <p className="text-xs text-muted-foreground truncate mb-0.5">
            Re: {conversation.product.title}
          </p>
        )}

        {/* Last message preview with read status */}
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs truncate flex-1",
              hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
            )}
          >
            {lastMessagePreview}
          </span>

          {/* Read status icon (only for own messages) */}
          {isOwnMessage && (
            <span className="shrink-0">
              {hasUnread ? (
                <Check size={14} className="text-muted-foreground" />
              ) : (
                <Checks size={14} className="text-primary" weight="bold" />
              )}
            </span>
          )}

          {/* Unread badge */}
          {hasUnread && unreadCount > 0 && (
            <span className="ml-1 shrink-0 flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
