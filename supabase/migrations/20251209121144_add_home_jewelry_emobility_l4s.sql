-- Add L4s for Home & Kitchen, Jewelry, E-Mobility

-- Air Fryers L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Basket Air Fryers', 'airfryer-basket', 'da59e6ff-1c70-45ec-a8a5-25c5e42b0b42', 'Traditional basket style air fryers'),
('Oven Air Fryers', 'airfryer-oven', 'da59e6ff-1c70-45ec-a8a5-25c5e42b0b42', 'Toaster oven style air fryers'),
('Dual Basket Air Fryers', 'airfryer-dual', 'da59e6ff-1c70-45ec-a8a5-25c5e42b0b42', 'Dual zone air fryers'),
('Compact Air Fryers', 'airfryer-compact', 'da59e6ff-1c70-45ec-a8a5-25c5e42b0b42', 'Small/personal size air fryers'),
('Large Capacity Air Fryers', 'airfryer-large', 'da59e6ff-1c70-45ec-a8a5-25c5e42b0b42', 'Family size 6+ quart air fryers')
ON CONFLICT DO NOTHING;

-- Coffee Makers L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Drip Coffee Makers', 'coffee-drip', 'b016b72a-c9c3-4498-98f6-dbc65a39e84d', 'Standard drip coffee makers'),
('Espresso Machines', 'coffee-espresso', 'b016b72a-c9c3-4498-98f6-dbc65a39e84d', 'Espresso and cappuccino machines'),
('Pod/Capsule Coffee Makers', 'coffee-pod', 'b016b72a-c9c3-4498-98f6-dbc65a39e84d', 'Nespresso, Keurig style'),
('French Press', 'coffee-frenchpress', 'b016b72a-c9c3-4498-98f6-dbc65a39e84d', 'French press coffee makers'),
('Pour Over', 'coffee-pourover', 'b016b72a-c9c3-4498-98f6-dbc65a39e84d', 'Pour over and manual brewers'),
('Cold Brew Makers', 'coffee-coldbrew', 'b016b72a-c9c3-4498-98f6-dbc65a39e84d', 'Cold brew coffee makers')
ON CONFLICT DO NOTHING;

-- Blenders L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Countertop Blenders', 'blender-countertop', '50860d2e-ddd4-4c0f-a6fc-a09b0263d7b8', 'Full-size countertop blenders'),
('Personal Blenders', 'blender-personal', '50860d2e-ddd4-4c0f-a6fc-a09b0263d7b8', 'Single-serve personal blenders'),
('Immersion Blenders', 'blender-immersion', '50860d2e-ddd4-4c0f-a6fc-a09b0263d7b8', 'Hand/stick blenders'),
('High-Performance Blenders', 'blender-highperf', '50860d2e-ddd4-4c0f-a6fc-a09b0263d7b8', 'Vitamix, Blendtec style'),
('Portable Blenders', 'blender-portable', '50860d2e-ddd4-4c0f-a6fc-a09b0263d7b8', 'USB rechargeable portable blenders')
ON CONFLICT DO NOTHING;

-- Area Rugs L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Traditional Rugs', 'rugs-traditional', '9db769c0-9577-4519-aaa9-1bf1efbeaa56', 'Classic and traditional patterns'),
('Modern Rugs', 'rugs-modern', '9db769c0-9577-4519-aaa9-1bf1efbeaa56', 'Contemporary modern designs'),
('Shag Rugs', 'rugs-shag', '9db769c0-9577-4519-aaa9-1bf1efbeaa56', 'Plush shag rugs'),
('Oriental Rugs', 'rugs-oriental', '9db769c0-9577-4519-aaa9-1bf1efbeaa56', 'Persian and oriental style'),
('Outdoor Rugs', 'rugs-outdoor', '9db769c0-9577-4519-aaa9-1bf1efbeaa56', 'Weather-resistant outdoor rugs'),
('Runner Rugs', 'rugs-runner', '9db769c0-9577-4519-aaa9-1bf1efbeaa56', 'Hallway and runner rugs')
ON CONFLICT DO NOTHING;

