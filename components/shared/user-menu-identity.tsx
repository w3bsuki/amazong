import type { ReactNode } from "react"

import { UserAvatar } from "@/components/shared/user-avatar"

export interface UserMenuIdentityProps {
  avatarName: string
  avatarUrl: string | null
  avatarClassName?: string
  avatarFallbackClassName?: string
  primaryText: ReactNode
  secondaryText: ReactNode
}

export function UserMenuIdentity({
  avatarName,
  avatarUrl,
  avatarClassName,
  avatarFallbackClassName,
  primaryText,
  secondaryText,
}: UserMenuIdentityProps) {
  return (
    <>
      <UserAvatar
        name={avatarName}
        avatarUrl={avatarUrl}
        className={avatarClassName ?? "size-8 rounded-lg"}
        fallbackClassName={avatarFallbackClassName ?? "rounded-lg"}
      />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{primaryText}</span>
        <span className="text-muted-foreground truncate text-xs">{secondaryText}</span>
      </div>
    </>
  )
}

