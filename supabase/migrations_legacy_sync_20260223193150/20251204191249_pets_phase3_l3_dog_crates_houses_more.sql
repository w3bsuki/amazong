-- PETS PHASE 3: Add L3 categories for Dog Crates, Houses, Doors, Waste, Harnesses, Tech
-- Dog Crates ID: ed9762f3-2d5e-4505-925e-5a96d403c6aa
-- Dog Houses ID: 79ff6a9c-1886-4fbc-9dcc-2e3992887dc7
-- Dog Doors ID: aae8bac2-a341-4070-9cf7-72a03965cb7f
-- Dog Waste ID: 5564351d-0bee-4c67-8ab7-6e329d5cef1a
-- Dog Harnesses ID: 93624fd3-f667-4e83-af61-cf388dbbd785
-- Dog Tech ID: e89bf68d-fdfa-4798-826d-5cb6029d058f

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  -- Dog Crates L3
  ('Wire Dog Crates', 'Телени клетки', 'dog-crates-wire', 'ed9762f3-2d5e-4505-925e-5a96d403c6aa', NULL, 1, 'Metal wire crates', 'Клетки от метална мрежа'),
  ('Plastic Dog Crates', 'Пластмасови клетки', 'dog-crates-plastic', 'ed9762f3-2d5e-4505-925e-5a96d403c6aa', NULL, 2, 'Plastic travel kennels', 'Пластмасови транспортни кошари'),
  ('Soft Dog Crates', 'Меки клетки', 'dog-crates-soft', 'ed9762f3-2d5e-4505-925e-5a96d403c6aa', NULL, 3, 'Collapsible soft-sided crates', 'Сгъваеми меки клетки'),
  ('Dog Carrier Bags', 'Транспортни чанти', 'dog-crates-bags', 'ed9762f3-2d5e-4505-925e-5a96d403c6aa', NULL, 4, 'Carrier bags and totes', 'Транспортни чанти и торби'),
  ('Dog Backpack Carriers', 'Раници за носене', 'dog-crates-backpack', 'ed9762f3-2d5e-4505-925e-5a96d403c6aa', NULL, 5, 'Backpack carriers for dogs', 'Раници за носене на кучета'),
  ('Dog Car Crates', 'Клетки за кола', 'dog-crates-car', 'ed9762f3-2d5e-4505-925e-5a96d403c6aa', NULL, 6, 'Vehicle crates and car barriers', 'Клетки за кола и прегради'),
  
  -- Dog Houses L3
  ('Wooden Dog Houses', 'Дървени къщички', 'dog-houses-wood', '79ff6a9c-1886-4fbc-9dcc-2e3992887dc7', NULL, 1, 'Classic wooden dog houses', 'Класически дървени кучешки къщички'),
  ('Plastic Dog Houses', 'Пластмасови къщички', 'dog-houses-plastic', '79ff6a9c-1886-4fbc-9dcc-2e3992887dc7', NULL, 2, 'Durable plastic houses', 'Издръжливи пластмасови къщички'),
  ('Insulated Dog Houses', 'Изолирани къщички', 'dog-houses-insulated', '79ff6a9c-1886-4fbc-9dcc-2e3992887dc7', NULL, 3, 'Climate-controlled houses', 'Климатизирани къщички'),
  ('Dog Kennels', 'Кучешки кошари', 'dog-houses-kennels', '79ff6a9c-1886-4fbc-9dcc-2e3992887dc7', NULL, 4, 'Outdoor kennels and runs', 'Външни кошари и заграждения'),
  
  -- Dog Doors L3
  ('Dog Door Flaps', 'Капаци за врати', 'dog-doors-flaps', 'aae8bac2-a341-4070-9cf7-72a03965cb7f', NULL, 1, 'Pet door flaps and inserts', 'Капаци за врати и вложки'),
  ('Electronic Dog Doors', 'Електронни врати', 'dog-doors-electronic', 'aae8bac2-a341-4070-9cf7-72a03965cb7f', NULL, 2, 'Smart and chip-activated doors', 'Умни врати с чип активиране'),
  ('Dog Gates', 'Огради за кучета', 'dog-doors-gates', 'aae8bac2-a341-4070-9cf7-72a03965cb7f', NULL, 3, 'Baby gates and dog barriers', 'Прегради и бариери за кучета'),
  ('Dog Playpens', 'Заграждения за игра', 'dog-doors-playpens', 'aae8bac2-a341-4070-9cf7-72a03965cb7f', NULL, 4, 'Exercise pens and playpens', 'Заграждения за игра и упражнения'),
  
  -- Dog Waste L3
  ('Dog Poop Bags', 'Торбички за изпражнения', 'dog-waste-bags', '5564351d-0bee-4c67-8ab7-6e329d5cef1a', NULL, 1, 'Waste bags and dispensers', 'Торбички и дозатори за отпадъци'),
  ('Pooper Scoopers', 'Лопатки за събиране', 'dog-waste-scoopers', '5564351d-0bee-4c67-8ab7-6e329d5cef1a', NULL, 2, 'Scoops and waste removers', 'Лопатки и инструменти за почистване'),
  ('Dog Indoor Potty', 'Вътрешна тоалетна', 'dog-waste-indoor', '5564351d-0bee-4c67-8ab7-6e329d5cef1a', NULL, 3, 'Indoor grass and potty systems', 'Системи за вътрешна тоалетна'),
  ('Dog Diapers', 'Пелени за кучета', 'dog-waste-diapers', '5564351d-0bee-4c67-8ab7-6e329d5cef1a', NULL, 4, 'Dog diapers and belly bands', 'Пелени и коремни ленти за кучета'),
  ('Stain & Odor Removers', 'Препарати за петна и миризми', 'dog-waste-cleaners', '5564351d-0bee-4c67-8ab7-6e329d5cef1a', NULL, 5, 'Enzymatic cleaners and odor removers', 'Ензимни почистващи препарати'),
  
  -- Dog Harnesses L3
  ('No-Pull Dog Harnesses', 'Нагръдници без дърпане', 'dog-harnesses-nopull', '93624fd3-f667-4e83-af61-cf388dbbd785', NULL, 1, 'Front-clip and no-pull harnesses', 'Нагръдници с преден клипс без дърпане'),
  ('Step-In Dog Harnesses', 'Стъпващи нагръдници', 'dog-harnesses-stepin', '93624fd3-f667-4e83-af61-cf388dbbd785', NULL, 2, 'Easy step-in harnesses', 'Лесни за обличане нагръдници'),
  ('Dog Vest Harnesses', 'Нагръдници тип жилетка', 'dog-harnesses-vest', '93624fd3-f667-4e83-af61-cf388dbbd785', NULL, 3, 'Padded vest harnesses', 'Подплатени нагръдници жилетки'),
  ('Dog Leashes', 'Каишки за кучета', 'dog-harnesses-leashes', '93624fd3-f667-4e83-af61-cf388dbbd785', NULL, 4, 'Standard and retractable leashes', 'Стандартни и автоматични каишки'),
  ('Hands-Free Dog Leashes', 'Каишки без ръце', 'dog-harnesses-handsfree', '93624fd3-f667-4e83-af61-cf388dbbd785', NULL, 5, 'Waist and crossbody leashes', 'Колани и презрамени каишки'),
  ('Dog Car Safety', 'Безопасност в колата', 'dog-harnesses-car', '93624fd3-f667-4e83-af61-cf388dbbd785', NULL, 6, 'Car harnesses and seat belts', 'Нагръдници за кола и предпазни колани'),
  
  -- Dog Tech L3
  ('Dog GPS Trackers', 'GPS тракери', 'dog-tech-gps', 'e89bf68d-fdfa-4798-826d-5cb6029d058f', NULL, 1, 'GPS collars and trackers', 'GPS нашийници и тракери'),
  ('Dog Activity Monitors', 'Монитори за активност', 'dog-tech-activity', 'e89bf68d-fdfa-4798-826d-5cb6029d058f', NULL, 2, 'Fitness trackers for dogs', 'Фитнес тракери за кучета'),
  ('Dog Cameras', 'Камери за кучета', 'dog-tech-cameras', 'e89bf68d-fdfa-4798-826d-5cb6029d058f', NULL, 3, 'Pet cameras and treat dispensers', 'Камери и дозатори за лакомства'),
  ('Smart Dog Feeders', 'Умни хранилки', 'dog-tech-feeders', 'e89bf68d-fdfa-4798-826d-5cb6029d058f', NULL, 4, 'WiFi-enabled automatic feeders', 'Автоматични хранилки с WiFi')
ON CONFLICT (slug) DO NOTHING;;
