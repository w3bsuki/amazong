"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { User } from "@supabase/supabase-js"
import { ChevronRight as CaretRight, MessageCircle as ChatCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/client"
import { CountBadge } from "@/components/shared/count-badge"
import { HeaderDropdown } from "@/components/shared/header-dropdown"

interface MessagesDropdownProps {
  user: User | null
}

export function MessagesDropdown({ user }: MessagesDropdownProps) {
  const t = useTranslations("MessagesDropdown")
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const unreadSuffix = unreadCount > 0 ? ` (${unreadCount})` : ""

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
    <HeaderDropdown
      triggerHref="/chat"
      triggerTestId="messages-dropdown"
      ariaLabel={`${t("title")}${unreadSuffix}`}
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <div className="inline-flex items-center justify-center border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover active:bg-header-active relative size-11 [&_svg]:size-6 cursor-pointer tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none">
          <span className="relative" aria-hidden="true">
            <ChatCircle />
            {unreadCount > 0 && (
              <CountBadge
                count={unreadCount}
                className="absolute -top-1 -right-1 bg-notification text-primary-foreground ring-2 ring-header-bg h-4.5 min-w-4.5 px-1 text-2xs shadow-sm"
                aria-hidden="true"
              />
            )}
          </span>
        </div>
      }
    >
        <div className="flex items-center gap-2 p-4 bg-muted border-b border-border">
          <ChatCircle size={20} className="text-muted-foreground" />
          <h3 className="font-semibold text-base text-foreground">{t("title")}</h3>
          {unreadCount > 0 && (
            <span className="text-xs bg-notification text-primary-foreground px-2 py-0.5 rounded-full" aria-hidden="true">
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
          <Button asChild variant="cta" className="w-full h-9 text-sm">
            <Link href="/chat" onClick={() => setIsOpen(false)}>
              {t("openInbox")}
              <CaretRight size={14} className="ml-1" />
            </Link>
          </Button>
        </div>
    </HeaderDropdown>
  )
}
