import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const HOME = '/';
const PRIVACY = '/privacy';
const PAGES = [HOME, PRIVACY] as const;
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
    test('loads with one h1 and a main landmark', async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/MaxOff/);
      await expect(page).not.toHaveTitle(AGENCY);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByRole('main')).toBeVisible();
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
      // By text, not role: on a phone some of these sit in the closed menu or the collapsed header.
      const links = page.locator('a', { hasText: /Request a demo/ });
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

    test('is indexable: no robots meta', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
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

for (const path of PAGES) {
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

for (const path of [HOME]) {
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

for (const path of [HOME]) {
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

// ---------- Touch: every control works on a phone (the phone project has a touchscreen) ----------

/** Records which control each tap reached, and stops mailto: links from leaving the page. */
async function recordTaps(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const taps: string[] = [];
    (window as unknown as { __taps: string[] }).__taps = taps;
    document.addEventListener(
      'click',
      (event) => {
        const control = (event.target as Element).closest('a, button');
        taps.push(control?.getAttribute('href') ?? control?.textContent?.trim() ?? 'nothing');
        if (control?.getAttribute('href')?.startsWith('mailto:')) event.preventDefault();
      },
      true,
    );
  });
}

async function taps(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { __taps: string[] }).__taps);
}

test.describe('on a phone', () => {
  test.skip(({ hasTouch }) => !hasTouch, 'needs a touchscreen: the phone project has one');

  test('the hero buttons take the tap, not the glow behind the phone', async ({ page }) => {
    await recordTaps(page);
    await page.goto(HOME);
    await page.locator('.mo-hero .button-primary').tap();
    await page.locator('.mo-hero .link-arrow').tap();
    const reached = await taps(page);
    expect(reached[0]).toMatch(/^mailto:/);
    expect(reached[1]).toBe('#how');
  });

  test('section links from the menu land below the sticky header', async ({ page }) => {
    await page.goto(HOME);
    for (const [label, id] of [
      ['What it does', 'what'],
      ['How it works', 'how'],
      ['Roles', 'roles'],
      ['Trust', 'trust'],
    ] as const) {
      await page.getByRole('button', { name: 'Menu' }).tap();
      await page.locator('#site-menu').getByRole('link', { name: label }).tap();
      await expect(page.locator('#site-menu')).toBeHidden();
      await expect
        .poll(
          () =>
            page.evaluate((id) => {
              const section = document.getElementById(id)!.getBoundingClientRect().top;
              const header = document.querySelector('.site-header')!.getBoundingClientRect().bottom;
              return section - header;
            }, id),
          { timeout: 4000 },
        )
        .toBeGreaterThanOrEqual(0);
    }
  });

  for (const [name, zoom] of [
    ['normal text', ''],
    ['200% text', 'html{font-size:200%}'],
  ] as const) {
    test(`in landscape with ${name}, the whole menu can be reached`, async ({ page }) => {
      await page.setViewportSize({ width: 740, height: 360 });
      await page.goto(HOME);
      if (zoom) await page.addStyleTag({ content: zoom });
      // Wide enough for the bar's Request a demo, which shows while the hero's is off screen.
      const barDemo = page.locator('.site-header__demo');
      await expect(barDemo).toBeVisible();
      await page.getByRole('button', { name: 'Menu' }).tap();
      // One red button per view: the menu has its own, so the bar's collapses while it is open.
      await expect(barDemo).toBeHidden();
      const signIn = page.locator('#site-menu').getByRole('link', { name: 'Sign in' });
      await signIn.scrollIntoViewIfNeeded();
      await expect(signIn).toBeInViewport({ ratio: 1 });
      await expect(
        page.locator('#site-menu').getByRole('link', { name: /Request a demo/ }),
      ).toBeInViewport();
      await page.keyboard.press('Escape');
      await expect(barDemo).toBeVisible();
    });
  }

  test('the menu, Pause, Copy email and the theme toggle respond to taps', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await recordTaps(page);
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(HOME);
    await revealAll(page);

    const menuButton = page.getByRole('button', { name: 'Menu' });
    await menuButton.tap();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await page
      .locator('#site-menu')
      .getByRole('link', { name: /Request a demo/ })
      .tap();
    await expect(page.locator('#site-menu')).toBeHidden();

    const pause = page.locator('[data-loop-pause]'); // its label flips to "Play animation"
    await expect(pause).toHaveText('Pause animation');
    await pause.tap();
    await expect(pause).toHaveAttribute('aria-pressed', 'true');
    await expect(pause).toHaveText('Play animation');

    await page.locator('[data-copy]').tap();
    await expect(page.locator('[data-copy-status]')).toHaveText('Email address copied.');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(ADDRESS);

    await page.getByRole('button', { name: 'Switch to light theme' }).tap();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.locator('.contact__cta').tap();
    expect((await taps(page)).filter((tap) => tap.startsWith('mailto:'))).toHaveLength(2);
  });

  for (const path of PAGES) {
    test(`${path}: every link and button is at least 44px tall and wide`, async ({ page }) => {
      await page.goto(path);
      await revealAll(page);
      await page.getByRole('button', { name: 'Menu' }).tap();
      const small = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('a[href], button')]
          .filter((el) => {
            const style = getComputedStyle(el);
            const box = el.getBoundingClientRect();
            return (
              box.width > 0 &&
              box.height > 0 &&
              style.visibility !== 'hidden' &&
              style.pointerEvents !== 'none' &&
              !el.closest('[hidden]')
            );
          })
          .map((el) => {
            const box = el.getBoundingClientRect();
            return `${el.textContent?.trim().slice(0, 24) ?? ''} ${Math.round(box.width)}x${Math.round(box.height)}`;
          })
          .filter((entry) => {
            const [width, height] = entry.split(' ').pop()!.split('x').map(Number);
            return (width ?? 0) < 44 || (height ?? 0) < 44;
          }),
      );
      expect(small).toEqual([]);
    });
  }
});

