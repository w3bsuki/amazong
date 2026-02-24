"use server"

import { revalidateTag } from "next/cache"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth/require-auth"
import { logger } from "@/lib/logger"

export type ReportReason = 
  | "spam"
  | "harassment" 
  | "scam"
  | "inappropriate"
  | "other"

export interface ReportConversationResult {
  success: boolean
  error: string | null
}

/**
 * Report a conversation for inappropriate content
 * Creates a notification for admins to review
 */
export async function reportConversation(
  conversationId: string,
  reason: ReportReason,
  description?: string
): Promise<ReportConversationResult> {
  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "Not authenticated" }
  }
  const { user, supabase } = auth

  try {
    // Verify user is part of this conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("id, buyer_id, seller_id")
      .eq("id", conversationId)
      .single()

    if (convError || !conversation) {
      return { success: false, error: "Conversation not found" }
    }

    const userId = user.id
    if (conversation.buyer_id !== userId && conversation.seller_id !== userId) {
      return { success: false, error: "Not authorized to report this conversation" }
    }

    // Determine who is being reported (the other party)
    const reportedUserId = conversation.buyer_id === userId 
      ? conversation.seller_id 
      : conversation.buyer_id
    const reportBody = description ? `Reason: ${reason} - ${description}` : `Reason: ${reason}`

    // Create admin notification for review (service role insert; users must not be able to write notifications directly).
    let notifError: unknown = null
    try {
      const admin = createAdminClient()
      ;({ error: notifError } = await admin.from("notifications").insert({
        user_id: user.id, // Placeholder - in production, this would go to admin users
        type: "system",
        title: "Conversation Reported",
        body: reportBody,
        data: {
          type: "conversation_report",
          conversation_id: conversationId,
          reporter_id: userId,
          reported_user_id: reportedUserId,
          reason,
          description: description || null,
        },
        conversation_id: conversationId,
      }))
    } catch (err) {
      notifError = err
    }

    if (notifError) {
      logger.error("[chat:report-conversation] failed_to_create_notification", notifError, {
        conversationId,
        userId,
        reason,
      })
      return { success: false, error: "Failed to submit report" }
    }

    revalidateTag("conversations", "max")
    
    return { success: true, error: null }
  } catch (err) {
    logger.error("[chat:report-conversation] unexpected_error", err, {
      conversationId,
      reason,
    })
    return { success: false, error: "An unexpected error occurred" }
  }
}
