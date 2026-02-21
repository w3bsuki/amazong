"use client"

import { LogOut as LogOutIcon } from "lucide-react"

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
import { cn } from "@/lib/utils"

export function MobileAccountSignOutRow({
  label,
  dialogTitle,
  dialogDescription,
  cancelLabel,
  confirmLabel,
  rowClassName,
}: {
  label: string
  dialogTitle: string
  dialogDescription: string
  cancelLabel: string
  confirmLabel: string
  rowClassName: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button" className={rowClassName}>
          <LogOutIcon className="size-5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <form action="/api/auth/sign-out" method="post" className="contents">
            <AlertDialogAction
              type="submit"
              className={cn(
                "bg-destructive text-destructive-foreground hover:bg-destructive",
                "focus-visible:ring-destructive",
              )}
            >
              {confirmLabel}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

