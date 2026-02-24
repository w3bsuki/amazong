-- Fix Performance Advisor: duplicate_index on public.admin_docs (locale)
-- Keep idx_admin_docs_locale (created in 20260124130000_admin_docs_locale.sql)
-- Drop admin_docs_locale_idx (duplicate).

DROP INDEX IF EXISTS public.admin_docs_locale_idx;
