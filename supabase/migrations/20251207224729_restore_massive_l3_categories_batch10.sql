
-- Batch 10: Vehicles, E-Mobility, Hobbies, Tools, Books, Movies, Gaming deep categories
DO $$
DECLARE
  v_vehicles_id UUID;
  v_cars_id UUID;
  v_motorcycles_id UUID;
  v_auto_parts_id UUID;
  v_emobility_id UUID;
  v_escooters_id UUID;
  v_ebikes_id UUID;
  v_hobbies_id UUID;
  v_musical_id UUID;
  v_art_id UUID;
  v_collectibles_id UUID;
  v_tools_id UUID;
  v_power_tools_id UUID;
  v_hand_tools_id UUID;
  v_books_id UUID;
  v_movies_id UUID;
  v_gaming_id UUID;
BEGIN
  SELECT id INTO v_vehicles_id FROM categories WHERE slug = 'vehicles';
  SELECT id INTO v_cars_id FROM categories WHERE slug = 'cars';
  SELECT id INTO v_motorcycles_id FROM categories WHERE slug = 'motorcycles';
  SELECT id INTO v_auto_parts_id FROM categories WHERE slug = 'auto-parts-accessories';
  SELECT id INTO v_emobility_id FROM categories WHERE slug = 'e-mobility';
  SELECT id INTO v_escooters_id FROM categories WHERE slug = 'electric-scooters';
  SELECT id INTO v_ebikes_id FROM categories WHERE slug = 'electric-bikes';
  SELECT id INTO v_hobbies_id FROM categories WHERE slug = 'hobbies';
  SELECT id INTO v_musical_id FROM categories WHERE slug = 'musical-instruments';
  SELECT id INTO v_art_id FROM categories WHERE slug = 'art-supplies';
  SELECT id INTO v_collectibles_id FROM categories WHERE slug = 'collectibles';
  SELECT id INTO v_tools_id FROM categories WHERE slug = 'tools-home-improvement';
  SELECT id INTO v_power_tools_id FROM categories WHERE slug = 'power-tools';
  SELECT id INTO v_hand_tools_id FROM categories WHERE slug = 'hand-tools';
  SELECT id INTO v_books_id FROM categories WHERE slug = 'books';
  SELECT id INTO v_movies_id FROM categories WHERE slug = 'movies-tv';
  SELECT id INTO v_gaming_id FROM categories WHERE slug = 'gaming';
  
  -- Auto Parts & Accessories deep categories
  IF v_auto_parts_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Engine Parts', 'Части за двигател', 'auto-engine-parts', v_auto_parts_id, 1),
    ('Oil Filters', 'Маслени филтри', 'auto-oil-filters', v_auto_parts_id, 2),
    ('Air Filters', 'Въздушни филтри', 'auto-air-filters', v_auto_parts_id, 3),
    ('Spark Plugs', 'Запалителни свещи', 'auto-spark-plugs', v_auto_parts_id, 4),
    ('Brake Parts', 'Части за спирачки', 'auto-brake-parts', v_auto_parts_id, 5),
    ('Brake Pads', 'Накладки', 'auto-brake-pads', v_auto_parts_id, 6),
    ('Brake Discs', 'Спирачни дискове', 'auto-brake-discs', v_auto_parts_id, 7),
    ('Suspension Parts', 'Окачване', 'auto-suspension', v_auto_parts_id, 8),
    ('Shock Absorbers', 'Амортисьори', 'auto-shocks', v_auto_parts_id, 9),
    ('Springs', 'Пружини', 'auto-springs', v_auto_parts_id, 10),
    ('Tires', 'Гуми', 'auto-tires', v_auto_parts_id, 11),
    ('Summer Tires', 'Летни гуми', 'auto-tires-summer', v_auto_parts_id, 12),
    ('Winter Tires', 'Зимни гуми', 'auto-tires-winter', v_auto_parts_id, 13),
    ('All-Season Tires', 'Всесезонни гуми', 'auto-tires-all-season', v_auto_parts_id, 14),
    ('Car Batteries', 'Автомобилни акумулатори', 'auto-batteries', v_auto_parts_id, 15),
    ('Car Lights', 'Автомобилни светлини', 'auto-lights', v_auto_parts_id, 16),
    ('Headlights', 'Фарове', 'auto-headlights', v_auto_parts_id, 17),
    ('LED Lights', 'LED светлини', 'auto-led-lights', v_auto_parts_id, 18),
    ('Car Electronics', 'Автоелектроника', 'auto-electronics', v_auto_parts_id, 19),
    ('Car Stereos', 'Авто стерео системи', 'auto-stereos', v_auto_parts_id, 20),
    ('Dash Cams', 'Видеорегистратори', 'auto-dash-cams', v_auto_parts_id, 21),
    ('GPS Navigation', 'GPS навигации', 'auto-gps', v_auto_parts_id, 22),
    ('Car Covers', 'Авто покривала', 'auto-covers', v_auto_parts_id, 23),
    ('Floor Mats', 'Стелки', 'auto-floor-mats', v_auto_parts_id, 24),
    ('Seat Covers', 'Калъфи за седалки', 'auto-seat-covers', v_auto_parts_id, 25),
    ('Car Care', 'Автокозметика', 'auto-car-care', v_auto_parts_id, 26),
    ('Car Wash', 'Миене на автомобили', 'auto-car-wash', v_auto_parts_id, 27),
    ('Polish & Wax', 'Политури и восъци', 'auto-polish-wax', v_auto_parts_id, 28),
    ('Motor Oil', 'Моторно масло', 'auto-motor-oil', v_auto_parts_id, 29),
    ('Coolant', 'Антифриз', 'auto-coolant', v_auto_parts_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- E-Scooters deep categories
  IF v_escooters_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Adult E-Scooters', 'Електрически тротинетки за възрастни', 'escooters-adult', v_escooters_id, 1),
    ('Commuter Scooters', 'Градски тротинетки', 'escooters-commuter', v_escooters_id, 2),
    ('Off-Road Scooters', 'Офроуд тротинетки', 'escooters-offroad', v_escooters_id, 3),
    ('Foldable Scooters', 'Сгъваеми тротинетки', 'escooters-foldable', v_escooters_id, 4),
    ('Kids E-Scooters', 'Детски електрически тротинетки', 'escooters-kids', v_escooters_id, 5),
    ('E-Scooter Parts', 'Части за тротинетки', 'escooters-parts', v_escooters_id, 6),
    ('E-Scooter Batteries', 'Батерии за тротинетки', 'escooters-batteries', v_escooters_id, 7),
    ('E-Scooter Tires', 'Гуми за тротинетки', 'escooters-tires', v_escooters_id, 8),
    ('E-Scooter Accessories', 'Аксесоари за тротинетки', 'escooters-accessories', v_escooters_id, 9),
    ('E-Scooter Locks', 'Ключалки за тротинетки', 'escooters-locks', v_escooters_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Musical Instruments deep categories
  IF v_musical_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Guitars', 'Китари', 'musical-guitars', v_musical_id, 1),
    ('Electric Guitars', 'Електрически китари', 'musical-guitars-electric', v_musical_id, 2),
    ('Acoustic Guitars', 'Акустични китари', 'musical-guitars-acoustic', v_musical_id, 3),
    ('Bass Guitars', 'Бас китари', 'musical-guitars-bass', v_musical_id, 4),
    ('Classical Guitars', 'Класически китари', 'musical-guitars-classical', v_musical_id, 5),
    ('Guitar Amplifiers', 'Китарни усилватели', 'musical-guitar-amps', v_musical_id, 6),
    ('Guitar Effects', 'Китарни ефекти', 'musical-guitar-effects', v_musical_id, 7),
    ('Guitar Strings', 'Струни за китара', 'musical-guitar-strings', v_musical_id, 8),
    ('Keyboards & Pianos', 'Клавири и пиана', 'musical-keyboards', v_musical_id, 9),
    ('Digital Pianos', 'Дигитални пиана', 'musical-digital-pianos', v_musical_id, 10),
    ('Synthesizers', 'Синтезатори', 'musical-synthesizers', v_musical_id, 11),
    ('MIDI Controllers', 'MIDI контролери', 'musical-midi-controllers', v_musical_id, 12),
    ('Drums', 'Барабани', 'musical-drums', v_musical_id, 13),
    ('Acoustic Drums', 'Акустични барабани', 'musical-drums-acoustic', v_musical_id, 14),
    ('Electronic Drums', 'Електронни барабани', 'musical-drums-electronic', v_musical_id, 15),
    ('Drum Sticks', 'Палки за барабани', 'musical-drumsticks', v_musical_id, 16),
    ('Wind Instruments', 'Духови инструменти', 'musical-wind', v_musical_id, 17),
    ('Saxophones', 'Саксофони', 'musical-saxophones', v_musical_id, 18),
    ('Trumpets', 'Тромпети', 'musical-trumpets', v_musical_id, 19),
    ('Flutes', 'Флейти', 'musical-flutes', v_musical_id, 20),
    ('String Instruments', 'Струнни инструменти', 'musical-string', v_musical_id, 21),
    ('Violins', 'Цигулки', 'musical-violins', v_musical_id, 22),
    ('Cellos', 'Виолончела', 'musical-cellos', v_musical_id, 23),
    ('DJ Equipment', 'DJ оборудване', 'musical-dj', v_musical_id, 24),
    ('DJ Controllers', 'DJ контролери', 'musical-dj-controllers', v_musical_id, 25),
    ('Turntables', 'Грамофони', 'musical-turntables', v_musical_id, 26),
    ('Microphones', 'Микрофони', 'musical-microphones', v_musical_id, 27),
    ('Condenser Mics', 'Кондензаторни микрофони', 'musical-mics-condenser', v_musical_id, 28),
    ('Audio Interfaces', 'Аудио интерфейси', 'musical-audio-interfaces', v_musical_id, 29),
    ('Recording Equipment', 'Записващо оборудване', 'musical-recording', v_musical_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Power Tools deep categories
  IF v_power_tools_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Drills', 'Бормашини', 'tools-drills', v_power_tools_id, 1),
    ('Cordless Drills', 'Акумулаторни бормашини', 'tools-drills-cordless', v_power_tools_id, 2),
    ('Hammer Drills', 'Ударни бормашини', 'tools-drills-hammer', v_power_tools_id, 3),
    ('Impact Drivers', 'Ударни гайковерти', 'tools-impact-drivers', v_power_tools_id, 4),
    ('Saws', 'Триони', 'tools-saws', v_power_tools_id, 5),
    ('Circular Saws', 'Циркуляри', 'tools-saws-circular', v_power_tools_id, 6),
    ('Jigsaws', 'Прободни триони', 'tools-saws-jigsaw', v_power_tools_id, 7),
    ('Miter Saws', 'Герунг триони', 'tools-saws-miter', v_power_tools_id, 8),
    ('Table Saws', 'Циркулярни маси', 'tools-saws-table', v_power_tools_id, 9),
    ('Sanders', 'Шлифовъчни машини', 'tools-sanders', v_power_tools_id, 10),
    ('Orbital Sanders', 'Орбитални шлайфове', 'tools-sanders-orbital', v_power_tools_id, 11),
    ('Belt Sanders', 'Лентови шлайфове', 'tools-sanders-belt', v_power_tools_id, 12),
    ('Grinders', 'Ъглошлайфи', 'tools-grinders', v_power_tools_id, 13),
    ('Angle Grinders', 'Ъглошлайфи', 'tools-grinders-angle', v_power_tools_id, 14),
    ('Bench Grinders', 'Настолни шмиргели', 'tools-grinders-bench', v_power_tools_id, 15),
    ('Routers', 'Фрези', 'tools-routers', v_power_tools_id, 16),
    ('Planers', 'Рендето', 'tools-planers', v_power_tools_id, 17),
    ('Nail Guns', 'Пистолети за пирони', 'tools-nail-guns', v_power_tools_id, 18),
    ('Welders', 'Заваръчни апарати', 'tools-welders', v_power_tools_id, 19),
    ('MIG Welders', 'MIG заваръчни', 'tools-welders-mig', v_power_tools_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hand Tools deep categories
  IF v_hand_tools_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Screwdrivers', 'Отвертки', 'tools-screwdrivers', v_hand_tools_id, 1),
    ('Screwdriver Sets', 'Комплекти отвертки', 'tools-screwdrivers-sets', v_hand_tools_id, 2),
    ('Precision Screwdrivers', 'Прецизни отвертки', 'tools-screwdrivers-precision', v_hand_tools_id, 3),
    ('Wrenches', 'Гаечни ключове', 'tools-wrenches', v_hand_tools_id, 4),
    ('Socket Wrenches', 'Тресчотки', 'tools-wrenches-socket', v_hand_tools_id, 5),
    ('Adjustable Wrenches', 'Френски ключове', 'tools-wrenches-adjustable', v_hand_tools_id, 6),
    ('Pliers', 'Клещи', 'tools-pliers', v_hand_tools_id, 7),
    ('Needle Nose Pliers', 'Клещи с тънки челюсти', 'tools-pliers-needle-nose', v_hand_tools_id, 8),
    ('Locking Pliers', 'Грип клещи', 'tools-pliers-locking', v_hand_tools_id, 9),
    ('Hammers', 'Чукове', 'tools-hammers', v_hand_tools_id, 10),
    ('Claw Hammers', 'Шлосерски чукове', 'tools-hammers-claw', v_hand_tools_id, 11),
    ('Mallets', 'Гумени чукове', 'tools-mallets', v_hand_tools_id, 12),
    ('Measuring Tools', 'Измервателни инструменти', 'tools-measuring', v_hand_tools_id, 13),
    ('Tape Measures', 'Метри', 'tools-tape-measures', v_hand_tools_id, 14),
    ('Levels', 'Нивелири', 'tools-levels', v_hand_tools_id, 15),
    ('Squares', 'Триъгълници', 'tools-squares', v_hand_tools_id, 16),
    ('Utility Knives', 'Макетни ножове', 'tools-utility-knives', v_hand_tools_id, 17),
    ('Tool Boxes', 'Куфари за инструменти', 'tools-tool-boxes', v_hand_tools_id, 18),
    ('Tool Sets', 'Комплекти инструменти', 'tools-tool-sets', v_hand_tools_id, 19),
    ('Clamps', 'Стеги', 'tools-clamps', v_hand_tools_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Books deep categories
  IF v_books_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Fiction', 'Художествена литература', 'books-fiction', v_books_id, 1),
    ('Mystery & Thriller', 'Мистерия и трилър', 'books-mystery-thriller', v_books_id, 2),
    ('Science Fiction', 'Научна фантастика', 'books-sci-fi', v_books_id, 3),
    ('Fantasy', 'Фентъзи', 'books-fantasy', v_books_id, 4),
    ('Romance', 'Романтика', 'books-romance', v_books_id, 5),
    ('Horror', 'Хорър', 'books-horror', v_books_id, 6),
    ('Non-Fiction', 'Нехудожествена литература', 'books-nonfiction', v_books_id, 7),
    ('Biography', 'Биография', 'books-biography', v_books_id, 8),
    ('History', 'История', 'books-history', v_books_id, 9),
    ('Self-Help', 'Самоусъвършенстване', 'books-self-help', v_books_id, 10),
    ('Business', 'Бизнес', 'books-business', v_books_id, 11),
    ('Science', 'Наука', 'books-science', v_books_id, 12),
    ('Children''s Books', 'Детски книги', 'books-children', v_books_id, 13),
    ('Picture Books', 'Книжки с картинки', 'books-picture', v_books_id, 14),
    ('Young Adult', 'За тийнейджъри', 'books-young-adult', v_books_id, 15),
    ('Comics & Manga', 'Комикси и манга', 'books-comics-manga', v_books_id, 16),
    ('Textbooks', 'Учебници', 'books-textbooks', v_books_id, 17),
    ('Cookbooks', 'Готварски книги', 'books-cookbooks', v_books_id, 18),
    ('Art Books', 'Книги за изкуство', 'books-art', v_books_id, 19),
    ('E-Books', 'Е-книги', 'books-ebooks', v_books_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gaming deep categories
  IF v_gaming_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('PlayStation', 'PlayStation', 'gaming-playstation', v_gaming_id, 1),
    ('PS5 Games', 'PS5 игри', 'gaming-ps5-games', v_gaming_id, 2),
    ('PS5 Accessories', 'PS5 аксесоари', 'gaming-ps5-accessories', v_gaming_id, 3),
    ('PS4 Games', 'PS4 игри', 'gaming-ps4-games', v_gaming_id, 4),
    ('Xbox', 'Xbox', 'gaming-xbox', v_gaming_id, 5),
    ('Xbox Series X Games', 'Xbox Series X игри', 'gaming-xbox-series-games', v_gaming_id, 6),
    ('Xbox Accessories', 'Xbox аксесоари', 'gaming-xbox-accessories', v_gaming_id, 7),
    ('Nintendo', 'Nintendo', 'gaming-nintendo', v_gaming_id, 8),
    ('Nintendo Switch Games', 'Nintendo Switch игри', 'gaming-switch-games', v_gaming_id, 9),
    ('Switch Accessories', 'Switch аксесоари', 'gaming-switch-accessories', v_gaming_id, 10),
    ('PC Gaming', 'PC гейминг', 'gaming-pc', v_gaming_id, 11),
    ('PC Games', 'PC игри', 'gaming-pc-games', v_gaming_id, 12),
    ('Gaming PCs', 'Гейминг компютри', 'gaming-pcs', v_gaming_id, 13),
    ('Gaming Chairs', 'Гейминг столове', 'gaming-chairs', v_gaming_id, 14),
    ('Gaming Desks', 'Гейминг бюра', 'gaming-desks', v_gaming_id, 15),
    ('Controllers', 'Контролери', 'gaming-controllers', v_gaming_id, 16),
    ('VR Gaming', 'VR гейминг', 'gaming-vr', v_gaming_id, 17),
    ('VR Headsets', 'VR очила', 'gaming-vr-headsets', v_gaming_id, 18),
    ('Gaming Accessories', 'Гейминг аксесоари', 'gaming-accessories', v_gaming_id, 19),
    ('Retro Gaming', 'Ретро гейминг', 'gaming-retro', v_gaming_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
