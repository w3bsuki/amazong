-- Phase 4: Notification Preferences
-- Date: December 24, 2025

-- Stores per-user preferences for in-app and email notifications.

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- In-app display + toast preferences
  in_app_purchase BOOLEAN NOT NULL DEFAULT true,
  in_app_order_status BOOLEAN NOT NULL DEFAULT true,
  in_app_message BOOLEAN NOT NULL DEFAULT true,
  in_app_review BOOLEAN NOT NULL DEFAULT true,
  in_app_system BOOLEAN NOT NULL DEFAULT true,
  in_app_promotion BOOLEAN NOT NULL DEFAULT true,

  -- Email preferences (future delivery implementation)
  email_purchase BOOLEAN NOT NULL DEFAULT false,
  email_order_status BOOLEAN NOT NULL DEFAULT false,
  email_message BOOLEAN NOT NULL DEFAULT false,
  email_review BOOLEAN NOT NULL DEFAULT false,
  email_system BOOLEAN NOT NULL DEFAULT false,
  email_promotion BOOLEAN NOT NULL DEFAULT false,

  -- Push preferences (future)
  push_enabled BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION public.set_notification_preferences_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notification_preferences_updated_at ON public.notification_preferences;
CREATE TRIGGER trg_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.set_notification_preferences_updated_at();

-- RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can view own notification preferences"
  ON public.notification_preferences FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can insert own notification preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can update own notification preferences"
  ON public.notification_preferences FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
