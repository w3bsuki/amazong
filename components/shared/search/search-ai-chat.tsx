import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowRight, LoaderCircle as CircleNotch, Send as PaperPlaneRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { ProductMiniCard } from "@/components/shared/product/card/mini"

import { SearchAiAssistantAvatar, SearchAiUserAvatar } from "./search-ai-chat-avatars"
import { SearchAiChatEmptyState } from "./search-ai-chat-empty-state"
import { extractListings } from "./search-ai-chat-utils"

interface SearchAiChatProps {
  className?: string
  onClose?: () => void
  /** Compact mode for desktop popover */
  compact?: boolean
}

function getClosestPreviousUserMessageText(messages: unknown[], startIndex: number): string | null {
  for (let i = startIndex - 1; i >= 0; i--) {
    const msg = messages[i] as { role?: unknown; parts?: unknown } | undefined
    if (msg?.role !== "user") continue

    const parts = Array.isArray(msg.parts) ? msg.parts : []
    for (const part of parts) {
      const text = (part as { type?: unknown; text?: unknown } | undefined)?.text
      const type = (part as { type?: unknown } | undefined)?.type
      if (type === "text" && typeof text === "string" && text.trim()) {
        return text.trim()
      }
    }
  }

  return null
}

/**
 * AI Chat component for search overlay
 * Uses Vercel AI SDK useChat hook with streaming
 */
export function SearchAiChat({ className, onClose, compact = false }: SearchAiChatProps) {
  const locale = useLocale()
  const t = useTranslations("SearchOverlay")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [input, setInput] = React.useState("")

  const { messages, sendMessage, status, stop, error, clearError, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/assistant/chat",
      body: { locale },
    }),
  })

  const isLoading = (status === "streaming" || status === "submitted") && !error

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    
    clearError?.()
    sendMessage({ text: trimmed })
    setInput("")
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat Messages */}
      <div
        className={cn("flex-1 overflow-y-auto overscroll-contain", compact ? "max-h-80" : "min-h-0")}
        aria-busy={isLoading}
      >
        {messages.length === 0 ? (
          <SearchAiChatEmptyState
            compact={compact}
            title={t("aiWelcome")}
            description={t("aiDescription")}
            suggestions={[t("aiSuggestionOne"), t("aiSuggestionTwo"), t("aiSuggestionThree")]}
            onSuggestionSelect={(suggestion) => {
              clearError?.()
              setInput(suggestion)
              inputRef.current?.focus()
            }}
          />
        ) : (
          <div className="p-4 space-y-4" role="log" aria-live="polite" aria-relevant="additions text">
            {messages.map((message, messageIndex) => {
              const isUser = message.role === "user"
              const listings = extractListings(message.parts)
              const searchQuery = !isUser ? getClosestPreviousUserMessageText(messages, messageIndex) : null
              
              return (
                <div key={message.id} className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
                  {!isUser && <SearchAiAssistantAvatar size="sm" />}
                  
                  <div className={cn(
                    "flex flex-col gap-2 max-w-sm sm:max-w-md",
                    isUser ? "items-end" : "items-start"
                  )}>
                    {/* Text parts */}
                    {message.parts.map((part, i) => {
                      if (part.type === "text" && part.text) {
                        return (
                          <div
                            key={`${message.id}-${i}`}
                            className={cn(
                              "px-3 py-2 rounded-2xl text-sm",
                              isUser
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                            )}
                          >
                            {part.text}
                          </div>
                        )
                      }
                      return null
                    })}

                    {/* Product listings */}
                    {listings.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                        {listings.slice(0, 4).map((listing) => {
                          const href = listing.storeSlug
                            ? `/${listing.storeSlug}/${listing.slug || listing.id}`
                            : null

                          return (
                            <div key={listing.id} className="w-28 shrink-0">
                              <ProductMiniCard
                                id={listing.id}
                                title={listing.title}
                                price={listing.price}
                                image={listing.image ?? null}
                                href={href}
                                locale={locale}
                                onClick={() => onClose?.()}
                              />
                            </div>
                          )
                        })}
                        {listings.length > 4 && (
                          <Link
                            href={searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : "/search"}
                            onClick={() => onClose?.()}
                            className="shrink-0 w-28 h-28 rounded-lg bg-surface-subtle flex flex-col items-center justify-center text-foreground transition-colors hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                          >
                            <ArrowRight size={20} />
                            <span className="text-xs mt-1">{t("aiMoreResults", { count: listings.length - 4 })}</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {isUser && <SearchAiUserAvatar size="sm" label={t("aiUserLabel")} />}
                </div>
              )
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3" role="status" aria-live="polite">
                <SearchAiAssistantAvatar size="sm" />
                <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-muted">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CircleNotch size={14} className="animate-spin" aria-hidden="true" />
                    {t("aiThinking")}
                  </div>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="rounded-lg border border-border bg-card p-3" role="alert">
                <p className="text-sm font-medium text-foreground">{t("aiErrorTitle")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("aiErrorDescription")}</p>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      clearError?.()
                      void regenerate?.()
                    }}
                  >
                    {t("aiRetry")}
                  </Button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="shrink-0 p-3 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("aiPlaceholder")}
            aria-label={t("aiPlaceholder")}
            className="flex-1 h-10 rounded-full"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="shrink-0 rounded-full"
            aria-label={t("sendMessage")}
          >
            {isLoading ? (
              <CircleNotch size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <PaperPlaneRight size={18} />
            )}
          </Button>
        </div>
        {isLoading && (
          <button
            type="button"
            onClick={() => stop?.()}
            className="mt-2 w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {t("stopGenerating")}
          </button>
        )}
      </form>
    </div>
  )
}

