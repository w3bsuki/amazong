-- =====================================================
-- SERVICES L2: WEDDING SERVICES (b1c2d3e4-1111-4000-8000-000000000008)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Wedding Planning
('b1c2d3e4-2009-4000-8000-000000000001', 'Wedding Planning', 'Сватбено планиране', 'wedding-planning', 'b1c2d3e4-1111-4000-8000-000000000008', '📋', 1),
-- Wedding Venues
('b1c2d3e4-2009-4000-8000-000000000002', 'Wedding Venues', 'Сватбени зали', 'wedding-venues', 'b1c2d3e4-1111-4000-8000-000000000008', '🏰', 2),
-- Wedding Photography
('b1c2d3e4-2009-4000-8000-000000000003', 'Wedding Photography', 'Сватбена фотография', 'wedding-photography', 'b1c2d3e4-1111-4000-8000-000000000008', '📸', 3),
-- Wedding Videography
('b1c2d3e4-2009-4000-8000-000000000004', 'Wedding Videography', 'Сватбено видеозаснемане', 'wedding-videography', 'b1c2d3e4-1111-4000-8000-000000000008', '🎬', 4),
-- Wedding Catering
('b1c2d3e4-2009-4000-8000-000000000005', 'Wedding Catering', 'Сватбен кетъринг', 'wedding-catering', 'b1c2d3e4-1111-4000-8000-000000000008', '🍽️', 5),
-- Wedding Flowers
('b1c2d3e4-2009-4000-8000-000000000006', 'Wedding Flowers', 'Сватбени цветя', 'wedding-flowers', 'b1c2d3e4-1111-4000-8000-000000000008', '💐', 6),
-- Wedding Cakes
('b1c2d3e4-2009-4000-8000-000000000007', 'Wedding Cakes', 'Сватбени торти', 'wedding-cakes', 'b1c2d3e4-1111-4000-8000-000000000008', '🎂', 7),
-- Wedding Music & DJ
('b1c2d3e4-2009-4000-8000-000000000008', 'Wedding Music & DJ', 'Сватбена музика и DJ', 'wedding-music-dj', 'b1c2d3e4-1111-4000-8000-000000000008', '🎵', 8),
-- Bridal Makeup & Hair
('b1c2d3e4-2009-4000-8000-000000000009', 'Bridal Makeup & Hair', 'Булчински грим и прическа', 'wedding-bridal-beauty', 'b1c2d3e4-1111-4000-8000-000000000008', '💄', 9),
-- Wedding Decorations
('b1c2d3e4-2009-4000-8000-000000000010', 'Wedding Decorations', 'Сватбена декорация', 'wedding-decorations', 'b1c2d3e4-1111-4000-8000-000000000008', '🎀', 10),
-- Wedding Invitations
('b1c2d3e4-2009-4000-8000-000000000011', 'Wedding Invitations', 'Сватбени покани', 'wedding-invitations', 'b1c2d3e4-1111-4000-8000-000000000008', '💌', 11),
-- Wedding Transport
('b1c2d3e4-2009-4000-8000-000000000012', 'Wedding Transport', 'Сватбен транспорт', 'wedding-transport', 'b1c2d3e4-1111-4000-8000-000000000008', '🚗', 12),
-- Wedding Officiant
('b1c2d3e4-2009-4000-8000-000000000013', 'Wedding Officiant', 'Сватбен церемониал', 'wedding-officiant', 'b1c2d3e4-1111-4000-8000-000000000008', '💒', 13),
-- Wedding Entertainment
('b1c2d3e4-2009-4000-8000-000000000014', 'Wedding Entertainment', 'Сватбени развлечения', 'wedding-entertainment', 'b1c2d3e4-1111-4000-8000-000000000008', '🎭', 14);

