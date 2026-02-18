import { Archive, ArrowLeft, Ban as ProhibitInset, Flag, Info, Phone, Video as VideoCamera, X } from "lucide-react"
import type { useTranslations } from "next-intl"

import { Link } from "@/i18n/routing"
import { UserAvatar } from "@/components/shared/user-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Translator = ReturnType<typeof useTranslations>

export function ChatInterfaceHeader({
  t,
  displayName,
  avatarUrl,
  sellerId,
  productHref,
  productTitle,
  isClosed,
  onBack,
  onCloseConversation,
  onReportConversation,
  onBlockUser,
  isReporting,
  isBlocking,
}: {
  t: Translator
  displayName: string
  avatarUrl: string | null
  sellerId: string
  productHref: string
  productTitle: string | undefined
  isClosed: boolean
  onBack: (() => void) | undefined
  onCloseConversation: () => void
  onReportConversation: () => void
  onBlockUser: () => void
  isReporting: boolean
  isBlocking: boolean
}) {
  return (
    <div className="shrink-0 border-b border-border bg-background px-2 py-2 pt-safe-max-xs">
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label={t("back")}
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-hover active:bg-active lg:hidden"
          >
            <ArrowLeft size={22} className="text-foreground" />
          </button>
        )}

        <Link href={`/seller/${sellerId}`} className="shrink-0">
          <UserAvatar
            name={displayName}
            avatarUrl={avatarUrl ?? null}
            className="size-10"
            fallbackClassName="bg-primary text-sm font-semibold text-primary-foreground"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold leading-tight text-foreground">{displayName}</h2>
          {productTitle ? (
            <Link
              href={productHref}
              className="block truncate text-xs leading-tight text-muted-foreground transition-colors hover:text-foreground"
            >
              {productTitle}
            </Link>
          ) : (
            <p className="text-xs leading-tight text-muted-foreground">{isClosed ? t("closed") : t("active")}</p>
          )}
        </div>

        <div className="flex items-center">
          <button
            type="button"
            aria-label="Voice call"
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <Phone size={20} className="text-foreground" />
          </button>
          <button
            type="button"
            aria-label="Video call"
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <VideoCamera size={20} className="text-foreground" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More actions"
                className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
              >
                <Info size={22} className="text-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {!isClosed && (
                <DropdownMenuItem onClick={onCloseConversation}>
                  <X size={16} className="mr-2" />
                  {t("closeConversation")}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Archive size={16} className="mr-2" />
                {t("archiveConversation")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onReportConversation} disabled={isReporting}>
                <Flag size={16} className="mr-2" />
                {isReporting ? t("reporting") : t("reportConversation")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onBlockUser}
                disabled={isBlocking}
                className="text-destructive focus:bg-destructive-subtle focus:text-destructive"
              >
                <ProhibitInset size={16} className="mr-2" />
                {isBlocking ? t("blocking") : t("blockUser")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

