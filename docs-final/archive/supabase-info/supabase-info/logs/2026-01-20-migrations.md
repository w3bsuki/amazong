# P1-SUPA-01: Critical Migrations Verification

**Verified in production** (via `supabase_migrations.schema_migrations`):

| Migration | Version | Status |
|-----------|---------|--------|
| `fix_double_stock_decrement` | 20260110182418 | ✅ Applied |
| `fix_handle_order_item_status_change` | 20260110182427 | ✅ Applied |
| `ensure_avatars_bucket_and_policies` | 20260110182439 | ✅ Applied |

**Additional migrations verified:**
- `20260119230508_buyer_protection_fees` — Latest migration (confirms DB sync)
- Total migrations in production: 800+
