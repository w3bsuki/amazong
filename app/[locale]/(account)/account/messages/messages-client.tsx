"use client"

import { useState, lazy, Suspense } from "react"
import { useTranslations } from "next-intl"
import { MessageProvider } from "@/lib/message-context"
import { ConversationList } from "@/components/conversation-list"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Dynamic import for ChatInterface - heavy component loaded on interaction
const ChatInterface = lazy(() => import("@/components/chat-interface").then(mod => ({ default: mod.ChatInterface })))

// Loading skeleton for ChatInterface
function ChatInterfaceSkeleton() {
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header skeleton */}
      <div className="shrink-0 border-b bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      {/* Messages area skeleton */}
      <div className="flex-1 overflow-y-auto bg-muted/20 p-4 space-y-3">
        <div className="flex">
          <Skeleton className="h-14 w-56 rounded" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-14 w-48 rounded" />
        </div>
        <div className="flex">
          <Skeleton className="h-14 w-64 rounded" />
        </div>
      </div>
      {/* Input skeleton */}
      <div className="shrink-0 border-t bg-background p-3">
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 rounded" />
          <Skeleton className="h-10 w-12 rounded" />
        </div>
      </div>
    </div>
  )
}

export function MessagesPageClient() {
  const t = useTranslations("Messages")
  const [showChat, setShowChat] = useState(false)

  return (
    <MessageProvider>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("pageTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("pageDescription")}</p>
        </div>

        <div className="flex min-h-128 flex-1 overflow-hidden rounded-lg border bg-card">
          {/* Conversation list */}
          <div
            className={cn(
              "w-full border-r md:w-72 lg:w-80",
              "md:block",
              showChat ? "hidden" : "block"
            )}
          >
            <div className="flex h-full flex-col">
              <div className="border-b bg-muted/30 px-4 py-3">
                <h2 className="text-sm font-semibold">{t("conversations")}</h2>
              </div>

              <ConversationList
                className="flex-1 overflow-y-auto"
                onSelectConversation={() => setShowChat(true)}
              />
            </div>
          </div>

          {/* Chat area */}
          <div className={cn("min-w-0 flex-1", "md:block", showChat ? "block" : "hidden")}>
            <Suspense fallback={<ChatInterfaceSkeleton />}>
              <ChatInterface className="h-full" onBack={() => setShowChat(false)} />
            </Suspense>
          </div>
        </div>
      </div>
    </MessageProvider>
  )
}
