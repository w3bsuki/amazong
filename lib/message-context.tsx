"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

// Types
export interface Conversation {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string | null
  order_id: string | null
  subject: string | null
  status: "open" | "closed" | "archived"
  last_message_at: string
  buyer_unread_count: number
  seller_unread_count: number
  created_at: string
  updated_at: string
  // Joined data
  seller?: {
    id: string
    business_name: string
    user_id: string
    profile?: {
      full_name: string
      avatar_url: string | null
    }
  }
  buyer?: {
    id: string
    full_name: string
    avatar_url: string | null
  }
  product?: {
    id: string
    title: string
    images: string[]
  }
  last_message?: Message
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: "text" | "image" | "order_update" | "system"
  attachment_url: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
  // Joined data
  sender?: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

// Raw conversation from Supabase
interface RawConversation {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string | null
  order_id: string | null
  subject: string | null
  status: "open" | "closed" | "archived"
  last_message_at: string
  buyer_unread_count: number
  seller_unread_count: number
  created_at: string
  updated_at: string
  product?: {
    id: string
    title: string
    images: string[]
  } | null
}

// Raw message from Supabase
interface RawMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: "text" | "image" | "order_update" | "system"
  attachment_url: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

interface MessageContextValue {
  // State
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  totalUnreadCount: number
  isLoading: boolean
  isLoadingMessages: boolean
  error: string | null

  // Actions
  loadConversations: () => Promise<void>
  selectConversation: (conversationId: string) => Promise<void>
  sendMessage: (content: string, attachmentUrl?: string) => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
  startConversation: (sellerId: string, productId?: string, subject?: string) => Promise<string>
  closeConversation: (conversationId: string) => Promise<void>
  refreshUnreadCount: () => Promise<void>
}

const MessageContext = createContext<MessageContextValue | undefined>(undefined)

export function useMessages() {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider")
  }
  return context
}

interface MessageProviderProps {
  children: React.ReactNode
}

