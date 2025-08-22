import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.UI_BASE_URL ?? 'http://localhost:5173';   // Vite dev
const API_URL = process.env.API_BASE_URL ?? 'http://localhost:2000';  // Express API

export default defineConfig({
    testDir: './tests',
    /* Global timeouts */
    timeout: 30_000,
    expect: { timeout: 7_000 },
    /* Where to save artifacts */
    outputDir: 'test-results',
    /* Base config for all tests */
    use: {
        baseURL: BASE_URL,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        extraHTTPHeaders: {
            // Just an example — not required, but useful if you want to tag requests
            'x-test-suite': 'playwright'
        }
    },
    /* Two browser projects */
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium', launchOptions: { slowMo: 1000 } }, // 1000ms = 1s delay per action
        },
        {
            name: 'firefox',
            use: { browserName: 'firefox', launchOptions: { slowMo: 1000 } },
        },
    ],
    /* Useful envs to pass to tests */
    metadata: {
        API_URL
    },
    /* If you later want to start servers automatically, you can add webServer here */
    // webServer: [
    //   { command: 'npm run dev', cwd: '../server', port: 2000, reuseExistingServer: true },
    //   { command: 'npm run dev', cwd: '../client', port: 5173, reuseExistingServer: true }
    // ],
});

