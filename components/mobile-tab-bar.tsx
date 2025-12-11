"use client"

import * as React from "react"
import { House, Heart, ChatCircle, User, PlusCircle } from "@phosphor-icons/react"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export function MobileTabBar() {
  const pathname = usePathname()
  const t = useTranslations("Navigation")

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <>
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border md:hidden pb-safe"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-14 px-2 relative">
          {/* Home */}
          <Link
            href="/"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center min-h-[44px] min-w-[44px] gap-0.5",
              "touch-action-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
              isActive("/") && pathname === "/" ? "text-brand" : "text-muted-foreground"
            )}
            aria-label={t("home")}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <House size={22} weight={pathname === "/" ? "fill" : "regular"} />
            <span className="text-[10px] font-medium">{t("home")}</span>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center min-h-[44px] min-w-[44px] gap-0.5",
              "touch-action-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
              isActive("/wishlist") ? "text-brand" : "text-muted-foreground"
            )}
            aria-label={t("wishlist")}
            aria-current={isActive("/wishlist") ? "page" : undefined}
          >
            <Heart size={22} weight={isActive("/wishlist") ? "fill" : "regular"} />
            <span className="text-[10px] font-medium">{t("wishlist")}</span>
          </Link>

          {/* Sell */}
          <Link
            href="/sell"
            prefetch={true}
            className={cn(
              "flex flex-col items-center justify-center min-h-[44px] min-w-[44px] gap-0.5",
              "touch-action-manipulation tap-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
              isActive("/sell") ? "text-brand" : "text-muted-foreground"
            )}
            aria-label={t("sell")}
            aria-current={isActive("/sell") ? "page" : undefined}
          >
            <PlusCircle size={22} weight={isActive("/sell") ? "fill" : "regular"} />
            <span className="text-[10px] font-medium">{t("sell")}</span>
          </Link>

        {/* Chat */}
        <Link
          href="/messages"
          prefetch={true}
          className={cn(
            "flex flex-col items-center justify-center min-h-[44px] min-w-[44px] gap-0.5",
            "touch-action-manipulation tap-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
            isActive("/messages") ? "text-brand" : "text-muted-foreground"
          )}
          aria-label={t("chat")}
          aria-current={isActive("/messages") ? "page" : undefined}
        >
          <ChatCircle size={22} weight={isActive("/messages") ? "fill" : "regular"} />
          <span className="text-[10px] font-medium">{t("chat")}</span>
        </Link>

        {/* Account */}
        <Link
          href="/account"
          prefetch={true}
          className={cn(
            "flex flex-col items-center justify-center min-h-[44px] min-w-[44px] gap-0.5",
            "touch-action-manipulation tap-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
            isActive("/account") ? "text-brand" : "text-muted-foreground"
          )}
          aria-label={t("account")}
          aria-current={isActive("/account") ? "page" : undefined}
        >
          <User size={22} weight={isActive("/account") ? "fill" : "regular"} />
          <span className="text-[10px] font-medium">{t("account")}</span>
        </Link>
      </div>
    </nav>
  </>
  )
}
