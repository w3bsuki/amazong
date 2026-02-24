
-- Batch 42: More deep categories - Video Games, Movies, Music
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Video Games deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'playstation';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('PS5 Games', 'PS5 игри', 'ps5-games', v_parent_id, 1),
      ('PS5 Consoles', 'PS5 конзоли', 'ps5-consoles', v_parent_id, 2),
      ('PS5 Accessories', 'PS5 аксесоари', 'ps5-accessories', v_parent_id, 3),
      ('PS4 Games', 'PS4 игри', 'ps4-games', v_parent_id, 4),
      ('PS4 Accessories', 'PS4 аксесоари', 'ps4-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'xbox';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Xbox Series X|S Games', 'Xbox Series X|S игри', 'xbox-series-games', v_parent_id, 1),
      ('Xbox Series X|S Consoles', 'Xbox Series X|S конзоли', 'xbox-series-consoles', v_parent_id, 2),
      ('Xbox Accessories', 'Xbox аксесоари', 'xbox-accessories', v_parent_id, 3),
      ('Xbox Game Pass', 'Xbox Game Pass', 'xbox-game-pass', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'nintendo';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Nintendo Switch Games', 'Nintendo Switch игри', 'switch-games', v_parent_id, 1),
      ('Nintendo Switch Consoles', 'Nintendo Switch конзоли', 'switch-consoles', v_parent_id, 2),
      ('Nintendo Switch Accessories', 'Nintendo Switch аксесоари', 'switch-accessories', v_parent_id, 3),
      ('Nintendo 3DS', 'Nintendo 3DS', 'nintendo-3ds', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pc-gaming';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('PC Games', 'PC игри', 'pc-games', v_parent_id, 1),
      ('Gaming Desktops', 'Гейминг компютри', 'gaming-desktops', v_parent_id, 2),
      ('Gaming Laptops', 'Гейминг лаптопи', 'gaming-laptops', v_parent_id, 3),
      ('Gaming Monitors', 'Гейминг монитори', 'gaming-monitors-pc', v_parent_id, 4),
      ('Gaming Peripherals', 'Гейминг периферия', 'gaming-peripherals', v_parent_id, 5),
      ('VR Gaming', 'VR гейминг', 'vr-gaming', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Movies & TV deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'movies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Action Movies', 'Екшън филми', 'action-movies', v_parent_id, 1),
      ('Comedy Movies', 'Комедии', 'comedy-movies', v_parent_id, 2),
      ('Drama Movies', 'Драми', 'drama-movies', v_parent_id, 3),
      ('Horror Movies', 'Хорър филми', 'horror-movies', v_parent_id, 4),
      ('Sci-Fi Movies', 'Научна фантастика филми', 'scifi-movies', v_parent_id, 5),
      ('Family Movies', 'Семейни филми', 'family-movies', v_parent_id, 6),
      ('Documentary', 'Документални', 'documentary-movies', v_parent_id, 7),
      ('Animation Movies', 'Анимационни филми', 'animation-movies', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tv-series';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Drama Series', 'Драматични сериали', 'drama-series', v_parent_id, 1),
      ('Comedy Series', 'Комедийни сериали', 'comedy-series', v_parent_id, 2),
      ('Action Series', 'Екшън сериали', 'action-series', v_parent_id, 3),
      ('Crime Series', 'Криминални сериали', 'crime-series', v_parent_id, 4),
      ('Reality TV', 'Риалити', 'reality-tv', v_parent_id, 5),
      ('Anime Series', 'Аниме сериали', 'anime-series', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Music deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'vinyl-records';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('New Vinyl', 'Нови плочи', 'new-vinyl', v_parent_id, 1),
      ('Used Vinyl', 'Втора употреба плочи', 'used-vinyl', v_parent_id, 2),
      ('Colored Vinyl', 'Цветни плочи', 'colored-vinyl', v_parent_id, 3),
      ('Limited Edition Vinyl', 'Лимитирани плочи', 'limited-vinyl', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cds';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('New CDs', 'Нови CD', 'new-cds', v_parent_id, 1),
      ('Used CDs', 'Втора употреба CD', 'used-cds', v_parent_id, 2),
      ('Box Sets', 'Бокс сетове', 'cd-box-sets', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cameras deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dslr-cameras';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Entry-Level DSLR', 'DSLR за начинаещи', 'entry-level-dslr', v_parent_id, 1),
      ('Mid-Range DSLR', 'Среден клас DSLR', 'mid-range-dslr', v_parent_id, 2),
      ('Professional DSLR', 'Професионални DSLR', 'professional-dslr', v_parent_id, 3),
      ('Full-Frame DSLR', 'Пълноформатни DSLR', 'full-frame-dslr', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mirrorless-cameras';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Full-Frame Mirrorless', 'Пълноформатни безогледални', 'full-frame-mirrorless', v_parent_id, 1),
      ('APS-C Mirrorless', 'APS-C безогледални', 'apsc-mirrorless', v_parent_id, 2),
      ('Micro Four Thirds', 'Micro Four Thirds', 'micro-four-thirds', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'camera-lenses';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Prime Lenses', 'Фиксирани обективи', 'prime-lenses', v_parent_id, 1),
      ('Zoom Lenses', 'Зуум обективи', 'zoom-lenses', v_parent_id, 2),
      ('Wide-Angle Lenses', 'Широкоъгълни обективи', 'wide-angle-lenses', v_parent_id, 3),
      ('Telephoto Lenses', 'Телеобективи', 'telephoto-lenses', v_parent_id, 4),
      ('Macro Lenses', 'Макро обективи', 'macro-lenses', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'action-cameras';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('GoPro Cameras', 'GoPro камери', 'gopro-cameras', v_parent_id, 1),
      ('DJI Action Cameras', 'DJI екшън камери', 'dji-action-cameras', v_parent_id, 2),
      ('Budget Action Cameras', 'Бюджетни екшън камери', 'budget-action-cameras', v_parent_id, 3),
      ('Action Camera Accessories', 'Аксесоари за екшън камери', 'action-camera-accessories', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
