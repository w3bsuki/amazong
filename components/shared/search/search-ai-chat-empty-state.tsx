import { Bot as Robot } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function SearchAiChatEmptyState({
  compact,
  title,
  description,
  suggestions,
  onSuggestionSelect,
}: {
  compact: boolean
  title: string
  description: string
  suggestions: string[]
  onSuggestionSelect: (suggestion: string) => void
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "px-4 py-8" : "px-6 py-12"
      )}
    >
      <Avatar className="mb-4 size-12">
        <AvatarFallback className="bg-selected text-primary">
          <Robot size={24} />
        </AvatarFallback>
      </Avatar>
      <h3 className="mb-1 text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestionSelect(suggestion)}
            className="rounded-full bg-surface-subtle px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-hover hover:text-foreground active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

