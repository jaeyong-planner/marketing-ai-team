import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type LeadBody = {
  email?: string;
  name?: string;
  interest?: string;
  website?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export async function POST(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true, id: "spam-blocked" }, { status: 201 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.insertLead({
    email,
    name: body.name?.trim() ?? null,
    interest: body.interest?.trim() ?? null,
    source: "landing",
    utm_source: body.utm_source ?? null,
    utm_medium: body.utm_medium ?? null,
    utm_campaign: body.utm_campaign ?? null,
    utm_content: body.utm_content ?? null,
    utm_term: body.utm_term ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}