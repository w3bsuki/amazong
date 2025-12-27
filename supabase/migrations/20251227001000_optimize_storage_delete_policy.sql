-- Optimize storage.objects DELETE policy by wrapping auth.uid() in a SELECT
-- This avoids per-row re-evaluation and aligns with Supabase RLS performance guidance.

ALTER POLICY "Users can delete own images"
ON storage.objects
USING (
  bucket_id = 'product-images'
  AND ((select auth.uid())::text = (storage.foldername(name))[1])
);
