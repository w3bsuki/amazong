import type { ComponentProps } from "react"
import { Trash } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import type { TranslateFn } from "./selling-products-list.types"

interface SellingProductDeleteDialogProps {
  productId: string
  productTitle: string
  t: TranslateFn
  onDelete: (productId: string) => void
  disabled: boolean
  buttonSize: ComponentProps<typeof Button>["size"]
  triggerAriaLabel?: string | undefined
  showSrOnlyLabel?: boolean | undefined
}

export function SellingProductDeleteDialog({
  productId,
  productTitle,
  t,
  onDelete,
  disabled,
  buttonSize,
  triggerAriaLabel,
  showSrOnlyLabel,
}: SellingProductDeleteDialogProps) {
  const label = triggerAriaLabel ?? t("deleteSrOnly")

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size={buttonSize}
          className="text-destructive hover:bg-destructive-subtle"
          disabled={disabled}
          aria-label={label}
        >
          <Trash className="size-4" aria-hidden="true" />
          {showSrOnlyLabel ? <span className="sr-only">{label}</span> : null}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteDialogTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteDialogDesc", { title: productTitle })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancelButton")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(productId)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive"
          >
            {t("deleteButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

