"use client"

import { MessageProvider } from "@/components/providers/message-context"
import type { ReactNode } from "react"

interface MessageProviderWrapperProps {
  children: ReactNode
  initialSellerId?: string | undefined
  initialProductId?: string | undefined
}

export function MessageProviderWrapper({
  children,
  initialSellerId,
  initialProductId,
}: MessageProviderWrapperProps) {
  return (
    <MessageProvider initialSellerId={initialSellerId} initialProductId={initialProductId}>
      {children}
    </MessageProvider>
  )
}

