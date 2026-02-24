-- Add Unsplash images to L1 categories (the ones shown in category circles)
-- These are high-quality, free-to-use images

-- Sports L1 categories (shown in your screenshot)
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80' WHERE slug = 'fitness';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&q=80' WHERE slug = 'cycling';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1461896836934- voices=0c623066013b?w=200&q=80' WHERE slug = 'team-sports';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=200&q=80' WHERE slug = 'water-sports';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&q=80' WHERE slug = 'winter-sports';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=200&q=80' WHERE slug = 'combat-sports';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=200&q=80' WHERE slug = 'running';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=200&q=80' WHERE slug = 'golf';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&q=80' WHERE slug = 'hiking-camping';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1544298621-77b4074e6c69?w=200&q=80' WHERE slug = 'fishing-hunting';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=200&q=80' WHERE slug = 'racket-sports';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1566251037378-5e04e3bec343?w=200&q=80' WHERE slug = 'equestrian';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80' WHERE slug = 'outdoor-recreation';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200&q=80' WHERE slug = 'sports-supplements';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&q=80' WHERE slug = 'sports-fan-gear';

-- Electronics L1 categories  
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80' WHERE slug = 'smartphones';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80' WHERE slug = 'laptops';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=200&q=80' WHERE slug = 'desktops';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=200&q=80' WHERE slug = 'tablets';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&q=80' WHERE slug = 'televisions-category';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80' WHERE slug = 'audio';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80' WHERE slug = 'electronics-cameras';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' WHERE slug = 'smart-devices';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&q=80' WHERE slug = 'networking';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80' WHERE slug = 'monitors';

-- Fashion L1 categories
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&q=80' WHERE slug = 'fashion-mens';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80' WHERE slug = 'fashion-womens';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=200&q=80' WHERE slug = 'fashion-kids';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&q=80' WHERE slug = 'fashion-unisex';

-- Gaming L1 categories
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&q=80' WHERE slug = 'console-gaming';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80' WHERE slug = 'pc-gaming-main';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=200&q=80' WHERE slug = 'board-games';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=200&q=80' WHERE slug = 'vr-ar-gaming';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80' WHERE slug = 'retro-gaming';

-- Home L1 categories
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80' WHERE slug = 'furniture';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80' WHERE slug = 'kitchen-dining';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&q=80' WHERE slug = 'home-decor';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' WHERE slug = 'lighting';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&q=80' WHERE slug = 'garden-outdoor';

-- Beauty L1 categories
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80' WHERE slug = 'makeup';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&q=80' WHERE slug = 'skincare';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=200&q=80' WHERE slug = 'haircare';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&q=80' WHERE slug = 'fragrance';

-- Pets L1 categories
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=80' WHERE slug = 'dogs';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80' WHERE slug = 'cats';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=200&q=80' WHERE slug = 'fish-aquatic';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=200&q=80' WHERE slug = 'birds';;
