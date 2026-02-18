import { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/shared/field"
import { Eye, EyeOff as EyeSlash, LoaderCircle as SpinnerGap } from "lucide-react"
import type { PasswordDataState, PasswordStrength } from "./profile-account.types"

interface ProfilePasswordDialogProps {
  locale: string
  open: boolean
  onOpenChange: (open: boolean) => void
  passwordData: PasswordDataState
  setPasswordData: Dispatch<SetStateAction<PasswordDataState>>
  showNewPassword: boolean
  setShowNewPassword: Dispatch<SetStateAction<boolean>>
  passwordStrength: PasswordStrength | null
  isPasswordValid: boolean
  isPending: boolean
  onSubmit: () => void
}

export function ProfilePasswordDialog({
  locale,
  open,
  onOpenChange,
  passwordData,
  setPasswordData,
  showNewPassword,
  setShowNewPassword,
  passwordStrength,
  isPasswordValid,
  isPending,
  onSubmit,
}: ProfilePasswordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{locale === "bg" ? "Промяна на парола" : "Change Password"}</DialogTitle>
          <DialogDescription>
            {locale === "bg" ? "Въведете текущата и новата парола" : "Enter your current and new password"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Field>
            <FieldContent>
              <FieldLabel htmlFor="currentPassword">{locale === "bg" ? "Текуща парола" : "Current Password"}</FieldLabel>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(event) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: event.target.value,
                  }))
                }
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldContent>
              <FieldLabel htmlFor="newPassword">{locale === "bg" ? "Нова парола" : "New Password"}</FieldLabel>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(event) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: event.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  aria-label={
                    showNewPassword
                      ? locale === "bg"
                        ? "Скрий паролата"
                        : "Hide password"
                      : locale === "bg"
                        ? "Покажи паролата"
                        : "Show password"
                  }
                >
                  {showNewPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordStrength && (
                <div className="space-y-1">
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{passwordStrength.label}</p>
                </div>
              )}
            </FieldContent>
          </Field>
          <Field
            data-invalid={
              !!passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
            }
          >
            <FieldContent>
              <FieldLabel htmlFor="confirmPassword">
                {locale === "bg" ? "Потвърди паролата" : "Confirm Password"}
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(event) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: event.target.value,
                  }))
                }
              />
              <FieldError className="text-xs">
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                  ? locale === "bg"
                    ? "Паролите не съвпадат"
                    : "Passwords do not match"
                  : null}
              </FieldError>
            </FieldContent>
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {locale === "bg" ? "Отказ" : "Cancel"}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isPending || !isPasswordValid || passwordData.newPassword !== passwordData.confirmPassword}
          >
            {isPending ? <SpinnerGap className="size-4 mr-2 animate-spin" /> : null}
            {locale === "bg" ? "Промени" : "Change"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
