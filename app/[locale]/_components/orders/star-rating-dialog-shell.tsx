"use client"

import { StarRatingDialog } from "./star-rating-dialog"

export type StarRatingDialogCopy = {
  ratingTitle: string
  ratingDescription: string
  commentLabel: string
  commentPlaceholder: string
  submitRating: string
  cancel: string
}

export function StarRatingDialogShell({
  open,
  onOpenChange,
  onSubmit,
  copy,
  locale,
  isLoading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (rating: number, comment: string) => Promise<void>
  copy: StarRatingDialogCopy
  locale?: string
  isLoading?: boolean
}) {
  return (
    <StarRatingDialog
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      title={copy.ratingTitle}
      description={copy.ratingDescription}
      commentLabel={copy.commentLabel}
      commentPlaceholder={copy.commentPlaceholder}
      submitLabel={copy.submitRating}
      cancelLabel={copy.cancel}
      locale={locale ?? "en"}
      isLoading={isLoading ?? false}
    />
  )
}
