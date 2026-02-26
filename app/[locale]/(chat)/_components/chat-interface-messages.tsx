import { format, isSameDay, isToday, isYesterday } from "date-fns"
import type { Locale } from "date-fns"
import { Check, CheckCheck as Checks, Heart, Package } from "lucide-react"
import type { useTranslations } from "next-intl"
import Image from "next/image"

import { Link } from "@/i18n/routing"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Message } from "@/components/providers/message-context"

type Translator = ReturnType<typeof useTranslations>

type ConversationLike = {
  seller_id: string
  status: string
  product?: {
    id: string
    title: string
    images?: string[] | null
  } | null
  seller_profile?: {
    username?: string | null
  } | null
}

type MessageEntry = { type: "separator"; date: Date } | { type: "message"; message: Message }

function formatDateSeparator(date: Date, tFreshness: Translator, locale: Locale) {
  if (isToday(date)) return tFreshness("today")
  if (isYesterday(date)) return tFreshness("yesterday")
  return format(date, "d MMM yyyy", { locale })
}

function getMessageImageUrl(message: Message): string | null {
  if (message.message_type !== "image") return null

  const candidate = (message.attachment_url || message.content || "").trim()
  if (!candidate) return null

  if (candidate.startsWith("https://") || candidate.startsWith("http://")) {
    return candidate
  }

  return null
}

function withDateSeparators(messages: Message[]): MessageEntry[] {
  const rows: MessageEntry[] = []
  let lastDate: Date | null = null

  messages.forEach((message) => {
    const msgDate = new Date(message.created_at)
    if (!lastDate || !isSameDay(lastDate, msgDate)) {
      rows.push({ type: "separator", date: msgDate })
      lastDate = msgDate
    }
    rows.push({ type: "message", message })
  })

  return rows
}

function SystemOrderBanner({
  message,
  conversation,
  productHref,
  locale,
  t,
  tFreshness,
  separatorDate,
}: {
  message: Message
  conversation: ConversationLike
  productHref: string
  locale: Locale
  t: Translator
  tFreshness: Translator
  separatorDate: Date | null
}) {
  const productImage = conversation.product?.images?.[0]
  const priceMatch = message.content.match(/Price:\s*\$?([\d,.]+)|Цена:\s*\$?([\d,.]+)/)
  const price = priceMatch ? priceMatch[1] || priceMatch[2] : null
  const quantityMatch = message.content.match(/Quantity:\s*(\d+)|Количество:\s*(\d+)/)
  const quantity = quantityMatch ? quantityMatch[1] || quantityMatch[2] : "1"

  return (
    <div className="mt-2">
      <div className="flex items-stretch gap-0 overflow-hidden rounded-lg border border-border bg-card">
        {productImage ? (
          <Link href={productHref} className="shrink-0">
            <div className="relative h-full min-h-16 w-16 bg-muted">
              <Image
                src={productImage}
                alt={conversation.product?.title || ""}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          </Link>
        ) : (
          <div className="flex w-16 shrink-0 items-center justify-center bg-muted">
            <Package size={24} className="text-muted-foreground" />
          </div>
        )}

        <div className="min-w-0 flex-1 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <Package size={12} className="shrink-0 text-primary" />
            <span className="text-xs font-medium text-primary">{t("orderLabel")}</span>
            <span className="ml-auto text-2xs text-muted-foreground">
              {format(new Date(message.created_at), "MMM d, HH:mm", { locale })}
            </span>
          </div>

          <p className="mt-0.5 truncate text-sm font-medium text-foreground">
            {conversation.product?.title}
          </p>

          <div className="mt-1 flex items-center gap-2">
            {price && <span className="text-xs font-medium text-foreground">${price}</span>}
            {quantity !== "1" && <span className="text-xs text-muted-foreground">× {quantity}</span>}
            <span className="ml-auto inline-flex items-center gap-1 text-2xs text-warning">
              <span className="size-1.5 animate-pulse rounded-full bg-warning motion-reduce:animate-none" />
              {t("orderStatusPending")}
            </span>
          </div>
        </div>
      </div>

      {separatorDate && (
        <div className="flex items-center justify-center py-3">
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {formatDateSeparator(separatorDate, tFreshness, locale)}
          </span>
        </div>
      )}
    </div>
  )
}

