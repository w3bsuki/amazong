"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import {
  Sparkles,
  Search,
  BookOpen,
  Code,
  PenTool,
  GlobeIcon,
  CopyIcon,
  Loader2,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input"
import { Loader } from "@/components/ai-elements/loader"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"

type CommandCategory = "learn" | "code" | "write"

const commandSuggestions: Record<CommandCategory, string[]> = {
  learn: [
    "Help me find a good used laptop under €400",
    "Find a reliable phone for a student",
    "What should I look for when buying a used car?",
    "Find a winter jacket in size M",
    "Find noise-cancelling headphones under €100",
  ],
  code: [
    "Find a mechanical keyboard with linear switches",
    "Find a monitor 27\" 1440p under €200",
    "Find a graphics card under €250",
    "Find a gaming mouse for FPS",
    "Find a router with Wi‑Fi 6",
  ],
  write: [
    "Help me choose a gift for my dad",
    "Find a camera for travel under €300",
    "Find a baby stroller in good condition",
    "Find a bike for commuting",
    "Find a coffee machine under €150",
  ],
}

const quickSuggestions = [
  "Find a laptop under €500",
  "Best phones for photography",
  "Gift ideas for tech lovers",
  "Find wireless earbuds",
]

// Extract products from tool invocations (both from parts and legacy toolInvocations)
function getProductsFromMessage(message: UIMessage): any[] {
  const items: any[] = []

  // Check parts for tool outputs
  const parts = Array.isArray(message?.parts) ? message.parts : []
  for (const part of parts) {
    const p = part as any
    
    // AI SDK v5 format: tool parts have type "tool-{toolName}"
    // and state "output-available" when result is ready
    if (
      (p?.type === "tool-searchProducts" ||
        p?.type === "tool-getNewestListings" ||
        p?.type === "tool-getPromotedListings") &&
      p?.state === "output-available"
    ) {
      const products = p?.output?.products
      if (Array.isArray(products)) items.push(...products)
    }
    
    // Alternative: check if type starts with "tool-" and has searchProducts in toolCallId or similar
    if (typeof p?.type === "string" && p.type.startsWith("tool-") && p?.state === "output-available") {
      // Check if this is a product-list tool by name in the type
      if (
        p.type === "tool-searchProducts" ||
        p.type === "tool-getNewestListings" ||
        p.type === "tool-getPromotedListings"
      ) {
        const products = p?.output?.products
        if (Array.isArray(products)) items.push(...products)
      }
    }
    
    // Legacy format: tool-invocation type
    if (
      p?.type === "tool-invocation" &&
      (p?.toolName === "searchProducts" ||
        p?.toolName === "getNewestListings" ||
        p?.toolName === "getPromotedListings") &&
      p?.state === "result"
    ) {
      const products = p?.result?.products
      if (Array.isArray(products)) items.push(...products)
    }
  }

  // Legacy: check toolInvocations array (older SDK versions)
  const toolInvocations = Array.isArray((message as any)?.toolInvocations)
    ? (message as any).toolInvocations
    : []
  for (const inv of toolInvocations) {
    if (
      (inv?.toolName === "searchProducts" ||
        inv?.toolName === "getNewestListings" ||
        inv?.toolName === "getPromotedListings") &&
      inv?.state === "result"
    ) {
      const products = inv?.result?.products
      if (Array.isArray(products)) items.push(...products)
    }
  }

  // Dedupe by id
  const seen = new Set<string>()
  return items.filter((p) => {
    const id = String(p?.id ?? "")
    if (!id) return false
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

// Check if a message has reasoning parts
function getReasoningFromMessage(
  message: UIMessage
): { text: string; isLast: boolean } | null {
  const parts = Array.isArray(message?.parts) ? message.parts : []
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (part?.type === "reasoning" && (part as any)?.text) {
      return {
        text: (part as any).text,
        isLast: i === parts.length - 1,
      }
    }
  }
  return null
}

// Strip the [mode:...] prefix from user message text for display
function stripModePrefix(text: string): string {
  return text.replace(/^\[mode:[^\]]+\]\s*/i, "")
}

export type AIAssistantInterfaceProps = {
  api?: string
  className?: string
  showClose?: boolean
  onClose?: () => void
  variant?: "catalog" | "marketplace"
  modelLabel?: string
}

export function AIAssistantInterface({
  api = "/api/ai/search",
  className,
  showClose = false,
  onClose,
  variant = "catalog",
  modelLabel,
}: AIAssistantInterfaceProps) {
  const locale = useLocale()

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api }),
  })

  const [activeCategory, setActiveCategory] =
    React.useState<CommandCategory | null>(null)
  const [searchEnabled, setSearchEnabled] = React.useState(true)
  const [input, setInput] = React.useState("")

  const isLoading = status === "submitted" || status === "streaming"
  const hasConversation = messages.length > 0

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files?.length)

    if (!(hasText || hasAttachments)) {
      return
    }

    // These toggles are UI-only. Only decorate prompts for the catalog-search endpoint.
    const shouldDecorate = api === "/api/ai/search"
    const flags: string[] = []
    if (shouldDecorate && searchEnabled) flags.push("catalog-search")

    const decorated = shouldDecorate && flags.length
      ? `[mode:${flags.join(",")}] ${message.text}`
      : message.text

    setInput("")
    setActiveCategory(null)
    sendMessage({
      text: decorated || "Sent with attachments",
      files: message.files,
    })
  }

  const startMarketplaceFlow = (flow: "buy" | "sell") => {
    setInput("")
    setActiveCategory(null)
    // Kick off the conversation with a user intent message.
    sendMessage({
      text:
        flow === "sell"
          ? "I want to sell an item. Help me create a listing."
          : "I want to buy something. Show me options and help me find the right items.",
    })
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput("")
    sendMessage({ text: suggestion })
  }

  const handlePickSuggestion = (suggestion: string) => {
    setInput(suggestion)
    setActiveCategory(null)
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-border bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600">
            <Sparkles className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {locale === "bg" ? "AI асистент" : "AI Assistant"}
              </span>
              <span className="rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                {modelLabel ?? "Gemini"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {variant === "marketplace"
                ? (locale === "bg"
                    ? "Пазарувай или продавай — ще помогна с резултати от Supabase."
                    : "Shop or sell — I’ll pull results from Supabase.")
                : (locale === "bg"
                    ? "Опиши какво търсиш — ще ползвам каталога ти."
                    : "Describe what you need — I'll search for you.")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasConversation && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMessages([])}
              disabled={isLoading}
            >
              {locale === "bg" ? "Изчисти" : "Clear"}
            </Button>
          )}
          {showClose && (
            <Button type="button" variant="ghost" size="icon" onClick={onClose}>
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex min-h-0 flex-1 flex-col">
        <Conversation className="min-h-0 flex-1 bg-muted/20">
          <ConversationContent className="w-full px-4 py-6">
            {!hasConversation ? (
              <ConversationEmptyState className="py-8">
                <div className="mx-auto w-full max-w-3xl">
                  <Message from="assistant">
                    <MessageContent>
                      <MessageResponse>
                        {variant === "marketplace"
                          ? (locale === "bg"
                              ? "Здравей! Добре дошъл/дошла в нашия маркетплейс. Искаш ли да **купуваш** или да **продаваш** днес?"
                              : "Welcome to our marketplace. Are you here to **buy** or **sell** today?")
                          : (locale === "bg"
                              ? "Здравей! 👋 Кажи ми какво търсиш (бюджет, марка, състояние) и ще ти покажа най‑подходящите резултати от каталога."
                              : "Hi! 👋 Tell me what you’re looking for (budget, brand, condition) and I’ll pull the best matches from the catalog.")}
                      </MessageResponse>
                    </MessageContent>
                  </Message>

                  <div className="mt-6 text-center">
                    <div className="text-2xl font-semibold text-foreground">
                      {variant === "marketplace"
                        ? (locale === "bg" ? "Избери режим" : "Choose a mode")
                        : (locale === "bg" ? "Готов съм да помогна" : "Ready to assist")}
                    </div>
                    <div className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                      {variant === "marketplace"
                        ? (locale === "bg"
                            ? "Купуване ще ти покаже най‑нови/промотирани обяви и идеи. Продаване ще ти помогне да създадеш обява."
                            : "Buying shows newest/promoted listings and ideas. Selling helps you create a listing.")
                        : (locale === "bg"
                            ? "Опитай една от идеите по-долу или напиши търсенето си."
                            : "Try a suggestion below or type your search.")}
                    </div>
                  </div>
                </div>

                {variant === "marketplace" ? (
                  <div className="mx-auto mt-6 grid w-full max-w-3xl grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => startMarketplaceFlow("buy")}
                      className="h-12 justify-start gap-2 rounded-xl"
                      disabled={isLoading}
                    >
                      <Search className="size-4" />
                      {locale === "bg" ? "Купувам" : "Buying"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => startMarketplaceFlow("sell")}
                      className="h-12 justify-start gap-2 rounded-xl"
                      disabled={isLoading}
                    >
                      <PenTool className="size-4" />
                      {locale === "bg" ? "Продавам" : "Selling"}
                    </Button>
                  </div>
                ) : (
                  <div className="mx-auto mt-6 grid w-full max-w-3xl grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant={activeCategory === "learn" ? "secondary" : "outline"}
                      onClick={() =>
                        setActiveCategory(activeCategory === "learn" ? null : "learn")
                      }
                      className="h-12 justify-start gap-2 rounded-xl"
                    >
                      <BookOpen className="size-4" />
                      {locale === "bg" ? "Идеи" : "Ideas"}
                    </Button>
                    <Button
                      type="button"
                      variant={activeCategory === "code" ? "secondary" : "outline"}
                      onClick={() =>
                        setActiveCategory(activeCategory === "code" ? null : "code")
                      }
                      className="h-12 justify-start gap-2 rounded-xl"
                    >
                      <Code className="size-4" />
                      {locale === "bg" ? "Техника" : "Tech"}
                    </Button>
                    <Button
                      type="button"
                      variant={activeCategory === "write" ? "secondary" : "outline"}
                      onClick={() =>
                        setActiveCategory(activeCategory === "write" ? null : "write")
                      }
                      className="h-12 justify-start gap-2 rounded-xl"
                    >
                      <PenTool className="size-4" />
                      {locale === "bg" ? "Пазаруване" : "Shopping"}
                    </Button>
                  </div>
                )}

                {variant !== "marketplace" && activeCategory && (
                  <div className="mx-auto mt-4 w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card">
                    <div className="border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground">
                      {locale === "bg" ? "Предложения" : "Suggestions"}
                    </div>
                    <div className="divide-y divide-border">
                      {commandSuggestions[activeCategory].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handlePickSuggestion(s)}
                          className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </ConversationEmptyState>
            ) : (
              <>
                <div className="mx-auto w-full max-w-3xl">
                  {messages.map((message, messageIndex) => {
                    const products = getProductsFromMessage(message)
                    const reasoning = getReasoningFromMessage(message)
                    const parts = Array.isArray(message?.parts)
                      ? message.parts
                      : []
                    const isLastMessage = messageIndex === messages.length - 1

                    return (
                      <div key={message.id} className="grid gap-2">
                      {/* Reasoning - show before content if available */}
                      {message.role === "assistant" && reasoning && (
                        <Reasoning
                          isStreaming={
                            status === "streaming" &&
                            isLastMessage &&
                            reasoning.isLast
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{reasoning.text}</ReasoningContent>
                        </Reasoning>
                      )}

                      {/* Render text parts */}
                      {parts.map((part, i) => {
                        if (part.type === "text" && part.text) {
                          const displayText = message.role === "user" 
                            ? stripModePrefix(part.text) 
                            : part.text
                          return (
                            <Message key={`${message.id}-${i}`} from={message.role}>
                              <MessageContent>
                                <MessageResponse>{displayText}</MessageResponse>
                              </MessageContent>
                              {message.role === "assistant" && isLastMessage && (
                                <MessageActions>
                                  <MessageAction
                                    onClick={() => handleCopy(part.text)}
                                    label="Copy"
                                    tooltip="Copy to clipboard"
                                  >
                                    <CopyIcon className="size-3" />
                                  </MessageAction>
                                </MessageActions>
                              )}
                            </Message>
                          )
                        }

                        // Show loading state for tool calls (in-progress states)
                        if (
                          typeof part.type === "string" &&
                          part.type.startsWith("tool-") &&
                          ["input-streaming", "input-available"].includes((part as any)?.state)
                        ) {
                          const toolType = part.type
                          const isSearchProducts = toolType === "tool-searchProducts"
                          const isGetCategories = toolType === "tool-getCategories"
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground"
                            >
                              <Loader2 className="size-3 animate-spin" />
                              {isSearchProducts
                                ? locale === "bg"
                                  ? "Търся продукти..."
                                  : "Searching products..."
                                : isGetCategories
                                  ? locale === "bg"
                                    ? "Зареждам категории..."
                                    : "Loading categories..."
                                  : `Running tool...`}
                            </div>
                          )
                        }

                        return null
                      })}

                      {/* Fallback: only when no structured parts exist.
                          Prevents rendering raw tool-call JSON / internal artifacts. */}
                      {parts.length === 0 && typeof (message as any).content === "string" && (message as any).content && (
                          <Message from={message.role}>
                            <MessageContent>
                              <MessageResponse>
                                {message.role === "user"
                                  ? stripModePrefix((message as any).content)
                                  : (message as any).content}
                              </MessageResponse>
                            </MessageContent>
                          </Message>
                        )}

                      {/* Show products from tool results */}
                      {products.length > 0 && (
                        <div className="mx-auto w-full max-w-5xl rounded-xl border border-border bg-card p-4">
                          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Search className="size-4" />
                            {locale === "bg" ? "Резултати" : "Results"} (
                            {products.length})
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {products.slice(0, 8).map((p: any, idx: number) => (
                              <ProductCard
                                key={p.id}
                                id={String(p.id)}
                                title={String(p.title ?? "")}
                                price={Number(p.price ?? 0)}
                                image={String(p?.images?.[0] ?? "")}
                                slug={p.slug ?? null}
                                storeSlug={p.storeSlug ?? null}
                                username={p.storeSlug ?? null}
                                index={idx}
                                showQuickAdd={false}
                                showWishlist={false}
                                showRating={false}
                                showPills={false}
                                variant="featured"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      </div>
                    )
                  })}

                {/* Show loading indicator when waiting for response */}
                {status === "submitted" && (
                  <div className="flex items-center gap-2 rounded-xl text-sm text-muted-foreground">
                    <Loader size={16} />
                    {locale === "bg" ? "Мисля..." : "Thinking..."}
                  </div>
                )}
                </div>
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input area */}
        <div className="shrink-0 border-t border-border bg-background">
          <div className="mx-auto w-full max-w-3xl px-4 py-4">
            {/* Quick suggestions */}
            {!hasConversation && (
              <Suggestions className="mb-4">
                {quickSuggestions.map((suggestion) => (
                  <Suggestion
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    suggestion={suggestion}
                  />
                ))}
              </Suggestions>
            )}

            <PromptInput
              onSubmit={handleSubmit}
              globalDrop
              multiple
              className="rounded-2xl"
            >
              <PromptInputHeader>
                <PromptInputAttachments>
                  {(attachment) => <PromptInputAttachment data={attachment} />}
                </PromptInputAttachments>
              </PromptInputHeader>
              <PromptInputBody>
                <PromptInputTextarea
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  placeholder={
                    locale === "bg"
                      ? "Напиши какво търсиш…"
                      : "Ask me anything…"
                  }
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                  <PromptInputButton
                    variant={searchEnabled ? "default" : "ghost"}
                    onClick={() => setSearchEnabled(!searchEnabled)}
                  >
                    <GlobeIcon className="size-4" />
                    <span>{locale === "bg" ? "Търси" : "Search"}</span>
                  </PromptInputButton>
                </PromptInputTools>
                <PromptInputSubmit
                  disabled={!input.trim() && status !== "streaming"}
                  status={status}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  )
}
