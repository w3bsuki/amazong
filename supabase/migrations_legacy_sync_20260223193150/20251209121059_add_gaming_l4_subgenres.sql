-- Add L4 subgenres for Gaming categories

-- PS5 Action Games L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Open World Action', 'ps5-action-openworld', '9f63fb9e-56ce-41f9-8419-62528a418029', 'Open world action games for PS5'),
('Hack & Slash', 'ps5-action-hackslash', '9f63fb9e-56ce-41f9-8419-62528a418029', 'Hack and slash action games'),
('Stealth Action', 'ps5-action-stealth', '9f63fb9e-56ce-41f9-8419-62528a418029', 'Stealth action games'),
('Beat em Up', 'ps5-action-beatup', '9f63fb9e-56ce-41f9-8419-62528a418029', 'Beat em up games'),
('Character Action', 'ps5-action-character', '9f63fb9e-56ce-41f9-8419-62528a418029', 'Character action games like DMC, Bayonetta')
ON CONFLICT DO NOTHING;

-- PS5 RPG Games L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('JRPGs', 'ps5-rpg-jrpg', '99d90324-834c-4fd1-ba75-4769af796e03', 'Japanese RPGs'),
('Western RPGs', 'ps5-rpg-western', '99d90324-834c-4fd1-ba75-4769af796e03', 'Western-style RPGs'),
('Action RPGs', 'ps5-rpg-action', '99d90324-834c-4fd1-ba75-4769af796e03', 'Action-oriented RPGs'),
('Turn-Based RPGs', 'ps5-rpg-turnbased', '99d90324-834c-4fd1-ba75-4769af796e03', 'Turn-based combat RPGs'),
('Tactical RPGs', 'ps5-rpg-tactical', '99d90324-834c-4fd1-ba75-4769af796e03', 'Tactical/strategy RPGs')
ON CONFLICT DO NOTHING;

-- PS5 Sports Games L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Football Games', 'ps5-sports-football', '4bde1249-fb3e-49af-939d-eca1df6332aa', 'FIFA, Madden, etc'),
('Basketball Games', 'ps5-sports-basketball', '4bde1249-fb3e-49af-939d-eca1df6332aa', 'NBA 2K, etc'),
('Racing Games', 'ps5-sports-racing', '4bde1249-fb3e-49af-939d-eca1df6332aa', 'Racing and driving games'),
('Combat Sports', 'ps5-sports-combat', '4bde1249-fb3e-49af-939d-eca1df6332aa', 'UFC, WWE, Boxing games'),
('Extreme Sports', 'ps5-sports-extreme', '4bde1249-fb3e-49af-939d-eca1df6332aa', 'Skateboarding, snowboarding, etc')
ON CONFLICT DO NOTHING;

-- PS5 Horror Games L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Survival Horror', 'ps5-horror-survival', '7ce90cec-0faa-433e-ab3b-392aeea35db4', 'Resident Evil style survival horror'),
('Psychological Horror', 'ps5-horror-psychological', '7ce90cec-0faa-433e-ab3b-392aeea35db4', 'Mind-bending horror'),
('Action Horror', 'ps5-horror-action', '7ce90cec-0faa-433e-ab3b-392aeea35db4', 'Action-focused horror games'),
('Indie Horror', 'ps5-horror-indie', '7ce90cec-0faa-433e-ab3b-392aeea35db4', 'Independent horror titles')
ON CONFLICT DO NOTHING;

-- Xbox Action Games L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Open World Action', 'xbox-action-openworld', '70d095cd-2b7e-4b73-9b67-f43c31ecb5f2', 'Open world action games'),
('Hack & Slash', 'xbox-action-hackslash', '70d095cd-2b7e-4b73-9b67-f43c31ecb5f2', 'Hack and slash games'),
('Stealth Action', 'xbox-action-stealth', '70d095cd-2b7e-4b73-9b67-f43c31ecb5f2', 'Stealth action games'),
('Third Person Shooters', 'xbox-action-tps', '70d095cd-2b7e-4b73-9b67-f43c31ecb5f2', 'Third person shooter games')
ON CONFLICT DO NOTHING;

