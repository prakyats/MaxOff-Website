# MaxOff design system

**Status: draft.** Phase 1 produces 2–3 design directions within these constraints; the owner picks one and this file is then finalised. Until then, the tokens below are the defaults every preview shares.

**Feel:** minimal, futuristic, modern, quiet. A precise instrument, not a neon arcade.

## Colour tokens

CSS custom properties on `:root` in `src/styles/tokens.css`. Dark is the default. Light applies under `[data-theme="light"]`, and also under `prefers-color-scheme: light` when the visitor has not chosen a theme. Tailwind utilities map to these through `@theme inline` in `src/styles/global.css` (`bg-bg`, `bg-surface`, `text-text`, `text-muted`, `border-border`, `bg-accent`, `text-live`).

| Token         | Dark      | Light     | Use                                                                     |
| ------------- | --------- | --------- | ----------------------------------------------------------------------- |
| `--bg`        | `#0A0A0B` | `#FAFAFA` | Page background                                                         |
| `--surface`   | `#121214` | `#FFFFFF` | Cards, phone screens, header when scrolled                              |
| `--border`    | `#232326` | `#E4E4E7` | Hairline borders (1px)                                                  |
| `--text`      | `#F4F4F5` | `#16161A` | Body and headings                                                       |
| `--muted`     | `#A1A1AA` | `#52525B` | Secondary text. Contrast ≥ 7:1 on `--bg` and `--surface` in both themes |
| `--accent`    | `#C42126` | `#C42126` | **Rare.** Logo mark, the one primary button per view, the hero glow     |
| `--on-accent` | `#FFFFFF` | `#FFFFFF` | Text on the primary button (5.8:1 on the accent)                        |
| `--live`      | `#4ADE80` | `#15803D` | The "Live" badge only                                                   |
| `--grid-line` | 5 % white | 6 % black | The faint background grid                                               |
| `--glow`      | 22 % red  | 14 % red  | The single soft radial glow behind the hero                             |

Rules: red is never decorative and never body text. Success green appears only on the "Live" badge. "Coming" badges use `--muted` on `--surface`.

## Type

- **Sans:** Geist (variable, self-hosted, Latin subset) for headings and body. Fallback: `ui-sans-serif, system-ui, sans-serif`.
- **Mono:** Geist Mono (variable, self-hosted, Latin subset) for small labels such as the hero eyebrow.
- Files live in `public/fonts/` (SIL Open Font License), loaded with `font-display: swap`, `unicode-range` limited to Latin, and preloaded from the layout. No third-party font requests at runtime. Phase 1 may swap Geist for Inter Tight; the loading mechanics stay the same.
- **Fluid scale** with `clamp()`, defined under `@theme` in `src/styles/global.css` (`text-sm` … `text-hero` utilities). The hero headline is large with tight tracking (`letter-spacing: -0.03em`). Body line-height 1.6, headings 1.1.
- Note: the Latin subset does not include the rupee sign; a recreated screen that shows money falls back to the system font for `₹`, which is acceptable.

## Texture

- A faint grid (1px lines, `--grid-line`, 48px cells) that fades out at the edges with a radial mask.
- One soft radial red glow (`--glow`) behind the hero. Nowhere else.
- Hairline borders. Cards only barely frosted: `backdrop-filter: blur(8px)` with a solid `--surface` fallback.

## Spacing, radius, layout

- 4px base. Generous section spacing (`clamp(4rem, 10vw, 8rem)`).
- Max content width 1200px (`--content-max`), 16px side gutter on phones (`--gutter`), 24px from 768px.
- Radius: cards 14px, buttons 10px, phone frames 40px.
- Targets at least 44 × 44px. Inputs 16px text.

## Motion

- Fade-and-rise on scroll: 12px rise, 400–600 ms, ease-out (`--ease-out`). Small, once, no re-trigger.
- The task-state loop (Assigned → Noted → Done → Approved) in the Coming section.
- Subtle hover lift on cards (2px, 200 ms).
- No parallax, no scroll-jacking, no autoplaying video.
- Under `prefers-reduced-motion: reduce` everything is static: no transforms, no loops, no transitions longer than 1 ms.

## Icons

Lucide, 1.5px stroke, 20px in cards and 16px inline. Inline SVG, `aria-hidden` when decorative.

## Theme toggle

In the header (compact) or footer. Stored under the `maxoff-theme` key in `localStorage`, every read and write wrapped in `try/catch`. An inline script in `<head>` applies the stored theme before first paint, so there is no flash of the wrong theme. When nothing is stored, the system preference decides, and dark wins when there is no preference.

## Responsive checkpoints

Every section works at 360, 390, 430, 768, 1280 and 1440px wide, in both themes, and at 200 % text size. No horizontal scroll at 360px.

## Phase 1 directions (to be produced)

Three genuinely different directions within these constraints, each as a preview page with hero, one feature section and footer, in both themes, on phone and desktop:

1. **Instrument:** a strict grid, mono labels, hairlines, information density.
2. **Glass:** depth, soft light, frosted surfaces, the glow doing more work.
3. **Editorial:** big type, whitespace, fewer boxes.
