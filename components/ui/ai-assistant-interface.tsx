"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import {
  Sparkles,
  Search,
  BrainCircuit,
  BookOpen,
  Code,
  PenTool,
  ArrowUp,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProductCard } from "@/components/ui/product-card"

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

function messageText(message: any): string {
  const parts = Array.isArray(message?.parts) ? message.parts : []
  const text = parts
    .filter((p: any) => p?.type === "text" && typeof p?.text === "string")
    .map((p: any) => p.text)
    .join("")
  return text || message?.content || ""
}

function toolProductsFromMessage(message: any): any[] {
  const parts = Array.isArray(message?.parts) ? message.parts : []
  const productParts = parts.filter(
    (p: any) =>
      typeof p?.type === "string" &&
      p.type.startsWith("tool-") &&
      p.type.includes("searchProducts") &&
      p.state === "output-available"
  )

  const items: any[] = []
  for (const part of productParts) {
    const products = part?.output?.products
    if (Array.isArray(products)) items.push(...products)
  }

  const seen = new Set<string>()
  return items.filter((p) => {
    const id = String(p?.id ?? "")
    if (!id) return false
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

export type AIAssistantInterfaceProps = {
  api?: string
  className?: string
  showClose?: boolean
  onClose?: () => void
}

export function AIAssistantInterface({
  api = "/api/ai/search",
  className,
  showClose = false,
  onClose,
}: AIAssistantInterfaceProps) {
  const locale = useLocale()

  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({ api }),
  })

  const [activeCategory, setActiveCategory] = React.useState<CommandCategory | null>(null)
  const [searchEnabled, setSearchEnabled] = React.useState(true)
  const [deepResearchEnabled, setDeepResearchEnabled] = React.useState(false)
  const [reasonEnabled, setReasonEnabled] = React.useState(false)

  const isLoading = status === "submitted" || status === "streaming"

  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ block: "end", behavior: "smooth" })
  }, [messages.length, isLoading])

  const promptValue = React.useMemo(() => {
    // we store input in PromptInput internal state; keep this memo for future extensibility
    return ""
  }, [])

  const [input, setInput] = React.useState(promptValue)

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    // These toggles are UI-only for now. We encode them into the prompt in a lightweight way
    // without changing the backend contract.
    const flags: string[] = []
    if (searchEnabled) flags.push("catalog-search")
    if (deepResearchEnabled) flags.push("deep-research")
    if (reasonEnabled) flags.push("reason")

    const decorated = flags.length ? `[mode:${flags.join(",")}] ${text}` : text

    setInput("")
    setActiveCategory(null)
    await sendMessage({ text: decorated })
  }

  const handlePickSuggestion = (suggestion: string) => {
    setInput(suggestion)
    setActiveCategory(null)
  }

  const hasConversation = messages.length > 0

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-border bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full border border-border bg-muted">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">
              {locale === "bg" ? "AI асистент" : "AI Assistant"}
            </div>
            <div className="text-xs text-muted-foreground">
              {locale === "bg"
                ? "Опиши какво търсиш — ще ползвам каталога ти."
                : "Describe what you need — I’ll use your catalog."}
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

      <div className="flex min-h-0 flex-1 flex-col">
        <ScrollArea className="min-h-0 flex-1">
          <div className="mx-auto w-full max-w-5xl px-4 py-4">
            {!hasConversation ? (
              <div className="py-8">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">
                    {locale === "bg" ? "Готов съм да помогна" : "Ready to assist"}
                  </div>
                  <div className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    {locale === "bg"
                      ? "Опитай една от идеите по-долу или напиши търсенето си."
                      : "Try a suggestion below or type your search."}
                  </div>
                </div>

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

                {activeCategory && (
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
              </div>
            ) : (
              <div className="grid gap-4">
                {messages.map((m: any) => {
                  const products = toolProductsFromMessage(m)

                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "grid gap-2",
                        m.role === "user" ? "justify-items-end" : "justify-items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[min(720px,90%)] rounded-xl border border-border px-4 py-3 text-sm",
                          m.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/40 text-foreground"
                        )}
                      >
                        {messageText(m)}
                      </div>

                      {m.role !== "user" && products.length > 0 && (
                        <div className="w-full max-w-5xl rounded-xl border border-border bg-card p-4">
                          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Search className="size-4" />
                            {locale === "bg" ? "Резултати" : "Results"}
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
                <div ref={scrollRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border bg-background">
          <div className="mx-auto w-full max-w-5xl px-4 py-3">
            <PromptInput
              isLoading={isLoading}
              value={input}
              onValueChange={setInput}
              onSubmit={() => void handleSend()}
              className="rounded-2xl"
            >
              <PromptInputTextarea
                placeholder={
                  locale === "bg"
                    ? "Напиши какво търсиш…"
                    : "Ask me anything…"
                }
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <PromptInputActions className="gap-1">
                  <Button
                    type="button"
                    variant={searchEnabled ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSearchEnabled((v) => !v)}
                    className="gap-2 rounded-full"
                  >
                    <Search className="size-4" />
                    {locale === "bg" ? "Търси" : "Search"}
                  </Button>
                  <Button
                    type="button"
                    variant={deepResearchEnabled ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setDeepResearchEnabled((v) => !v)}
                    className="gap-2 rounded-full"
                  >
                    <Sparkles className="size-4" />
                    {locale === "bg" ? "Детайлно" : "Deep"}
                  </Button>
                  <Button
                    type="button"
                    variant={reasonEnabled ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setReasonEnabled((v) => !v)}
                    className="gap-2 rounded-full"
                  >
                    <BrainCircuit className="size-4" />
                    {locale === "bg" ? "Разсъждавай" : "Reason"}
                  </Button>
                </PromptInputActions>

                <Button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="rounded-full"
                >
                  <ArrowUp className="size-4" />
                  {locale === "bg" ? "Изпрати" : "Send"}
                </Button>
              </div>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  )
}
