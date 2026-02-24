
-- =====================================================
-- SPORTS MEMORABILIA L2 Categories
-- =====================================================
DO $$ 
DECLARE
  sports_mem_id UUID;
  ent_mem_id UUID;
BEGIN
  SELECT id INTO sports_mem_id FROM categories WHERE slug = 'sports-memorabilia';
  SELECT id INTO ent_mem_id FROM categories WHERE slug = 'entertainment-memorabilia';
  
  -- Sports Memorabilia L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Football Memorabilia', 'Футболни сувенири', 'sports-mem-football', sports_mem_id, '⚽', 1),
    ('Basketball Memorabilia', 'Баскетболни сувенири', 'sports-mem-basketball', sports_mem_id, '🏀', 2),
    ('Baseball Memorabilia', 'Бейзболни сувенири', 'sports-mem-baseball', sports_mem_id, '⚾', 3),
    ('Hockey Memorabilia', 'Хокейни сувенири', 'sports-mem-hockey', sports_mem_id, '🏒', 4),
    ('Boxing & MMA', 'Бокс и ММА', 'sports-mem-boxing', sports_mem_id, '🥊', 5),
    ('Tennis Memorabilia', 'Тенис сувенири', 'sports-mem-tennis', sports_mem_id, '🎾', 6),
    ('Golf Memorabilia', 'Голф сувенири', 'sports-mem-golf', sports_mem_id, '⛳', 7),
    ('Racing Memorabilia', 'Състезателни сувенири', 'sports-mem-racing', sports_mem_id, '🏎️', 8),
    ('Olympic Memorabilia', 'Олимпийски сувенири', 'sports-mem-olympic', sports_mem_id, '🏅', 9),
    ('Wrestling', 'Борба/Кеч', 'sports-mem-wrestling', sports_mem_id, '🤼', 10),
    ('Vintage Sports Equipment', 'Винтидж спортно оборудване', 'sports-mem-vintage-equipment', sports_mem_id, '🏏', 11)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
    
  -- Entertainment Memorabilia L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Movie Memorabilia', 'Филмови сувенири', 'ent-mem-movies', ent_mem_id, '🎬', 1),
    ('TV Show Memorabilia', 'Телевизионни сувенири', 'ent-mem-tv', ent_mem_id, '📺', 2),
    ('Music Memorabilia', 'Музикални сувенири', 'ent-mem-music', ent_mem_id, '🎵', 3),
    ('Theater & Broadway', 'Театър и Бродуей', 'ent-mem-theater', ent_mem_id, '🎭', 4),
    ('Celebrity Memorabilia', 'Сувенири от знаменитости', 'ent-mem-celebrity', ent_mem_id, '⭐', 5),
    ('Animation & Disney', 'Анимация и Дисни', 'ent-mem-animation', ent_mem_id, '🏰', 6),
    ('Video Game Memorabilia', 'Гейминг сувенири', 'ent-mem-gaming', ent_mem_id, '🎮', 7),
    ('Concert Memorabilia', 'Концертни сувенири', 'ent-mem-concert', ent_mem_id, '🎤', 8),
    ('Historical Entertainment', 'Историческо забавление', 'ent-mem-historical', ent_mem_id, '📜', 9)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
END $$;
;
