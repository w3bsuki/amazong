-- =====================================================
-- L2 Categories for Metalworking Tools (da1a5ed8-3399-4a84-8b40-82297696453c)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, description, description_bg, display_order)
VALUES
  (gen_random_uuid(), 'Metal Lathes', 'Метални стругове', 'metalworking-lathes', 'da1a5ed8-3399-4a84-8b40-82297696453c', '🔄', 'Mini, bench, and industrial lathes', 'Мини, настолни и индустриални стругове', 1),
  (gen_random_uuid(), 'Milling Machines', 'Фрезови машини', 'metalworking-milling', 'da1a5ed8-3399-4a84-8b40-82297696453c', '⚙️', 'Vertical and horizontal milling machines', 'Вертикални и хоризонтални фрези', 2),
  (gen_random_uuid(), 'Metal Band Saws', 'Банцизи за метал', 'metalworking-band-saws', 'da1a5ed8-3399-4a84-8b40-82297696453c', '🪚', 'Horizontal and vertical metal band saws', 'Хоризонтални и вертикални банцизи', 3),
  (gen_random_uuid(), 'Sheet Metal Tools', 'Инструменти за ламарина', 'metalworking-sheet', 'da1a5ed8-3399-4a84-8b40-82297696453c', '📄', 'Shears, brakes, rollers for sheet metal', 'Ножици, огъващи, валяци за ламарина', 4),
  (gen_random_uuid(), 'Metal Presses', 'Преси за метал', 'metalworking-presses', 'da1a5ed8-3399-4a84-8b40-82297696453c', '💪', 'Hydraulic and arbor presses', 'Хидравлични и дорникови преси', 5),
  (gen_random_uuid(), 'Metal Benders', 'Огъвачи за метал', 'metalworking-benders', 'da1a5ed8-3399-4a84-8b40-82297696453c', '🔧', 'Tube, pipe, and bar benders', 'Огъвачи за тръби, пръти', 6),
  (gen_random_uuid(), 'Threading Tools', 'Инструменти за резба', 'metalworking-threading', 'da1a5ed8-3399-4a84-8b40-82297696453c', '🔩', 'Taps, dies, threading machines', 'Метчици, плашки, резбонарезни машини', 7),
  (gen_random_uuid(), 'Grinding & Deburring', 'Шлифоване и почистване', 'metalworking-grinding', 'da1a5ed8-3399-4a84-8b40-82297696453c', '✨', 'Bench grinders, deburring tools', 'Настолни шлайфи, инструменти за грат', 8),
  (gen_random_uuid(), 'Cutting Tools', 'Режещи инструменти', 'metalworking-cutting', 'da1a5ed8-3399-4a84-8b40-82297696453c', '✂️', 'Reamers, end mills, cutting tools', 'Райбери, фрези, режещи инструменти', 9),
  (gen_random_uuid(), 'Metalworking Fluids', 'Течности за обработка', 'metalworking-fluids', 'da1a5ed8-3399-4a84-8b40-82297696453c', '🛢️', 'Cutting oils, coolants, lubricants', 'Масла за рязане, охладители', 10),
  (gen_random_uuid(), 'Metalworking Accessories', 'Металообработващи аксесоари', 'metalworking-accessories', 'da1a5ed8-3399-4a84-8b40-82297696453c', '🧰', 'Tool holders, chucks, accessories', 'Държачи, патронници, аксесоари', 11)
ON CONFLICT (slug) DO NOTHING;;
