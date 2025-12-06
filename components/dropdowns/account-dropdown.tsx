"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { SpinnerGap, UserCircle } from "@phosphor-icons/react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface AccountDropdownProps {
  user: User | null
}

export function AccountDropdown({ user }: AccountDropdownProps) {
  const t = useTranslations("Header")
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      setIsSigningOut(false)
    }
  }

  return (
    <HoverCard openDelay={50} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href={user ? "/account" : "/auth/login"}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xl"
                className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-brand hover:bg-header-hover relative"
              >
                <UserCircle weight={user ? "fill" : "regular"} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              <p>{user ? `${t("hello")}, ${user.email?.split("@")[0]}` : t("helloSignIn")}</p>
            </TooltipContent>
          </Tooltip>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[500px] p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="end"
        sideOffset={8}
      >
        <div className="flex flex-col items-center p-4 bg-muted border-b border-border">
          {!user ? (
            <>
              <Link href="/auth/login" className="w-56">
                <Button className="w-full bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text rounded-md h-[30px] font-normal text-sm">
                  {t("signIn")}
                </Button>
              </Link>
              <div className="text-xs mt-2 text-foreground">
                {t("newCustomer")}{" "}
                <Link href="/auth/sign-up" className="text-link hover:underline hover:text-link-hover">
                  {t("startHere")}
                </Link>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col items-center gap-2">
              <p className="text-sm font-medium">
                {t("hello")}, {user.email}
              </p>
              <Button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-56 h-[30px] text-xs bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text disabled:opacity-70"
              >
                {isSigningOut ? (
                  <>
                    <SpinnerGap className="size-4 animate-spin mr-2" />
                    {t("signingOut") || "Signing out..."}
                  </>
                ) : (
                  t("signOut")
                )}
              </Button>
            </div>
          )}
        </div>
        <div className="flex p-5">
          <div className="flex-1 border-r border-border pr-5">
            <h3 className="font-semibold text-base mb-2 text-foreground">{t("yourLists")}</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/account/wishlist" className="hover:text-link-hover hover:underline">
                  {t("wishlist")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-link-hover hover:underline">
                  {t("browsingHistory")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-link-hover hover:underline">
                  {t("createList")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-link-hover hover:underline">
                  {t("findList")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1 pl-5">
            <h3 className="font-semibold text-base mb-2 text-foreground">{t("yourAccount")}</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/account" className="hover:text-link-hover hover:underline">
                  {t("account")}
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-link-hover hover:underline">
                  {t("orders")}
                </Link>
              </li>
              <li>
                <Link href="/account/messages" className="hover:text-link-hover hover:underline">
                  {t("messages")}
                </Link>
              </li>
              <li>
                <Link href="/account/selling" className="hover:text-link-hover hover:underline">
                  {t("recommendations")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-link-hover hover:underline">
                  {t("memberships")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