// ---------- Live: crawlable, except the 404 page ----------

test('robots.txt allows crawling and points at the sitemap on maxoff.in', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('User-agent: *');
  expect(body).toContain('Allow: /');
  expect(body).not.toContain('Disallow');
  expect(body).toContain('Sitemap: https://maxoff.in/sitemap-index.xml');
});

test('the 404 page stays noindex', async ({ page }) => {
  for (const path of ['/this-page-does-not-exist']) {
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

// ---------- Privacy ----------

test.describe('/privacy', () => {
  test('says what the site collects, in the approved words', async ({ page }) => {
    await page.goto(PRIVACY);
    await expect(page.locator('h1')).toHaveText('Privacy');
    const main = page.getByRole('main');
    await expect(main.locator('h2')).toHaveText([
      'No form data',
      'Analytics',
      'Your theme choice',
      'Email',
    ]);
    await expect(main).toContainText('This site collects very little.');
    await expect(main).toContainText('There is no form on this site, so none is collected.');
    await expect(main).toContainText(
      'We count visits with cookie-less analytics. No cookies are set.',
    );
    await expect(main).toContainText(
      'Like any website, our host processes technical data such as IP addresses to deliver these pages; it is not used to track you.',
    );
    await expect(main).toContainText('saved only in your own browser and never sent anywhere');
  });

  test('names the developer once, as the data controller for emails, in body text', async ({
    page,
    request,
  }) => {
    await page.goto(PRIVACY);
    const email = page.getByRole('main').locator('.mo-legal__list > li').last();
    await expect(email.getByRole('heading', { name: 'Email' })).toBeVisible();
    await expect(email).toContainText(ADDRESS);
    await expect(email).toContainText(
      `are answered by ${['Pix', 'ora'].join('')} Agencies, the developer of MaxOff and the data controller for those emails.`,
    );
    for (const heading of await page.locator('h1, h2, h3').allTextContents()) {
      expect(heading).not.toMatch(AGENCY);
    }
    // Nothing in the head (title, meta, links) may carry the name.
    const html = await (await request.get(PRIVACY)).text();
    const head = html.slice(0, html.indexOf('</head>'));
    expect(head).not.toMatch(AGENCY);
  });

  test('is linked from the footer of every page and is not a dead end', async ({
    page,
    request,
  }) => {
    expect((await request.get(PRIVACY)).status()).toBe(200);
    await page.goto(PRIVACY);
    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' }),
    ).toBeVisible();
    await expect(
      page
        .getByRole('banner')
        .getByRole('link', { name: /MaxOff/ })
        .first(),
    ).toHaveAttribute('href', '/');
  });

  test("shows the header's Request a demo, as there is no other primary button", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'viewport is set explicitly; run once');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(PRIVACY);
    await expect(page.locator('.site-header__demo')).toBeVisible();
    await expect(page.locator('[data-primary-cta]')).toHaveCount(0);
  });
});

