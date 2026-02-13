# PROD-DATA-002 — Junk listings in production (Runbook)

## Goal

Remove obvious junk/test listings from production **safely** (reversible), and prevent future junk from becoming publicly visible.

This runbook uses **archiving** (`products.status = 'archived'`) instead of hard deletes.

## Safety rules

- **Do not hard delete** product rows in production.
- Prefer reversible changes: `status='archived'`.
- Do not paste or commit production credentials anywhere.
- Always do a **dry run** first and review candidates.

## What “junk” means (examples)

- Titles like `asadsdasdasd`, `1111111111`, random keyboard spam, or pure numeric titles.
- Extreme repeated characters / very low variety.
- Placeholder-like or absurd metadata (obvious test data).

## Step 0 — Confirm the app is filtering out archived/draft listings

Before changing production data, ensure code is deployed that only shows:

- `status = 'active'`, plus a temporary legacy allowance for `status IS NULL`.

This ensures archiving actually removes listings from public surfaces.

## Step 1 — Identify candidates (SQL)

Run a **read-only** query first to review candidates.

Example candidates query (tune thresholds as needed):

```sql
select
  id,
  title,
  status,
  created_at,
  seller_id
from public.products
where (status = 'active' or status is null)
  and (
    length(btrim(title)) < 5
    or btrim(title) ~ '^[0-9]+$'
    or btrim(title) ~ '^(.)\1{6,}$'
    or (length(regexp_replace(btrim(title), '\s+', '', 'g')) >= 10
        and length(regexp_replace(regexp_replace(btrim(title), '\s+', '', 'g'), '[^0-9]', '', 'g'))::int::text) > 0)
  )
order by created_at desc
limit 200;
```

Notes:
- Keep the query conservative (false positives are costly).
- If you have known junk IDs, skip heuristics and target explicit IDs.

## Step 2 — Archive (reversible)

Prefer updating a reviewed list of IDs:

```sql
update public.products
set status = 'archived',
    updated_at = now()
where id = any (array[
  -- paste reviewed UUIDs here
]);
```

## Step 3 — Spot-check (manual)

As a guest in production:

- `/bg/search` (try a common query)
- `/bg/categories/fashion` (and a few top categories)
- verify junk listings no longer appear

## Step 4 — Rollback (if needed)

If you archived legitimate listings by mistake:

```sql
update public.products
set status = 'active',
    updated_at = now()
where id = any (array[
  -- ids to restore
]);
```

## Optional: Scripted workflow (recommended for repeatability)

Use `scripts/prod/archive-junk-products.mjs` in **dry-run** mode first.

### Dry run (default)

```bash
node scripts/prod/archive-junk-products.mjs --limit 200 --export junk-candidates.json
```

### Apply (requires explicit confirmation)

```bash
SUPABASE_URL="https://YOUR_PROJECT.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY" \
node scripts/prod/archive-junk-products.mjs --apply --yes --limit 200
```

## Post-cleanup checklist

- Re-run a production spot-check of search + top categories.
- Confirm no new junk is getting published (title validation + status gating).
- Add a quick “catalog sanity” item to launch/deploy checklists.

