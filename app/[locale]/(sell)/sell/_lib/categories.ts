import { createStaticClient } from "@/lib/supabase/server";
import { cacheLife, cacheTag } from "next/cache";

export interface CategoryNode {
  id: string;
  name: string;
  name_bg: string | null;
  slug: string;
  parent_id: string | null;
  display_order: number | null;
  children: CategoryNode[];
}

interface RawCategory {
  id: string;
  name: string;
  name_bg: string | null;
  slug: string;
  parent_id: string | null;
  display_order: number | null;
}

function buildCategoryTree(categories: RawCategory[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();

  for (const cat of categories) {
    categoryMap.set(cat.id, {
      ...cat,
      children: [],
    });
  }

  const rootCategories: CategoryNode[] = [];

  for (const cat of categories) {
    const node = categoryMap.get(cat.id)!;

    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      categoryMap.get(cat.parent_id)!.children.push(node);
    } else if (!cat.parent_id) {
      rootCategories.push(node);
    }
  }

  function sortChildren(nodes: CategoryNode[]): CategoryNode[] {
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
    return nodes;
  }

  return sortChildren(rootCategories);
}

export async function getSellCategories(): Promise<CategoryNode[]> {
  'use cache'
  // Sell flow needs a stable category tree (root + 3 levels) so the selector
  // can navigate without client-side fetching.
  cacheTag('categories', 'sell-categories', 'sell-categories:depth:3')
  cacheLife('categories')

  try {
    const supabase = createStaticClient();
    if (!supabase) return [];

    const { data: rootCats, error: rootError } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, parent_id, display_order")
      .is("parent_id", null)
      .lt("display_order", 9000)
      .order("display_order", { ascending: true });

    if (rootError) {
      console.error("[SellPage] Error fetching root categories:", rootError);
      return [];
    }

    if (!rootCats || rootCats.length === 0) return [];

    const rootIds = rootCats.map((c) => c.id);
    const { data: l1Cats, error: l1Error } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, parent_id, display_order")
      .in("parent_id", rootIds)
      .lt("display_order", 9000)
      .order("display_order", { ascending: true });

    if (l1Error) {
      console.error("[SellPage] Error fetching L1 categories:", l1Error);
    }

    let l2Cats: typeof l1Cats = [];
    if (l1Cats && l1Cats.length > 0) {
      const l1Ids = l1Cats.map((c) => c.id);
      const BATCH_SIZE = 100;

      for (let i = 0; i < l1Ids.length; i += BATCH_SIZE) {
        const batchIds = l1Ids.slice(i, i + BATCH_SIZE);
        const { data: l2Data, error: l2Error } = await supabase
          .from("categories")
          .select("id, name, name_bg, slug, parent_id, display_order")
          .in("parent_id", batchIds)
          .lt("display_order", 9000)
          .order("display_order", { ascending: true });

        if (l2Error) {
          console.error("[SellPage] Error fetching L2 batch:", l2Error);
        } else if (l2Data) {
          l2Cats = [...l2Cats, ...l2Data];
        }
      }
    }

    let l3Cats: typeof l1Cats = [];
    if (l2Cats.length > 0) {
      const l2Ids = l2Cats.map((c) => c.id);
      const BATCH_SIZE = 100;

      for (let i = 0; i < l2Ids.length; i += BATCH_SIZE) {
        const batchIds = l2Ids.slice(i, i + BATCH_SIZE);
        const { data: l3Data, error: l3Error } = await supabase
          .from("categories")
          .select("id, name, name_bg, slug, parent_id, display_order")
          .in("parent_id", batchIds)
          .lt("display_order", 9000)
          .order("display_order", { ascending: true });

        if (l3Error) {
          console.error("[SellPage] Error fetching L3 batch:", l3Error);
        } else if (l3Data) {
          l3Cats = [...l3Cats, ...l3Data];
        }
      }
    }

    const allCategories = [...rootCats, ...(l1Cats || []), ...l2Cats, ...l3Cats];

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[SellPage] Fetched ${allCategories.length} categories (${rootCats.length} root, ${l1Cats?.length || 0} L1, ${l2Cats.length} L2, ${l3Cats.length} L3)`
      );
    }

    return buildCategoryTree(allCategories);
  } catch (error) {
    console.error("[SellPage] Error in getSellCategories:", error);
    return [];
  }
}
