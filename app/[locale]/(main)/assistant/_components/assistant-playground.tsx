"use client"

import { useMemo, useState } from "react"
import { DefaultChatTransport } from "ai"
import { useChat } from "@ai-sdk/react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"

type ListingCard = {
  id: string
  title: string
  price: number
  images: string[]
  slug: string | null
  storeSlug: string | null
}

function formatPrice(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)
  } catch {
    return String(value)
  }
}

function getListingHref(locale: string, item: ListingCard): string | null {
  if (!item.slug || !item.storeSlug) return null
  return `/${locale}/${item.storeSlug}/${item.slug}`
}

export function AssistantPlayground({ locale }: { locale: "en" | "bg" }) {
  const t = useTranslations("Assistant")

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: "/api/assistant/chat",
      body: { locale },
    })
  }, [locale])

  const { messages, sendMessage, status, stop, error } = useChat({ transport })
  const [input, setInput] = useState("")

  const [findImageUrl, setFindImageUrl] = useState("")
  const [findResult, setFindResult] = useState<{
    query: string
    results: ListingCard[]
  } | null>(null)
  const [findError, setFindError] = useState<string | null>(null)
  const [findLoading, setFindLoading] = useState(false)

  const [sellImageUrl, setSellImageUrl] = useState("")
  const [sellDraft, setSellDraft] = useState<unknown | null>(null)
  const [sellError, setSellError] = useState<string | null>(null)
  const [sellLoading, setSellLoading] = useState(false)

  async function handleSend() {
    const text = input.trim()
    if (!text) return
    setInput("")
    await sendMessage({ text })
  }

  async function runFindSimilar() {
    const url = findImageUrl.trim()
    if (!url) return

    setFindLoading(true)
    setFindError(null)
    setFindResult(null)

    try {
      const res = await fetch("/api/assistant/find-similar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url, limit: 8 }),
      })

      const json = (await res.json()) as unknown
      if (!res.ok) {
        setFindError("error" in (json as any) ? String((json as any).error) : t("requestFailed"))
        return
      }

      const query = typeof (json as any).query === "string" ? (json as any).query : ""
      const results = Array.isArray((json as any).results) ? (json as any).results : []
      setFindResult({ query, results })
    } catch (e) {
      setFindError(e instanceof Error ? e.message : t("requestFailed"))
    } finally {
      setFindLoading(false)
    }
  }

  async function runSellAutofill() {
    const url = sellImageUrl.trim()
    if (!url) return

    setSellLoading(true)
    setSellError(null)
    setSellDraft(null)

    try {
      const res = await fetch("/api/assistant/sell-autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url, locale }),
      })

      const json = (await res.json()) as unknown
      if (!res.ok) {
        setSellError("error" in (json as any) ? String((json as any).error) : t("requestFailed"))
        return
      }

      setSellDraft((json as any).draft ?? null)
    } catch (e) {
      setSellError(e instanceof Error ? e.message : t("requestFailed"))
    } finally {
      setSellLoading(false)
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">{t("chatTitle")}</h2>
          {status === "streaming" ? (
            <Button variant="secondary" size="sm" onClick={() => void stop()}>
              {t("stop")}
            </Button>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("chatEmpty")}</p>
          ) : null}

          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "w-full max-w-2xl rounded-(--radius-card) border px-3 py-2 text-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground border-primary/20"
                    : "bg-muted/30 text-foreground",
                )}
              >
                {m.parts.map((part, idx) => {
                  if (part.type === "text") {
                    return (
                      <p key={idx} className="whitespace-pre-wrap">
                        {part.text}
                      </p>
                    )
                  }

                  if (part.type === "tool-searchListings") {
                    if (part.state !== "output-available") {
                      return (
                        <p key={idx} className="text-muted-foreground">
                          {t("toolRunning")}
                        </p>
                      )
                    }

                    const output = Array.isArray((part as any).output)
                      ? ((part as any).output as ListingCard[])
                      : []

                    return (
                      <div key={idx} className="mt-2 space-y-2">
                        <p className="text-xs text-muted-foreground">{t("results")}</p>
                        <div className="grid gap-2">
                          {output.map((item) => {
                            const href = getListingHref(locale, item)
                            const image = item.images?.[0] || "/placeholder.jpg"
                            const content = (
                              <div className="flex items-center gap-3 rounded-(--radius-card) border bg-background p-2">
                                <img
                                  src={image}
                                  alt=""
                                  className="h-12 w-12 shrink-0 rounded-(--radius-card) object-cover"
                                  loading="lazy"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-2 text-sm font-medium">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatPrice(item.price, locale)}
                                  </p>
                                </div>
                              </div>
                            )

                            if (!href) return <div key={item.id}>{content}</div>

                            return (
                              <Link key={item.id} href={href} className="block">
                                {content}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )
                  }

                  if (part.type.startsWith("tool-")) {
                    return null
                  }

                  return null
                })}
              </div>
            </div>
          ))}

          {error ? (
            <p className="text-sm text-destructive">{error.message}</p>
          ) : null}
        </div>

        <div className="mt-4 flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chatPlaceholder")}
            className="min-h-20"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void handleSend()
              }
            }}
          />
          <Button onClick={() => void handleSend()} disabled={status !== "ready" || !input.trim()}>
            {t("send")}
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-base font-semibold">{t("findSimilarTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("findSimilarDesc")}</p>

        <div className="mt-3 flex items-end gap-2">
          <div className="flex-1">
            <Input
              value={findImageUrl}
              onChange={(e) => setFindImageUrl(e.target.value)}
              placeholder={t("imageUrlPlaceholder")}
            />
          </div>
          <Button onClick={() => void runFindSimilar()} disabled={findLoading || !findImageUrl.trim()}>
            {findLoading ? t("loading") : t("findSimilar")}
          </Button>
        </div>

        {findError ? <p className="mt-3 text-sm text-destructive">{findError}</p> : null}

        {findResult ? (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("extractedQuery")}: <span className="text-foreground">{findResult.query}</span>
            </p>
            <div className="grid gap-2">
              {findResult.results.map((item) => {
                const href = getListingHref(locale, item)
                const image = item.images?.[0] || "/placeholder.jpg"
                const content = (
                  <div className="flex items-center gap-3 rounded-(--radius-card) border bg-background p-2">
                    <img
                      src={image}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-(--radius-card) object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.price, locale)}
                      </p>
                    </div>
                  </div>
                )

                if (!href) return <div key={item.id}>{content}</div>

                return (
                  <Link key={item.id} href={href} className="block">
                    {content}
                  </Link>
                )
              })}
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="p-4">
        <h2 className="text-base font-semibold">{t("sellAutofillTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("sellAutofillDesc")}</p>

        <div className="mt-3 flex items-end gap-2">
          <div className="flex-1">
            <Input
              value={sellImageUrl}
              onChange={(e) => setSellImageUrl(e.target.value)}
              placeholder={t("imageUrlPlaceholder")}
            />
          </div>
          <Button onClick={() => void runSellAutofill()} disabled={sellLoading || !sellImageUrl.trim()}>
            {sellLoading ? t("loading") : t("sellAutofill")}
          </Button>
        </div>

        {sellError ? <p className="mt-3 text-sm text-destructive">{sellError}</p> : null}

        {sellDraft ? (
          <pre className="mt-4 overflow-auto rounded-(--radius-card) border bg-muted/30 p-3 text-xs">
            {JSON.stringify(sellDraft, null, 2)}
          </pre>
        ) : null}
      </Card>
    </div>
  )
}

