# opus_ideas.md — AI Shopping Agent for Treido

> Iteration document for the AI-first shopping experience.
> This is our planning scratchpad — not a spec. We iterate here, then extract into proper docs when ready to build.

---

## The Idea

Instead of (or alongside) Treido's traditional Next.js frontend with listings/filters/cards, build an **AI shopping agent** — a conversational interface where users interact with an assistant that helps them discover, compare, and buy products.

**Core insight:** A marketplace doesn't need 5,000 pages of hand-crafted UI. An AI agent with access to the product database can dynamically generate the right interface for each user's intent.

---

## What We Already Have (Massive Head Start)

Before planning new infrastructure, look at what exists:

| Asset | Detail |
|-------|--------|
| **Vercel AI SDK v6** | Already in `package.json` — `ai@6.0.49`, `@ai-sdk/react`, `@ai-sdk/google`, `@ai-sdk/openai`, `@ai-sdk/groq` |
| **AI tool definitions** | `lib/ai/tools/assistant-tools.ts` — `searchListings` and `getListing` already wired up |
| **Multi-provider models** | `lib/ai/models.ts` — gateway + fallback + vision model support |
| **Supabase backend** | Full Postgres DB with products, profiles, orders, reviews, categories, RLS |
| **Stripe payments** | Checkout + Connect already working |
| **i18n** | `next-intl` with en/bg — agent can be multilingual from day one |
| **Zod schemas** | `lib/ai/schemas/listings.ts` — typed input/output for AI tools |

**We're not starting from zero.** The backend, payments, and basic AI tooling are done. The question is: what's the best frontend/UX for the agent experience?

---

## Two Products, One Backend

### Product A: **Treido** (treido.eu)
The existing marketplace app. Traditional browse/search/buy UX. Shopping addicts, casual browsers, people who want visual feeds. Keep building this — it serves the "scroll and discover" use case.

### Product B: **Treido AI** (ai.treido.eu)
The AI shopping assistant. Chat-first interface. For intent-driven shoppers: "I need a BMW 335xi under €15K within 100km." Also for external AI agents (OpenClaw, ChatGPT plugins, etc.) that query our catalogue on behalf of their users.

**Same Supabase backend. Same Stripe. Same product data.** Two frontends optimized for different interaction patterns.

---

## Architecture Decision: Monorepo vs Separate Project

### Option 1: Same Next.js app, separate route group ✅ RECOMMENDED
```
app/[locale]/(main)/      → existing marketplace
app/[locale]/(agent)/     → AI agent chat UI
app/api/agent/            → agent API endpoints
```

**Pros:**
- Shares all existing infra (Supabase clients, Stripe, i18n, auth, middleware)
- No deployment complexity — one Vercel project
- `ai.treido.eu` → Vercel rewrites to `/(agent)` routes
- AI tools in `lib/ai/tools/` already importable
- Incremental — ship agent alongside existing app

**Cons:**
- Bundle contamination risk (mitigated by route-level code splitting)
- Existing codebase complexity leaks into agent dev

### Option 2: Separate Next.js project in monorepo (pnpm workspace)
```
packages/
  shared/          → Supabase clients, Stripe, types, AI tools
  treido-web/      → existing marketplace
  treido-agent/    → AI agent app
```

**Pros:**
- Clean separation, independent deploys
- Agent app can be extremely lightweight

**Cons:**
- Massive migration effort to extract shared code
- Two Vercel projects, two deployments
- Shared code drift risk

### Option 3: Completely separate repo
**Not recommended.** Duplicates backend logic, schemas, types. Constant sync issues.

### Verdict
**Start with Option 1** (same app, separate route group). It's zero-effort to share the backend. If the agent app grows large enough to justify extraction, migrate to Option 2 later. The `/(agent)` route group keeps it isolated.

---

## Proposed Tech Stack (Agent Frontend)

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Next.js 16 (existing) | Already deployed, App Router, Server Components |
| **AI SDK** | Vercel AI SDK v6 (existing) | `useChat`, `streamUI`, `generateText`, tool calling — all built in |
| **Chat UI** | Custom chat component + Generative UI | Vercel AI SDK's `streamUI` renders React components inline in chat |
| **Model (primary)** | Claude 3.5 Haiku / GPT-4.1 Mini / Gemini 2.0 Flash | Cheap, fast, good enough for shopping queries |
| **Model (complex)** | Claude Sonnet / GPT-4.1 | For multi-step reasoning, comparisons, negotiations |
| **Generative UI** | Vercel AI SDK `streamUI` + RSC | Agent returns React components (product cards, grids, filters) directly in chat |
| **Voice** | Future — Vercel AI SDK supports speech | Phase 2+ |
| **State** | Server-side chat history in Supabase | Persist conversations, enable "continue where I left off" |
| **Auth** | Existing Supabase Auth | Same login, same user, same cart |

