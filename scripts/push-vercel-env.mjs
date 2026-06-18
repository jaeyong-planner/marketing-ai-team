/**
 * Push .env.local keys to Vercel (production + preview).
 * Usage: node scripts/push-vercel-env.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const SKIP = new Set(["NODE_ENV", "VERCEL", "VERCEL_ENV"]);
const TARGETS = ["production", "preview"];

const envPath = resolve(process.cwd(), ".env.local");
if (!existsSync(envPath)) {
  console.error("FAIL: .env.local not found");
  process.exit(1);
}

const entries = [];
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i <= 0) continue;
  const key = t.slice(0, i);
  const value = t.slice(i + 1);
  if (SKIP.has(key) || !value) continue;
  entries.push({ key, value });
}

let ok = 0;
for (const { key, value } of entries) {
  for (const target of TARGETS) {
    const result = spawnSync(
      "vercel",
      ["env", "add", key, target, "--force", "--yes"],
      { input: value, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
    );
    if (result.status === 0) {
      ok += 1;
      console.log(`OK: ${key} → ${target}`);
    } else {
      const err = (result.stderr || result.stdout || "").toString().trim();
      console.warn(`SKIP: ${key} → ${target} (${err.slice(0, 80)})`);
    }
  }
}

console.log(`Done: ${ok} env bindings (${entries.length} keys × ${TARGETS.length} targets)`);