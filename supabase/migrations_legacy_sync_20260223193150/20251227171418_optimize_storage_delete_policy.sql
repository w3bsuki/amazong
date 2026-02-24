ALTER POLICY "Users can delete own images"
ON storage.objects
USING (
  bucket_id = 'product-images'
  AND ((select auth.uid())::text = (storage.foldername(name))[1])
);
;
