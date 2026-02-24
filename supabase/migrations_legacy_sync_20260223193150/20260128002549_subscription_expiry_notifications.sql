-- Function to create subscription expiry notifications
-- This should be called by a cron job or webhook daily

CREATE OR REPLACE FUNCTION public.create_subscription_expiry_notifications()
RETURNS void AS $$
DECLARE
  sub RECORD;
  days_until_expiry INTEGER;
  notification_title TEXT;
  notification_body TEXT;
BEGIN
  -- Loop through all active subscriptions
  FOR sub IN
    SELECT 
      s.seller_id,
      s.plan_type,
      s.expires_at,
      s.auto_renew,
      p.tier,
      EXTRACT(DAY FROM s.expires_at - NOW())::INTEGER as days_remaining
    FROM subscriptions s
    JOIN profiles p ON p.id = s.seller_id
    WHERE s.status = 'active'
      AND s.expires_at IS NOT NULL
      AND s.expires_at > NOW()
  LOOP
    days_until_expiry := sub.days_remaining;
    
    -- Send notifications at 7 days, 3 days, and 1 day before expiry
    IF days_until_expiry IN (7, 3, 1) THEN
      -- Check if notification already sent for this period
      IF NOT EXISTS (
        SELECT 1 FROM notifications 
        WHERE user_id = sub.seller_id 
          AND type = 'subscription'
          AND data->>'expiry_days' = days_until_expiry::TEXT
          AND created_at > NOW() - INTERVAL '1 day'
      ) THEN
        -- Build notification text
        IF sub.auto_renew THEN
          notification_title := CASE days_until_expiry
            WHEN 7 THEN 'Subscription renews in 7 days'
            WHEN 3 THEN 'Subscription renews in 3 days'
            WHEN 1 THEN 'Subscription renews tomorrow'
          END;
          notification_body := 'Your ' || sub.plan_type || ' subscription will automatically renew.';
        ELSE
          notification_title := CASE days_until_expiry
            WHEN 7 THEN 'Subscription expires in 7 days'
            WHEN 3 THEN 'Subscription expires in 3 days'
            WHEN 1 THEN 'Last day of your subscription'
          END;
          notification_body := 'Your ' || sub.plan_type || ' plan will expire. Reactivate to keep your benefits.';
        END IF;
        
        -- Insert notification
        INSERT INTO notifications (user_id, type, title, body, data)
        VALUES (
          sub.seller_id,
          'subscription',
          notification_title,
          notification_body,
          jsonb_build_object(
            'plan_type', sub.plan_type,
            'expires_at', sub.expires_at,
            'auto_renew', sub.auto_renew,
            'expiry_days', days_until_expiry,
            'action_url', '/account/plans'
          )
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to handle subscription expiration (downgrade to free)
-- This should be called by a cron job or webhook daily
CREATE OR REPLACE FUNCTION public.expire_subscriptions()
RETURNS void AS $$
BEGIN
  -- Mark expired subscriptions
  UPDATE subscriptions
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'active'
    AND expires_at < NOW();
    
  -- Downgrade profiles with expired subscriptions to free tier
  UPDATE profiles p
  SET 
    tier = 'free',
    boosts_remaining = 0,
    boosts_allocated = 0,
    boosts_reset_at = NULL
  WHERE EXISTS (
    SELECT 1 FROM subscriptions s 
    WHERE s.seller_id = p.id 
      AND s.status = 'expired'
      AND s.updated_at > NOW() - INTERVAL '1 minute'
  )
  AND NOT EXISTS (
    SELECT 1 FROM subscriptions s2 
    WHERE s2.seller_id = p.id 
      AND s2.status = 'active'
  );
  
  -- Send notification about expired subscription
  INSERT INTO notifications (user_id, type, title, body, data)
  SELECT 
    s.seller_id,
    'subscription',
    'Your subscription has expired',
    'You''ve been moved to the free plan. Upgrade anytime to restore your benefits.',
    jsonb_build_object(
      'plan_type', s.plan_type,
      'expired_at', s.expires_at,
      'action_url', '/account/plans'
    )
  FROM subscriptions s
  WHERE s.status = 'expired'
    AND s.updated_at > NOW() - INTERVAL '1 minute'
    AND NOT EXISTS (
      SELECT 1 FROM notifications n 
      WHERE n.user_id = s.seller_id 
        AND n.type = 'subscription'
        AND n.data->>'expired_at' = s.expires_at::TEXT
    );
END;
$$ LANGUAGE plpgsql;

-- Comment for documentation
COMMENT ON FUNCTION public.create_subscription_expiry_notifications() IS 'Creates notifications for subscriptions expiring in 7, 3, or 1 days. Should be called daily by cron.';
COMMENT ON FUNCTION public.expire_subscriptions() IS 'Expires subscriptions past their expiry date and downgrades profiles. Should be called daily by cron.';;
