/**
 * Lighthouse mobile audit (requires server at E2E_BASE_URL).
 * Usage: node scripts/lighthouse-mobile.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3002";
const OUT_DIR = resolve(process.cwd(), ".lighthouse");
const REPORT = resolve(OUT_DIR, "mobile-report.json");
const THRESHOLD = Number(process.env.LIGHTHOUSE_MIN ?? 90);

mkdirSync(OUT_DIR, { recursive: true });

const args = [
  BASE_URL,
  "--only-categories=performance,accessibility,best-practices,seo",
  "--form-factor=mobile",
  "--screenEmulation.mobile=true",
  "--output=json",
  `--output-path=${REPORT}`,
  "--quiet",
  "--chrome-flags=--headless --no-sandbox",
];

const result = spawnSync("npx", ["--yes", "lighthouse", ...args], {
  stdio: "inherit",
  shell: true,
});

if (result.status !== 0 || !existsSync(REPORT)) {
  console.error("FAIL: lighthouse run failed");
  process.exit(1);
}

const report = JSON.parse(readFileSync(REPORT, "utf8"));
const scores = {
  performance: Math.round((report.categories.performance?.score ?? 0) * 100),
  accessibility: Math.round((report.categories.accessibility?.score ?? 0) * 100),
  bestPractices: Math.round((report.categories["best-practices"]?.score ?? 0) * 100),
  seo: Math.round((report.categories.seo?.score ?? 0) * 100),
};

console.log("Lighthouse mobile scores:", scores);

if (scores.performance < THRESHOLD) {
  console.error(`FAIL: performance ${scores.performance} < ${THRESHOLD}`);
  process.exit(1);
}

console.log(`PASS: performance ${scores.performance} >= ${THRESHOLD}`);