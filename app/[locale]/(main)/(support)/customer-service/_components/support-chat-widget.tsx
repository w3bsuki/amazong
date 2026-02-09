"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChatCircleDots, PaperPlaneTilt, X, Headphones } from "@phosphor-icons/react"
import { Spinner } from "@/components/shared/spinner"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { AuthGateCard } from "@/components/shared/auth/auth-gate-card"

// Support chat configuration
const SUPPORT_SUBJECT = "SUPPORT_CHAT"

interface SupportMessage {
  id: string
  content: string
  sender_id: string
  is_support: boolean
  created_at: string
  sender_name?: string
}

interface SupportChatWidgetProps {
  className?: string
  /** External control for open state */
  isOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Hide the floating trigger button (for external control) */
  hideTrigger?: boolean
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

  // Support both controlled and uncontrolled modes
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

  // Check authentication status
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

  // Load or create support conversation
  const loadConversation = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      // Check for existing support conversation
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .eq("buyer_id", userId)
        .eq("subject", SUPPORT_SUBJECT)
        .single()

      if (existingConv) {
        setConversationId(existingConv.id)
        // Load messages
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
          const formattedMsgs: SupportMessage[] = msgs.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender_id: msg.sender_id,
            is_support: msg.sender_id !== userId,
            created_at: msg.created_at,
          }))
          setMessages(formattedMsgs)
        }
      }
    } catch (err) {
      console.error("Error loading support conversation:", err)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, userId])

  // Load conversation when opened
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadConversation()
    }
  }, [isOpen, isAuthenticated, loadConversation])

  // Set up realtime subscription
  useEffect(() => {
    if (!conversationId) return

    const channel = supabase
      .channel(`support-chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as {
            id: string
            content: string
            sender_id: string
            created_at: string
          }

          // Avoid duplicates
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, {
              id: newMsg.id,
              content: newMsg.content,
              sender_id: newMsg.sender_id,
              is_support: newMsg.sender_id !== userId,
              created_at: newMsg.created_at,
            }]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, conversationId, userId])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !userId || isSending) return

    setIsSending(true)
    const messageContent = newMessage.trim()
    setNewMessage("")

    try {
      let currentConvId = conversationId

      // Create conversation if doesn't exist
      if (!currentConvId) {
        // Get first admin user as support agent
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

      // Send message
      const { error: msgError } = await supabase
        .from("messages")
        .insert({
          conversation_id: currentConvId,
          sender_id: userId,
          content: messageContent,
          message_type: "text",
        })

      if (msgError) throw msgError

      // Add optimistic message (will be confirmed by realtime)
      const optimisticMsg: SupportMessage = {
        id: `temp-${Date.now()}`,
        content: messageContent,
        sender_id: userId,
        is_support: false,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, optimisticMsg])

    } catch (err) {
      console.error("Error sending message:", err)
      // Restore message on error
      setNewMessage(messageContent)
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Format time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {!hideTrigger && (
        <SheetTrigger asChild>
          <Button
            size="lg"
            className={cn(
              "fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow bg-primary hover:bg-interactive-hover",
              "md:bottom-6 md:right-6",
              className
            )}
            aria-label={t("startChatting")}
          >
            <ChatCircleDots className="size-6" weight="fill" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side="right"
        className="w-full sm:w-(--container-modal-sm) p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-muted rounded-full flex items-center justify-center">
              <Headphones className="size-5" weight="fill" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-primary-foreground text-lg">{t("contactUs")}</SheetTitle>
              <p className="text-foreground text-sm">{t("needMoreHelp")}</p>
            </div>
          </div>
        </SheetHeader>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Headphones className="size-12 text-muted-foreground mb-4" />
              <AuthGateCard
                title={t("signInRequired")}
                showBackToHome={false}
                className="border-0 shadow-none bg-transparent max-w-none"
              />
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner className="size-8 text-primary" label={tCommon("loading")} />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <ChatCircleDots className="size-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t("startConversation") || "Start a conversation with our support team"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                help@treido.com
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.is_support ? "justify-start" : "justify-end"
                  )}
                >
                  {msg.is_support && (
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage src="/images/support-avatar.png" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        TS
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-(--support-chat-message-max-w) rounded-lg px-3 py-2",
                      msg.is_support
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap wrap-break-word">
                      {msg.content}
                    </p>
                    <p
                      className={cn(
                        "text-2xs mt-1",
                        msg.is_support ? "text-muted-foreground" : "text-foreground"
                      )}
                    >
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input area */}
        {isAuthenticated && (
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("typeMessage") || "Type a message..."}
                disabled={isSending}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!newMessage.trim() || isSending}
                className="bg-primary hover:bg-interactive-hover shrink-0"
                aria-label={t("sendMessage")}
              >
                {isSending ? (
                  <Spinner className="size-4" label={tCommon("loading")} />
                ) : (
                  <PaperPlaneTilt className="size-4" weight="fill" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {t("emailAlternative") || "Or email us at"}{" "}
              <a href="mailto:help@treido.com" className="text-primary hover:underline">
                help@treido.com
              </a>
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
