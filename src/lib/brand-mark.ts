/**
 * The MaxOff mark: a red rounded square with a white "M". One definition, used by the favicons,
 * the touch icon and the social image, so they always match the logo in the header.
 */
export const MARK = {
  red: '#C42126',
  white: '#FFFFFF',
  /** The "M", drawn on a 32 x 32 grid. */
  path: 'M9 23V9l7 8 7-8v14',
} as const;

interface MarkOptions {
  /** Corner radius on the 32-unit grid. 8 for a rounded square, 0 for a full-bleed square. */
  radius?: number;
  /** Enlarge the "M" about the centre. */
  scale?: number;
}

/** The mark as a standalone SVG string. */
export function markSvg({ radius = 8, scale = 1 }: MarkOptions = {}): string {
  const centre = 16;
  const transform =
    scale === 1
      ? ''
      : ` transform="translate(${centre} ${centre}) scale(${scale}) translate(-${centre} -${centre})"`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">`,
    `<rect width="32" height="32" rx="${radius}" fill="${MARK.red}"/>`,
    `<path d="${MARK.path}" fill="none" stroke="${MARK.white}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"${transform}/>`,
    `</svg>`,
  ].join('');
}
