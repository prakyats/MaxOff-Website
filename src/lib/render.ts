/** Build-time image helpers. Everything here runs in Node during `astro build`, never in a browser. */
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Rasterise an SVG string to a PNG of the given width. */
export function svgToPng(svg: string, width: number): Uint8Array {
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}

/** A font file from an installed @fontsource package. Endpoints are bundled, so paths start at the repo root. */
export function fontFile(pkg: string, file: string): Promise<Buffer> {
  return readFile(join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files', file));
}

/**
 * An ICO file holding PNG images. Every current browser reads PNG inside ICO, so this needs no
 * bitmap encoder: a 6-byte header, one 16-byte entry per image, then the PNG data.
 */
export function pngsToIco(images: readonly { size: number; data: Uint8Array }[]): Uint8Array {
  const header = 6;
  const entry = 16;
  let offset = header + entry * images.length;
  const total = offset + images.reduce((n, image) => n + image.data.length, 0);
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, images.length, true);
  images.forEach((image, i) => {
    const at = header + entry * i;
    out[at] = image.size >= 256 ? 0 : image.size; // width
    out[at + 1] = image.size >= 256 ? 0 : image.size; // height
    view.setUint16(at + 4, 1, true); // colour planes
    view.setUint16(at + 6, 32, true); // bits per pixel
    view.setUint32(at + 8, image.data.length, true);
    view.setUint32(at + 12, offset, true);
    out.set(image.data, offset);
    offset += image.data.length;
  });
  return out;
}
