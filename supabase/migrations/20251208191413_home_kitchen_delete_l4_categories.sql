
-- Delete all L4 categories under Home & Kitchen
-- These should be handled as attributes, not categories

DELETE FROM categories WHERE id IN (
  '015e2cb1-0212-480a-8f4c-30943f4c218d', -- Bread Makers
  '7695c69b-8a10-4cf9-a833-da2ea3cdd650', -- Canopy Beds
  'b7086baf-ff95-424a-a812-82a25d5a019e', -- Canvas Prints
  'c94ea6b8-07fd-45e9-ba61-90c18567dba8', -- Coffee Beans
  '399b9f4f-0b2f-4f93-8cad-a17b653b3791', -- Coffee Grinders
  'a03d7406-cffa-4c68-9a42-ade6ad7702a6', -- Cold Brew Makers
  'f1796c6d-7d36-44fa-83b7-2b5664bbbd54', -- Daybeds (duplicate - already exists as L3)
  '6ba3a873-53c4-451b-b8de-afaa4a575995', -- Electric Grills
  '3a057c29-03eb-4ff0-9151-23d9572c0664', -- Espresso Machines (duplicate)
  '152bd494-a178-4aaa-9793-be03a70c6374', -- Food Dehydrators
  'fd1b602d-3a75-4079-82cb-58c9c0882546', -- Framed Art (duplicate)
  '7c714b00-efa7-40dc-b91f-45d660286e3b', -- French Press
  'd6959f30-6fb4-4172-a220-42704bf7c2fc', -- French Presses (duplicate)
  'a8bbefbe-7a21-4229-ada5-479d73631d7c', -- Ground Coffee
  '6139e439-e158-45a2-8464-d15b4ee79a6b', -- Ice Cream Makers
  '0a09ac31-7eb5-4bf9-9cb5-707aad1168b5', -- Loose Leaf Tea
  '09cfcd66-ee4f-44e8-b12a-3c105f538046', -- Meat Grinders
  '8bc40599-7dbe-4ac4-8c18-26cc88998ce6', -- Metal Wall Art (duplicate)
  '5d3c5432-918c-40cb-bcfc-23b3dcb378c9', -- Photo Frames
  '3f517c07-b538-4620-9fbb-a045647c1252', -- Platform Beds (duplicate)
  'a1aeedce-2686-483d-a5ae-e7ec79300c2b', -- Posters
  '6448171d-911c-4689-8f87-05d2084570b1', -- Pour Over Coffee
  '790592db-dd62-4328-88f8-166b07350983', -- Pressure Cookers
  '07bba6d8-2cbe-40ca-abbe-d38deedf1500', -- Rice Cookers (duplicate)
  'fc077af9-37fa-4a14-9d9c-5fb1d8e2e6ef', -- Storage Beds (duplicate)
  '88379bae-3f09-43a7-9de5-5a13c6608cd4', -- Tea Bags
  'f042694d-731d-405e-a787-2db8fb0a373f', -- Tea Infusers
  '3c7fa5a3-6caf-4cd9-bc37-2c7c836ab49e', -- Tea Kettles
  '19c59072-6e91-4610-af14-4849b308be56', -- Waffle Makers
  'e66b8d2a-9d41-433a-92dc-121e38f9f7fa'  -- Wall Stickers
);
;
