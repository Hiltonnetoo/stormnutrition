import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Synthetic, versioned configuration for the Firebase emulators. In the
// "emulator" mode (dev:emulated, E2E) and in unit tests, env files are read
// ONLY from this directory, so a personal .env.local (real project, e-mail
// keys) can never leak into tests or the local demo.
const EMULATOR_ENV_DIR = path.resolve(__dirname, 'config/emulator');

export default defineConfig(({ mode }) => {
    const isolated = mode === 'emulator' || mode === 'test';
    return {
      envDir: isolated ? EMULATOR_ENV_DIR : __dirname,
      server: {
        port: 5000,
        host: 'localhost',
      },
      plugins: [tailwindcss(), react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@assets': path.resolve(__dirname, 'attached_assets'),
        }
      },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        exclude: ['**/node_modules/**', '**/dist/**', '**/tests-e2e/**', '**/tests-rules/**', '**/tests-perf/**'],
        coverage: {
          provider: 'v8' as const,
          reporter: ['text', 'text-summary', 'html', 'lcov'],
          reportsDirectory: './coverage',
          // Focus coverage on the domain logic and components we test; skip
          // generated data, type-only files, configs and the test scaffolding.
          include: ['src/**/*.{ts,tsx}'],
          exclude: [
            'src/**/*.test.{ts,tsx}',
            'src/**/__tests__/**',
            'src/test/**',
            'src/types/**',
            'src/data/**',
            'src/i18n.ts',
            'src/main.tsx',
            'src/index.tsx',
            'src/mountApp.tsx',
            'src/vite-env.d.ts',
          ],
          thresholds: {
            'src/services/metabolicCalculations.ts': {
              lines: 95,
              functions: 95,
              branches: 95,
              statements: 95,
            },
            'src/services/dietAlgorithmService.ts': {
              lines: 85,
              functions: 85,
              branches: 70,
              statements: 85,
            },
            'src/services/billingService.ts': {
              lines: 95,
              functions: 95,
              branches: 85,
              statements: 95,
            },
            'src/utils/validation.ts': {
              lines: 85,
              functions: 95,
              branches: 70,
              statements: 85,
            },
            'src/utils/dateTime.ts': {
              lines: 90,
              functions: 95,
              branches: 75,
              statements: 85,
            },
          },
        },
      }
    };
});
