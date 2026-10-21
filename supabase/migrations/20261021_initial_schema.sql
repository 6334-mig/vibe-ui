-- ==============================================================================
-- VIBE UI SHOW - INITIAL SCHEMA & ROW LEVEL SECURITY
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to protect the role column from non-admin self-promotion
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role <> OLD.role THEN
        -- Only service_role or users with admin role can alter roles
        IF (auth.jwt() ->> 'role' <> 'service_role') AND 
           NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
            RAISE EXCEPTION 'Unauthorized to alter role column.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_profile_role ON public.profiles;
CREATE TRIGGER tr_protect_profile_role
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'name', 'creator_' || substr(NEW.id::text, 1, 8)),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    html_code TEXT NOT NULL,
    cover_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'pending', 'rejected', 'flagged')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    view_count INT NOT NULL DEFAULT 0,
    avg_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    rating_count INT NOT NULL DEFAULT 0,
    favorite_count INT NOT NULL DEFAULT 0,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Full-text search trigger
CREATE OR REPLACE FUNCTION public.projects_search_vector_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', array_to_string(NEW.tags, ' ')), 'C');
    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_projects_search_vector ON public.projects;
CREATE TRIGGER tr_projects_search_vector
BEFORE INSERT OR UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.projects_search_vector_trigger();

-- GIN Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_projects_search ON public.projects USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_projects_status_rating ON public.projects(status, avg_rating DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- ------------------------------------------------------------------------------
-- 3. RATINGS TABLE (Hybrid Identity: User or HMAC Guest)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    guest_id TEXT,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_ratings_identity CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_rating ON public.ratings(project_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_guest_rating ON public.ratings(project_id, guest_id) WHERE guest_id IS NOT NULL;

-- Trigger to recalculate average rating & rating count on project
CREATE OR REPLACE FUNCTION public.update_project_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_project_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_project_id := OLD.project_id;
    ELSE
        target_project_id := NEW.project_id;
    END IF;

    UPDATE public.projects
    SET 
        avg_rating = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 2) 
            FROM public.ratings 
            WHERE project_id = target_project_id
        ), 0.00),
        rating_count = (
            SELECT COUNT(*) 
            FROM public.ratings 
            WHERE project_id = target_project_id
        )
    WHERE id = target_project_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_project_rating ON public.ratings;
CREATE TRIGGER tr_update_project_rating
AFTER INSERT OR UPDATE OR DELETE ON public.ratings
FOR EACH ROW EXECUTE FUNCTION public.update_project_rating_stats();

-- ------------------------------------------------------------------------------
-- 4. FAVORITES / BOOKMARKS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    guest_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_favorites_identity CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_favorite ON public.favorites(project_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_guest_favorite ON public.favorites(project_id, guest_id) WHERE guest_id IS NOT NULL;

-- Trigger to maintain favorite count
CREATE OR REPLACE FUNCTION public.update_project_favorite_count()
RETURNS TRIGGER AS $$
DECLARE
    target_project_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_project_id := OLD.project_id;
    ELSE
        target_project_id := NEW.project_id;
    END IF;

    UPDATE public.projects
    SET favorite_count = (
        SELECT COUNT(*) FROM public.favorites WHERE project_id = target_project_id
    )
    WHERE id = target_project_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_project_favorites ON public.favorites;
CREATE TRIGGER tr_update_project_favorites
AFTER INSERT OR DELETE ON public.favorites
FOR EACH ROW EXECUTE FUNCTION public.update_project_favorite_count();

-- ------------------------------------------------------------------------------
-- 5. COMMENTS TABLE (Threaded, Sanitized Plain Text)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    guest_id TEXT,
    guest_name TEXT,
    content TEXT NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_comments_project ON public.comments(project_id, created_at ASC);

-- ------------------------------------------------------------------------------
-- 6. SCREENSHOT QUEUE TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.screenshot_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to automatically enqueue new published projects for screenshotting
CREATE OR REPLACE FUNCTION public.enqueue_project_screenshot()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cover_url IS NULL OR NEW.cover_url = '' THEN
        INSERT INTO public.screenshot_queue (project_id)
        VALUES (NEW.id)
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_enqueue_screenshot ON public.projects;
CREATE TRIGGER tr_enqueue_screenshot
AFTER INSERT ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.enqueue_project_screenshot();

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenshot_queue ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile username and avatar"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- PROJECTS
CREATE POLICY "Published projects are viewable by everyone"
    ON public.projects FOR SELECT
    USING (status = 'published' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can create projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Project owners or admins can update projects"
    ON public.projects FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Project owners or admins can delete projects"
    ON public.projects FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- RATINGS & FAVORITES
CREATE POLICY "Ratings viewable by everyone"
    ON public.ratings FOR SELECT USING (true);

CREATE POLICY "Favorites viewable by everyone"
    ON public.favorites FOR SELECT USING (true);

-- COMMENTS
CREATE POLICY "Public can view unhidden comments"
    ON public.comments FOR SELECT
    USING (is_hidden = false OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authors or admins can update/hide comments"
    ON public.comments FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authors or admins can delete comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());
