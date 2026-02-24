import type React from "react"
import { LoaderCircle as SpinnerGap } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { SecurityCopy } from "./security-content.copy"

type EmailState = {
  newEmail: string
}

export function SecurityChangeEmailDialog({
  copy,
  userEmail,
  open,
  onOpenChange,
  isLoading,
  emailData,
  setEmailData,
  isEmailValid,
  onSubmit,
}: {
  copy: SecurityCopy
  userEmail: string
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading: boolean
  emailData: EmailState
  setEmailData: React.Dispatch<React.SetStateAction<EmailState>>
  isEmailValid: boolean
  onSubmit: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.changeEmailTitle}</DialogTitle>
          <DialogDescription>{copy.changeEmailDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="security-current-email">{copy.currentEmailLabel}</Label>
            <Input id="security-current-email" value={userEmail} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="security-new-email">{copy.newEmailLabel}</Label>
            <Input
              id="security-new-email"
              type="email"
              value={emailData.newEmail}
              onChange={(e) => setEmailData((prev) => ({ ...prev, newEmail: e.target.value }))}
              placeholder="new@example.com"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {copy.cancel}
          </Button>
          <Button onClick={onSubmit} disabled={isLoading || !isEmailValid}>
            {isLoading && <SpinnerGap className="size-4 mr-2 animate-spin" />}
            {copy.changeEmailButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
