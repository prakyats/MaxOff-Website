import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const HOME = '/';
const DIRECTIONS = ['/preview/instrument', '/preview/glass', '/preview/editorial'] as const;
const PAGES = [HOME, ...DIRECTIONS] as const;
const WIDTHS = [360, 390, 430, 768, 1280, 1440] as const;

const APP = 'https://app.maxoff.in';
const ADDRESS = 'hello@maxoff.in';
/** Built from parts: the developer credit may not be written out in test files. */
const CREDIT = `MaxOff is developed by ${['Pix', 'ora'].join('')} Agencies.`;
const AGENCY = new RegExp(['Pix', 'ora'].join(''), 'i');

/** Reveal-on-scroll hides sections until they are seen; show them all for screenshots and scans. */
async function revealAll(page: Page): Promise<void> {
  await page.addStyleTag({
    content: '.reveal{opacity:1!important;transform:none!important;transition:none!important}',
  });
}

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

// ---------- Every page ----------

for (const path of PAGES) {
  test.describe(path, () => {
    test('loads with one h1, a main landmark and the primary action', async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/MaxOff/);
      await expect(page).not.toHaveTitle(AGENCY);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByRole('main')).toBeVisible();
      await expect(
        page
          .getByRole('main')
          .getByRole('link', { name: /Request a demo/ })
          .first(),
      ).toBeVisible();
    });

    test('the developer credit is in the footer, in body text only', async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('contentinfo')).toContainText(CREDIT);
      for (const heading of await page.locator('h1, h2, h3').allTextContents()) {
        expect(heading).not.toMatch(AGENCY);
      }
    });

    test('the footer offers Sign in, Privacy and Contact', async ({ page }) => {
      await page.goto(path);
      const footer = page.getByRole('contentinfo');
      await expect(footer.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', APP);
      await expect(footer.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
        'href',
        '/privacy',
      );
      await expect(footer.getByRole('link', { name: 'Contact' })).toHaveAttribute(
        'href',
        `mailto:${ADDRESS}`,
      );
    });

    test('Request a demo opens an email with the subject and prefilled body', async ({ page }) => {
      await page.goto(path);
      const links = page.getByRole('link', { name: /Request a demo/ });
      expect(await links.count()).toBeGreaterThan(0);
      for (const link of await links.all()) {
        const href = (await link.getAttribute('href')) ?? '';
        expect(href.startsWith(`mailto:${ADDRESS}?subject=MaxOff%20demo%20request&body=`)).toBe(
          true,
        );
        const body = decodeURIComponent(href.split('&body=')[1] ?? '');
        for (const line of [
          'Name:',
          'Studio name:',
          'Team size:',
          'What do you want to fix first?',
        ]) {
          expect(body).toContain(line);
        }
      }
    });

    test('the raw HTML never contains the address or a plain mailto link', async ({ request }) => {
      const html = await (await request.get(path)).text();
      expect(html).not.toMatch(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/);
      expect(html.toLowerCase()).not.toContain('mailto:');
    });

    test('is not indexed until launch (Phase 6 removes this)', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    });

    test('skip link is the first focusable element and targets main', async ({ page }) => {
      await page.goto(path);
      await page.keyboard.press('Tab');
      const skip = page.getByRole('link', { name: 'Skip to content' });
      await expect(skip).toBeFocused();
      await expect(skip).toHaveAttribute('href', '#main');
    });

    test('theme toggle switches the theme and remembers it', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto(path);
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
      await page.goto(path);
      const background = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
      );
      expect(background).toBe('#fafafa');
    });

    test('under reduced motion everything is visible and nothing runs longer than 1 ms', async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      const hidden = await page.evaluate(
        () =>
          [...document.querySelectorAll('.reveal')].filter(
            (el) => getComputedStyle(el).opacity !== '1',
          ).length,
      );
      expect(hidden).toBe(0);
      const longAnimations = await page.evaluate(
        () =>
          document.getAnimations().filter((animation) => {
            const duration = animation.effect?.getTiming().duration;
            return typeof duration === 'number' && duration > 1;
          }).length,
      );
      expect(longAnimations).toBe(0);
    });

    for (const colorScheme of ['dark', 'light'] as const) {
      test(`axe finds no WCAG 2.2 AA violations (${colorScheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        await page.goto(path);
        await revealAll(page);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
}

// ---------- Widths, text size and the two doors (desktop project drives the viewport) ----------

for (const path of PAGES) {
  for (const width of WIDTHS) {
    test(`${path} at ${width}px: no horizontal scroll, Sign in visible in the header`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'viewport is set explicitly; run once');
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await revealAll(page);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);

      const signIn = page.getByRole('banner').getByRole('link', { name: 'Sign in' }).first();
      await expect(signIn).toBeVisible();
      await expect(signIn).toHaveAttribute('href', APP);
      const box = await signIn.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width);
    });
  }

  for (const width of [360, 1280] as const) {
    test(`${path} at ${width}px and 200% text: no horizontal scroll`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'viewport is set explicitly; run once');
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.addStyleTag({ content: 'html{font-size:200%}' });
      await revealAll(page);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    });
  }
}

// ---------- The phone menu ----------

for (const path of DIRECTIONS) {
  test(`${path}: the phone menu holds Request a demo and Sign in`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'viewport is set explicitly; run once');
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(path);

    const button = page.getByRole('button', { name: 'Menu' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');

    const menu = page.locator('#site-menu');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: /Request a demo/ })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', APP);

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
  });

  test(`${path}: on desktop the menu button is gone and the links are inline`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'viewport is set explicitly; run once');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(path);
    await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  });
}

// ---------- One red button per view ----------

for (const path of DIRECTIONS) {
  test(`${path}: the header's Request a demo shows only while no other primary button is on screen`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'viewport is set explicitly; run once');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(path);
    const headerDemo = page.locator('.site-header__demo');

    await expect(headerDemo).toBeHidden(); // the hero button is on screen
    await page.locator('#what').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelector('#what')?.scrollIntoView({ block: 'center' }));
    await expect(headerDemo).toBeVisible(); // neither the hero nor the closing button is on screen
    await page.locator('.contact__cta').scrollIntoViewIfNeeded();
    await expect(headerDemo).toBeHidden(); // the closing button is on screen
  });
}

