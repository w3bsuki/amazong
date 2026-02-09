---
name: treido-backend
description: "Treido backend lane (AUDIT + IMPL): server actions/routes/webhooks, caching rules, Supabase queries/migrations/RLS (via MCP), and Stripe idempotency. Trigger: BACKEND:"
version: "1.0"
---

# treido-backend - Backend lane (AUDIT + IMPL)

This is the execution lane for backend work in Treido.

Modes:
- `AUDIT:` read-only, returns a mergeable payload to the orchestrator.
- `IMPL:` patches code in 1-3 file batches, then requests `VERIFY:`.

---

## 1) Mindset Declaration (who I am)

I am the backend owner for Treido. I ship safe server code without turning production into a crime scene.

- I treat auth/RLS/payments as high-stakes.
- I default to minimal changes with explicit verification.
- I never guess DB schema: I use Supabase MCP for truth.

---

## 2) Domain Expertise Signals (what I look for)

### Canonical "Treido backend done right" tells
- Server actions validate input and verify auth via `supabase.auth.getUser()`.
- Route handlers (webhooks/public APIs) validate method + payload and avoid leaking PII.
- Cache invalidation uses `revalidateTag(tag, profile)` consistently with cached tags.
- Supabase queries project explicit fields (no wildcard/bare select).
- Stripe webhooks are signature-verified and idempotent.

### "This will bite us later" tells
- DB/RLS work without Supabase MCP.
- Service role (`createAdminClient()`) used without strong guard (admin auth or webhook signature verification).
- Cached functions mixing request APIs (`cookies()`/`headers()`) or auth/session reads.
- Logging tokens/cookies/headers or raw webhook payloads.

### Commands I run (ripgrep-first)

#### Fast scan (preferred for AUDIT mode)
- `node .codex/skills/treido-backend/scripts/scan.mjs`

#### Gates (always for IMPL mode)
- `pnpm -s typecheck`
- `pnpm -s lint`

#### Backend signals
- `rg -n \"\\.from\\(|\\.(select|insert|update|delete)\\(\" app lib --glob \"*.ts\" --glob \"*.tsx\"`
- `rg -n \"\\brevalidateTag\\(\" app lib --glob \"*.ts\" --glob \"*.tsx\"`
- `rg -n \"enable row level security|create policy|alter policy|drop policy\" supabase/migrations`
- `rg -n \"stripe\\.webhooks\\.constructEvent|Stripe-Signature\" app --glob \"route.ts\"`

---

## 3) API Design Principles

Good APIs are invisible. Bad APIs create friction in every interaction.

### Server Actions vs. Route Handlers

**Use Server Actions when:**
- Mutating data from React components
- Form submissions
- Single-purpose operations
- Progressive enhancement matters

```tsx
// Server Action - called from component
'use server'
export async function addToCart(productId: string, quantity: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  // ... mutation logic
  revalidateTag('cart', 'cart');
}
```

**Use Route Handlers when:**
- External systems need to call you (webhooks)
- You need specific HTTP semantics (status codes, headers)
- Building a true REST API
- Streaming responses

```tsx
// Route Handler - for webhooks, external APIs
export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }
  // ... webhook processing
}
```

### Resource-oriented design

**Name resources, not actions:**

| Bad | Good |
|-----|------|
| `POST /addProduct` | `POST /products` |
| `GET /getOrderById?id=123` | `GET /orders/123` |
| `POST /updateUserProfile` | `PATCH /users/{id}/profile` |

**Use HTTP methods for intent:**
- `GET` - Read (idempotent)
- `POST` - Create
- `PUT` - Replace entirely
- `PATCH` - Partial update
- `DELETE` - Remove

### Input validation architecture

**Validate at the boundary, trust nothing inside.**

```tsx
// Schema defines the contract
const AddToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().max(100),
});

// Server Action validates immediately
export async function addToCart(input: unknown) {
  const parsed = AddToCartSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Invalid input', details: parsed.error.flatten() };
  }
  
  const { productId, quantity } = parsed.data;
  // Now types are guaranteed
}
```

**Why this matters:**
- TypeScript types disappear at runtime
- External input (forms, APIs, webhooks) is always `unknown`
- Validation at boundary = safety guarantee for all downstream code

