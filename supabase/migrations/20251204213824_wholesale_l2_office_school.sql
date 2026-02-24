
-- L2 Categories for: Wholesale Office & School (e3ab88d1-4f8f-4ea7-8165-09bbaf537a97)
-- Update existing and add new

UPDATE categories SET name = 'Office Equipment', name_bg = 'Офис оборудване', display_order = 3
WHERE id = '2689f20c-5631-44be-b3bb-5c0100b9c342';

UPDATE categories SET name = 'Industrial Supplies', name_bg = 'Индустриални консумативи', slug = 'wholesale-office-industrial-supplies', display_order = 8
WHERE id = '5723206c-66d4-401d-8fbf-277dec36dc70';

INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Writing & Drawing Supplies', 'Пишещи и чертожни принадлежности', 'wholesale-writing-supplies', 'e3ab88d1-4f8f-4ea7-8165-09bbaf537a97', 1),
('Paper & Notebooks', 'Хартия и тетрадки', 'wholesale-paper-notebooks', 'e3ab88d1-4f8f-4ea7-8165-09bbaf537a97', 2),
('Filing & Organization', 'Папки и организация', 'wholesale-filing-organization', 'e3ab88d1-4f8f-4ea7-8165-09bbaf537a97', 4),
('School Supplies', 'Училищни консумативи', 'wholesale-school-supplies', 'e3ab88d1-4f8f-4ea7-8165-09bbaf537a97', 5),
('Art Supplies', 'Художествени материали', 'wholesale-art-supplies', 'e3ab88d1-4f8f-4ea7-8165-09bbaf537a97', 6),
('Desk Accessories', 'Офис аксесоари', 'wholesale-desk-accessories', 'e3ab88d1-4f8f-4ea7-8165-09bbaf537a97', 7);
;
