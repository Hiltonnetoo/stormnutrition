import path from "path";
import { defineConfig } from "vitest/config";

// Dedicated config for the Firestore security-rules tests. These run against
// the Firestore emulator (via `npm run test:rules`), NOT in the normal unit
// test run — that's why the main vite.config excludes `tests-rules/`.
export default defineConfig({
  // Same synthetic emulator configuration as the app (config/emulator/.env);
  // never the personal .env.local.
  envDir: path.resolve(__dirname, "config/emulator"),
  test: {
    include: ["tests-rules/**/*.test.ts"],
    environment: "node",
    globals: true,
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});
