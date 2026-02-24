-- =====================================================
-- SEED BADGE DEFINITIONS
-- =====================================================

-- Clear existing definitions (for fresh start)
TRUNCATE public.badge_definitions CASCADE;

-- =====================================================
-- SELLER MILESTONE BADGES - PERSONAL
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('new_seller', 'New Seller', 'Нов Продавач', 'Just started selling', 'Току-що започна да продава', 'seller_milestone', 'personal', '🌱', 'bg-gray-400 text-white', 0, '{"max_listings": 0}'),
('getting_started', 'Getting Started', 'Начинаещ', '1-10 active listings', '1-10 активни обяви', 'seller_milestone', 'personal', '🚀', 'bg-blue-400 text-white', 1, '{"min_listings": 1, "max_listings": 10}'),
('active_seller', 'Active Seller', 'Активен Продавач', '11-25 active listings', '11-25 активни обяви', 'seller_milestone', 'personal', '⚡', 'bg-cyan-500 text-white', 2, '{"min_listings": 11, "max_listings": 25}'),
('power_seller', 'Power Seller', 'Силен Продавач', '26-100 active listings', '26-100 активни обяви', 'seller_milestone', 'personal', '💪', 'bg-purple-500 text-white', 3, '{"min_listings": 26, "max_listings": 100}'),
('super_seller', 'Super Seller', 'Супер Продавач', '100+ active listings', '100+ активни обяви', 'seller_milestone', 'personal', '🔥', 'bg-orange-500 text-white', 4, '{"min_listings": 101}');

-- =====================================================
-- SELLER MILESTONE BADGES - BUSINESS
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('new_business', 'New Business', 'Нов Бизнес', 'Just registered as business', 'Току-що регистриран бизнес', 'seller_milestone', 'business', '🏢', 'bg-gray-500 text-white', 0, '{"max_listings": 0}'),
('emerging_business', 'Emerging Business', 'Развиващ се Бизнес', '1-50 active listings', '1-50 активни обяви', 'seller_milestone', 'business', '📈', 'bg-blue-500 text-white', 1, '{"min_listings": 1, "max_listings": 50}'),
('growing_business', 'Growing Business', 'Растящ Бизнес', '51-200 active listings', '51-200 активни обяви', 'seller_milestone', 'business', '📊', 'bg-indigo-500 text-white', 2, '{"min_listings": 51, "max_listings": 200}'),
('established_business', 'Established Business', 'Утвърден Бизнес', '201-500 active listings', '201-500 активни обяви', 'seller_milestone', 'business', '🏛️', 'bg-purple-600 text-white', 3, '{"min_listings": 201, "max_listings": 500}'),
('enterprise', 'Enterprise', 'Корпорация', '500+ active listings', '500+ активни обяви', 'seller_milestone', 'business', '🌐', 'bg-violet-600 text-white', 4, '{"min_listings": 501}');

