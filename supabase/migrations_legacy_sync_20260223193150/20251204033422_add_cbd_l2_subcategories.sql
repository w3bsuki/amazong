
-- =====================================================
-- L2: CBD Oils Subcategories
-- =====================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Full Spectrum CBD', 'Пълен спектър CBD', 'full-spectrum-cbd', '09784305-a3a5-4803-ab4b-bbad166fadd4', '🌈', 1),
('Broad Spectrum CBD', 'Широк спектър CBD', 'broad-spectrum-cbd', '09784305-a3a5-4803-ab4b-bbad166fadd4', '🔵', 2),
('CBD Isolate', 'CBD изолат', 'cbd-isolate', '09784305-a3a5-4803-ab4b-bbad166fadd4', '⚪', 3),
('Water Soluble / Nano CBD', 'Водоразтворим / Нано CBD', 'nano-cbd', '09784305-a3a5-4803-ab4b-bbad166fadd4', '💎', 4),
('High Potency 30%+', 'Висока концентрация 30%+', 'high-potency-cbd', '09784305-a3a5-4803-ab4b-bbad166fadd4', '⚡', 5),
('CBG Oil', 'CBG масло', 'cbg-oil', '09784305-a3a5-4803-ab4b-bbad166fadd4', '🟢', 6),
('CBN Oil', 'CBN масло', 'cbn-oil', '09784305-a3a5-4803-ab4b-bbad166fadd4', '🟣', 7),
('Flavored CBD Oils', 'Ароматизирани CBD масла', 'flavored-cbd-oils', '09784305-a3a5-4803-ab4b-bbad166fadd4', '🍊', 8);

-- =====================================================
-- L2: CBD Capsules Subcategories
-- =====================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('CBD Softgels', 'CBD софтгел капсули', 'cbd-softgels', '45ac8dd0-aa3e-48ef-9934-30f9fbed549b', '💊', 1),
('CBD Tablets', 'CBD таблетки', 'cbd-tablets', '45ac8dd0-aa3e-48ef-9934-30f9fbed549b', '💊', 2),
('Sleep Formula CBD', 'CBD за сън', 'sleep-formula-cbd', '45ac8dd0-aa3e-48ef-9934-30f9fbed549b', '😴', 3),
('Energy Formula CBD', 'CBD за енергия', 'energy-formula-cbd', '45ac8dd0-aa3e-48ef-9934-30f9fbed549b', '⚡', 4),
('Focus Formula CBD', 'CBD за фокус', 'focus-formula-cbd', '45ac8dd0-aa3e-48ef-9934-30f9fbed549b', '🧠', 5),
('Liposomal CBD', 'Липозомален CBD', 'liposomal-cbd', '45ac8dd0-aa3e-48ef-9934-30f9fbed549b', '✨', 6);

-- =====================================================
-- L2: CBD Edibles Subcategories
-- =====================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('CBD Gummies', 'CBD бонбони', 'cbd-gummies', 'ab779bbf-f580-45f4-b8b7-1ea4c4a6c180', '🍬', 1),
('CBD Chocolates', 'CBD шоколад', 'cbd-chocolates', 'ab779bbf-f580-45f4-b8b7-1ea4c4a6c180', '🍫', 2),
('CBD Honey', 'CBD мед', 'cbd-honey', 'ab779bbf-f580-45f4-b8b7-1ea4c4a6c180', '🍯', 3),
('CBD Beverages', 'CBD напитки', 'cbd-beverages', 'ab779bbf-f580-45f4-b8b7-1ea4c4a6c180', '🥤', 4),
('CBD Protein Bars', 'CBD протеинови барове', 'cbd-protein-bars', 'ab779bbf-f580-45f4-b8b7-1ea4c4a6c180', '🍫', 5),
('CBD Mints & Candies', 'CBD бонбони и дъвки', 'cbd-mints-candies', 'ab779bbf-f580-45f4-b8b7-1ea4c4a6c180', '🍭', 6),
('CBD Cooking Oils', 'CBD масла за готвене', 'cbd-cooking-oils', 'ab779bbf-f580-45f4-b8b7-1ea4c4a6c180', '🍳', 7);

-- =====================================================
-- L2: CBD Topicals Subcategories
-- =====================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('CBD Creams', 'CBD кремове', 'cbd-creams', 'f022755a-6e9f-476a-aec2-99658ea3035d', '🧴', 1),
('CBD Balms', 'CBD балсами', 'cbd-balms', 'f022755a-6e9f-476a-aec2-99658ea3035d', '🫙', 2),
('CBD Lotions', 'CBD лосиони', 'cbd-lotions', 'f022755a-6e9f-476a-aec2-99658ea3035d', '🧴', 3),
('CBD Roll-Ons', 'CBD рол-он', 'cbd-roll-ons', 'f022755a-6e9f-476a-aec2-99658ea3035d', '🔵', 4),
('CBD Patches', 'CBD пластири', 'cbd-patches', 'f022755a-6e9f-476a-aec2-99658ea3035d', '🩹', 5),
('CBD Bath Bombs', 'CBD бомби за баня', 'cbd-bath-bombs', 'f022755a-6e9f-476a-aec2-99658ea3035d', '🛁', 6),
('CBD Massage Oils', 'CBD масажни масла', 'cbd-massage-oils', 'f022755a-6e9f-476a-aec2-99658ea3035d', '💆', 7),
('CBD Sports Recovery', 'CBD спортно възстановяване', 'cbd-sports-recovery', 'f022755a-6e9f-476a-aec2-99658ea3035d', '🏃', 8);

