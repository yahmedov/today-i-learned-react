// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Today I Learned app', () => {
  test.beforeEach(async ({ page }) => await page.goto('/'));

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Today I Learned/);
  });

  test('shows facts list', async ({ page }) => {
    await expect(page.locator('.facts-list')).toBeVisible();
  });

  test('shows category filter', async ({ page }) => {
    const categoryFilters = page.locator('.category button');
    await expect(categoryFilters).toHaveCount(9);
  });
});