-- =====================================================
-- SALES VOLUME BADGES - PERSONAL
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('first_sale', 'First Sale', 'Първа Продажба', 'Completed first sale', 'Първа завършена продажба', 'seller_milestone', 'personal', '🎉', 'bg-green-500 text-white', 10, '{"min_sales": 1}'),
('rising_star', 'Rising Star', 'Изгряваща Звезда', '10+ completed sales', '10+ завършени продажби', 'seller_milestone', 'personal', '⭐', 'bg-yellow-400 text-black', 11, '{"min_sales": 10}'),
('trusted_seller', 'Trusted Seller', 'Доверен Продавач', '50+ completed sales', '50+ завършени продажби', 'seller_milestone', 'personal', '✅', 'bg-emerald-500 text-white', 12, '{"min_sales": 50}'),
('established_seller', 'Established', 'Утвърден', '100+ completed sales', '100+ завършени продажби', 'seller_milestone', 'personal', '🏆', 'bg-amber-600 text-white', 13, '{"min_sales": 100}'),
('elite_seller', 'Elite Seller', 'Елитен Продавач', '500+ completed sales', '500+ завършени продажби', 'seller_milestone', 'personal', '👑', 'bg-amber-500 text-white', 14, '{"min_sales": 500}'),
('legend', 'Legend', 'Легенда', '1000+ completed sales', '1000+ завършени продажби', 'seller_milestone', 'personal', '💎', 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white', 15, '{"min_sales": 1000}');

-- =====================================================
-- SALES VOLUME BADGES - BUSINESS
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('first_business_sale', 'First Business Sale', 'Първа Бизнес Продажба', 'First completed sale', 'Първа завършена продажба', 'seller_milestone', 'business', '📝', 'bg-green-500 text-white', 10, '{"min_sales": 1}'),
('active_business', 'Active Business', 'Активен Бизнес', '25+ completed sales', '25+ завършени продажби', 'seller_milestone', 'business', '📋', 'bg-teal-500 text-white', 11, '{"min_sales": 25}'),
('thriving_business', 'Thriving Business', 'Процъфтяващ Бизнес', '100+ completed sales', '100+ завършени продажби', 'seller_milestone', 'business', '💼', 'bg-emerald-500 text-white', 12, '{"min_sales": 100}'),
('top_business', 'Top Business', 'Топ Бизнес', '500+ completed sales', '500+ завършени продажби', 'seller_milestone', 'business', '🏆', 'bg-amber-600 text-white', 13, '{"min_sales": 500}'),
('market_leader', 'Market Leader', 'Пазарен Лидер', '2000+ completed sales', '2000+ завършени продажби', 'seller_milestone', 'business', '👑', 'bg-amber-500 text-white', 14, '{"min_sales": 2000}'),
('industry_giant', 'Industry Giant', 'Индустриален Гигант', '10000+ completed sales', '10000+ завършени продажби', 'seller_milestone', 'business', '💎', 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white', 15, '{"min_sales": 10000}');

-- =====================================================
-- SELLER RATING BADGES - PERSONAL
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('well_reviewed', 'Well Reviewed', 'Добре Оценен', '4.0+ rating with 10+ reviews', '4.0+ рейтинг с 10+ отзива', 'seller_rating', 'personal', '⭐', 'bg-yellow-500 text-black', 0, '{"min_rating": 4.0, "min_reviews": 10}'),
('highly_rated', 'Highly Rated', 'Високо Оценен', '4.5+ rating with 25+ reviews', '4.5+ рейтинг с 25+ отзива', 'seller_rating', 'personal', '🌟', 'bg-amber-500 text-white', 1, '{"min_rating": 4.5, "min_reviews": 25}'),
('top_rated', 'Top Rated', 'Топ Рейтинг', '4.8+ rating with 50+ reviews', '4.8+ рейтинг с 50+ отзива', 'seller_rating', 'personal', '🏅', 'bg-amber-600 text-white', 2, '{"min_rating": 4.8, "min_reviews": 50}'),
('exceptional', 'Exceptional', 'Изключителен', '4.9+ rating with 100+ reviews', '4.9+ рейтинг с 100+ отзива', 'seller_rating', 'personal', '🏆', 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black', 3, '{"min_rating": 4.9, "min_reviews": 100}');

-- =====================================================
-- SELLER RATING BADGES - BUSINESS
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('trusted_business', 'Trusted Business', 'Доверен Бизнес', '4.0+ rating with 25+ reviews', '4.0+ рейтинг с 25+ отзива', 'seller_rating', 'business', '⭐', 'bg-yellow-500 text-black', 0, '{"min_rating": 4.0, "min_reviews": 25}'),
('preferred_business', 'Preferred Business', 'Предпочитан Бизнес', '4.5+ rating with 100+ reviews', '4.5+ рейтинг с 100+ отзива', 'seller_rating', 'business', '🌟', 'bg-amber-500 text-white', 1, '{"min_rating": 4.5, "min_reviews": 100}'),
('premium_business', 'Premium Business', 'Премиум Бизнес', '4.8+ rating with 250+ reviews', '4.8+ рейтинг с 250+ отзива', 'seller_rating', 'business', '🏅', 'bg-amber-600 text-white', 2, '{"min_rating": 4.8, "min_reviews": 250}'),
('excellence_award', 'Excellence Award', 'Награда за Съвършенство', '4.9+ rating with 500+ reviews', '4.9+ рейтинг с 500+ отзива', 'seller_rating', 'business', '🏆', 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black', 3, '{"min_rating": 4.9, "min_reviews": 500}');

-- =====================================================
-- SELLER SPECIAL BADGES
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('fast_shipper', 'Fast Shipper', 'Бърза Доставка', '95%+ orders shipped within 24h', '95%+ поръчки изпратени до 24ч', 'seller_special', 'all', '📦', 'bg-blue-500 text-white', 0, '{"min_shipped_on_time_pct": 95, "min_orders": 20}'),
('quick_responder', 'Quick Responder', 'Бърз Отговор', 'Under 2hr average response time', 'Под 2ч средно време за отговор', 'seller_special', 'all', '💬', 'bg-cyan-500 text-white', 1, '{"max_response_time_hours": 2, "min_conversations": 50}'),
('repeat_champion', 'Repeat Champion', 'Шампион по Повтарящи се', '30%+ repeat customers', '30%+ повтарящи се клиенти', 'seller_special', 'all', '🔄', 'bg-purple-500 text-white', 2, '{"min_repeat_customer_pct": 30}'),
('community_favorite', 'Community Favorite', 'Любимец на Общността', '100+ store followers', '100+ последователи', 'seller_special', 'all', '❤️', 'bg-pink-500 text-white', 3, '{"min_followers": 100}'),
('veteran', 'Veteran', 'Ветеран', '2+ years with consistent activity', '2+ години с постоянна активност', 'seller_special', 'all', '🎖️', 'bg-slate-500 text-white', 4, '{"min_account_age_years": 2}');

-- =====================================================
-- VERIFICATION BADGES
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('email_verified', 'Email Verified', 'Верифициран Имейл', 'Email address confirmed', 'Потвърден имейл адрес', 'verification', 'all', '✉️', 'bg-blue-400 text-white', 0, '{"email_verified": true}'),
('phone_verified', 'Phone Verified', 'Верифициран Телефон', 'Phone number confirmed', 'Потвърден телефонен номер', 'verification', 'all', '📱', 'bg-green-400 text-white', 1, '{"phone_verified": true}'),
('id_verified', 'ID Verified', 'Верифицирана Самоличност', 'Government ID verified', 'Верифицирана лична карта', 'verification', 'all', '🪪', 'bg-emerald-500 text-white', 2, '{"id_verified": true}'),
('verified_seller', 'Verified Seller', 'Верифициран Продавач', 'Fully verified seller', 'Напълно верифициран продавач', 'verification', 'personal', '✓', 'bg-blue-500 text-white', 3, '{"email_verified": true, "phone_verified": true}'),
('verified_business', 'Verified Business', 'Верифициран Бизнес', 'VAT/EIK verified business', 'Верифициран бизнес с ДДС/ЕИК', 'verification', 'business', '✓', 'bg-blue-600 text-white', 3, '{"vat_verified": true}'),
('verified_pro', 'Verified Pro', 'Верифициран Про', 'Full document verification + VAT', 'Пълна документална верификация', 'verification', 'business', '✓✓', 'bg-emerald-600 text-white', 4, '{"vat_verified": true, "registration_verified": true}'),
('verified_enterprise', 'Verified Enterprise', 'Верифициран Ентърпрайз', 'Premium verified business', 'Премиум верифициран бизнес', 'verification', 'business', '✓✓✓', 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white', 5, '{"verification_level": 5}');

-- =====================================================
-- BUYER MILESTONE BADGES
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('new_buyer', 'New Buyer', 'Нов Купувач', 'Just joined', 'Току-що се присъедини', 'buyer_milestone', 'buyer', '👋', 'bg-gray-400 text-white', 0, '{"max_orders": 0}'),
('first_purchase', 'First Purchase', 'Първа Покупка', 'Completed first order', 'Първа завършена поръчка', 'buyer_milestone', 'buyer', '🎉', 'bg-green-500 text-white', 1, '{"min_orders": 1}'),
('active_shopper', 'Active Shopper', 'Активен Купувач', '5+ completed orders', '5+ завършени поръчки', 'buyer_milestone', 'buyer', '🛍️', 'bg-blue-500 text-white', 2, '{"min_orders": 5}'),
('frequent_buyer', 'Frequent Buyer', 'Редовен Купувач', '25+ completed orders', '25+ завършени поръчки', 'buyer_milestone', 'buyer', '💳', 'bg-purple-500 text-white', 3, '{"min_orders": 25}'),
('vip_shopper', 'VIP Shopper', 'VIP Купувач', '100+ completed orders', '100+ завършени поръчки', 'buyer_milestone', 'buyer', '💎', 'bg-violet-500 text-white', 4, '{"min_orders": 100}'),
('platinum_buyer', 'Platinum Buyer', 'Платинен Купувач', '500+ completed orders', '500+ завършени поръчки', 'buyer_milestone', 'buyer', '👑', 'bg-gradient-to-r from-gray-300 to-gray-400 text-black', 5, '{"min_orders": 500}');

-- =====================================================
-- BUYER RATING BADGES (from seller feedback)
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('good_buyer', 'Good Buyer', 'Добър Купувач', '4.0+ rating from sellers', '4.0+ рейтинг от продавачи', 'buyer_rating', 'buyer', '⭐', 'bg-yellow-500 text-black', 0, '{"min_rating": 4.0, "min_ratings": 5}'),
('great_buyer', 'Great Buyer', 'Страхотен Купувач', '4.5+ rating from sellers', '4.5+ рейтинг от продавачи', 'buyer_rating', 'buyer', '🌟', 'bg-amber-500 text-white', 1, '{"min_rating": 4.5, "min_ratings": 15}'),
('excellent_buyer', 'Excellent Buyer', 'Отличен Купувач', '4.8+ rating from sellers', '4.8+ рейтинг от продавачи', 'buyer_rating', 'buyer', '🏅', 'bg-amber-600 text-white', 2, '{"min_rating": 4.8, "min_ratings": 30}'),
('dream_customer', 'Dream Customer', 'Мечтан Клиент', '4.9+ rating from sellers', '4.9+ рейтинг от продавачи', 'buyer_rating', 'buyer', '💫', 'bg-gradient-to-r from-pink-400 to-purple-500 text-white', 3, '{"min_rating": 4.9, "min_ratings": 50}');

-- =====================================================
-- BUYER ENGAGEMENT BADGES
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('helpful_reviewer', 'Helpful Reviewer', 'Полезен Рецензент', '10+ product reviews', '10+ ревюта на продукти', 'buyer_special', 'buyer', '📝', 'bg-blue-500 text-white', 0, '{"min_reviews_written": 10}'),
('review_expert', 'Review Expert', 'Експерт по Ревюта', '50+ product reviews', '50+ ревюта на продукти', 'buyer_special', 'buyer', '✍️', 'bg-purple-500 text-white', 1, '{"min_reviews_written": 50}'),
('loyal_follower', 'Loyal Follower', 'Верен Последовател', 'Following 20+ stores', 'Следва 20+ магазина', 'buyer_special', 'buyer', '❤️', 'bg-pink-500 text-white', 2, '{"min_stores_following": 20}'),
('wishlist_pro', 'Wishlist Pro', 'Про по Желания', '100+ items in wishlist', '100+ артикула в списъка с желания', 'buyer_special', 'buyer', '📋', 'bg-orange-500 text-white', 3, '{"min_wishlist_count": 100}');

-- =====================================================
-- SUBSCRIPTION BADGES
-- =====================================================
INSERT INTO public.badge_definitions (code, name, name_bg, description, description_bg, category, account_type, icon, color, tier, criteria) VALUES
('starter_plan', 'Starter', 'Стартер', 'Starter subscription', 'Стартер абонамент', 'subscription', 'all', '🚀', 'bg-blue-500 text-white', 0, '{"subscription_tier": "starter"}'),
('professional_plan', 'Professional', 'Професионален', 'Professional subscription', 'Професионален абонамент', 'subscription', 'all', '💼', 'bg-purple-600 text-white', 1, '{"subscription_tier": "professional"}'),
('enterprise_plan', 'Enterprise', 'Ентърпрайз', 'Enterprise subscription', 'Ентърпрайз абонамент', 'subscription', 'all', '🏢', 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white', 2, '{"subscription_tier": "enterprise"}');;
