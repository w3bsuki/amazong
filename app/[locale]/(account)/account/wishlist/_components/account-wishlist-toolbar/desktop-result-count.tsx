export function DesktopResultCount({
  locale,
  filteredCount,
  totalItems,
  itemsLabel,
}: {
  locale: string
  filteredCount: number
  totalItems: number
  itemsLabel: string
}) {
  return (
    <div className="hidden sm:flex items-center text-sm text-muted-foreground">
      {locale === "bg"
        ? `Показани ${filteredCount} от ${totalItems} артикула`
        : `Showing ${filteredCount} of ${totalItems} ${itemsLabel}`}
    </div>
  )
}
