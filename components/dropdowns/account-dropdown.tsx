"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { SpinnerGap, UserCircle } from "@phosphor-icons/react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface AccountDropdownProps {
  user: User | null
}

export function AccountDropdown({ user }: AccountDropdownProps) {
  const t = useTranslations("Header")
  const tOrders = useTranslations("ReturnsDropdown")
  const tSelling = useTranslations("SellingDropdown")
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

  // For non-authenticated users, show a simple Sign In link without dropdown complexity
  if (!user) {
    return (
      <Link href="/auth/login">
        <Button
          variant="ghost"
            className="h-11 px-3 text-sm font-medium border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover"
        >
          {t("signIn")}
        </Button>
      </Link>
    )
  }

  // For authenticated users, show the full dropdown with account options
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link href="/account" aria-label={`${t("hello")}, ${user.email?.split("@")[0]}. ${t("accountAndLists")}`}>
          <Button
            variant="ghost"
            size="icon-xl"
            className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative"
          >
            <UserCircle weight="fill" />
          </Button>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[560px] p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="end"
        sideOffset={8}
      >
        <div className="flex flex-col items-center p-4 bg-muted border-b border-border">
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
                  <SpinnerGap className="size-4 mr-2" />
                  {t("signingOut") || "Signing out..."}
                </>
              ) : (
                t("signOut")
              )}
            </Button>
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
      </HoverCardContent>
    </HoverCard>
  )
}
