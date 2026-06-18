/**
 * Verify batch content targets (Task #8).
 */
import { createClient } from "@supabase/supabase-js";
import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, requireEnv } from "./lib/load-env.mjs";

function countDir(name) {
  const dir = resolve(process.cwd(), "content", name);
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.endsWith(".md")).length;
}

async function main() {
  const env = loadEnv();
  requireEnv(env, ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

  const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { count: total } = await sb
    .from("content_calendar")
    .select("*", { count: "exact", head: true });

  const { count: approvals } = await sb
    .from("approvals")
    .select("*", { count: "exact", head: true });

  const { count: published } = await sb
    .from("published_posts")
    .select("*", { count: "exact", head: true });

  const blogFiles = countDir("blog");
  const socialFiles = countDir("social");
  const emailFiles = countDir("email");

  const checks = [
    [(total ?? 0) >= 15, `content_calendar >= 15 (got ${total})`],
    [(approvals ?? 0) >= 5, `approvals >= 5 (got ${approvals})`],
    [blogFiles >= 5, `content/blog md >= 5 (got ${blogFiles})`],
    [socialFiles >= 10, `content/social md >= 10 (got ${socialFiles})`],
    [emailFiles >= 3, `content/email md >= 3 (got ${emailFiles})`],
  ];

  const failed = checks.filter(([ok]) => !ok);
  if (failed.length > 0) {
    throw new Error(failed.map(([, msg]) => msg).join("; "));
  }

  console.log("PASS: batch content verification");
  console.log(
    JSON.stringify(
      { total, approvals, published, blogFiles, socialFiles, emailFiles },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});