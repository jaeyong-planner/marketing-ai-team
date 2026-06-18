import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/service";

const ALLOWED = new Set(["page_view", "lead_submit", "cta_click"]);

type AnalyticsBody = {
  event_type?: string;
  payload?: Record<string, unknown>;
  session_id?: string;
};

export async function POST(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  let body: AnalyticsBody;
  try {
    body = (await request.json()) as AnalyticsBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.event_type || !ALLOWED.has(body.event_type)) {
    return NextResponse.json({ error: "Invalid event_type" }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const { error } = await supabase.from("analytics_events").insert({
    event_type: body.event_type,
    payload: body.payload ?? {},
    session_id: body.session_id ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}