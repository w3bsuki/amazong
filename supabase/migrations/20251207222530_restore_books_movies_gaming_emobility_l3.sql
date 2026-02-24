
-- Restore L3 categories for Books, Movies, Gaming, E-Mobility
DO $$
DECLARE
  -- Books L2 IDs
  v_fiction_id UUID;
  v_nonfiction_id UUID;
  v_textbooks_id UUID;
  v_childrens_books_id UUID;
  v_comics_id UUID;
  v_audiobooks_id UUID;
  -- Movies L2 IDs
  v_action_movies_id UUID;
  v_comedy_movies_id UUID;
  v_drama_movies_id UUID;
  v_scifi_movies_id UUID;
  v_horror_movies_id UUID;
  v_documentary_id UUID;
  -- Gaming L2 IDs
  v_pc_gaming_id UUID;
  v_ps_games_id UUID;
  v_xbox_games_id UUID;
  v_nintendo_games_id UUID;
  v_gaming_accessories_id UUID;
  -- E-Mobility L2 IDs
  v_electric_scooters_id UUID;
  v_electric_bikes_id UUID;
  v_hoverboards_id UUID;
  v_ev_accessories_id UUID;
BEGIN
  -- Get Books L2 IDs
  SELECT id INTO v_fiction_id FROM categories WHERE slug = 'fiction';
  SELECT id INTO v_nonfiction_id FROM categories WHERE slug = 'non-fiction';
  SELECT id INTO v_textbooks_id FROM categories WHERE slug = 'textbooks';
  SELECT id INTO v_childrens_books_id FROM categories WHERE slug = 'childrens-books';
  SELECT id INTO v_comics_id FROM categories WHERE slug = 'comics-graphic-novels';
  SELECT id INTO v_audiobooks_id FROM categories WHERE slug = 'audiobooks';

  -- Get Movies L2 IDs
  SELECT id INTO v_action_movies_id FROM categories WHERE slug = 'action-movies';
  SELECT id INTO v_comedy_movies_id FROM categories WHERE slug = 'comedy-movies';
  SELECT id INTO v_drama_movies_id FROM categories WHERE slug = 'drama-movies';
  SELECT id INTO v_scifi_movies_id FROM categories WHERE slug = 'sci-fi-movies';
  SELECT id INTO v_horror_movies_id FROM categories WHERE slug = 'horror-movies';
  SELECT id INTO v_documentary_id FROM categories WHERE slug = 'documentaries';

  -- Get Gaming L2 IDs
  SELECT id INTO v_pc_gaming_id FROM categories WHERE slug = 'pc-games';
  SELECT id INTO v_ps_games_id FROM categories WHERE slug = 'playstation-games';
  SELECT id INTO v_xbox_games_id FROM categories WHERE slug = 'xbox-games';
  SELECT id INTO v_nintendo_games_id FROM categories WHERE slug = 'nintendo-games';
  SELECT id INTO v_gaming_accessories_id FROM categories WHERE slug = 'gaming-accessories';

  -- Get E-Mobility L2 IDs
  SELECT id INTO v_electric_scooters_id FROM categories WHERE slug = 'electric-scooters';
  SELECT id INTO v_electric_bikes_id FROM categories WHERE slug = 'electric-bikes';
  SELECT id INTO v_hoverboards_id FROM categories WHERE slug = 'hoverboards';
  SELECT id INTO v_ev_accessories_id FROM categories WHERE slug = 'ev-accessories';

  -- BOOKS L3 --
  -- Fiction L3
  IF v_fiction_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Literary Fiction', 'Литературна проза', 'literary-fiction', v_fiction_id, 1),
    ('Mystery & Thriller', 'Мистерия и трилър', 'mystery-thriller', v_fiction_id, 2),
    ('Science Fiction', 'Научна фантастика', 'science-fiction-books', v_fiction_id, 3),
    ('Fantasy', 'Фентъзи', 'fantasy-books', v_fiction_id, 4),
    ('Romance', 'Романтика', 'romance-books', v_fiction_id, 5),
    ('Historical Fiction', 'Историческа проза', 'historical-fiction', v_fiction_id, 6),
    ('Horror Fiction', 'Хорър', 'horror-fiction', v_fiction_id, 7),
    ('Short Stories', 'Разкази', 'short-stories', v_fiction_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Non-Fiction L3
  IF v_nonfiction_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Biography', 'Биографии', 'biography', v_nonfiction_id, 1),
    ('Self-Help', 'Самопомощ', 'self-help-books', v_nonfiction_id, 2),
    ('Business & Economics', 'Бизнес и икономика', 'business-economics-books', v_nonfiction_id, 3),
    ('History', 'История', 'history-books', v_nonfiction_id, 4),
    ('Science', 'Наука', 'science-books', v_nonfiction_id, 5),
    ('Travel', 'Пътуване', 'travel-books', v_nonfiction_id, 6),
    ('Cookbooks', 'Готварски книги', 'cookbooks', v_nonfiction_id, 7),
    ('Philosophy', 'Философия', 'philosophy-books', v_nonfiction_id, 8),
    ('Psychology', 'Психология', 'psychology-books', v_nonfiction_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Textbooks L3
  IF v_textbooks_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Math Textbooks', 'Математика', 'math-textbooks', v_textbooks_id, 1),
    ('Science Textbooks', 'Наука', 'science-textbooks', v_textbooks_id, 2),
    ('Language Textbooks', 'Езикови', 'language-textbooks', v_textbooks_id, 3),
    ('Engineering Textbooks', 'Инженерни', 'engineering-textbooks', v_textbooks_id, 4),
    ('Medical Textbooks', 'Медицински', 'medical-textbooks', v_textbooks_id, 5),
    ('Law Textbooks', 'Юридически', 'law-textbooks', v_textbooks_id, 6),
    ('Computer Science', 'Информатика', 'cs-textbooks', v_textbooks_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Children's Books L3
  IF v_childrens_books_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Picture Books', 'Книжки с картинки', 'picture-books', v_childrens_books_id, 1),
    ('Early Readers', 'За начинаещи', 'early-readers', v_childrens_books_id, 2),
    ('Middle Grade', 'Средно ниво', 'middle-grade', v_childrens_books_id, 3),
    ('Young Adult', 'Тийнейджъри', 'young-adult', v_childrens_books_id, 4),
    ('Educational Books', 'Образователни', 'educational-books', v_childrens_books_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- MOVIES L3 --
  -- Action Movies L3
  IF v_action_movies_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Superhero', 'Супергерои', 'superhero-movies', v_action_movies_id, 1),
    ('Martial Arts', 'Бойни изкуства', 'martial-arts-movies', v_action_movies_id, 2),
    ('War Films', 'Военни', 'war-films', v_action_movies_id, 3),
    ('Spy & Espionage', 'Шпионски', 'spy-movies', v_action_movies_id, 4),
    ('Adventure', 'Приключенски', 'adventure-movies', v_action_movies_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Comedy Movies L3
  IF v_comedy_movies_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Romantic Comedy', 'Романтична комедия', 'romcom-movies', v_comedy_movies_id, 1),
    ('Slapstick', 'Слапстик', 'slapstick-movies', v_comedy_movies_id, 2),
    ('Dark Comedy', 'Черна комедия', 'dark-comedy', v_comedy_movies_id, 3),
    ('Parody', 'Пародия', 'parody-movies', v_comedy_movies_id, 4),
    ('Stand-up Comedy', 'Стендъп', 'standup-comedy', v_comedy_movies_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Drama Movies L3
  IF v_drama_movies_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Crime Drama', 'Криминална драма', 'crime-drama', v_drama_movies_id, 1),
    ('Family Drama', 'Семейна драма', 'family-drama', v_drama_movies_id, 2),
    ('Legal Drama', 'Съдебна драма', 'legal-drama', v_drama_movies_id, 3),
    ('Medical Drama', 'Медицинска драма', 'medical-drama', v_drama_movies_id, 4),
    ('Political Drama', 'Политическа драма', 'political-drama', v_drama_movies_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sci-Fi Movies L3
  IF v_scifi_movies_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Space Opera', 'Космическа опера', 'space-opera', v_scifi_movies_id, 1),
    ('Cyberpunk', 'Киберпънк', 'cyberpunk-movies', v_scifi_movies_id, 2),
    ('Time Travel', 'Пътуване във времето', 'time-travel-movies', v_scifi_movies_id, 3),
    ('Dystopian', 'Дистопия', 'dystopian-movies', v_scifi_movies_id, 4),
    ('Alien & UFO', 'Извънземни', 'alien-movies', v_scifi_movies_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- GAMING L3 --
  -- PC Games L3
  IF v_pc_gaming_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('FPS Games', 'FPS игри', 'fps-games', v_pc_gaming_id, 1),
    ('RPG Games', 'RPG игри', 'rpg-pc-games', v_pc_gaming_id, 2),
    ('Strategy Games', 'Стратегии', 'strategy-pc-games', v_pc_gaming_id, 3),
    ('MMORPG', 'MMORPG', 'mmorpg-games', v_pc_gaming_id, 4),
    ('Simulation Games', 'Симулатори', 'simulation-games', v_pc_gaming_id, 5),
    ('Sports Games', 'Спортни игри', 'sports-pc-games', v_pc_gaming_id, 6),
    ('Racing Games', 'Състезателни', 'racing-pc-games', v_pc_gaming_id, 7),
    ('Indie Games', 'Инди игри', 'indie-games', v_pc_gaming_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gaming Accessories L3
  IF v_gaming_accessories_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Gaming Keyboards', 'Геймърски клавиатури', 'gaming-keyboards', v_gaming_accessories_id, 1),
    ('Gaming Mice', 'Геймърски мишки', 'gaming-mice', v_gaming_accessories_id, 2),
    ('Gaming Headsets', 'Геймърски слушалки', 'gaming-headsets', v_gaming_accessories_id, 3),
    ('Gaming Monitors', 'Геймърски монитори', 'gaming-monitors', v_gaming_accessories_id, 4),
    ('Gaming Chairs', 'Геймърски столове', 'gaming-chairs', v_gaming_accessories_id, 5),
    ('Gaming Desks', 'Геймърски бюра', 'gaming-desks', v_gaming_accessories_id, 6),
    ('Streaming Equipment', 'Стрийминг оборудване', 'streaming-equipment', v_gaming_accessories_id, 7),
    ('VR Headsets', 'VR очила', 'vr-headsets', v_gaming_accessories_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- E-MOBILITY L3 --
  -- Electric Scooters L3
  IF v_electric_scooters_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Commuter Scooters', 'Градски тротинетки', 'commuter-scooters', v_electric_scooters_id, 1),
    ('Off-Road Scooters', 'Офроуд тротинетки', 'offroad-scooters', v_electric_scooters_id, 2),
    ('Folding Scooters', 'Сгъваеми тротинетки', 'folding-scooters', v_electric_scooters_id, 3),
    ('Kids Scooters', 'Детски тротинетки', 'kids-electric-scooters', v_electric_scooters_id, 4),
    ('Scooter Parts', 'Части за тротинетки', 'scooter-parts', v_electric_scooters_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Electric Bikes L3
  IF v_electric_bikes_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('City E-Bikes', 'Градски електровелосипеди', 'city-ebikes', v_electric_bikes_id, 1),
    ('Mountain E-Bikes', 'Планински електровелосипеди', 'mountain-ebikes', v_electric_bikes_id, 2),
    ('Folding E-Bikes', 'Сгъваеми електровелосипеди', 'folding-ebikes', v_electric_bikes_id, 3),
    ('Cargo E-Bikes', 'Товарни електровелосипеди', 'cargo-ebikes', v_electric_bikes_id, 4),
    ('E-Bike Batteries', 'Батерии за велосипеди', 'ebike-batteries', v_electric_bikes_id, 5),
    ('E-Bike Motors', 'Мотори за велосипеди', 'ebike-motors', v_electric_bikes_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hoverboards L3
  IF v_hoverboards_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Standard Hoverboards', 'Стандартни ховърборди', 'standard-hoverboards', v_hoverboards_id, 1),
    ('Off-Road Hoverboards', 'Офроуд ховърборди', 'offroad-hoverboards', v_hoverboards_id, 2),
    ('Kids Hoverboards', 'Детски ховърборди', 'kids-hoverboards', v_hoverboards_id, 3),
    ('Electric Unicycles', 'Електрически моноколела', 'electric-unicycles', v_hoverboards_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- EV Accessories L3
  IF v_ev_accessories_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Helmets', 'Каски', 'ev-helmets', v_ev_accessories_id, 1),
    ('Locks', 'Катинари', 'ev-locks', v_ev_accessories_id, 2),
    ('Bags & Carriers', 'Чанти и кошове', 'ev-bags', v_ev_accessories_id, 3),
    ('Lights', 'Светлини', 'ev-lights', v_ev_accessories_id, 4),
    ('Chargers', 'Зарядни', 'ev-chargers', v_ev_accessories_id, 5),
    ('Protective Gear', 'Предпазно оборудване', 'ev-protective-gear', v_ev_accessories_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Books, Movies, Gaming, E-Mobility L3 categories restored';
END $$;
;
