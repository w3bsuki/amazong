import { useState } from "react"
import type { useTranslations } from "next-intl"

type ChatInterfaceServerActions = {
  blockUser: (
    userId: string,
    reason?: string
  ) => Promise<{ success: boolean; error: string | null }>
  reportConversation: (
    conversationId: string,
    reason: "spam" | "harassment" | "scam" | "inappropriate" | "other",
    description?: string
  ) => Promise<{ success: boolean; error: string | null }>
}

type Translator = ReturnType<typeof useTranslations>

type ConversationLike = {
  id: string
  buyer_id: string
  seller_id: string
} | null

type ToastFn = (args: {
  title: string
  description: string
  variant?: "destructive"
}) => void

export function useChatInterfaceActions({
  actions,
  currentConversation,
  currentUserId,
  closeConversation,
  sendMessage,
  fileInputRef,
  toast,
  t,
  tCommon,
}: {
  actions: ChatInterfaceServerActions
  currentConversation: ConversationLike
  currentUserId: string | null
  closeConversation: (conversationId: string) => Promise<void>
  sendMessage: (content: string, attachmentUrl?: string) => Promise<void>
  fileInputRef: React.RefObject<HTMLInputElement | null>
  toast: ToastFn
  t: Translator
  tCommon: Translator
}) {
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isBlocking, setIsBlocking] = useState(false)
  const [isReporting, setIsReporting] = useState(false)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: tCommon("error"),
        description: t("toasts.invalidImageType.description"),
        variant: "destructive",
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: tCommon("error"),
        description: t("toasts.imageTooLarge.description"),
        variant: "destructive",
      })
      return
    }

    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-chat-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const payload: unknown = await response.json()
        const uploadError =
          typeof payload === "object" && payload && "error" in payload
            ? String((payload as { error?: unknown }).error ?? "Upload failed")
            : "Upload failed"
        throw new Error(uploadError)
      }

      const payload: unknown = await response.json()
      const imageUrl =
        typeof payload === "object" && payload && "url" in payload
          ? (payload as { url?: unknown }).url
          : undefined
      if (typeof imageUrl !== "string" || imageUrl.length === 0) {
        throw new Error("Upload response missing URL")
      }

      await sendMessage("", imageUrl)
    } catch {
      toast({
        title: tCommon("error"),
        description: t("toasts.uploadImageFailed.description"),
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleBlockUser = async () => {
    if (!currentConversation) return

    const userToBlock =
      currentUserId === currentConversation.buyer_id
        ? currentConversation.seller_id
        : currentConversation.buyer_id

    setIsBlocking(true)
    try {
      const result = await actions.blockUser(userToBlock)
      if (result.success) {
        toast({
          title: t("toasts.userBlocked.title"),
          description: t("toasts.userBlocked.description"),
        })
        await closeConversation(currentConversation.id)
      } else {
        throw new Error(result.error || "Failed to block user")
      }
    } catch {
      toast({
        title: tCommon("error"),
        description: t("toasts.blockUserFailed.description"),
        variant: "destructive",
      })
    } finally {
      setIsBlocking(false)
    }
  }

  const handleReportConversation = async () => {
    if (!currentConversation) return

    setIsReporting(true)
    try {
      const result = await actions.reportConversation(currentConversation.id, "inappropriate")
      if (result.success) {
        toast({
          title: t("toasts.reportSubmitted.title"),
          description: t("toasts.reportSubmitted.description"),
        })
      } else {
        throw new Error(result.error || "Failed to report")
      }
    } catch {
      toast({
        title: tCommon("error"),
        description: t("toasts.reportConversationFailed.description"),
        variant: "destructive",
      })
    } finally {
      setIsReporting(false)
    }
  }

  return {
    isUploadingImage,
    isBlocking,
    isReporting,
    handleImageUpload,
    handleBlockUser,
    handleReportConversation,
  }
}

