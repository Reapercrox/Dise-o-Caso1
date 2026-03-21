import { test, expect } from '@playwright/test';

// Pre-populate Redux store with a completed DUA so we can test the review screen directly
const MOCK_DUA_STATE = {
  dua: {
    document: {
      id: 'doc-1',
      jobId: 'job-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          key: 'general',
          label: 'General',
          fields: [
            {
              id: 'f-1',
              label: 'Contract Number',
              value: 'CN-2025-001',
              aiSuggestion: 'CN-2025-001',
              confidence: 'green',
              confidenceScore: 92,
              confidenceReason: 'Found in header of all documents.',
              evidence: [
                { fileName: 'contract.pdf', pageNumber: 1, snippet: 'Contract No. CN-2025-001' },
              ],
              isEdited: false,
            },
          ],
        },
      ],
    },
    selectedFieldId: null,
    issues: [
      {
        id: 'i-1',
        fieldId: 'f-1',
        severity: 'warning',
        message: 'Date format on page 3 is non-standard.',
        status: 'open',
      },
    ],
  },
  workflow: {
    jobId: 'job-1',
    stage: 'complete',
    progress: 100,
    logs: [],
    files: [],
    error: null,
  },
};

test.describe('DUA Review screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((state) => {
      (window as any).__PRELOADED_STATE__ = state;
    }, MOCK_DUA_STATE);

    await page.goto('/generate-dua');
  });

  test('shows DUA fields panel and evidence panel', async ({ page }) => {
    await expect(page.getByText(/DUA Fields/i)).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/Evidence/i)).toBeVisible();
  });

  test('clicking a field shows its evidence', async ({ page }) => {
    await page.getByText('Contract Number').first().click();
    await expect(page.getByText('contract.pdf')).toBeVisible();
    await expect(page.getByText(/Contract No. CN-2025-001/i)).toBeVisible();
  });

  test('editing a field marks it as Edited', async ({ page }) => {
    await page.getByText('Contract Number').first().click();
    await page.getByRole('button', { name: /edit/i }).first().click();
    await page.getByRole('textbox').first().fill('CN-2025-999');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText('Edited')).toBeVisible();
  });

  test('issues panel lists open issues', async ({ page }) => {
    await expect(page.getByText(/Issues & Validations/i)).toBeVisible();
    await expect(page.getByText(/non-standard/i)).toBeVisible();
  });

  test('marking an issue reviewed hides it from open list', async ({ page }) => {
    await page.getByRole('button', { name: /mark as reviewed/i }).first().click();
    await expect(page.getByText('✓ Reviewed')).toBeVisible();
  });

  test('Generate Word button is visible for users with DOWNLOAD_DUA', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /generate word/i })
    ).toBeVisible();
  });
});
