# P1-SUPA-02: Security Advisor

### Before Fixes (3 warnings)
1. `function_search_path_mutable` — `normalize_attribute_key` function
2. `materialized_view_in_api` — `category_stats` view
3. `auth_leaked_password_protection` — Disabled

### Actions Taken

**Fixed via migration:**
- Applied `20260120000000_fix_normalize_attribute_key_search_path`
- Added `SET search_path TO 'public'` to `normalize_attribute_key` function

**Explicitly accepted (2 warnings remain):**

1. **`materialized_view_in_api`** (`category_stats`)
   - Rationale: Intentional public read-only view for category browse UI
   - Risk: Low — read-only aggregate data, no PII
   - Status: ACCEPTED

2. **`auth_leaked_password_protection`**
   - Rationale: Dashboard-only toggle, not controllable via migrations
   - Action Required: Enable via Supabase Dashboard → Authentication → Settings
   - Reference: `TASK-enable-leaked-password-protection.md`
   - Status: ACCEPTED (requires manual dashboard action)

### After Fixes (2 accepted warnings)
Security Advisor: **0 actionable warnings** (2 explicitly accepted)
