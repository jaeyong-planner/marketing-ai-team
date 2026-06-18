/**
 * VPS 배포 전 로컬 체크리스트.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv } from "./lib/load-env.mjs";

const REQUIRED_FILES = [
  "scripts/agent-scheduler.mjs",
  "scripts/lib/agent-cycle.mjs",
  "content/topics.json",
  "docker-compose.yml",
  "deploy/Dockerfile.agent",
  "deploy/ecosystem.config.cjs",
  "deploy/marketing-agent.service",
  "docs/vps-deploy.md",
];

function main() {
  const env = loadEnv();
  const missingEnv = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"].filter(
    (k) => !env[k],
  );
  const missingFiles = REQUIRED_FILES.filter((f) => !existsSync(resolve(process.cwd(), f)));

  const topics = JSON.parse(
    readFileSync(resolve(process.cwd(), "content/topics.json"), "utf8"),
  );
  const topicCount = topics.topics?.length ?? 0;

  const checks = [
    [missingEnv.length === 0, `env keys: ${missingEnv.join(", ") || "ok"}`],
    [missingFiles.length === 0, `files: ${missingFiles.join(", ") || "ok"}`],
    [topicCount >= 10, `topics >= 10 (got ${topicCount})`],
  ];

  const failed = checks.filter(([ok]) => !ok);
  if (failed.length > 0) {
    throw new Error(failed.map(([, m]) => m).join("; "));
  }

  console.log("PASS: VPS readiness verified");
  console.log(JSON.stringify({ topicCount, scheduler: "agent-scheduler.mjs" }, null, 2));
}

main();