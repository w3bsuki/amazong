-- =====================================================
-- SOFTWARE CATEGORY ATTRIBUTES - Phase 4 (Part 3)
-- Features, Capabilities & Business Attributes
-- =====================================================

INSERT INTO category_attributes (
  id, category_id, name, name_bg, attribute_type, is_required, is_filterable, 
  options, options_bg, placeholder, placeholder_bg, sort_order
) VALUES

-- =====================================================
-- FEATURES & CAPABILITIES ATTRIBUTES
-- =====================================================

-- 32. Key Features
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Key Features', 'Основни функции', 'multiselect', false, true,
'["Cloud Sync", "Real-time Collaboration", "Offline Mode", "Dark Mode", "Mobile App", "API Access", "Plugin Support", "Custom Themes", "Export Options", "Import Options", "Batch Processing", "Automation", "Templates", "AI-Powered Features", "Multi-language", "Accessibility Features"]'::jsonb,
'["Облачна синхронизация", "Сътрудничество в реално време", "Офлайн режим", "Тъмен режим", "Мобилно приложение", "API достъп", "Поддръжка на плъгини", "Персонализирани теми", "Опции за експорт", "Опции за импорт", "Групова обработка", "Автоматизация", "Шаблони", "AI функции", "Многоезичност", "Достъпност"]'::jsonb,
'Select key features', 'Изберете основни функции', 32),

-- 33. Cloud Sync
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Cloud Sync', 'Облачна синхронизация', 'select', false, true,
'["Yes - Included", "Yes - Optional", "Third-Party Integration", "No Cloud Features"]'::jsonb,
'["Да - Включена", "Да - По избор", "Интеграция с трети страни", "Без облачни функции"]'::jsonb,
'Cloud sync availability', 'Наличност на облачна синхронизация', 33),

-- 34. Offline Mode
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Offline Mode', 'Офлайн режим', 'select', false, true,
'["Full Offline Support", "Limited Offline Mode", "Online Only", "Offline After Initial Setup"]'::jsonb,
'["Пълна офлайн поддръжка", "Ограничен офлайн режим", "Само онлайн", "Офлайн след първоначална настройка"]'::jsonb,
'Offline mode availability', 'Наличност на офлайн режим', 34),

-- 35. Plugin/Extension Support
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Plugin/Extension Support', 'Поддръжка на плъгини', 'select', false, true,
'["Yes - Large Ecosystem", "Yes - Limited", "Third-Party Plugins", "No Plugins"]'::jsonb,
'["Да - Голяма екосистема", "Да - Ограничена", "Плъгини от трети страни", "Без плъгини"]'::jsonb,
'Plugin support availability', 'Наличност на плъгини', 35),

-- 36. API Access
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'API Access', 'API достъп', 'select', false, true,
'["Full REST API", "Limited API", "GraphQL", "Webhooks Only", "SDK Available", "No API"]'::jsonb,
'["Пълен REST API", "Ограничен API", "GraphQL", "Само Webhooks", "SDK наличен", "Без API"]'::jsonb,
'API access availability', 'Наличност на API достъп', 36),

-- 37. Third-Party Integrations
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Third-Party Integrations', 'Интеграции с трети страни', 'multiselect', false, true,
'["Google Workspace", "Microsoft 365", "Slack", "Zapier", "Dropbox", "OneDrive", "Salesforce", "HubSpot", "QuickBooks", "Adobe Creative Cloud", "GitHub", "Jira", "Trello", "Notion", "Discord"]'::jsonb,
'["Google Workspace", "Microsoft 365", "Slack", "Zapier", "Dropbox", "OneDrive", "Salesforce", "HubSpot", "QuickBooks", "Adobe Creative Cloud", "GitHub", "Jira", "Trello", "Notion", "Discord"]'::jsonb,
'Select available integrations', 'Изберете налични интеграции', 37),

