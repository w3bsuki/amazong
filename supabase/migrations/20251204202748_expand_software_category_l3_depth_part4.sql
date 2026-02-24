-- =====================================================
-- SOFTWARE CATEGORY EXPANSION - Phase 3: L3 Categories (Part 4)
-- Mobile Apps, Website Builders, CMS, E-commerce, More
-- =====================================================

DO $$
DECLARE
  v_parent_id UUID;
BEGIN

-- =====================================================
-- L3 CATEGORIES - MOBILE APPS
-- =====================================================

-- Android Apps L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'mobile-android';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Android Productivity', 'Android продуктивност', 'android-prod', '📊', v_parent_id, 1),
('Android Entertainment', 'Android забавления', 'android-ent', '🎬', v_parent_id, 2),
('Android Tools', 'Android инструменти', 'android-tools', '🔧', v_parent_id, 3),
('Android Photo & Video', 'Android фото и видео', 'android-media', '📸', v_parent_id, 4),
('Android Health', 'Android здраве', 'android-health', '💪', v_parent_id, 5);

-- iOS Apps L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'mobile-ios';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('iOS Productivity', 'iOS продуктивност', 'ios-prod', '📊', v_parent_id, 1),
('iOS Entertainment', 'iOS забавления', 'ios-ent', '🎬', v_parent_id, 2),
('iOS Tools', 'iOS инструменти', 'ios-tools', '🔧', v_parent_id, 3),
('iOS Photo & Video', 'iOS фото и видео', 'ios-media', '📸', v_parent_id, 4),
('iOS Health', 'iOS здраве', 'ios-health', '💪', v_parent_id, 5);

-- Mobile Games L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'mobile-games';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Mobile Puzzle Games', 'Мобилни пъзели', 'mgames-puzzle', '🧩', v_parent_id, 1),
('Mobile Action Games', 'Мобилни екшъни', 'mgames-action', '🔫', v_parent_id, 2),
('Mobile Strategy', 'Мобилни стратегии', 'mgames-strategy', '♟️', v_parent_id, 3),
('Mobile Racing', 'Мобилни състезания', 'mgames-racing', '🏎️', v_parent_id, 4),
('Mobile Casual', 'Мобилни казуални', 'mgames-casual', '🎲', v_parent_id, 5);

-- =====================================================
-- L3 CATEGORIES - WEB & DEVELOPMENT (Additional)
-- =====================================================

-- CMS Platforms L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'dev-cms';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('WordPress', 'WordPress', 'cms-wordpress', '📝', v_parent_id, 1),
('Drupal', 'Drupal', 'cms-drupal', '💧', v_parent_id, 2),
('Joomla', 'Joomla', 'cms-joomla', '📰', v_parent_id, 3),
('Ghost', 'Ghost', 'cms-ghost', '👻', v_parent_id, 4),
('Strapi', 'Strapi', 'cms-strapi', '🚀', v_parent_id, 5),
('Contentful', 'Contentful', 'cms-contentful', '📦', v_parent_id, 6);

-- E-commerce Platforms L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'dev-ecommerce';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Shopify', 'Shopify', 'ecom-shopify', '🛍️', v_parent_id, 1),
('WooCommerce', 'WooCommerce', 'ecom-woo', '🛒', v_parent_id, 2),
('Magento', 'Magento', 'ecom-magento', '🔶', v_parent_id, 3),
('BigCommerce', 'BigCommerce', 'ecom-bigcommerce', '📦', v_parent_id, 4),
('PrestaShop', 'PrestaShop', 'ecom-prestashop', '🛒', v_parent_id, 5),
('OpenCart', 'OpenCart', 'ecom-opencart', '🛒', v_parent_id, 6);

-- Website Builders L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'dev-builders';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Wix', 'Wix', 'builder-wix', '🌐', v_parent_id, 1),
('Squarespace', 'Squarespace', 'builder-squarespace', '⬛', v_parent_id, 2),
('Webflow', 'Webflow', 'builder-webflow', '💜', v_parent_id, 3),
('Weebly', 'Weebly', 'builder-weebly', '🌐', v_parent_id, 4),
('Framer', 'Framer', 'builder-framer', '🎨', v_parent_id, 5),
('Carrd', 'Carrd', 'builder-carrd', '📋', v_parent_id, 6);

