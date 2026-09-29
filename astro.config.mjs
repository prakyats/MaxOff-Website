// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://maxoff.in',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // privacy.html rather than privacy/index.html: canonical URLs have no trailing slash.
    format: 'file',
  },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
