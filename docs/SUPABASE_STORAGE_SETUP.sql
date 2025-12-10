-- Tara App - Supabase Storage Setup
-- Run these commands in Supabase SQL Editor to set up storage buckets and policies

-- ============================================================================
-- STORAGE BUCKETS SETUP
-- ============================================================================

-- Note: Storage buckets are typically created via the Supabase Dashboard UI
-- Go to Storage → Create a new bucket for each of these:

-- 1. avatars (public)
--    - Max file size: 2MB
--    - Allowed MIME types: image/jpeg, image/png, image/webp
--    - Public: Yes

-- 2. driver-documents (private)
--    - Max file size: 5MB
--    - Allowed MIME types: image/jpeg, image/png, application/pdf
--    - Public: No

-- 3. vehicle-photos (public)
--    - Max file size: 3MB
--    - Allowed MIME types: image/jpeg, image/png, image/webp
--    - Public: Yes

-- ============================================================================
-- STORAGE POLICIES (Run these after creating buckets)
-- ============================================================================

-- ============================================================================
-- 1. AVATARS BUCKET POLICIES
-- ============================================================================

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- ============================================================================
-- 2. DRIVER DOCUMENTS BUCKET POLICIES (Private)
-- ============================================================================

-- Allow drivers to upload their own documents
CREATE POLICY "Drivers can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'driver-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow drivers to view their own documents
CREATE POLICY "Drivers can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'driver-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow drivers to update their own documents
CREATE POLICY "Drivers can update own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'driver-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow drivers to delete their own documents
CREATE POLICY "Drivers can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'driver-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- 3. VEHICLE PHOTOS BUCKET POLICIES
-- ============================================================================

-- Allow drivers to upload vehicle photos
CREATE POLICY "Drivers can upload vehicle photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vehicle-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT d.id::text 
    FROM public.drivers d 
    WHERE d.user_id = auth.uid()
  )
);

-- Allow drivers to update their vehicle photos
CREATE POLICY "Drivers can update vehicle photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vehicle-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT d.id::text 
    FROM public.drivers d 
    WHERE d.user_id = auth.uid()
  )
);

-- Allow drivers to delete their vehicle photos
CREATE POLICY "Drivers can delete vehicle photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vehicle-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT d.id::text 
    FROM public.drivers d 
    WHERE d.user_id = auth.uid()
  )
);

-- Allow public to view all vehicle photos
CREATE POLICY "Public can view vehicle photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vehicle-photos');

-- ============================================================================
-- FILE NAMING CONVENTIONS
-- ============================================================================

/*
Use these naming patterns when uploading files:

AVATARS:
  {user_id}/avatar.jpg
  {user_id}/avatar.png
  Example: 550e8400-e29b-41d4-a716-446655440000/avatar.jpg

DRIVER DOCUMENTS:
  {user_id}/license-front.jpg
  {user_id}/license-back.jpg
  {user_id}/nbi-clearance.pdf
  Example: 550e8400-e29b-41d4-a716-446655440000/license-front.jpg

VEHICLE PHOTOS:
  {driver_id}/{vehicle_id}/front.jpg
  {driver_id}/{vehicle_id}/side.jpg
  {driver_id}/{vehicle_id}/interior.jpg
  {driver_id}/{vehicle_id}/or-cr.jpg
  Example: 660e8400-e29b-41d4-a716-446655440000/770e8400-e29b-41d4-a716-446655440000/front.jpg
*/

-- ============================================================================
-- HELPER FUNCTIONS FOR FILE UPLOADS
-- ============================================================================

-- Function to get avatar URL
CREATE OR REPLACE FUNCTION public.get_avatar_url(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  avatar_path TEXT;
BEGIN
  SELECT name INTO avatar_path
  FROM storage.objects
  WHERE bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = user_id::text
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF avatar_path IS NOT NULL THEN
    RETURN CONCAT(
      current_setting('app.settings.supabase_url'),
      '/storage/v1/object/public/avatars/',
      avatar_path
    );
  ELSE
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CLEANUP FUNCTIONS
-- ============================================================================

-- Function to delete old avatar when new one is uploaded
CREATE OR REPLACE FUNCTION public.cleanup_old_avatars()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete old avatar files for this user (keep only the latest)
  DELETE FROM storage.objects
  WHERE bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (storage.foldername(NEW.name))[1]
    AND id != NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to cleanup old avatars
CREATE TRIGGER cleanup_old_avatars_trigger
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'avatars')
  EXECUTE FUNCTION public.cleanup_old_avatars();

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================

-- Verify storage buckets exist (run in Supabase Dashboard)
SELECT * FROM storage.buckets ORDER BY name;
