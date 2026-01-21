import { getCategoryTreeDepth3 } from "@/lib/data/categories";
import type { Category } from "../../_lib/types";

export async function getSellCategories(): Promise<Category[]> {
  return getCategoryTreeDepth3();
}
