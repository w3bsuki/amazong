"use client"

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  List,
  LogOut as SignOut,
  LoaderCircle as SpinnerGap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"

import { SidebarMenuHeader } from "./sidebar-menu-header"
import { SidebarMenuBody } from "./sidebar-menu-body"

export interface UserListingStats {
  activeListings: number
  boostedListings: number
}

export interface SidebarMenuProps {
  user?: SupabaseUser | null
  triggerClassName?: string
  userStats?: UserListingStats
}

export function SidebarMenu({ user, triggerClassName, userStats }: SidebarMenuProps) {
  const [open, setOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [mounted, setMounted] = useState(false)
  const t = useTranslations("Sidebar")
  const tCommon = useTranslations("Common")
  const tNav = useTranslations("Navigation")
  const tAccountDrawer = useTranslations("AccountDrawer")
  const tNavUser = useTranslations("NavUser")
  const tLocaleSwitcher = useTranslations("LocaleSwitcher")
  const tMenu = useTranslations("SidebarMenu")
  const locale = useLocale()

  useEffect(() => {
    setMounted(true)
  }, [])

  const getUserDisplayName = () => {
    if (!user) return null
    if (user.user_metadata?.full_name) return user.user_metadata.full_name
    if (user.user_metadata?.name) return user.user_metadata.name
    if (user.email) return user.email.split("@")[0]
    return null
  }

  const getFirstName = () => {
    const name = getUserDisplayName()
    if (!name) return null
    return name.split(" ")[0]
  }

  const displayName = getUserDisplayName()
  const firstName = getFirstName()
  const isLoggedIn = !!user

  if (!mounted) {
    return (
      <span
        className={cn(
          "inline-flex size-(--control-default) items-center justify-center rounded-lg text-foreground touch-manipulation tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none cursor-pointer hover:bg-hover active:bg-active [&_svg]:size-6",
          triggerClassName
        )}
        aria-hidden="true"
        data-testid="mobile-menu-trigger"
      >
        <List />
      </span>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction="left"
      shouldScaleBackground={false}
    >
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "size-(--control-default) rounded-lg text-foreground touch-manipulation tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring [&_svg]:size-6",
            triggerClassName
          )}
          aria-label={t("title")}
          data-testid="mobile-menu-trigger"
        >
          <List />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-0 bg-background text-foreground gap-0 flex flex-col h-full shadow-none">
        <SidebarMenuHeader
          isLoggedIn={isLoggedIn}
          firstName={firstName}
          displayName={displayName}
          locale={locale}
          onCloseMenu={() => setOpen(false)}
          tSidebar={(key) => t(key as never)}
          tNavigation={(key) => tNav(key as never)}
          tAccountDrawer={(key) => tAccountDrawer(key as never)}
          tLocaleSwitcher={(key) => tLocaleSwitcher(key as never)}
        />

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar touch-pan-y">
          <SidebarMenuBody
            isLoggedIn={isLoggedIn}
            {...(userStats ? { userStats } : {})}
            onCloseMenu={() => setOpen(false)}
            tSidebar={(key) => t(key as never)}
            tNavigation={(key) => tNav(key as never)}
            tAccountDrawer={(key) => tAccountDrawer(key as never)}
            tNavUser={(key) => tNavUser(key as never)}
            tMenu={(key) => tMenu(key as never)}
          />
        </div>

        <footer className="shrink-0 border-t border-border-subtle pb-safe">
          {isLoggedIn ? (
            <div className="flex items-center justify-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    disabled={isSigningOut}
                    className="flex min-h-(--control-primary) flex-1 items-center justify-center gap-2 text-sm text-muted-foreground tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-hover hover:text-destructive active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    {isSigningOut ? (
                      <SpinnerGap size={18} className="animate-spin" />
                    ) : (
                      <SignOut size={18} />
                    )}
                    <span>{tNavUser("logOut")}</span>
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="max-w-sm rounded-lg border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-semibold text-foreground">
                      {tMenu("signOutTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground">
                      {tMenu("signOutDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row gap-2 sm:flex-row">
                    <AlertDialogCancel className="h-(--control-default) flex-1 text-sm font-medium">
                      {tCommon("cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="h-(--control-default) flex-1 text-sm font-medium"
                      onClick={() => {
                        setIsSigningOut(true)
                        const form = document.createElement("form")
                        form.method = "POST"
                        form.action = "/api/auth/sign-out"
                        document.body.appendChild(form)
                        form.submit()
                      }}
                    >
                      {tMenu("confirmSignOut")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : null}
        </footer>
      </DrawerContent>
    </Drawer>
  )
}
