import { LogOut as LogOutIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { MENU_GROUP_CLASS, MENU_ROW_CLASS } from "./account-drawer.styles"

interface AccountDrawerSignOutSectionProps {
  signOutLabel: string
  isSigningOut: boolean
  onSubmit: () => void
}

export function AccountDrawerSignOutSection({
  signOutLabel,
  isSigningOut,
  onSubmit,
}: AccountDrawerSignOutSectionProps) {
  return (
    <div className={MENU_GROUP_CLASS}>
      <form action="/api/auth/sign-out" method="post" onSubmit={onSubmit}>
        <button
          type="submit"
          disabled={isSigningOut}
          className={cn(
            MENU_ROW_CLASS,
            "text-destructive",
            isSigningOut && "pointer-events-none opacity-50",
          )}
        >
          <LogOutIcon size={20} className="shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {signOutLabel}
          </span>
        </button>
      </form>
    </div>
  )
}

