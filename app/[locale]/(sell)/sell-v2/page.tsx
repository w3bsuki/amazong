import { createClient, createStaticClient } from "@/lib/supabase/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { SellForm } from "./_components";

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Category type
interface Category {
  id: string;
  name: string;
  name_bg: string | null;
  slug: string;
  parent_id: string | null;
  children: Category[];
}

// Build category tree from flat array
function buildCategoryTree(categories: Omit<Category, "children">[]): Category[] {
  const categoryMap = new Map<string, Category>();
  
  for (const cat of categories) {
    categoryMap.set(cat.id, { ...cat, children: [] });
  }
  
  const rootCategories: Category[] = [];
  
  for (const cat of categories) {
    const node = categoryMap.get(cat.id)!;
    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      categoryMap.get(cat.parent_id)!.children.push(node);
    } else if (!cat.parent_id) {
      rootCategories.push(node);
    }
  }
  
  return rootCategories;
}

// Cached category fetcher
const getCategoriesCached = unstable_cache(
  async (): Promise<Category[]> => {
    const supabase = createStaticClient();
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, parent_id")
      .lt("display_order", 9000)
      .order("display_order", { ascending: true });

    if (error || !data) return [];
    return buildCategoryTree(data);
  },
  ["sell-v2-categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export default async function SellV2Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect(`/${locale}/auth/login?redirect=/sell-v2`);
  }

  // Check if user is a seller
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, is_seller")
    .eq("id", user.id)
    .single();

  if (!profile?.is_seller) {
    redirect(`/${locale}/become-seller?redirect=/sell-v2`);
  }

  // Fetch categories
  const categories = await getCategoriesCached();

  return (
    <SellForm
      sellerId={user.id}
      categories={categories}
      locale={locale}
    />
  );
}
