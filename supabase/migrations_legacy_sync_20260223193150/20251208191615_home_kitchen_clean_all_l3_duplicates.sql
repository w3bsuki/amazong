
-- Clean ALL remaining L3 duplicates across Home & Kitchen

-- Kitchen & Dining duplicates (keep cleaner slug)
DELETE FROM categories WHERE id IN (
  '726075d2-42c5-4a8f-8c9f-36896797b0da', -- Air Fryers - appliances-air-fryers (keep air-fryers)
  '3afa8fe7-d4cf-4bd0-81e6-73920cfbca5a', -- Area Rugs - decor-area-rugs (keep area-rugs)
  '25a26ac0-b732-4dba-a53a-1150f45dfc0a', -- Baking Sheets - kitchen-baking-sheets (keep baking-sheets)
  '82a36cd4-8207-4e23-bb46-576ae03d58b7', -- Cutting Boards - kitchen-cutting-boards (keep cutting-boards)
  '9744cd01-dc97-48b7-8822-d5bb5f7408ca', -- Dutch Ovens - kitchen-dutch-ovens (keep cookware-dutch-ovens)
  '80b2e6b0-4c2c-463e-a95f-b3aa3bd0bfd0', -- Electric Kettles - appliances-kettles (keep electric-kettles)
  '840178e9-c70c-4819-aea2-6b241770b829', -- Food Processors - appliances-processors (keep appliances-food-processors)
  'bed182d9-7f89-4680-be0a-2674ad5d754b', -- Framed Art - decor-framed-art (keep framed-art)
  'dbe42264-77ad-4e58-883c-dd416773d7ea', -- Juicers - appliances-juicers (keep juicers)
  '11875c2b-fbaa-4acb-a2a9-66a90a875598', -- Microwaves - appliances-microwaves (keep microwaves under Kitchen Appliances)
  '72e7a71c-baec-4594-a2b6-dc9a9d374ec5', -- Saucepans - cookware-saucepans (keep saucepans)
  '91e9c437-9a16-4e13-ad9b-d6c0700b3aed', -- Slow Cookers - appliances-slow-cookers (keep slow-cookers)
  'b6d209ad-aef5-4fe2-bec2-880ee041cfc7'  -- Woks - cookware-woks (keep woks)
);

-- Office & School duplicates (keep school-specific when in School Supplies, generic in Office)
DELETE FROM categories WHERE id IN (
  'fa06f446-f97a-4eb1-80e5-157a0bdfed0d', -- Calculators - calculators (keep school-calculators)
  '8d97de05-838a-4bb3-9921-07d9a5a7ba07', -- Filing Cabinets - office-furn-filing (keep filing-cabinets)
  '1433afe4-2932-4bc1-b989-84e65c60a0c9', -- Notebooks - notebooks (keep school-notebooks)
  '7844b12b-48fc-4168-90c0-d57a4730c2e8', -- Pencil Cases - pencil-cases (keep school-pencil-cases)
  '34d08771-6e17-47ea-9987-08a901bc24c5', -- Pencils - school-pencils (keep pencils under Office)
  '490e08e0-b186-4eae-ba9f-8340cdb6c3cd', -- Pens - school-pens (keep pens under Office)
  '6dd4c598-c603-4609-ba61-30d4f3413af1', -- Scissors - school-scissors (keep scissors under Office)
  '712a8d5e-6b56-4548-9f05-c200a51a01f4'  -- Standing Desks - office-desks-standing (keep standing-desks)
);

-- Furniture duplicates
DELETE FROM categories WHERE id IN (
  '54d3efe9-e2a7-4ca2-90ba-52e6f4de5fe0', -- Bookcases - office-bookcases (keep bookcases under Living Room)
  'd98b81da-3bea-45da-bc87-f27bcc7b5f48'  -- Office Chairs - chairs-office (keep office-chairs under Office Furniture)
);

-- Lighting duplicates (keep simpler slug)
DELETE FROM categories WHERE id IN (
  'e4431691-03cf-4020-8d85-857dc117c8f8', -- Pendant Lights - lighting-pendants (keep pendant-lights)
  '1a50d271-7aeb-453e-9ec7-64d5b3414a55', -- Recessed Lighting - lighting-recessed (keep recessed-lighting)
  'bf5143fc-59d9-4aa2-8ddd-65a889fa4b36'  -- Track Lighting - lighting-track (keep track-lighting)
);

-- Garden & Outdoor duplicates
DELETE FROM categories WHERE id IN (
  'd73b6703-379e-4568-9c6e-52f7bcf46cc4', -- Lawn Mowers - garden-mowers (keep lawn-mowers under Lawn Care)
  '23b4bae7-8db1-4505-8933-17f4769e6365', -- Outdoor Plants - plants-outdoor (keep outdoor-plants)
  'a7594021-0abd-46b7-a64a-fa3cf53d72c0', -- Smokers - grills-smokers (keep smokers)
  'dc9b42a8-8e21-42eb-b5f0-b1d32362b4e2'  -- Wheelbarrows - garden-wheelbarrows (keep wheelbarrows)
);
;