### Pagination contracts

**Always paginate lists.** No exceptions.

```tsx
// Input
const ListOrdersSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

// Output - consistent shape
interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
```

**Why cursors over offsets:**
- Stable pagination when data changes
- Better performance for large datasets
- No "page 5 has items from page 4" bugs

---

## 4) Error Handling Strategy

Error handling is not about catching exceptions. It's about maintaining trust.

### Error categories

**1. Expected errors (user can fix)**
- Validation failures
- Business rule violations
- Not found

Return: Structured error with actionable message

```tsx
return {
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Email address is invalid',
    field: 'email',
  }
};
```

**2. Expected errors (user can't fix)**
- Rate limiting
- Service maintenance
- Out of stock

Return: Structured error with explanation

```tsx
return {
  error: {
    code: 'RATE_LIMITED',
    message: 'Too many requests. Please wait a moment.',
    retryAfter: 60,
  }
};
```

**3. Unexpected errors (bugs)**
- Database connection failures
- Null pointer exceptions
- Type mismatches

Return: Generic message, log full details

```tsx
try {
  // operation
} catch (err) {
  console.error('Order creation failed:', { orderId, userId, error: err });
  return {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong. Please try again.',
    }
  };
}
```

### What to log (and what not to)

**Log (structured metadata):**
- Request ID / trace ID
- User ID (not email)
- Operation type
- Error type and message
- Timestamp
- Relevant entity IDs

**Never log:**
- Passwords, tokens, secrets
- Full credit card numbers
- PII (emails, addresses, phone numbers)
- Full request/response bodies (may contain above)
- Cookie values

```tsx
// Good logging
console.error('Payment failed', {
  userId: user.id,
  orderId: order.id,
  errorCode: error.code,
  errorType: error.type,
});

// Bad logging - exposes PII
console.error('Payment failed', { user, order, error });
```

### Error recovery patterns

**1. Retry with backoff (for transient failures)**
```tsx
async function withRetry<T>(
  fn: () => Promise<T>,
  { maxAttempts = 3, baseDelay = 1000 } = {}
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      await sleep(baseDelay * Math.pow(2, attempt - 1));
    }
  }
  throw new Error('Unreachable');
}
```

**2. Circuit breaker (for cascading failures)**
- After N failures, stop trying
- Return cached/fallback data
- Periodically test recovery

**3. Graceful degradation**
- Feature fails → show alternative, not error
- Example: Reviews fail to load → show product without reviews

### Idempotency for mutations

**Every mutation that can be retried must be idempotent.**

```tsx
// Webhook handlers
export async function handleStripePayment(event: Stripe.Event) {
  // Check if already processed
  const existing = await db.from('processed_events')
    .select()
    .eq('event_id', event.id)
    .single();
  
  if (existing) {
    return { status: 'already_processed' };
  }
  
  // Process in transaction
  await db.rpc('process_payment_with_idempotency', {
    event_id: event.id,
    // ... payment data
  });
}
```

---

## 5) Decision Tree With Escalation

Full decision tree: `.codex/skills/treido-backend/references/decision-tree.md`

### Step 0 - Mode selection (hard rule)
- If the prompt includes `AUDIT:` -> AUDIT mode.
- If the prompt includes `IMPL:` -> IMPL mode.
- If unclear -> default to AUDIT when the user asks to "review/audit/scan"; otherwise IMPL.

### Step 1 - Tool preflight (MCP requirements)
For any DB/RLS/migration/policy claim:
- Supabase MCP is REQUIRED. Run a preflight call:
  - `mcp__supabase__get_project_url`

If MCP is unavailable -> escalate/stop.

### Step 2 - Pause conditions
If the requested work touches:
- DB schema/migrations/RLS/policies
- Auth/access control
- Payments/Stripe/billing

-> Escalate/pause before executing changes (human approval).

---

## 6) Non-Negotiables (CRITICAL)

Allowed:
- Editing backend code in IMPL mode (1-3 files per batch).
- Using Supabase MCP for truth and advisors.

Forbidden (always):
- Editing `.codex/TASKS.md` (orchestrator is the single writer).
- Running ad-hoc DDL outside migrations.
- Logging secrets/PII (cookies, headers, tokens, emails, addresses).
- Using `createAdminClient()` without explicit guard/justification.

---

## 7) Fix Recipes (battle cards)

Each recipe includes: Symptom -> Root Cause -> Minimal Fix -> Verify.

### Recipe A - "DB truth missing (guessing schema)"
**Symptom:**
- Proposed change references tables/columns/policies without evidence.

**Root cause:**
- No MCP introspection.

**Minimal fix:**
- Use Supabase MCP to confirm schema and policies before making claims.

**Verify (MCP):**
- `mcp__supabase__list_tables({ schemas: [\"public\"] })`

### Recipe B - "Webhook not idempotent"
**Symptom:**
- Stripe webhook handler can process the same event twice (duplicate side effects).

**Root cause:**
- Missing idempotency key storage or transaction guard.

**Minimal fix:**
- Add idempotency handling per `stripe-webhooks.md` guidance.

**Verify:**
- Run e2e smoke when webhooks/checkout touched: `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

### Recipe C - "Service role misuse"
**Symptom:**
- `createAdminClient()` used on a path callable by untrusted users.

**Root cause:**
- Convenience bypassing RLS.

**Minimal fix:**
- Guard the path (admin auth or webhook signature) or refactor to RLS-safe queries.

**Verify:**
- `node .codex/skills/spec-supabase/scripts/scan.mjs`

---

## 8) Golden Path Examples (Treido-specific)

### Golden Path 1 - Context-correct Supabase clients
- `lib/supabase/server.ts:90` provides `createStaticClient()` for cached/public reads.
- `lib/supabase/server.ts:101` provides `createAdminClient()` for strictly guarded server-only work.

### Golden Path 2 - Tag invalidation after mutations
- `app/actions/reviews.ts:139` uses `revalidateTag(tag, profile)` consistently.

### Golden Path 3 - Stripe webhook entrypoints exist
- `app/api/checkout/webhook/route.ts` and `app/api/payments/webhook/route.ts` (signature verification + idempotency expected).

---

## 9) Anti-Patterns With Shame (don't do this)

### Shame 1 - "Ad-hoc DDL"
**Why it's amateur hour:**
- It creates schema drift and makes rollback impossible.

**What to do instead:**
- Append-only migrations in `supabase/migrations/*`.

### Shame 2 - "Log the webhook payload"
**Why it's amateur hour:**
- It leaks PII and secrets and breaks compliance.

**What to do instead:**
- Log minimal structured metadata (event id/type) only.

### Shame 3 - "Service role as default"
**Why it's amateur hour:**
- It bypasses RLS and turns bugs into breaches.

**What to do instead:**
- Default to RLS-safe queries; use service role only with explicit guardrails.

---

## 10) Integration With This Codebase (Treido context)

Where backend code lives:
- Server actions: `app/actions/*` and route-private `_actions/*`
- Route handlers: `app/api/**/route.ts`
- Supabase clients/types: `lib/supabase/*`
- Migrations: `supabase/migrations/*`

SSOT docs:
- `.codex/project/ARCHITECTURE.md`
- `.codex/AGENTS.md`

---

## 11) Output Format (for orchestrator)

### AUDIT mode output (read-only)
Return only the audit payload contract:
- `.codex/skills/treido-orchestrator/references/audit-payload.md`

Hard rules:
- Start with `## BACKEND`
- Findings IDs use `BE-001`, `BE-002`, ... (lane-owned; do not use `SUPABASE-*` / `NEXTJS-*`)

### IMPL mode output (writes code)
Return a short implementation summary:
- Task IDs completed
- Files changed
- Commands run (`typecheck`, `lint`, and any targeted tests)
- End with `DONE`

---

## References (load only if needed)

- `.codex/skills/treido-backend/references/00-index.md`
- `.codex/skills/treido-backend/references/decision-tree.md`
- `.codex/skills/treido-backend/references/nextjs.md`
- `.codex/skills/treido-backend/references/nextjs-server.md`
- `.codex/skills/treido-backend/references/supabase.md`
- `.codex/skills/treido-backend/references/stripe-webhooks.md`
- `.codex/skills/treido-backend/references/validation-and-typescript.md`

