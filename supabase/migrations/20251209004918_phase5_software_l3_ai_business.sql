
-- Phase 5: Software - AI & Business L3s

-- AI > Image Generation L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Stable Diffusion Models', 'Midjourney Prompts', 'DALL-E Tools', 'LoRA Models', 'Upscaling Tools', 'Photo Enhancement']),
  unnest(ARRAY['ai-img-sd', 'ai-img-mj', 'ai-img-dalle', 'ai-img-lora', 'ai-img-upscale', 'ai-img-enhance']),
  (SELECT id FROM categories WHERE slug = 'ai-image-gen'),
  unnest(ARRAY['Stable Diffusion модели', 'Midjourney промптове', 'DALL-E инструменти', 'LoRA модели', 'Инструменти за увеличаване', 'Подобряване на снимки']),
  '🎨',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- AI > Code Generation L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['GitHub Copilot', 'Code Completion', 'Code Review AI', 'Documentation AI', 'Testing AI', 'Refactoring AI']),
  unnest(ARRAY['ai-code-copilot', 'ai-code-complete', 'ai-code-review', 'ai-code-docs', 'ai-code-test', 'ai-code-refactor']),
  (SELECT id FROM categories WHERE slug = 'ai-code'),
  unnest(ARRAY['GitHub Copilot', 'Завършване на код', 'AI преглед на код', 'AI документация', 'AI тестване', 'AI рефакторинг']),
  '💻',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- AI > Writing & Content L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Blog Writing AI', 'Copywriting AI', 'Email Writing AI', 'SEO Content AI', 'Social Media AI', 'Translation AI']),
  unnest(ARRAY['ai-write-blog', 'ai-write-copy', 'ai-write-email', 'ai-write-seo', 'ai-write-social', 'ai-write-translate']),
  (SELECT id FROM categories WHERE slug = 'ai-writing'),
  unnest(ARRAY['AI за блогове', 'AI копирайтинг', 'AI имейли', 'AI SEO съдържание', 'AI за соц. мрежи', 'AI превод']),
  '✍️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Business > Accounting L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Personal Accounting', 'Small Business Accounting', 'Enterprise Accounting', 'Tax Software', 'Payroll Software', 'Expense Tracking']),
  unnest(ARRAY['acc-personal', 'acc-small-biz', 'acc-enterprise', 'acc-tax', 'acc-payroll', 'acc-expense']),
  (SELECT id FROM categories WHERE slug = 'biz-accounting'),
  unnest(ARRAY['Лично счетоводство', 'Счетоводство за МСП', 'Корпоративно счетоводство', 'Данъчен софтуер', 'Софтуер за заплати', 'Проследяване на разходи']),
  '💰',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Business > CRM L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Sales CRM', 'Marketing CRM', 'Service CRM', 'Real Estate CRM', 'Healthcare CRM', 'Small Business CRM']),
  unnest(ARRAY['crm-sales', 'crm-marketing', 'crm-service', 'crm-realestate', 'crm-healthcare', 'crm-smb']),
  (SELECT id FROM categories WHERE slug = 'biz-crm'),
  unnest(ARRAY['CRM за продажби', 'CRM за маркетинг', 'CRM за обслужване', 'CRM за недвижими имоти', 'CRM за здравеопазване', 'CRM за МСП']),
  '📊',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Business > Project Management L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Agile Tools', 'Kanban Software', 'Gantt Chart Tools', 'Resource Planning', 'Portfolio Management', 'Issue Tracking']),
  unnest(ARRAY['proj-agile', 'proj-kanban', 'proj-gantt', 'proj-resource', 'proj-portfolio', 'proj-issue']),
  (SELECT id FROM categories WHERE slug = 'biz-project-mgmt'),
  unnest(ARRAY['Agile инструменти', 'Kanban софтуер', 'Gantt диаграми', 'Планиране на ресурси', 'Управление на портфолио', 'Проследяване на задачи']),
  '📋',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Cloud > Web Hosting L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Shared Hosting', 'VPS Hosting', 'Dedicated Servers', 'WordPress Hosting', 'E-commerce Hosting', 'Managed Hosting']),
  unnest(ARRAY['host-shared', 'host-vps', 'host-dedicated', 'host-wordpress', 'host-ecommerce', 'host-managed']),
  (SELECT id FROM categories WHERE slug = 'cloud-hosting'),
  unnest(ARRAY['Споделен хостинг', 'VPS хостинг', 'Изцяло отделени сървъри', 'WordPress хостинг', 'E-commerce хостинг', 'Управляем хостинг']),
  '☁️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Cloud > Cloud Storage L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Personal Cloud Storage', 'Business Cloud Storage', 'Object Storage', 'Backup Services', 'File Sync', 'Archive Storage']),
  unnest(ARRAY['storage-personal', 'storage-business', 'storage-object', 'storage-backup', 'storage-sync', 'storage-archive']),
  (SELECT id FROM categories WHERE slug = 'cloud-storage'),
  unnest(ARRAY['Лично облачно хранилище', 'Бизнес облачно хранилище', 'Обектно хранилище', 'Услуги за резервиране', 'Синхронизация на файлове', 'Архивно хранилище']),
  '📁',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;
;
