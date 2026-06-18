/**
 * E2E: lead form submit → API → verify via admin API
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3002";

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
  const testEmail = `lead-${Date.now()}@example.com`;
  const testName = "Lead E2E";

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(
      `${BASE_URL}/?utm_source=e2e&utm_campaign=test-campaign`,
      { waitUntil: "networkidle" },
    );
    await page.fill('input[placeholder="홍길동"]', testName);
    await page.fill('input[placeholder="you@company.com"]', testEmail);
    await page.click('button[type="submit"]');
    await page.waitForSelector("text=신청이 완료", { timeout: 10000 });

    const admin = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const { data, error } = await admin
      .from("leads")
      .select("*")
      .eq("email", testEmail)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Lead not found in DB");
    if (data.utm_source !== "e2e") throw new Error("UTM source mismatch");

    console.log("PASS: Lead form E2E");
    console.log(`LEAD_ID=${data.id}`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});