import {
  Bell,
  ChartLine as ChartLineUp,
  CreditCard,
  Heart,
  LifeBuoy as Lifebuoy,
  MapPin,
  MessageCircle as ChatCircleText,
  Package,
  Plus,
  Receipt,
  Rocket as RocketLaunch,
  Settings as Gear,
  LogIn as SignInIcon,
  Store as Storefront,
  LayoutGrid as SquaresFour,
  User,
  CircleUser as UserCircle,
} from "lucide-react"

import { Link } from "@/i18n/routing"
import { SidebarMenuNavLink } from "./sidebar-menu-nav-link"

interface UserListingStats {
  activeListings: number
  boostedListings: number
}

interface SidebarMenuBodyProps {
  isLoggedIn: boolean
  userStats?: UserListingStats
  onCloseMenu: () => void
  tSidebar: (key: string) => string
  tNavigation: (key: string) => string
  tAccountDrawer: (key: string) => string
  tNavUser: (key: string) => string
  tMenu: (key: string) => string
}

export function SidebarMenuBody({
  isLoggedIn,
  userStats,
  onCloseMenu,
  tSidebar,
  tNavigation,
  tAccountDrawer,
  tNavUser,
  tMenu,
}: SidebarMenuBodyProps) {
  if (!isLoggedIn) {
    return (
      <section className="px-3 py-4">
        <div className="text-center py-8">
          <UserCircle size={48} className="mx-auto text-muted-foreground mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">
            {tAccountDrawer("signInPrompt")}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{tMenu("signInBenefits")}</p>
          <div className="flex items-center gap-2 justify-center">
            <Link
              href="/auth/login"
              onClick={onCloseMenu}
              className="flex min-h-(--control-default) items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <SignInIcon size={18} />
              <span>{tSidebar("signIn")}</span>
            </Link>
            <Link
              href="/auth/sign-up"
              onClick={onCloseMenu}
              className="flex min-h-(--control-default) items-center justify-center rounded-full border border-selected-border px-6 text-sm font-medium text-primary tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:border-hover-border hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              {tNavigation("register")}
            </Link>
          </div>
        </div>

        <div className="mt-3 border-t border-border-subtle pt-3">
          <SidebarMenuNavLink
            href="/categories"
            icon={SquaresFour}
            label={tMenu("browseCategories")}
            onClick={onCloseMenu}
          />
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="border-b border-border-subtle px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {tAccountDrawer("myListings")}
          </h3>
        </div>
        <Link
          href="/sell"
          onClick={onCloseMenu}
          className="mb-2 flex h-touch w-full items-center justify-center gap-1.5 rounded-lg bg-primary font-semibold text-primary-foreground tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          <Plus size={18} />
          <span className="text-sm">{tMenu("newListing")}</span>
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/account/selling"
            onClick={onCloseMenu}
            className="flex h-touch items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-subtle tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:border-hover-border hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <Package size={18} className="text-primary" />
            <span className="text-sm font-semibold tabular-nums">{userStats?.activeListings ?? 0}</span>
            <span className="text-xs text-muted-foreground">{tMenu("active")}</span>
          </Link>
          <Link
            href="/account/selling"
            onClick={onCloseMenu}
            className="flex h-touch items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-subtle tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:border-hover-border hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <RocketLaunch size={18} className="text-primary" />
            <span className="text-sm font-semibold tabular-nums">{userStats?.boostedListings ?? 0}</span>
            <span className="text-xs text-muted-foreground">{tMenu("boosted")}</span>
          </Link>
        </div>
      </section>

      <section className="px-4 py-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          {tMenu("activity")}
        </h3>
        <nav className="-mx-4">
          <SidebarMenuNavLink href="/account/orders" icon={Receipt} label={tAccountDrawer("orders")} onClick={onCloseMenu} />
          <SidebarMenuNavLink href="/account/sales" icon={ChartLineUp} label={tMenu("sales")} onClick={onCloseMenu} />
          <SidebarMenuNavLink href="/wishlist" icon={Heart} label={tNavigation("wishlist")} onClick={onCloseMenu} />
          <SidebarMenuNavLink href="/chat" icon={ChatCircleText} label={tSidebar("messages")} onClick={onCloseMenu} />
          <SidebarMenuNavLink
            href="/account/notifications"
            icon={Bell}
            label={tNavUser("notifications")}
            onClick={onCloseMenu}
          />
        </nav>
      </section>

      <section className="border-t border-border-subtle px-4 py-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          {tAccountDrawer("title")}
        </h3>
        <nav className="-mx-4">
          <SidebarMenuNavLink href="/account/profile" icon={User} label={tMenu("profile")} onClick={onCloseMenu} />
          <SidebarMenuNavLink href="/account/selling" icon={Storefront} label={tMenu("myStore")} onClick={onCloseMenu} />
          <SidebarMenuNavLink href="/account/addresses" icon={MapPin} label={tMenu("addresses")} onClick={onCloseMenu} />
          <SidebarMenuNavLink href="/account/payments" icon={CreditCard} label={tMenu("payments")} onClick={onCloseMenu} />
          <SidebarMenuNavLink href="/account/settings" icon={Gear} label={tAccountDrawer("settings")} onClick={onCloseMenu} />
        </nav>
      </section>

      <section className="border-t border-border-subtle px-4 py-3">
        <nav className="-mx-4">
          <SidebarMenuNavLink
            href="/categories"
            icon={SquaresFour}
            label={tMenu("browseCategories")}
            onClick={onCloseMenu}
          />
          <SidebarMenuNavLink
            href="/customer-service"
            icon={Lifebuoy}
            label={tSidebar("customerService")}
            onClick={onCloseMenu}
          />
        </nav>
      </section>
    </>
  )
}
