"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { SpinnerGap, UserCircle } from "@phosphor-icons/react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AccountDropdownProps {
  user: User | null
  variant?: "icon" | "full"
  className?: string
}

export function AccountDropdown({ user, variant = "icon", className }: AccountDropdownProps) {
  const t = useTranslations("Header")
  const tOrders = useTranslations("ReturnsDropdown")
  const tSelling = useTranslations("SellingDropdown")
  const [isSigningOut, setIsSigningOut] = useState(false)

  // For non-authenticated users with icon variant, show a simple Sign In link
  if (!user && variant === "icon") {
    return (
      <Link href="/auth/login">
        <Button
          variant="ghost"
            className={cn("h-10 px-3 text-sm font-medium border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover", className)}
        >
          {t("signIn")}
        </Button>
      </Link>
    )
  }

  const triggerContent = variant === "full" ? (
    <div
      className={cn(
        "h-10 px-3 text-xs font-semibold leading-none border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover transition-all flex items-center cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <div className="flex items-center justify-center text-header-text/90">
          <UserCircle weight="fill" className="size-6" />
        </div>
        <div className="flex flex-col items-start leading-none gap-0.5">
          <span className="text-2xs text-header-text/70 font-normal">
            {t("hello")}
          </span>
          <span className="text-xs font-bold truncate max-w-20 lg:max-w-32">
            {user ? (user.user_metadata?.full_name || user.email?.split("@")[0] || "User") : t("signIn")}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={cn("inline-flex items-center justify-center border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative size-10 cursor-pointer", className)}
    >
      <UserCircle weight="fill" className="size-6" />
    </div>
  )

  // For authenticated users OR full variant, show the dropdown
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link href={user ? "/account" : "/auth/login"} className="block" aria-label={`${t("hello")}, ${user?.email?.split("@")[0] || t("signIn")}. ${t("accountAndLists")}`}>
          {triggerContent}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-(--container-dropdown-lg) p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden shadow-md"
        align={variant === "full" ? "start" : "end"}
        sideOffset={8}
        collisionPadding={10}
      >
        {!user ? (
          <div className="flex flex-col items-center p-4 bg-muted border-b border-border gap-4">
            <div className="flex flex-col items-center gap-2">
              <Link href="/auth/login">
                <Button className="w-56 bg-cta-primary hover:bg-cta-primary-hover text-cta-primary-text">
                  {t("signIn")}
                </Button>
              </Link>
              <div className="text-xs text-muted-foreground">
                {t("newCustomer")} <Link href="/auth/sign-up" className="text-link hover:underline hover:text-link-hover">{t("startHere")}</Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center p-4 bg-muted border-b border-border">
              <div className="w-full flex flex-col items-center gap-2">
                <p className="text-sm font-medium">
                  {t("hello")}, {user.email}
                </p>
                <form action="/api/auth/signout" method="post" onSubmit={() => setIsSigningOut(true)}>
                  <Button
                    type="submit"
                    disabled={isSigningOut}
                    className="w-56 h-8 text-xs bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text disabled:opacity-70"
                  >
                    {isSigningOut ? (
                      <>
                        <SpinnerGap className="size-4 mr-2" />
                        {t("signingOut") || "Signing out..."}
                      </>
                    ) : (
                      t("signOut")
                    )}
                  </Button>
                </form>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-0 p-5">
              <div className="pr-5 border-r border-border">
                <h3 className="font-semibold text-base mb-2 text-foreground">{tOrders("title")}</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>
                    <Link href="/account/orders" className="hover:text-link-hover hover:underline">
                      {tOrders("trackOrders")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/returns" className="hover:text-link-hover hover:underline">
                      {tOrders("startReturn")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/chat" className="hover:text-link-hover hover:underline">
                      {t("messages")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/account" className="hover:text-link-hover hover:underline">
                      {t("account")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="pl-5">
                <h3 className="font-semibold text-base mb-2 text-foreground">{tSelling("title")}</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>
                    <Link href="/sell" className="hover:text-link-hover hover:underline">
                      {tSelling("createListing")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/sell/orders" className="hover:text-link-hover hover:underline">
                      {tSelling("sellerOrders")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/account/sales" className="hover:text-link-hover hover:underline">
                      {tSelling("sales")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/account/wishlist" className="hover:text-link-hover hover:underline">
                      {t("wishlist")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-muted border-t border-border">
              <Link href="/account/orders" className="w-full">
                <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                  {tOrders("viewAllOrders")}
                </Button>
              </Link>
              <Link href="/sell" className="w-full">
                <Button className="w-full h-9 text-sm bg-cta-secondary hover:bg-cta-secondary-hover text-cta-secondary-text">
                  {tSelling("createListing")}
                </Button>
              </Link>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
