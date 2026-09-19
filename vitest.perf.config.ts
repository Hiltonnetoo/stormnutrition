import path from "path";
import { defineConfig } from "vitest/config";

// Query-cost benchmark (Etapa 14). Runs against the Firestore emulator via
// `npm run test:perf:queries`; kept out of the unit and rules suites because it
// seeds a larger synthetic workspace and reports metrics.
export default defineConfig({
  // Same synthetic emulator configuration as the app (config/emulator/.env);
  // never the personal .env.local.
  envDir: path.resolve(__dirname, "config/emulator"),
  test: {
    include: ["tests-perf/**/*.test.ts"],
    environment: "node",
    globals: true,
    fileParallelism: false,
    testTimeout: 60000,
    hookTimeout: 180000,
  },
});
