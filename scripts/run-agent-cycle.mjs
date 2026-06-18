/**
 * CLI: Researcher→Writer cycle
 * Usage: node scripts/run-agent-cycle.mjs "주제"
 */
import { createClient } from "@supabase/supabase-js";
import { runAgentCycle } from "./lib/agent-cycle.mjs";
import { loadEnv, requireEnv } from "./lib/load-env.mjs";

const topic = process.argv[2] ?? "AI 마케팅 CLI 테스트";

async function main() {
  const env = loadEnv();
  requireEnv(env, ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

  const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const result = await runAgentCycle(sb, env, topic);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});