"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { ChatCircle, PaperPlaneTilt, Bell, CaretRight } from "@phosphor-icons/react"
import { CountBadge } from "@/components/ui/count-badge"

interface MessagesDropdownProps {
  user: User | null
  unreadCount?: number
}

export function MessagesDropdown({ user, unreadCount = 0 }: MessagesDropdownProps) {
  const t = useTranslations("MessagesDropdown")
  const tNav = useTranslations("Navigation")

  // Don't show messages icon for non-authenticated users
  if (!user) {
    return null
  }

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link href="/chat" aria-label={`${tNav("messagesLabel")}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}>
          <Button
            variant="ghost"
            size="icon-xl"
            className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative [&_svg]:size-6"
          >
            <span className="relative" aria-hidden="true">
              <ChatCircle weight="regular" />
              {unreadCount > 0 && (
                <CountBadge
                  count={unreadCount}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground"
                  aria-hidden="true"
                />
              )}
            </span>
          </Button>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
          <div className="flex items-center gap-2">
            <ChatCircle size={20} weight="regular" className="text-muted-foreground" />
            <h3 className="font-semibold text-base text-foreground">{t("title")}</h3>
          </div>
        </div>

        <div className="p-3">
          <div className="space-y-1">
            <Link href="/chat" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
              <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                <ChatCircle size={20} weight="duotone" className="text-brand" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("inbox")}</p>
                <p className="text-xs text-muted-foreground">{t("inboxDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>

            <Link
              href="/chat?filter=sellers"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group"
            >
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <PaperPlaneTilt size={20} weight="duotone" className="text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("sellerMessages")}</p>
                <p className="text-xs text-muted-foreground">{t("sellerMessagesDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>

            <Link
              href="/chat?filter=notifications"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group"
            >
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Bell size={20} weight="duotone" className="text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("notifications")}</p>
                <p className="text-xs text-muted-foreground">{t("notificationsDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>
          </div>
        </div>

        <div className="p-3 bg-muted border-t border-border">
          <Link href="/chat">
            <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
              {t("viewAllMessages")}
            </Button>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