-- Xbox RPG Games L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('JRPGs', 'xbox-rpg-jrpg', '9a5510d5-45b5-441c-ba9a-7a867712d35e', 'Japanese RPGs'),
('Western RPGs', 'xbox-rpg-western', '9a5510d5-45b5-441c-ba9a-7a867712d35e', 'Western-style RPGs'),
('Action RPGs', 'xbox-rpg-action', '9a5510d5-45b5-441c-ba9a-7a867712d35e', 'Action RPGs'),
('MMORPGs', 'xbox-rpg-mmorpg', '9a5510d5-45b5-441c-ba9a-7a867712d35e', 'Online multiplayer RPGs')
ON CONFLICT DO NOTHING;

-- Xbox Sports L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Football Games', 'xbox-sports-football', '4fed2ae7-bc42-49dd-839d-f9faa6e587ba', 'FIFA, Madden'),
('Basketball Games', 'xbox-sports-basketball', '4fed2ae7-bc42-49dd-839d-f9faa6e587ba', 'NBA 2K'),
('Racing Games', 'xbox-sports-racing', '4fed2ae7-bc42-49dd-839d-f9faa6e587ba', 'Forza, racing games'),
('Combat Sports', 'xbox-sports-combat', '4fed2ae7-bc42-49dd-839d-f9faa6e587ba', 'UFC, WWE')
ON CONFLICT DO NOTHING;

-- Switch Action Games L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Action Adventure', 'switch-action-adventure', 'd9f8dde2-9983-4cac-a499-28bb558f79b1', 'Zelda-style action adventure'),
('Hack & Slash', 'switch-action-hackslash', 'd9f8dde2-9983-4cac-a499-28bb558f79b1', 'Hack and slash games'),
('Beat em Up', 'switch-action-beatup', 'd9f8dde2-9983-4cac-a499-28bb558f79b1', 'Beat em up games'),
('Musou/Warriors', 'switch-action-musou', 'd9f8dde2-9983-4cac-a499-28bb558f79b1', 'Dynasty Warriors style games')
ON CONFLICT DO NOTHING;

-- Switch RPG L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('JRPGs', 'switch-rpg-jrpg', 'd603f464-7240-4ec5-9102-a6773bcc694e', 'Japanese RPGs'),
('Pokemon Games', 'switch-rpg-pokemon', 'd603f464-7240-4ec5-9102-a6773bcc694e', 'Pokemon series'),
('Action RPGs', 'switch-rpg-action', 'd603f464-7240-4ec5-9102-a6773bcc694e', 'Action RPGs'),
('Tactical RPGs', 'switch-rpg-tactical', 'd603f464-7240-4ec5-9102-a6773bcc694e', 'Fire Emblem style tactical RPGs'),
('Monster Collecting', 'switch-rpg-monstercollect', 'd603f464-7240-4ec5-9102-a6773bcc694e', 'Monster collecting games')
ON CONFLICT DO NOTHING;

-- Switch Platformers L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('2D Platformers', 'switch-platform-2d', 'f7f41afa-687f-49be-81cc-a0afea9d3518', '2D platforming games'),
('3D Platformers', 'switch-platform-3d', 'f7f41afa-687f-49be-81cc-a0afea9d3518', '3D platforming games'),
('Metroidvania', 'switch-platform-metroidvania', 'f7f41afa-687f-49be-81cc-a0afea9d3518', 'Metroidvania style games'),
('Precision Platformers', 'switch-platform-precision', 'f7f41afa-687f-49be-81cc-a0afea9d3518', 'Celeste-style precision platformers'),
('Run & Gun', 'switch-platform-rungun', 'f7f41afa-687f-49be-81cc-a0afea9d3518', 'Cuphead-style run and gun')
ON CONFLICT DO NOTHING;

