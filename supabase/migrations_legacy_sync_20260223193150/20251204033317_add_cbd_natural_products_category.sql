
-- =====================================================
-- CBD & NATURAL PRODUCTS - Main Category
-- =====================================================

-- First create main category and capture its ID
WITH cbd_main AS (
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('CBD & Natural Products', 'CBD и натурални продукти', 'cbd-wellness', NULL, '🌿', 8, 'CBD oils, functional mushrooms, adaptogens and natural wellness products', 'CBD масла, функционални гъби, адаптогени и натурални продукти за здраве')
  RETURNING id
),

-- L1: CBD Product Categories
cbd_l1 AS (
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  SELECT name, name_bg, slug, cbd_main.id, icon, display_order, description
  FROM cbd_main, (VALUES
    ('CBD Oils & Tinctures', 'CBD масла и тинктури', 'cbd-oils', '💧', 1, 'Full spectrum, broad spectrum, isolate oils'),
    ('CBD Capsules & Softgels', 'CBD капсули', 'cbd-capsules', '💊', 2, 'Softgels, tablets, and formula capsules'),
    ('CBD Edibles', 'CBD храни', 'cbd-edibles', '🍬', 3, 'Gummies, chocolates, honey and beverages'),
    ('CBD Topicals', 'CBD локални продукти', 'cbd-topicals', '🧴', 4, 'Creams, balms, patches and massage oils'),
    ('CBD Vape', 'CBD вейп', 'cbd-vape', '💨', 5, 'Vape oils, cartridges and disposables'),
    ('CBD Flowers & Pre-Rolls', 'CBD цветя', 'cbd-flowers', '🌸', 6, 'Indoor, outdoor, greenhouse and pre-rolls'),
    ('CBD Beauty & Skincare', 'CBD козметика', 'cbd-beauty', '💄', 7, 'Serums, moisturizers and anti-aging'),
    ('CBD Concentrates', 'CBD концентрати', 'cbd-concentrates', '🧪', 8, 'Wax, shatter, crumble and distillate'),
    ('Pet CBD', 'CBD за домашни любимци', 'cbd-pets', '🐕', 9, 'Dog and cat CBD products'),
    ('Functional Mushrooms', 'Функционални гъби', 'functional-mushrooms', '🍄', 10, 'Lions mane, reishi, chaga, cordyceps'),
    ('Adaptogens', 'Адаптогени', 'adaptogens', '🌿', 11, 'Ashwagandha, rhodiola, maca, ginseng'),
    ('Hemp Products', 'Конопени продукти', 'hemp-products', '🌱', 12, 'Hemp seeds, protein, hearts and oil'),
    ('CBD Accessories', 'CBD аксесоари', 'cbd-accessories', '📦', 13, 'Vaporizers, storage and testing kits')
  ) AS t(name, name_bg, slug, icon, display_order, description)
  RETURNING id, slug
)
SELECT * FROM cbd_l1;
;
