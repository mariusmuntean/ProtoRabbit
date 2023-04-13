import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src',
  /* Run tests in files in parallel */
  fullyParallel: false,

  timeout: 30000,
  globalTimeout: 5400000,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'ProtoRabbit',
      use: {
        permissions: ['clipboard-read', 'clipboard-write']
      },
      metadata: {
        platform: process.platform,
        browserName: 'electron',
        channel: undefined,
        mode: 'default',
        video: false
      }
    }
  ]
})
