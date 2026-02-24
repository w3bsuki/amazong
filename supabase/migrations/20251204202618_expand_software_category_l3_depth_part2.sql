-- =====================================================
-- SOFTWARE CATEGORY EXPANSION - Phase 3: L3 Categories (Part 2)
-- Games, Development, Business, AI & Machine Learning
-- =====================================================

DO $$
DECLARE
  v_parent_id UUID;
BEGIN

-- =====================================================
-- L3 CATEGORIES - GAMES & ENTERTAINMENT
-- =====================================================

-- Action Games L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'games-action';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('First-Person Shooters', 'FPS игри', 'action-fps', '🔫', v_parent_id, 1),
('Third-Person Shooters', 'TPS игри', 'action-tps', '🔫', v_parent_id, 2),
('Battle Royale', 'Battle Royale', 'action-br', '🏆', v_parent_id, 3),
('Hack and Slash', 'Hack and Slash', 'action-hack', '⚔️', v_parent_id, 4),
('Fighting Games', 'Бойни игри', 'action-fighting', '🥊', v_parent_id, 5),
('Stealth Games', 'Стелт игри', 'action-stealth', '🥷', v_parent_id, 6);

-- RPG Games L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'games-rpg';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Action RPG', 'Екшън RPG', 'rpg-action', '⚔️', v_parent_id, 1),
('JRPG', 'JRPG', 'rpg-jrpg', '🎎', v_parent_id, 2),
('Western RPG', 'Западни RPG', 'rpg-western', '🗡️', v_parent_id, 3),
('Turn-Based RPG', 'Походови RPG', 'rpg-turnbased', '♟️', v_parent_id, 4),
('Open World RPG', 'Отворен свят RPG', 'rpg-openworld', '🌍', v_parent_id, 5),
('Roguelike', 'Roguelike', 'rpg-roguelike', '💀', v_parent_id, 6);

-- Strategy Games L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'games-strategy';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Real-Time Strategy', 'RTS игри', 'strategy-rts', '⏱️', v_parent_id, 1),
('Turn-Based Strategy', 'Походови стратегии', 'strategy-tbs', '♟️', v_parent_id, 2),
('4X Strategy', '4X стратегии', 'strategy-4x', '🌐', v_parent_id, 3),
('Tower Defense', 'Tower Defense', 'strategy-td', '🗼', v_parent_id, 4),
('Grand Strategy', 'Гранд стратегии', 'strategy-grand', '👑', v_parent_id, 5),
('MOBA', 'MOBA', 'strategy-moba', '🎮', v_parent_id, 6);

-- Simulation Games L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'games-simulation';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Life Simulation', 'Симулатори на живот', 'sim-life', '🏠', v_parent_id, 1),
('City Builders', 'Градостроители', 'sim-city', '🏙️', v_parent_id, 2),
('Farming Simulation', 'Фермерски симулатори', 'sim-farming', '🚜', v_parent_id, 3),
('Flight Simulation', 'Самолетни симулатори', 'sim-flight', '✈️', v_parent_id, 4),
('Vehicle Simulation', 'Автомобилни симулатори', 'sim-vehicle', '🚗', v_parent_id, 5),
('Management Simulation', 'Мениджмънт симулатори', 'sim-management', '📊', v_parent_id, 6);

-- Sports & Racing L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'games-sports';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Racing Games', 'Състезателни игри', 'sports-racing', '🏎️', v_parent_id, 1),
('Football/Soccer', 'Футбол', 'sports-football', '⚽', v_parent_id, 2),
('Basketball', 'Баскетбол', 'sports-basketball', '🏀', v_parent_id, 3),
('Combat Sports', 'Бойни спортове', 'sports-combat', '🥊', v_parent_id, 4),
('Extreme Sports', 'Екстремни спортове', 'sports-extreme', '🏂', v_parent_id, 5),
('Golf & Tennis', 'Голф и тенис', 'sports-golf', '🎾', v_parent_id, 6);

