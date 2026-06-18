/**
 * Create GitHub repo and push (requires gh auth login).
 * Usage: node scripts/create-github-repo.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const REPO_NAME = process.env.GH_REPO_NAME ?? "marketing-ai-team";
const GH = process.env.GH_BIN ?? findGh();

function findGh() {
  const candidates = [
    "gh",
    resolve(process.env.USERPROFILE ?? "", "tools/gh/bin/gh.exe"),
  ];
  for (const c of candidates) {
    const r = spawnSync(c, ["--version"], { encoding: "utf8" });
    if (r.status === 0) return c;
  }
  return "gh";
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8", stdio: "pipe" });
  if (r.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} → ${r.stderr || r.stdout}`);
  }
  return (r.stdout || "").trim();
}

function main() {
  const auth = spawnSync(GH, ["auth", "status"], { encoding: "utf8" });
  if (auth.status !== 0) {
    console.error("FAIL: gh not authenticated. Run:");
    console.error(`  ${GH} auth login`);
    process.exit(1);
  }

  const remotes = spawnSync("git", ["remote"], { encoding: "utf8" });
  if (!(remotes.stdout || "").includes("origin")) {
    run(GH, [
      "repo",
      "create",
      REPO_NAME,
      "--public",
      "--source=.",
      "--remote=origin",
      "--description=24h AI Marketing Team — Next.js + Supabase + VPS agents",
      "--push",
    ]);
    console.log(`PASS: created and pushed https://github.com/${guessUser()}/${REPO_NAME}`);
    return;
  }

  run("git", ["push", "-u", "origin", "master"]);
  console.log("PASS: pushed to existing origin");
}

function guessUser() {
  try {
    return run(GH, ["api", "user", "-q", ".login"]);
  } catch {
    return "YOUR_USER";
  }
}

main();