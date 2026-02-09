"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SupportChatWidget } from "./support-chat-widget"
import { useTranslations } from "next-intl"

/**
 * Client-side wrapper to connect the "Start Chatting" button to the support chat widget
 */
export function CustomerServiceChat() {
  const t = useTranslations("CustomerService")
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        variant="cta"
        className="w-full"
        onClick={() => setIsOpen(true)}
      >
        {t("startChatting")}
      </Button>
      <SupportChatWidget 
        isOpen={isOpen} 
        onOpenChange={setIsOpen} 
        hideTrigger 
      />
    </>
  )
}
