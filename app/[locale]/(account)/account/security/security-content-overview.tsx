import { CircleCheck as CheckCircle, Key, Shield, Smartphone as DeviceMobile, Mail as Envelope } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { SecurityCopy } from "./security-content.copy"

export function SecurityContentOverview({
  copy,
  userEmail,
  onOpenEmail,
  onOpenPassword,
}: {
  copy: SecurityCopy
  userEmail: string
  onOpenEmail: () => void
  onOpenPassword: () => void
}) {
  return (
    <>
      <div className="rounded-lg border bg-card divide-y">
        <button
          type="button"
          onClick={onOpenEmail}
          className="w-full rounded-lg flex items-center gap-3 p-3 text-left active:bg-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Envelope className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{copy.emailLabel}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-success">
            <CheckCircle className="size-3.5" />
            <span className="hidden sm:inline">{copy.verified}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenPassword}
          className="w-full rounded-lg flex items-center gap-3 p-3 text-left active:bg-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Key className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{copy.passwordLabel}</p>
            <p className="text-xs text-muted-foreground">••••••••</p>
          </div>
          <span className="text-xs text-muted-foreground">{copy.change}</span>
        </button>

        <div className="flex items-center gap-3 p-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <DeviceMobile className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{copy.twoFactorLabel}</p>
            <p className="text-xs text-muted-foreground">{copy.twoFactorStatus}</p>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs" disabled>
            {copy.soon}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-surface-subtle p-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="size-4 text-primary" />
          <span className="text-sm font-medium">{copy.tips}</span>
        </div>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle className="size-3 text-success mt-0.5 shrink-0" />
            {copy.uniquePasswordTip}
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="size-3 text-success mt-0.5 shrink-0" />
            {copy.neverSharePasswordTip}
          </li>
        </ul>
      </div>
    </>
  )
}