-- 38. Collaboration Features
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Collaboration Features', 'Функции за сътрудничество', 'multiselect', false, true,
'["Real-time Editing", "Comments", "Version History", "User Permissions", "Team Workspaces", "Guest Access", "Share Links", "Audit Logs"]'::jsonb,
'["Редактиране в реално време", "Коментари", "История на версиите", "Потребителски права", "Екипни работни пространства", "Гост достъп", "Линкове за споделяне", "Одит логове"]'::jsonb,
'Select collaboration features', 'Изберете функции за сътрудничество', 38),

-- 39. Security Features
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Security Features', 'Функции за сигурност', 'multiselect', false, true,
'["Two-Factor Authentication", "SSO/SAML", "Encryption at Rest", "Encryption in Transit", "HIPAA Compliant", "SOC 2 Certified", "GDPR Compliant", "Password Protection", "IP Restrictions", "Role-Based Access"]'::jsonb,
'["Двуфакторна автентикация", "SSO/SAML", "Криптиране в покой", "Криптиране при трансфер", "HIPAA съвместим", "SOC 2 сертифициран", "GDPR съвместим", "Парола защита", "IP ограничения", "Достъп базиран на роли"]'::jsonb,
'Select security features', 'Изберете функции за сигурност', 39),

-- =====================================================
-- BUSINESS/BULGARIAN-SPECIFIC ATTRIBUTES
-- =====================================================

-- 40. Invoice Available
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Invoice Available', 'Фактура', 'select', false, true,
'["Yes - Bulgarian Invoice", "Yes - EU Invoice", "Yes - International", "No Invoice"]'::jsonb,
'["Да - Българска фактура", "Да - ЕС фактура", "Да - Международна", "Без фактура"]'::jsonb,
'Invoice availability', 'Наличност на фактура', 40),

-- 41. VAT Included
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'VAT Included', 'ДДС включено', 'select', false, true,
'["Yes - 20% VAT Included", "No - VAT Extra", "VAT Exempt", "Reverse Charge"]'::jsonb,
'["Да - 20% ДДС включено", "Не - ДДС допълнително", "Освободен от ДДС", "Обратно начисляване"]'::jsonb,
'VAT status', 'Статус на ДДС', 41),

-- 42. Local Support
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Local Support', 'Локална поддръжка', 'select', false, true,
'["Bulgarian Support Available", "EU Support Only", "International Support Only", "No Support"]'::jsonb,
'["Българска поддръжка", "Само ЕС поддръжка", "Само международна поддръжка", "Без поддръжка"]'::jsonb,
'Local support availability', 'Наличност на локална поддръжка', 42),

-- 43. GDPR Compliant
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'GDPR Compliant', 'GDPR съвместим', 'select', false, true,
'["Yes - Fully Compliant", "Partial Compliance", "Not Applicable", "Unknown"]'::jsonb,
'["Да - Пълна съвместимост", "Частична съвместимост", "Не е приложимо", "Неизвестно"]'::jsonb,
'GDPR compliance status', 'Статус на GDPR съвместимост', 43),

-- 44. License Region
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'License Region', 'Регион на лиценза', 'select', false, true,
'["Global (Worldwide)", "Europe Only", "EU Only", "Bulgaria Only", "USA Only", "Region Locked", "No Restrictions"]'::jsonb,
'["Глобален (Световен)", "Само Европа", "Само ЕС", "Само България", "Само САЩ", "Регионално ограничен", "Без ограничения"]'::jsonb,
'License region', 'Регион на лиценза', 44),

-- 45. Payment Methods
(gen_random_uuid(), '659a9e6a-4034-403c-bc58-6185d1ee991d',
'Payment Methods', 'Методи на плащане', 'multiselect', false, true,
'["Credit Card", "Debit Card", "PayPal", "Bank Transfer", "ePay.bg", "EasyPay", "Cash on Delivery", "Crypto", "Invoice/PO"]'::jsonb,
'["Кредитна карта", "Дебитна карта", "PayPal", "Банков превод", "ePay.bg", "EasyPay", "Наложен платеж", "Криптовалута", "Фактура/Поръчка"]'::jsonb,
'Accepted payment methods', 'Приемани методи на плащане', 45);
;
