import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('GenerateDUA — folder selection', () => {
  test.beforeEach(async ({ page }) => {
    // Inject a mock auth state so we skip the login screen
    await page.addInitScript(() => {
      // Stub sessionManager to return a mock user
      (window as any).__MOCK_AUTH__ = {
        id: 'u-1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER_AGENT',
        accessToken: 'mock-token',
        expiresAt: Date.now() + 3600 * 1000,
      };
    });

    await page.goto('/generate-dua');
  });

  test('shows select folder button and hero copy', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /DUA Generator/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /select folder/i })).toBeVisible();
  });

  test('Analyze button appears after files are attached', async ({ page }) => {
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByRole('button', { name: /select folder/i }).click(),
    ]);

    await fileChooser.setFiles([
      path.join(__dirname, '../fixtures/sample.pdf'),
    ]);

    await expect(page.getByRole('button', { name: /analyze/i })).toBeVisible();
    await expect(page.getByText(/detected files/i)).toBeVisible();
  });

  test('Clear button removes file list', async ({ page }) => {
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByRole('button', { name: /select folder/i }).click(),
    ]);

    await fileChooser.setFiles([
      path.join(__dirname, '../fixtures/sample.pdf'),
    ]);

    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.getByRole('button', { name: /analyze/i })).not.toBeVisible();
  });
});

test.describe('GenerateDUA — processing screen', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the job start endpoint
    await page.route('**/api/jobs/start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ jobId: 'test-job-1' }),
      });
    });

    // Mock the status polling endpoint
    await page.route('**/api/jobs/test-job-1/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ stage: 'ocr', log: 'OCR page 1/5…' }),
      });
    });

    await page.goto('/generate-dua');
  });

  test('shows stage progress bar during processing', async ({ page }) => {
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByRole('button', { name: /select folder/i }).click(),
    ]);
    await fileChooser.setFiles([
      path.join(__dirname, '../fixtures/sample.pdf'),
    ]);
    await page.getByRole('button', { name: /analyze/i }).click();

    // Processing screen should appear
    await expect(page.getByText(/processing your documents/i)).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
  });
});
