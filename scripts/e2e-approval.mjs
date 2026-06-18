/**
 * E2E: agent run → approve → publish; pending publish blocked
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

async function seedAdmin(env, email, password) {
  const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Approval E2E", role: "admin" },
  });
}

async function main() {
  const env = loadEnvLocal();
  const email = `approval-e2e-${Date.now()}@example.com`;
  const password = "TestPass123!";
  await seedAdmin(env, email, password);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("[1/7] Login");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/, { timeout: 20000 });

    console.log("[2/7] Run agent pipeline");
    await page.fill('input[placeholder="콘텐츠 주제 입력"]', "E2E 승인 게이트 테스트");
    const runResponse = page.waitForResponse(
      (r) => r.url().includes("/api/agents/run") && r.request().method() === "POST",
    );
    await page.click('button:has-text("에이전트 실행")');
    const response = await runResponse;
    const payload = await response.json();
    if (!response.ok()) {
      throw new Error(`Agent run failed (${response.status()}): ${payload.error ?? "unknown"}`);
    }
    await page.waitForSelector(`text=생성됨: ${payload.title}`, { timeout: 10000 });

    console.log("[3/7] Open approvals");
    await page.goto(`${BASE_URL}/admin/approvals`, { waitUntil: "networkidle" });
    await page.waitForSelector("text=E2E 승인 게이트", { timeout: 10000 });

    console.log("[4/7] Publish blocked before approve");
    const contentId = await page.locator("article").first().getAttribute("data-id");
    // fetch pending content id from API via service role
    const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: pending } = await admin
      .from("content_calendar")
      .select("id")
      .eq("status", "pending_review")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!pending) throw new Error("No pending content");

    const blocked = await page.evaluate(
      async (id) => {
        const r = await fetch(`/api/content/${id}/publish`, { method: "POST" });
        const j = await r.json();
        return { status: r.status, error: j.error };
      },
      pending.id,
    );
    if (blocked.status !== 403) {
      throw new Error(`Expected 403, got ${blocked.status}: ${blocked.error}`);
    }
    console.log("PASS: publish blocked before approve");

    console.log("[5/7] Approve");
    await page.click('button:has-text("승인")');
    await page.waitForTimeout(2000);

    console.log("[6/7] Verify approved in DB");
    const { data: approved } = await admin
      .from("content_calendar")
      .select("status")
      .eq("id", pending.id)
      .single();
    if (approved?.status !== "approved") {
      throw new Error(`Expected approved, got ${approved?.status}`);
    }

    console.log("[7/7] Publish after approve");
    const pub = await page.evaluate(async (id) => {
      const r = await fetch(`/api/content/${id}/publish`, { method: "POST" });
      return { status: r.status, body: await r.json() };
    }, pending.id);
    if (pub.status !== 200) throw new Error(`Publish failed: ${JSON.stringify(pub)}`);

    const { count } = await admin
      .from("agent_runs")
      .select("*", { count: "exact", head: true });
    if ((count ?? 0) < 2) throw new Error("Expected 2+ agent_runs");

    console.log("PASS: Approval E2E complete");
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});