---

## The Browsing Problem & Generative UI

> "Users love to browse. Shopping addicts just love scrolling."

This is the critical UX challenge. Pure chat is terrible for discovery. The solution: **Generative UI**.

### What is Generative UI?
The AI agent doesn't just return text — it returns **React components** streamed into the chat. Vercel AI SDK v6 supports this natively.

### Example Flow
```
User: "Show me today's new listings"

Agent thinks: [calls searchListings with sort=newest, limit=20]

Agent renders: <ProductGrid items={listings} layout="scroll" />
  → A horizontal scrollable grid of product cards, right inside the chat
  → User can tap a card → agent shows <ProductDetail /> inline
  → User can say "show me more like this" → agent refines
```

### UI Components the Agent Can Render

| Component | When |
|-----------|------|
| `<ProductCard />` | Single product mention |
| `<ProductGrid />` | "Show me X" / browse / feed |
| `<ProductComparison />` | "Compare these two" |
| `<FilterPanel />` | "What filters are available?" / refinement |
| `<MapView />` | "Listings near me" |
| `<PriceChart />` | "What's the price trend for X?" |
| `<CheckoutCard />` | "I want to buy this" → inline checkout |
| `<SellerProfile />` | "Tell me about this seller" |
| `<CategoryBrowser />` | "What categories do you have?" |
| `<DailyFeed />` | "What's new today?" / promoted / trending |

**Key principle:** The chat IS the UI. The agent decides what to show based on intent. It's not "text reply with a link" — it's a rich, interactive component rendered inline.

---

## Agent Capabilities (Tool Design)

### Existing Tools (ready to use)
- `searchListings(query, limit)` — text search across products
- `getListing(id)` — full product detail

### New Tools Needed

| Tool | Purpose | Supabase Query |
|------|---------|----------------|
| `searchByCategory(category, filters)` | Browse by category with price/location/condition filters | `products` table with joins |
| `getRecommendations(userId?, productId?)` | Collaborative filtering or content-based recs | Custom RPC or edge function |
| `getNearbyListings(lat, lng, radius)` | Geo-based discovery | PostGIS or manual distance calc |
| `getNewListings(since, limit)` | "What's new today?" | `created_at` filter |
| `getPromotedListings(limit)` | Boosted/featured items | `boosts` table join |
| `getTrendingListings(limit)` | Most viewed/wishlisted recently | Analytics query |
| `comparePrices(productIds[])` | Side-by-side comparison | Multi-select |
| `getSellerInfo(username)` | Seller reputation, reviews, listings | `profiles` + `reviews` table |
| `addToCart(productId, quantity)` | Cart management | Existing cart logic |
| `getCategories()` | List all available categories | `categories` table |
| `getUserWishlist(userId)` | Show saved items | `wishlists` table |
| `getOrderStatus(orderId)` | Track an order | `orders` table |

### System Prompt Design
```
You are Treido AI, a shopping assistant for the Treido marketplace.
You help users discover, compare, and buy products.

PERSONALITY:
- Friendly but efficient. No fluff.
- Ask clarifying questions when the request is ambiguous.
- Always show products visually (use generative UI), not just text descriptions.
- Respect the user's budget and preferences.
- Be honest about product limitations.
- Support English and Bulgarian.

RULES:
- Never fabricate listings. Only show real products from the database.
- Always include prices in the user's preferred currency.
- For purchases, always confirm before proceeding to checkout.
- If asked about something outside shopping, politely redirect.
- Protect user privacy — never share personal info.

CAPABILITIES:
- Search products by any criteria
- Show product feeds (new, trending, promoted, nearby)
- Compare products side by side
- Provide seller information and reviews
- Manage cart and initiate checkout
- Track orders
- Give price insights and recommendations
```

---

## Agent-to-Agent Discoverability (A2A)

> "We need to be reachable by other AIs."

This is a strategic advantage. When someone asks ChatGPT / Claude / OpenClaw "find me a BMW 335xi in Bulgaria," we want Treido to be discoverable.

### Standards & Protocols

| Protocol | What It Does | Our Play |
|----------|-------------|----------|
| **OpenAPI / REST API** | Standard API documentation | Expose `/api/v1/` with OpenAPI spec — any agent can discover and call it |
| **MCP (Model Context Protocol)** | Anthropic's standard for AI tool use | Publish a Treido MCP server — Claude/other MCP clients can use our tools directly |
| **OpenAI Actions / GPT Plugins** | ChatGPT can call our API | Register as a ChatGPT action with our OpenAPI spec |
| **agents.json / .well-known** | Emerging standard for agent discovery | Place agent manifest at `ai.treido.eu/.well-known/agents.json` |
| **Schema.org / JSON-LD** | Search engine & AI-readable structured data | Already should be on product pages — ensures Google AI, Perplexity, etc. can find listings |

