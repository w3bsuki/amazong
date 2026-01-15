"use client"

import { useEffect, useMemo } from "react"
import { formatDistanceToNow } from "date-fns"
import { useTranslations, useLocale } from "next-intl"
import { bg, enUS } from "date-fns/locale"
import { cn, safeAvatarSrc } from "@/lib/utils"
import { AVATAR_VARIANTS, COLOR_PALETTES } from "@/lib/avatar-palettes"
import { Avatar as UiAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BoringAvatar from "boring-avatars"
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
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
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
            weight="regular"
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
    <div className={cn("flex flex-col", className)}>
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

  const parseBoringAvatar = (value?: string | null) => {
    if (!value || !value.startsWith("boring-avatar:")) return null
    const [, variantRaw, paletteRaw, seedRaw] = value.split(":")
    const variant = AVATAR_VARIANTS.includes(variantRaw as (typeof AVATAR_VARIANTS)[number])
      ? (variantRaw as (typeof AVATAR_VARIANTS)[number])
      : AVATAR_VARIANTS[0]
    const paletteIndex = Number.parseInt(paletteRaw || "0", 10)
    const colors = COLOR_PALETTES[Number.isNaN(paletteIndex) ? 0 : paletteIndex] ?? COLOR_PALETTES[0]
    const name = seedRaw || displayName || "user"
    return { variant, colors, name }
  }

  const boringAvatar = parseBoringAvatar(avatarUrl)
  const avatarSrc = boringAvatar ? undefined : safeAvatarSrc(avatarUrl)
    
  const initials = (displayName || "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Get unread count for current user's side
  const unreadCount = isBuyer 
    ? (conversation.buyer_unread_count || 0)
    : (conversation.seller_unread_count || 0)
  const hasUnread = unreadCount > 0

  const lastMessage = conversation.last_message
  // Check if last message was sent by current user
  const isOwnMessage = lastMessage?.sender_id === currentUserId

  // Format last message preview
  let lastMessagePreview = ""
  if (lastMessage?.content) {
    lastMessagePreview =
      lastMessage.content.length > 35
        ? lastMessage.content.slice(0, 35) + "..."
        : lastMessage.content
  } else {
    lastMessagePreview = t("noMessages")
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
        "w-full text-left flex items-center gap-3 px-3 py-2.5 transition-colors min-h-touch-lg",
        "hover:bg-muted/50 active:bg-muted/70",
        isSelected && "bg-muted/60"
      )}
    >
      {/* Avatar with product thumbnail overlay */}
      <div className="relative shrink-0">
        <UiAvatar className="size-12">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={displayName} /> : null}
          {boringAvatar ? (
            <AvatarFallback className="bg-transparent p-0">
              <BoringAvatar
                size={48}
                name={boringAvatar.name}
                variant={boringAvatar.variant}
                {...(boringAvatar.colors ? { colors: boringAvatar.colors } : {})}
              />
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {initials}
            </AvatarFallback>
          )}
        </UiAvatar>
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
            {t("replyPrefix")}: {conversation.product.title}
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
            <span className="ml-1 shrink-0 flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-2xs font-bold text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
