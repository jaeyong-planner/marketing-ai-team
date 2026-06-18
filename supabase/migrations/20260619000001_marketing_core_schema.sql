-- Marketing AI Team — core schema
-- Task #2: leads, content_calendar, approvals, published_posts, campaigns, analytics_events, agent_runs

-- ---------------------------------------------------------------------------
-- Extensions & enums
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE public.content_type AS ENUM (
  'blog',
  'social',
  'email',
  'script',
  'other'
);

CREATE TYPE public.content_status AS ENUM (
  'idea',
  'researching',
  'draft',
  'pending_review',
  'needs_revision',
  'approved',
  'scheduled',
  'published',
  'rejected',
  'archived'
);

CREATE TYPE public.approval_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'needs_revision'
);

CREATE TYPE public.agent_run_status AS ENUM (
  'running',
  'completed',
  'failed',
  'cancelled'
);

CREATE TYPE public.campaign_platform AS ENUM (
  'meta',
  'google',
  'x',
  'email',
  'organic',
  'other'
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Admin profiles linked to auth.users
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'viewer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'admin')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- agent_runs (created first — referenced by content_calendar)
-- ---------------------------------------------------------------------------
CREATE TABLE public.agent_runs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_role    TEXT NOT NULL,
  input         JSONB,
  output        JSONB,
  status        public.agent_run_status NOT NULL DEFAULT 'running',
  duration_ms   INTEGER,
  error_message TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ
);

CREATE INDEX agent_runs_role_created_idx ON public.agent_runs (agent_role, created_at DESC);

-- ---------------------------------------------------------------------------
-- campaigns
-- ---------------------------------------------------------------------------
CREATE TABLE public.campaigns (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  platform    public.campaign_platform NOT NULL DEFAULT 'other',
  budget      NUMERIC(12, 2),
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER campaigns_set_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
CREATE TABLE public.leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL,
  name         TEXT,
  interest     TEXT,
  source       TEXT,
  utm_source   TEXT,
  utm_medium   TEXT,
  utm_campaign TEXT,
  utm_content  TEXT,
  utm_term     TEXT,
  campaign_id  UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX leads_email_idx ON public.leads (email);
CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX leads_utm_campaign_idx ON public.leads (utm_campaign);

-- ---------------------------------------------------------------------------
-- content_calendar
-- ---------------------------------------------------------------------------
CREATE TABLE public.content_calendar (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  type          public.content_type NOT NULL DEFAULT 'blog',
  status        public.content_status NOT NULL DEFAULT 'draft',
  body_md       TEXT,
  meta_json     JSONB NOT NULL DEFAULT '{}'::jsonb,
  topic         TEXT,
  scheduled_at  TIMESTAMPTZ,
  agent_run_id  UUID REFERENCES public.agent_runs(id) ON DELETE SET NULL,
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX content_calendar_status_idx ON public.content_calendar (status);
CREATE INDEX content_calendar_scheduled_idx ON public.content_calendar (scheduled_at);

CREATE TRIGGER content_calendar_set_updated_at
  BEFORE UPDATE ON public.content_calendar
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- approvals
-- ---------------------------------------------------------------------------
CREATE TABLE public.approvals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id  UUID NOT NULL REFERENCES public.content_calendar(id) ON DELETE CASCADE,
  status      public.approval_status NOT NULL DEFAULT 'pending',
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  comment     TEXT,
  decided_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX approvals_content_id_idx ON public.approvals (content_id);
CREATE INDEX approvals_status_idx ON public.approvals (status);

-- ---------------------------------------------------------------------------
-- published_posts
-- ---------------------------------------------------------------------------
CREATE TABLE public.published_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id   UUID NOT NULL REFERENCES public.content_calendar(id) ON DELETE CASCADE,
  channel      TEXT NOT NULL,
  url          TEXT,
  external_id  TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX published_posts_content_id_idx ON public.published_posts (content_id);
CREATE INDEX published_posts_channel_idx ON public.published_posts (channel);

-- ---------------------------------------------------------------------------
-- analytics_events
-- ---------------------------------------------------------------------------
CREATE TABLE public.analytics_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  TEXT NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}'::jsonb,
  session_id  TEXT,
  lead_id     UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX analytics_events_type_created_idx ON public.analytics_events (event_type, created_at DESC);
CREATE INDEX analytics_events_session_idx ON public.analytics_events (session_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- profiles: users read own; admins manage all
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin-only tables (anon blocked per Task #2 test strategy)
CREATE POLICY "agent_runs_admin_all"
  ON public.agent_runs FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "campaigns_admin_all"
  ON public.campaigns FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "leads_admin_all"
  ON public.leads FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "content_calendar_admin_all"
  ON public.content_calendar FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "approvals_admin_all"
  ON public.approvals FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "published_posts_admin_all"
  ON public.published_posts FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "analytics_events_admin_all"
  ON public.analytics_events FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Task #6 will add: anon INSERT on leads via Edge Function or separate policy