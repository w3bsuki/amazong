"use client"

import { useCallback } from "react"
import { ChatCircle, Circle, Check, X } from "@phosphor-icons/react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
  DrawerBody,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useMessages, type Conversation } from "@/components/providers/message-context"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-state-manager"
import { UserAvatar } from "@/components/shared/user-avatar"

interface MessagesDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Maximum conversations to show in drawer */
const MAX_CONVERSATIONS = 5

/**
 * MessagesDrawer - Quick access to recent conversations
 * 
 * Shows the 5 most recent conversations with unread indicators.
 * Tapping a conversation navigates to the chat page.
 */
export function MessagesDrawer({ open, onOpenChange }: MessagesDrawerProps) {
  const { conversations, totalUnreadCount, isLoading } = useMessages()
  const { user } = useAuth()
  const t = useTranslations("Drawers")
  const tMessages = useTranslations("Messages")

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange])

  // Get the 5 most recent conversations (already sorted by last_message_at)
  const recentConversations = conversations.slice(0, MAX_CONVERSATIONS)

  // Helper to get the other party's display info
  const getOtherParty = useCallback(
    (conversation: Conversation) => {
      const isBuyer = user?.id === conversation.buyer_id
      if (isBuyer) {
        // Current user is buyer, show seller info
        const seller = conversation.seller_profile
        return {
          name: seller?.business_name || seller?.display_name || seller?.full_name || tMessages("unknownUser"),
          avatar: seller?.avatar_url,
        }
      }
      // Current user is seller, show buyer info
      const buyer = conversation.buyer_profile
      return {
        name: buyer?.display_name || buyer?.full_name || tMessages("unknownUser"),
        avatar: buyer?.avatar_url,
      }
    },
    [user?.id, tMessages]
  )

  // Helper to get unread count for current user
  const getUnreadCount = useCallback(
    (conversation: Conversation) => {
      const isBuyer = user?.id === conversation.buyer_id
      return isBuyer ? conversation.buyer_unread_count : conversation.seller_unread_count
    },
    [user?.id]
  )

  // Format relative time
  const formatRelativeTime = useCallback(
    (dateString: string | null) => {
      if (!dateString) return ""
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return tMessages("timeNow")
      if (diffMins < 60) return tMessages("timeMinutes", { count: diffMins })
      if (diffHours < 24) return tMessages("timeHours", { count: diffHours })
      return tMessages("timeDays", { count: diffDays })
    },
    [tMessages]
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-dialog-sm">
        <DrawerHeader className="pb-1.5 pt-0 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ChatCircle size={16} weight="regular" className="text-muted-foreground" />
              <DrawerTitle className="text-sm font-semibold">{t("messages")}</DrawerTitle>
              {totalUnreadCount > 0 && (
                <span className="text-xs text-destructive font-medium">
                  ({t("unreadCount", { count: totalUnreadCount })})
                </span>
              )}
            </div>
            <DrawerClose asChild>
              <IconButton
                aria-label={t("close")}
                variant="ghost"
                size="icon-compact"
                className="text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted"
              >
                <X size={20} weight="light" />
              </IconButton>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">{t("description")}</DrawerDescription>
        </DrawerHeader>

        {!user ? (
          <div className="flex flex-col items-center justify-center px-inset py-5">
            <div className="mb-2 flex size-(--control-default) items-center justify-center rounded-xl bg-muted">
              <ChatCircle size={22} weight="regular" className="text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground font-medium">
              {t("signInPrompt")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 text-center">
              {t("signInDescription")}
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="size-6 border-2 border-border-subtle border-t-foreground rounded-full animate-spin" />
          </div>
        ) : recentConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-inset py-5">
            <div className="mb-2 flex size-(--control-default) items-center justify-center rounded-xl bg-muted">
              <ChatCircle size={22} weight="regular" className="text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground font-medium">{tMessages("noConversations")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("startConversationHint")}
            </p>
          </div>
        ) : (
          <DrawerBody className="px-0">
            {recentConversations.map((conversation, index) => {
              const otherParty = getOtherParty(conversation)
              const unread = getUnreadCount(conversation)
              const lastMessage = conversation.last_message
              const productTitle = conversation.product?.title

              return (
                <Link
                  key={conversation.id}
                  href={`/chat/${conversation.id}`}
                  onClick={handleClose}
                  className={cn(
                    "flex gap-3 px-inset py-3",
                    "hover:bg-hover active:bg-active transition-colors",
                    "touch-manipulation tap-transparent",
                    index !== recentConversations.length - 1 && "border-b border-border"
                  )}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <UserAvatar
                      name={otherParty.name}
                      avatarUrl={otherParty.avatar ?? null}
                      size="lg"
                      className="border border-border bg-muted"
                      fallbackClassName="bg-muted text-muted-foreground"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm truncate",
                          unread > 0 ? "font-semibold text-foreground" : "font-medium text-foreground"
                        )}
                      >
                        {otherParty.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(conversation.last_message_at)}
                        </span>
                        {unread > 0 ? (
                          <Circle size={8} weight="fill" className="text-destructive" aria-label={tMessages("unread")} />
                        ) : (
                          <Check size={12} weight="bold" className="text-muted-foreground" aria-label={tMessages("read")} />
                        )}
                      </div>
                    </div>
                    {lastMessage && (
                      <p
                        className={cn(
                          "text-xs truncate mt-0.5",
                          unread > 0 ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {lastMessage.content}
                      </p>
                    )}
                    {productTitle && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {t("regarding")} {productTitle}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </DrawerBody>
        )}

        <DrawerFooter className="border-t border-border">
          <Link href="/chat" onClick={handleClose} className="w-full">
            <Button variant="outline" size="default" className="w-full">
              {t("viewAllMessages")}
            </Button>
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
