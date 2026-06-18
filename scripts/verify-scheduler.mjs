/**
 * Verify scheduler prerequisites: one agent cycle + agent_runs delta.
 */
import { createClient } from "@supabase/supabase-js";
import { runAgentCycle } from "./lib/agent-cycle.mjs";
import { loadEnv, requireEnv } from "./lib/load-env.mjs";
import { pickNextTopic } from "./lib/pick-topic.mjs";

async function main() {
  const env = loadEnv();
  requireEnv(env, ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

  const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { count: before } = await sb
    .from("agent_runs")
    .select("*", { count: "exact", head: true });

  const topic = await pickNextTopic(sb);
  const result = await runAgentCycle(sb, env, `Scheduler verify: ${topic}`);

  const { count: after } = await sb
    .from("agent_runs")
    .select("*", { count: "exact", head: true });

  const delta = (after ?? 0) - (before ?? 0);
  if (delta < 2) {
    throw new Error(`Expected +2 agent_runs, got +${delta}`);
  }

  const { data: content } = await sb
    .from("content_calendar")
    .select("status")
    .eq("id", result.contentId)
    .single();

  if (content?.status !== "pending_review") {
    throw new Error(`Expected pending_review, got ${content?.status}`);
  }

  console.log("PASS: scheduler cycle verified");
  console.log(JSON.stringify({ topic, ...result, agentRunsDelta: delta }, null, 2));
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});