"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessageProvider, useMessages } from "@/components/providers/message-context"
import { ChatInterface, type ChatInterfaceServerActions } from "./chat-interface"
import { ChatInterfaceSkeleton } from "./chat-skeleton"

interface ConversationPageClientProps {
  conversationId: string
  actions: ChatInterfaceServerActions
}

/**
 * Client wrapper for conversation page
 * Handles selecting the conversation and setting up the message context
 * 
 * This component renders a full-viewport chat experience for direct conversation links
 * (e.g. /chat/[conversationId]). On mobile, this shows only the chat interface.
 * On desktop, the chat takes full width since the conversation list is not shown.
 */
function ConversationContent({ 
  conversationId, 
  actions 
}: ConversationPageClientProps) {
  const router = useRouter()
  const { 
    currentConversation, 
    selectConversation, 
    isLoading,
    isLoadingMessages 
  } = useMessages()

  // Select conversation on mount and when ID changes
  useEffect(() => {
    if (conversationId && currentConversation?.id !== conversationId) {
      selectConversation(conversationId)
    }
  }, [conversationId, currentConversation?.id, selectConversation])

  // Handle back navigation - go to conversation list
  const handleBack = () => {
    router.push("/chat")
  }

  // Show skeleton while loading
  if (isLoading || isLoadingMessages || !currentConversation) {
    return (
      <div className="flex h-full w-full overflow-hidden bg-background">
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatInterfaceSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Full-width chat for direct conversation links */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface
          className="h-full"
          onBack={handleBack}
          actions={actions}
        />
      </div>
    </div>
  )
}

/**
 * Conversation page client component
 * Wraps content with MessageProvider for chat state management
 */
export function ConversationPageClient(props: ConversationPageClientProps) {
  return (
    <MessageProvider>
      <ConversationContent {...props} />
    </MessageProvider>
  )
}