### Minimum Viable Discoverability
1. **Public REST API** at `api.treido.eu/v1/` (or `treido.eu/api/v1/`)
   - `GET /listings?q=...&category=...&min_price=...&max_price=...`
   - `GET /listings/:id`
   - `GET /categories`
   - `GET /sellers/:username`
   - OpenAPI 3.1 spec at `/api/v1/openapi.json`

2. **MCP Server** (can be a simple wrapper around the REST API)
   - Publish as npm package or hosted endpoint
   - Other AI agents can `searchTreidoListings`, `getTreidoProduct`, etc.

3. **agents.json manifest**
   ```json
   {
     "name": "Treido",
     "description": "Marketplace for buying and selling products in Europe",
     "url": "https://ai.treido.eu",
     "api": "https://treido.eu/api/v1/openapi.json",
     "mcp": "https://treido.eu/api/mcp",
     "capabilities": ["search", "product-detail", "categories", "checkout"]
   }
   ```

---

## Phased Roadmap

### Phase 0: Foundation (Week 1-2)
- [ ] Create `app/[locale]/(agent)/` route group
- [ ] Build basic chat UI component (input + message list + streaming)
- [ ] Wire up existing `searchListings` and `getListing` tools via `useChat`
- [ ] Configure model (start with Gemini 2.0 Flash or GPT-4.1 Mini for cost)
- [ ] System prompt v1
- [ ] Deploy at `/agent` route, test internally
- **Goal:** You can chat with the agent and it searches real listings

### Phase 1: Generative UI (Week 2-3)
- [ ] Implement `streamUI` for server-rendered components in chat
- [ ] Build agent-specific product card component (compact, chat-friendly)
- [ ] Build product grid component (horizontal scroll, responsive)
- [ ] Agent renders product cards/grids inline instead of text
- [ ] Add `searchByCategory`, `getNewListings`, `getPromotedListings` tools
- **Goal:** Rich visual product browsing inside chat

### Phase 2: Full Shopping Flow (Week 3-4)
- [ ] Add cart integration tools (`addToCart`, `getCart`)
- [ ] Inline checkout card component
- [ ] Auth integration (login within agent, or redirect to main auth)
- [ ] Conversation persistence (save to Supabase, resume later)
- [ ] User preference memory ("you usually search for cars")
- **Goal:** Complete buy flow without leaving the chat

### Phase 3: Smart Features (Week 4-6)
- [ ] Nearby listings with geo (PostGIS or Supabase geo)
- [ ] Price comparisons and insights
- [ ] Seller info and reputation cards
- [ ] Product recommendations ("based on your history")
- [ ] Wishlist integration
- [ ] Order tracking via chat
- **Goal:** Agent is smarter than browsing the app manually

### Phase 4: Agent-to-Agent (Week 6-8)
- [ ] Public REST API (`/api/v1/`) with OpenAPI spec
- [ ] MCP server for Treido (wrapping REST API)
- [ ] `agents.json` manifest at `.well-known/`
- [ ] Register as ChatGPT action
- [ ] Schema.org JSON-LD on all product/listing pages
- [ ] SEO/discoverability for ai.treido.eu
- **Goal:** External AI agents can discover and query Treido

### Phase 5: Polish & Scale (Week 8+)
- [ ] Voice input/output (Vercel AI SDK speech)
- [ ] Multi-turn context windows (agent remembers full conversation)
- [ ] A/B test: agent vs traditional UI conversion rates
- [ ] Cost optimization (model routing: simple queries → Flash, complex → Sonnet)
- [ ] Rate limiting, abuse prevention
- [ ] Analytics (what do users ask? where do they drop off?)
- **Goal:** Production-grade, cost-efficient, delightful

---

## Open Questions & Decisions Needed

### UX
1. **Chat-only vs hybrid?** Should ai.treido.eu be pure chat, or have a "Browse" tab that shows the existing Treido feed alongside the chat?
2. **Mobile UX:** Full-screen chat? Bottom sheet chat over a feed? Split view?
3. **Onboarding:** When a user first opens the agent, what do they see? Suggested prompts? A mini-feed? Empty chat with a greeting?
4. **Auth flow:** Must users log in to chat? Or allow anonymous browsing, require auth only for cart/checkout?

