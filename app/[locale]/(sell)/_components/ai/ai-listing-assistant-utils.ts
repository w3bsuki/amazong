import type { Category } from "../../_lib/types";

export type SuggestionResponse = {
  title: string | null;
  description: string | null;
  condition:
    | "new-with-tags"
    | "new-without-tags"
    | "used-like-new"
    | "used-excellent"
    | "used-good"
    | "used-fair"
    | null;
  category:
    | {
        slug: string | null;
        name: string | null;
        rationale: string | null;
      }
    | null;
  price: {
    suggested: number | null;
    low: number | null;
    high: number | null;
    currency: "BGN" | "EUR" | "USD" | null;
    rationale: string | null;
  };
  attributes: Array<{ name: string; value: string; rationale: string | null }>;
  tags: string[];
  questions: string[];
  warnings: string[];
};

export type FlatCategory = {
  id: string;
  slug: string;
  name: string;
  name_bg?: string | null;
  path: Array<{ id: string; name: string; slug: string }>;
};

export const EMPTY_IMAGES: Array<{ url: string }> = [];

export function flattenCategories(categories: Category[], locale: string): FlatCategory[] {
  const out: FlatCategory[] = [];

  function walk(node: Category, path: FlatCategory["path"]) {
    const name = locale === "bg" && node.name_bg ? node.name_bg : node.name;
    const nextPath = [...path, { id: node.id, name, slug: node.slug }];
    out.push({ id: node.id, slug: node.slug, name: node.name, name_bg: node.name_bg ?? null, path: nextPath });

    for (const child of node.children ?? []) {
      walk(child, nextPath);
    }
  }

  for (const c of categories) walk(c, []);
  return out;
}

export function scoreCategoryMatch(target: string, cat: FlatCategory): number {
  const t = target.trim().toLowerCase();
  if (!t) return 0;

  const slug = cat.slug.toLowerCase();
  const nameEn = cat.name.toLowerCase();
  const nameBg = (cat.name_bg ?? "").toLowerCase();

  if (t === slug) return 100;
  if (t === nameEn || (nameBg && t === nameBg)) return 90;

  const hay = `${slug} ${nameEn} ${nameBg} ${cat.path.map((p) => p.name.toLowerCase()).join(" ")}`;
  if (hay.includes(t)) return 70;

  const tokens = t.split(/\s+|>|/).filter(Boolean);
  if (tokens.length === 0) return 0;
  const hits = tokens.filter((tok) => tok.length >= 3 && hay.includes(tok)).length;
  return Math.min(60, hits * 10);
}