-- Sectional Sofas L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('L-Shaped Sectionals', 'sectional-lshape', '8217bf3d-e9cf-4927-8c3c-0af6bd2065ee', 'L-shaped corner sectionals'),
('U-Shaped Sectionals', 'sectional-ushape', '8217bf3d-e9cf-4927-8c3c-0af6bd2065ee', 'Large U-shaped sectionals'),
('Modular Sectionals', 'sectional-modular', '8217bf3d-e9cf-4927-8c3c-0af6bd2065ee', 'Customizable modular pieces'),
('Reclining Sectionals', 'sectional-reclining', '8217bf3d-e9cf-4927-8c3c-0af6bd2065ee', 'Sectionals with recliners'),
('Sleeper Sectionals', 'sectional-sleeper', '8217bf3d-e9cf-4927-8c3c-0af6bd2065ee', 'Sectionals with pull-out beds')
ON CONFLICT DO NOTHING;

-- Diamond Rings L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Solitaire Rings', 'diamonds-solitaire', 'cf651436-33a2-4bdc-8c3b-e8ec238e0942', 'Single stone solitaire rings'),
('Halo Rings', 'diamonds-halo', 'cf651436-33a2-4bdc-8c3b-e8ec238e0942', 'Halo setting diamond rings'),
('Three Stone Rings', 'diamonds-threestone', 'cf651436-33a2-4bdc-8c3b-e8ec238e0942', 'Past, present, future rings'),
('Eternity Bands', 'diamonds-eternity', 'cf651436-33a2-4bdc-8c3b-e8ec238e0942', 'Full eternity diamond bands'),
('Cluster Rings', 'diamonds-cluster', 'cf651436-33a2-4bdc-8c3b-e8ec238e0942', 'Multi-stone cluster rings')
ON CONFLICT DO NOTHING;

-- City E-Bikes L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Commuter E-Bikes', 'ebike-city-commuter', '3ea6eebb-7c5f-44b4-b625-3ecdcea6d009', 'Daily commuter e-bikes'),
('Step-Through E-Bikes', 'ebike-city-stepthrough', '3ea6eebb-7c5f-44b4-b625-3ecdcea6d009', 'Easy mount step-through frames'),
('Folding City E-Bikes', 'ebike-city-folding', '3ea6eebb-7c5f-44b4-b625-3ecdcea6d009', 'Compact folding e-bikes'),
('Cargo E-Bikes', 'ebike-city-cargo', '3ea6eebb-7c5f-44b4-b625-3ecdcea6d009', 'Cargo carrying e-bikes'),
('Cruiser E-Bikes', 'ebike-city-cruiser', '3ea6eebb-7c5f-44b4-b625-3ecdcea6d009', 'Beach cruiser style e-bikes')
ON CONFLICT DO NOTHING;

-- Mountain E-Bikes L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Hardtail E-MTB', 'ebike-mtb-hardtail', 'ad7c9d8f-ccd3-4bde-9b48-d6f85ce95ea5', 'Front suspension only'),
('Full Suspension E-MTB', 'ebike-mtb-fullsus', 'ad7c9d8f-ccd3-4bde-9b48-d6f85ce95ea5', 'Full suspension e-MTBs'),
('Trail E-Bikes', 'ebike-mtb-trail', 'ad7c9d8f-ccd3-4bde-9b48-d6f85ce95ea5', 'All-around trail riding'),
('Enduro E-Bikes', 'ebike-mtb-enduro', 'ad7c9d8f-ccd3-4bde-9b48-d6f85ce95ea5', 'Aggressive downhill capable'),
('Cross Country E-Bikes', 'ebike-mtb-xc', 'ad7c9d8f-ccd3-4bde-9b48-d6f85ce95ea5', 'Lightweight XC e-bikes')
ON CONFLICT DO NOTHING;;
