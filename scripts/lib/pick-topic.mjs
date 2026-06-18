import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Pick next topic from content/topics.json, skipping recently used topics.
 * @param {import('@supabase/supabase-js').SupabaseClient} sb
 * @param {string} cwd
 */
export async function pickNextTopic(sb, cwd = process.cwd()) {
  const raw = readFileSync(resolve(cwd, "content/topics.json"), "utf8");
  const { topics } = JSON.parse(raw);
  if (!Array.isArray(topics) || topics.length === 0) {
    throw new Error("content/topics.json has no topics");
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recent } = await sb
    .from("content_calendar")
    .select("topic")
    .gte("created_at", since);

  const used = new Set((recent ?? []).map((r) => r.topic).filter(Boolean));

  for (const topic of topics) {
    if (!used.has(topic)) return topic;
  }

  return topics[Math.floor(Math.random() * topics.length)];
}