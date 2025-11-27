"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { MessageProvider } from "@/lib/message-context"
import { ConversationList } from "@/components/conversation-list"
import { ChatInterface } from "@/components/chat-interface"
import { cn } from "@/lib/utils"

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
                <ChatInterface 
                  className="h-full"
                  onBack={() => setShowChat(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MessageProvider>
  )
}
