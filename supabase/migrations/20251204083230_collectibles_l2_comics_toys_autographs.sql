
-- =====================================================
-- COMICS, TOYS, AUTOGRAPHS L2 Categories
-- =====================================================
DO $$ 
DECLARE
  comics_id UUID;
  toys_id UUID;
  autographs_id UUID;
BEGIN
  SELECT id INTO comics_id FROM categories WHERE slug = 'coll-comics';
  SELECT id INTO toys_id FROM categories WHERE slug = 'coll-toys';
  SELECT id INTO autographs_id FROM categories WHERE slug = 'coll-autographs';
  
  -- Comics L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Marvel Comics', 'Marvel комикси', 'comics-marvel', comics_id, '🦸', 1),
    ('DC Comics', 'DC комикси', 'comics-dc', comics_id, '🦇', 2),
    ('Manga', 'Манга', 'comics-manga', comics_id, '📕', 3),
    ('Independent Comics', 'Независими комикси', 'comics-indie', comics_id, '📗', 4),
    ('Vintage Comics', 'Винтидж комикси', 'comics-vintage', comics_id, '📜', 5),
    ('Graphic Novels', 'Графични романи', 'comics-graphic-novels', comics_id, '📚', 6),
    ('Comic Art', 'Комикс изкуство', 'comics-art', comics_id, '🎨', 7),
    ('Graded Comics', 'Оценени комикси', 'comics-graded', comics_id, '🏅', 8),
    ('European Comics', 'Европейски комикси', 'comics-european', comics_id, '🇪🇺', 9)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
    
  -- Collectible Toys L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Action Figures', 'Екшън фигурки', 'toys-action-figures', toys_id, '🦸', 1),
    ('Funko Pop!', 'Funko Pop!', 'toys-funko', toys_id, '👤', 2),
    ('Hot Wheels & Diecast', 'Hot Wheels и метални колички', 'toys-diecast', toys_id, '🚗', 3),
    ('LEGO Collectibles', 'LEGO колекционерски', 'toys-lego', toys_id, '🧱', 4),
    ('Vintage Toys', 'Винтидж играчки', 'toys-vintage', toys_id, '🎎', 5),
    ('Plush & Stuffed Animals', 'Плюшени играчки', 'toys-plush', toys_id, '🧸', 6),
    ('Model Kits', 'Модели за сглобяване', 'toys-model-kits', toys_id, '✈️', 7),
    ('Star Wars Collectibles', 'Star Wars колекции', 'toys-star-wars', toys_id, '⚔️', 8),
    ('Marvel/DC Figures', 'Marvel/DC фигурки', 'toys-superhero', toys_id, '🦸‍♂️', 9),
    ('Anime Figures', 'Аниме фигурки', 'toys-anime', toys_id, '🗾', 10),
    ('Barbie & Dolls', 'Барби и кукли', 'toys-dolls', toys_id, '👧', 11),
    ('Transformers', 'Трансформърс', 'toys-transformers', toys_id, '🤖', 12),
    ('G.I. Joe', 'G.I. Joe', 'toys-gi-joe', toys_id, '🎖️', 13)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
    
  -- Autographs L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Sports Autographs', 'Спортни автографи', 'autographs-sports', autographs_id, '🏆', 1),
    ('Music Autographs', 'Музикални автографи', 'autographs-music', autographs_id, '🎵', 2),
    ('Movie & TV Autographs', 'Филмови и ТВ автографи', 'autographs-entertainment', autographs_id, '🎬', 3),
    ('Historical Autographs', 'Исторически автографи', 'autographs-historical', autographs_id, '📜', 4),
    ('Political Autographs', 'Политически автографи', 'autographs-political', autographs_id, '🏛️', 5),
    ('Literary Autographs', 'Литературни автографи', 'autographs-literary', autographs_id, '📖', 6),
    ('Science & Space Autographs', 'Научни и космически автографи', 'autographs-science', autographs_id, '🚀', 7),
    ('Signed Photos', 'Подписани снимки', 'autographs-photos', autographs_id, '📸', 8),
    ('Signed Memorabilia', 'Подписани сувенири', 'autographs-memorabilia', autographs_id, '🖊️', 9)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
END $$;
;
