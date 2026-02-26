import type { ReactNode } from "react"

import { MessageProvider } from "@/components/providers/message-context"

export function ChatProviders({ children }: { children: ReactNode }) {
  return <MessageProvider>{children}</MessageProvider>
}
