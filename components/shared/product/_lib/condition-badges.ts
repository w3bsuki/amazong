export type ConditionBadgeVariant =
  | "condition-new"
  | "condition-likenew"
  | "condition-good"
  | "condition-fair"
  | "condition-used"
  | "condition-refurb"
  | "condition"

export function getConditionBadgeVariant(condition: string | null | undefined): ConditionBadgeVariant {
  if (!condition) return "condition"
  const normalized = condition.toLowerCase().replace(/[\s_-]/g, "")
  switch (normalized) {
    case "new":
    case "newwithtags":
      return "condition-new"
    case "likenew":
    case "usedexcellent":
      return "condition-likenew"
    case "good":
    case "usedgood":
      return "condition-good"
    case "fair":
    case "usedfair":
      return "condition-fair"
    case "used":
      return "condition-used"
    case "refurbished":
    case "refurb":
      return "condition-refurb"
    default:
      return "condition"
  }
}