-- =====================================================
-- SERVICES L2: LEGAL & FINANCIAL (b1c2d3e4-1111-4000-8000-000000000009)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Lawyers
('b1c2d3e4-2010-4000-8000-000000000001', 'Lawyers & Attorneys', 'Адвокати', 'legal-lawyers', 'b1c2d3e4-1111-4000-8000-000000000009', '⚖️', 1),
-- Notaries
('b1c2d3e4-2010-4000-8000-000000000002', 'Notary Services', 'Нотариуси', 'legal-notaries', 'b1c2d3e4-1111-4000-8000-000000000009', '📜', 2),
-- Tax Preparation
('b1c2d3e4-2010-4000-8000-000000000003', 'Tax Preparation', 'Данъчни услуги', 'legal-tax-prep', 'b1c2d3e4-1111-4000-8000-000000000009', '📝', 3),
-- Insurance Services
('b1c2d3e4-2010-4000-8000-000000000004', 'Insurance Services', 'Застрахователни услуги', 'legal-insurance', 'b1c2d3e4-1111-4000-8000-000000000009', '🛡️', 4),
-- Real Estate Agents
('b1c2d3e4-2010-4000-8000-000000000005', 'Real Estate Agents', 'Агенти за недвижими имоти', 'legal-real-estate-agents', 'b1c2d3e4-1111-4000-8000-000000000009', '🏠', 5),
-- Financial Advisors
('b1c2d3e4-2010-4000-8000-000000000006', 'Financial Advisors', 'Финансови консултанти', 'legal-financial-advisors', 'b1c2d3e4-1111-4000-8000-000000000009', '💰', 6),
-- Debt Collection
('b1c2d3e4-2010-4000-8000-000000000007', 'Debt Collection', 'Събиране на вземания', 'legal-debt-collection', 'b1c2d3e4-1111-4000-8000-000000000009', '💳', 7),
-- Company Registration
('b1c2d3e4-2010-4000-8000-000000000008', 'Company Registration', 'Регистрация на фирми', 'legal-company-registration', 'b1c2d3e4-1111-4000-8000-000000000009', '📋', 8),
-- Patent & Trademark
('b1c2d3e4-2010-4000-8000-000000000009', 'Patent & Trademark', 'Патенти и търговски марки', 'legal-patent-trademark', 'b1c2d3e4-1111-4000-8000-000000000009', '™️', 9),
-- Mortgage Brokers
('b1c2d3e4-2010-4000-8000-000000000010', 'Mortgage Brokers', 'Ипотечни брокери', 'legal-mortgage', 'b1c2d3e4-1111-4000-8000-000000000009', '🏦', 10);

-- =====================================================
-- SERVICES L2: TRANSPORTATION (b1c2d3e4-1111-4000-8000-000000000010)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Taxi Services
('b1c2d3e4-2011-4000-8000-000000000001', 'Taxi Services', 'Такси услуги', 'transport-taxi', 'b1c2d3e4-1111-4000-8000-000000000010', '🚕', 1),
-- Delivery Services
('b1c2d3e4-2011-4000-8000-000000000002', 'Delivery Services', 'Доставки', 'transport-delivery', 'b1c2d3e4-1111-4000-8000-000000000010', '📦', 2),
-- Courier
('b1c2d3e4-2011-4000-8000-000000000003', 'Courier Services', 'Куриерски услуги', 'transport-courier', 'b1c2d3e4-1111-4000-8000-000000000010', '🏃', 3),
-- Chauffeur
('b1c2d3e4-2011-4000-8000-000000000004', 'Chauffeur Services', 'Шофьорски услуги', 'transport-chauffeur', 'b1c2d3e4-1111-4000-8000-000000000010', '🎩', 4),
-- Car Rental
('b1c2d3e4-2011-4000-8000-000000000005', 'Car Rental', 'Автомобил под наем', 'transport-car-rental', 'b1c2d3e4-1111-4000-8000-000000000010', '🚗', 5),
-- Bus Charter
('b1c2d3e4-2011-4000-8000-000000000006', 'Bus Charter', 'Автобуси под наем', 'transport-bus-charter', 'b1c2d3e4-1111-4000-8000-000000000010', '🚌', 6),
-- Airport Transfer
('b1c2d3e4-2011-4000-8000-000000000007', 'Airport Transfer', 'Трансфер до летище', 'transport-airport', 'b1c2d3e4-1111-4000-8000-000000000010', '✈️', 7),
-- Motorcycle Delivery
('b1c2d3e4-2011-4000-8000-000000000008', 'Motorcycle Delivery', 'Мото доставки', 'transport-motorcycle', 'b1c2d3e4-1111-4000-8000-000000000010', '🏍️', 8),
-- Cargo Transport
('b1c2d3e4-2011-4000-8000-000000000009', 'Cargo Transport', 'Товарен транспорт', 'transport-cargo', 'b1c2d3e4-1111-4000-8000-000000000010', '🚛', 9),
-- Limousine Service
('b1c2d3e4-2011-4000-8000-000000000010', 'Limousine Service', 'Лимузина', 'transport-limousine', 'b1c2d3e4-1111-4000-8000-000000000010', '🚘', 10);;
