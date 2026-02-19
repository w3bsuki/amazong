import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { User } from "@supabase/supabase-js"
import { ChevronRight as CaretRight, MessageCircle as ChatCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/client"
import { HeaderDropdown } from "@/components/shared/header-dropdown"
import { HeaderDropdownFooter, HeaderDropdownTitleRow } from "@/components/shared/header-dropdown-shell"
import { HeaderIconTrigger } from "@/components/shared/header-icon-trigger"

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
        <HeaderIconTrigger
          icon={<ChatCircle />}
          badgeCount={unreadCount}
          className="hover:text-header-text"
          badgeClassName="absolute -top-1 -right-1 bg-notification text-primary-foreground ring-2 ring-header-bg h-4.5 min-w-4.5 px-1 text-2xs shadow-sm"
        />
      }
    >
        <HeaderDropdownTitleRow
          icon={<ChatCircle size={20} />}
          title={t("title")}
          count={unreadCount}
        />

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-3">
            {unreadCount > 0
              ? t("unreadDescription", { count: unreadCount })
              : t("noMessages")}
          </p>
        </div>

        {/* Footer */}
        <HeaderDropdownFooter>
          <Button asChild variant="cta" className="w-full h-9 text-sm">
            <Link href="/chat" onClick={() => setIsOpen(false)}>
              {t("openInbox")}
              <CaretRight size={14} className="ml-1" />
            </Link>
          </Button>
        </HeaderDropdownFooter>
    </HeaderDropdown>
  )
}
