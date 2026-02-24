# 08 — Frontend/Backend Alignment: End Goal

---

## Standard Server Action Flow

Every server action follows the same 5-step pattern:

```ts
"use server";

import { z } from "zod";
import { requireAuth } from "@/lib/auth/require-auth";
import { successEnvelope, errorEnvelope, type Envelope } from "@/lib/api/envelope";
import { logger } from "@/lib/logger";

const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
});

export async function updateProfile(
  formData: FormData
): Promise<Envelope<Record<string, never>, { message: string }>> {
  // 1. PARSE — Zod at boundary
  const parsed = UpdateProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return errorEnvelope({ message: parsed.error.message });
  }

  // 2. AUTH — requireAuth always
  const auth = await requireAuth();
  if (!auth) return errorEnvelope({ message: "Unauthorized" });

  // 3. DOMAIN — call lib/ function (not inline query)
  const result = await updateUserProfile(auth.userId, parsed.data);
  if (!result.ok) {
    logger.error("updateProfile failed", { userId: auth.userId, error: result.error });
    return errorEnvelope({ message: "Failed to update profile" });
  }

  // 4. REVALIDATE — cache tags
  revalidateTag(`profile-${auth.userId}`);

  // 5. RETURN — always Envelope
  return successEnvelope(undefined);
}
```

### UI Consumption (standardized)

```tsx
const result = await updateProfile(formData);

if (result.success) {
  toast.success(t("profile.updated"));
} else {
  toast.error(result.message ?? t("errors.generic"));
}
```

---

## Domain Logic Ownership

| Layer | Owns | Examples |
|-------|------|---------|
| `lib/data/**` | All database queries | `getProducts()`, `getCategories()`, `getUserProfile()` |
| `lib/auth/**` | Auth helpers | `requireAuth()`, `requireAuthOrFail()` |
| `lib/validation/**` | Zod schemas | `ProfileSchema`, `ProductSchema`, `OrderSchema` |
| `app/actions/**` | Action orchestration | Parse → Auth → lib call → revalidate → Envelope |
| `app/api/**` | HTTP surface | Webhooks, external APIs, cacheable GETs |

**Rule:** Actions and routes are THIN. Domain logic lives in `lib/`.

---

## Logging Architecture

### Before
```ts
console.error("Failed to update profile:", error);
```

### After
```ts
import { logger } from "@/lib/logger";
logger.error("Failed to update profile", { userId, error: error.message });
```

- `lib/logger.ts` wraps all production logging
- Structured output (JSON in production, pretty in development)
- Sensitive data redaction (tokens, emails, IPs)
- Environment-aware (no-op in test, verbose in dev, structured in prod)

---

## Webhook Safety (unchanged, already enforced)

```ts
// ALWAYS: constructEvent() BEFORE any DB write
const event = stripe.webhooks.constructEvent(body, sig, secret);
// Architecture test enforces this ordering
```

---

## Acceptance Criteria

- [ ] 100% of server actions return `Envelope<T, E>` (0 ad-hoc shapes)
- [ ] 100% of server actions validate input with Zod at boundary
- [ ] All domain logic in `lib/` — actions are thin orchestrators
- [ ] 0 `console.*` in production code (all through logger)
- [ ] Standard 5-step flow documented and enforced
- [ ] Route handlers similarly standardized (response helpers + error taxonomy)
- [ ] No duplicate business logic between actions and routes
