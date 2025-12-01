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
    <div className="flex flex-col h-full bg-white">
      {/* Header skeleton */}
      <div className="shrink-0 border-b bg-secondary/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      {/* Messages area skeleton */}
      <div className="flex-1 overflow-y-auto bg-[#f4f4f4] p-4 space-y-3">
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
      <div className="shrink-0 border-t bg-white p-3">
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
      <div className="min-h-[calc(100vh-120px)] bg-[#EAEDED]">
        <div className="container py-4">
          {/* Page header - Amazon style */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-foreground">{t("pageTitle")}</h1>
          </div>

          {/* Messages layout - clean white card */}
          <div className="bg-white border rounded overflow-hidden">
            <div className="flex h-[calc(100vh-200px)] min-h-[500px]">
              {/* Conversation list */}
              <div className={cn(
                "w-full md:w-72 lg:w-80 border-r shrink-0",
                "md:block",
                showChat ? "hidden" : "block"
              )}>
                <div className="h-full flex flex-col">
                  {/* List header */}
                  <div className="px-4 py-3 border-b bg-[#F7F8F8]">
                    <h2 className="font-semibold text-sm">{t("conversations")}</h2>
                  </div>

                  {/* Conversation list */}
                  <ConversationList 
                    className="flex-1 overflow-y-auto"
                    onSelectConversation={() => setShowChat(true)}
                  />
                </div>
              </div>

              {/* Chat area */}
              <div className={cn(
                "flex-1 min-w-0",
                "md:block",
                showChat ? "block" : "hidden"
              )}>
                <Suspense fallback={<ChatInterfaceSkeleton />}>
                  <ChatInterface 
                    className="h-full"
                    onBack={() => setShowChat(false)}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MessageProvider>
  )
}