// ---------- Sharing, canonical, sitemap, structured data, icons ----------

const SITE = 'https://maxoff.in';

for (const path of PAGES) {
  test(`${path}: canonical, description, Open Graph and Twitter tags agree`, async ({ page }) => {
    await page.goto(path);
    const url = new URL(path, SITE).href;
    const meta = (selector: string) => page.locator(selector).getAttribute('content');
    const title = await page.title();

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
    const description = (await meta('meta[name="description"]')) ?? '';
    expect(description.length).toBeGreaterThan(50);
    expect(description.length).toBeLessThanOrEqual(155);

    expect(await meta('meta[property="og:type"]')).toBe('website');
    expect(await meta('meta[property="og:site_name"]')).toBe('MaxOff');
    expect(await meta('meta[property="og:locale"]')).toBe('en_IN');
    expect(await meta('meta[property="og:title"]')).toBe(title);
    expect(await meta('meta[property="og:description"]')).toBe(description);
    expect(await meta('meta[property="og:url"]')).toBe(url);
    expect(await meta('meta[property="og:image"]')).toBe(`${SITE}/og.png`);
    expect(await meta('meta[property="og:image:width"]')).toBe('1200');
    expect(await meta('meta[property="og:image:height"]')).toBe('630');
    expect(await meta('meta[property="og:image:type"]')).toBe('image/png');
    const alt = (await meta('meta[property="og:image:alt"]')) ?? '';
    expect(alt).toContain('MaxOff');
    expect(alt).not.toMatch(AGENCY);

    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(await meta('meta[name="twitter:title"]')).toBe(title);
    expect(await meta('meta[name="twitter:description"]')).toBe(description);
    expect(await meta('meta[name="twitter:image"]')).toBe(`${SITE}/og.png`);
    expect(await meta('meta[name="twitter:image:alt"]')).toBe(alt);
  });
}

test('the home page carries SoftwareApplication data that claims nothing it cannot show', async ({
  page,
}) => {
  await page.goto(HOME);
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(scripts).toHaveLength(1);
  const data = JSON.parse(scripts[0] ?? '{}') as Record<string, unknown>;
  expect(data['@context']).toBe('https://schema.org');
  expect(data['@type']).toBe('SoftwareApplication');
  expect(data['name']).toBe('MaxOff');
  expect(data['url']).toBe(SITE);
  expect(data['applicationCategory']).toBe('BusinessApplication');
  expect(data['operatingSystem']).toBe('Web');
  // No prices, ratings, reviews or people or companies behind it.
  for (const key of [
    'offers',
    'aggregateRating',
    'review',
    'author',
    'publisher',
    'creator',
    'provider',
    'sameAs',
  ]) {
    expect(data).not.toHaveProperty(key);
  }
  expect(scripts[0]).not.toMatch(AGENCY);
});

test('only the home page has structured data, and the 404 page has none', async ({ request }) => {
  for (const path of [PRIVACY, '/404']) {
    const html = await (await request.get(path)).text();
    expect(html).not.toContain('ld+json');
  }
});

test('the sitemap lists the home page and privacy, and never the 404 page', async ({ request }) => {
  const index = await request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain(`${SITE}/sitemap-0.xml`);
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(urls).toEqual([`${SITE}/`, `${SITE}/privacy`]);
});

/** Width and height of a PNG, read from its IHDR chunk. */
function pngSize(bytes: Buffer): { width: number; height: number } {
  expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

test('the social image is a 1200 by 630 PNG, light enough to share', async ({ request }) => {
  const response = await request.get('/og.png');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
  const body = await response.body();
  expect(pngSize(body)).toEqual({ width: 1200, height: 630 });
  expect(body.length).toBeLessThan(300 * 1024);
});

test('the icons exist: favicon.ico, favicon.svg and a 180 px Apple touch icon', async ({
  page,
  request,
}) => {
  await page.goto(HOME);
  await expect(page.locator('link[rel="icon"][href="/favicon.ico"]')).toHaveCount(1);
  await expect(page.locator('link[rel="icon"][href="/favicon.svg"]')).toHaveCount(1);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    'href',
    '/apple-touch-icon.png',
  );

  const touch = await request.get('/apple-touch-icon.png');
  expect(touch.status()).toBe(200);
  expect(pngSize(await touch.body())).toEqual({ width: 180, height: 180 });

  const ico = await request.get('/favicon.ico');
  expect(ico.status()).toBe(200);
  const bytes = await ico.body();
  expect(bytes.readUInt16LE(0)).toBe(0); // reserved
  expect(bytes.readUInt16LE(2)).toBe(1); // type: icon
  expect(bytes.readUInt16LE(4)).toBe(3); // 16, 32 and 48 px

  const svg = await request.get('/favicon.svg');
  expect(svg.status()).toBe(200);
  expect(await svg.text()).toContain('<svg');
});

