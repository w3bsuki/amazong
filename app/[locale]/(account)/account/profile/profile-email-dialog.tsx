import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/shared/field"
import { LoaderCircle as SpinnerGap } from "lucide-react"
import type { EmailDataState } from "./profile-account.types"

interface ProfileEmailDialogProps {
  locale: string
  open: boolean
  onOpenChange: (open: boolean) => void
  emailData: EmailDataState
  setEmailData: (value: EmailDataState) => void
  isPending: boolean
  onSubmit: () => void
}

export function ProfileEmailDialog({
  locale,
  open,
  onOpenChange,
  emailData,
  setEmailData,
  isPending,
  onSubmit,
}: ProfileEmailDialogProps) {
  const t = useTranslations("Account.profileEditor")
  void locale

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("emailDialog.title")}</DialogTitle>
          <DialogDescription>{t("emailDialog.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Field>
            <FieldContent>
              <FieldLabel htmlFor="newEmail">{t("emailDialog.newEmailLabel")}</FieldLabel>
              <Input
                id="newEmail"
                name="newEmail"
                type="email"
                value={emailData.newEmail}
                onChange={(event) => setEmailData({ newEmail: event.target.value })}
                placeholder="new@example.com"
              />
            </FieldContent>
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("actions.cancel")}
          </Button>
          <Button onClick={onSubmit} disabled={isPending || !emailData.newEmail}>
            {isPending ? <SpinnerGap className="size-4 mr-2 animate-spin" /> : null}
            {t("actions.change")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
