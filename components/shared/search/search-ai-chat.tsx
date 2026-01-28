"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { PaperPlaneRight, Robot, CircleNotch, Package, ArrowRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { Link, useRouter } from "@/i18n/routing"
import Image from "next/image"
import { formatPrice } from "@/lib/format-price"

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
function UserChatAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  const sizeClasses = {
    sm: "size-7",
    md: "size-8",
  }
  return (
    <Avatar className={cn(sizeClasses[size], "shrink-0")}>
      <AvatarFallback className="bg-foreground text-background text-2xs font-semibold">
        You
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
  const router = useRouter()
  const t = useTranslations("SearchOverlay")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [input, setInput] = React.useState("")

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/assistant/chat",
      body: { locale },
    }),
  })

  const isLoading = status === "streaming" || status === "submitted"

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
    
    sendMessage({ text: trimmed })
    setInput("")
  }

  const handleProductClick = (product: ListingCard) => {
    if (!product.storeSlug) return
    onClose?.()
    router.push(`/${product.storeSlug}/${product.slug || product.id}`)
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
              {["Find me a phone under 500 BGN", "What laptops do you have?", "Show me sneakers"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
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
                    "max-w-(--support-chat-message-max-w) space-y-2",
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
                        {listings.slice(0, 4).map((listing) => (
                          <button
                            key={listing.id}
                            type="button"
                            onClick={() => handleProductClick(listing)}
                            className="shrink-0 w-28 text-left group"
                          >
                            <div className="w-28 h-28 bg-muted rounded-lg overflow-hidden ring-1 ring-border">
                              {listing.image ? (
                                <Image
                                  src={listing.image}
                                  alt={listing.title}
                                  width={112}
                                  height={112}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package size={24} className="text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-foreground line-clamp-2 group-hover:text-primary">
                              {listing.title}
                            </p>
                            <p className="text-xs font-semibold text-price-sale">
                              {formatPrice(listing.price, { locale })}
                            </p>
                          </button>
                        ))}
                        {listings.length > 4 && (
                          <Link
                            href={`/search?q=${encodeURIComponent(input)}`}
                            onClick={() => onClose?.()}
                            className="shrink-0 w-28 h-28 flex flex-col items-center justify-center bg-surface-subtle rounded-lg text-muted-foreground hover:text-foreground hover:bg-hover active:bg-active"
                          >
                            <ArrowRight size={20} />
                            <span className="text-xs mt-1">+{listings.length - 4} more</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {isUser && <UserChatAvatar size="sm" />}
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
