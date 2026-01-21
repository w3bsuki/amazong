import { NextResponse } from "next/server";
import { getCategoryTreeDepth3 } from "@/lib/data/categories";

// Align CDN cache headers with next.config.ts cacheLife.categories
// (revalidate: 3600s, stale: 300s)
const CACHE_TTL_SECONDS = 3600;
const CACHE_STALE_WHILE_REVALIDATE = 300;

export async function GET() {
  const categories = await getCategoryTreeDepth3();
  return NextResponse.json(
    { categories },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
        "CDN-Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
        "Vercel-CDN-Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
      },
    },
  );
}
