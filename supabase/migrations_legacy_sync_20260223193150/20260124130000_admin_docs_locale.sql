-- Add locale support for admin docs (EN/BG)
-- - Enables /admin/docs to be localized by route locale
-- - Allows the same slug to exist across locales

ALTER TABLE public.admin_docs
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en';

ALTER TABLE public.admin_docs
  DROP CONSTRAINT IF EXISTS admin_docs_slug_key;

DO $$
BEGIN
  ALTER TABLE public.admin_docs
    ADD CONSTRAINT admin_docs_locale_slug_key UNIQUE (locale, slug);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_admin_docs_locale ON public.admin_docs (locale);
