/**
 * Production smoke test (no auth seed).
 */
const BASE = process.env.PROD_URL ?? "https://marketing-ai-team-ten.vercel.app";

const paths = ["/", "/login", "/signup"];

async function main() {
  for (const path of paths) {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) throw new Error(`${path} → ${res.status}`);
    console.log(`OK: ${path} → ${res.status}`);
  }

  const lead = await fetch(`${BASE}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `smoke-${Date.now()}@example.com`,
      name: "Smoke Test",
      source: "smoke",
      website: "",
    }),
  });
  if (!lead.ok) {
    const text = await lead.text();
    throw new Error(`POST /api/leads → ${lead.status} ${text.slice(0, 120)}`);
  }
  console.log("OK: POST /api/leads → 201");
  console.log("PASS: production smoke");
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});