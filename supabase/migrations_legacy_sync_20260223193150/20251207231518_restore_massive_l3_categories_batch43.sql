
-- Batch 43: More deep categories - Musical Instruments, Collectibles, Bulgarian
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Musical Instruments deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'acoustic-guitars';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Classical Guitars', 'Класически китари', 'classical-guitars', v_parent_id, 1),
      ('Dreadnought Guitars', 'Дреднаут китари', 'dreadnought-guitars', v_parent_id, 2),
      ('Parlor Guitars', 'Парлор китари', 'parlor-guitars', v_parent_id, 3),
      ('12-String Guitars', '12-струнни китари', '12-string-guitars', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'electric-guitars';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Stratocaster Style', 'Stratocaster тип', 'stratocaster-style', v_parent_id, 1),
      ('Telecaster Style', 'Telecaster тип', 'telecaster-style', v_parent_id, 2),
      ('Les Paul Style', 'Les Paul тип', 'les-paul-style', v_parent_id, 3),
      ('Semi-Hollow', 'Полукухи', 'semi-hollow-guitars', v_parent_id, 4),
      ('Metal Guitars', 'Метъл китари', 'metal-guitars', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bass-guitars';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('4-String Bass', '4-струнен бас', '4-string-bass', v_parent_id, 1),
      ('5-String Bass', '5-струнен бас', '5-string-bass', v_parent_id, 2),
      ('Acoustic Bass', 'Акустичен бас', 'acoustic-bass', v_parent_id, 3),
      ('Short Scale Bass', 'Къса скала бас', 'short-scale-bass', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'drums-percussion';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Acoustic Drum Kits', 'Акустични барабани', 'acoustic-drum-kits', v_parent_id, 1),
      ('Electronic Drum Kits', 'Електронни барабани', 'electronic-drum-kits', v_parent_id, 2),
      ('Cymbals', 'Чинели', 'cymbals', v_parent_id, 3),
      ('Snare Drums', 'Малки барабани', 'snare-drums', v_parent_id, 4),
      ('Drum Hardware', 'Хардуер за барабани', 'drum-hardware', v_parent_id, 5),
      ('Hand Percussion', 'Перкусии', 'hand-percussion', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'keyboards-pianos';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Digital Pianos', 'Цифрови пиана', 'digital-pianos', v_parent_id, 1),
      ('Synthesizers', 'Синтезатори', 'synthesizers', v_parent_id, 2),
      ('MIDI Controllers', 'MIDI контролери', 'midi-controllers', v_parent_id, 3),
      ('Keyboard Stands', 'Стойки за клавиши', 'keyboard-stands', v_parent_id, 4),
      ('Workstation Keyboards', 'Работни станции', 'workstation-keyboards', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Collectibles deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'coins-currency';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Rare Coins', 'Редки монети', 'rare-coins', v_parent_id, 1),
      ('Bullion Coins', 'Кюлчета и монети', 'bullion-coins', v_parent_id, 2),
      ('Ancient Coins', 'Антични монети', 'ancient-coins', v_parent_id, 3),
      ('Paper Money', 'Банкноти', 'paper-money', v_parent_id, 4),
      ('Coin Supplies', 'Консумативи за монети', 'coin-supplies', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'stamps';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Rare Stamps', 'Редки марки', 'rare-stamps', v_parent_id, 1),
      ('Stamp Albums', 'Албуми за марки', 'stamp-albums', v_parent_id, 2),
      ('First Day Covers', 'Първодневни пликове', 'first-day-covers', v_parent_id, 3),
      ('Stamp Supplies', 'Консумативи за марки', 'stamp-supplies', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sports-memorabilia';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Autographed Items', 'Автографирани артикули', 'autographed-items', v_parent_id, 1),
      ('Trading Cards', 'Търговски карти', 'trading-cards', v_parent_id, 2),
      ('Game-Used Items', 'Използвани в игра', 'game-used-items', v_parent_id, 3),
      ('Jerseys', 'Фланелки', 'collectible-jerseys', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bulgarian Traditional deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bulgarian-traditional';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bulgarian Folk Costumes', 'Български народни носии', 'bulgarian-folk-costumes', v_parent_id, 1),
      ('Bulgarian Pottery', 'Българска керамика', 'bulgarian-pottery', v_parent_id, 2),
      ('Bulgarian Embroidery', 'Българска бродерия', 'bulgarian-embroidery', v_parent_id, 3),
      ('Bulgarian Wood Carving', 'Българска дърворезба', 'bulgarian-wood-carving', v_parent_id, 4),
      ('Rose Products', 'Розови продукти', 'rose-products', v_parent_id, 5),
      ('Bulgarian Wines', 'Български вина', 'bulgarian-wines', v_parent_id, 6),
      ('Bulgarian Spirits', 'Български спиртни напитки', 'bulgarian-spirits', v_parent_id, 7),
      ('Bulgarian Herbs', 'Български билки', 'bulgarian-herbs', v_parent_id, 8),
      ('Bulgarian Honey', 'Български мед', 'bulgarian-honey', v_parent_id, 9),
      ('Bulgarian Instruments', 'Български инструменти', 'bulgarian-instruments', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bulgarian Instruments deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bulgarian-instruments';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gaida (Bagpipes)', 'Гайда', 'gaida', v_parent_id, 1),
      ('Kaval', 'Кавал', 'kaval', v_parent_id, 2),
      ('Gadulka', 'Гъдулка', 'gadulka', v_parent_id, 3),
      ('Tambura', 'Тамбура', 'tambura', v_parent_id, 4),
      ('Tapan', 'Тъпан', 'tapan', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bulgarian Folk Costumes deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bulgarian-folk-costumes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Thracian Costumes', 'Тракийски носии', 'thracian-costumes', v_parent_id, 1),
      ('Shopluk Costumes', 'Шопски носии', 'shopluk-costumes', v_parent_id, 2),
      ('Rhodope Costumes', 'Родопски носии', 'rhodope-costumes', v_parent_id, 3),
      ('Dobrudzha Costumes', 'Добруджански носии', 'dobrudzha-costumes', v_parent_id, 4),
      ('Folk Accessories', 'Народни аксесоари', 'folk-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
