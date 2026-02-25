"use client"

import {
  CreditCard as IconCreditCard,
  LogOut as IconLogout,
  Bell as IconNotification,
  CircleUser as IconUserCircle,
} from "lucide-react"

import { useTranslations } from "next-intl"

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/layout/sidebar/sidebar"

import { UserMenuDropdown } from "@/components/shared/user-menu-dropdown"
import { UserMenuIdentity } from "@/components/shared/user-menu-identity"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const t = useTranslations("NavUser")

  const displayName = user.name?.trim() || user.email

  return (
    <UserMenuDropdown
      isMobile={isMobile}
      triggerContent={
        <UserMenuIdentity
          avatarName={displayName}
          avatarUrl={user.avatar}
          avatarClassName="size-8 rounded-lg grayscale"
          primaryText={user.name}
          secondaryText={user.email}
        />
      }
      labelContent={
        <UserMenuIdentity
          avatarName={displayName}
          avatarUrl={user.avatar}
          primaryText={user.name}
          secondaryText={user.email}
        />
      }
    >
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <IconUserCircle />
          {t("account")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconCreditCard />
          {t("billing")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconNotification />
          {t("notifications")}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <IconLogout />
        {t("logOut")}
      </DropdownMenuItem>
    </UserMenuDropdown>
  )
}
