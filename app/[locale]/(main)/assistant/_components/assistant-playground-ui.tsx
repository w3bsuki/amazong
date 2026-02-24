import { Bot as Robot, Search as MagnifyingGlass, ShoppingBag, Sparkles as Sparkle, Tag, Zap as Lightning, Package } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type ListingCard = {
  id: string
  title: string
  price: number
  images: string[]
  slug: string | null
  storeSlug: string | null
  currency?: string
}

export type ChatPart = {
  type: string
  text?: string
  state?: string
  output?: unknown
  input?: unknown
  toolCallId?: string
}

export type AssistantCopy = {
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

export function getListingHref(locale: string, item: ListingCard): string | null {
  if (!item.slug || !item.storeSlug) return null
  return `/${locale}/${item.storeSlug}/${item.slug}`
}

export function extractListings(parts: ChatPart[]): ListingCard[] {
  const listings: ListingCard[] = []
  for (const part of parts) {
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

export function AssistantAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "size-7",
    md: "size-8",
    lg: "size-10",
  }
  return (
    <Avatar className={cn(sizeClasses[size], "shrink-0")}>
      <AvatarFallback className="bg-primary text-primary-foreground">
        <Robot size={size === "lg" ? 20 : size === "md" ? 16 : 14} />
      </AvatarFallback>
    </Avatar>
  )
}

export function UserChatAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
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

export function MessageBubble({
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
        className="shrink-0 text-primary"
      />
      <span className="line-clamp-1">{children}</span>
    </button>
  )
}

export function WelcomeScreen({
  copy,
  onSuggestionClick,
}: {
  copy: AssistantCopy
  onSuggestionClick: (text: string) => void
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 text-center">
      <div className="relative mb-5">
        <Avatar className="size-16 shadow-lg md:size-20">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Robot size={32} className="md:hidden" />
            <Robot size={40} className="hidden md:block" />
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1">
          <Avatar className="size-7 ring-2 ring-background shadow-md">
            <AvatarFallback className="bg-card">
              <Sparkle size={14} className="text-primary" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground md:text-2xl">
        {copy.title}
      </h2>
      <p className="mb-6 max-w-xs text-sm text-muted-foreground md:max-w-sm md:text-base">
        {copy.assistantIntro}
      </p>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {[
          { icon: MagnifyingGlass, text: "Smart Search" },
          { icon: Lightning, text: "Instant" },
          { icon: ShoppingBag, text: "Best Deals" },
        ].map(({ icon: Icon, text }) => (
          <Badge key={text} variant="secondary" className="gap-1 px-2.5 py-1">
            <Icon size={12} className="text-primary" />
            {text}
          </Badge>
        ))}
      </div>

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

export function TypingIndicator({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3" role="status" aria-live="polite">
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
