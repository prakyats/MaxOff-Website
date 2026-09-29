import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home page loads with one h1 and the primary action', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/MaxOff/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Request early access' })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
});

test('no horizontal scroll at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('skip link is the first focusable element and targets main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#main');
});

test('theme toggle switches the theme and remembers it', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const html = page.locator('html');

  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(html).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');

  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});

test('follows a light system preference when nothing is stored', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const background = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
  );
  expect(background).toBe('#fafafa');
  await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
});

test('nothing longer than 1 ms animates under prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  // Hovering starts whatever transitions exist; the reduced-motion rule caps them at 1 ms.
  await page.getByRole('button', { name: /switch to/i }).hover();
  const longAnimations = await page.evaluate(
    () =>
      document.getAnimations().filter((animation) => {
        const duration = animation.effect?.getTiming().duration;
        return typeof duration === 'number' && duration > 1;
      }).length,
  );
  expect(longAnimations).toBe(0);
});

test('unknown paths get the 404 page with a link home', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
});

for (const colorScheme of ['dark', 'light'] as const) {
  test(`axe finds no WCAG 2.2 AA violations (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
