
-- Batch 9: Electronics deep L3 categories (Computers, Audio, Cameras)
DO $$
DECLARE
  v_electronics_id UUID;
  v_computers_id UUID;
  v_laptops_id UUID;
  v_desktops_id UUID;
  v_components_id UUID;
  v_peripherals_id UUID;
  v_monitors_id UUID;
  v_audio_id UUID;
  v_headphones_id UUID;
  v_speakers_id UUID;
  v_cameras_id UUID;
  v_tv_id UUID;
  v_gaming_id UUID;
  v_wearables_id UUID;
  v_networking_id UUID;
  v_storage_id UUID;
BEGIN
  SELECT id INTO v_electronics_id FROM categories WHERE slug = 'electronics';
  SELECT id INTO v_computers_id FROM categories WHERE slug = 'computers-tablets';
  SELECT id INTO v_laptops_id FROM categories WHERE slug = 'laptops';
  SELECT id INTO v_desktops_id FROM categories WHERE slug = 'desktop-computers';
  SELECT id INTO v_components_id FROM categories WHERE slug = 'computer-components';
  SELECT id INTO v_peripherals_id FROM categories WHERE slug = 'peripherals';
  SELECT id INTO v_monitors_id FROM categories WHERE slug = 'monitors';
  SELECT id INTO v_audio_id FROM categories WHERE slug = 'audio-equipment';
  SELECT id INTO v_headphones_id FROM categories WHERE slug = 'headphones';
  SELECT id INTO v_speakers_id FROM categories WHERE slug = 'speakers';
  SELECT id INTO v_cameras_id FROM categories WHERE slug = 'cameras-photography';
  SELECT id INTO v_tv_id FROM categories WHERE slug = 'tv-home-theater';
  SELECT id INTO v_gaming_id FROM categories WHERE slug = 'gaming';
  SELECT id INTO v_wearables_id FROM categories WHERE slug = 'wearable-technology';
  SELECT id INTO v_networking_id FROM categories WHERE slug = 'networking';
  SELECT id INTO v_storage_id FROM categories WHERE slug = 'data-storage';
  
  -- Laptops deep categories
  IF v_laptops_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Gaming Laptops', 'Гейминг лаптопи', 'laptops-gaming', v_laptops_id, 1),
    ('RTX Laptops', 'RTX лаптопи', 'laptops-gaming-rtx', v_laptops_id, 2),
    ('Business Laptops', 'Бизнес лаптопи', 'laptops-business', v_laptops_id, 3),
    ('Ultrabooks', 'Ултрабуци', 'laptops-ultrabooks', v_laptops_id, 4),
    ('2-in-1 Laptops', '2-в-1 лаптопи', 'laptops-2in1', v_laptops_id, 5),
    ('Convertible Laptops', 'Конвертируеми лаптопи', 'laptops-convertible', v_laptops_id, 6),
    ('Budget Laptops', 'Бюджетни лаптопи', 'laptops-budget', v_laptops_id, 7),
    ('Student Laptops', 'Лаптопи за студенти', 'laptops-student', v_laptops_id, 8),
    ('MacBooks', 'Макбуци', 'laptops-macbooks', v_laptops_id, 9),
    ('MacBook Air', 'MacBook Air', 'laptops-macbook-air', v_laptops_id, 10),
    ('MacBook Pro', 'MacBook Pro', 'laptops-macbook-pro', v_laptops_id, 11),
    ('Chromebooks', 'Хромбуци', 'laptops-chromebooks', v_laptops_id, 12),
    ('Workstation Laptops', 'Работни станции', 'laptops-workstations', v_laptops_id, 13),
    ('Laptop Accessories', 'Аксесоари за лаптоп', 'laptops-accessories', v_laptops_id, 14),
    ('Laptop Bags', 'Чанти за лаптоп', 'laptops-bags', v_laptops_id, 15),
    ('Laptop Stands', 'Стойки за лаптоп', 'laptops-stands', v_laptops_id, 16),
    ('Laptop Chargers', 'Зарядни за лаптоп', 'laptops-chargers', v_laptops_id, 17),
    ('Docking Stations', 'Докинг станции', 'laptops-docking-stations', v_laptops_id, 18),
    ('Laptop Cooling', 'Охлаждане за лаптоп', 'laptops-cooling', v_laptops_id, 19),
    ('Screen Protectors', 'Протектори за екран', 'laptops-screen-protectors', v_laptops_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Computer Components deep categories
  IF v_components_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('CPUs', 'Процесори', 'components-cpus', v_components_id, 1),
    ('Intel CPUs', 'Intel процесори', 'components-cpus-intel', v_components_id, 2),
    ('AMD CPUs', 'AMD процесори', 'components-cpus-amd', v_components_id, 3),
    ('Graphics Cards', 'Видео карти', 'components-gpus', v_components_id, 4),
    ('NVIDIA GPUs', 'NVIDIA видео карти', 'components-gpus-nvidia', v_components_id, 5),
    ('AMD GPUs', 'AMD видео карти', 'components-gpus-amd', v_components_id, 6),
    ('Motherboards', 'Дънни платки', 'components-motherboards', v_components_id, 7),
    ('Intel Motherboards', 'Intel дънни платки', 'components-motherboards-intel', v_components_id, 8),
    ('AMD Motherboards', 'AMD дънни платки', 'components-motherboards-amd', v_components_id, 9),
    ('RAM', 'Оперативна памет', 'components-ram', v_components_id, 10),
    ('DDR4 RAM', 'DDR4 памет', 'components-ram-ddr4', v_components_id, 11),
    ('DDR5 RAM', 'DDR5 памет', 'components-ram-ddr5', v_components_id, 12),
    ('SSDs', 'SSD дискове', 'components-ssds', v_components_id, 13),
    ('NVMe SSDs', 'NVMe SSD', 'components-ssds-nvme', v_components_id, 14),
    ('SATA SSDs', 'SATA SSD', 'components-ssds-sata', v_components_id, 15),
    ('Hard Drives', 'Твърди дискове', 'components-hdds', v_components_id, 16),
    ('Power Supplies', 'Захранвания', 'components-psus', v_components_id, 17),
    ('Modular PSUs', 'Модулни захранвания', 'components-psus-modular', v_components_id, 18),
    ('PC Cases', 'Кутии за компютър', 'components-cases', v_components_id, 19),
    ('Mid Tower Cases', 'Mid Tower кутии', 'components-cases-mid-tower', v_components_id, 20),
    ('Full Tower Cases', 'Full Tower кутии', 'components-cases-full-tower', v_components_id, 21),
    ('CPU Coolers', 'Охлаждания за процесор', 'components-cpu-coolers', v_components_id, 22),
    ('Air Coolers', 'Въздушни охлаждания', 'components-coolers-air', v_components_id, 23),
    ('AIO Coolers', 'AIO охлаждания', 'components-coolers-aio', v_components_id, 24),
    ('Case Fans', 'Вентилатори', 'components-case-fans', v_components_id, 25),
    ('RGB Fans', 'RGB вентилатори', 'components-fans-rgb', v_components_id, 26),
    ('Thermal Paste', 'Термопаста', 'components-thermal-paste', v_components_id, 27),
    ('Sound Cards', 'Звукови карти', 'components-sound-cards', v_components_id, 28),
    ('Network Cards', 'Мрежови карти', 'components-network-cards', v_components_id, 29),
    ('Cable Management', 'Кабел мениджмънт', 'components-cable-management', v_components_id, 30)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Peripherals deep categories
  IF v_peripherals_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Keyboards', 'Клавиатури', 'peripherals-keyboards', v_peripherals_id, 1),
    ('Mechanical Keyboards', 'Механични клавиатури', 'peripherals-keyboards-mechanical', v_peripherals_id, 2),
    ('Gaming Keyboards', 'Гейминг клавиатури', 'peripherals-keyboards-gaming', v_peripherals_id, 3),
    ('Wireless Keyboards', 'Безжични клавиатури', 'peripherals-keyboards-wireless', v_peripherals_id, 4),
    ('Ergonomic Keyboards', 'Ергономични клавиатури', 'peripherals-keyboards-ergonomic', v_peripherals_id, 5),
    ('Mice', 'Мишки', 'peripherals-mice', v_peripherals_id, 6),
    ('Gaming Mice', 'Гейминг мишки', 'peripherals-mice-gaming', v_peripherals_id, 7),
    ('Wireless Mice', 'Безжични мишки', 'peripherals-mice-wireless', v_peripherals_id, 8),
    ('Ergonomic Mice', 'Ергономични мишки', 'peripherals-mice-ergonomic', v_peripherals_id, 9),
    ('Trackballs', 'Тракболи', 'peripherals-trackballs', v_peripherals_id, 10),
    ('Mouse Pads', 'Пад за мишка', 'peripherals-mousepads', v_peripherals_id, 11),
    ('Gaming Mouse Pads', 'Гейминг пад за мишка', 'peripherals-mousepads-gaming', v_peripherals_id, 12),
    ('Webcams', 'Уебкамери', 'peripherals-webcams', v_peripherals_id, 13),
    ('HD Webcams', 'HD уебкамери', 'peripherals-webcams-hd', v_peripherals_id, 14),
    ('4K Webcams', '4K уебкамери', 'peripherals-webcams-4k', v_peripherals_id, 15),
    ('USB Hubs', 'USB хъбове', 'peripherals-usb-hubs', v_peripherals_id, 16),
    ('Card Readers', 'Четци за карти', 'peripherals-card-readers', v_peripherals_id, 17),
    ('Printers', 'Принтери', 'peripherals-printers', v_peripherals_id, 18),
    ('Inkjet Printers', 'Мастиленоструйни принтери', 'peripherals-printers-inkjet', v_peripherals_id, 19),
    ('Laser Printers', 'Лазерни принтери', 'peripherals-printers-laser', v_peripherals_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Monitors deep categories
  IF v_monitors_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Gaming Monitors', 'Гейминг монитори', 'monitors-gaming', v_monitors_id, 1),
    ('144Hz Monitors', '144Hz монитори', 'monitors-gaming-144hz', v_monitors_id, 2),
    ('240Hz Monitors', '240Hz монитори', 'monitors-gaming-240hz', v_monitors_id, 3),
    ('4K Monitors', '4K монитори', 'monitors-4k', v_monitors_id, 4),
    ('Ultrawide Monitors', 'Ултраширокоекранни монитори', 'monitors-ultrawide', v_monitors_id, 5),
    ('Curved Monitors', 'Извити монитори', 'monitors-curved', v_monitors_id, 6),
    ('Professional Monitors', 'Професионални монитори', 'monitors-professional', v_monitors_id, 7),
    ('Office Monitors', 'Офис монитори', 'monitors-office', v_monitors_id, 8),
    ('Portable Monitors', 'Преносими монитори', 'monitors-portable', v_monitors_id, 9),
    ('Monitor Arms', 'Рамена за монитор', 'monitors-arms', v_monitors_id, 10),
    ('Monitor Stands', 'Стойки за монитор', 'monitors-stands', v_monitors_id, 11)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Headphones deep categories
  IF v_headphones_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Over-Ear Headphones', 'Наушници over-ear', 'headphones-over-ear', v_headphones_id, 1),
    ('On-Ear Headphones', 'Наушници on-ear', 'headphones-on-ear', v_headphones_id, 2),
    ('In-Ear Headphones', 'Слушалки in-ear', 'headphones-in-ear', v_headphones_id, 3),
    ('True Wireless', 'Безжични слушалки', 'headphones-true-wireless', v_headphones_id, 4),
    ('Noise Cancelling', 'С активно шумопотискане', 'headphones-anc', v_headphones_id, 5),
    ('Gaming Headsets', 'Гейминг слушалки', 'headphones-gaming', v_headphones_id, 6),
    ('Wireless Gaming', 'Безжични гейминг слушалки', 'headphones-gaming-wireless', v_headphones_id, 7),
    ('Sports Headphones', 'Спортни слушалки', 'headphones-sports', v_headphones_id, 8),
    ('Studio Headphones', 'Студийни слушалки', 'headphones-studio', v_headphones_id, 9),
    ('DJ Headphones', 'DJ слушалки', 'headphones-dj', v_headphones_id, 10),
    ('Kids Headphones', 'Детски слушалки', 'headphones-kids', v_headphones_id, 11),
    ('Headphone Accessories', 'Аксесоари за слушалки', 'headphones-accessories', v_headphones_id, 12)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Speakers deep categories
  IF v_speakers_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Bluetooth Speakers', 'Bluetooth колони', 'speakers-bluetooth', v_speakers_id, 1),
    ('Portable Speakers', 'Преносими колони', 'speakers-portable', v_speakers_id, 2),
    ('Smart Speakers', 'Смарт колони', 'speakers-smart', v_speakers_id, 3),
    ('Soundbars', 'Саундбарове', 'speakers-soundbars', v_speakers_id, 4),
    ('Bookshelf Speakers', 'Рафтови колони', 'speakers-bookshelf', v_speakers_id, 5),
    ('Floor Standing Speakers', 'Подови колони', 'speakers-floor-standing', v_speakers_id, 6),
    ('Computer Speakers', 'Компютърни колони', 'speakers-computer', v_speakers_id, 7),
    ('Subwoofers', 'Субуфери', 'speakers-subwoofers', v_speakers_id, 8),
    ('Home Theater', 'Домашно кино', 'speakers-home-theater', v_speakers_id, 9),
    ('PA Systems', 'PA системи', 'speakers-pa-systems', v_speakers_id, 10),
    ('Studio Monitors', 'Студийни монитори', 'speakers-studio-monitors', v_speakers_id, 11)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cameras deep categories
  IF v_cameras_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('DSLR Cameras', 'DSLR фотоапарати', 'cameras-dslr', v_cameras_id, 1),
    ('Mirrorless Cameras', 'Безогледални камери', 'cameras-mirrorless', v_cameras_id, 2),
    ('Full Frame', 'Full Frame камери', 'cameras-full-frame', v_cameras_id, 3),
    ('APS-C Cameras', 'APS-C камери', 'cameras-apsc', v_cameras_id, 4),
    ('Point & Shoot', 'Компактни камери', 'cameras-point-shoot', v_cameras_id, 5),
    ('Action Cameras', 'Екшън камери', 'cameras-action', v_cameras_id, 6),
    ('Instant Cameras', 'Инстантни камери', 'cameras-instant', v_cameras_id, 7),
    ('Film Cameras', 'Филмови камери', 'cameras-film', v_cameras_id, 8),
    ('Camera Lenses', 'Обективи', 'cameras-lenses', v_cameras_id, 9),
    ('Prime Lenses', 'Фиксове', 'cameras-lenses-prime', v_cameras_id, 10),
    ('Zoom Lenses', 'Зумове', 'cameras-lenses-zoom', v_cameras_id, 11),
    ('Wide Angle', 'Широкоъгълни', 'cameras-lenses-wide', v_cameras_id, 12),
    ('Telephoto', 'Телеобективи', 'cameras-lenses-telephoto', v_cameras_id, 13),
    ('Tripods', 'Статив', 'cameras-tripods', v_cameras_id, 14),
    ('Camera Bags', 'Чанти за камера', 'cameras-bags', v_cameras_id, 15),
    ('Camera Straps', 'Каишки за камера', 'cameras-straps', v_cameras_id, 16),
    ('Memory Cards', 'Карти памет', 'cameras-memory-cards', v_cameras_id, 17),
    ('Camera Filters', 'Филтри за камера', 'cameras-filters', v_cameras_id, 18),
    ('Lighting Equipment', 'Осветление', 'cameras-lighting', v_cameras_id, 19),
    ('Drones', 'Дронове', 'cameras-drones', v_cameras_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- TV & Home Theater deep categories
  IF v_tv_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('4K TVs', '4K телевизори', 'tv-4k', v_tv_id, 1),
    ('8K TVs', '8K телевизори', 'tv-8k', v_tv_id, 2),
    ('OLED TVs', 'OLED телевизори', 'tv-oled', v_tv_id, 3),
    ('QLED TVs', 'QLED телевизори', 'tv-qled', v_tv_id, 4),
    ('LED TVs', 'LED телевизори', 'tv-led', v_tv_id, 5),
    ('Smart TVs', 'Смарт телевизори', 'tv-smart', v_tv_id, 6),
    ('Mini LED TVs', 'Mini LED телевизори', 'tv-mini-led', v_tv_id, 7),
    ('Projectors', 'Проектори', 'tv-projectors', v_tv_id, 8),
    ('4K Projectors', '4K проектори', 'tv-projectors-4k', v_tv_id, 9),
    ('Portable Projectors', 'Преносими проектори', 'tv-projectors-portable', v_tv_id, 10),
    ('Projector Screens', 'Екрани за проектор', 'tv-projector-screens', v_tv_id, 11),
    ('TV Mounts', 'Стойки за телевизор', 'tv-mounts', v_tv_id, 12),
    ('Wall Mounts', 'Стенни стойки', 'tv-mounts-wall', v_tv_id, 13),
    ('Streaming Devices', 'Стрийминг устройства', 'tv-streaming', v_tv_id, 14),
    ('AV Receivers', 'AV ресивъри', 'tv-av-receivers', v_tv_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
