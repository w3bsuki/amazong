-- PETS PHASE 2: Expand Dogs (L1) with additional L2 categories
-- Dogs ID: 54b7646f-e81b-4eb0-b4f4-76adeed04e01

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  -- Additional Dog L2 categories (existing: dog-food, dog-treats, dog-toys, dog-beds, dog-collars, dog-grooming)
  ('Dog Clothing & Accessories', 'Облекло и аксесоари за кучета', 'dog-clothing', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', '🧥', 7, 'Dog clothing, sweaters, coats, and accessories', 'Облекло, пуловери, палта и аксесоари за кучета'),
  ('Dog Health & Wellness', 'Здраве и wellness за кучета', 'dog-health', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', '💊', 8, 'Dog supplements, vitamins, and health products', 'Добавки, витамини и здравни продукти за кучета'),
  ('Dog Training & Behavior', 'Обучение и поведение на кучета', 'dog-training', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', '🎓', 9, 'Training aids, clickers, and behavior products', 'Помощни средства за обучение и поведение'),
  ('Dog Bowls & Feeders', 'Купи и хранилки за кучета', 'dog-bowls', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', '🥣', 10, 'Dog food bowls, water fountains, and feeders', 'Купи за храна, фонтани за вода и хранилки'),
  ('Dog Crates & Carriers', 'Клетки и транспортни кутии за кучета', 'dog-crates', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', '📦', 11, 'Dog crates, kennels, carriers, and travel accessories', 'Клетки, кошари, транспортни кутии и аксесоари за пътуване'),
  ('Dog Houses & Outdoor', 'Кучешки къщи и външни продукти', 'dog-houses', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', '🏠', 12, 'Dog houses, outdoor shelters, and yard products', 'Кучешки къщи, навеси и продукти за двора'),
  ('Dog Doors & Gates', 'Врати и прегради за кучета', 'dog-doors', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', '🚪', 13, 'Dog doors, gates, pens, and containment', 'Кучешки врати, огради и прегради'),
  ('Dog Waste & Cleanup', 'Почистване и хигиена за кучета', 'dog-waste', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', '🧹', 14, 'Poop bags, waste disposal, and cleanup products', 'Торбички, изхвърляне на отпадъци и почистващи продукти'),
  ('Dog Harnesses & Leashes', 'Нагръдници и каишки за кучета', 'dog-harnesses', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', '🦮', 15, 'Dog harnesses, leashes, and walking accessories', 'Нагръдници, каишки и аксесоари за разходки'),
  ('Dog Tech & GPS', 'Технологии и GPS за кучета', 'dog-tech', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', '📡', 16, 'GPS trackers, cameras, and smart pet technology', 'GPS тракери, камери и умни технологии')
ON CONFLICT (slug) DO NOTHING;;
