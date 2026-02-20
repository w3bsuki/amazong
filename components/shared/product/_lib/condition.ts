type ConditionBadgeVariant =
  | "condition-new"
  | "condition-likenew"
  | "condition-good"
  | "condition-fair"
  | "condition-used"
  | "condition-refurb"
  | "condition"

export function getConditionBadgeVariant(
  condition: string | null | undefined
): ConditionBadgeVariant {
  if (!condition) return "condition"
  const normalized = condition.toLowerCase().replaceAll(/[\s_-]/g, "")
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

export function getConditionKey(value: string): string | null {
  const normalized = value.toLowerCase().replaceAll(/[\s_-]/g, "")

  switch (normalized) {
    case "new":
    case "novo":
    case "ново":
      return "condition.new"
    case "newwithtags":
      return "condition.newWithTags"
    case "newwithouttags":
      return "condition.newWithoutTags"
    case "likenew":
    case "usedlikenew":
    case "катоново":
      return "condition.likeNew"
    case "usedexcellent":
      return "condition.usedExcellent"
    case "usedgood":
      return "condition.usedGood"
    case "usedfair":
      return "condition.usedFair"
    case "refurbished":
    case "refurb":
    case "рефърбиш":
      return "condition.refurbished"
    case "used":
    case "употребявано":
      return "condition.used"
    case "good":
      return "condition.good"
    case "fair":
      return "condition.fair"
    default:
      return null
  }
}

