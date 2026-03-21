import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('renders the login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /DUA Generator/i })).toBeVisible();
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.getByLabel(/username/i).fill('bad_user');
    await page.getByLabel(/password/i).fill('wrong_pass');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.locator('p[class*="errorMsg"]')).toBeVisible({ timeout: 5000 });
  });

  test('submit button is disabled while loading', async ({ page }) => {
    await page.getByLabel(/username/i).fill('user');
    await page.getByLabel(/password/i).fill('pass');

    // Intercept auth to slow it down
    await page.route('**/oauth2/token', async (route) => {
      await new Promise((r) => setTimeout(r, 2000));
      await route.fulfill({ status: 401, body: JSON.stringify({ error: 'Unauthorized' }) });
    });

    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });
});