export function MessageProvider({ children }: MessageProviderProps) {
  const supabase = createClient()
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [totalUnreadCount, setTotalUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  // Load total unread count
  const refreshUnreadCount = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc("get_total_unread_messages")
      if (!error && data !== null) {
        setTotalUnreadCount(data)
      }
    } catch (err) {
      console.error("Error fetching unread count:", err)
    }
  }, [supabase])

  // Load all conversations for the current user - OPTIMIZED with single RPC call
  const loadConversations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error("Auth error:", authError)
        setConversations([])
        setIsLoading(false)
        return
      }
      
      if (!userData.user) {
        setConversations([])
        setIsLoading(false)
        return
      }

      const userId = userData.user.id

      // OPTIMIZED: Single RPC call instead of N+1 queries
      const { data, error: fetchError } = await supabase.rpc('get_user_conversations', {
        p_user_id: userId
      })

      if (fetchError) {
        // Fallback to basic query if RPC not available (migration not run yet)
        console.warn("RPC not available, using fallback query:", fetchError.message)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("conversations")
          .select(`*, product:products(id, title, images)`)
          .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
          .order("last_message_at", { ascending: false, nullsFirst: false })
        
        if (fallbackError) throw fallbackError
        
        // Fetch seller info for all conversations
        const sellerIds = [...new Set((fallbackData || []).map((c: RawConversation) => c.seller_id))]
        const { data: sellerData } = await supabase
          .from("sellers")
          .select("id, store_name")
          .in("id", sellerIds)
        
        const sellerMap = new Map(sellerData?.map(s => [s.id, s.store_name]) || [])
        
        // Transform fallback data to expected format with actual seller names
        const transformed = (fallbackData || []).map((conv: RawConversation) => ({
          ...conv,
          buyer: { id: conv.buyer_id, full_name: null, avatar_url: null },
          seller: { 
            id: conv.seller_id, 
            business_name: sellerMap.get(conv.seller_id) || "Seller",
            user_id: conv.seller_id,
            profile: null 
          },
          last_message: null
        })) as Conversation[]
        
        setConversations(transformed)
        await refreshUnreadCount()
        setIsLoading(false)
        return
      }

      if (!data || data.length === 0) {
        setConversations([])
        setIsLoading(false)
        await refreshUnreadCount()
        return
      }

      // Transform RPC result to Conversation type
      const conversationsWithProfiles = data.map((row: {
        id: string
        buyer_id: string
        seller_id: string
        product_id: string | null
        order_id: string | null
        subject: string | null
        status: "open" | "closed" | "archived"
        last_message_at: string
        buyer_unread_count: number
        seller_unread_count: number
        created_at: string
        updated_at: string
        buyer_full_name: string | null
        buyer_avatar_url: string | null
        seller_full_name: string | null
        seller_avatar_url: string | null
        store_name: string | null
        store_slug: string | null
        product_title: string | null
        product_images: string[] | null
        last_message_id: string | null
        last_message_content: string | null
        last_message_sender_id: string | null
        last_message_type: string | null
        last_message_created_at: string | null
      }) => ({
        id: row.id,
        buyer_id: row.buyer_id,
        seller_id: row.seller_id,
        product_id: row.product_id,
        order_id: row.order_id,
        subject: row.subject,
        status: row.status,
        last_message_at: row.last_message_at,
        buyer_unread_count: row.buyer_unread_count,
        seller_unread_count: row.seller_unread_count,
        created_at: row.created_at,
        updated_at: row.updated_at,
        buyer: {
          id: row.buyer_id,
          full_name: row.buyer_full_name,
          avatar_url: row.buyer_avatar_url
        },
        seller: row.store_name ? {
          id: row.seller_id,
          business_name: row.store_name,
          user_id: row.seller_id,
          profile: {
            full_name: row.seller_full_name || row.store_name,
            avatar_url: row.seller_avatar_url
          }
        } : null,
        product: row.product_id ? {
          id: row.product_id,
          title: row.product_title || "",
          images: row.product_images || []
        } : undefined,
        last_message: row.last_message_id ? {
          id: row.last_message_id,
          conversation_id: row.id,
          sender_id: row.last_message_sender_id || "",
          content: row.last_message_content || "",
          message_type: (row.last_message_type || "text") as "text" | "image" | "order_update" | "system",
          attachment_url: null,
          is_read: false,
          read_at: null,
          created_at: row.last_message_created_at || ""
        } : undefined
      })) as Conversation[]

      setConversations(conversationsWithProfiles)
      await refreshUnreadCount()
    } catch (err) {
      console.error("Error loading conversations:", err)
      setError("Failed to load conversations")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, refreshUnreadCount])

  // Select a conversation and load its messages
  const selectConversation = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true)
    setError(null)

    try {
      // Find conversation in the list
      const conversation = conversations.find((c) => c.id === conversationId)
      if (conversation) {
        setCurrentConversation(conversation)
      }

      // Fetch messages
      const { data: messagesData, error: fetchError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (fetchError) throw fetchError

      // Fetch sender profiles for each message
      const messagesWithSenders = await Promise.all(
        (messagesData || []).map(async (msg: RawMessage) => {
          const { data: senderProfile } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .eq("id", msg.sender_id)
            .single()

          return {
            ...msg,
            sender: senderProfile
          } as Message
        })
      )

      setMessages(messagesWithSenders)

      // Mark messages as read
      await markAsRead(conversationId)
    } catch (err) {
      console.error("Error loading messages:", err)
      setError("Failed to load messages")
    } finally {
      setIsLoadingMessages(false)
    }
  }, [supabase, conversations])

  // Send a message
  const sendMessage = useCallback(async (content: string, attachmentUrl?: string) => {
    if (!currentConversation) {
      setError("No conversation selected")
      return
    }

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Not authenticated")

      const { data, error: sendError } = await supabase
        .from("messages")
        .insert({
          conversation_id: currentConversation.id,
          sender_id: userData.user.id,
          content: content.trim(),
          message_type: attachmentUrl ? "image" : "text",
          attachment_url: attachmentUrl
        })
        .select("*")
        .single()

      if (sendError) throw sendError

      // Fetch sender profile
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", userData.user.id)
        .single()

      const messageWithSender = {
        ...data,
        sender: senderProfile
      } as Message

      // Add to local messages
      setMessages((prev) => [...prev, messageWithSender])

      // Update conversation in list
      await loadConversations()
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message")
      throw err
    }
  }, [supabase, currentConversation, loadConversations])

  // Mark messages as read
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await supabase.rpc("mark_messages_read", {
        p_conversation_id: conversationId
      })

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversation_id === conversationId && !msg.is_read
            ? { ...msg, is_read: true, read_at: new Date().toISOString() }
            : msg
        )
      )

      // Refresh unread count
      await refreshUnreadCount()

      // Update conversations list
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== conversationId) return conv
          return {
            ...conv,
            buyer_unread_count: 0,
            seller_unread_count: 0
          }
        })
      )
    } catch (err) {
      console.error("Error marking messages as read:", err)
    }
  }, [supabase, refreshUnreadCount])

  // Start a new conversation
  const startConversation = useCallback(async (
    sellerId: string,
    productId?: string,
    subject?: string
  ): Promise<string> => {
    try {
      const { data, error: startError } = await supabase.rpc(
        "get_or_create_conversation",
        {
          p_seller_id: sellerId,
          p_product_id: productId || null,
          p_order_id: null,
          p_subject: subject || null
        }
      )

      if (startError) throw startError

      // Reload conversations
      await loadConversations()

      return data as string
    } catch (err) {
      console.error("Error starting conversation:", err)
      setError("Failed to start conversation")
      throw err
    }
  }, [supabase, loadConversations])

  // Close a conversation
  const closeConversation = useCallback(async (conversationId: string) => {
    try {
      const { error: closeError } = await supabase
        .from("conversations")
        .update({ status: "closed" })
        .eq("id", conversationId)

      if (closeError) throw closeError

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, status: "closed" } : conv
        )
      )

      if (currentConversation?.id === conversationId) {
        setCurrentConversation((prev) =>
          prev ? { ...prev, status: "closed" } : null
        )
      }
    } catch (err) {
      console.error("Error closing conversation:", err)
      setError("Failed to close conversation")
    }
  }, [supabase, currentConversation])

  // Set up realtime subscription for new messages
  useEffect(() => {
    let realtimeChannel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      realtimeChannel = supabase
        .channel("messages-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages"
          },
          async (payload: { new: Record<string, unknown> }) => {
            const newMessage = payload.new as unknown as Message

            // Only handle if it's in the current conversation
            if (currentConversation && newMessage.conversation_id === currentConversation.id) {
              // Fetch full message with sender info
              const { data } = await supabase
                .from("messages")
                .select("*")
                .eq("id", newMessage.id)
                .single()

              if (data) {
                // Get sender profile
                const { data: senderProfile } = await supabase
                  .from("profiles")
                  .select("id, full_name, avatar_url")
                  .eq("id", data.sender_id)
                  .single()

                const messageWithSender = {
                  ...data,
                  sender: senderProfile
                } as Message

                setMessages((prev) => {
                  // Check if message already exists
                  if (prev.some((m) => m.id === data.id)) return prev
                  return [...prev, messageWithSender]
                })
              }
            }

            // Refresh conversations list and unread count
            await loadConversations()
          }
        )
        .subscribe()

      setChannel(realtimeChannel)
    }

    setupRealtime()

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
      }
    }
  }, [supabase, currentConversation, loadConversations])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [channel, supabase])

  const value: MessageContextValue = {
    conversations,
    currentConversation,
    messages,
    totalUnreadCount,
    isLoading,
    isLoadingMessages,
    error,
    loadConversations,
    selectConversation,
    sendMessage,
    markAsRead,
    startConversation,
    closeConversation,
    refreshUnreadCount
  }

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  )
}
