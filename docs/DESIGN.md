# MaxOff design system

**Status: final.** The owner chose **Instrument** on 29 Sep 2026, with two borrowings: small chips inside the feature cards (from the Glass direction, restyled in Instrument's hairline and mono language) and giant type for the closing headline (from the Editorial direction). Glass and Editorial are otherwise dropped, together with Inter Tight.

**Feel:** minimal, futuristic, modern, quiet. A precise instrument, not a neon arcade: a strict grid, mono labels, hairlines everywhere, information density.

## Colour tokens

CSS custom properties on `:root` in `src/styles/tokens.css`. Dark is the default. Light applies under `[data-theme="light"]`, and also under `prefers-color-scheme: light` when the visitor has not chosen a theme. Tailwind utilities map to these through `@theme inline` in `src/styles/global.css` (`bg-bg`, `bg-surface`, `text-text`, `text-muted`, `border-border`, `bg-accent`, `text-live`).

| Token              | Dark             | Light            | Use                                                                               |
| ------------------ | ---------------- | ---------------- | --------------------------------------------------------------------------------- |
| `--bg`             | `#0A0A0B`        | `#FAFAFA`        | Page background                                                                   |
| `--surface`        | `#121214`        | `#FFFFFF`        | Cards, phone screens, the contact panel                                           |
| `--border`         | `#232326`        | `#E4E4E7`        | Hairline borders (1px)                                                            |
| `--text`           | `#F4F4F5`        | `#16161A`        | Body and headings                                                                 |
| `--muted`          | `#A1A1AA`        | `#52525B`        | Secondary text. Contrast at least 7:1 on `--bg` and `--surface` in both themes    |
| `--control-border` | 45 % of `--text` | 52 % of `--text` | Borders of controls and chips (at least 3:1 on the page: 4.2:1 dark, 3.6:1 light) |
| `--accent`         | `#C42126`        | `#C42126`        | **Rare.** Logo mark, the one primary button per view, the hero glow               |
| `--on-accent`      | `#FFFFFF`        | `#FFFFFF`        | Text on the primary button (5.8:1 on the accent)                                  |
| `--live`           | `#4ADE80`        | `#15803D`        | The "Live" badge only                                                             |
| `--grid-line`      | 5.5 % white      | 7 % black        | The background grid                                                               |
| `--glow`           | 22 % red         | 14 % red         | The single soft radial glow behind the hero device                                |

Rules: red is never decorative and never body text. Success green appears only on the "Live" badge. "Coming" badges and cards are dimmed with `--muted`, never green.

## Type

- **Sans:** Geist (variable, self-hosted, Latin subset) for headings and body. Fallback: `ui-sans-serif, system-ui, sans-serif`.
- **Mono:** Geist Mono (variable, self-hosted, Latin subset) for small labels: eyebrows, section indexes, card indexes, chips, nav links, the footer credit.
- Files live in `public/fonts/` (SIL Open Font License), loaded with `font-display: swap`, `unicode-range` limited to Latin, and preloaded from the layout. No third-party font requests at runtime.
- **Fluid scale** with `clamp()`, defined under `@theme` in `src/styles/global.css` (`text-sm` to `text-hero`). Headlines are semibold with tight tracking: hero `-0.045em` at line-height 1, section headings `-0.04em`.
- **Giant type** is used once, for the closing line "The final say is yours." (`clamp(2.75rem, 0.6rem + 8.4vw, 8rem)`, semibold, tracking `-0.045em`, line-height 0.97).
- Note: the Latin subset does not include the rupee sign, so recreated screens avoid amounts.

## Texture

- A visible grid: 1px lines (`--grid-line`), 64px cells, fading out towards the bottom and edges with a radial mask.
- One soft radial red glow (`--glow`) behind the hero device. Nowhere else.
- Hairline borders. Sections are separated by a full-width hairline with a mono index label (`01`, `02`, ...).
- **The device frame** (hero): a hairline box with corner brackets and two mono captions (`Screen / Today`, `Owner view`) around the phone.
- **The spec strip** under the hero: four hairline cells (Roles, Times, History, Install), each a mono term and a short fact.
- **Feature tables:** cells share hairlines inside one rounded container (14px). Each cell has a mono index, a badge, an icon, a title, a sentence and, where useful, chips.
- **Chips** (borrowed from the Glass direction, restyled): mono, 11px, hairline border in `--control-border`, no fill, 4px radius, never red, never green. They illustrate a card; they are decorative and `aria-hidden`. Mini bars are hairline-outlined tracks with a neutral fill.
- No backdrop blur on cards. The header turns translucent with blur on scroll, with a solid fallback.

## Spacing, radius, layout

- 4px base. Section spacing `clamp(4rem, 10vw, 8rem)`.
- Max content width 1200px (`--content-max`), 16px side gutter on phones (`--gutter`), 24px from 768px.
- Radius: cards and tables 14px, buttons and inputs 10px, phone frames 40px, chips and index tags 4px.
- Targets at least 44 x 44px. Text in controls at least 16px.
- Grids use `minmax(0, 1fr)` columns and headers wrap, so nothing overflows at 200 % text size.

## Buttons and the two doors

- **Primary (red):** the one primary button per view. "Request a demo". It opens an email (see the contact rule in `CLAUDE.md`).
- **Outline:** "Sign in", in the header at every width including the phone menu. Border at least 3:1, never red.
- **Text link with arrow:** "See how it works".
- The header's Request a demo starts collapsed and opens out only while no other primary button is on screen, so there is one red button per view and nothing flashes at load.

## Motion

- Fade-and-rise on scroll: 8px rise, 400 ms, ease-out (`--ease-out`), once, staggered by up to 180 ms across a table row. Below the fold only: the hero never waits for an animation.
- The task-state loop (Assigned, Noted, Done, Approved) in the Coming section, with a Pause button (WCAG 2.2.2).
- Subtle hover: a table cell brightens to `--surface`, its icon to `--text`.
- No parallax, no scroll-jacking, no autoplaying video.
- Under `prefers-reduced-motion: reduce` everything is static: no transforms, no loops, no transitions longer than 1 ms.

## Icons

Lucide, 1.5px stroke, 20px in cards and 16px inline. Inline SVG, `aria-hidden` when decorative.

## Recreated app screens

Built in HTML/CSS with demo data (Northwind Studio, invented first names), never screenshots. Sizes use container units so a screen scales with its frame. The frame's own theme can be forced (light or dark) for the side-by-side pair. Only live features appear, except the task card, which is labelled Coming. Northwind Studio is shown once per screen.

## Theme toggle

In the footer. Stored under the `maxoff-theme` key in `localStorage`, every read and write wrapped in `try/catch`. An inline script in `<head>` applies the stored theme before first paint, so there is no flash of the wrong theme. When nothing is stored, the system preference decides, and dark wins when there is no preference.

## Responsive checkpoints

Every section works at 360, 390, 430, 768, 1280 and 1440px wide, in both themes, and at 200 % text size. No horizontal scroll at 360px.
