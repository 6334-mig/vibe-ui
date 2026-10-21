-- ==============================================================================
-- PROJECT COVERS STORAGE BUCKET
-- Public bucket for auto-generated project cover screenshots (Phase 8 cron worker)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'project-covers',
    'project-covers',
    true,
    5242880, -- 5 MB
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read access for cover images
DROP POLICY IF EXISTS "Public read access for project covers" ON storage.objects;
CREATE POLICY "Public read access for project covers"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'project-covers');

-- Authenticated users may upload their own covers
DROP POLICY IF EXISTS "Authenticated users can upload project covers" ON storage.objects;
CREATE POLICY "Authenticated users can upload project covers"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'project-covers'
        AND auth.role() = 'authenticated'
    );

-- Owners (and service_role via the screenshot worker) can remove covers
DROP POLICY IF EXISTS "Users can delete their own project covers" ON storage.objects;
CREATE POLICY "Users can delete their own project covers"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'project-covers'
        AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );
