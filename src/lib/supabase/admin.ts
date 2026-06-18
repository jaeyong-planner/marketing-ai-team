import { createClient } from "@supabase/supabase-js";

export type LeadInsert = {
  email: string;
  name?: string | null;
  interest?: string | null;
  source?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
};

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase admin credentials");
  }

  const client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return {
    async insertLead(payload: LeadInsert) {
      return client
        .from("leads")
        .insert(payload)
        .select("id")
        .single();
    },
  };
}