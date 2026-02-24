
-- Batch 44: More deep categories - Services, Real Estate, Industrial
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Services deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'home-services';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Plumbing Services', 'ВиК услуги', 'plumbing-services', v_parent_id, 1),
      ('Electrical Services', 'Електроуслуги', 'electrical-services', v_parent_id, 2),
      ('HVAC Services', 'Климатизация услуги', 'hvac-services', v_parent_id, 3),
      ('Cleaning Services', 'Почистване', 'cleaning-services', v_parent_id, 4),
      ('Landscaping Services', 'Озеленяване', 'landscaping-services', v_parent_id, 5),
      ('Pest Control Services', 'Дезинфекция', 'pest-control-services', v_parent_id, 6),
      ('Home Security', 'Домашна сигурност', 'home-security-services', v_parent_id, 7),
      ('Moving Services', 'Преместване', 'moving-services', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'professional-services';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Legal Services', 'Правни услуги', 'legal-services', v_parent_id, 1),
      ('Accounting Services', 'Счетоводни услуги', 'accounting-services', v_parent_id, 2),
      ('Marketing Services', 'Маркетинг услуги', 'marketing-services', v_parent_id, 3),
      ('IT Services', 'IT услуги', 'it-services', v_parent_id, 4),
      ('Consulting Services', 'Консултантски услуги', 'consulting-services', v_parent_id, 5),
      ('Translation Services', 'Преводачески услуги', 'translation-services', v_parent_id, 6),
      ('Photography Services', 'Фотографски услуги', 'photography-services', v_parent_id, 7),
      ('Design Services', 'Дизайнерски услуги', 'design-services', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'event-services';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wedding Services', 'Сватбени услуги', 'wedding-services', v_parent_id, 1),
      ('Catering Services', 'Кетъринг', 'catering-services', v_parent_id, 2),
      ('DJ Services', 'DJ услуги', 'dj-services', v_parent_id, 3),
      ('Event Planning', 'Организиране на събития', 'event-planning', v_parent_id, 4),
      ('Venue Rental', 'Наем на зали', 'venue-rental', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'health-services';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dental Services', 'Зъболекарски услуги', 'dental-services', v_parent_id, 1),
      ('Medical Services', 'Медицински услуги', 'medical-services', v_parent_id, 2),
      ('Veterinary Services', 'Ветеринарни услуги', 'veterinary-services', v_parent_id, 3),
      ('Therapy Services', 'Терапевтични услуги', 'therapy-services', v_parent_id, 4),
      ('Fitness Training', 'Фитнес тренировки', 'fitness-training', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'education-services';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tutoring', 'Частни уроци', 'tutoring', v_parent_id, 1),
      ('Language Classes', 'Езикови курсове', 'language-classes', v_parent_id, 2),
      ('Music Lessons', 'Музикални уроци', 'music-lessons', v_parent_id, 3),
      ('Art Classes', 'Уроци по изкуство', 'art-classes', v_parent_id, 4),
      ('Online Courses', 'Онлайн курсове', 'online-courses', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Real Estate deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'residential-sale';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Apartments for Sale', 'Апартаменти за продажба', 'apartments-for-sale', v_parent_id, 1),
      ('Houses for Sale', 'Къщи за продажба', 'houses-for-sale', v_parent_id, 2),
      ('Villas for Sale', 'Вили за продажба', 'villas-for-sale', v_parent_id, 3),
      ('Studios for Sale', 'Студия за продажба', 'studios-for-sale', v_parent_id, 4),
      ('Penthouses for Sale', 'Пентхауси за продажба', 'penthouses-for-sale', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'residential-rent';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Apartments for Rent', 'Апартаменти под наем', 'apartments-for-rent', v_parent_id, 1),
      ('Houses for Rent', 'Къщи под наем', 'houses-for-rent', v_parent_id, 2),
      ('Studios for Rent', 'Студия под наем', 'studios-for-rent', v_parent_id, 3),
      ('Rooms for Rent', 'Стаи под наем', 'rooms-for-rent', v_parent_id, 4),
      ('Short-Term Rentals', 'Краткосрочен наем', 'short-term-rentals', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'commercial-real-estate';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Office Space', 'Офис площи', 'office-space', v_parent_id, 1),
      ('Retail Space', 'Търговски площи', 'retail-space', v_parent_id, 2),
      ('Warehouse Space', 'Складови площи', 'warehouse-space', v_parent_id, 3),
      ('Industrial Property', 'Индустриални имоти', 'industrial-property', v_parent_id, 4),
      ('Land for Sale', 'Парцели за продажба', 'land-for-sale', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Industrial deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'industrial-equipment';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Manufacturing Equipment', 'Производствено оборудване', 'manufacturing-equipment', v_parent_id, 1),
      ('Packaging Equipment', 'Опаковъчно оборудване', 'packaging-equipment', v_parent_id, 2),
      ('Material Handling', 'Товарно-разтоварна техника', 'material-handling', v_parent_id, 3),
      ('Welding Equipment', 'Заваръчно оборудване', 'welding-equipment', v_parent_id, 4),
      ('Industrial Tools', 'Индустриални инструменти', 'industrial-tools', v_parent_id, 5),
      ('Safety Equipment', 'Защитно оборудване', 'safety-equipment', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'construction-equipment';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Excavators', 'Багери', 'excavators', v_parent_id, 1),
      ('Bulldozers', 'Булдозери', 'bulldozers', v_parent_id, 2),
      ('Cranes', 'Кранове', 'cranes', v_parent_id, 3),
      ('Concrete Equipment', 'Бетонно оборудване', 'concrete-equipment', v_parent_id, 4),
      ('Scaffolding', 'Скелета', 'scaffolding', v_parent_id, 5),
      ('Generators', 'Генератори', 'generators', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
