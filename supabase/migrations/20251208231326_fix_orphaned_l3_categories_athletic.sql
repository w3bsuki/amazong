-- Fix orphaned athletic apparel L3 categories
-- Parent: fitness-accessories (id: 5f1b52e0-a87a-45cc-84e9-8156814ca30e)

UPDATE categories
SET parent_id = '5f1b52e0-a87a-45cc-84e9-8156814ca30e', display_order = 100
WHERE slug IN (
  'ath-base', 'ath-bras', 'ath-cleats', 'ath-compression',
  'ath-court', 'ath-jackets', 'ath-pants', 'ath-running',
  'ath-shorts', 'ath-tops', 'ath-trail', 'ath-training', 'ath-walking'
)
AND parent_id IS NULL;;
