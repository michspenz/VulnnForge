import { config } from './config.js';
import { createApp } from './app.js';
import { syncChallengesFromDisk } from './modules/challenges/challenge-loader.js';

async function main() {
  await syncChallengesFromDisk();

  const app = createApp();

  app.listen(config.PORT, () => {
    console.log(`🔥 VulnForge API listening on port ${config.PORT} [${config.NODE_ENV}]`);
  });
}

main().catch((err) => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});
