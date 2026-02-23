"use client"

import { useState, lazy, Suspense } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { MessageProvider, useMessages } from "@/components/providers/message-context"
import { ConversationList } from "./conversation-list"
import { ChatInterfaceSkeletonInline } from "./chat-skeleton"
import { cn } from "@/lib/utils"
import { ArrowLeft, MessageCircle as ChatCircle, Mail as EnvelopeSimple, Search as MagnifyingGlass, ShoppingCart, Store as Storefront, Inbox as Tray } from "lucide-react";

import { Input } from "@/components/ui/input"
import { Link } from "@/i18n/routing"
import type { ChatInterfaceServerActions } from "./chat-interface"

// Filter types for the bottom navigation
type MessageFilter = "all" | "unread" | "buying" | "selling"

// Dynamic import for ChatInterface - heavy component loaded on interaction
const ChatInterface = lazy(() =>
  import("./chat-interface").then((mod) => ({ default: mod.ChatInterface }))
)

// Bottom Tab Bar component for chat filtering
function ChatBottomTabs({ 
  activeFilter, 
  onFilterChange 
}: { 
  activeFilter: MessageFilter
  onFilterChange: (filter: MessageFilter) => void 
}) {
  const t = useTranslations("Messages")
  
  const tabs = [
    { id: "all" as const, label: t("tabAll"), icon: Tray },
    { id: "unread" as const, label: t("tabUnread"), icon: EnvelopeSimple },
    { id: "buying" as const, label: t("tabBuying"), icon: ShoppingCart },
    { id: "selling" as const, label: t("tabSelling"), icon: Storefront },
  ]

  return (
    <div className="shrink-0 border-t border-border-subtle bg-background pb-safe lg:hidden">
        <div className="flex items-center justify-around h-(--spacing-bottom-nav)">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeFilter === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              aria-pressed={isActive}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                className="size-5"
              />
              <span className={cn(
                "text-2xs font-medium",
                isActive && "font-semibold"
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MessagesContent({ actions }: { actions: ChatInterfaceServerActions }) {
  const t = useTranslations("Messages")
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<MessageFilter>("all")
  const { currentConversation } = useMessages()

  const labels = {
    searchPlaceholder: t("searchPlaceholder"),
    title: t("pageTitle"),
    back: t("back"),
  }

  // Navigate to conversation URL when selecting (updates browser URL for sharing/refresh)
  const handleSelectConversation = (conversationId: string) => {
    // On mobile: navigate to dedicated conversation page with proper URL
    // On desktop: show inline but also update URL for bookmarkability
    router.push(`/chat/${conversationId}`)
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Conversation list - full width on mobile, sidebar on desktop */}
      <div
        className={cn(
          "w-full flex flex-col overflow-hidden lg:w-80 xl:w-96 lg:border-r border-border-subtle",
          "flex"
        )}
      >
        {/* Header with back button, title and search */}
        <div className="shrink-0 border-b border-border-subtle bg-background px-inset py-2 pt-safe-max-sm">
          {/* Title row with back button */}
          <div className="flex items-center gap-2 mb-3">
            {/* Back button - goes to home */}
            <Link 
              href="/"
              className="flex size-(--control-default) items-center justify-center rounded-full transition-colors hover:bg-hover active:bg-active lg:hidden"
              aria-label={labels.back}
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg font-semibold text-foreground">{labels.title}</h1>
          </div>
          
          {/* Search bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={labels.searchPlaceholder}
                className="h-(--control-default) rounded-full border-0 bg-surface-subtle pl-9 focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Conversation list */}
        <ConversationList
          className="flex-1 min-h-0 overflow-y-auto"
          onSelectConversation={handleSelectConversation}
          searchQuery={searchQuery}
          filter={activeFilter}
        />

        {/* Bottom tab bar for filtering - mobile only */}
        <ChatBottomTabs 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
      </div>

      {/* Chat area */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden",
        "hidden lg:flex"
      )}>
          {currentConversation ? (
            <Suspense fallback={<ChatInterfaceSkeletonInline />}>
            <ChatInterface
              className="h-full"
              actions={actions}
            />
            </Suspense>
          ) : (
          /* Empty state - Desktop only */
          <div className="hidden lg:flex flex-col items-center justify-center h-full bg-surface-subtle">
            <div className="flex flex-col items-center gap-4 p-4 text-center max-w-sm">
              <div className="flex size-20 items-center justify-center rounded-full border-2 border-border bg-background">
                <ChatCircle size={40} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{t("selectConversation")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("selectConversationDescription")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface MessagesPageClientProps {
  actions: ChatInterfaceServerActions
  initialSellerId?: string | undefined
  initialProductId?: string | undefined
}

export function MessagesPageClient({ actions, initialSellerId, initialProductId }: MessagesPageClientProps) {
  return (
    <MessageProvider initialSellerId={initialSellerId} initialProductId={initialProductId}>
      <MessagesContent actions={actions} />
    </MessageProvider>
  )
}
