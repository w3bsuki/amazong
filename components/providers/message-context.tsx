"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

// =============================================================================
// TYPES - Clean interfaces matching actual database schema
// =============================================================================

export interface Conversation {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string | null
  order_id: string | null
  subject: string | null
  status: "open" | "closed" | "archived"
  last_message_at: string | null
  buyer_unread_count: number
  seller_unread_count: number
  created_at: string
  updated_at: string
  // Joined profile data (from direct foreign key joins)
  buyer_profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
    display_name: string | null
    username: string | null
  } | null
  seller_profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
    display_name: string | null
    business_name: string | null
    username: string | null
  } | null
  product: {
    id: string
    title: string
    images: string[]
  } | null
  last_message?: {
    content: string
    sender_id: string
    message_type: string
    created_at: string
  }
  // Legacy compatibility fields (mapped from new structure)
  buyer?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  seller?: {
    id: string
    business_name: string | null
    user_id: string
    profile?: {
      full_name: string | null
      avatar_url: string | null
    }
  }
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: "text" | "image" | "system"
  is_read: boolean
  read_at: string | null
  created_at: string
  sender?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  // Legacy field for compatibility
  attachment_url?: string | null
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
  currentUserId: string | null
  isOtherUserTyping: boolean

  // Actions
  loadConversations: () => Promise<void>
  selectConversation: (conversationId: string) => Promise<void>
  sendMessage: (content: string, attachmentUrl?: string) => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
  startConversation: (sellerId: string, productId?: string, subject?: string) => Promise<string>
  closeConversation: (conversationId: string) => Promise<void>
  refreshUnreadCount: () => Promise<void>
  sendTypingIndicator: () => void
}

const MessageContext = createContext<MessageContextValue | undefined>(undefined)

// =============================================================================
// HOOK - Safe to use anywhere (returns defaults if outside provider)
// =============================================================================

export function useMessages(): MessageContextValue {
  const context = useContext(MessageContext)

  // Return safe defaults for use outside MessageProvider (e.g., MobileTabBar)
  if (!context) {
    return {
      conversations: [],
      currentConversation: null,
      messages: [],
      totalUnreadCount: 0,
      isLoading: false,
      isLoadingMessages: false,
      error: null,
      currentUserId: null,
      isOtherUserTyping: false,
      loadConversations: async () => {},
      selectConversation: async () => {},
      sendMessage: async () => {},
      markAsRead: async () => {},
      startConversation: async () => "",
      closeConversation: async () => {},
      refreshUnreadCount: async () => {},
      sendTypingIndicator: () => {},
    }
  }

  return context
}

