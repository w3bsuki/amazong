"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ChatCircle, CircleNotch } from "@phosphor-icons/react"
import { useToast } from "@/hooks/use-toast"

interface ContactStoreButtonProps {
  sellerId: string
  storeName: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
  showLabel?: boolean
  labelOverride?: string
}

export function ContactStoreButton({
  sellerId,
  storeName,
  variant = "outline",
  size = "default",
  className,
  showIcon = true,
  showLabel = true,
  labelOverride
}: ContactStoreButtonProps) {
  const t = useTranslations("Messages")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(false)

  const handleContactStore = async () => {
    setIsLoading(true)

    try {
      // Check if user is authenticated
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        // Redirect to login with return URL
        router.push(`/auth/login?action=contact`)
        return
      }

      // Check if user is trying to contact themselves
      if (sellerId === userData.user.id) {
        toast({
          title: t("cannotContactSelf") || "Cannot contact yourself",
          description: t("cannotContactSelfDescription") || "You cannot send messages to your own store",
          variant: "destructive"
        })
        setIsLoading(false)
        return
      }

      // Create or get conversation using the RPC function
      // For general store contact, we don't pass a product_id
      const { data: conversationId, error } = await supabase.rpc(
        "get_or_create_conversation",
        {
          p_seller_id: sellerId,
          p_product_id: null,
          p_order_id: null,
          p_subject: `General inquiry to ${storeName}`
        }
      )

      if (error) throw error

      // Navigate to messages page with the conversation
      router.push(`/account/messages?conversation=${conversationId}`)
    } catch (err) {
      console.error("Error starting conversation:", err)
      toast({
        title: t("errorStartingConversation") || "Error",
        description: t("errorStartingConversationDescription") || "Failed to start conversation",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleContactStore}
      disabled={isLoading}
    >
      {isLoading ? (
        <CircleNotch className="size-4 animate-spin" />
      ) : (
        <>
          {showIcon && <ChatCircle className={showLabel ? "size-4 mr-2" : "size-4"} />}
          {showLabel && <span>{labelOverride || t("contactSeller") || "Contact"}</span>}
        </>
      )}
    </Button>
  )
}
