/**
 * VPS 24/7 agent scheduler — runs Researcher→Writer on interval.
 *
 * Env:
 *   AGENT_INTERVAL_MS  — default 14400000 (4h)
 *   AGENT_MAX_CYCLES   — optional limit (1 for smoke test)
 *   AGENT_MOCK         — true for mock LLM
 */
import { createClient } from "@supabase/supabase-js";
import { runAgentCycle } from "./lib/agent-cycle.mjs";
import { loadEnv, requireEnv } from "./lib/load-env.mjs";
import { pickNextTopic } from "./lib/pick-topic.mjs";

const env = loadEnv();
requireEnv(env, ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

const INTERVAL_MS = Number(env.AGENT_INTERVAL_MS ?? 14_400_000);
const MAX_CYCLES = env.AGENT_MAX_CYCLES ? Number(env.AGENT_MAX_CYCLES) : null;

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let cycles = 0;
let running = false;

function log(msg) {
  console.log(`[scheduler ${new Date().toISOString()}] ${msg}`);
}

async function tick() {
  if (running) {
    log("skip: previous cycle still running");
    return;
  }
  running = true;
  try {
    const topic = await pickNextTopic(sb);
    log(`cycle ${cycles + 1} start — topic: ${topic}`);
    const result = await runAgentCycle(sb, env, topic);
    cycles += 1;
    log(`cycle ${cycles} done — contentId=${result.contentId} title=${result.title}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log(`cycle error: ${msg}`);
  } finally {
    running = false;
  }

  if (MAX_CYCLES !== null && cycles >= MAX_CYCLES) {
    log(`max cycles (${MAX_CYCLES}) reached — exiting`);
    process.exit(0);
  }
}

log(`started — interval=${INTERVAL_MS}ms mock=${env.AGENT_MOCK ?? "auto"}`);
await tick();
setInterval(tick, INTERVAL_MS);

process.on("SIGINT", () => {
  log("SIGINT — shutting down");
  process.exit(0);
});
process.on("SIGTERM", () => {
  log("SIGTERM — shutting down");
  process.exit(0);
});