/**
 * E2E: admin user seed → login → admin → signout → protected redirect
 * Run: node scripts/e2e-auth.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3002";
const testEmail = process.env.E2E_EMAIL ?? `e2e-${Date.now()}@example.com`;
const testPassword = process.env.E2E_PASSWORD ?? "TestPass123!";
const testName = "E2E Tester";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  const content = readFileSync(envPath, "utf8");
  const env = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }

  return env;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function seedAdminUser(env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  assert(url, "NEXT_PUBLIC_SUPABASE_URL missing in .env.local");
  assert(serviceKey, "SUPABASE_SERVICE_ROLE_KEY missing in .env.local");

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: testName, role: "admin" },
    });

  if (createError) {
    if (createError.message.toLowerCase().includes("already")) {
      const { error: updateError } = await admin.auth.admin.updateUserById(
        (await admin.auth.admin.listUsers()).data.users.find(
          (u) => u.email === testEmail,
        )?.id ?? "",
        {
          password: testPassword,
          email_confirm: true,
          user_metadata: { full_name: testName, role: "admin" },
        },
      );
      assert(!updateError, `Failed to refresh existing user: ${updateError?.message}`);
      return;
    }
    throw new Error(`Failed to seed user: ${createError.message}`);
  }

  assert(created.user, "Admin user seed returned no user");
}

async function main() {
  const env = loadEnvLocal();
  await seedAdminUser(env);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("[1/5] Visit login");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });

    console.log("[2/5] Login with seeded account");
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/, { timeout: 20000 });

    console.log("[3/5] Verify admin dashboard");
    const adminText = await page.textContent("main");
    assert(
      adminText?.includes("Dashboard") || adminText?.includes("안녕하세요"),
      "Admin dashboard heading missing",
    );
    assert(
      adminText?.includes(testName) || adminText?.includes(testEmail),
      "User identity not shown on admin page",
    );

    console.log("[4/5] Sign out");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/login/, { timeout: 10000 });

    console.log("[5/5] Protected route redirects to login");
    await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle" });
    assert(page.url().includes("/login"), `Expected /login redirect, got ${page.url()}`);

    console.log("PASS: E2E auth flow completed");
    console.log(`TEST_EMAIL=${testEmail}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("FAIL:", error.message);
  process.exit(1);
});