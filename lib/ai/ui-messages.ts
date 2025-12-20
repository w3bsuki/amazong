import type { UIMessage } from "ai"

export type CompactOptions = {
  maxMessages: number
}

function stripToolParts(message: UIMessage): UIMessage {
  const parts = Array.isArray(message.parts) ? message.parts : []

  // Keep everything except tool parts. This preserves conversational context
  // while avoiding token bloat from tool outputs.
  const filteredParts = parts.filter((p: any) => {
    const type = p?.type
    if (type === "tool-invocation") return false
    if (typeof type === "string" && type.startsWith("tool-")) return false
    return true
  })

  return {
    ...message,
    parts: filteredParts as any,
  }
}

export function compactUIMessages(messages: UIMessage[], options: CompactOptions): UIMessage[] {
  const max = Math.max(1, options.maxMessages)
  const slice = messages.slice(-max)
  return slice.map(stripToolParts)
}
