/** PM2 ecosystem — VPS agent scheduler */
module.exports = {
  apps: [
    {
      name: "marketing-agent",
      script: "scripts/agent-scheduler.mjs",
      interpreter: "node",
      cwd: __dirname + "/..",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: "production",
        AGENT_MOCK: "true",
        AGENT_INTERVAL_MS: "14400000",
      },
    },
  ],
};