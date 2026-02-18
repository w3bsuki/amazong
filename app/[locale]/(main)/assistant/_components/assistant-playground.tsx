"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { DefaultChatTransport } from "ai"
import { useChat } from "@ai-sdk/react"
import { ArrowLeft, LoaderCircle as CircleNotch, Send as PaperPlaneTilt, ShoppingBag, Sparkles as Sparkle } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { ProductMiniCard } from "@/components/shared/product/card/mini"
import {
  AssistantAvatar,
  UserChatAvatar,
  MessageBubble,
  WelcomeScreen,
  TypingIndicator,
  extractListings,
  getListingHref,
  type AssistantCopy,
  type ChatPart,
} from "./assistant-playground-ui"

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    event.target.style.height = "auto"
    event.target.style.height = Math.min(event.target.scrollHeight, 120) + "px"
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
      <header className="shrink-0 flex items-center gap-2 px-3 h-14 border-b border-border bg-background pt-safe">
        <Link
          href="/"
          aria-label={locale === "bg" ? "Назад" : "Back"}
          className="size-10 flex items-center justify-center rounded-full -ml-1 tap-transparent active:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="size-5" />
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
                    {isUser ? (
                      <UserChatAvatar size="md" />
                    ) : (
                      <AssistantAvatar size="md" />
                    )}

                    <div
                      className={cn(
                        "flex flex-col gap-1.5",
                        isUser ? "items-end" : "items-start"
                      )}
                    >
                      {parts.map((part, index) => {
                        if (part.type === "text" && part.text) {
                          return (
                            <MessageBubble key={`${message.id}-${index}`} isUser={isUser}>
                              {part.text}
                            </MessageBubble>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>

                  {listings.length > 0 && (
                    <div className="ml-10 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag size={12} className="text-primary" />
                        <p className="text-xs font-medium text-muted-foreground">
                          {copy.results} ({listings.length})
                        </p>
                      </div>
                      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
                        {listings.slice(0, 8).map((item, index) => (
                          <ProductMiniCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            price={item.price}
                            image={item.images?.[0] ?? null}
                            href={getListingHref(locale, item)}
                            locale={locale}
                            className="w-32 shrink-0 sm:w-36"
                            {...(index < 3
                              ? {
                                  badge: (
                                    <Badge
                                      variant="default"
                                      className="gap-0.5 px-1.5 py-0.5 text-2xs"
                                    >
                                      <Sparkle size={8} />
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

            {isLoading && <TypingIndicator text={copy.loading} />}

            {error && (
              <Card className="border-destructive/30 bg-destructive-subtle p-3 text-sm text-destructive">
                {error.message}
              </Card>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-background px-4 pb-safe">
        <form
          className="mx-auto flex max-w-2xl items-end gap-2 py-3"
          onSubmit={(event) => {
            event.preventDefault()
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
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
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
              <PaperPlaneTilt size={18} />
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
