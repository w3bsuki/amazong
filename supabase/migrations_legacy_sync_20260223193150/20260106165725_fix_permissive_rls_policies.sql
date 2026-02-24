-- Fix notifications INSERT policy: scope to service_role only
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix user_badges INSERT policy: scope to service_role only
DROP POLICY IF EXISTS "user_badges_insert_system" ON public.user_badges;
CREATE POLICY "user_badges_insert_system"
  ON public.user_badges FOR INSERT
  TO service_role
  WITH CHECK (true);;
