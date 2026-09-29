import type { APIRoute } from 'astro';
import { markSvg } from '../lib/brand-mark';
import { pngsToIco, svgToPng } from '../lib/render';

/** favicon.ico for browsers that do not use the SVG icon: 16, 32 and 48 px, generated at build time. */
export const GET: APIRoute = () => {
  const svg = markSvg({ radius: 7 });
  const ico = pngsToIco([16, 32, 48].map((size) => ({ size, data: svgToPng(svg, size) })));
  return new Response(ico as BodyInit, { headers: { 'Content-Type': 'image/x-icon' } });
};
