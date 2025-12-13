"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Chat, CircleNotch } from "@phosphor-icons/react"
import { useToast } from "@/hooks/use-toast"

interface ContactSellerButtonProps {
  sellerId: string
  productId: string
  productTitle: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
  showLabel?: boolean
}

export function ContactSellerButton({
  sellerId,
  productId,
  productTitle,
  variant = "outline",
  size = "default",
  className,
  showIcon = true,
  showLabel = true
}: ContactSellerButtonProps) {
  const t = useTranslations("Messages")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(false)

  const handleContactSeller = async () => {
    setIsLoading(true)

    try {
      // Check if user is authenticated
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        // Redirect to login with return URL
        const returnUrl = `/product/${productId}`
        router.push(`/auth/login?redirect=${encodeURIComponent(returnUrl)}&action=contact`)
        return
      }

      // Check if user is trying to contact themselves
      // sellers.id is the user_id (FK to profiles.id/auth.users.id)
      if (sellerId === userData.user.id) {
        toast({
          title: t("cannotContactSelf"),
          description: t("cannotContactSelfDescription"),
          variant: "destructive"
        })
        setIsLoading(false)
        return
      }

      // Create or get conversation using the RPC function
      const { data: conversationId, error } = await supabase.rpc(
        "get_or_create_conversation",
        {
          p_seller_id: sellerId,
          p_product_id: productId,
          p_order_id: null,
          p_subject: `Question about: ${productTitle}`
        }
      )

      if (error) throw error

      // Navigate to messages page with the conversation
      router.push(`/chat?conversation=${conversationId}`)
    } catch (err) {
      console.error("Error starting conversation:", err)
      toast({
        title: t("errorStartingConversation"),
        description: t("errorStartingConversationDescription"),
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
      onClick={handleContactSeller}
      disabled={isLoading}
    >
      {isLoading ? (
        <CircleNotch size={16} weight="regular" className="animate-spin" />
      ) : (
        <>
          {showIcon && <Chat size={16} weight="regular" />}
          {showLabel && <span className={showIcon ? "ml-2" : ""}>{t("contactSeller")}</span>}
        </>
      )}
    </Button>
  )
}
