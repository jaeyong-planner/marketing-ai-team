/**
 * E2E: UI signup → admin (no admin seed)
 */
import { chromium } from "playwright";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3002";
const testEmail = `signup-ui-${Date.now()}@example.com`;
const testPassword = "TestPass123!";
const testName = "UI Signup User";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(`${BASE_URL}/signup`, { waitUntil: "networkidle" });
    await page.fill('input[name="fullName"]', testName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/, { timeout: 20000 });

    const text = await page.textContent("main");
    if (!text?.includes("Dashboard") && !text?.includes("안녕하세요")) {
      throw new Error("Admin page not rendered after signup");
    }

    console.log("PASS: UI signup → admin");
    console.log(`TEST_EMAIL=${testEmail}`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});