// =============================================================================
// PROVIDER - Clean, simple implementation with proper realtime
// =============================================================================

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  
  // Core state
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [totalUnreadCount, setTotalUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)
  
  // Refs to avoid stale closures and prevent subscription loops
  const channelRef = useRef<RealtimeChannel | null>(null)
  const currentConversationIdRef = useRef<string | null>(null)
  const conversationIdsRef = useRef<string[]>([])
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTypingSentRef = useRef<number>(0)

  // Keep refs in sync
  useEffect(() => {
    currentConversationIdRef.current = currentConversation?.id || null
  }, [currentConversation])

  useEffect(() => {
    conversationIdsRef.current = conversations.map(c => c.id)
  }, [conversations])

  // =============================================================================
  // FETCH USER ID ON MOUNT
  // =============================================================================
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      }
    }
    getUser()
  }, [supabase])

  // =============================================================================
  // REFRESH UNREAD COUNT
  // =============================================================================
  
  const refreshUnreadCount = useCallback(async () => {
    if (!currentUserId) return
    
    try {
      const { data, error: rpcError } = await supabase.rpc("get_total_unread_messages")
      if (!rpcError && data !== null) {
        setTotalUnreadCount(data)
      }
    } catch (err) {
      console.error("Error fetching unread count:", err)
    }
  }, [supabase, currentUserId])

  // =============================================================================
  // LOAD CONVERSATIONS - Direct query with proper joins
  // =============================================================================
  
  const loadConversations = useCallback(async () => {
    if (!currentUserId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch conversations
      const { data: convs, error: convError } = await supabase
        .from("conversations")
        .select(`
          *,
          product:products(id, title, images)
        `)
        .or(`buyer_id.eq.${currentUserId},seller_id.eq.${currentUserId}`)
        .order("last_message_at", { ascending: false, nullsFirst: false })

      if (convError) throw convError

      if (!convs || convs.length === 0) {
        setConversations([])
        setTotalUnreadCount(0)
        return
      }

      // Fetch all unique user IDs for profile lookups
      const userIds = new Set<string>()
      convs.forEach((conv) => {
        userIds.add(conv.buyer_id)
        userIds.add(conv.seller_id)
      })

      // Fetch profiles for all users in one query
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, display_name, business_name, username")
        .in("id", Array.from(userIds))

      // Create profile lookup map
      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || [])

      // Transform and add profile data
      const transformedConvs: Conversation[] = convs.map((conv) => {
        const buyerProfile = profileMap.get(conv.buyer_id)
        const sellerProfile = profileMap.get(conv.seller_id)
        
        return {
          ...conv,
          status: (conv.status || "open") as "open" | "closed" | "archived",
          buyer_unread_count: conv.buyer_unread_count || 0,
          seller_unread_count: conv.seller_unread_count || 0,
          buyer_profile: buyerProfile ? {
            id: buyerProfile.id,
            full_name: buyerProfile.full_name,
            avatar_url: buyerProfile.avatar_url,
            display_name: buyerProfile.display_name,
            username: buyerProfile.username,
          } : null,
          seller_profile: sellerProfile ? {
            id: sellerProfile.id,
            full_name: sellerProfile.full_name,
            avatar_url: sellerProfile.avatar_url,
            display_name: sellerProfile.display_name,
            business_name: sellerProfile.business_name,
            username: sellerProfile.username,
          } : null,
          product: conv.product ? {
            id: conv.product.id,
            title: conv.product.title,
            images: conv.product.images || [],
          } : null,
          // Legacy compatibility mappings
          buyer: buyerProfile ? {
            id: buyerProfile.id,
            full_name: buyerProfile.display_name || buyerProfile.full_name,
            avatar_url: buyerProfile.avatar_url,
          } : { id: conv.buyer_id, full_name: null, avatar_url: null },
          seller: sellerProfile ? {
            id: sellerProfile.id,
            business_name: sellerProfile.business_name || sellerProfile.display_name || sellerProfile.full_name,
            user_id: sellerProfile.id,
            profile: {
              full_name: sellerProfile.display_name || sellerProfile.full_name,
              avatar_url: sellerProfile.avatar_url,
            },
          } : { id: conv.seller_id, business_name: null, user_id: conv.seller_id },
        }
      })

      setConversations(transformedConvs)

      // Calculate total unread
      const unread = transformedConvs.reduce((sum, conv) => {
        if (conv.buyer_id === currentUserId) {
          return sum + (conv.buyer_unread_count || 0)
        }
        return sum + (conv.seller_unread_count || 0)
      }, 0)
      setTotalUnreadCount(unread)
      
    } catch (err) {
      console.error("Error loading conversations:", err)
      setError("Failed to load conversations")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, currentUserId])

  // =============================================================================
  // MARK AS READ
  // =============================================================================
  
  const markAsRead = useCallback(async (conversationId: string) => {
    if (!currentUserId) return
    
    try {
      await supabase.rpc("mark_messages_read", { p_conversation_id: conversationId })
      
      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversation_id === conversationId && !msg.is_read
            ? { ...msg, is_read: true, read_at: new Date().toISOString() }
            : msg
        )
      )

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== conversationId) return conv
          if (conv.buyer_id === currentUserId) {
            return { ...conv, buyer_unread_count: 0 }
          }
          return { ...conv, seller_unread_count: 0 }
        })
      )
      
      await refreshUnreadCount()
    } catch (err) {
      console.error("Error marking messages as read:", err)
    }
  }, [supabase, currentUserId, refreshUnreadCount])

  // =============================================================================
  // SELECT CONVERSATION & LOAD MESSAGES
  // =============================================================================
  
  const selectConversation = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true)
    setError(null)

    try {
      // Find in existing conversations or fetch fresh
      let conv = conversations.find((c) => c.id === conversationId)
      
      if (!conv) {
        const { data, error: fetchError } = await supabase
          .from("conversations")
          .select(`
            *,
            product:products(id, title, images)
          `)
          .eq("id", conversationId)
          .single()
        
        if (fetchError) throw fetchError

        // Fetch profiles for buyer and seller
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, display_name, business_name, username")
          .in("id", [data.buyer_id, data.seller_id])

        const profileMap = new Map(profiles?.map((p) => [p.id, p]) || [])
        const buyerProfile = profileMap.get(data.buyer_id)
        const sellerProfile = profileMap.get(data.seller_id)
        
        conv = {
          ...data,
          status: (data.status || "open") as "open" | "closed" | "archived",
          buyer_unread_count: data.buyer_unread_count || 0,
          seller_unread_count: data.seller_unread_count || 0,
          buyer_profile: buyerProfile ? {
            id: buyerProfile.id,
            full_name: buyerProfile.full_name,
            avatar_url: buyerProfile.avatar_url,
            display_name: buyerProfile.display_name,
            username: buyerProfile.username,
          } : null,
          seller_profile: sellerProfile ? {
            id: sellerProfile.id,
            full_name: sellerProfile.full_name,
            avatar_url: sellerProfile.avatar_url,
            display_name: sellerProfile.display_name,
            business_name: sellerProfile.business_name,
            username: sellerProfile.username,
          } : null,
          product: data.product ? {
            id: data.product.id,
            title: data.product.title,
            images: data.product.images || [],
          } : null,
          buyer: buyerProfile ? {
            id: buyerProfile.id,
            full_name: buyerProfile.display_name || buyerProfile.full_name,
            avatar_url: buyerProfile.avatar_url,
          } : { id: data.buyer_id, full_name: null, avatar_url: null },
          seller: sellerProfile ? {
            id: sellerProfile.id,
            business_name: sellerProfile.business_name || sellerProfile.display_name || sellerProfile.full_name,
            user_id: sellerProfile.id,
            profile: {
              full_name: sellerProfile.display_name || sellerProfile.full_name,
              avatar_url: sellerProfile.avatar_url,
            },
          } : { id: data.seller_id, business_name: null, user_id: data.seller_id },
        } as Conversation
      }

      setCurrentConversation(conv)

      // Load messages
      const { data: msgs, error: msgError } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_id, content, message_type, is_read, read_at, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (msgError) throw msgError

      // Fetch sender profiles
      const senderIds = [...new Set((msgs || []).map((m) => m.sender_id))]
      const { data: senderProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", senderIds)

      const senderMap = new Map(senderProfiles?.map((p) => [p.id, p]) || [])

      setMessages((msgs || []).map((msg) => ({
        ...msg,
        message_type: (msg.message_type || "text") as "text" | "image" | "system",
        sender: senderMap.get(msg.sender_id) || undefined,
      })) as Message[])

      // Mark as read
      await markAsRead(conversationId)
      
    } catch (err) {
      console.error("Error loading messages:", err)
      setError("Failed to load messages")
    } finally {
      setIsLoadingMessages(false)
    }
  }, [supabase, conversations, markAsRead])

  // =============================================================================
  // SEND MESSAGE
  // =============================================================================
  
  const sendMessage = useCallback(async (content: string, _attachmentUrl?: string) => {
    if (!currentConversation || !currentUserId || !content.trim()) return

    try {
      const { data: newMsg, error: sendError } = await supabase
        .from("messages")
        .insert({
          conversation_id: currentConversation.id,
          sender_id: currentUserId,
          content: content.trim(),
          message_type: "text",
        })
        .select("id, conversation_id, sender_id, content, message_type, is_read, read_at, created_at")
        .single()

      if (sendError) throw sendError

      // Fetch sender profile
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", currentUserId)
        .single()

      // Add to local state immediately (optimistic update)
      setMessages((prev) => [...prev, {
        ...newMsg,
        message_type: newMsg.message_type as "text" | "image" | "system",
        sender: senderProfile || undefined,
      } as Message])
      
      // Update conversation list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversation.id
            ? {
                ...conv,
                last_message_at: new Date().toISOString(),
                last_message: {
                  content: content.trim(),
                  sender_id: currentUserId,
                  message_type: "text",
                  created_at: new Date().toISOString(),
                },
              }
            : conv
        ).sort((a, b) => 
          new Date(b.last_message_at || b.created_at).getTime() - 
          new Date(a.last_message_at || a.created_at).getTime()
        )
      )
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message")
      throw err
    }
  }, [supabase, currentConversation, currentUserId])

  // =============================================================================
  // START CONVERSATION
  // =============================================================================
  
  const startConversation = useCallback(async (
    sellerId: string,
    productId?: string,
    subject?: string
  ): Promise<string> => {
    try {
      const { data: conversationId, error: startError } = await supabase.rpc(
        "get_or_create_conversation",
        {
          p_seller_id: sellerId,
          ...(productId ? { p_product_id: productId } : {}),
          ...(subject ? { p_subject: subject } : {}),
        }
      )

      if (startError) throw startError

      // Reload conversations to include the new one
      await loadConversations()

      return conversationId as string
    } catch (err) {
      console.error("Error starting conversation:", err)
      setError("Failed to start conversation")
      throw err
    }
  }, [supabase, loadConversations])

  // =============================================================================
  // CLOSE CONVERSATION
  // =============================================================================
  
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
          conv.id === conversationId ? { ...conv, status: "closed" as const } : conv
        )
      )

      if (currentConversation?.id === conversationId) {
        setCurrentConversation((prev) =>
          prev ? { ...prev, status: "closed" as const } : null
        )
      }
    } catch (err) {
      console.error("Error closing conversation:", err)
      setError("Failed to close conversation")
    }
  }, [supabase, currentConversation])

  // =============================================================================
  // TYPING INDICATOR (simplified)
  // =============================================================================
  
  const sendTypingIndicator = useCallback(() => {
    // Throttle typing events
    const now = Date.now()
    if (now - lastTypingSentRef.current < 2000) return
    lastTypingSentRef.current = now
    // Typing indicator via broadcast could be added here if needed
  }, [])

  // =============================================================================
  // REALTIME SUBSCRIPTION - Single channel, stable dependencies
  // =============================================================================
  
  useEffect(() => {
    if (!currentUserId) return

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    // Create a single channel for all messages
    const channel = supabase
      .channel(`chat-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage = payload.new as {
            id: string
            conversation_id: string
            sender_id: string
            content: string
            message_type: string
            is_read: boolean
            created_at: string
          }

          // Skip our own messages (already added optimistically)
          if (newMessage.sender_id === currentUserId) return

          // Check if this belongs to one of our conversations using ref
          const isOurConversation = conversationIdsRef.current.includes(newMessage.conversation_id)
          
          if (!isOurConversation) {
            // New conversation - reload all
            await loadConversations()
            return
          }

          // If viewing this conversation, add the message
          if (currentConversationIdRef.current === newMessage.conversation_id) {
            // Fetch sender profile
            const { data: senderProfile } = await supabase
              .from("profiles")
              .select("id, full_name, avatar_url")
              .eq("id", newMessage.sender_id)
              .single()

            const fullMsg = {
              id: newMessage.id,
              conversation_id: newMessage.conversation_id,
              sender_id: newMessage.sender_id,
              content: newMessage.content,
              message_type: newMessage.message_type as "text" | "image" | "system",
              is_read: newMessage.is_read,
              read_at: null,
              created_at: newMessage.created_at,
              sender: senderProfile || undefined,
            }

            setMessages((prev) => {
              if (prev.some((m) => m.id === fullMsg.id)) return prev
              return [...prev, fullMsg as Message]
            })

            // Mark as read since we're viewing
            await markAsRead(newMessage.conversation_id)
          } else {
            // Not viewing - increment unread count
            setConversations((prev) =>
              prev.map((conv) => {
                if (conv.id !== newMessage.conversation_id) return conv
                const isBuyer = conv.buyer_id === currentUserId
                return {
                  ...conv,
                  last_message_at: newMessage.created_at,
                  last_message: {
                    content: newMessage.content,
                    sender_id: newMessage.sender_id,
                    message_type: newMessage.message_type,
                    created_at: newMessage.created_at,
                  },
                  ...(isBuyer
                    ? { buyer_unread_count: (conv.buyer_unread_count || 0) + 1 }
                    : { seller_unread_count: (conv.seller_unread_count || 0) + 1 }
                  ),
                }
              }).sort((a, b) =>
                new Date(b.last_message_at || b.created_at).getTime() -
                new Date(a.last_message_at || a.created_at).getTime()
              )
            )

            setTotalUnreadCount((prev) => prev + 1)
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [supabase, currentUserId, loadConversations, markAsRead])

  // =============================================================================
  // LOAD CONVERSATIONS ON MOUNT / USER CHANGE
  // =============================================================================
  
  useEffect(() => {
    if (currentUserId) {
      loadConversations()
    }
  }, [currentUserId, loadConversations])

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================
  
  const value: MessageContextValue = {
    conversations,
    currentConversation,
    messages,
    totalUnreadCount,
    isLoading,
    isLoadingMessages,
    error,
    currentUserId,
    isOtherUserTyping,
    loadConversations,
    selectConversation,
    sendMessage,
    markAsRead,
    startConversation,
    closeConversation,
    refreshUnreadCount,
    sendTypingIndicator,
  }

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  )
}