-- SEO & Analytics L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'dev-seo';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Google Analytics', 'Google Analytics', 'seo-ga', '📊', v_parent_id, 1),
('SEMrush', 'SEMrush', 'seo-semrush', '🔍', v_parent_id, 2),
('Ahrefs', 'Ahrefs', 'seo-ahrefs', '🔗', v_parent_id, 3),
('Moz', 'Moz', 'seo-moz', '📈', v_parent_id, 4),
('Screaming Frog', 'Screaming Frog', 'seo-frog', '🐸', v_parent_id, 5),
('Hotjar', 'Hotjar', 'seo-hotjar', '🔥', v_parent_id, 6);

-- Version Control L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'dev-vcs';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('GitHub', 'GitHub', 'vcs-github', '🐙', v_parent_id, 1),
('GitLab', 'GitLab', 'vcs-gitlab', '🦊', v_parent_id, 2),
('Bitbucket', 'Bitbucket', 'vcs-bitbucket', '🪣', v_parent_id, 3),
('Azure DevOps', 'Azure DevOps', 'vcs-azure', '💜', v_parent_id, 4),
('Git Clients', 'Git клиенти', 'vcs-clients', '🌳', v_parent_id, 5);

-- =====================================================
-- L3 CATEGORIES - MORE SECURITY
-- =====================================================

-- Internet Security L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'security-internet';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Total Security Suites', 'Тотална защита', 'isec-total', '🛡️', v_parent_id, 1),
('Web Protection', 'Уеб защита', 'isec-web', '🌐', v_parent_id, 2),
('Email Protection', 'Имейл защита', 'isec-email', '📧', v_parent_id, 3),
('Safe Banking', 'Безопасно банкиране', 'isec-banking', '🏦', v_parent_id, 4),
('Multi-device Protection', 'Защита за много устройства', 'isec-multi', '📱', v_parent_id, 5);

-- Encryption Software L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'security-encryption';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('File Encryption', 'Криптиране на файлове', 'encrypt-file', '🔐', v_parent_id, 1),
('Disk Encryption', 'Криптиране на дискове', 'encrypt-disk', '💿', v_parent_id, 2),
('Email Encryption', 'Криптиране на имейли', 'encrypt-email', '📧', v_parent_id, 3),
('USB Encryption', 'Криптиране на USB', 'encrypt-usb', '🔑', v_parent_id, 4),
('Cloud Encryption', 'Облачно криптиране', 'encrypt-cloud', '☁️', v_parent_id, 5);

-- Parental Controls L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'security-parental';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Screen Time Management', 'Управление на екранно време', 'parent-screen', '⏰', v_parent_id, 1),
('Content Filtering', 'Филтриране на съдържание', 'parent-filter', '🔒', v_parent_id, 2),
('Location Tracking', 'Проследяване на местоположение', 'parent-location', '📍', v_parent_id, 3),
('App Controls', 'Контрол на приложения', 'parent-apps', '📱', v_parent_id, 4),
('Social Media Monitoring', 'Мониторинг на социални мрежи', 'parent-social', '👁️', v_parent_id, 5);

-- =====================================================
-- L3 CATEGORIES - DATA SCIENCE & AUTOMATION
-- =====================================================

-- Data Science Tools L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'ai-data-science';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Jupyter Notebooks', 'Jupyter Notebooks', 'ds-jupyter', '📓', v_parent_id, 1),
('Data Visualization', 'Визуализация на данни', 'ds-viz', '📊', v_parent_id, 2),
('Data Cleaning Tools', 'Инструменти за почистване на данни', 'ds-cleaning', '🧹', v_parent_id, 3),
('Big Data Tools', 'Big Data инструменти', 'ds-bigdata', '📈', v_parent_id, 4),
('ETL Tools', 'ETL инструменти', 'ds-etl', '🔄', v_parent_id, 5);

-- Automation & RPA L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'ai-automation';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Zapier', 'Zapier', 'auto-zapier', '⚡', v_parent_id, 1),
('Make (Integromat)', 'Make (Integromat)', 'auto-make', '🔗', v_parent_id, 2),
('UiPath', 'UiPath', 'auto-uipath', '🤖', v_parent_id, 3),
('Power Automate', 'Power Automate', 'auto-power', '💜', v_parent_id, 4),
('Automation Anywhere', 'Automation Anywhere', 'auto-aa', '🌐', v_parent_id, 5),
('n8n', 'n8n', 'auto-n8n', '🔶', v_parent_id, 6);

END $$;;
