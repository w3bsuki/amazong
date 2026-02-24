"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { User } from "@supabase/supabase-js"
import { ChevronRight as CaretRight, MessageCircle as ChatCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/client"
import { useSupabasePostgresChanges } from "@/hooks/use-supabase-postgres-changes"
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
  const userId = user?.id

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc("get_total_unread_messages")
      if (!error && typeof data === "number") {
        setUnreadCount(data)
      }
    } catch {
      // Keep resilient
    }
  }, [userId])

  const realtimeSpecs = useMemo(() => {
    if (!userId) return []

    return [
      {
        channel: `messages-unread-buyer:${userId}`,
        event: "UPDATE",
        schema: "public",
        table: "conversations",
        filter: `buyer_id=eq.${userId}`,
      },
      {
        channel: `messages-unread-seller:${userId}`,
        event: "UPDATE",
        schema: "public",
        table: "conversations",
        filter: `seller_id=eq.${userId}`,
      },
    ] as const
  }, [userId])

  const refreshUnreadCount = useCallback(() => {
    void fetchUnreadCount()
  }, [fetchUnreadCount])

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

  useSupabasePostgresChanges({
    enabled: Boolean(userId),
    specs: realtimeSpecs,
    onChange: refreshUnreadCount,
  })

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
