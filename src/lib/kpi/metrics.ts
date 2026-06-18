import { createClient } from "@/lib/supabase/server";

export type KpiSnapshot = {
  leadsTotal: number;
  leadsWeek: number;
  pageViews: number;
  publishedCount: number;
  pendingReview: number;
  approvalRate: number;
  abVariants: { variant: string; views: number; ctaClicks: number; leads: number }[];
};

export async function fetchKpiSnapshot(): Promise<KpiSnapshot> {
  const supabase = await createClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { count: leadsTotal } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  const { count: leadsWeek } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo);

  const { count: pageViews } = await supabase
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "page_view");

  const { count: publishedCount } = await supabase
    .from("published_posts")
    .select("*", { count: "exact", head: true });

  const { count: pendingReview } = await supabase
    .from("content_calendar")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_review");

  const { count: approved } = await supabase
    .from("content_calendar")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  const { count: publishedStatus } = await supabase
    .from("content_calendar")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const decided = (approved ?? 0) + (publishedStatus ?? 0) + (pendingReview ?? 0);
  const approvalRate = decided > 0 ? ((approved ?? 0) + (publishedStatus ?? 0)) / decided : 0;

  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_type, payload")
    .in("event_type", ["page_view", "cta_click", "lead_submit"])
    .limit(500);

  type AnalyticsRow = { event_type: string; payload: Record<string, unknown> | null };
  const rows = (events ?? []) as AnalyticsRow[];

  const abMap = new Map<string, { views: number; ctaClicks: number; leads: number }>();
  for (const row of rows) {
    const payload = row.payload;
    const variant = String(payload?.variant ?? "unknown");
    const bucket = abMap.get(variant) ?? { views: 0, ctaClicks: 0, leads: 0 };
    if (row.event_type === "page_view") bucket.views += 1;
    if (row.event_type === "cta_click") bucket.ctaClicks += 1;
    if (row.event_type === "lead_submit") bucket.leads += 1;
    abMap.set(variant, bucket);
  }

  const abVariants = [...abMap.entries()].map(([variant, stats]) => ({
    variant,
    ...stats,
  }));

  return {
    leadsTotal: leadsTotal ?? 0,
    leadsWeek: leadsWeek ?? 0,
    pageViews: pageViews ?? 0,
    publishedCount: publishedCount ?? 0,
    pendingReview: pendingReview ?? 0,
    approvalRate,
    abVariants,
  };
}