-- PC Action L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Open World', 'pc-action-openworld', '571daef2-1898-454a-829c-946f4374b200', 'Open world action'),
('Hack & Slash', 'pc-action-hackslash', '571daef2-1898-454a-829c-946f4374b200', 'Hack and slash'),
('Stealth', 'pc-action-stealth', '571daef2-1898-454a-829c-946f4374b200', 'Stealth games'),
('Souls-like', 'pc-action-soulslike', '571daef2-1898-454a-829c-946f4374b200', 'Dark Souls style games'),
('Character Action', 'pc-action-character', '571daef2-1898-454a-829c-946f4374b200', 'Stylish action games')
ON CONFLICT DO NOTHING;

-- PC RPG L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('CRPGs', 'pc-rpg-crpg', '54b93b87-79e8-4d00-a515-618877be056b', 'Classic computer RPGs'),
('Action RPGs', 'pc-rpg-action', '54b93b87-79e8-4d00-a515-618877be056b', 'Action RPGs'),
('JRPGs', 'pc-rpg-jrpg', '54b93b87-79e8-4d00-a515-618877be056b', 'Japanese RPGs on PC'),
('Immersive Sims', 'pc-rpg-immersivesim', '54b93b87-79e8-4d00-a515-618877be056b', 'Deus Ex style immersive sims'),
('Roguelike RPGs', 'pc-rpg-roguelike', '54b93b87-79e8-4d00-a515-618877be056b', 'Roguelike/roguelite RPGs')
ON CONFLICT DO NOTHING;

-- PC FPS L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Arena Shooters', 'pc-fps-arena', '6225f97b-d463-40b8-9de2-e64feb56ed11', 'Quake-style arena FPS'),
('Tactical Shooters', 'pc-fps-tactical', '6225f97b-d463-40b8-9de2-e64feb56ed11', 'CS, Valorant, R6'),
('Looter Shooters', 'pc-fps-looter', '6225f97b-d463-40b8-9de2-e64feb56ed11', 'Destiny, Borderlands'),
('Extraction Shooters', 'pc-fps-extraction', '6225f97b-d463-40b8-9de2-e64feb56ed11', 'Tarkov, Hunt: Showdown'),
('Boomer Shooters', 'pc-fps-boomer', '6225f97b-d463-40b8-9de2-e64feb56ed11', 'DOOM, retro-style FPS'),
('Hero Shooters', 'pc-fps-hero', '6225f97b-d463-40b8-9de2-e64feb56ed11', 'Overwatch, team-based hero FPS')
ON CONFLICT DO NOTHING;

-- PC Strategy L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('4X Strategy', 'pc-strat-4x', '5ef7a524-d125-4525-9f90-e4425421ffbd', 'Civilization style 4X'),
('RTS', 'pc-strat-rts', '5ef7a524-d125-4525-9f90-e4425421ffbd', 'Real-time strategy'),
('Turn-Based Tactics', 'pc-strat-turnbased', '5ef7a524-d125-4525-9f90-e4425421ffbd', 'XCOM-style tactics'),
('Grand Strategy', 'pc-strat-grand', '5ef7a524-d125-4525-9f90-e4425421ffbd', 'Paradox-style grand strategy'),
('City Builders', 'pc-strat-citybuilder', '5ef7a524-d125-4525-9f90-e4425421ffbd', 'SimCity, Cities Skylines'),
('Colony Sims', 'pc-strat-colonysim', '5ef7a524-d125-4525-9f90-e4425421ffbd', 'Rimworld, Dwarf Fortress')
ON CONFLICT DO NOTHING;

-- PC MMO L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Theme Park MMOs', 'pc-mmo-themepark', '06aaee8b-aa87-4a44-b3a5-d394ad792619', 'WoW, FFXIV style'),
('Sandbox MMOs', 'pc-mmo-sandbox', '06aaee8b-aa87-4a44-b3a5-d394ad792619', 'EVE Online, Albion'),
('Action MMOs', 'pc-mmo-action', '06aaee8b-aa87-4a44-b3a5-d394ad792619', 'BDO, Lost Ark'),
('Free-to-Play MMOs', 'pc-mmo-f2p', '06aaee8b-aa87-4a44-b3a5-d394ad792619', 'Free to play MMOs'),
('Classic MMOs', 'pc-mmo-classic', '06aaee8b-aa87-4a44-b3a5-d394ad792619', 'Classic/retro MMOs')
ON CONFLICT DO NOTHING;;
