export type SpecificTier = "required" | "recommended" | "optional";

export interface CategorySpecificAttribute {
  id?: string;
  name: string;
  is_required?: boolean;
  attribute_type?: "text" | "number" | "select" | "multiselect" | "boolean" | "date";
  options?: string[];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugLooksLike(l0Slug: string | undefined, patterns: readonly string[]): boolean {
  const s = normalize(l0Slug || "");
  if (!s) return false;
  return patterns.some((p) => s.includes(normalize(p)));
}

function nameMatches(name: string, keywords: readonly string[]): boolean {
  const n = normalize(name);
  if (!n) return false;
  return keywords.some((k) => n.includes(normalize(k)));
}

function attrTypeScore(attr: CategorySpecificAttribute): number {
  // Prefer structured fields that improve search/filters and reduce ambiguity
  switch (attr.attribute_type) {
    case "select":
      return 16;
    case "multiselect":
      return 14;
    case "boolean":
      return 10;
    case "number":
      return 10;
    case "date":
      return 8;
    case "text":
    default:
      return 4;
  }
}

function optionCountPenalty(attr: CategorySpecificAttribute): number {
  const count = attr.options?.length ?? 0;
  if (!count) return 0;
  // Huge option lists can still be OK (we use a searchable drawer), but we
  // slightly deprioritize them so smaller, high-signal fields win.
  if (count >= 250) return -6;
  if (count >= 120) return -4;
  if (count >= 60) return -2;
  return 0;
}

type Domain = "automotive" | "electronics" | "fashion" | "generic";

function inferDomain(l0Slug?: string): Domain {
  if (slugLooksLike(l0Slug, DOMAIN_KEYWORDS.automotive.l0SlugPatterns)) return "automotive";
  if (slugLooksLike(l0Slug, DOMAIN_KEYWORDS.electronics.l0SlugPatterns)) return "electronics";
  if (slugLooksLike(l0Slug, DOMAIN_KEYWORDS.fashion.l0SlugPatterns)) return "fashion";
  return "generic";
}

const UNIVERSAL_RECOMMENDED = [
  // Most categories benefit from these
  "brand",
  "make",
  "model",
  "condition",
  "color",
  "colour",
  "size",
  "material",
  "year",
  "dimensions",
  "weight",
] as const;

function scoreAttributeForRecommend(attr: CategorySpecificAttribute, domain: Domain): number {
  const n = normalize(attr.name);
  if (!n) return 0;

  let score = 0;

  // Universal signals
  if (nameMatches(attr.name, UNIVERSAL_RECOMMENDED)) score += 40;

  // Domain signals (strong)
  if (domain === "automotive" && nameMatches(attr.name, DOMAIN_KEYWORDS.automotive.recommended)) score += 60;
  if (domain === "electronics" && nameMatches(attr.name, DOMAIN_KEYWORDS.electronics.recommended)) score += 60;
  if (domain === "fashion" && nameMatches(attr.name, DOMAIN_KEYWORDS.fashion.recommended)) score += 60;

  // Extra fine-grained bonuses (helps pick the *right* car fields first)
  if (domain === "automotive") {
    if (nameMatches(attr.name, ["fuel", "fuel type", "diesel", "petrol", "gasoline", "hybrid", "electric"])) score += 45;
    if (nameMatches(attr.name, ["transmission", "gearbox"])) score += 40;
    if (nameMatches(attr.name, ["mileage", "kilometers", "km", "miles"])) score += 40;
    if (nameMatches(attr.name, ["engine", "engine size", "cc", "hp", "horsepower"])) score += 32;
    if (nameMatches(attr.name, ["body type", "doors", "drivetrain", "awd", "fwd", "rwd"])) score += 22;
    if (nameMatches(attr.name, ["vin"])) score += 18;
  }

  if (domain === "electronics") {
    if (nameMatches(attr.name, ["storage", "capacity"])) score += 40;
    if (nameMatches(attr.name, ["ram", "memory"])) score += 36;
    if (nameMatches(attr.name, ["screen", "display", "size"])) score += 26;
    if (nameMatches(attr.name, ["carrier", "unlocked", "network"])) score += 22;
    if (nameMatches(attr.name, ["battery", "battery health"])) score += 20;
    if (nameMatches(attr.name, ["os", "operating system"])) score += 16;
  }

  if (domain === "fashion") {
    if (nameMatches(attr.name, ["size", "waist", "length", "fit"])) score += 35;
    if (nameMatches(attr.name, ["color", "colour"])) score += 28;
    if (nameMatches(attr.name, ["gender", "men", "women", "unisex"])) score += 22;
    if (nameMatches(attr.name, ["material", "fabric", "leather"])) score += 18;
    if (nameMatches(attr.name, ["style", "pattern"])) score += 14;
  }

  // Structured fields are better for UX + search
  score += attrTypeScore(attr);
  score += optionCountPenalty(attr);

  // Slightly prefer shorter names (usually clearer)
  score += Math.max(0, 12 - n.length / 6);

  return score;
}

const DOMAIN_KEYWORDS = {
  automotive: {
    l0SlugPatterns: ["auto", "automotive", "car", "vehicle", "vehicles", "motors", "motor"],
    recommended: [
      "make",
      "brand",
      "manufacturer",
      "model",
      "year",
      "mileage",
      "km",
      "engine",
      "engine size",
      "fuel",
      "transmission",
      "gearbox",
      "vin",
      "condition",
    ],
  },
  fashion: {
    l0SlugPatterns: ["fashion", "clothing", "apparel", "mens", "men", "womens", "women", "accessories", "shoes"],
    recommended: [
      "size",
      "color",
      "colour",
      "gender",
      "brand",
      "material",
      "fit",
      "style",
      "condition",
    ],
  },
  electronics: {
    l0SlugPatterns: ["electronics", "computer", "computers", "laptop", "phone", "mobile", "tablet", "camera", "gaming"],
    recommended: [
      "brand",
      "model",
      "storage",
      "capacity",
      "ram",
      "memory",
      "processor",
      "cpu",
      "screen",
      "display",
      "os",
      "operating system",
      "condition",
    ],
  },
} as const;

export function splitSpecificsByTier<T extends CategorySpecificAttribute>(args: {
  l0Slug?: string;
  attributes: T[];
  maxRecommended?: number;
}): {
  required: T[];
  recommended: T[];
  optional: T[];
} {
  const { l0Slug, attributes, maxRecommended = 6 } = args;

  const required = attributes.filter((a) => Boolean(a.is_required));
  const nonRequired = attributes.filter((a) => !a.is_required);

  const domain = inferDomain(l0Slug);

  // Score all non-required fields; then take the best N as recommended.
  const scored = nonRequired
    .map((a) => ({ a, score: scoreAttributeForRecommend(a, domain) }))
    .filter((x) => x.score > 0)
    .sort((x, y) => {
      if (y.score !== x.score) return y.score - x.score;
      return normalize(x.a.name).localeCompare(normalize(y.a.name));
    });

  const max = Math.max(0, maxRecommended);
  const recommended = scored.slice(0, max).map((x) => x.a);
  const recommendedIds = new Set(recommended.map((a) => `${a.id ?? ""}::${normalize(a.name)}`));

  const optional = nonRequired.filter((a) => !recommendedIds.has(`${a.id ?? ""}::${normalize(a.name)}`));
  return { required, recommended, optional };
}
