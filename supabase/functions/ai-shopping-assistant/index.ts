import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const DEFAULT_SUGGESTIONS = ["Under $5,000", "Under $10,000", "Used", "New", "Sedan", "SUV"];

const corsHeadersBase = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function resolveCorsOrigin(origin: string | null): string {
  const configured = Deno.env.get("AI_ASSISTANT_ALLOWED_ORIGINS") ?? "";
  const allowlist = configured
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (allowlist.length === 0) return "*";
  if (origin && allowlist.includes(origin)) return origin;
  return allowlist[0];
}

function buildCorsHeaders(origin: string | null) {
  return {
    ...corsHeadersBase,
    "Access-Control-Allow-Origin": resolveCorsOrigin(origin),
  };
}

async function callGeminiDirect(params: {
  apiKey: string;
  systemPrompt: string;
  conversationHistory: Array<{ role: string; content: string }>;
  message: string;
}): Promise<string | null> {
  const { apiKey, systemPrompt, conversationHistory, message } = params;

  // Gemini uses roles: user | model
  const contents = [
    ...conversationHistory
      .filter((m) => m && typeof m.content === "string")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.content) }],
      })),
    { role: "user", parts: [{ text: message }] },
  ];

  const resp = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Prefer header over query param to avoid accidental logging.
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
        },
      }),
    }
  );

  if (!resp.ok) {
    console.error("Gemini direct error:", resp.status);
    return null;
  }

  const data: unknown = await resp.json().catch(() => null);
  const parts = (data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
    ?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  const text = parts
    .map((p) => (typeof p?.text === "string" ? p.text : ""))
    .join("")
    .trim();
  return text || null;
}

function parseNumberLike(input: string): number | null {
  const cleaned = input.trim().toLowerCase().replace(/[,\\s]/g, "");
  const kMatch = cleaned.match(/^\\$?(\\d+(?:\\.\\d+)?)k$/);
  if (kMatch) {
    const value = Number(kMatch[1]);
    return Number.isFinite(value) ? Math.round(value * 1000) : null;
  }

  const digits = cleaned.replace(/[^0-9.]/g, "");
  if (!digits) return null;
  const value = Number(digits);
  return Number.isFinite(value) ? Math.round(value) : null;
}

function extractPriceRange(message: string): { priceMin: number | null; priceMax: number | null } {
  const text = message.toLowerCase();

  // between X and Y, X-Y, X to Y
  const betweenMatch = text.match(
    /(?:between|from)\\s+\\$?([0-9.,]+\\s*k?)\\s+(?:and|to|-|–)\\s*\\$?([0-9.,]+\\s*k?)/i
  );
  if (betweenMatch) {
    const a = parseNumberLike(betweenMatch[1]);
    const b = parseNumberLike(betweenMatch[2]);
    if (a !== null && b !== null) {
      return { priceMin: Math.min(a, b), priceMax: Math.max(a, b) };
    }
  }

  // under/below/max
  const underMatch = text.match(/(?:under|below|max(?:imum)?|<=)\\s*\\$?\\s*([0-9.,]+\\s*k?)/i);
  if (underMatch) {
    const max = parseNumberLike(underMatch[1]);
    if (max !== null) return { priceMin: null, priceMax: max };
  }

  // over/above/min
  const overMatch = text.match(/(?:over|above|min(?:imum)?|>=)\\s*\\$?\\s*([0-9.,]+\\s*k?)/i);
  if (overMatch) {
    const min = parseNumberLike(overMatch[1]);
    if (min !== null) return { priceMin: min, priceMax: null };
  }

  return { priceMin: null, priceMax: null };
}

function resolveCategorySlug(
  message: string,
  categoryList: Array<{ name: string; slug: string }>
): string | null {
  const text = message.toLowerCase();
  for (const c of categoryList) {
    const slug = String(c.slug ?? "").toLowerCase();
    const name = String(c.name ?? "").toLowerCase();
    if (!slug && !name) continue;
    if (
      slug &&
      new RegExp(`\\b${slug.replace(/[-/\\^$*+?.()|[\\]{}]/g, "\\\\$&")}\\b`, "i").test(text)
    ) {
      return c.slug;
    }
    if (
      name &&
      new RegExp(`\\b${name.replace(/[-/\\^$*+?.()|[\\]{}]/g, "\\\\$&")}\\b`, "i").test(text)
    ) {
      return c.slug;
    }
  }
  return null;
}