-- Game Subscriptions L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'games-subscriptions';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Xbox Game Pass', 'Xbox Game Pass', 'sub-gamepass', '🎮', v_parent_id, 1),
('PlayStation Plus', 'PlayStation Plus', 'sub-psplus', '🎮', v_parent_id, 2),
('EA Play', 'EA Play', 'sub-eaplay', '🎮', v_parent_id, 3),
('Ubisoft+', 'Ubisoft+', 'sub-ubisoft', '🎮', v_parent_id, 4),
('Nintendo Switch Online', 'Nintendo Switch Online', 'sub-nintendo', '🎮', v_parent_id, 5),
('Humble Bundle', 'Humble Bundle', 'sub-humble', '📦', v_parent_id, 6);

-- =====================================================
-- L3 CATEGORIES - WEB & DEVELOPMENT
-- =====================================================

-- IDEs L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'dev-ide';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Visual Studio', 'Visual Studio', 'ide-vs', '💜', v_parent_id, 1),
('VS Code', 'VS Code', 'ide-vscode', '💙', v_parent_id, 2),
('JetBrains IDEs', 'JetBrains IDE', 'ide-jetbrains', '🧠', v_parent_id, 3),
('Xcode', 'Xcode', 'ide-xcode', '🔨', v_parent_id, 4),
('Android Studio', 'Android Studio', 'ide-android', '🤖', v_parent_id, 5),
('Eclipse', 'Eclipse', 'ide-eclipse', '🌑', v_parent_id, 6),
('Cloud IDEs', 'Облачни IDE', 'ide-cloud', '☁️', v_parent_id, 7),
('Code Editors', 'Редактори на код', 'ide-editors', '📝', v_parent_id, 8);

-- Database Tools L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'dev-database';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('SQL Clients', 'SQL клиенти', 'db-sql', '🗄️', v_parent_id, 1),
('NoSQL Tools', 'NoSQL инструменти', 'db-nosql', '🗄️', v_parent_id, 2),
('Database Design', 'Дизайн на бази данни', 'db-design', '📐', v_parent_id, 3),
('Data Migration', 'Миграция на данни', 'db-migration', '🔄', v_parent_id, 4),
('Database Monitoring', 'Мониторинг на бази данни', 'db-monitor', '📊', v_parent_id, 5),
('Backup & Recovery', 'Архивиране и възстановяване', 'db-backup', '💾', v_parent_id, 6);

-- API Development L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'dev-api';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Postman & API Clients', 'Postman и API клиенти', 'api-clients', '🔌', v_parent_id, 1),
('API Documentation', 'API документация', 'api-docs', '📖', v_parent_id, 2),
('API Mocking', 'API имитиране', 'api-mock', '🎭', v_parent_id, 3),
('GraphQL Tools', 'GraphQL инструменти', 'api-graphql', '📊', v_parent_id, 4),
('REST Tools', 'REST инструменти', 'api-rest', '🔄', v_parent_id, 5);

-- Testing & QA L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'dev-testing';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Unit Testing', 'Единични тестове', 'test-unit', '🧪', v_parent_id, 1),
('End-to-End Testing', 'E2E тестване', 'test-e2e', '🔄', v_parent_id, 2),
('Load Testing', 'Тест за натоварване', 'test-load', '📈', v_parent_id, 3),
('Security Testing', 'Тест за сигурност', 'test-security', '🔒', v_parent_id, 4),
('Bug Tracking', 'Проследяване на бъгове', 'test-bugs', '🐛', v_parent_id, 5),
('Test Management', 'Управление на тестове', 'test-management', '📋', v_parent_id, 6);

-- DevOps Tools L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'dev-devops';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('CI/CD Tools', 'CI/CD инструменти', 'devops-cicd', '🔄', v_parent_id, 1),
('Container Tools', 'Контейнер инструменти', 'devops-containers', '📦', v_parent_id, 2),
('Infrastructure as Code', 'Инфраструктура като код', 'devops-iac', '🏗️', v_parent_id, 3),
('Monitoring & Logging', 'Мониторинг и логове', 'devops-monitoring', '📊', v_parent_id, 4),
('Configuration Management', 'Управление на конфигурации', 'devops-config', '⚙️', v_parent_id, 5);

-- =====================================================
-- L3 CATEGORIES - BUSINESS SOFTWARE
-- =====================================================

