"use client"

import { useState, useEffect, useCallback } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { ChatCircle, CaretRight } from "@phosphor-icons/react"
import { createClient } from "@/lib/supabase/client"
import { CountBadge } from "@/components/shared/count-badge"

interface MessagesDropdownProps {
  user: User | null
}

export function MessagesDropdown({ user }: MessagesDropdownProps) {
  const t = useTranslations("MessagesDropdown")
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc("get_total_unread_messages")
      if (!error && typeof data === "number") {
        setUnreadCount(data)
      }
    } catch {
      // Keep resilient
    }
  }, [user])

  // Initial fetch
  useEffect(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount])

  // Refresh on open
  useEffect(() => {
    if (isOpen) {
      fetchUnreadCount()
    }
  }, [isOpen, fetchUnreadCount])

  // Realtime subscription for conversation updates
  useEffect(() => {
    if (!user) return

    const supabase = createClient()
    const refresh = () => void fetchUnreadCount()

    const buyerChannel = supabase
      .channel(`messages-unread-buyer:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `buyer_id=eq.${user.id}`,
        },
        refresh
      )
      .subscribe()

    const sellerChannel = supabase
      .channel(`messages-unread-seller:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `seller_id=eq.${user.id}`,
        },
        refresh
      )
      .subscribe()

    return () => {
      supabase.removeChannel(buyerChannel)
      supabase.removeChannel(sellerChannel)
    }
  }, [user, fetchUnreadCount])

  if (!user) {
    return null
  }

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen} openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          href="/chat"
          data-testid="messages-dropdown"
          className="block rounded-md outline-none focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={`${t("title")}${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
        >
          <div className="inline-flex items-center justify-center border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative size-11 [&_svg]:size-6 cursor-pointer">
          <span className="relative" aria-hidden="true">
            <ChatCircle weight="regular" />
            {unreadCount > 0 && (
              <CountBadge
                count={unreadCount}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground ring-2 ring-header-bg h-4.5 min-w-4.5 px-1 text-2xs shadow-sm"
                aria-hidden="true"
              />
            )}
          </span>
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-64 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden shadow-dropdown"
        align="end"
        sideOffset={8}
        collisionPadding={10}
      >
        {/* Header */}
        <div className="flex items-center gap-2 p-4 bg-muted border-b border-border">
          <ChatCircle size={20} weight="regular" className="text-muted-foreground" />
          <h3 className="font-semibold text-base text-foreground">{t("title")}</h3>
          {unreadCount > 0 && (
            <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-3">
            {unreadCount > 0
              ? t("unreadDescription", { count: unreadCount })
              : t("noMessages")}
          </p>
        </div>

        {/* Footer */}
        <div className="p-3 bg-muted border-t border-border">
          <Link href="/chat" onClick={() => setIsOpen(false)}>
            <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
              {t("openInbox")}
              <CaretRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