function extractTags(message: string): string[] {
  const stop = new Set([
    "i",
    "im",
    "i'm",
    "want",
    "to",
    "buy",
    "get",
    "need",
    "show",
    "me",
    "a",
    "an",
    "the",
    "some",
    "any",
    "for",
    "with",
    "and",
    "or",
    "under",
    "below",
    "over",
    "above",
    "between",
    "from",
    "in",
    "on",
    "at",
    "near",
    "around",
    "cheap",
    "budget",
    "price",
  ]);

  const words = message
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, " ")
    .split(/\\s+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .filter((w) => w.length >= 3)
    .filter((w) => !stop.has(w))
    .filter((w) => !/^\\d/.test(w));

  // de-dupe
  return [...new Set(words)].slice(0, 6);
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req.headers.get("Origin"));

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let body: unknown = {};
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: "invalid_json",
          message: "Invalid request body. Expected JSON.",
          messageKey: "ai.invalidJson",
          products: [],
          filters: {},
          suggestions: [],
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const payload = body as {
      message?: string;
      conversationHistory?: Array<{ role: string; content: string }>;
    };

    const message: string = typeof payload.message === "string" ? payload.message : "";
    const conversationHistory = Array.isArray(payload.conversationHistory)
      ? payload.conversationHistory
      : [];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") ?? null;
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? null;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing required Supabase environment variables");
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name, slug");

    if (categoriesError) {
      console.error("Error fetching categories");
    }

    const categoryList = (categories ?? []).map((c: { id: string; name: string; slug: string }) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));

    const systemPrompt = `You are an expert AI shopping assistant for a marketplace.

Your job is to extract search filters from the user's message so the server can query the database.

Available categories (name + slug):
${JSON.stringify(categoryList, null, 2)}

RULES:
1) ALWAYS extract filters and let the server show products. DO NOT ask clarifying questions unless the query is just 1-2 generic words like "stuff" or "things".
   - If user says "BMW 325xi" -> tags: ["bmw", "325xi"], category: "automotive" or similar
   - If user says "used iPhone" -> tags: ["used", "iphone"], category: "electronics" or similar
   - If user says "laptop under 500" -> tags: ["laptop"], priceMax: 500

2) Keep message SHORT or empty. Never lecture the user. Just show results.

3) ALWAYS respond with JSON in EXACTLY this format:
{
  "message": "",
  "products": [],
  "filters": {
    "priceMin": null,
    "priceMax": null,
    "category": null,
    "tags": []
  },
  "suggestions": []
}

Guidance:
- "filters.category" must be a category slug from the list above (or null).
- "filters.tags" should capture ALL keywords: brand, model, condition, type (e.g. ["bmw", "325xi", "used"]).
- Suggestion chips: 4-6 short refinements (e.g., "Under $5,000", "Automatic", "Low mileage").
`;

    // Either call an LLM (if configured) or fall back to a heuristic intent extractor.
    let parsedResponse: Record<string, unknown> | null = null;
    let provider: "lovable" | "gemini" | "heuristic" = "heuristic";

    if (LOVABLE_API_KEY) {
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: message },
      ];

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.error("AI gateway error:", response.status);

        if (response.status === 429) {
          return new Response(
            JSON.stringify({
              error: "rate_limited",
              message: "Rate limit exceeded. Please try again in a moment.",
              messageKey: "ai.rateLimited",
            }),
            {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({
              error: "service_unavailable",
              message: "Service temporarily unavailable. Please try again later.",
              messageKey: "ai.unavailable",
            }),
            {
              status: 402,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // If the AI gateway is misconfigured, fall back to heuristic mode rather than 500'ing.
        parsedResponse = null;
      } else {
        const data = (await response.json().catch(() => null)) as {
          choices?: Array<{ message?: { content?: string } }>;
        } | null;
        const aiResponse = data?.choices?.[0]?.message?.content;
        if (typeof aiResponse !== "string") {
          parsedResponse = null;
        } else {
          try {
            const jsonMatch =
              aiResponse.match(/```json\\s*([\\s\\S]*?)\\s*```/) ||
              aiResponse.match(/```\\s*([\\s\\S]*?)\\s*```/) ||
              [null, aiResponse];
            const jsonStr = jsonMatch[1] || aiResponse;
            parsedResponse = JSON.parse(jsonStr.trim()) as Record<string, unknown>;
            provider = "lovable";
          } catch {
            parsedResponse = {
              message: aiResponse,
              messageKey: "ai.response",
              products: [],
              filters: {},
              suggestions: [],
            };
            provider = "lovable";
          }
        }
      }
    }

    if (!parsedResponse && GEMINI_API_KEY) {
      const geminiText = await callGeminiDirect({
        apiKey: GEMINI_API_KEY,
        systemPrompt,
        conversationHistory,
        message,
      });

      if (geminiText) {
        try {
          const jsonMatch =
            geminiText.match(/```json\\s*([\\s\\S]*?)\\s*```/) ||
            geminiText.match(/```\\s*([\\s\\S]*?)\\s*```/) ||
            [null, geminiText];
          const jsonStr = jsonMatch[1] || geminiText;
          parsedResponse = JSON.parse(String(jsonStr).trim()) as Record<string, unknown>;
          provider = "gemini";
        } catch {
          parsedResponse = {
            message: geminiText,
            messageKey: "ai.response",
            products: [],
            filters: {},
            suggestions: [],
          };
          provider = "gemini";
        }
      }
    }

    if (!parsedResponse) {
      const { priceMin, priceMax } = extractPriceRange(message);
      const category = resolveCategorySlug(message, categoryList);
      const tags = extractTags(message);
      parsedResponse = {
        message: "",
        products: [],
        filters: {
          priceMin,
          priceMax,
          category,
          tags,
        },
        suggestions: [],
      };
      provider = "heuristic";
    }

    parsedResponse._meta = { provider };

    // Server-side: ALWAYS show products. Only ask clarifying questions for extremely vague queries.
    const filters = (parsedResponse.filters ?? {}) as {
      priceMin?: number | null;
      priceMax?: number | null;
      category?: string | null;
      tags?: string[];
    };
    const priceMin = typeof filters.priceMin === "number" ? filters.priceMin : null;
    const priceMax = typeof filters.priceMax === "number" ? filters.priceMax : null;
    const tags = Array.isArray(filters.tags)
      ? filters.tags.filter(Boolean).map((t) => String(t).toLowerCase())
      : [];
    const categorySlug = typeof filters.category === "string" ? filters.category : null;

    // Show products if: any price filter, any tags, any category, or message has 3+ words (specific query)
    const msgWords = String(message ?? "")
      .trim()
      .split(/\\s+/)
      .filter((w) => w.length > 1).length;
    const isSpecific =
      priceMin !== null || priceMax !== null || tags.length >= 1 || categorySlug !== null || msgWords >= 3;

    // Resolve category slug -> id
    const categoryId = categorySlug
      ? categoryList.find((c) => c.slug === categorySlug)?.id ?? null
      : null;

    // If not specific, force clarification: no products.
    if (!isSpecific) {
      parsedResponse.products = [];
      parsedResponse.filters = {
        priceMin,
        priceMax,
        category: categorySlug,
        tags,
      };

      if (!parsedResponse.message || typeof parsedResponse.message !== "string") {
        parsedResponse.message =
          "Quick question so I can narrow it down: what's your budget, and any preferences (make/model/type)?";
        parsedResponse.messageKey = "ai.clarify";
      }

      if (!Array.isArray(parsedResponse.suggestions) || parsedResponse.suggestions.length === 0) {
        parsedResponse.suggestions = DEFAULT_SUGGESTIONS;
      }

      return new Response(JSON.stringify(parsedResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Specific enough: query DB to get product IDs.
    const buildBaseQuery = () => {
      let q = supabase
        .from("products")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(12);

      if (categoryId) q = q.eq("category_id", categoryId);
      if (priceMin !== null) q = q.gte("price", priceMin);
      if (priceMax !== null) q = q.lte("price", priceMax);
      return q;
    };

    let matched: Array<{ id: string }> | null = null;
    let matchError: unknown = null;

    if (tags.length > 0) {
      // 1) Prefer array overlap on tags.
      try {
        // @ts-expect-error - overlaps typing not available in this Supabase client version
        const { data, error } = await buildBaseQuery().overlaps("tags", tags);
        matched = data ?? null;
        matchError = error;
      } catch (e) {
        matchError = e;
      }

      // 2) If overlap fails or returns nothing, try searching the name.
      if (matchError || !matched || matched.length === 0) {
        const safeTags = tags
          .map((t) => String(t).toLowerCase().replace(/[^a-z0-9-]/g, ""))
          .filter(Boolean)
          .slice(0, 4);

        if (safeTags.length > 0) {
          const orFilter = safeTags.map((t) => `name.ilike.%${t}%`).join(",");
          const { data, error } = await buildBaseQuery().or(orFilter);
          if (!error && data && data.length > 0) {
            matched = data;
            matchError = null;
          }
        }
      }

      // 3) Last resort: return latest matches without tags so the UI isn't empty.
      if (!matched || matched.length === 0) {
        const { data, error } = await buildBaseQuery();
        matched = data ?? null;
        matchError = error;
      }
    } else {
      const { data, error } = await buildBaseQuery();
      matched = data ?? null;
      matchError = error;
    }

    if (matchError) console.error("Error querying matched products");

    parsedResponse.products = (matched ?? []).map((r) => r.id);
    parsedResponse.filters = {
      priceMin,
      priceMax,
      category: categorySlug,
      tags,
    };

    // Make sure suggestions exists.
    if (!Array.isArray(parsedResponse.suggestions)) parsedResponse.suggestions = [];

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    console.error("Error in ai-shopping-assistant");
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: "I'm having trouble right now. Please try again!",
        messageKey: "ai.error",
        products: [],
        filters: {},
        suggestions: [],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
