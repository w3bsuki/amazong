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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{locale === "bg" ? "Промяна на имейл" : "Change Email"}</DialogTitle>
          <DialogDescription>
            {locale === "bg"
              ? "Ще получите имейл за потвърждение на новия адрес"
              : "You will receive a confirmation email at the new address"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Field>
            <FieldContent>
              <FieldLabel htmlFor="newEmail">{locale === "bg" ? "Нов имейл" : "New Email"}</FieldLabel>
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
            {locale === "bg" ? "Отказ" : "Cancel"}
          </Button>
          <Button onClick={onSubmit} disabled={isPending || !emailData.newEmail}>
            {isPending ? <SpinnerGap className="size-4 mr-2 animate-spin" /> : null}
            {locale === "bg" ? "Промени" : "Change"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
