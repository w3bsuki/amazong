import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SellPageClient } from "./client";

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Category type for nesting
interface CategoryNode {
  id: string;
  name: string;
  name_bg: string | null;
  slug: string;
  parent_id: string | null;
  display_order: number | null;
  children: CategoryNode[];
}

// Fetch FULL category hierarchy (all levels) for the sell form
// Uses level-by-level fetching to avoid pagination limits
async function getCategories(): Promise<CategoryNode[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];
    
    // Fetch L0 (root) categories
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

    // Fetch L1 categories (children of root)
    const rootIds = rootCats.map(c => c.id);
    const { data: l1Cats, error: l1Error } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, parent_id, display_order")
      .in("parent_id", rootIds)
      .lt("display_order", 9000)
      .order("display_order", { ascending: true });

    if (l1Error) {
      console.error("[SellPage] Error fetching L1 categories:", l1Error);
    }

    // Fetch L2 categories (grandchildren) - may need batching for large sets
    let l2Cats: typeof l1Cats = [];
    if (l1Cats && l1Cats.length > 0) {
      const l1Ids = l1Cats.map(c => c.id);
      // Batch L1 IDs to avoid query limits (max ~300 per IN clause)
      const batchSize = 250;
      for (let i = 0; i < l1Ids.length; i += batchSize) {
        const batch = l1Ids.slice(i, i + batchSize);
        const { data: l2Data, error: l2Error } = await supabase
          .from("categories")
          .select("id, name, name_bg, slug, parent_id, display_order")
          .in("parent_id", batch)
          .lt("display_order", 9000)
          .order("display_order", { ascending: true });

        if (l2Error) {
          console.error("[SellPage] Error fetching L2 categories batch:", l2Error);
        } else if (l2Data) {
          l2Cats = [...l2Cats, ...l2Data];
        }
      }
    }

    // Fetch L3 categories (great-grandchildren - actual product types like T-Shirts, Hats)
    let l3Cats: typeof l1Cats = [];
    if (l2Cats && l2Cats.length > 0) {
      const l2Ids = l2Cats.map(c => c.id);
      // Batch L2 IDs to avoid query limits
      const batchSize = 250;
      for (let i = 0; i < l2Ids.length; i += batchSize) {
        const batch = l2Ids.slice(i, i + batchSize);
        const { data: l3Data, error: l3Error } = await supabase
          .from("categories")
          .select("id, name, name_bg, slug, parent_id, display_order")
          .in("parent_id", batch)
          .lt("display_order", 9000)
          .order("display_order", { ascending: true });

        if (l3Error) {
          console.error("[SellPage] Error fetching L3 categories batch:", l3Error);
        } else if (l3Data) {
          l3Cats = [...l3Cats, ...l3Data];
        }
      }
    }

    // Fetch L4 categories (deepest level - 647 leaf categories)
    let l4Cats: typeof l1Cats = [];
    if (l3Cats && l3Cats.length > 0) {
      const l3Ids = l3Cats.map(c => c.id);
      const batchSize = 250;
      for (let i = 0; i < l3Ids.length; i += batchSize) {
        const batch = l3Ids.slice(i, i + batchSize);
        const { data: l4Data, error: l4Error } = await supabase
          .from("categories")
          .select("id, name, name_bg, slug, parent_id, display_order")
          .in("parent_id", batch)
          .lt("display_order", 9000)
          .order("display_order", { ascending: true });

        if (l4Error) {
          console.error("[SellPage] Error fetching L4 categories batch:", l4Error);
        } else if (l4Data) {
          l4Cats = [...l4Cats, ...l4Data];
        }
      }
    }

    // Combine all categories (L0-L4)
    const allCategories = [...rootCats, ...(l1Cats || []), ...l2Cats, ...l3Cats, ...l4Cats];

    // Build a map for quick lookup
    const categoryMap = new Map<string, CategoryNode>();
    
    // First pass: create all nodes
    for (const cat of allCategories) {
      categoryMap.set(cat.id, {
        ...cat,
        children: []
      });
    }
    
    // Second pass: build tree structure
    const rootCategories: CategoryNode[] = [];
    
    for (const cat of allCategories) {
      const node = categoryMap.get(cat.id)!;
      
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        categoryMap.get(cat.parent_id)!.children.push(node);
      } else if (!cat.parent_id) {
        rootCategories.push(node);
      }
    }
    
    // Sort children recursively by display_order
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
    
    const result = sortChildren(rootCategories);
    return result;
  } catch (error) {
    console.error("[SellPage] Error fetching categories:", error);
    return [];
  }
}

// Check if user is a seller
async function getSellerData(userId: string) {
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    
    const { data } = await supabase
      .from("sellers")
      .select("id, store_name, store_slug")
      .eq("id", userId)
      .single();
    
    return data;
  } catch {
    return null;
  }
}

export default async function SellPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Mark as dynamic - user auth check required
  await connection();
  
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Fetch user on server
  const supabase = await createClient();
  let user = null;
  let seller = null;
  
  if (supabase) {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
    
    if (authUser) {
      seller = await getSellerData(authUser.id);
    }
  }
  
  // Pre-fetch categories for listing form (even if not logged in, for faster UX after login)
  const categories = await getCategories();
  
  return (
    <SellPageClient 
      initialUser={user ? { id: user.id, email: user.email || undefined } : null}
      initialSeller={seller}
      categories={categories}
    />
  );
}
