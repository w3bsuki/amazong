import type React from "react"
import { Eye, EyeOff as EyeSlash, LoaderCircle as SpinnerGap } from "lucide-react"

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

import type { PasswordStrength, SecurityCopy } from "./security-content.copy"

type PasswordState = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function SecurityChangePasswordDialog({
  copy,
  tAuth,
  open,
  onOpenChange,
  isLoading,
  showNewPassword,
  setShowNewPassword,
  passwordData,
  setPasswordData,
  passwordStrength,
  passwordErrors,
  isPasswordValid,
  onSubmit,
}: {
  copy: SecurityCopy
  tAuth: (key: string) => string
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading: boolean
  showNewPassword: boolean
  setShowNewPassword: React.Dispatch<React.SetStateAction<boolean>>
  passwordData: PasswordState
  setPasswordData: React.Dispatch<React.SetStateAction<PasswordState>>
  passwordStrength: PasswordStrength | null
  passwordErrors: string[]
  isPasswordValid: boolean
  onSubmit: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.changePasswordTitle}</DialogTitle>
          <DialogDescription>{copy.changePasswordDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="security-new-password">{copy.newPasswordLabel}</Label>
            <div className="relative">
              <Input
                id="security-new-password"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                placeholder="••••••••"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? copy.hidePassword : copy.showPassword}
              >
                {showNewPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            {passwordStrength && (
              <div className="space-y-1">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full bg-current ${passwordStrength.color} ${passwordStrength.width} transition-all`} />
                </div>
                <p className={`text-xs ${passwordStrength.color}`}>{passwordStrength.label}</p>
              </div>
            )}
            {passwordErrors.length > 0 && (
              <ul className="text-xs text-destructive space-y-0.5 mt-1">
                {passwordErrors.map((error, i) => (
                  <li key={i}>• {tAuth(error)}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="security-confirm-password">{copy.confirmPasswordLabel}</Label>
            <Input
              id="security-confirm-password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="••••••••"
            />
            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="text-xs text-destructive">{tAuth("passwordsDoNotMatch")}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {copy.cancel}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading || passwordData.newPassword !== passwordData.confirmPassword || !isPasswordValid}
          >
            {isLoading && <SpinnerGap className="size-4 mr-2 animate-spin" />}
            {copy.changePasswordButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