-- Accounting L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'biz-accounting';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Personal Finance', 'Лични финанси', 'acc-personal', '💰', v_parent_id, 1),
('Small Business Accounting', 'Счетоводство за малък бизнес', 'acc-small', '🏪', v_parent_id, 2),
('Enterprise Accounting', 'Корпоративно счетоводство', 'acc-enterprise', '🏢', v_parent_id, 3),
('Tax Software', 'Данъчен софтуер', 'acc-tax', '📊', v_parent_id, 4),
('Payroll Software', 'Софтуер за заплати', 'acc-payroll', '💵', v_parent_id, 5),
('Bulgarian Accounting', 'Българско счетоводство', 'acc-bulgaria', '🇧🇬', v_parent_id, 6);

-- CRM L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'biz-crm';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Salesforce', 'Salesforce', 'crm-salesforce', '☁️', v_parent_id, 1),
('HubSpot', 'HubSpot', 'crm-hubspot', '🧡', v_parent_id, 2),
('Zoho CRM', 'Zoho CRM', 'crm-zoho', '🔵', v_parent_id, 3),
('Pipedrive', 'Pipedrive', 'crm-pipedrive', '💼', v_parent_id, 4),
('Microsoft Dynamics', 'Microsoft Dynamics', 'crm-dynamics', '💜', v_parent_id, 5),
('Monday CRM', 'Monday CRM', 'crm-monday', '🔴', v_parent_id, 6);

-- Invoicing L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'biz-invoicing';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('FreshBooks', 'FreshBooks', 'inv-freshbooks', '🧾', v_parent_id, 1),
('QuickBooks', 'QuickBooks', 'inv-quickbooks', '🧾', v_parent_id, 2),
('Wave', 'Wave', 'inv-wave', '🌊', v_parent_id, 3),
('Xero', 'Xero', 'inv-xero', '💙', v_parent_id, 4),
('Bulgarian Invoicing', 'Българско фактуриране', 'inv-bulgaria', '🇧🇬', v_parent_id, 5),
('E-invoicing Solutions', 'Електронно фактуриране', 'inv-einvoice', '📧', v_parent_id, 6);

-- =====================================================
-- L3 CATEGORIES - AI & MACHINE LEARNING (KEY!)
-- =====================================================

-- AI Assistants L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'ai-assistants';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('ChatGPT Plus', 'ChatGPT Plus', 'ai-chatgpt', '🤖', v_parent_id, 1),
('Claude Pro', 'Claude Pro', 'ai-claude', '🤖', v_parent_id, 2),
('Gemini Advanced', 'Gemini Advanced', 'ai-gemini', '✨', v_parent_id, 3),
('Microsoft Copilot', 'Microsoft Copilot', 'ai-copilot', '💜', v_parent_id, 4),
('Perplexity AI', 'Perplexity AI', 'ai-perplexity', '🔍', v_parent_id, 5),
('Custom AI Assistants', 'Персонализирани AI асистенти', 'ai-custom', '🛠️', v_parent_id, 6),
('AI-Powered Search', 'AI търсене', 'ai-search', '🔎', v_parent_id, 7);

-- AI Image Generation L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'ai-image-gen';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Midjourney Subscriptions', 'Midjourney абонаменти', 'aimg-midjourney', '🎨', v_parent_id, 1),
('DALL-E Credits', 'DALL-E кредити', 'aimg-dalle', '🖼️', v_parent_id, 2),
('Stable Diffusion Tools', 'Stable Diffusion инструменти', 'aimg-sd', '🌊', v_parent_id, 3),
('AI Art Generators', 'AI генератори на изкуство', 'aimg-art', '🎭', v_parent_id, 4),
('AI Portrait Tools', 'AI портретни инструменти', 'aimg-portrait', '👤', v_parent_id, 5),
('AI Logo Generators', 'AI генератори на лога', 'aimg-logo', '🏷️', v_parent_id, 6),
('AI Stock Images', 'AI стокови изображения', 'aimg-stock', '📷', v_parent_id, 7);

-- AI Video & Animation L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'ai-video';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('AI Video Generators', 'AI видео генератори', 'avid-gen', '🎬', v_parent_id, 1),
('AI Animation Tools', 'AI анимационни инструменти', 'avid-anim', '🎞️', v_parent_id, 2),
('AI Video Editing', 'AI видео редактиране', 'avid-edit', '✂️', v_parent_id, 3),
('AI Avatar Creators', 'AI създатели на аватари', 'avid-avatar', '👤', v_parent_id, 4),
('Deepfake Tools', 'Deepfake инструменти', 'avid-deepfake', '🎭', v_parent_id, 5),
('AI Lip Sync', 'AI синхронизация на устни', 'avid-lipsync', '💋', v_parent_id, 6);

