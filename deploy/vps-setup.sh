#!/usr/bin/env bash
# Marketing AI Team — VPS one-shot setup (Ubuntu/Debian)
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/marketing}"
REPO_URL="${REPO_URL:-https://github.com/jaeyong-planner/marketing-ai-team.git}"

echo "[1/5] System packages"
sudo apt-get update -qq
sudo apt-get install -y -qq curl git ca-certificates

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y -qq nodejs
fi

echo "[2/5] App directory"
sudo mkdir -p "$APP_DIR"
if [ -n "$REPO_URL" ]; then
  sudo git clone "$REPO_URL" "$APP_DIR" || true
fi
cd "$APP_DIR"

echo "[3/5] Dependencies"
npm ci --omit=dev

echo "[4/5] Env check"
test -f .env || { echo "Copy .env.example to .env and fill keys"; exit 1; }

echo "[5/5] Start scheduler (PM2)"
if command -v pm2 >/dev/null 2>&1; then
  pm2 start deploy/ecosystem.config.cjs
  pm2 save
else
  npm install -g pm2
  pm2 start deploy/ecosystem.config.cjs
  pm2 save
  pm2 startup
fi

echo "Done. Logs: pm2 logs marketing-agent"