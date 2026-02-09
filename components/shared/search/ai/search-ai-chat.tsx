"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { PaperPlaneRight, Robot, CircleNotch, ArrowRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { ProductMiniCard } from "@/components/shared/product/card/mini"

interface SearchAiChatProps {
  className?: string
  onClose?: () => void
  /** Compact mode for desktop popover */
  compact?: boolean
}

interface ListingCard {
  id: string
  title: string
  price: number
  currency?: string
  image?: string
  slug?: string
  storeSlug?: string
}

/** Assistant Avatar - consistent across the app */
function AssistantAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  const sizeClasses = {
    sm: "size-7",
    md: "size-8",
  }
  return (
    <Avatar className={cn(sizeClasses[size], "shrink-0")}>
      <AvatarFallback className="bg-primary text-primary-foreground">
        <Robot size={size === "md" ? 16 : 14} weight="fill" />
      </AvatarFallback>
    </Avatar>
  )
}

/** User Avatar for chat */
function UserChatAvatar({
  label,
  size = "sm",
}: {
  label: string
  size?: "sm" | "md"
}) {
  const sizeClasses = {
    sm: "size-7",
    md: "size-8",
  }
  return (
    <Avatar className={cn(sizeClasses[size], "shrink-0")}>
      <AvatarFallback className="bg-foreground text-background text-2xs font-semibold">
        {label}
      </AvatarFallback>
    </Avatar>
  )
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

  // Extract tool results (listing cards) from messages
  const extractListings = (parts: Array<{ type: string; toolName?: string; output?: unknown; state?: string }>): ListingCard[] => {
    const listings: ListingCard[] = []
    for (const part of parts) {
      // AI SDK v6: tool parts are typed as `tool-{toolName}` with state
      if (
        part.type === "tool-searchListings" && 
        part.state === "output-available" &&
        part.output && 
        Array.isArray(part.output)
      ) {
        listings.push(...(part.output as ListingCard[]))
      }
    }
    return listings
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat Messages */}
      <div className={cn(
        "flex-1 overflow-y-auto overscroll-contain",
        compact ? "max-h-80" : "min-h-0"
      )}>
        {messages.length === 0 ? (
          <div className={cn(
            "flex flex-col items-center justify-center text-center",
            compact ? "py-8 px-4" : "py-12 px-6"
          )}>
            <Avatar className="size-12 mb-4">
              <AvatarFallback className="bg-selected text-primary">
                <Robot size={24} weight="fill" />
              </AvatarFallback>
            </Avatar>
            <h3 className="text-base font-semibold text-foreground mb-1">
              {t("aiWelcome")}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("aiDescription")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {[t("aiSuggestionOne"), t("aiSuggestionTwo"), t("aiSuggestionThree")].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    clearError?.()
                    setInput(suggestion)
                    inputRef.current?.focus()
                  }}
                  className="px-3 py-1.5 text-xs bg-surface-subtle hover:bg-hover active:bg-active rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((message) => {
              const isUser = message.role === "user"
              const listings = extractListings(message.parts as Array<{ type: string; toolName?: string; output?: unknown }>)
              
              return (
                <div key={message.id} className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
                  {!isUser && <AssistantAvatar size="sm" />}
                  
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
                            href={`/search?q=${encodeURIComponent(input)}`}
                            onClick={() => onClose?.()}
                            className="shrink-0 w-28 h-28 flex flex-col items-center justify-center bg-surface-subtle rounded-lg text-muted-foreground hover:text-foreground hover:bg-hover active:bg-active"
                          >
                            <ArrowRight size={20} />
                            <span className="text-xs mt-1">{t("aiMoreResults", { count: listings.length - 4 })}</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {isUser && <UserChatAvatar size="sm" label={t("aiUserLabel")} />}
                </div>
              )
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <AssistantAvatar size="sm" />
                <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-muted">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CircleNotch size={14} className="animate-spin" />
                    {t("aiThinking")}
                  </div>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="rounded-lg border border-border bg-card p-3">
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
              <CircleNotch size={18} className="animate-spin" />
            ) : (
              <PaperPlaneRight size={18} weight="fill" />
            )}
          </Button>
        </div>
        {isLoading && (
          <button
            type="button"
            onClick={() => stop?.()}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground w-full text-center"
          >
            {t("stopGenerating")}
          </button>
        )}
      </form>
    </div>
  )
}
