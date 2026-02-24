
-- Phase 5: Services - Construction & Business L3s

-- Construction > Kitchen Remodeling L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Cabinet Installation', 'Countertop Installation', 'Kitchen Plumbing', 'Kitchen Electrical', 'Kitchen Flooring', 'Appliance Installation']),
  unnest(ARRAY['kitchen-cabinets', 'kitchen-countertops', 'kitchen-plumbing', 'kitchen-electrical', 'kitchen-flooring', 'kitchen-appliances']),
  (SELECT id FROM categories WHERE slug = 'construction-kitchen'),
  unnest(ARRAY['Монтаж на шкафове', 'Монтаж на плотове', 'Кухненски ВиК', 'Кухненска електроинсталация', 'Кухненски подове', 'Монтаж на уреди']),
  '🍳',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Construction > Bathroom Remodeling L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Shower Installation', 'Bathtub Installation', 'Bathroom Tiling', 'Vanity Installation', 'Bathroom Plumbing', 'Bathroom Ventilation']),
  unnest(ARRAY['bath-shower', 'bath-tub', 'bath-tiling', 'bath-vanity', 'bath-plumbing', 'bath-ventilation']),
  (SELECT id FROM categories WHERE slug = 'construction-bathroom'),
  unnest(ARRAY['Монтаж на душ', 'Монтаж на вана', 'Облицовка на баня', 'Монтаж на умивалник', 'ВиК за баня', 'Вентилация на баня']),
  '🚿',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Construction > General Contractors L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['New Home Construction', 'Home Additions', 'Commercial Construction', 'Custom Builds', 'Project Management', 'Permit Services']),
  unnest(ARRAY['gc-new-home', 'gc-additions', 'gc-commercial', 'gc-custom', 'gc-project-mgmt', 'gc-permits']),
  (SELECT id FROM categories WHERE slug = 'construction-general'),
  unnest(ARRAY['Ново строителство', 'Пристроявания', 'Комерсиално строителство', 'Строежи по поръчка', 'Управление на проект', 'Разрешителни']),
  '🏗️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Business > Marketing Services L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Digital Marketing', 'Social Media Marketing', 'SEO Services', 'Content Marketing', 'Email Marketing', 'PPC Advertising']),
  unnest(ARRAY['mkt-digital', 'mkt-social', 'mkt-seo', 'mkt-content', 'mkt-email', 'mkt-ppc']),
  (SELECT id FROM categories WHERE slug = 'business-marketing'),
  unnest(ARRAY['Дигитален маркетинг', 'Маркетинг в соц. мрежи', 'SEO услуги', 'Контент маркетинг', 'Имейл маркетинг', 'PPC реклама']),
  '📣',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Business > Translation Services L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Document Translation', 'Website Translation', 'Technical Translation', 'Legal Translation', 'Medical Translation', 'Interpretation Services']),
  unnest(ARRAY['trans-document', 'trans-website', 'trans-technical', 'trans-legal', 'trans-medical', 'trans-interpretation']),
  (SELECT id FROM categories WHERE slug = 'business-translation'),
  unnest(ARRAY['Превод на документи', 'Превод на уебсайт', 'Технически превод', 'Правен превод', 'Медицински превод', 'Устен превод']),
  '🌐',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Business > Legal Services L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Contract Law', 'Corporate Law', 'Family Law', 'Real Estate Law', 'Intellectual Property', 'Immigration Law']),
  unnest(ARRAY['legal-contract', 'legal-corporate', 'legal-family', 'legal-realestate', 'legal-ip', 'legal-immigration']),
  (SELECT id FROM categories WHERE slug = 'business-legal'),
  unnest(ARRAY['Договорно право', 'Корпоративно право', 'Семейно право', 'Имотно право', 'Интелектуална собственост', 'Имиграционно право']),
  '⚖️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Business > Accounting L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Tax Preparation', 'Bookkeeping', 'Payroll Services', 'Financial Reporting', 'Audit Services', 'Tax Planning']),
  unnest(ARRAY['acct-tax-prep', 'acct-bookkeeping', 'acct-payroll', 'acct-reporting', 'acct-audit', 'acct-tax-planning']),
  (SELECT id FROM categories WHERE slug = 'business-accounting'),
  unnest(ARRAY['Изготвяне на данъци', 'Счетоводство', 'Заплати', 'Финансови отчети', 'Одит услуги', 'Данъчно планиране']),
  '📊',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;
;
