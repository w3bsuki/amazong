-- Phase 4: PETS Category Attributes (Part 4) - Final Set
DO $$
DECLARE
    pets_id UUID;
BEGIN
    SELECT id INTO pets_id FROM categories WHERE slug = 'pets';
    
    -- Flavor (for food/treats)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Flavor', 'Вкус', 'select',
            '["Chicken", "Beef", "Fish/Salmon", "Lamb", "Turkey", "Duck", "Bacon", "Peanut Butter", "Cheese", "Liver", "Mixed/Multi-Flavor"]',
            '["Пилешко", "Говеждо", "Риба/Сьомга", "Агнешко", "Пуешко", "Патешко", "Бекон", "Фъстъчено масло", "Сирене", "Черен дроб", "Смесен/Мулти-вкус"]',
            false, true, 31)
    ON CONFLICT DO NOTHING;
    
    -- Carrier Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Carrier Type', 'Тип транспортна чанта', 'select',
            '["Hard-Sided", "Soft-Sided", "Backpack", "Rolling", "Sling", "Airline Approved", "Expandable"]',
            '["Твърда", "Мека", "Раница", "На колелца", "Слинг", "Одобрена за самолет", "Разширяваща се"]',
            false, true, 32)
    ON CONFLICT DO NOTHING;
    
    -- Door Type (for pet doors)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Door Installation', 'Монтаж на врата', 'select',
            '["Wall Mount", "Door Mount", "Sliding Glass", "Screen Door", "Window Mount"]',
            '["Стенен монтаж", "Монтаж на врата", "Плъзгащо стъкло", "Мрежеста врата", "Прозоречен монтаж"]',
            false, true, 33)
    ON CONFLICT DO NOTHING;
    
    -- Heating/Cooling Features
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Temperature Feature', 'Температурна функция', 'select',
            '["Self-Warming", "Heated", "Cooling Gel", "Temperature Regulated", "Thermal"]',
            '["Самозатоплящ се", "С отопление", "Охлаждащ гел", "Температурно регулиран", "Термичен"]',
            false, true, 34)
    ON CONFLICT DO NOTHING;
    
    -- Bowl/Feeder Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Bowl Type', 'Тип купичка', 'select',
            '["Standard", "Elevated", "Slow Feeder", "Automatic", "Gravity", "Travel", "Fountain", "Anti-Spill"]',
            '["Стандартна", "Повдигната", "Бавно хранене", "Автоматична", "Гравитационна", "За пътуване", "Фонтан", "Против разливане"]',
            false, true, 35)
    ON CONFLICT DO NOTHING;
    
    -- Harness Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Harness Type', 'Тип нагръдник', 'select',
            '["Standard/Step-In", "No-Pull", "Vest", "Tactical/Service", "Car Safety", "Lifting/Support", "Head Halter"]',
            '["Стандартен/За стъпване", "Против дърпане", "Жилетка", "Тактически/Служебен", "Автомобилна безопасност", "Повдигащ/Поддържащ", "Наглавник"]',
            false, true, 36)
    ON CONFLICT DO NOTHING;
    
    -- Subscription Duration (for subscription products)
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Subscription Period', 'Абонаментен период', 'select',
            '["Monthly", "Every 2 Months", "Quarterly", "Every 6 Months", "Annually", "One-Time Purchase"]',
            '["Месечен", "На всеки 2 месеца", "Тримесечен", "На всеки 6 месеца", "Годишен", "Еднократна покупка"]',
            false, true, 37)
    ON CONFLICT DO NOTHING;
    
    -- Country of Origin
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Country of Origin', 'Страна на произход', 'select',
            '["USA", "Canada", "UK", "Germany", "France", "Italy", "Australia", "New Zealand", "Japan", "China", "Other"]',
            '["САЩ", "Канада", "Великобритания", "Германия", "Франция", "Италия", "Австралия", "Нова Зеландия", "Япония", "Китай", "Друга"]',
            false, true, 38)
    ON CONFLICT DO NOTHING;
    
    -- Certification
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Certification', 'Сертификация', 'multiselect',
            '["USDA Organic", "Non-GMO", "Grain-Free Certified", "Human-Grade", "AAFCO Approved", "Veterinarian Recommended", "Cruelty-Free", "Eco-Friendly"]',
            '["USDA органичен", "Без ГМО", "Сертифицирано без зърнени", "Човешко качество", "AAFCO одобрен", "Препоръчано от ветеринар", "Без жестокост", "Екологичен"]',
            false, true, 39)
    ON CONFLICT DO NOTHING;
    
    -- Feeding Frequency
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Feeding Frequency', 'Честота на хранене', 'select',
            '["Once Daily", "Twice Daily", "Multiple Times Daily", "Free Feeding", "As Treat/Supplement"]',
            '["Веднъж дневно", "Два пъти дневно", "Многократно дневно", "Свободно хранене", "Като лакомство/добавка"]',
            false, true, 40)
    ON CONFLICT DO NOTHING;
    
    -- Dog Breed Specific
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Dog Breed', 'Порода куче', 'select',
            '["All Breeds", "Labrador", "German Shepherd", "Golden Retriever", "Bulldog", "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "Dachshund", "Boxer", "Chihuahua", "Husky", "Great Dane", "French Bulldog", "Other"]',
            '["Всички породи", "Лабрадор", "Немска овчарка", "Голдън ретрийвър", "Булдог", "Пудел", "Бигъл", "Ротвайлер", "Йоркширски териер", "Дакел", "Боксер", "Чихуахуа", "Хъски", "Немски дог", "Френски булдог", "Друга"]',
            false, true, 41)
    ON CONFLICT DO NOTHING;
    
    -- Cat Breed Specific
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Cat Breed', 'Порода котка', 'select',
            '["All Breeds", "Persian", "Maine Coon", "Siamese", "Ragdoll", "Bengal", "British Shorthair", "Abyssinian", "Scottish Fold", "Sphynx", "Russian Blue", "Birman", "Oriental", "Norwegian Forest", "Other"]',
            '["Всички породи", "Персийска", "Мейн кун", "Сиамска", "Рагдол", "Бенгалска", "Британска късокосместа", "Абисинска", "Шотландска клепоуха", "Сфинкс", "Руска синя", "Бирма", "Ориенталска", "Норвежка горска", "Друга"]',
            false, true, 42)
    ON CONFLICT DO NOTHING;
    
    -- Bird Species
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Bird Species', 'Вид птица', 'select',
            '["All Birds", "Parakeet/Budgie", "Cockatiel", "Canary", "Finch", "Lovebird", "Conure", "African Grey", "Macaw", "Cockatoo", "Amazon", "Parrotlet", "Other"]',
            '["Всички птици", "Папагалче/Вълнист", "Корела", "Канарче", "Чинка", "Неразделка", "Конюр", "Жако", "Ара", "Какаду", "Амазонка", "Малък папагал", "Друга"]',
            false, true, 43)
    ON CONFLICT DO NOTHING;
    
    -- Fish Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Fish Type', 'Тип риба', 'select',
            '["All Fish", "Betta", "Goldfish", "Tropical", "Cichlid", "Tetra", "Guppy", "Angelfish", "Discus", "Koi", "Saltwater/Marine", "Coral/Reef"]',
            '["Всички риби", "Бета", "Златна рибка", "Тропическа", "Цихлида", "Тетра", "Гупи", "Скалария", "Дискус", "Кои", "Солена вода/Морска", "Корал/Риф"]',
            false, true, 44)
    ON CONFLICT DO NOTHING;
    
    -- Small Animal Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Small Animal Type', 'Тип малко животно', 'select',
            '["All Small Animals", "Rabbit", "Guinea Pig", "Hamster", "Gerbil", "Chinchilla", "Ferret", "Rat", "Mouse", "Hedgehog", "Sugar Glider"]',
            '["Всички малки животни", "Заек", "Морско свинче", "Хамстер", "Джербил", "Чинчила", "Пор", "Плъх", "Мишка", "Таралеж", "Захарен плъх"]',
            false, true, 45)
    ON CONFLICT DO NOTHING;
    
    -- Reptile Type
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
    VALUES (pets_id, 'Reptile Type', 'Тип влечуго', 'select',
            '["All Reptiles", "Bearded Dragon", "Leopard Gecko", "Ball Python", "Corn Snake", "Crested Gecko", "Blue-Tongued Skink", "Turtle", "Tortoise", "Iguana", "Chameleon"]',
            '["Всички влечуги", "Брадат дракон", "Леопардов гекон", "Кралски питон", "Царевична змия", "Качулат гекон", "Синезезичен скинк", "Водна костенурка", "Сухоземна костенурка", "Игуана", "Хамелеон"]',
            false, true, 46)
    ON CONFLICT DO NOTHING;
END $$;;
