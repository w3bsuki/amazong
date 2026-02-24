
import { useCallback, useEffect, useState } from "react"
import {
  fetchConversation,
  fetchConversations,
  fetchMessages,
  fetchTotalUnreadCount,
} from "@/lib/supabase/messages"
import type { Conversation, Message } from "@/lib/types/messages"
import type { SupabaseBrowserClient, UseMessagesStateReturn } from "./message-context.types"

export function useMessagesState({
  supabase,
  enabled = true,
}: {
  supabase: SupabaseBrowserClient
  enabled?: boolean
}): UseMessagesStateReturn {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [totalUnreadCount, setTotalUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(enabled)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setCurrentUserId(null)
      setConversations([])
      setCurrentConversation(null)
      setMessages([])
      setTotalUnreadCount(0)
      setError(null)
      setIsLoading(false)
      setIsLoadingMessages(false)
      setIsOtherUserTyping(false)
      return
    }

    let cancelled = false

    const getUser = async () => {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (cancelled) return

      if (user) {
        setCurrentUserId(user.id)
      } else {
        setIsLoading(false)
      }
    }

    void getUser()

    return () => {
      cancelled = true
    }
  }, [enabled, supabase])

  const refreshUnreadCount = useCallback(async () => {
    if (!enabled || !currentUserId) return

    try {
      const count = await fetchTotalUnreadCount(supabase)
      setTotalUnreadCount(count)
    } catch (err) {
      console.error("Error fetching unread count:", err)
    }
  }, [enabled, supabase, currentUserId])

  const loadConversations = useCallback(async () => {
    if (!enabled || !currentUserId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchConversations(supabase, currentUserId)
      setConversations(result.conversations)
      setTotalUnreadCount(result.unreadCount)
    } catch (err) {
      console.error("Error loading conversations:", err)
      setError("Failed to load conversations")
    } finally {
      setIsLoading(false)
    }
  }, [enabled, supabase, currentUserId])

  const selectConversation = useCallback(
    async (conversationId: string) => {
      setIsLoadingMessages(true)
      setError(null)

      try {
        let conv = conversations.find((conversation) => conversation.id === conversationId)

        if (!conv) {
          conv = await fetchConversation(supabase, conversationId)
        }

        setCurrentConversation(conv)

        const msgs = await fetchMessages(supabase, conversationId)
        setMessages(msgs)
      } catch (err) {
        console.error("Error loading messages:", err)
        setError("Failed to load messages")
      } finally {
        setIsLoadingMessages(false)
      }
    },
    [supabase, conversations],
  )

  useEffect(() => {
    if (!enabled || !currentUserId) return
    void loadConversations()
  }, [enabled, currentUserId, loadConversations])

  return {
    currentUserId,
    conversations,
    currentConversation,
    messages,
    totalUnreadCount,
    isLoading,
    isLoadingMessages,
    error,
    isOtherUserTyping,
    setConversations,
    setCurrentConversation,
    setMessages,
    setTotalUnreadCount,
    setError,
    loadConversations,
    selectConversation,
    refreshUnreadCount,
  }
}
