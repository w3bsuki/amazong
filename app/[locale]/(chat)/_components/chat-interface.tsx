"use client"

import { useState, useEffect, useRef } from "react"
import { format, isToday, isYesterday, isSameDay } from "date-fns"
import { useTranslations, useLocale } from "next-intl"
import { bg, enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useMessages, type Message } from "@/components/providers/message-context"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PaperPlaneTilt,
  ArrowLeft,
  X,
  Archive,
  CircleNotch,
  Checks,
  Check,
  Phone,
  VideoCamera,
  Info,
  Image as ImageIcon,
  Heart,
  Package,
  ProhibitInset,
  Flag,
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { blockUser } from "@/app/actions/blocked-users"
import { reportConversation } from "@/app/[locale]/(chat)/_actions/report-conversation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

interface ChatInterfaceProps {
  className?: string
  onBack?: () => void
  showHeader?: boolean
}

export function ChatInterface({
  className,
  onBack,
  showHeader = true,
}: ChatInterfaceProps) {
  const t = useTranslations("Messages")
  const locale = useLocale()
  const dateLocale = locale === "bg" ? bg : enUS
  const supabase = createClient()
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    currentConversation,
    messages,
    isLoadingMessages,
    isOtherUserTyping,
    sendMessage,
    sendTypingIndicator,
    closeConversation,
    error,
  } = useMessages()

  const { toast } = useToast()
  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isBlocking, setIsBlocking] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setCurrentUserId(data.user.id)
      }
    }
    getUser()
  }, [supabase])

  // Scroll to bottom when messages change
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  // Auto-resize textarea and send typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    // Auto-resize
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
    // Send typing indicator (throttled in context)
    if (e.target.value.trim()) {
      sendTypingIndicator()
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(inputValue.trim())
      setInputValue("")
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "auto"
      }
    } catch (err) {
      console.error("Error sending message:", err)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith("image/")) {
      console.error("File must be an image")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error("Image too large (max 5MB)")
      return
    }

    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-chat-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const data = await response.json()

      // Send message with image attachment
      await sendMessage("", data.url)
    } catch (err) {
      console.error("Error uploading image:", err)
    } finally {
      setIsUploadingImage(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Handle blocking user
  const handleBlockUser = async () => {
    if (!currentConversation) return

    // Determine who to block (the other party)
    const userToBlock =
      currentUserId === currentConversation.buyer_id
        ? currentConversation.seller_id
        : currentConversation.buyer_id

    setIsBlocking(true)
    try {
      const result = await blockUser(userToBlock)
      if (result.success) {
        toast({
          title: locale === "bg" ? "Потребителят е блокиран" : "User blocked",
          description:
            locale === "bg"
              ? "Този потребител вече не може да ви изпраща съобщения"
              : "This user can no longer message you",
        })
        // Close the conversation
        await closeConversation(currentConversation.id)
      } else {
        throw new Error(result.error || "Failed to block user")
      }
    } catch (err) {
      console.error("Error blocking user:", err)
      toast({
        title: locale === "bg" ? "Грешка" : "Error",
        description:
          locale === "bg" ? "Неуспешно блокиране на потребителя" : "Failed to block user",
        variant: "destructive",
      })
    } finally {
      setIsBlocking(false)
    }
  }

  // Handle reporting conversation
  const handleReportConversation = async () => {
    if (!currentConversation) return

    setIsReporting(true)
    try {
      const result = await reportConversation(currentConversation.id, "inappropriate")
      if (result.success) {
        toast({
          title: locale === "bg" ? "Докладът е изпратен" : "Report submitted",
          description:
            locale === "bg"
              ? "Благодарим ви за сигнала. Ще го прегледаме."
              : "Thank you for your report. We will review it.",
        })
      } else {
        throw new Error(result.error || "Failed to report")
      }
    } catch (err) {
      console.error("Error reporting conversation:", err)
      toast({
        title: locale === "bg" ? "Грешка" : "Error",
        description:
          locale === "bg" ? "Неуспешно изпращане на доклада" : "Failed to submit report",
        variant: "destructive",
      })
    } finally {
      setIsReporting(false)
    }
  }

  // No conversation selected state - Instagram style
  if (!currentConversation) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full bg-background",
          className
        )}
      >
        <div className="flex flex-col items-center gap-4 p-8 text-center max-w-sm">
          <div className="flex size-20 items-center justify-center rounded-full border-2 border-foreground/20">
            <svg
              className="size-10 text-foreground/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {t("selectConversation")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {locale === "bg" ? "Изберете чат, за да започнете" : "Choose a chat to get started"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Get other party info
  const otherParty = currentConversation.seller?.profile || currentConversation.buyer
  const displayName =
    currentConversation.seller?.business_name || otherParty?.full_name || t("unknownUser")
  const avatarUrl = otherParty?.avatar_url
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Check if conversation is closed
  const isClosed = currentConversation.status !== "open"

  // Format date separator
  const formatDateSeparator = (date: Date) => {
    if (isToday(date)) return locale === "bg" ? "Днес" : "Today"
    if (isYesterday(date)) return locale === "bg" ? "Вчера" : "Yesterday"
    return format(date, "d MMM yyyy", { locale: dateLocale })
  }

  // Group messages by date and add separators
  const messagesWithSeparators: Array<
    { type: "separator"; date: Date } | { type: "message"; message: Message }
  > = []
  let lastDate: Date | null = null

  messages.forEach((message) => {
    const msgDate = new Date(message.created_at)
    if (!lastDate || !isSameDay(lastDate, msgDate)) {
      messagesWithSeparators.push({ type: "separator", date: msgDate })
      lastDate = msgDate
    }
    messagesWithSeparators.push({ type: "message", message })
  })

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header - Instagram DM style */}
      {showHeader && (
        <div className="shrink-0 border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-3">
            {/* Back button (mobile) */}
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center justify-center size-9 -ml-1 rounded-full hover:bg-muted transition-colors md:hidden"
              >
                <ArrowLeft size={24} weight="regular" className="text-foreground" />
              </button>
            )}

            {/* Avatar */}
            <Link href={`/seller/${currentConversation.seller_id}`} className="shrink-0">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-11 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                  {initials}
                </div>
              )}
            </Link>

            {/* Name and status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-base text-foreground truncate">
                  {displayName}
                </h2>
              </div>
              {currentConversation.product ? (
                <Link
                  href={`/product/${currentConversation.product.id}`}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors truncate block"
                >
                  {currentConversation.product.title}
                </Link>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {isClosed
                    ? locale === "bg"
                      ? "Затворен чат"
                      : "Chat closed"
                    : locale === "bg"
                      ? "Активен"
                      : "Active"}
                </p>
              )}
            </div>

            {/* Action buttons - Instagram style */}
            <div className="flex items-center gap-1">
              <button className="flex items-center justify-center size-9 rounded-full hover:bg-muted transition-colors">
                <Phone size={22} weight="regular" className="text-foreground" />
              </button>
              <button className="flex items-center justify-center size-9 rounded-full hover:bg-muted transition-colors">
                <VideoCamera size={22} weight="regular" className="text-foreground" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center size-9 rounded-full hover:bg-muted transition-colors">
                    <Info size={22} weight="regular" className="text-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {!isClosed && (
                    <DropdownMenuItem onClick={() => closeConversation(currentConversation.id)}>
                      <X size={16} weight="regular" className="mr-2" />
                      {t("closeConversation")}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Archive size={16} weight="regular" className="mr-2" />
                    {t("archiveConversation")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleReportConversation} disabled={isReporting}>
                    <Flag size={16} weight="regular" className="mr-2" />
                    {isReporting
                      ? locale === "bg"
                        ? "Изпращане..."
                        : "Reporting..."
                      : locale === "bg"
                        ? "Докладвай разговор"
                        : "Report conversation"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleBlockUser}
                    disabled={isBlocking}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <ProhibitInset size={16} weight="regular" className="mr-2" />
                    {isBlocking
                      ? locale === "bg"
                        ? "Блокиране..."
                        : "Blocking..."
                      : locale === "bg"
                        ? "Блокирай потребителя"
                        : "Block user"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {/* Messages area - Instagram style with bubbles */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {isLoadingMessages ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn("flex items-end gap-2", i % 2 === 0 && "justify-end")}
              >
                {i % 2 !== 0 && <Skeleton className="size-7 rounded-full shrink-0" />}
                <Skeleton
                  className={cn(
                    "h-12 rounded-2xl",
                    i % 2 === 0 ? "w-40 rounded-br-md" : "w-48 rounded-bl-md"
                  )}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            {/* Profile card for new conversations */}
            <div className="flex flex-col items-center gap-3 mb-6">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={96}
                  height={96}
                  className="size-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white">
                  {initials}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-foreground">{displayName}</h3>
                {currentConversation.product && (
                  <p className="text-sm text-muted-foreground">
                    {currentConversation.product.title}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {locale === "bg"
                ? "Започнете разговора. Съобщенията изчезват след като поръчката бъде доставена."
                : "Start the conversation. Messages disappear after the order is delivered."}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {messagesWithSeparators.map((item, index) => {
              if (item.type === "separator") {
                // Check if next item is an order notification - if so, skip separator (it renders below the banner)
                const nextItem = messagesWithSeparators[index + 1]
                if (nextItem?.type === "message") {
                  const isNextOrderNotification =
                    (nextItem.message.message_type === "system" ||
                      nextItem.message.message_type === "order_update") &&
                    (nextItem.message.content.includes("New Order") ||
                      nextItem.message.content.includes("Нова поръчка"))
                  if (isNextOrderNotification) {
                    return null // Separator will be rendered below the order banner
                  }
                }

                return (
                  <div key={`sep-${index}`} className="flex items-center justify-center py-4">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {formatDateSeparator(item.date)}
                    </span>
                  </div>
                )
              }

              const message = item.message
              const isOwn = message.sender_id === currentUserId
              const isSystemMessage =
                message.message_type === "system" || message.message_type === "order_update"

              // Check if this is the last message in a group from same sender
              const nextItem = messagesWithSeparators[index + 1]
              const isLastInGroup =
                !nextItem ||
                nextItem.type === "separator" ||
                nextItem.message.sender_id !== message.sender_id

              // Check previous item for avatar display
              const prevItem = messagesWithSeparators[index - 1]
              const _isFirstInGroup =
                !prevItem ||
                prevItem.type === "separator" ||
                prevItem.message.sender_id !== message.sender_id

              // System messages render as notification banners
              if (isSystemMessage) {
                // Parse order notification data from message content
                const isOrderNotification =
                  message.content.includes("New Order") || message.content.includes("Нова поръчка")
                const productImage = currentConversation?.product?.images?.[0]

                // Extract order details from message - Price: $20.00 format
                const priceMatch = message.content.match(
                  /Price:\s*\$?([\d,.]+)|Цена:\s*\$?([\d,.]+)/
                )
                const price = priceMatch ? priceMatch[1] || priceMatch[2] : null
                const quantityMatch = message.content.match(
                  /Quantity:\s*(\d+)|Количество:\s*(\d+)/
                )
                const quantity = quantityMatch ? quantityMatch[1] || quantityMatch[2] : "1"

                // Check if previous item was a date separator (to render it below the banner)
                const hadDateSeparator = prevItem?.type === "separator"
                const separatorDate = hadDateSeparator ? prevItem.date : null

                // Order notification banner
                if (isOrderNotification && currentConversation?.product) {
                  return (
                    <div key={message.id} className="mt-2">
                      {/* Minimal order notification card */}
                      <div className="flex items-stretch gap-0 rounded-lg border border-border bg-card overflow-hidden">
                        {/* Product image - clickable */}
                        {productImage ? (
                          <Link href={`/product/${currentConversation.product.id}`} className="shrink-0">
                            <div className="relative w-16 h-full min-h-[64px] bg-muted">
                              <Image
                                src={productImage}
                                alt={currentConversation.product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-center justify-center w-16 bg-muted shrink-0">
                            <Package size={24} weight="regular" className="text-muted-foreground" />
                          </div>
                        )}

                        {/* Order info */}
                        <div className="flex-1 min-w-0 px-3 py-2">
                          {/* Header row */}
                          <div className="flex items-center gap-1.5">
                            <Package size={12} weight="fill" className="text-primary shrink-0" />
                            <span className="text-xs font-medium text-primary">
                              {locale === "bg" ? "Поръчка" : "Order"}
                            </span>
                            <span className="text-2xs text-muted-foreground ml-auto">
                              {format(new Date(message.created_at), "MMM d, HH:mm", { locale: dateLocale })}
                            </span>
                          </div>

                          {/* Product title */}
                          <p className="text-sm font-medium text-foreground truncate mt-0.5">
                            {currentConversation.product.title}
                          </p>

                          {/* Price & quantity row */}
                          <div className="flex items-center gap-2 mt-1">
                            {price && (
                              <span className="text-xs font-medium text-foreground">${price}</span>
                            )}
                            {quantity !== "1" && (
                              <span className="text-xs text-muted-foreground">× {quantity}</span>
                            )}
                            <span className="inline-flex items-center gap-1 text-2xs text-amber-600 dark:text-amber-500 ml-auto">
                              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                              {locale === "bg" ? "Изчаква" : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Date separator BELOW the order banner */}
                      {separatorDate && (
                        <div className="flex items-center justify-center py-3">
                          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            {formatDateSeparator(separatorDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                }

                // Generic system message (status updates, etc.)
                return (
                  <div key={message.id} className="flex justify-center my-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/70 border border-border/50">
                      <span className="text-xs text-muted-foreground">
                        {message.content.replace(/\*\*/g, "").replace(/_/g, "").split("\n")[0]}
                      </span>
                      <span className="text-2xs text-muted-foreground/70">
                        {format(new Date(message.created_at), "HH:mm")}
                      </span>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2",
                    isOwn && "justify-end",
                    !isLastInGroup && "mb-0.5"
                  )}
                >
                  {/* Avatar - only show for received messages and last in group */}
                  {!isOwn && (
                    <div className="shrink-0 w-7">
                      {isLastInGroup &&
                        (avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={displayName}
                            width={28}
                            height={28}
                            className="size-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex size-7 items-center justify-center rounded-full bg-purple-600 text-2xs font-semibold text-white">
                            {initials}
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={cn(
                      "max-w-[70%] relative group",
                      message.message_type === "image" ? "p-1" : "px-3.5 py-2",
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-2xl"
                        : "bg-muted rounded-2xl",
                      // Bubble tail styling
                      isOwn && isLastInGroup && "rounded-br-md",
                      !isOwn && isLastInGroup && "rounded-bl-md"
                    )}
                  >
                    {/* Message content - image or text */}
                    {message.message_type === "image" && message.attachment_url ? (
                      <a
                        href={message.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Image
                          src={message.attachment_url}
                          alt="Shared image"
                          width={280}
                          height={280}
                          className="rounded-xl max-w-[280px] w-auto h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity"
                          unoptimized
                        />
                      </a>
                    ) : (
                      <p className="text-base leading-snug whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    )}

                    {/* Time - show on last message in group */}
                    {isLastInGroup && (
                      <div
                        className={cn(
                          "flex items-center gap-1 mt-1",
                          isOwn ? "justify-end" : "justify-start"
                        )}
                      >
                        <span
                          className={cn(
                            "text-2xs",
                            isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}
                        >
                          {format(new Date(message.created_at), "HH:mm")}
                        </span>
                        {isOwn &&
                          (message.is_read ? (
                            <Checks size={12} weight="bold" className="text-primary-foreground/70" />
                          ) : (
                            <Check size={12} weight="regular" className="text-primary-foreground/70" />
                          ))}
                      </div>
                    )}

                    {/* Like reaction button - appears on hover */}
                    <button
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
                        "flex items-center justify-center size-7 rounded-full bg-background border border-border shadow-sm hover:scale-110",
                        isOwn ? "-left-9" : "-right-9"
                      )}
                    >
                      <Heart size={14} weight="regular" className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Typing indicator */}
      {isOtherUserTyping && !isClosed && (
        <div className="px-4 pb-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex gap-1">
              <span
                className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span>
              {displayName} {locale === "bg" ? "пише..." : "is typing..."}
            </span>
          </div>
        </div>
      )}

      {/* Input area - Instagram style */}
      <div className="shrink-0 border-t border-border px-3 py-3 bg-background">
        {isClosed ? (
          <div className="flex items-center justify-center py-2 px-4 rounded-full bg-muted">
            <p className="text-sm text-muted-foreground">{t("conversationClosed")}</p>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            {/* Hidden file input for image upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Image upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage || isSending}
              className="flex items-center justify-center size-10 rounded-full hover:bg-muted transition-colors shrink-0 disabled:opacity-50"
            >
              {isUploadingImage ? (
                <CircleNotch size={24} weight="regular" className="text-primary animate-spin" />
              ) : (
                <ImageIcon size={24} weight="regular" className="text-primary" />
              )}
            </button>

            {/* Input container */}
            <div className="flex-1 flex items-end gap-2 px-4 py-2 rounded-3xl border border-border bg-muted/30 focus-within:border-primary/50 transition-colors">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t("typeMessage")}
                disabled={isSending || isUploadingImage}
                rows={1}
                className="flex-1 bg-transparent text-base placeholder:text-muted-foreground resize-none outline-none min-h-[24px] max-h-[120px] py-0.5"
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={isSending || isUploadingImage || !inputValue.trim()}
              className={cn(
                "flex items-center justify-center size-10 rounded-full transition-colors shrink-0 disabled:opacity-50",
                inputValue.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isSending ? (
                <CircleNotch size={20} weight="regular" className="animate-spin" />
              ) : (
                <PaperPlaneTilt size={20} weight="fill" />
              )}
            </button>
          </div>
        )}

        {error && <p className="text-xs text-destructive mt-2 text-center">{error}</p>}
      </div>
    </div>
  )
}
