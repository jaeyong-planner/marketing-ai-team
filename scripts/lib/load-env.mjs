import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Load .env.local and .env into a plain object (no process.env mutation).
 */
export function loadEnv(cwd = process.cwd()) {
  const env = {};
  for (const file of [".env.local", ".env"]) {
    try {
      const content = readFileSync(resolve(cwd, file), "utf8");
      for (const line of content.split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const i = t.indexOf("=");
        if (i > 0) env[t.slice(0, i)] = t.slice(i + 1);
      }
    } catch {
      /* optional file */
    }
  }
  return env;
}

export function requireEnv(env, keys) {
  const missing = keys.filter((k) => !env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing env: ${missing.join(", ")}`);
  }
}