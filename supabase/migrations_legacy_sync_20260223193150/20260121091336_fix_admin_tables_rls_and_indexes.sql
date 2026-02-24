-- Fix duplicate RLS policies on admin tables
-- Drop the duplicate named policies, keep only the admin_only catch-all (but fix it)

-- STEP 1: Drop all existing policies on admin tables
DROP POLICY IF EXISTS "Admins can delete admin docs" ON public.admin_docs;
DROP POLICY IF EXISTS "Admins can insert admin docs" ON public.admin_docs;
DROP POLICY IF EXISTS "Admins can read admin docs" ON public.admin_docs;
DROP POLICY IF EXISTS "Admins can update admin docs" ON public.admin_docs;
DROP POLICY IF EXISTS "admin_docs_admin_only" ON public.admin_docs;

DROP POLICY IF EXISTS "Admins can delete admin notes" ON public.admin_notes;
DROP POLICY IF EXISTS "Admins can insert admin notes" ON public.admin_notes;
DROP POLICY IF EXISTS "Admins can read admin notes" ON public.admin_notes;
DROP POLICY IF EXISTS "Admins can update admin notes" ON public.admin_notes;
DROP POLICY IF EXISTS "admin_notes_admin_only" ON public.admin_notes;

DROP POLICY IF EXISTS "Admins can delete admin tasks" ON public.admin_tasks;
DROP POLICY IF EXISTS "Admins can insert admin tasks" ON public.admin_tasks;
DROP POLICY IF EXISTS "Admins can read admin tasks" ON public.admin_tasks;
DROP POLICY IF EXISTS "Admins can update admin tasks" ON public.admin_tasks;
DROP POLICY IF EXISTS "admin_tasks_admin_only" ON public.admin_tasks;

-- STEP 2: Create single consolidated policies with (SELECT auth.uid()) pattern for performance
-- admin_docs
CREATE POLICY "admin_docs_admin_only" ON public.admin_docs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- admin_notes
CREATE POLICY "admin_notes_admin_only" ON public.admin_notes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- admin_tasks
CREATE POLICY "admin_tasks_admin_only" ON public.admin_tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- STEP 3: Drop duplicate indexes (keep the idx_* naming convention)
DROP INDEX IF EXISTS public.admin_docs_category_idx;
DROP INDEX IF EXISTS public.admin_docs_status_idx;
DROP INDEX IF EXISTS public.admin_docs_updated_at_idx;
DROP INDEX IF EXISTS public.admin_notes_is_pinned_idx;
DROP INDEX IF EXISTS public.admin_notes_created_at_idx;
DROP INDEX IF EXISTS public.admin_tasks_status_idx;
DROP INDEX IF EXISTS public.admin_tasks_priority_idx;
DROP INDEX IF EXISTS public.admin_tasks_due_date_idx;
DROP INDEX IF EXISTS public.admin_tasks_created_at_idx;

-- STEP 4: Add indexes for unindexed foreign keys on admin tables
CREATE INDEX IF NOT EXISTS idx_admin_docs_author_id ON public.admin_docs(author_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_author_id ON public.admin_notes(author_id);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_assigned_to ON public.admin_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_created_by ON public.admin_tasks(created_by);
;
