-- ==============================================================================
-- SECURITY HARDENING
-- Address Supabase security advisors:
--   - function_search_path_mutable (all functions)
--   - anon/authenticated_security_definer_function_executable
--   - rls_enabled_no_policy (screenshot_queue)
--   - extension_in_public (pg_trgm)
-- ==============================================================================

-- 1. Dedicated schema for internal (non-RPC-exposed) functions
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

-- 2. Move pg_trgm out of the public schema
DO $do$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm'
    ) THEN
        EXECUTE 'ALTER EXTENSION pg_trgm SET SCHEMA extensions';
    END IF;
END
$do$;

-- 3. Relocate SECURITY DEFINER helpers into the private schema so they are
--    not callable over PostgREST RPC by anon/authenticated users.
ALTER FUNCTION public.is_admin() SET SCHEMA private;
ALTER FUNCTION public.protect_profile_role() SET SCHEMA private;
ALTER FUNCTION public.handle_new_user() SET SCHEMA private;

-- 4. Pin the search_path on every function (defends against search_path hijacking)
ALTER FUNCTION private.is_admin() SET search_path = public, private, pg_temp;
ALTER FUNCTION private.protect_profile_role() SET search_path = public, private, pg_temp;
ALTER FUNCTION private.handle_new_user() SET search_path = public, private, pg_temp;
ALTER FUNCTION public.projects_search_vector_trigger() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_project_rating_stats() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_project_favorite_count() SET search_path = public, pg_temp;
ALTER FUNCTION public.enqueue_project_screenshot() SET search_path = public, pg_temp;

-- 5. is_admin() only ever reads the caller's own profile row, which is
--    already publicly readable via RLS. Run it as INVOKER instead of DEFINER
--    so it no longer exposes a definer-privileged RPC endpoint.
ALTER FUNCTION private.is_admin() SECURITY INVOKER;

-- 6. Lock down EXECUTE on the trigger functions
REVOKE ALL ON FUNCTION private.protect_profile_role() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin() TO anon, authenticated, service_role;

-- 7. Point the RLS policies at the relocated helper
DROP POLICY IF EXISTS "Published projects are viewable by everyone" ON public.projects;
CREATE POLICY "Published projects are viewable by everyone"
    ON public.projects FOR SELECT
    USING (status = 'published' OR auth.uid() = user_id OR private.is_admin());

DROP POLICY IF EXISTS "Project owners or admins can update projects" ON public.projects;
CREATE POLICY "Project owners or admins can update projects"
    ON public.projects FOR UPDATE
    USING (auth.uid() = user_id OR private.is_admin());

DROP POLICY IF EXISTS "Project owners or admins can delete projects" ON public.projects;
CREATE POLICY "Project owners or admins can delete projects"
    ON public.projects FOR DELETE
    USING (auth.uid() = user_id OR private.is_admin());

DROP POLICY IF EXISTS "Public can view unhidden comments" ON public.comments;
CREATE POLICY "Public can view unhidden comments"
    ON public.comments FOR SELECT
    USING (is_hidden = false OR auth.uid() = user_id OR private.is_admin());

DROP POLICY IF EXISTS "Authors or admins can update/hide comments" ON public.comments;
CREATE POLICY "Authors or admins can update/hide comments"
    ON public.comments FOR UPDATE
    USING (auth.uid() = user_id OR private.is_admin());

DROP POLICY IF EXISTS "Authors or admins can delete comments" ON public.comments;
CREATE POLICY "Authors or admins can delete comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id OR private.is_admin());

-- 8. screenshot_queue is worker-only: visible to admins, writable by service_role
DROP POLICY IF EXISTS "Admins can view the screenshot queue" ON public.screenshot_queue;
CREATE POLICY "Admins can view the screenshot queue"
    ON public.screenshot_queue FOR SELECT
    USING (private.is_admin());

DROP POLICY IF EXISTS "Service role can manage the screenshot queue" ON public.screenshot_queue;
CREATE POLICY "Service role can manage the screenshot queue"
    ON public.screenshot_queue FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- 9. Guests may only rate/favourite/comment through the server-side HMAC
--    guest path (service_role). Deny direct anon writes.
DROP POLICY IF EXISTS "Guests can insert ratings" ON public.ratings;
CREATE POLICY "Authenticated users can insert ratings"
    ON public.ratings FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Guests can insert favorites" ON public.favorites;
CREATE POLICY "Authenticated users can insert favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Guests can insert comments" ON public.comments;
CREATE POLICY "Authenticated users can insert comments"
    ON public.comments FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');
