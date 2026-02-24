
import { useState, type TransitionStartFunction } from "react"
import { toast } from "sonner"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useRouter } from "@/i18n/routing"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { BuyerOrderActionsCopy, IssueType } from "../buyer-order-actions.copy"
import type { BuyerOrderActionsServerActions } from "../buyer-order-actions.types"

type DisputeActionProps = {
  canRender: boolean
  isSubmitting: boolean
  orderItemId: string
  reportOrderIssue: BuyerOrderActionsServerActions["reportOrderIssue"]
  startTransition: TransitionStartFunction
  copy: BuyerOrderActionsCopy
}

export function DisputeAction({
  canRender,
  isSubmitting,
  orderItemId,
  reportOrderIssue,
  startTransition,
  copy,
}: DisputeActionProps) {
  const router = useRouter()
  const [showIssueDialog, setShowIssueDialog] = useState(false)
  const [issueType, setIssueType] = useState<IssueType | "">("")
  const [issueDescription, setIssueDescription] = useState("")

  if (!canRender) return null

  const handleReportIssue = () => {
    if (!issueType) {
      toast.error(copy.errors.issueTypeRequired)
      return
    }
    if (issueDescription.length < 10) {
      toast.error(copy.errors.issueDescriptionMinLength)
      return
    }

    startTransition(async () => {
      try {
        const result = await reportOrderIssue(orderItemId, issueType, issueDescription)
        if (result.success) {
          toast.success(copy.toasts.issueReported)
          setShowIssueDialog(false)
          setIssueType("")
          setIssueDescription("")
          if (result.conversationId) {
            router.push(`/chat/${result.conversationId}`)
          } else {
            router.refresh()
          }
        } else {
          toast.error(copy.errors.failedToReportIssue)
        }
      } catch {
        toast.error(copy.errors.unexpected)
      }
    })
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowIssueDialog(true)}
        disabled={isSubmitting}
        className="text-status-warning hover:bg-status-warning/10"
      >
        <AlertTriangle className="h-4 w-4 mr-1.5" />
        {copy.reportIssue}
      </Button>

      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-status-warning">
              <AlertTriangle className="h-5 w-5" />
              {copy.issueTitle}
            </DialogTitle>
            <DialogDescription>{copy.issueDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="issueType">{copy.issueTypeLabel}</Label>
              <Select value={issueType} onValueChange={(value) => setIssueType(value as IssueType)}>
                <SelectTrigger>
                  <SelectValue placeholder={copy.issueTypePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(copy.issueTypes) as IssueType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {copy.issueTypes[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDesc">{copy.issueDescLabel}</Label>
              <Textarea
                id="issueDesc"
                placeholder={copy.issueDescPlaceholder}
                value={issueDescription}
                onChange={(event) => setIssueDescription(event.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIssueDialog(false)} disabled={isSubmitting}>
              {copy.cancel}
            </Button>
            <Button
              onClick={handleReportIssue}
              disabled={isSubmitting || !issueType || issueDescription.length < 10}
              className="bg-status-warning text-badge-fg-on-solid hover:brightness-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  {copy.submitting}
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  {copy.submitIssue}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
