"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MessageCircleMore as ChatCircleDots, Headphones, Loader2, Send as PaperPlaneTilt } from "lucide-react";

import { cn } from "@/lib/utils"
import { AuthGateCard } from "../../../../_components/auth/auth-gate-card"

type Translate = (key: string, values?: Record<string, string | number | Date>) => string

export interface SupportMessage {
  id: string
  content: string
  sender_id: string
  is_support: boolean
  created_at: string
  sender_name?: string
}

function Spinner({ className, label }: { className?: string; label: string }) {
  return (
    <Loader2
      data-slot="spinner"
      role="status"
      aria-label={label}
      className={cn("size-4 animate-spin", className)}
    />
  )
}

interface SupportChatWidgetViewProps {
  className?: string | undefined
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  hideTrigger: boolean
  isAuthenticated: boolean
  isLoading: boolean
  messages: SupportMessage[]
  newMessage: string
  isSending: boolean
  setNewMessage: (value: string) => void
  handleKeyDown: (event: React.KeyboardEvent) => void
  handleSend: () => void
  formatTime: (dateStr: string) => string
  scrollRef: React.RefObject<HTMLDivElement | null>
  inputRef: React.RefObject<HTMLInputElement | null>
  t: Translate
  tCommon: Translate
}

export function SupportChatWidgetView({
  className,
  isOpen,
  onOpenChange,
  hideTrigger,
  isAuthenticated,
  isLoading,
  messages,
  newMessage,
  isSending,
  setNewMessage,
  handleKeyDown,
  handleSend,
  formatTime,
  scrollRef,
  inputRef,
  t,
  tCommon,
}: SupportChatWidgetViewProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <SheetTrigger asChild>
          <Button
            size="lg"
            className={cn(
              "fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow bg-primary hover:bg-interactive-hover",
              "md:bottom-6 md:right-6",
              className
            )}
            aria-label={t("startChatting")}
          >
            <ChatCircleDots className="size-6" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side="right"
        className="w-full sm:w-(--container-modal-sm) p-0 flex flex-col"
      >
        <SheetHeader className="px-4 py-3 border-b bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-muted rounded-full flex items-center justify-center">
              <Headphones className="size-5" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-primary-foreground text-lg">{t("contactUs")}</SheetTitle>
              <p className="text-foreground text-sm">{t("needMoreHelp")}</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Headphones className="size-12 text-muted-foreground mb-4" />
              <AuthGateCard
                title={t("signInRequired")}
                showBackToHome={false}
                className="border-0 shadow-none bg-transparent max-w-none"
              />
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full" role="status" aria-live="polite">
              <Spinner className="size-8 text-primary" label={tCommon("loading")} />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <ChatCircleDots className="size-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t("startConversation") || "Start a conversation with our support team"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                help@treido.com
              </p>
            </div>
          ) : (
            <div className="space-y-4" role="log" aria-live="polite" aria-relevant="additions text" aria-busy={isSending}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.is_support ? "justify-start" : "justify-end"
                  )}
                >
                  {message.is_support && (
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage src="/images/support-avatar.png" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        TS
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-(--support-chat-message-max-w) rounded-lg px-3 py-2",
                      message.is_support
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap wrap-break-word">
                      {message.content}
                    </p>
                    <p
                      className={cn(
                        "text-2xs mt-1",
                        message.is_support ? "text-muted-foreground" : "text-foreground"
                      )}
                    >
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {isAuthenticated && (
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("typeMessage") || "Type a message..."}
                aria-label={t("typeMessage") || "Type a message"}
                disabled={isSending}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!newMessage.trim() || isSending}
                className="bg-primary hover:bg-interactive-hover shrink-0"
                aria-label={t("sendMessage")}
              >
                {isSending ? (
                  <Spinner className="size-4" label={tCommon("loading")} />
                ) : (
                  <PaperPlaneTilt className="size-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {t("emailAlternative") || "Or email us at"}{" "}
              <a href="mailto:help@treido.com" className="text-primary hover:underline">
                help@treido.com
              </a>
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
