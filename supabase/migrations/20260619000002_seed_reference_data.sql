-- Optional seed data for local/dev testing (safe to skip in production)

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.campaigns LIMIT 1) THEN
    INSERT INTO public.campaigns (name, platform, budget, utm_source, utm_medium, utm_campaign)
    VALUES
      ('Launch — Organic', 'organic', NULL, 'organic', 'referral', 'launch_organic'),
      ('Launch — Meta Test', 'meta', 50000, 'meta', 'paid_social', 'launch_meta_test');
  END IF;
END $$;