/**
 * Verify RLS: anon blocked, service_role allowed on leads
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0) env[t.slice(0, i)] = t.slice(i + 1);
  }
  return env;
}

async function main() {
  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_ROLE_KEY;

  const anonClient = createClient(url, anon);
  const { error: anonError } = await anonClient.from("leads").insert({
    email: `rls-test-${Date.now()}@example.com`,
    source: "rls-test",
  });

  if (!anonError) {
    throw new Error("FAIL: anon INSERT should be blocked by RLS");
  }
  console.log("PASS: anon INSERT blocked —", anonError.message.slice(0, 60));

  const admin = createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const email = `rls-admin-${Date.now()}@example.com`;
  const { data, error: adminError } = await admin
    .from("leads")
    .insert({ email, source: "rls-verify" })
    .select("id")
    .single();

  if (adminError) throw new Error(`service_role INSERT failed: ${adminError.message}`);
  console.log("PASS: service_role INSERT ok —", data.id);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});