/**
 * Batch content pipeline: blog (agent cycle) + social + email
 * Usage: node scripts/batch-content.mjs [--dry-run-count]
 */
import { createClient } from "@supabase/supabase-js";
import { runBatchGenerate } from "./lib/batch-generate.mjs";
import { loadEnv, requireEnv } from "./lib/load-env.mjs";

const dryRun = process.argv.includes("--dry-run-count");

async function main() {
  const env = loadEnv();
  requireEnv(env, ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

  if (dryRun) {
    console.log(JSON.stringify({ blog: 8, social: 24, email: 6, total: 38 }, null, 2));
    return;
  }

  const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const stats = await runBatchGenerate(sb, env);
  console.log("PASS: batch content generated");
  console.log(JSON.stringify(stats, null, 2));
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});