-- AI Audio & Music L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'ai-audio';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('AI Music Generators', 'AI музикални генератори', 'aaud-music', '🎵', v_parent_id, 1),
('AI Voice Cloning', 'AI клониране на глас', 'aaud-voice', '🎤', v_parent_id, 2),
('Text-to-Speech AI', 'AI текст към реч', 'aaud-tts', '🗣️', v_parent_id, 3),
('Speech-to-Text AI', 'AI реч към текст', 'aaud-stt', '📝', v_parent_id, 4),
('AI Podcast Tools', 'AI подкаст инструменти', 'aaud-podcast', '🎙️', v_parent_id, 5),
('AI Sound Effects', 'AI звукови ефекти', 'aaud-sfx', '🔊', v_parent_id, 6);

-- AI Writing & Content L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'ai-writing';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('AI Copywriting', 'AI копирайтинг', 'awrt-copy', '✍️', v_parent_id, 1),
('AI Blog Writers', 'AI писатели на блогове', 'awrt-blog', '📝', v_parent_id, 2),
('AI SEO Content', 'AI SEO съдържание', 'awrt-seo', '🔍', v_parent_id, 3),
('AI Translation', 'AI превод', 'awrt-translate', '🌐', v_parent_id, 4),
('AI Grammar Tools', 'AI граматически инструменти', 'awrt-grammar', '📖', v_parent_id, 5),
('AI Story Generators', 'AI генератори на истории', 'awrt-story', '📚', v_parent_id, 6),
('AI Email Writers', 'AI писатели на имейли', 'awrt-email', '📧', v_parent_id, 7);

-- AI Code Generation L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'ai-code';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('GitHub Copilot', 'GitHub Copilot', 'acode-copilot', '🤖', v_parent_id, 1),
('Cursor IDE', 'Cursor IDE', 'acode-cursor', '💻', v_parent_id, 2),
('Tabnine', 'Tabnine', 'acode-tabnine', '🔮', v_parent_id, 3),
('Codeium', 'Codeium', 'acode-codeium', '⚡', v_parent_id, 4),
('Amazon CodeWhisperer', 'Amazon CodeWhisperer', 'acode-aws', '🌩️', v_parent_id, 5),
('AI Code Review', 'AI преглед на код', 'acode-review', '🔍', v_parent_id, 6),
('AI Debugging Tools', 'AI инструменти за дебъгване', 'acode-debug', '🐛', v_parent_id, 7);

-- AI Marketplace L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'ai-marketplace';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('AI-Generated Art Sales', 'Продажба на AI изкуство', 'aimarket-art', '🖼️', v_parent_id, 1),
('AI-Generated Music', 'AI-генерирана музика', 'aimarket-music', '🎵', v_parent_id, 2),
('AI-Generated Content Packs', 'AI пакети със съдържание', 'aimarket-packs', '📦', v_parent_id, 3),
('AI Prompts & Templates', 'AI промпти и шаблони', 'aimarket-prompts', '📋', v_parent_id, 4),
('AI Models & Fine-tunes', 'AI модели и настройки', 'aimarket-models', '🧠', v_parent_id, 5),
('AI-Generated Videos', 'AI-генерирани видеа', 'aimarket-videos', '🎬', v_parent_id, 6);

-- ML Platforms L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'ai-ml-platforms';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('TensorFlow Tools', 'TensorFlow инструменти', 'ml-tensorflow', '🧠', v_parent_id, 1),
('PyTorch Tools', 'PyTorch инструменти', 'ml-pytorch', '🔥', v_parent_id, 2),
('AWS ML Services', 'AWS ML услуги', 'ml-aws', '☁️', v_parent_id, 3),
('Google Cloud AI', 'Google Cloud AI', 'ml-gcp', '🌐', v_parent_id, 4),
('Azure AI Services', 'Azure AI услуги', 'ml-azure', '💜', v_parent_id, 5),
('Hugging Face', 'Hugging Face', 'ml-huggingface', '🤗', v_parent_id, 6);

END $$;;