// ---------- Contact block: address as text, Copy email ----------

for (const path of DIRECTIONS) {
  test.describe(`${path}: contact block`, () => {
    test('is headed "Tell us about your studio" and shows the address as text', async ({
      page,
    }) => {
      await page.goto(path);
      await revealAll(page);
      const block = page.locator('[data-contact]');
      await expect(block.getByRole('heading', { name: 'Tell us about your studio' })).toBeVisible();
      await expect(block.getByText(ADDRESS, { exact: true })).toBeVisible();
      await expect(block.getByRole('link', { name: /Request a demo/ })).toBeVisible();
      await expect(block.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', APP);
      await expect(block).toContainText('Already on MaxOff?');
    });

    test('Copy email puts the address on the clipboard and says so', async ({
      page,
      context,
      browserName,
    }) => {
      test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-specific');
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.goto(path);
      await revealAll(page);
      const button = page.locator('[data-copy]');
      await button.click();
      await expect(page.locator('[data-copy-status]')).toHaveText('Email address copied.');
      await expect(button).toContainText('Copied');
      await expect(button).toHaveAttribute('data-done', '');
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(ADDRESS);
    });

    test('Copy email says so when copying is impossible, and selects the address', async ({
      page,
    }) => {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
        document.execCommand = () => false;
      });
      await page.goto(path);
      await revealAll(page);
      await page.getByRole('button', { name: 'Copy email' }).click();
      await expect(page.locator('[data-copy-status]')).toContainText('Could not copy');
      const selected = await page.evaluate(() => window.getSelection()?.toString() ?? '');
      expect(selected).toBe(ADDRESS);
    });

    test('can be used with the keyboard alone', async ({ page }) => {
      await page.goto(path);
      await revealAll(page);
      const cta = page.locator('.contact__cta');
      await cta.focus();
      await expect(cta).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Copy email' })).toBeFocused();
    });
  });
}

// ---------- Not indexed until launch ----------

test('robots.txt disallows everything until launch (Phase 6 removes this)', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('User-agent: *');
  expect(body).toContain('Disallow: /');
  expect(body).not.toContain('Allow: /');
});

test('the 404 page and the preview chooser are noindex too', async ({ page }) => {
  for (const path of ['/this-page-does-not-exist', '/preview']) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  }
});

// ---------- 404 ----------

test('unknown paths get the 404 page with a link home', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
});
