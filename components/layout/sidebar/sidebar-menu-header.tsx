"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation"
import {
  CircleUser as UserCircle,
  Settings as Gear,
  LogIn as SignInIcon,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Link, usePathname } from "@/i18n/routing"
import {
  DrawerClose,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SidebarMenuHeaderProps {
  isLoggedIn: boolean
  firstName: string | null
  displayName: string | null
  locale: string
  onCloseMenu: () => void
  tSidebar: (key: string) => string
  tNavigation: (key: string) => string
  tAccountDrawer: (key: string) => string
  tLocaleSwitcher: (key: string) => string
}

export function SidebarMenuHeader({
  isLoggedIn,
  firstName,
  displayName,
  locale,
  onCloseMenu,
  tSidebar,
  tNavigation,
  tAccountDrawer,
  tLocaleSwitcher,
}: SidebarMenuHeaderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams?.toString()
  const localeHref = search ? `${pathname}?${search}` : pathname

  return (
    <header className="shrink-0 border-b border-border-subtle bg-background">
      <DrawerTitle className="sr-only">{tSidebar("title")}</DrawerTitle>
      <DrawerDescription className="sr-only">{tSidebar("mobileDescription")}</DrawerDescription>
      <div className="h-14 px-3 flex items-center">
        {isLoggedIn ? (
          <Link
            href="/account"
            onClick={onCloseMenu}
            className="flex min-w-0 items-center gap-2.5 rounded-lg tap-transparent motion-safe:transition-opacity motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <div className="size-touch shrink-0 rounded-full bg-selected flex items-center justify-center">
              <UserCircle size={26} className="text-primary" />
            </div>
            <span className="text-foreground text-base font-semibold truncate max-w-32">
              {firstName || displayName}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="cta">
              <Link href="/auth/login" onClick={onCloseMenu} className="gap-1.5">
                <SignInIcon size={20} />
                <span>{tSidebar("signIn")}</span>
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/auth/sign-up" onClick={onCloseMenu}>
                {tNavigation("register")}
              </Link>
            </Button>
          </div>
        )}

        <div className="flex-1" />

        <div className="flex items-center">
          {isLoggedIn && (
            <IconButton
              asChild
              aria-label={tAccountDrawer("settings")}
              variant="ghost"
              className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Link href="/account/settings" onClick={onCloseMenu}>
                <Gear size={22} />
              </Link>
            </IconButton>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                aria-label={tLocaleSwitcher("label")}
                variant="ghost"
                className="rounded-full text-muted-foreground hover:bg-hover hover:text-foreground"
              >
                <Image
                  src={locale === "bg" ? "https://flagcdn.com/w40/bg.png" : "https://flagcdn.com/w40/gb.png"}
                  alt=""
                  width={24}
                  height={16}
                  sizes="24px"
                  className="w-6 h-4 rounded-sm object-cover"
                />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36 rounded-2xl p-1">
              <DropdownMenuItem asChild>
                <Link
                  href={localeHref}
                  locale="en"
                  onClick={onCloseMenu}
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl"
                >
                  <Image
                    src="https://flagcdn.com/w40/gb.png"
                    alt=""
                    width={18}
                    height={12}
                    sizes="18px"
                    className="h-3 w-auto rounded-sm object-cover"
                  />
                  <span className="text-sm font-medium">{tLocaleSwitcher("english")}</span>
                  {locale === "en" && <span className="ml-auto text-primary font-bold text-xs">✓</span>}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={localeHref}
                  locale="bg"
                  onClick={onCloseMenu}
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl"
                >
                  <Image
                    src="https://flagcdn.com/w40/bg.png"
                    alt=""
                    width={18}
                    height={12}
                    sizes="18px"
                    className="h-3 w-auto rounded-sm object-cover"
                  />
                  <span className="text-sm font-medium">{tLocaleSwitcher("bulgarian")}</span>
                  {locale === "bg" && <span className="ml-auto text-primary font-bold text-xs">✓</span>}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DrawerClose asChild>
            <IconButton
              aria-label={tSidebar("close")}
              variant="ghost"
              className="text-foreground hover:bg-muted active:bg-active"
            >
              <X size={22} />
            </IconButton>
          </DrawerClose>
        </div>
      </div>
    </header>
  )
}