### Technical
5. **Model choice:** Start with the cheapest that's "good enough." Gemini 2.0 Flash is free-tier for prototyping. GPT-4.1 Mini or Haiku 4.5 for production?
6. **Streaming:** `useChat` (text streaming) vs `streamUI` (component streaming)? Probably both — text for conversation, `streamUI` for product displays.
7. **Conversation storage:** Supabase table? How long to retain? Can users export?
8. **Cost per conversation:** Need to estimate. A typical shopping session might be 10-20 messages. At ~$0.001/1K tokens for cheap models, that's pennies. But at scale?

### Business
9. **Monetization:** Can we charge for premium AI features? (e.g., price alerts, negotiation assistance, personal shopper mode)
10. **Promoted listings in agent:** How does boosting work in chat? Agent naturally recommends boosted items first?
11. **Seller tools:** Can sellers interact with the agent? ("How are my listings performing?" "Suggest a better price for my item")

---

## Competitive Advantage

Why this matters NOW:
- **Most marketplaces are stuck in 2015 UI patterns.** Search bar + filters + grid. Everyone has the same UX.
- **AI-native shopping is inevitable.** The question is who builds it first for the European market.
- **Agent-to-agent is the next SEO.** Being discoverable by AI agents (MCP, OpenAPI, agents.json) is the new "ranking on Google."
- **We already have the backend.** The Supabase data, Stripe payments, and Vercel AI SDK tooling are in place. This is a frontend/UX project, not a backend rewrite.
- **Cost is negligible.** Cheap models (Flash, Mini, Haiku) make per-conversation costs trivial compared to traditional server costs.

---

## Inspiration & References

- **Vercel AI SDK `streamUI`:** https://sdk.vercel.ai/docs/ai-sdk-rsc/streaming-react-components — the core tech for generative UI
- **Vercel AI Chatbot template:** https://github.com/vercel/ai-chatbot — reference implementation
- **MCP specification:** https://modelcontextprotocol.io — for agent-to-agent
- **OpenAI Actions:** https://platform.openai.com/docs/actions — ChatGPT plugin/action registration
- **Perplexity shopping:** Has AI-powered product search — similar concept, but we own the marketplace
- **Amazon Rufus:** Amazon's shopping AI — enterprise-grade, but the UX is just text, no generative UI

---

## File Structure (Proposed)

```
app/[locale]/(agent)/
  layout.tsx              → Agent layout (minimal chrome, full-screen chat)
  page.tsx                → Main chat page
  _components/
    chat-interface.tsx    → Main chat container
    chat-message.tsx      → Message bubble (text + generative UI)
    chat-input.tsx        → Input with suggestions
    agent-product-card.tsx → Compact product card for chat
    agent-product-grid.tsx → Scrollable grid for chat
    agent-comparison.tsx  → Side-by-side comparison
    agent-checkout.tsx    → Inline checkout card
    agent-feed.tsx        → Daily/trending feed component
  _lib/
    agent-system-prompt.ts → System prompt + persona
    agent-tools.ts        → Extended tool set (wraps lib/ai/tools/ + new ones)

app/api/agent/
  chat/route.ts           → Chat API endpoint (POST, streaming)

app/api/v1/              → Public REST API (Phase 4)
  listings/route.ts
  listings/[id]/route.ts
  categories/route.ts
  openapi.json/route.ts

lib/ai/tools/            → Extended with new tools
  search-listings.ts     → (existing)
  get-listing.ts         → (existing)
  search-by-category.ts  → NEW
  get-new-listings.ts    → NEW
  get-promoted.ts        → NEW
  get-nearby.ts          → NEW
  cart-tools.ts          → NEW
  seller-tools.ts        → NEW
```

---

## Previous Attempt — Lessons Learned

> "We tried implementing something similar before, but failed."

What likely went wrong:
1. **Too ambitious scope** — tried to build everything at once
2. **No generative UI** — pure text chat is bad for shopping
3. **Wrong model** — too expensive or too slow for interactive use
4. **No tool calling** — agent couldn't actually search products, just hallucinated

This time:
- **Incremental phases** — Phase 0 is just chat + existing search tool
- **Generative UI from Phase 1** — the agent renders actual product components
- **Cheap models first** — optimize cost from day one
- **Existing tools work** — `searchListings` and `getListing` are already tested

---

## Next Steps (Immediate)

1. **Human decision:** Confirm we're going with Option 1 (same app, `/(agent)` route group)
2. **Human decision:** Pick the initial model (recommendation: Gemini 2.0 Flash for prototyping, switch to GPT-4.1 Mini for production)
3. **Set up subdomain:** Configure `ai.treido.eu` → Vercel rewrites to `/(agent)` routes
4. **Start Phase 0:** Build the basic chat UI and wire up existing tools
5. **Iterate on this doc** as we learn from building

---

*Created: 2026-02-17 | Status: PLANNING | Last updated: 2026-02-17*
