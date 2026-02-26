"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { Flag, LoaderCircle as SpinnerGap } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

import { reportListing, type ListingReportReason } from "../_actions/report-listing"

export function ReportListingDialog({
  productId,
  open,
  onOpenChange,
}: {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const tProduct = useTranslations("Product")
  const tCommon = useTranslations("Common")

  const reasons = useMemo<Array<{ value: ListingReportReason; label: string }>>(
    () => [
      { value: "scam", label: tProduct("report.reasons.scam") },
      { value: "harassment", label: tProduct("report.reasons.harassment") },
      { value: "spam", label: tProduct("report.reasons.spam") },
      { value: "inappropriate", label: tProduct("report.reasons.inappropriate") },
      { value: "other", label: tProduct("report.reasons.other") },
    ],
    [tProduct]
  )

  const [reason, setReason] = useState<ListingReportReason>("scam")
  const [details, setDetails] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (open) return
    setReason("scam")
    setDetails("")
  }, [open])

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await reportListing({
        productId,
        reason,
        ...(details.trim() ? { details: details.trim() } : {}),
      })

      if (!result.success) {
        if (result.code === "auth_required") {
          toast.error(tProduct("report.toasts.authRequired"))
          return
        }

        toast.error(tProduct("report.toasts.failed"))
        return
      }

      toast.success(tProduct("report.toasts.submitted"))
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="size-4 text-muted-foreground" aria-hidden="true" />
            {tProduct("report.title")}
          </DialogTitle>
          <DialogDescription>{tProduct("report.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">{tProduct("report.reasonLabel")}</Label>
            <RadioGroup value={reason} onValueChange={(next) => setReason(next as ListingReportReason)}>
              <div className="space-y-2">
                {reasons.map((entry) => (
                  <Label
                    key={entry.value}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border-subtle bg-background px-3 py-2.5 text-sm transition-colors hover:bg-hover active:bg-active"
                  >
                    <RadioGroupItem value={entry.value} className="mt-0.5" />
                    <span className="min-w-0">{entry.label}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-details" className="text-sm font-medium">
              {tProduct("report.detailsLabel")}
            </Label>
            <Textarea
              id="report-details"
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder={tProduct("report.detailsPlaceholder")}
              className="min-h-24 resize-none"
              maxLength={1000}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <SpinnerGap className="mr-2 size-4 animate-spin" />
                {tCommon("saving")}
              </>
            ) : (
              tProduct("report.submit")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