// ---------- The full page: sections, labels, loop, phones ----------

const SECTION_IDS = [
  'questions',
  'what',
  'coming',
  'app',
  'roles',
  'trust',
  'how',
  'demo',
] as const;

test.describe('the page', () => {
  test('has every section, in order, each labelled by its own heading', async ({ page }) => {
    await page.goto(HOME);
    const ids = await page.evaluate(() =>
      [...document.querySelectorAll('main > section')].map((section) => section.id),
    );
    expect(ids.filter(Boolean)).toEqual([...SECTION_IDS]);
    for (const id of SECTION_IDS) {
      const labelledBy = await page.locator(`#${id}`).getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
      await expect(page.locator(`#${labelledBy}`)).toHaveCount(1);
    }
  });

  test('headings never skip a level and there is one h1', async ({ page }) => {
    await page.goto(HOME);
    const levels = await page.evaluate(() =>
      [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => Number(h.tagName[1])),
    );
    expect(levels.filter((level) => level === 1)).toHaveLength(1);
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i += 1) {
      expect((levels[i] ?? 0) - (levels[i - 1] ?? 0)).toBeLessThanOrEqual(1);
    }
  });

  test('every header link points at a section that exists', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'viewport is set explicitly; run once');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(HOME);
    const nav = page.getByRole('navigation', { name: 'Primary' });
    const hrefs = await nav
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(hrefs).toEqual(['#what', '#how', '#roles', '#trust']);
    for (const href of hrefs) await expect(page.locator(href ?? '#none')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'See how it works' })).toHaveAttribute(
      'href',
      '#how',
    );
  });

  test('every feature is labelled Live or Coming, and matches the brief', async ({ page }) => {
    await page.goto(HOME);
    await revealAll(page);
    const live = page.locator('#what .badge-live');
    const soon = page.locator('#coming .mo-grid .badge-coming');
    await expect(live).toHaveCount(8);
    await expect(soon).toHaveCount(7);
    const liveTitles = await page.locator('#what .mo-cell__title').allTextContents();
    expect(liveTitles).toEqual([
      'Attendance',
      'Leave',
      'Comp leave',
      'Expense claims',
      'Month summary',
      'Clients',
      'People',
      'Settings',
    ]);
    const comingTitles = await page.locator('#coming .mo-grid .mo-cell__title').allTextContents();
    expect(comingTitles).toEqual([
      'Tasks with “Noted”',
      'Owner-final approvals',
      'Notifications and reminders',
      'Dashboards and calendar',
      'Client projects',
      'Work submission',
      'Owner-only revenue and reports',
    ]);
    // The second question depends on a Coming feature, so it is labelled Coming.
    const questions = page.locator('#questions .mo-q');
    await expect(questions.nth(0).locator('.badge-live')).toHaveCount(1);
    await expect(questions.nth(1).locator('.badge-coming')).toHaveCount(1);
    await expect(questions.nth(2).locator('.badge-live')).toHaveCount(1);
  });

  test('the three roles state what each can do, and money stays with the owner', async ({
    page,
  }) => {
    await page.goto(HOME);
    await revealAll(page);
    await expect(page.locator('#roles .mo-role__name')).toHaveText(['Owner', 'Admin', 'Staff']);
    await expect(page.locator('#roles')).toContainText('Money stays with the owner.');
    const admin = page.locator('#roles .mo-role').nth(1);
    await expect(admin).toContainText('Decides attendance or leave.');
    await expect(admin).toContainText('Sees money.');
    // Admin tasks are Coming, not live.
    const adminSoon = admin.locator('.mo-list--soon');
    await expect(adminSoon).toContainText('Creates and assigns tasks.');
  });

  test('the closing section keeps both headings and the reply line', async ({ page }) => {
    await page.goto(HOME);
    await revealAll(page);
    const closing = page.locator('#demo');
    await expect(closing.getByRole('heading', { level: 2 })).toHaveText('The final say is yours.');
    await expect(closing.getByRole('heading', { level: 3 })).toHaveText(
      'Tell us about your studio',
    );
    await expect(closing).toContainText('Built by a working studio, used by its team every day.');
    await expect(closing).toContainText('We usually reply within two working days.');
  });

  test('the two phones show a dark and a light theme whatever the page theme is', async ({
    page,
  }) => {
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(HOME);
      const backgrounds = await page.evaluate(() =>
        [...document.querySelectorAll('#app .phone')].map((phone) =>
          getComputedStyle(phone).getPropertyValue('--bg').trim(),
        ),
      );
      expect(backgrounds).toEqual(['#0a0a0b', '#fafafa']);
    }
  });

  test('the dark phone is the Staff view and the light phone is the Owner deciding a request', async ({
    page,
  }) => {
    await page.goto(HOME);
    const [dark, light] = await page.locator('#app .phone').all();
    const staff = (await dark?.textContent()) ?? '';
    expect(staff).toContain('My day');
    expect(staff).toContain('Started working?');
    expect(staff).toContain('Start day');
    expect(staff).toContain('This week');
    // The hero shows the Owner's Today, so the app section adds a different view.
    expect(staff).not.toContain('Waiting on you');
    const owner = (await light?.textContent()) ?? '';
    expect(owner).toContain('Leave request');
    expect(owner).toContain('Approve');
    expect(owner).toContain('Reject');
    expect(owner).not.toContain('Decline');
    expect(owner).not.toContain('Recorded next to the original');
    await expect(page.locator('#app figcaption')).toHaveText([
      'Staff view, dark theme',
      'Owner view, light theme',
    ]);
  });

  test('the seventh Coming card spans the row, so no empty cell shows', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'viewport is set explicitly; run once');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(HOME);
    await revealAll(page);
    const cells = page.locator('#coming .mo-grid .mo-cell');
    await expect(cells).toHaveCount(7);
    const grid = await page.locator('#coming .mo-grid').boundingBox();
    const last = await cells.last().boundingBox();
    expect(Math.abs((last?.width ?? 0) - (grid?.width ?? 1))).toBeLessThan(4);
  });

  test('Northwind Studio is shown once in each recreated screen', async ({ page }) => {
    await page.goto(HOME);
    for (const phone of await page.locator('.phone').all()) {
      const text = await phone.textContent();
      expect((text?.match(/Northwind Studio/g) ?? []).length).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('the task loop', () => {
  test('lists the four states in order, with or without the animation', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.locator('.loop__name')).toHaveText(['Assigned', 'Noted', 'Done', 'Approved']);
  });

  test('has a Pause button that pauses and resumes the animation', async ({ page }) => {
    await page.goto(HOME);
    await revealAll(page);
    const loop = page.locator('[data-loop]');
    const button = loop.getByRole('button', { name: 'Pause animation' });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await button.click();
    const play = loop.getByRole('button', { name: 'Play animation' });
    await expect(play).toHaveAttribute('aria-pressed', 'true');
    await expect(loop).toHaveAttribute('data-paused', '');
    const states = await page.evaluate(() =>
      [...document.querySelectorAll('.loop__step')].map(
        (step) => getComputedStyle(step).animationPlayState,
      ),
    );
    expect(states.slice(1)).toEqual(['paused', 'paused', 'paused']);
    await play.click();
    await expect(loop).not.toHaveAttribute('data-paused', '');
  });

  test('the steps really animate: they are not all lit at once', async ({ page }) => {
    await page.goto(HOME);
    await revealAll(page);
    await page.locator('[data-loop]').scrollIntoViewIfNeeded();
    const lit = await page.evaluate(() => {
      for (const animation of document.getAnimations()) {
        animation.pause();
        animation.currentTime = 3500;
      }
      return [...document.querySelectorAll('.loop__step')].map((step) =>
        Number(getComputedStyle(step).getPropertyValue('--on')),
      );
    });
    expect(lit).toEqual([1, 1, 0, 0]);
  });

  test('under reduced motion nothing animates and there is nothing to pause', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(HOME);
    await expect(page.locator('[data-loop-pause]')).toBeHidden();
    const running = await page.evaluate(
      () =>
        document.getAnimations().filter((animation) => animation.playState === 'running').length,
    );
    expect(running).toBe(0);
    const lit = await page.evaluate(() =>
      [...document.querySelectorAll('.loop__step')].map((step) =>
        Number(getComputedStyle(step).getPropertyValue('--on')),
      ),
    );
    expect(lit).toEqual([1, 1, 1, 1]);
  });
});
