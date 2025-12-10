import { createClient, createStaticClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SellPageClient } from "./client";
import { unstable_cache } from "next/cache";

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

// Raw category type from database
interface RawCategory {
  id: string;
  name: string;
  name_bg: string | null;
  slug: string;
  parent_id: string | null;
  display_order: number | null;
}

// Build category tree from flat array
function buildCategoryTree(categories: RawCategory[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();
  
  // First pass: create all nodes
  for (const cat of categories) {
    categoryMap.set(cat.id, {
      ...cat,
      children: []
    });
  }
  
  // Second pass: build tree structure
  const rootCategories: CategoryNode[] = [];
  
  for (const cat of categories) {
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
  
  return sortChildren(rootCategories);
}

// Cached category fetcher - fetches ALL categories in a single query
// Cache is revalidated every hour for fresh category updates
const getCategoriesCached = unstable_cache(
  async (): Promise<CategoryNode[]> => {
    try {
      // Use static client for cached queries (no cookies needed for public categories)
      const supabase = createStaticClient();
      if (!supabase) return [];
      
      // Fetch root categories first (L0)
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

      // Fetch L2 categories in batches
      let l2Cats: typeof l1Cats = [];
      if (l1Cats && l1Cats.length > 0) {
        const l1Ids = l1Cats.map(c => c.id);
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

      // Combine all categories
      const allCategories = [...rootCats, ...(l1Cats || []), ...l2Cats];
      
      console.log(`[SellPage] Fetched ${allCategories.length} categories (${rootCats.length} root, ${l1Cats?.length || 0} L1, ${l2Cats.length} L2)`);

      return buildCategoryTree(allCategories);
    } catch (error) {
      console.error("[SellPage] Error in getCategoriesCached:", error);
      return [];
    }
  },
  ["sell-page-categories"],
  {
    revalidate: 3600, // 1 hour cache
    tags: ["categories"]
  }
);

// Non-cached version for user-specific data
async function getCategories(): Promise<CategoryNode[]> {
  return getCategoriesCached();
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
  
  // Fetch user and categories in parallel for better performance
  const supabase = await createClient();
  
  // Run auth check and category fetch in parallel
  const [categoriesResult, authResult] = await Promise.all([
    getCategories(),
    supabase ? supabase.auth.getUser() : Promise.resolve({ data: { user: null } })
  ]);
  
  const categories = categoriesResult;
  const user = authResult.data.user;
  
  // Fetch seller data only if user is authenticated
  let seller = null;
  if (user) {
    seller = await getSellerData(user.id);
  }
  
  return (
    <SellPageClient 
      initialUser={user ? { id: user.id, email: user.email || undefined } : null}
      initialSeller={seller}
      categories={categories}
    />
  );
}
