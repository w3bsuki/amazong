import { NextResponse } from "next/server";
import { createStaticClient } from "@/lib/supabase/server";
import { cacheLife, cacheTag } from "next/cache";

interface CategoryNode {
  id: string;
  name: string;
  name_bg: string | null;
  slug: string;
  parent_id: string | null;
  display_order: number | null;
  icon: string | null;
  children: CategoryNode[];
}

interface RawCategory {
  id: string;
  name: string;
  name_bg: string | null;
  slug: string;
  parent_id: string | null;
  display_order: number | null;
  icon: string | null;
}

function buildCategoryTree(categories: RawCategory[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();

  for (const cat of categories) {
    categoryMap.set(cat.id, {
      ...cat,
      children: [],
    });
  }

  const roots: CategoryNode[] = [];

  for (const cat of categories) {
    const node = categoryMap.get(cat.id);
    if (!node) continue;

    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      categoryMap.get(cat.parent_id)?.children.push(node);
    } else if (!cat.parent_id) {
      roots.push(node);
    }
  }

  const sortChildren = (nodes: CategoryNode[]) => {
    nodes.sort((a, b) => {
      const orderA = a.display_order ?? 999;
      const orderB = b.display_order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });

    for (const node of nodes) {
      if (node.children.length > 0) {
        sortChildren(node.children);
      }
    }
  };

  sortChildren(roots);
  return roots;
}

async function getSellTree(): Promise<CategoryNode[]> {
  "use cache";
  cacheTag("categories:sell", "categories:sell:depth:3");
  cacheLife("categories");

  const supabase = createStaticClient();
  if (!supabase) return [];

  const { data: rootCats, error: rootError } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, parent_id, display_order, icon")
    .is("parent_id", null)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true });

  if (rootError || !rootCats || rootCats.length === 0) return [];

  const rootIds = rootCats.map((c) => c.id);
  const { data: l1Cats } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, parent_id, display_order, icon")
    .in("parent_id", rootIds)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true });

  let l2Cats: RawCategory[] = [];
  if (l1Cats && l1Cats.length > 0) {
    const l1Ids = l1Cats.map((c) => c.id);
    const batchSize = 100;
    for (let i = 0; i < l1Ids.length; i += batchSize) {
      const batchIds = l1Ids.slice(i, i + batchSize);
      const { data: l2Data } = await supabase
        .from("categories")
        .select("id, name, name_bg, slug, parent_id, display_order, icon")
        .in("parent_id", batchIds)
        .lt("display_order", 9000)
        .order("display_order", { ascending: true });
      if (l2Data) l2Cats = [...l2Cats, ...l2Data];
    }
  }

  let l3Cats: RawCategory[] = [];
  if (l2Cats.length > 0) {
    const l2Ids = l2Cats.map((c) => c.id);
    const batchSize = 100;
    for (let i = 0; i < l2Ids.length; i += batchSize) {
      const batchIds = l2Ids.slice(i, i + batchSize);
      const { data: l3Data } = await supabase
        .from("categories")
        .select("id, name, name_bg, slug, parent_id, display_order, icon")
        .in("parent_id", batchIds)
        .lt("display_order", 9000)
        .order("display_order", { ascending: true });
      if (l3Data) l3Cats = [...l3Cats, ...l3Data];
    }
  }

  const all = [...rootCats, ...(l1Cats || []), ...l2Cats, ...l3Cats];
  return buildCategoryTree(all);
}

export async function GET() {
  const categories = await getSellTree();
  return NextResponse.json({ categories });
}
