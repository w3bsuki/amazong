
-- Remove remaining duplicates where Bulgarian name is same but types differ
-- These still show as duplicates to Bulgarian users
-- Keeping the better variant (number type preferred for values, select for choices)

DELETE FROM category_attributes 
WHERE id IN (
  -- Cars: Power (hp) select - keeping Power (HP) number (number is better for exact values)
  '3cddbf87-3445-4bdf-b729-e8c5a4fb4f65',
  -- Movies & Music: Release Year select - keeping Year Released text (text allows any year)
  '34bef07c-dc23-44c7-be07-06f8bd2605e4',
  -- Stamps: Country text - keeping Stamp Country select (select has predefined options)
  '3bb255a2-8278-42d0-8004-03fa7ce6ede4',
  -- Tools: brand text (lowercase) - keeping Brand select (select has options, proper casing)
  'c5b810ec-e12e-4444-af40-439068512907'
);
;
