-- Migration: Admin operations tables (docs, tasks, notes)
-- Date: 2026-01-20
--
-- Purpose:
-- - Ensure /admin/docs, /admin/tasks, /admin/notes have first-class tables
-- - Lock access down to admins via RLS (public.is_admin())
--
-- Notes:
-- - We intentionally keep created_at/updated_at nullable (but defaulted) to match generated TS types.
-- - Requires public.handle_updated_at() (created in earlier migrations).

-- =============================================================================
-- Tables
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.admin_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  content text NULL,
  category text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'draft',
  author_id uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NULL DEFAULT timezone('utc'::text, now())
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_docs_slug_key ON public.admin_docs (slug);
CREATE INDEX IF NOT EXISTS admin_docs_category_idx ON public.admin_docs (category);
CREATE INDEX IF NOT EXISTS admin_docs_status_idx ON public.admin_docs (status);
CREATE INDEX IF NOT EXISTS admin_docs_updated_at_idx ON public.admin_docs (updated_at);

CREATE TABLE IF NOT EXISTS public.admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NULL,
  is_pinned boolean NULL DEFAULT false,
  author_id uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS admin_notes_is_pinned_idx ON public.admin_notes (is_pinned);
CREATE INDEX IF NOT EXISTS admin_notes_created_at_idx ON public.admin_notes (created_at);

CREATE TABLE IF NOT EXISTS public.admin_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NULL,
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  due_date date NULL,
  assigned_to uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS admin_tasks_status_idx ON public.admin_tasks (status);
CREATE INDEX IF NOT EXISTS admin_tasks_priority_idx ON public.admin_tasks (priority);
CREATE INDEX IF NOT EXISTS admin_tasks_due_date_idx ON public.admin_tasks (due_date);
CREATE INDEX IF NOT EXISTS admin_tasks_created_at_idx ON public.admin_tasks (created_at);

-- =============================================================================
-- updated_at triggers (uses public.handle_updated_at())
-- =============================================================================

DROP TRIGGER IF EXISTS handle_admin_docs_updated_at ON public.admin_docs;
CREATE TRIGGER handle_admin_docs_updated_at
  BEFORE UPDATE ON public.admin_docs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_admin_notes_updated_at ON public.admin_notes;
CREATE TRIGGER handle_admin_notes_updated_at
  BEFORE UPDATE ON public.admin_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_admin_tasks_updated_at ON public.admin_tasks;
CREATE TRIGGER handle_admin_tasks_updated_at
  BEFORE UPDATE ON public.admin_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- RLS (admin-only)
-- =============================================================================

ALTER TABLE public.admin_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read admin docs" ON public.admin_docs;
CREATE POLICY "Admins can read admin docs"
  ON public.admin_docs
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert admin docs" ON public.admin_docs;
CREATE POLICY "Admins can insert admin docs"
  ON public.admin_docs
  FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update admin docs" ON public.admin_docs;
CREATE POLICY "Admins can update admin docs"
  ON public.admin_docs
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete admin docs" ON public.admin_docs;
CREATE POLICY "Admins can delete admin docs"
  ON public.admin_docs
  FOR DELETE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read admin notes" ON public.admin_notes;
CREATE POLICY "Admins can read admin notes"
  ON public.admin_notes
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert admin notes" ON public.admin_notes;
CREATE POLICY "Admins can insert admin notes"
  ON public.admin_notes
  FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update admin notes" ON public.admin_notes;
CREATE POLICY "Admins can update admin notes"
  ON public.admin_notes
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete admin notes" ON public.admin_notes;
CREATE POLICY "Admins can delete admin notes"
  ON public.admin_notes
  FOR DELETE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read admin tasks" ON public.admin_tasks;
CREATE POLICY "Admins can read admin tasks"
  ON public.admin_tasks
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert admin tasks" ON public.admin_tasks;
CREATE POLICY "Admins can insert admin tasks"
  ON public.admin_tasks
  FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update admin tasks" ON public.admin_tasks;
CREATE POLICY "Admins can update admin tasks"
  ON public.admin_tasks
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete admin tasks" ON public.admin_tasks;
CREATE POLICY "Admins can delete admin tasks"
  ON public.admin_tasks
  FOR DELETE
  USING (public.is_admin());;
