-- Admin Docs: Operational documentation for the business
CREATE TABLE admin_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT, -- Markdown content
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Tasks: Internal task/todo management
CREATE TABLE admin_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Notes: Quick internal notes
CREATE TABLE admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  is_pinned BOOLEAN DEFAULT false,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Admin-only access
CREATE POLICY "admin_docs_admin_only" ON admin_docs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_tasks_admin_only" ON admin_tasks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_notes_admin_only" ON admin_notes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes
CREATE INDEX idx_admin_docs_category ON admin_docs(category);
CREATE INDEX idx_admin_docs_status ON admin_docs(status);
CREATE INDEX idx_admin_tasks_status ON admin_tasks(status);
CREATE INDEX idx_admin_tasks_priority ON admin_tasks(priority);
CREATE INDEX idx_admin_notes_pinned ON admin_notes(is_pinned);

-- Insert starter docs
INSERT INTO admin_docs (title, slug, category, status, content) VALUES
('Return Policy', 'return-policy', 'policies', 'draft', '# Return Policy

## Overview
Define your return policy here.

## Eligibility
- Items must be returned within X days
- Original packaging required

## Process
1. Buyer requests return
2. Seller approves/denies
3. Item shipped back
4. Refund processed'),

('Payment Processing', 'payment-processing', 'payments', 'draft', '# Payment Processing

## Stripe Integration
- All payments through Stripe
- Platform fee: X%
- Payout schedule: Weekly

## Seller Payouts
- Stripe Connect for seller payouts
- Minimum payout: €X'),

('Subscription Plans', 'subscription-plans', 'plans', 'draft', '# Subscription Plans

## Personal Plans
- Free: 0 BGN/month
- Starter: X BGN/month
- Basic: X BGN/month

## Business Plans
- Professional: X BGN/month
- Business: X BGN/month
- Enterprise: Custom'),

('Product Roadmap', 'roadmap', 'roadmap', 'draft', '# Product Roadmap

## Q1 2026
- [ ] Launch MVP
- [ ] Implement subscriptions
- [ ] Mobile optimization

## Q2 2026
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support'),

('Seller Guidelines', 'seller-guidelines', 'policies', 'draft', '# Seller Guidelines

## Listing Requirements
- Clear product photos
- Accurate descriptions
- Fair pricing

## Prohibited Items
- Counterfeit goods
- Illegal items
- Weapons');

-- Insert starter tasks
INSERT INTO admin_tasks (title, description, status, priority) VALUES
('Fix double stock decrement on checkout', 'Supabase triggers issue - order_items has 2 triggers', 'todo', 'urgent'),
('Create avatars storage bucket', 'App uploads to avatars but DB only has product-images', 'todo', 'urgent'),
('Create Stripe products/prices', 'Set up subscription tiers in Stripe', 'todo', 'urgent'),
('Enable leaked password protection', 'Supabase security advisor recommends this', 'todo', 'high'),
('Finalize pricing in BGN', 'Decide customer-facing prices incl/excl VAT', 'todo', 'high');

COMMENT ON TABLE admin_docs IS 'Internal operational documentation (policies, guides, roadmap)';
COMMENT ON TABLE admin_tasks IS 'Internal task management for admins';
COMMENT ON TABLE admin_notes IS 'Quick internal notes for admins';;
