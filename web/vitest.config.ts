import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': import.meta.dirname },
  },
  test: {
    environment: 'jsdom',
    environmentOptions: {
      // window.requestAnimationFrame must exist — the count-up animations use it
      jsdom: { pretendToBeVisual: true },
    },
    setupFiles: ['./tests/setup.ts'],
    // forks pool times out workers on WSL/DrvFS — threads is stable here
    pool: 'threads',
    include: ['tests/unit/**/*.test.{ts,tsx}', 'tests/integration/**/*.test.{ts,tsx}', 'tests/a11y/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // the units this slice owns — app/ server files are exercised by e2e
      include: ['components/**/*.tsx', 'lib/**/*.ts'],
      exclude: ['components/atoms/index.ts', 'lib/mock-data.ts'],
      thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
    },
  },
})
