"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { DefaultChatTransport } from "ai"
import { useChat } from "@ai-sdk/react"
import {
  CircleNotch,
  Robot,
  Sparkle,
  PaperPlaneTilt,
  Lightning,
  ShoppingBag,
  MagnifyingGlass,
  Tag,
  Package,
  ArrowLeft,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { ProductMiniCard } from "@/components/shared/product/card/mini"

type ListingCard = {
  id: string
  title: string
  price: number
  images: string[]
  slug: string | null
  storeSlug: string | null
  currency?: string
}

type ChatPart = {
  type: string
  text?: string
  state?: string
  output?: unknown
  input?: unknown
  toolCallId?: string
}

function getListingHref(locale: string, item: ListingCard): string | null {
  if (!item.slug || !item.storeSlug) return null
  return `/${locale}/${item.storeSlug}/${item.slug}`
}

function extractListings(parts: ChatPart[]): ListingCard[] {
  const listings: ListingCard[] = []
  for (const part of parts) {
    // AI SDK v6: tool parts are typed as `tool-{toolName}` with state
    if (
      part.type === "tool-searchListings" && 
      part.state === "output-available" &&
      Array.isArray(part.output)
    ) {
      listings.push(...(part.output as ListingCard[]))
    }
  }
  return listings
}

type AssistantCopy = {
  title: string
  assistantIntro: string
  chatEmpty: string
  chatPlaceholder: string
  quickStart: string
  suggestionOne: string
  suggestionTwo: string
  suggestionThree: string
  send: string
  stop: string
  results: string
  loading: string
}

/** Assistant Avatar - consistent across the app */
function AssistantAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "size-7",
    md: "size-8",
    lg: "size-10",
  }
  return (
    <Avatar className={cn(sizeClasses[size], "shrink-0")}>
      <AvatarFallback className="bg-primary text-primary-foreground">
        <Robot size={size === "lg" ? 20 : size === "md" ? 16 : 14} weight="fill" />
      </AvatarFallback>
    </Avatar>
  )
}

/** User Avatar for chat */
function UserChatAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "size-7",
    md: "size-8",
    lg: "size-10",
  }
  return (
    <Avatar className={cn(sizeClasses[size], "shrink-0")}>
      <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
        You
      </AvatarFallback>
    </Avatar>
  )
}

/** Chat Message Bubble - clean shadcn styling */
function MessageBubble({
  isUser,
  children,
}: {
  isUser: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "max-w-xs rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-sm md:max-w-md",
        isUser
          ? "bg-primary text-primary-foreground rounded-br-md"
          : "bg-muted text-foreground rounded-bl-md"
      )}
    >
      {children}
    </div>
  )
}

/** Suggestion Chip - using Card styling */
function SuggestionChip({
  children,
  icon: Icon,
  onClick,
}: {
  children: React.ReactNode
  icon: React.ComponentType<{ size?: number; weight?: "fill" | "bold" | "regular"; className?: string }>
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-3 text-left text-sm text-foreground transition-colors hover:border-hover-border hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Icon
        size={16}
        weight="bold"
        className="shrink-0 text-primary"
      />
      <span className="line-clamp-1">{children}</span>
    </button>
  )
}

/** Empty State / Welcome Screen */
function WelcomeScreen({
  copy,
  onSuggestionClick,
}: {
  copy: AssistantCopy
  onSuggestionClick: (text: string) => void
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 text-center">
      {/* Hero Icon - Using shadcn Avatar */}
      <div className="relative mb-5">
        <Avatar className="size-16 shadow-lg md:size-20">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Robot size={32} weight="fill" className="md:hidden" />
            <Robot size={40} weight="fill" className="hidden md:block" />
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1">
          <Avatar className="size-7 ring-2 ring-background shadow-md">
            <AvatarFallback className="bg-card">
              <Sparkle size={14} weight="fill" className="text-primary" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Welcome Text */}
      <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground md:text-2xl">
        {copy.title}
      </h2>
      <p className="mb-6 max-w-xs text-sm text-muted-foreground md:max-w-sm md:text-base">
        {copy.assistantIntro}
      </p>

      {/* Feature Pills - Using Badge */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {[
          { icon: MagnifyingGlass, text: "Smart Search" },
          { icon: Lightning, text: "Instant" },
          { icon: ShoppingBag, text: "Best Deals" },
        ].map(({ icon: Icon, text }) => (
          <Badge key={text} variant="secondary" className="gap-1 px-2.5 py-1">
            <Icon size={12} weight="bold" className="text-primary" />
            {text}
          </Badge>
        ))}
      </div>

      {/* Suggestions */}
      <div className="w-full max-w-sm">
        <p className="mb-2.5 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
          {copy.quickStart}
        </p>
        <div className="flex flex-col gap-2">
          <SuggestionChip
            icon={MagnifyingGlass}
            onClick={() => onSuggestionClick(copy.suggestionOne)}
          >
            {copy.suggestionOne}
          </SuggestionChip>
          <SuggestionChip
            icon={Tag}
            onClick={() => onSuggestionClick(copy.suggestionTwo)}
          >
            {copy.suggestionTwo}
          </SuggestionChip>
          <SuggestionChip
            icon={Package}
            onClick={() => onSuggestionClick(copy.suggestionThree)}
          >
            {copy.suggestionThree}
          </SuggestionChip>
        </div>
      </div>
    </div>
  )
}

