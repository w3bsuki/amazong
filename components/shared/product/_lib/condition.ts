export function getConditionKey(value: string): string | null {
  const normalized = value.toLowerCase().replace(/[\s_-]/g, "")

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

