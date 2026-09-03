import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('smoke: local hotseat page loads', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForTimeout(1000);

  await expect(page.locator('text=Local Hotseat Game')).toBeVisible();
  await expect(page.locator('text=Create Online Game')).toBeVisible();
});
