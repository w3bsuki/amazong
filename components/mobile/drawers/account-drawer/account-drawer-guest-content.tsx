import { User } from "lucide-react"

import { DrawerBody } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

import { MENU_GROUP_CLASS } from "./account-drawer.styles"

interface AccountDrawerGuestContentProps {
  signInPrompt: string
  signInDescription: string
  signInLabel: string
  createAccountLabel: string
  onSignIn: () => void
  onSignUp: () => void
}

export function AccountDrawerGuestContent({
  signInPrompt,
  signInDescription,
  signInLabel,
  createAccountLabel,
  onSignIn,
  onSignUp,
}: AccountDrawerGuestContentProps) {
  return (
    <DrawerBody className="px-inset py-4 pb-safe-max">
      <div className={MENU_GROUP_CLASS}>
        <div className="flex flex-col items-center px-5 py-6 text-center">
          <div className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <User size={24} />
          </div>
          <p className="text-sm font-semibold text-foreground">{signInPrompt}</p>
          <p className="mt-1 text-xs text-muted-foreground">{signInDescription}</p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <Button size="lg" className="w-full" onClick={onSignIn}>
          {signInLabel}
        </Button>
        <Button variant="outline" size="default" className="w-full" onClick={onSignUp}>
          {createAccountLabel}
        </Button>
      </div>
    </DrawerBody>
  )
}