export function ChatMessagesPane({
  messages,
  isLoadingMessages,
  currentUserId,
  displayName,
  avatarUrl,
  currentConversation,
  productHref,
  t,
  tFreshness,
  dateLocale,
}: {
  messages: Message[]
  isLoadingMessages: boolean
  currentUserId: string | null
  displayName: string
  avatarUrl: string | null
  currentConversation: ConversationLike
  productHref: string
  t: Translator
  tFreshness: Translator
  dateLocale: Locale
}) {
  if (isLoadingMessages) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className={cn("flex items-end gap-2", index % 2 === 0 && "justify-end")}>
            {index % 2 !== 0 && <Skeleton className="size-7 shrink-0 rounded-full" />}
            <Skeleton
              className={cn("h-12 rounded-md", index % 2 === 0 ? "w-40 rounded-br-md" : "w-48 rounded-bl-md")}
            />
          </div>
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="mb-6 flex flex-col items-center gap-3">
          <UserAvatar
            name={displayName}
            avatarUrl={avatarUrl ?? null}
            className="size-24"
            fallbackClassName="bg-primary text-2xl font-bold text-primary-foreground"
          />
          <div>
            <h3 className="text-lg font-semibold text-foreground">{displayName}</h3>
            {currentConversation.product && (
              <p className="text-sm text-muted-foreground">{currentConversation.product.title}</p>
            )}
          </div>
        </div>
        <p className="max-w-xs text-sm text-muted-foreground">{t("startConversationDisclaimer")}</p>
      </div>
    )
  }

  const rows = withDateSeparators(messages)

  return (
    <div className="space-y-1">
      {rows.map((entry, index) => {
        if (entry.type === "separator") {
          const next = rows[index + 1]
          if (next?.type === "message") {
            const isNextOrderNotification =
              next.message.message_type === "system" &&
              (next.message.content.includes("New Order") ||
                next.message.content.includes("Нова поръчка"))
            if (isNextOrderNotification) {
              return null
            }
          }

          return (
            <div key={`sep-${index}`} className="flex items-center justify-center py-4">
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                {formatDateSeparator(entry.date, tFreshness, dateLocale)}
              </span>
            </div>
          )
        }

        const message = entry.message
        const isOwn = message.sender_id === currentUserId
        const isSystem = message.message_type === "system"

        const next = rows[index + 1]
        const isLastInGroup =
          !next || next.type === "separator" || next.message.sender_id !== message.sender_id
        const prev = rows[index - 1]

        if (isSystem) {
          const isOrderNotification =
            message.content.includes("New Order") || message.content.includes("Нова поръчка")
          const separatorDate = prev?.type === "separator" ? prev.date : null

          if (isOrderNotification && currentConversation.product) {
            return (
              <SystemOrderBanner
                key={message.id}
                message={message}
                conversation={currentConversation}
                productHref={productHref}
                locale={dateLocale}
                t={t}
                tFreshness={tFreshness}
                separatorDate={separatorDate}
              />
            )
          }

          return (
            <div key={message.id} className="my-3 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-subtle px-3 py-1.5">
                <span className="text-xs text-muted-foreground">
                  {message.content.replaceAll("**", "").replaceAll("_", "").split("\n")[0]}
                </span>
                <span className="text-2xs text-muted-foreground">
                  {format(new Date(message.created_at), "HH:mm")}
                </span>
              </div>
            </div>
          )
        }

        return (
          <div
            key={message.id}
            className={cn("flex items-end gap-2", isOwn && "justify-end", !isLastInGroup && "mb-0.5")}
          >
            {!isOwn && (
              <div className="w-7 shrink-0">
                {isLastInGroup && (
                  <UserAvatar
                    name={displayName}
                    avatarUrl={avatarUrl ?? null}
                    className="size-7"
                    fallbackClassName="bg-primary text-2xs font-semibold text-primary-foreground"
                  />
                )}
              </div>
            )}

            {(() => {
              const imageUrl = getMessageImageUrl(message)
              const isImage = Boolean(imageUrl)
              const metaTone =
                isOwn && !isImage
                  ? "text-primary-foreground opacity-80"
                  : "text-muted-foreground"

              return (
            <div
              className={cn(
                "group relative max-w-(--chat-message-max-w)",
                isImage
                  ? "rounded-2xl bg-surface-subtle p-1 ring-1 ring-border-subtle"
                  : "px-3 py-2",
                !isImage &&
                  (isOwn
                    ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-2xl rounded-bl-md bg-surface-subtle text-foreground")
              )}
            >
              {isImage && imageUrl ? (
                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Image
                    src={imageUrl}
                    alt={t("imageAttachmentAlt")}
                    width={240}
                    height={240}
                    sizes="240px"
                    className="h-auto max-w-60 w-auto cursor-pointer rounded-xl object-cover transition-opacity hover:opacity-95"
                    unoptimized
                  />
                </a>
              ) : (
                <p className="break-words whitespace-pre-wrap text-body leading-snug">{message.content}</p>
              )}

              {isLastInGroup && (
                <div className={cn("mt-1 flex items-center gap-1", isOwn ? "justify-end" : "justify-start")}>
                  <span className={cn("text-2xs", metaTone)}>
                    {format(new Date(message.created_at), "HH:mm")}
                  </span>
                  {isOwn &&
                    (message.is_read ? (
                      <Checks size={12} className={cn(metaTone)} />
                    ) : (
                      <Check size={12} className={cn(metaTone)} />
                    ))}
                </div>
              )}

              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-accent",
                  isOwn ? "-left-9" : "-right-9"
                )}
              >
                <Heart size={14} className="text-muted-foreground" />
              </span>
            </div>
              )
            })()}
          </div>
        )
      })}
    </div>
  )
}

