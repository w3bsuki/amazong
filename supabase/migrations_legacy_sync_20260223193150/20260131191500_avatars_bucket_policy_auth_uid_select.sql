-- Recreate avatar storage policies to use (SELECT auth.uid()) for stable evaluation.
-- This is an additive migration; it replaces only policy definitions.

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Anyone can view avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated users can upload only to their own folder ("<uid>/..." paths)
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (SELECT auth.uid()) IS NOT NULL
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Users can update files in their own folder
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (SELECT auth.uid()) IS NOT NULL
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Users can delete files in their own folder
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (SELECT auth.uid()) IS NOT NULL
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );
