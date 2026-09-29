import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const baseURL = `http://127.0.0.1:${PORT}`;

// Some sandboxes provide a Chromium build at a fixed path; CI installs Playwright's own.
const executablePath = process.env['PLAYWRIGHT_CHROMIUM_EXECUTABLE'];
const isCI = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['list']] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  // Serves the last `astro build`. Run `pnpm build` (or `pnpm check`) first, or use `pnpm test`.
  // Astro is started through node directly, not `pnpm exec`: pnpm's wrapper puts the server in
  // its own process group, so Playwright cannot stop it and hangs on shutdown. `--ignore-lock`
  // keeps Astro 7's preview in the foreground; without it, preview detaches into a background
  // daemon when it detects an agent environment and Playwright sees an early exit.
  webServer: {
    command: `node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1 --port ${PORT} --ignore-lock`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
});
