"use client"

import { useState, lazy, Suspense } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { MessageProvider, useMessages } from "@/components/providers/message-context"
import { ConversationList } from "./conversation-list"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { PencilSimpleLine, MagnifyingGlass, ArrowLeft, Tray, EnvelopeSimple, ShoppingCart, Storefront, ChatCircle } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Link } from "@/i18n/routing"
import type { ChatInterfaceServerActions } from "./chat-interface"

// Filter types for the bottom navigation
type MessageFilter = "all" | "unread" | "buying" | "selling"

// Dynamic import for ChatInterface - heavy component loaded on interaction
const ChatInterface = lazy(() =>
  import("./chat-interface").then((mod) => ({ default: mod.ChatInterface }))
)

// Loading skeleton for ChatInterface - Instagram style
function ChatInterfaceSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header skeleton */}
      <div className="shrink-0 border-b border-border-subtle px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-28 mb-1.5" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
      {/* Messages area skeleton */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        <div className="flex items-end gap-2">
          <Skeleton className="size-7 rounded-full shrink-0" />
          <Skeleton className="h-12 w-48 rounded-md rounded-bl-md" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-12 w-40 rounded-md rounded-br-md" />
        </div>
        <div className="flex items-end gap-2">
          <Skeleton className="size-7 rounded-full shrink-0" />
          <Skeleton className="h-16 w-56 rounded-md rounded-bl-md" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-md rounded-br-md" />
        </div>
      </div>
      {/* Input skeleton */}
      <div className="shrink-0 border-t border-border-subtle p-3">
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  )
}

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
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeFilter === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                className="size-5" 
                weight={isActive ? "fill" : "regular"}
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
  
  const [showChat, setShowChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<MessageFilter>("all")
  const { currentConversation } = useMessages()

  const labels = {
    searchPlaceholder: t("searchPlaceholder"),
    newMessage: t("newMessage"),
    title: t("pageTitle"),
    back: t("back"),
  }

  // Navigate to conversation URL when selecting (updates browser URL for sharing/refresh)
  const handleSelectConversation = (conversationId: string) => {
    // On mobile: navigate to dedicated conversation page with proper URL
    // On desktop: show inline but also update URL for bookmarkability
    router.push(`/chat/${conversationId}`)
  }

  // Handle back from inline chat view (desktop only)
  const handleBackFromChat = () => {
    setShowChat(false)
    router.push("/chat")
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Conversation list - full width on mobile, sidebar on desktop */}
      <div
        className={cn(
          "w-full flex flex-col overflow-hidden lg:w-80 xl:w-96 lg:border-r border-border-subtle",
          showChat ? "hidden lg:flex" : "flex"
        )}
      >
        {/* Header with back button, title and search */}
        <div className="shrink-0 p-3 lg:p-4 border-b border-border-subtle pt-safe-max-sm">
          {/* Title row with back button */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {/* Back button - goes to home */}
              <Link 
                href="/"
                className="flex items-center justify-center size-9 rounded-full hover:bg-muted transition-colors lg:hidden"
                aria-label={labels.back}
              >
                <ArrowLeft size={20} weight="regular" />
              </Link>
              <h1 className="text-xl font-bold">{labels.title}</h1>
            </div>
            <button 
              className="flex items-center justify-center size-9 rounded-full bg-primary text-primary-foreground hover:bg-interactive-hover transition-colors"
              aria-label={labels.newMessage}
            >
              <PencilSimpleLine size={20} weight="regular" />
            </button>
          </div>
          
          {/* Search bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={labels.searchPlaceholder}
                className="pl-9 h-10 rounded-full bg-surface-subtle border-0 focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            {/* New message button - desktop only (already have it in header on mobile) */}
            <button 
              className="hidden lg:flex shrink-0 items-center justify-center size-10 rounded-full bg-primary text-primary-foreground hover:bg-interactive-hover transition-colors"
              aria-label={labels.newMessage}
            >
              <PencilSimpleLine size={20} weight="regular" />
            </button>
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
        showChat ? "flex" : "hidden lg:flex"
      )}>
          {currentConversation ? (
            <Suspense fallback={<ChatInterfaceSkeleton />}>
            <ChatInterface
              className="h-full"
              onBack={handleBackFromChat}
              actions={actions}
            />
            </Suspense>
          ) : (
          /* Empty state - Desktop only */
          <div className="hidden lg:flex flex-col items-center justify-center h-full bg-surface-subtle">
            <div className="flex flex-col items-center gap-4 p-4 text-center max-w-sm">
              <div className="flex size-20 items-center justify-center rounded-full border-2 border-border bg-background">
                <ChatCircle size={40} weight="regular" className="text-muted-foreground" />
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
