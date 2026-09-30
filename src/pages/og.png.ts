import type { APIRoute } from 'astro';
import satori from 'satori';
import { hero } from '../content/copy';
import { MARK } from '../lib/brand-mark';
import { fontFile, svgToPng } from '../lib/render';

/**
 * The social share image, 1200 x 630, generated at build time (no browser needed): the logo, the
 * headline, and a strip of facts, in the site's Instrument style. It says MaxOff, never the
 * developer's name. Red appears once, in the logo mark.
 */
const WIDTH = 1200;
const HEIGHT = 630;

const COLOURS = {
  bg: '#0A0A0B',
  border: '#232326',
  text: '#F4F4F5',
  muted: '#A1A1AA',
  grid: 'rgba(255,255,255,0.055)',
} as const;

const facts = ['Owner, Admin, Crew', 'IST', 'History never overwritten'] as const;

const mono = { fontFamily: 'Geist Mono', fontWeight: 500, textTransform: 'uppercase' } as const;

export const GET: APIRoute = async () => {
  const [sans400, sans600, mono500] = await Promise.all([
    fontFile('geist', 'geist-latin-400-normal.woff'),
    fontFile('geist', 'geist-latin-600-normal.woff'),
    fontFile('geist-mono', 'geist-mono-latin-500-normal.woff'),
  ]);

  const tree = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: WIDTH,
        height: HEIGHT,
        padding: 64,
        position: 'relative',
        backgroundColor: COLOURS.bg,
        backgroundImage: `linear-gradient(${COLOURS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLOURS.grid} 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
        color: COLOURS.text,
        fontFamily: 'Geist',
      },
      children: [
        // The one soft glow.
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: -120,
              right: -160,
              width: 760,
              height: 760,
              backgroundImage: 'radial-gradient(circle, rgba(196,33,38,0.30), rgba(196,33,38,0))',
            },
          },
        },
        // Logo and wordmark.
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 16 },
            children: [
              {
                type: 'svg',
                props: {
                  width: 52,
                  height: 52,
                  viewBox: '0 0 32 32',
                  children: [
                    { type: 'rect', props: { width: 32, height: 32, rx: 8, fill: MARK.red } },
                    {
                      type: 'path',
                      props: {
                        d: MARK.path,
                        fill: 'none',
                        stroke: MARK.white,
                        strokeWidth: 3,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 40, fontWeight: 600, letterSpacing: -1 },
                  children: 'MaxOff',
                },
              },
            ],
          },
        },
        // Eyebrow and headline.
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 940 },
            children: [
              {
                type: 'div',
                props: {
                  style: { ...mono, fontSize: 22, letterSpacing: 4, color: COLOURS.muted },
                  children: hero.eyebrow,
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 92, fontWeight: 600, letterSpacing: -4, lineHeight: 1 },
                  children: hero.headline,
                },
              },
            ],
          },
        },
        // A strip of facts, like the one under the hero.
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 24,
              borderTop: `1px solid ${COLOURS.border}`,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', gap: 40 },
                  children: facts.map((fact, i) => ({
                    type: 'div',
                    props: {
                      style: {
                        ...mono,
                        fontSize: 20,
                        letterSpacing: 3,
                        color: COLOURS.muted,
                        ...(i > 0
                          ? { borderLeft: `1px solid ${COLOURS.border}`, paddingLeft: 40 }
                          : {}),
                      },
                      children: fact,
                    },
                  })),
                },
              },
              {
                type: 'div',
                props: {
                  style: { ...mono, fontSize: 20, letterSpacing: 3, color: COLOURS.text },
                  children: 'maxoff.in',
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Geist', data: sans400, weight: 400, style: 'normal' },
      { name: 'Geist', data: sans600, weight: 600, style: 'normal' },
      { name: 'Geist Mono', data: mono500, weight: 500, style: 'normal' },
    ],
  });

  return new Response(svgToPng(svg, WIDTH) as BodyInit, {
    headers: { 'Content-Type': 'image/png' },
  });
};
