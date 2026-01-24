# AI Assistant (Shopping + Selling) — Implementation Notes (2026-01-23)

This repo includes a **dev MVP** of an in-app AI assistant for:
- **shopping help** (chat + catalog-grounded recommendations)
- **image “find similar”** (image → query → search)
- **sell draft autofill** (image → draft listing fields)

Non-goals (v1):
- No arbitrary web browsing (assistant only uses allowlisted tools that query our Supabase catalog).
- No write actions (wishlist/cart/etc) without explicit user confirmation.

---

## What’s implemented

### Routes

- `POST /api/assistant/chat` (streaming)
  - Uses Vercel AI SDK `streamText` + tool calling
  - Tools (read-only):
    - `searchListings({ query, limit })`
    - `getListing({ id })`

- `POST /api/assistant/find-similar` (JSON)
  - Uses vision model to extract a short search query from an image
  - Runs `searchListings` and returns `{ query, extracted, results }`

- `POST /api/assistant/sell-autofill` (JSON)
  - Uses vision model to generate a draft `{ title, description, condition, tags, … }`
  - Returns `{ draft }`

### Dev UI

- `/<locale>/assistant` (e.g. `/en/assistant`, `/bg/assistant`)
  - Chat playground (streaming)
  - Find-similar playground (image URL)
  - Sell-autofill playground (image URL)

---

## How to enable (dev)

In `.env.local`:

```bash
AI_ASSISTANT_ENABLED=1

# Choose ONE:
GOOGLE_GENERATIVE_AI_API_KEY=...   # direct Gemini
# OR
AI_GATEWAY_API_KEY=...             # Vercel AI Gateway

# Optional (defaults are fine):
AI_CHAT_MODEL=google/gemini-2.0-flash-lite
AI_VISION_MODEL=google/gemini-2.0-flash-lite
```

Then run the app and open `http://127.0.0.1:3000/en/assistant`.

---

## Next steps (production hardening)

- Rate limit assistant routes (per IP + per user).
- Add image limits (dimensions/bytes) and reject non-http(s) URLs.
- Integrate “Auto-fill from photo” into the real `/sell` flow (apply draft only after user confirms).
- Add embeddings-based “find similar” (vector search) instead of query extraction.
- Add price comps tool (median/range + sample size) grounded in recent sold/active listings.