/** Typing Indicator */
function TypingIndicator({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <AssistantAvatar size="md" />
      <div className="rounded-2xl rounded-bl-md border border-border-subtle bg-surface-subtle px-4 py-3">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex gap-1">
            <span className="size-2 animate-bounce rounded-full bg-primary opacity-60 [animation-delay:-0.3s]" />
            <span className="size-2 animate-bounce rounded-full bg-primary opacity-60 [animation-delay:-0.15s]" />
            <span className="size-2 animate-bounce rounded-full bg-primary opacity-60" />
          </span>
          {text}
        </span>
      </div>
    </div>
  )
}

export function AssistantPlayground({
  locale,
  copy,
}: {
  locale: "en" | "bg"
  copy: AssistantCopy
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: "/api/assistant/chat",
      body: { locale },
    })
  }, [locale])

  const { messages, sendMessage, status, stop, error } = useChat({ transport })
  const [input, setInput] = useState("")
  const isLoading = status === "streaming" || status === "submitted"

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
  }

  async function handleSubmit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    setInput("")
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }
    await sendMessage({ text: trimmed })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 flex items-center gap-2 px-3 h-14 border-b border-border bg-background pt-safe">
        <Link
          href="/"
          aria-label={locale === "bg" ? "Назад" : "Back"}
          className="size-10 flex items-center justify-center rounded-full -ml-1 tap-transparent active:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="size-5" weight="bold" />
        </Link>
        <AssistantAvatar size="md" />
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold tracking-tight text-foreground truncate">
            {copy.title}
          </h1>
          <p className="text-2xs text-muted-foreground">
            {isLoading ? copy.loading : "Online"}
          </p>
        </div>
      </header>

      {/* Messages Area - Takes remaining space */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {messages.length === 0 ? (
          <WelcomeScreen copy={copy} onSuggestionClick={handleSubmit} />
        ) : (
          <div className="mx-auto max-w-2xl space-y-5 px-4 py-4">
            {messages.map((message) => {
              const isUser = message.role === "user"
              const parts = message.parts as ChatPart[]
              const listings = extractListings(parts)

              return (
                <div key={message.id} className="space-y-3">
                  <div
                    className={cn(
                      "flex items-start gap-2.5",
                      isUser ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {/* Avatar - Using shadcn Avatar */}
                    {isUser ? (
                      <UserChatAvatar size="md" />
                    ) : (
                      <AssistantAvatar size="md" />
                    )}

                    {/* Message Content */}
                    <div
                      className={cn(
                        "flex flex-col gap-1.5",
                        isUser ? "items-end" : "items-start"
                      )}
                    >
                      {parts.map((part, idx) => {
                        // Only render text parts
                        if (part.type === "text" && part.text) {
                          return (
                            <MessageBubble key={`${message.id}-${idx}`} isUser={isUser}>
                              {part.text}
                            </MessageBubble>
                          )
                        }
                        // Skip tool parts, reasoning, step-start, etc - they're handled separately
                        return null
                      })}
                    </div>
                  </div>

                  {/* Product Results */}
                  {listings.length > 0 && (
                    <div className="ml-10 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag size={12} className="text-primary" />
                        <p className="text-xs font-medium text-muted-foreground">
                          {copy.results} ({listings.length})
                        </p>
                      </div>
                      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
                        {listings.slice(0, 8).map((item, idx) => (
                          <ProductMiniCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            price={item.price}
                            image={item.images?.[0] ?? null}
                            href={getListingHref(locale, item)}
                            locale={locale}
                            className="w-32 shrink-0 sm:w-36"
                            {...(idx < 3
                              ? {
                                  badge: (
                                    <Badge
                                      variant="default"
                                      className="gap-0.5 px-1.5 py-0.5 text-2xs"
                                    >
                                      <Sparkle size={8} weight="fill" />
                                      Top
                                    </Badge>
                                  ),
                                }
                              : {})}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Loading State */}
            {isLoading && <TypingIndicator text={copy.loading} />}

            {/* Error State */}
            {error && (
              <Card className="border-destructive/30 bg-destructive-subtle p-3 text-sm text-destructive">
                {error.message}
              </Card>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="shrink-0 border-t border-border bg-background px-4 pb-safe">
        <form
          className="mx-auto flex max-w-2xl items-end gap-2 py-3"
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit(input)
          }}
        >
          <div className="relative flex-1">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder={copy.chatPlaceholder}
              rows={1}
              className="min-h-11 resize-none rounded-lg py-2.5 field-sizing-content"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  void handleSubmit(input)
                }
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
            className="size-11 shrink-0 rounded-full"
            aria-label={copy.send}
          >
            {isLoading ? (
              <CircleNotch size={18} className="animate-spin" />
            ) : (
              <PaperPlaneTilt size={18} weight="fill" />
            )}
          </Button>
        </form>
        {isLoading && (
          <div className="mx-auto max-w-2xl pb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void stop()}
              className="w-full text-destructive hover:bg-destructive-subtle hover:text-destructive"
            >
              {copy.stop}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
