import type { APIRoute } from 'astro';
import { markSvg } from '../lib/brand-mark';
import { svgToPng } from '../lib/render';

/**
 * The Apple touch icon, 180 x 180, generated at build time. iOS rounds the corners itself, so the
 * square is full-bleed, with the "M" enlarged to fill it.
 */
export const GET: APIRoute = () => {
  const png = svgToPng(markSvg({ radius: 0, scale: 1.3 }), 180);
  return new Response(png as BodyInit, { headers: { 'Content-Type': 'image/png' } });
};
