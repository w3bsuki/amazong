"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useSupabasePostgresChanges } from "@/hooks/use-supabase-postgres-changes"
import { useTranslations } from "next-intl"
import { SupportChatWidgetView, type SupportMessage } from "./support-chat-widget-view"

const SUPPORT_SUBJECT = "SUPPORT_CHAT"

interface SupportChatWidgetProps {
  className?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}

function formatSupportMessageTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function SupportChatWidget({
  className,
  isOpen: controlledIsOpen,
  onOpenChange,
  hideTrigger = false,
}: SupportChatWidgetProps) {
  const t = useTranslations("CustomerService")
  const tCommon = useTranslations("Common")
  const supabase = createClient()

  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    }
    setUncontrolledIsOpen(open)
  }

  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setUserId(user?.id || null)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session?.user)
      setUserId(session?.user?.id || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const loadConversation = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .eq("buyer_id", userId)
        .eq("subject", SUPPORT_SUBJECT)
        .single()

      if (existingConv) {
        setConversationId(existingConv.id)
        const { data: msgs } = await supabase
          .from("messages")
          .select(`
            id,
            content,
            sender_id,
            created_at
          `)
          .eq("conversation_id", existingConv.id)
          .order("created_at", { ascending: true })

        if (msgs) {
          const formattedMsgs: SupportMessage[] = msgs.map((message) => ({
            id: message.id,
            content: message.content,
            sender_id: message.sender_id,
            is_support: message.sender_id !== userId,
            created_at: message.created_at,
          }))
          setMessages(formattedMsgs)
        }
      }
    } catch (error) {
      console.error("Error loading support conversation:", error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, userId])

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadConversation()
    }
  }, [isOpen, isAuthenticated, loadConversation])

  const realtimeSpecs = useMemo(() => {
    if (!conversationId) return [] as const

    return [
      {
        channel: `support-chat-${conversationId}`,
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
    ] as const
  }, [conversationId])

  const handleMessageInsert = useCallback(
    (payload: unknown) => {
      const newMsg = (payload as { new: {
        id: string
        content: string
        sender_id: string
        created_at: string
      } }).new

      setMessages((previous) => {
        if (previous.some((message) => message.id === newMsg.id)) return previous
        return [
          ...previous,
          {
            id: newMsg.id,
            content: newMsg.content,
            sender_id: newMsg.sender_id,
            is_support: newMsg.sender_id !== userId,
            created_at: newMsg.created_at,
          },
        ]
      })
    },
    [userId]
  )

  useSupabasePostgresChanges({
    enabled: Boolean(conversationId),
    specs: realtimeSpecs,
    onPayload: handleMessageInsert,
    supabase,
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !userId || isSending) return

    setIsSending(true)
    const messageContent = newMessage.trim()
    setNewMessage("")

    try {
      let currentConvId = conversationId

      if (!currentConvId) {
        const { data: adminUser } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "admin")
          .limit(1)
          .single()

        if (!adminUser) {
          throw new Error("No support agent available")
        }

        const { data: newConv, error: convError } = await supabase
          .from("conversations")
          .insert({
            buyer_id: userId,
            seller_id: adminUser.id,
            subject: SUPPORT_SUBJECT,
            status: "open",
          })
          .select("id")
          .single()

        if (convError) throw convError
        currentConvId = newConv.id
        setConversationId(currentConvId)
      }

      const { error: msgError } = await supabase
        .from("messages")
        .insert({
          conversation_id: currentConvId,
          sender_id: userId,
          content: messageContent,
          message_type: "text",
        })

      if (msgError) throw msgError

      const optimisticMsg: SupportMessage = {
        id: `temp-${Date.now()}`,
        content: messageContent,
        sender_id: userId,
        is_support: false,
        created_at: new Date().toISOString(),
      }
      setMessages((previous) => [...previous, optimisticMsg])
    } catch (error) {
      console.error("Error sending message:", error)
      setNewMessage(messageContent)
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <SupportChatWidgetView
      className={className}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      hideTrigger={hideTrigger}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      messages={messages}
      newMessage={newMessage}
      isSending={isSending}
      setNewMessage={setNewMessage}
      handleKeyDown={handleKeyDown}
      handleSend={handleSend}
      formatTime={formatSupportMessageTime}
      scrollRef={scrollRef}
      inputRef={inputRef}
      t={t}
      tCommon={tCommon}
    />
  )
}