-- =====================================================
-- L2: CBD Vape Subcategories
-- =====================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('CBD Vape Oils', 'CBD вейп масла', 'cbd-vape-oils', '8da1f3ef-136a-4ad2-ba3f-9e00f6ce492f', '💧', 1),
('CBD Cartridges', 'CBD картриджи', 'cbd-cartridges', '8da1f3ef-136a-4ad2-ba3f-9e00f6ce492f', '🔋', 2),
('CBD Disposables', 'CBD еднократни вейпове', 'cbd-disposables', '8da1f3ef-136a-4ad2-ba3f-9e00f6ce492f', '📦', 3),
('CBD Vape Pens', 'CBD вейп писалки', 'cbd-vape-pens', '8da1f3ef-136a-4ad2-ba3f-9e00f6ce492f', '🖊️', 4),
('CBD Live Resin Carts', 'CBD лайв резин картриджи', 'cbd-live-resin', '8da1f3ef-136a-4ad2-ba3f-9e00f6ce492f', '✨', 5);

-- =====================================================
-- L2: CBD Flowers Subcategories
-- =====================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Indoor Grown CBD', 'CBD на закрито', 'indoor-cbd-flowers', '23e3b55f-b9ba-4221-935d-02224cb7c1ad', '🏠', 1),
('Outdoor Grown CBD', 'CBD на открито', 'outdoor-cbd-flowers', '23e3b55f-b9ba-4221-935d-02224cb7c1ad', '☀️', 2),
('Greenhouse CBD', 'CBD оранжерия', 'greenhouse-cbd-flowers', '23e3b55f-b9ba-4221-935d-02224cb7c1ad', '🌿', 3),
('CBD Pre-Rolls', 'CBD предварително свити', 'cbd-pre-rolls', '23e3b55f-b9ba-4221-935d-02224cb7c1ad', '🚬', 4),
('CBD Hash', 'CBD хашиш', 'cbd-hash', '23e3b55f-b9ba-4221-935d-02224cb7c1ad', '🟤', 5),
('CBD Moon Rocks', 'CBD муун рокс', 'cbd-moon-rocks', '23e3b55f-b9ba-4221-935d-02224cb7c1ad', '🌙', 6),
('CBD Trim', 'CBD трим', 'cbd-trim', '23e3b55f-b9ba-4221-935d-02224cb7c1ad', '🍃', 7);

-- =====================================================
-- L2: CBD Beauty Subcategories
-- =====================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('CBD Face Serums', 'CBD серуми за лице', 'cbd-face-serums', '03038d63-7273-477f-b092-cdf1afe6695b', '✨', 1),
('CBD Moisturizers', 'CBD хидратанти', 'cbd-moisturizers', '03038d63-7273-477f-b092-cdf1afe6695b', '💧', 2),
('CBD Eye Creams', 'CBD кремове за очи', 'cbd-eye-creams', '03038d63-7273-477f-b092-cdf1afe6695b', '👁️', 3),
('CBD Lip Balms', 'CBD балсами за устни', 'cbd-lip-balms', '03038d63-7273-477f-b092-cdf1afe6695b', '👄', 4),
('CBD Face Masks', 'CBD маски за лице', 'cbd-face-masks', '03038d63-7273-477f-b092-cdf1afe6695b', '🎭', 5),
('CBD Anti-Aging', 'CBD анти-ейдж', 'cbd-anti-aging', '03038d63-7273-477f-b092-cdf1afe6695b', '⏰', 6);

-- =====================================================
-- L2: CBD Concentrates Subcategories
-- =====================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('CBD Wax', 'CBD восък', 'cbd-wax', 'c4ee0721-803a-419d-bbe1-0ab9cf1716f9', '🟡', 1),
('CBD Shatter', 'CBD шатър', 'cbd-shatter', 'c4ee0721-803a-419d-bbe1-0ab9cf1716f9', '💎', 2),
('CBD Crumble', 'CBD крамбъл', 'cbd-crumble', 'c4ee0721-803a-419d-bbe1-0ab9cf1716f9', '🧀', 3),
('CBD Crystals', 'CBD кристали', 'cbd-crystals', 'c4ee0721-803a-419d-bbe1-0ab9cf1716f9', '💠', 4),
('CBD Distillate', 'CBD дестилат', 'cbd-distillate', 'c4ee0721-803a-419d-bbe1-0ab9cf1716f9', '🧪', 5),
('CBD Live Resin', 'CBD лайв резин', 'cbd-live-resin-conc', 'c4ee0721-803a-419d-bbe1-0ab9cf1716f9', '✨', 6);

-- =====================================================
-- L2: Pet CBD Subcategories
-- =====================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Dog CBD Oil', 'CBD масло за кучета', 'dog-cbd-oil', '438c1c2c-3892-458c-a862-925d2a8fc948', '🐕', 1),
('Cat CBD Oil', 'CBD масло за котки', 'cat-cbd-oil', '438c1c2c-3892-458c-a862-925d2a8fc948', '🐱', 2),
('Pet CBD Treats', 'CBD лакомства за животни', 'pet-cbd-treats', '438c1c2c-3892-458c-a862-925d2a8fc948', '🦴', 3),
('Pet Calming CBD', 'CBD успокояващи за животни', 'pet-calming-cbd', '438c1c2c-3892-458c-a862-925d2a8fc948', '😌', 4),
('Pet Joint Support CBD', 'CBD за стави за животни', 'pet-joint-cbd', '438c1c2c-3892-458c-a862-925d2a8fc948', '🦴', 5),
('Pet CBD Topicals', 'CBD локални за животни', 'pet-cbd-topicals', '438c1c2c-3892-458c-a862-925d2a8fc948', '🧴', 6);
;
