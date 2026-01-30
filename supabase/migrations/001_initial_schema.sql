-- CronSafe Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- =============================================================================
-- MONITORS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.monitors (
    id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name            text NOT NULL CHECK (char_length(name) <= 100),
    slug            text NOT NULL UNIQUE,
    interval_seconds integer NOT NULL CHECK (interval_seconds > 0),
    grace_seconds   integer NOT NULL DEFAULT 300 CHECK (grace_seconds >= 0),
    status          text NOT NULL DEFAULT 'new' CHECK (status IN ('up', 'down', 'grace', 'paused', 'new')),
    last_ping_at    timestamptz,
    next_expected_at timestamptz,
    last_alert_at   timestamptz,
    alert_email     boolean NOT NULL DEFAULT true,
    webhook_url     text,
    is_paused       boolean NOT NULL DEFAULT false,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Indexes for monitors
CREATE INDEX IF NOT EXISTS idx_monitors_user_id ON public.monitors(user_id);
CREATE INDEX IF NOT EXISTS idx_monitors_slug ON public.monitors(slug);
CREATE INDEX IF NOT EXISTS idx_monitors_status ON public.monitors(status);
CREATE INDEX IF NOT EXISTS idx_monitors_next_expected ON public.monitors(next_expected_at)
    WHERE is_paused = false;

-- =============================================================================
-- PINGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.pings (
    id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    monitor_id      uuid NOT NULL REFERENCES public.monitors(id) ON DELETE CASCADE,
    received_at     timestamptz NOT NULL DEFAULT now(),
    source_ip       text,
    user_agent      text
);

-- Index for efficient ping lookups
CREATE INDEX IF NOT EXISTS idx_pings_monitor_id ON public.pings(monitor_id);
CREATE INDEX IF NOT EXISTS idx_pings_received_at ON public.pings(monitor_id, received_at DESC);

-- =============================================================================
-- ALERT LOGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.alert_logs (
    id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    monitor_id      uuid NOT NULL REFERENCES public.monitors(id) ON DELETE CASCADE,
    alert_type      text NOT NULL CHECK (alert_type IN ('email', 'webhook')),
    message         text NOT NULL,
    sent_at         timestamptz NOT NULL DEFAULT now(),
    success         boolean NOT NULL DEFAULT true,
    error           text
);

CREATE INDEX IF NOT EXISTS idx_alert_logs_monitor_id ON public.alert_logs(monitor_id);
CREATE INDEX IF NOT EXISTS idx_alert_logs_sent_at ON public.alert_logs(sent_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_logs ENABLE ROW LEVEL SECURITY;

-- Monitors: Users can only see and manage their own monitors
CREATE POLICY "Users can view their own monitors"
    ON public.monitors FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own monitors"
    ON public.monitors FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monitors"
    ON public.monitors FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monitors"
    ON public.monitors FOR DELETE
    USING (auth.uid() = user_id);

-- Pings: Users can view pings for their own monitors
CREATE POLICY "Users can view pings for their monitors"
    ON public.pings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.monitors
            WHERE monitors.id = pings.monitor_id
            AND monitors.user_id = auth.uid()
        )
    );

-- Pings can be inserted by service role (ping endpoint uses admin client)
-- No INSERT policy for anon/authenticated — pings come through the API

-- Alert logs: Users can view alert logs for their own monitors
CREATE POLICY "Users can view alert logs for their monitors"
    ON public.alert_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.monitors
            WHERE monitors.id = alert_logs.monitor_id
            AND monitors.user_id = auth.uid()
        )
    );

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_monitors_updated_at
    BEFORE UPDATE ON public.monitors
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- CLEANUP FUNCTION (optional — run periodically to clean old pings)
-- =============================================================================

-- Delete pings older than 7 days (free tier retention)
CREATE OR REPLACE FUNCTION public.cleanup_old_pings()
RETURNS integer AS $$
DECLARE
    deleted_count integer;
BEGIN
    DELETE FROM public.pings
    WHERE received_at < now() - interval '7 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Delete alert logs older than 30 days
CREATE OR REPLACE FUNCTION public.cleanup_old_alert_logs()
RETURNS integer AS $$
DECLARE
    deleted_count integer;
BEGIN
    DELETE FROM public.alert_logs
    WHERE sent_at < now() - interval '30 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
