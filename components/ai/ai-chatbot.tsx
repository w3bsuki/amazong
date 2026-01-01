"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage, ChatStatus } from "ai"
import {
  Sparkles,
  Search,
  CopyIcon,
  X,
  Tag,
  Upload,
  RotateCcw,
  Square,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  Package,
  ShoppingBag,
  ExternalLink,
  Grid3X3,
  MessageCircle,
  Loader2,
} from "lucide-react"
import { ShoppingCart, Storefront } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProductCard } from "@/components/shared/product/product-card"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation"
import {
  Message as MessageComponent,
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
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input"

import { usePromptInputAttachments } from "@/hooks/use-prompt-input-attachments"
 
import { Loader } from "@/components/ai-elements/loader"
import { ListingPreviewCard } from "@/components/ai-elements/listing-preview-card"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"

type ChatMode = "initial" | "buy" | "sell"

// =============================================================================
// AI SDK Message Part Types
// The AI SDK's UIMessage.parts array contains a union of many different part types.
// TypeScript cannot narrow these at runtime without type guards. The SDK does not
// export discriminated union types for all part shapes, so we define our own
// interfaces for the parts we use and cast accordingly.
// =============================================================================

/** Product shape returned from search/listing tools */
interface AIProduct {
  id: string
  title?: string
  price?: number
  images?: string[]
  slug?: string | null
  storeSlug?: string | null
  url?: string
  image_url?: string
  image?: string
  list_price?: number | null
  rating?: number
  review_count?: number
  store_slug?: string | null
  tags?: string[]
}

/** Tool invocation part with typed output (legacy format) */
interface ToolInvocationPart {
  type: "tool-invocation"
  toolName: string
  state: "input-streaming" | "input-available" | "result"
  result?: {
    products?: AIProduct[]
    listing?: ListingPreviewData
    success?: boolean
    url?: string
    error?: string
  }
}

/** Tool-specific part format (AI SDK v5) */
interface ToolOutputPart {
  type: string // "tool-searchProducts", "tool-createListing", etc.
  state: "input-streaming" | "input-available" | "output-available"
  output?: {
    products?: AIProduct[]
    listing?: ListingPreviewData
    success?: boolean
    url?: string
    error?: string
  }
}

/** Text part with content */
interface TextPart {
  type: "text"
  text: string
}

/** Reasoning part (chain of thought) */
interface ReasoningPart {
  type: "reasoning"
  text: string
}

/** Listing preview data from previewListing tool */
interface ListingPreviewData {
  title: string
  description: string
  price: number
  categorySlug?: string
  condition: string
  images: { url: string }[]
  brand?: string
  attributes?: { name: string; value: string }[]
}

// Type guard helpers - narrow part types safely
function isTextPart(part: unknown): part is TextPart {
  return typeof part === "object" && part !== null && (part as TextPart).type === "text" && typeof (part as TextPart).text === "string"
}

function isReasoningPart(part: unknown): part is ReasoningPart {
  return typeof part === "object" && part !== null && (part as ReasoningPart).type === "reasoning" && typeof (part as ReasoningPart).text === "string"
}

function isToolPart(part: unknown): part is ToolInvocationPart | ToolOutputPart {
  if (typeof part !== "object" || part === null) return false
  const p = part as { type?: string }
  return p.type === "tool-invocation" || (typeof p.type === "string" && p.type.startsWith("tool-"))
}

/** Check if a message has legacy string content (for older SDK message formats) */
function hasStringContent(message: unknown): message is { content: string } {
  if (typeof message !== "object" || message === null) return false
  const m = message as { content?: unknown }
  return typeof m.content === "string" && m.content.length > 0
}

function getToolStatusLabel(toolName: string, locale: string) {
  switch (toolName) {
    case "searchProducts":
      return locale === "bg" ? "Търся продукти..." : "Searching products..."
    case "getCategories":
      return locale === "bg" ? "Зареждам категории..." : "Loading categories..."
    case "getNewestListings":
      return locale === "bg" ? "Зареждам най-новите обяви..." : "Loading newest listings..."
    case "getPromotedListings":
      return locale === "bg" ? "Зареждам промотирани обяви..." : "Loading promoted listings..."
    case "getProductSuggestions":
      return locale === "bg" ? "Генерирам идеи..." : "Generating ideas..."
    case "checkUserAuth":
      return locale === "bg" ? "Проверявам акаунта..." : "Checking account..."
    case "analyzeListingImages":
      return locale === "bg" ? "Анализирам снимките..." : "Analyzing images..."
    case "previewListing":
      return locale === "bg" ? "Подготвям преглед на обявата..." : "Preparing listing preview..."
    case "createListing":
      return locale === "bg" ? "Публикувам обявата..." : "Publishing listing..."
    default:
      return locale === "bg" ? "Работя..." : "Working..."
  }
}

// Extract products from tool invocations
function getProductsFromMessage(message: UIMessage): AIProduct[] {
  const items: AIProduct[] = []
  const parts = Array.isArray(message?.parts) ? message.parts : []

  for (const part of parts) {
    if (!isToolPart(part)) continue
    const p = part as ToolInvocationPart | ToolOutputPart

    // AI SDK v5 format
    if (
      (p.type === "tool-searchProducts" ||
        p.type === "tool-getNewestListings" ||
        p.type === "tool-getPromotedListings") &&
      "output" in p &&
      p.state === "output-available"
    ) {
      const products = p.output?.products
      if (Array.isArray(products)) items.push(...products)
    }

    // Legacy format
    if (
      p.type === "tool-invocation" &&
      "toolName" in p &&
      (p.toolName === "searchProducts" ||
        p.toolName === "getNewestListings" ||
        p.toolName === "getPromotedListings") &&
      "result" in p &&
      p.state === "result"
    ) {
      const products = p.result?.products
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
function getReasoningFromMessage(message: UIMessage): { text: string; isLast: boolean } | null {
  const parts = Array.isArray(message?.parts) ? message.parts : []
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (isReasoningPart(part)) {
      return {
        text: part.text,
        isLast: i === parts.length - 1,
      }
    }
  }
  return null
}

// Check for listing creation results
function getListingResultFromMessage(message: UIMessage): { success: boolean; url?: string; error?: string } | null {
  const parts = Array.isArray(message?.parts) ? message.parts : []

  for (const part of parts) {
    if (!isToolPart(part)) continue
    const p = part as ToolInvocationPart | ToolOutputPart

    if (p.type === "tool-createListing" && "output" in p && p.state === "output-available") {
      const output = p.output
      if (output && typeof output.success === "boolean") {
        return {
          success: output.success,
          ...(output.url ? { url: output.url } : {}),
          ...(output.error ? { error: output.error } : {})
        }
      }
    }

    if (p.type === "tool-invocation" && "toolName" in p && p.toolName === "createListing" && "result" in p && p.state === "result") {
      const result = p.result
      if (result && typeof result.success === "boolean") {
        return {
          success: result.success,
          ...(result.url ? { url: result.url } : {}),
          ...(result.error ? { error: result.error } : {})
        }
      }
    }
  }

  return null
}

// Check for listing preview results
function getListingPreviewFromMessage(message: UIMessage): ListingPreviewData | null {
  const parts = Array.isArray(message?.parts) ? message.parts : []

  for (const part of parts) {
    if (!isToolPart(part)) continue
    const p = part as ToolInvocationPart | ToolOutputPart

    if (p.type === "tool-previewListing" && "output" in p && p.state === "output-available") {
      return p.output?.listing ?? null
    }

    if (p.type === "tool-invocation" && "toolName" in p && p.toolName === "previewListing" && "result" in p && p.state === "result") {
      return p.result?.listing ?? null
    }
  }

  return null
}
function ChatSubmitButton({ 
  input, 
  status, 
  isStreaming, 
  hasError 
}: { 
  input: string
  status: ChatStatus
  isStreaming: boolean
  hasError: boolean 
}) {
  const { files } = usePromptInputAttachments()
  const hasFiles = files.length > 0
  const hasText = input.trim().length > 0
  
  const isDisabled = (!isStreaming && !hasText && !hasFiles) || hasError

  return (
    <PromptInputSubmit
      disabled={isDisabled}
      status={status}
    />
  )
}


export type AIChatbotProps = {
  className?: string
  showClose?: boolean
  onClose?: () => void
  initialMode?: "buy" | "sell"
  autoSendGreeting?: boolean
  /** Hide the internal header chrome (used for embedded contexts like /sell). */
  hideHeader?: boolean
}

export function AIChatbot({
  className,
  showClose = false,
  onClose,
  initialMode,
  autoSendGreeting = true,
  hideHeader = false,
}: AIChatbotProps) {
  const locale = useLocale()
  const [mode, setMode] = React.useState<ChatMode>("initial")
  const [input, setInput] = React.useState("")
  const [mobileTab, setMobileTab] = React.useState<"chat" | "results">("chat")

  React.useEffect(() => {
    if (!initialMode) return
    setMode((current) => (current === "initial" ? initialMode : current))
  }, [initialMode])

  const { messages, sendMessage, status, setMessages, error, stop, regenerate, clearError } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
    experimental_throttle: 50, // Reduce re-renders during streaming
    onError: (err) => {
      console.error("Chat error:", err)
    },
    onFinish: ({ message: _message, isAbort }) => {
      if (!isAbort) {
        // Could add analytics or persistence here
      }
    },
  })

  const safeSendMessage = React.useCallback(
    async (...args: Parameters<typeof sendMessage>) => {
      try {
        await sendMessage(...args)
      } catch (err) {
        // Avoid unhandled promise rejections which can trigger the Next.js redbox.
        console.error("sendMessage failed:", err)
      }
    },
    [sendMessage],
  )

  const isSubmitted = status === "submitted"
  const isStreaming = status === "streaming"
  const isLoading = isSubmitted || isStreaming
  const isReady = status === "ready"
  const hasError = status === "error" || error != null
  const hasConversation = messages.length > 0
  const canRegenerate = hasConversation && isReady && messages[messages.length - 1]?.role === "assistant"

  // Collect ALL products from entire conversation for the results panel
  const allProducts = React.useMemo(() => {
    const items: AIProduct[] = []
    const seen = new Set<string>()
    for (const message of messages) {
      const products = getProductsFromMessage(message as UIMessage)
      for (const p of products) {
        const id = String(p?.id ?? "")
        if (id && !seen.has(id)) {
          seen.add(id)
          items.push(p)
        }
      }
    }
    return items
  }, [messages])

  // Get listing result from latest message
  const latestListingResult = React.useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const result = getListingResultFromMessage(messages[i] as UIMessage)
      if (result) return result
    }
    return null
  }, [messages])

  const hasResults = allProducts.length > 0 || latestListingResult?.success

  // Handle mode selection
  const handleSelectMode = (selectedMode: "buy" | "sell") => {
    setMode(selectedMode)
    if (autoSendGreeting) {
      const greeting =
        selectedMode === "buy"
          ? locale === "bg"
            ? "Искам да купя нещо"
            : "I want to buy something"
          : locale === "bg"
            ? "Искам да продам нещо"
            : "I want to sell something"

      void safeSendMessage({ text: greeting })
    }
  }

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files?.length)

    if (!(hasText || hasAttachments)) {
      return
    }

    // If in sell mode and user uploads images, we need to upload them first
    let uploadedImages: { url: string; thumbnailUrl?: string }[] = []
    
    if (mode === "sell" && message.files && message.files.length > 0) {
      for (const file of message.files) {
        if (file.mediaType?.startsWith("image/") && file.url) {
          try {
            // Fetch the blob from the object URL
            const response = await fetch(file.url)
            const blob = await response.blob()
            
            // Upload to our server
            const formData = new FormData()
            formData.append("file", blob, file.filename || "image.jpg")
            
            const uploadResponse = await fetch("/api/upload-chat-image", {
              method: "POST",
              body: formData,
            })
            
            if (uploadResponse.ok) {
              const data = await uploadResponse.json()
              uploadedImages.push({ url: data.url })
            }
          } catch (err) {
            console.error("Failed to upload image:", err)
          }
        }
      }
    }

    // Include uploaded image URLs in the message for the AI to use
    let textContent = message.text || ""
    if (uploadedImages.length > 0) {
      const imageInfo = uploadedImages.map((img) => img.url).join(", ")
      textContent = textContent
        ? `${textContent}\n\n[Uploaded images: ${imageInfo}]`
        : `[Uploaded images: ${imageInfo}]`
    }

    setInput("")
    await safeSendMessage({
      text: textContent || "Sent with attachments",
      files: message.files,
    }, {
      body: { mode, uploadedImages },
    })
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput("")
    void safeSendMessage({ text: suggestion }, { body: { mode } })
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const handleClear = () => {
    if (isStreaming) {
      stop()
    }
    clearError()
    setMessages([])
    setMode("initial")
  }

  const handleStop = () => {
    stop()
  }

  const handleRegenerate = () => {
    if (canRegenerate) {
      regenerate()
    }
  }

  const handleRetry = () => {
    clearError()
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === "user")
      if (lastUserMessage) {
        // Remove the failed assistant message and retry
        const lastUserIndex = messages.findIndex(m => m.id === lastUserMessage.id)
        setMessages(messages.slice(0, lastUserIndex + 1))
        regenerate()
      }
    }
  }

  const errorMessage = typeof error?.message === "string" ? error.message : ""
  const isQuotaError = /quota|429|rate limit|too many requests/i.test(errorMessage)
  const isNoProviderError = /No AI provider configured/i.test(errorMessage)

  // Greeting message for initial state
  const greetingTitle = locale === "bg"
    ? "Здравейте! 👋"
    : "Hello! 👋"

  const greetingSubtitle = locale === "bg"
    ? "Добре дошли в нашия пазар. Искате ли да купите или да продадете нещо днес?"
    : "Welcome to our marketplace. Are you looking to buy or sell today?"

  const buyLabel = locale === "bg" ? "Искам да купя" : "I want to buy"
  const sellLabel = locale === "bg" ? "Искам да продам" : "I want to sell"

  // Quick suggestions based on mode
  const buySuggestions = locale === "bg"
    ? [
        "Покажи най-новите обяви",
        "Покажи промотирани обяви",
        "Идеи за подарък за рожден ден",
        "Намери лаптоп под 500 лв",
      ]
    : [
        "Show me the newest listings",
        "Show me promoted listings",
        "Birthday gift ideas",
        "Find a laptop under €500",
      ]

  const sellSuggestions = locale === "bg"
    ? ["Имам стар телефон за продажба", "Искам да продам лаптоп", "Имам дрехи за продажба"]
    : ["I have an old phone to sell", "I want to sell a laptop", "I have clothes to sell"]

  const currentSuggestions = mode === "buy" ? buySuggestions : mode === "sell" ? sellSuggestions : []

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      {/* Header - Mobile optimized with safe area */}
      {!hideHeader && (
        <div className="flex items-center justify-between gap-2 border-b border-border bg-background px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:size-9">
              <Sparkles className="size-3.5 sm:size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {locale === "bg" ? "AI Асистент" : "AI Assistant"}
                </span>
                <span className="hidden rounded-full bg-muted px-1.5 py-0.5 text-2xs font-medium text-muted-foreground sm:inline-flex">
                  AI
                </span>
                {mode !== "initial" && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-2xs font-medium sm:px-2",
                      mode === "sell" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {mode === "buy"
                      ? (locale === "bg" ? "Купуване" : "Buying")
                      : (locale === "bg" ? "Продаване" : "Selling")}
                  </span>
                )}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {mode === "initial" && (locale === "bg" ? "Изберете какво искате" : "Choose what you'd like to do")}
                {mode === "buy" && (locale === "bg" ? "Търся продукти" : "Searching products")}
                {mode === "sell" && (locale === "bg" ? "Създаване на обява" : "Creating a listing")}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Stop button - visible during streaming */}
            {isStreaming && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleStop}
                className="h-8 gap-1.5 px-2.5 text-xs sm:h-9 sm:px-3"
              >
                <Square className="size-3 fill-current" />
                <span className="hidden sm:inline">{locale === "bg" ? "Спри" : "Stop"}</span>
              </Button>
            )}
            
            {/* Regenerate button - visible when can regenerate */}
            {canRegenerate && !isLoading && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRegenerate}
                className="size-8 sm:size-9"
                title={locale === "bg" ? "Генерирай отново" : "Regenerate"}
              >
                <RotateCcw className="size-4" />
              </Button>
            )}
            
            {/* New conversation button */}
            {hasConversation && !isStreaming && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 px-2.5 text-xs sm:h-9 sm:px-3"
              >
                <MessageSquare className="mr-1.5 size-3.5" />
                <span className="hidden xs:inline">{locale === "bg" ? "Ново" : "New"}</span>
              </Button>
            )}
            
            {showClose && (
              <Button type="button" variant="ghost" size="icon" onClick={onClose} className="size-8 sm:size-9">
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main content area - Two column on desktop, tabs on mobile */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Mobile Tab Bar - Only visible on mobile when we have results */}
        {mode !== "initial" && hasResults && (
          <div className="flex border-b border-border/50 bg-muted/20 p-1 md:hidden">
            <button
              type="button"
              onClick={() => setMobileTab("chat")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors duration-200",
                mobileTab === "chat"
                  ? "bg-background text-foreground border border-border"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <MessageCircle className="size-4" />
              {locale === "bg" ? "Чат" : "Chat"}
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("results")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors duration-200",
                mobileTab === "results"
                  ? "bg-background text-foreground border border-border"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <Grid3X3 className="size-4" />
              {locale === "bg" ? "Резултати" : "Results"}
              {allProducts.length > 0 && (
                <Badge variant="default" className="ml-1 h-5 min-w-5 justify-center px-1 text-2xs font-bold">
                  {allProducts.length}
                </Badge>
              )}
            </button>
          </div>
        )}

        {/* Two-column layout container */}
        <div className="flex min-h-0 flex-1">
          {/* LEFT COLUMN: Chat (full width on mobile when chat tab active, or no results) */}
          <div
            className={cn(
              "flex min-h-0 flex-col",
              // Mobile: full width, hidden when results tab active
              hasResults ? (mobileTab === "chat" ? "flex-1" : "hidden") : "flex-1",
              // Desktop: 45% width when we have results, full when no results
              hasResults ? "md:flex md:w-[45%] md:border-r md:border-border" : "md:flex-1"
            )}
          >
            <Conversation className="min-h-0 flex-1">
              <ConversationContent className="mx-auto w-full max-w-2xl px-4">
            {/* Initial State - Mode Selection */}
            {!hasConversation && mode === "initial" && (
              <ConversationEmptyState className="py-12">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="size-10 text-primary" />
                  </div>
                  <div className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                    {greetingTitle}
                  </div>
                  <div className="mx-auto mt-3 max-w-md text-base text-muted-foreground/80">
                    {greetingSubtitle}
                  </div>

                  {/* Buy/Sell Selection Buttons - Modernized with glassmorphism and refined interactions */}
                  <div className="mx-auto mt-10 grid w-full max-w-md grid-cols-1 gap-4 px-4 sm:mt-12 sm:max-w-2xl sm:grid-cols-2 sm:gap-4 sm:px-0">
                    <button
                      type="button"
                      onClick={() => handleSelectMode("buy")}
                      className={cn(
                        "group relative flex items-center gap-4 rounded-md border border-border/50 bg-card p-3 transition-colors duration-200 sm:flex-col sm:gap-4 sm:p-4",
                        "hover:border-primary/30 hover:bg-muted/30",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        "active:bg-muted/40"
                      )}
                    >
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted/50 transition-colors duration-200 group-hover:bg-background sm:size-20">
                        <ShoppingCart size={28} weight="duotone" className="text-foreground sm:hidden" />
                        <ShoppingCart size={40} weight="duotone" className="hidden text-foreground sm:block" />
                      </div>
                      <div className="flex-1 text-left sm:text-center">
                        <div className="text-base font-bold text-foreground sm:text-lg">{buyLabel}</div>
                        <div className="mt-1 text-xs font-medium text-muted-foreground/70 sm:mt-1.5 sm:text-sm">
                          {locale === "bg" ? "Търсете и намерете продукти" : "Search and find products"}
                        </div>
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-primary/10 group-hover:text-primary sm:hidden">
                        <ChevronDown className="size-5 -rotate-90" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectMode("sell")}
                      className={cn(
                        "group relative flex items-center gap-4 rounded-md border border-border/50 bg-card p-3 transition-colors duration-200 sm:flex-col sm:gap-4 sm:p-4",
                        "hover:border-primary/30 hover:bg-muted/30",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        "active:bg-muted/40"
                      )}
                    >
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/20 sm:size-20">
                        <Storefront size={28} weight="duotone" className="sm:hidden" />
                        <Storefront size={40} weight="duotone" className="hidden sm:block" />
                      </div>
                      <div className="flex-1 text-left sm:text-center">
                        <div className="text-base font-bold text-foreground sm:text-lg">{sellLabel}</div>
                        <div className="mt-1 text-xs font-medium text-muted-foreground/70 sm:mt-1.5 sm:text-sm">
                          {locale === "bg" ? "Създайте нова обява" : "Create a new listing"}
                        </div>
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/5 text-primary transition-colors group-hover:bg-primary/15 sm:hidden">
                        <ChevronDown className="size-5 -rotate-90" />
                      </div>
                    </button>
                  </div>
                </div>
              </ConversationEmptyState>
            )}            {/* Empty State - Buy/Sell selected but no conversation yet */}
            {!hasConversation && mode !== "initial" && (
              <ConversationEmptyState className="py-12">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
                    {mode === "buy" ? (
                      <ShoppingBag className="size-6 text-muted-foreground" />
                    ) : (
                      <Package className="size-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {mode === "buy"
                      ? locale === "bg"
                        ? "Какво търсите?"
                        : "What are you looking for?"
                      : locale === "bg"
                        ? "Какво продавате?"
                        : "What are you selling?"}
                  </div>
                  <div className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    {mode === "buy"
                      ? locale === "bg"
                        ? "Опишете продукта (марка, модел, бюджет, състояние) и ще намеря подходящи резултати."
                        : "Describe the item (brand, model, budget, condition) and I’ll find relevant results."
                      : locale === "bg"
                        ? "Опишете артикула и добавете снимки/детайли, за да ви помогна с обявата."
                        : "Describe the item and add photos/details so I can help with your listing."}
                  </div>
                </div>
              </ConversationEmptyState>
            )}

            {/* Conversation Messages */}
            {hasConversation && (
              <>
                {messages.map((message, messageIndex) => {
                  const products = getProductsFromMessage(message as UIMessage)
                  const reasoning = getReasoningFromMessage(message as UIMessage)
                  const listingResult = getListingResultFromMessage(message as UIMessage)
                  const listingPreview = getListingPreviewFromMessage(message as UIMessage)
                  const parts = Array.isArray((message as UIMessage)?.parts)
                    ? (message as UIMessage).parts
                    : []
                  const isLastMessage = messageIndex === messages.length - 1

                  return (
                    <div key={message.id} className="grid gap-2">
                      {/* Reasoning */}
                      {message.role === "assistant" && reasoning && (
                        <Reasoning
                          isStreaming={status === "streaming" && isLastMessage && reasoning.isLast}
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{reasoning.text}</ReasoningContent>
                        </Reasoning>
                      )}

                      {/* Text parts */}
                      {parts.map((part, i) => {
                        if (isTextPart(part)) {
                          return (
                            <MessageComponent key={`${message.id}-${i}`} from={message.role}>
                              <MessageContent>
                                <MessageResponse>{part.text}</MessageResponse>
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
                            </MessageComponent>
                          )
                        }

                        // Tool invocations: don't render raw inputs/outputs in the chat UI.
                        // We only show a compact status line while a tool is running.
                        if (isToolPart(part)) {
                          const toolPart = part as ToolInvocationPart | ToolOutputPart
                          const toolName = "toolName" in toolPart 
                            ? toolPart.toolName 
                            : (toolPart.type.startsWith("tool-") ? toolPart.type.replace("tool-", "") : "unknown")

                          const state = String("state" in toolPart ? toolPart.state : "")
                          if (["input-streaming", "input-available"].includes(state)) {
                            return (
                              <div
                                key={`${message.id}-${i}`}
                                className="flex items-center gap-2.5 rounded-md border border-border/40 bg-muted/30 px-4 py-2.5 text-xs font-medium text-muted-foreground"
                              >
                                <div className="relative flex size-4 items-center justify-center">
                                  <Loader2 className="absolute size-4 animate-spin text-primary/40" />
                                  <div className="size-1.5 rounded-full bg-primary" />
                                </div>
                                {getToolStatusLabel(toolName, locale)}
                              </div>
                            )
                          }

                          // Hide tool outputs/errors from the user-facing UI.
                          return null
                        }

                        return null
                      })}

                      {/* Fallback content: only when no structured parts exist.
                          Prevents rendering raw tool-call JSON / internal artifacts. */}
                      {parts.length === 0 && hasStringContent(message) && (
                          <MessageComponent from={message.role}>
                            <MessageContent>
                              <MessageResponse>{message.content}</MessageResponse>
                            </MessageContent>
                          </MessageComponent>
                        )}

                      {/* Products found indicator - Click to view in panel (mobile) or highlights panel (desktop) */}
                      {products.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setMobileTab("results")}
                          className="group flex w-full items-center justify-between gap-3 rounded-md border border-green-500/20 bg-green-500/5 p-4 text-left transition-colors hover:bg-green-500/10 md:cursor-default"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-md bg-green-500/20 text-green-600">
                              <Search className="size-5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-green-700 dark:text-green-400">
                                {locale === "bg" 
                                  ? `Намерени ${products.length} продукта`
                                  : `Found ${products.length} product${products.length === 1 ? "" : "s"}`
                                }
                              </div>
                              <div className="mt-0.5 text-xs font-medium text-green-600/70 dark:text-green-400/70 md:hidden">
                                {locale === "bg" ? "Натиснете за преглед" : "Tap to view results"}
                              </div>
                            </div>
                          </div>
                          <div className="flex size-8 items-center justify-center rounded-full bg-green-500/10 text-green-600 md:hidden">
                            <ChevronDown className="size-5 -rotate-90" />
                          </div>
                        </button>
                      )}

                      {/* Listing Preview Card - Interactive preview before publishing */}
                      {listingPreview && (
                        <ListingPreviewCard
                          listing={listingPreview}
                          locale={locale}
                          onEdit={() => {
                            // Ask AI to modify the listing
                            void safeSendMessage({ 
                              text: locale === "bg" 
                                ? "Искам да редактирам обявата" 
                                : "I want to edit the listing" 
                            }, { body: { mode } })
                          }}
                          onPublish={() => {
                            // Tell AI to create the listing with confirmed details
                            void safeSendMessage({ 
                              text: locale === "bg" 
                                ? "Публикувай обявата" 
                                : "Publish the listing" 
                            }, { body: { mode } })
                          }}
                          className="max-w-md"
                        />
                      )}

                      {/* Listing created success indicator */}
                      {listingResult?.success && listingResult.url && (
                        <button
                          type="button"
                          onClick={() => setMobileTab("results")}
                          className="flex w-full items-center justify-between gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-left transition-colors hover:bg-green-500/20 md:cursor-default"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-full bg-green-500/20">
                              <Tag className="size-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-green-700 dark:text-green-400">
                                {locale === "bg" ? "Обявата е създадена!" : "Listing created!"}
                              </div>
                              <div className="text-xs text-green-600/80 dark:text-green-400/80 md:hidden">
                                {locale === "bg" ? "Натиснете за преглед" : "Tap to view"}
                              </div>
                            </div>
                          </div>
                          <ChevronDown className="size-5 -rotate-90 text-green-600 md:hidden" />
                        </button>
                      )}
                    </div>
                  )
                })}

                {/* Loading indicator */}
                {status === "submitted" && (
                  <div className="flex items-center gap-2 rounded-md text-sm text-muted-foreground">
                    <Loader size={16} />
                    {locale === "bg" ? "Мисля..." : "Thinking..."}
                  </div>
                )}

                {/* Error message with retry */}
                {error && (
                  <div className="w-full max-w-5xl rounded-md border border-red-500/30 bg-red-500/10 p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400">
                          <AlertCircle className="size-4 shrink-0" />
                          {locale === "bg" ? "Грешка" : "Error"}
                        </div>
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {isNoProviderError
                            ? locale === "bg"
                              ? "Няма конфигуриран AI доставчик. Задайте AI_GATEWAY_API_KEY (препоръчано) или ключ за OpenAI/Google/Groq."
                              : "No AI provider configured. Set AI_GATEWAY_API_KEY (recommended) or a key for OpenAI/Google/Groq."
                            : isQuotaError
                              ? locale === "bg"
                                ? "AI квотата е изчерпана / има ограничение. Моля, опитайте отново по-късно."
                                : "AI service quota exceeded / rate limited. Please try again later."
                              : locale === "bg" ? "Нещо се обърка" : "Something went wrong"}
                        </p>

                        {process.env.NODE_ENV !== "production" && errorMessage && !isQuotaError && (
                          <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
                            {errorMessage}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRetry}
                        className="shrink-0 gap-1.5 border-red-500/30 text-red-700 hover:bg-red-500/10 dark:text-red-400"
                      >
                        <RotateCcw className="size-3.5" />
                        {locale === "bg" ? "Опитай" : "Retry"}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
          </div>

          {/* RIGHT COLUMN: Results Panel (hidden on mobile unless results tab active) */}
          {hasResults && (
            <div
              className={cn(
                "flex flex-col border-l border-border/50 bg-muted/5",
                mobileTab === "results" ? "flex" : "hidden md:flex",
                "w-full md:w-[350px] lg:w-[400px]"
              )}
            >
              <div className="flex items-center justify-between border-b border-border/50 bg-background px-4 py-3">
                <h3 className="flex items-center gap-2 text-sm font-bold tracking-tight">
                  <Grid3X3 className="size-4 text-primary" />
                  {locale === "bg" ? "Намерени продукти" : "Products Found"}
                </h3>
                <Badge variant="secondary" className="h-5 rounded-full px-2 text-2xs font-bold">
                  {allProducts.length}
                </Badge>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4">
                  {allProducts.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
                      {allProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          id={String(product.id)}
                          title={String(product.title ?? "")}
                          price={Number(product.price ?? 0)}
                          image={
                            String(
                              product.image_url ||
                                product.image ||
                                product.images?.[0] ||
                                "/placeholder.svg"
                            )
                          }
                          rating={Number(product.rating ?? 0)}
                          reviews={Number(product.review_count ?? 0)}
                          originalPrice={(product.list_price ?? null) as number | null}
                          tags={Array.isArray(product.tags) ? product.tags : []}
                          slug={(product.slug ?? null) as string | null}
                          username={(product.store_slug ?? null) as string | null}
                          showWishlist={true}
                          showRating={false}
                          variant="featured"
                        />
                      ))}
                    </div>
                  )}

                  {/* Listing Success State */}
                  {latestListingResult?.success && latestListingResult.url && (
                    <div className="rounded-md border border-green-500/20 bg-green-500/5 p-3 text-center">
                      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-500/20">
                        <Tag className="size-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold tracking-tight text-green-700 dark:text-green-400">
                        {locale === "bg" ? "Обявата е създадена!" : "Listing Created!"}
                      </h3>
                      <p className="mt-2 text-sm font-medium text-green-600/80 dark:text-green-400/80">
                        {locale === "bg" 
                          ? "Вашата обява е публикувана успешно." 
                          : "Your listing has been published successfully."}
                      </p>
                      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <Button
                          asChild
                          className="h-11 gap-2 rounded-md font-bold transition-colors"
                          variant="default"
                        >
                          <a href={latestListingResult.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4" />
                            {locale === "bg" ? "Виж обявата" : "View Listing"}
                          </a>
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleClear}
                          className="h-11 rounded-md font-bold transition-colors"
                        >
                          {locale === "bg" ? "Създай нова" : "Create Another"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Empty state for results panel */}
                  {!allProducts.length && !latestListingResult?.success && (
                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                      <div className="mb-4 flex size-16 items-center justify-center rounded-md bg-muted/50 border border-border/50">
                        <Search className="size-8 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-sm font-bold text-foreground">
                        {locale === "bg" ? "Все още няма резултати" : "No results yet"}
                      </h3>
                      <p className="mt-2 max-w-[200px] text-xs font-medium leading-relaxed text-muted-foreground">
                        {mode === "buy"
                          ? locale === "bg" 
                            ? "Попитайте асистента какво търсите и резултатите ще се покажат тук"
                            : "Ask the assistant what you're looking for and results will appear here"
                          : locale === "bg"
                            ? "Опишете продукта си и прегледът ще се покаже тук"
                            : "Describe your product and the preview will appear here"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Input area - Spans full width, respects two-column layout */}
        {mode !== "initial" && (
          <div className="shrink-0 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
            <div className="mx-auto w-full max-w-3xl px-3 py-3 sm:px-4 sm:py-4">
              {/* Quick suggestions - Horizontal scroll on mobile */}
              {!hasConversation && currentSuggestions.length > 0 && (
                <div className="-mx-3 mb-3 overflow-x-auto px-3 sm:mx-0 sm:overflow-visible sm:px-0">
                  <Suggestions className="flex-nowrap sm:flex-wrap">
                    {currentSuggestions.map((suggestion) => (
                      <Suggestion
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        suggestion={suggestion}
                        className="shrink-0"
                      />
                    ))}
                  </Suggestions>
                </div>
              )}

              <PromptInput
                onSubmit={handleSubmit}
                globalDrop
                multiple
                className="rounded-md sm:rounded-md"
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
                      mode === "buy"
                        ? locale === "bg" ? "Какво търсите?" : "What are you looking for?"
                        : locale === "bg" ? "Опишете продукта си..." : "Describe your product..."
                    }
                    className="min-h-11 text-base sm:text-sm"
                    disabled={isLoading}
                  />
                </PromptInputBody>
                <PromptInputFooter>
                  <PromptInputTools>
                    {mode === "sell" && (
                      <PromptInputActionMenu>
                        <PromptInputActionMenuTrigger />
                        <PromptInputActionMenuContent>
                          <PromptInputActionAddAttachments />
                        </PromptInputActionMenuContent>
                      </PromptInputActionMenu>
                    )}
                  </PromptInputTools>
                  <ChatSubmitButton 
                    input={input} 
                    status={status} 
                    isStreaming={isStreaming} 
                    hasError={hasError} 
                  />
                </PromptInputFooter>
              </PromptInput>

              {mode === "sell" && !hasConversation && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Upload className="size-3" />
                  <span className="hidden sm:inline">
                    {locale === "bg"
                      ? "Съвет: Качете снимки с бутона + или плъзнете файлове"
                      : "Tip: Upload photos with the + button or drag & drop files"}
                  </span>
                  <span className="sm:hidden">
                    {locale === "bg"
                      ? "Натиснете + за снимки"
                      : "Tap + to add photos"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
