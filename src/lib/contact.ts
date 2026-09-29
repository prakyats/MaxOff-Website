/**
 * The only way to reach MaxOff is email. This module builds the address and the mailto links so
 * that no page ever contains the address as a plain string: every character is written as an
 * HTML entity, which browsers decode and screen readers read normally, but simple scrapers
 * matching raw HTML do not see. `pnpm check:static` fails the build if the address leaks.
 */
import { contact } from '../content/copy';

/** The address, assembled from its parts. */
export function address(): string {
  return `${contact.address.user}@${contact.address.domain}`;
}

/** Write every character as a numeric HTML entity. Safe for text nodes and attribute values. */
export function entities(text: string): string {
  return Array.from(text, (char) => `&#${char.codePointAt(0)};`).join('');
}

/** mailto: with the subject and the short prefilled body for a demo request. */
export function demoMailto(): string {
  const body = contact.bodyLines.join('\r\n\r\n');
  const query = `subject=${encodeURIComponent(contact.subject)}&body=${encodeURIComponent(body)}`;
  return `mailto:${address()}?${query}`;
}

/** Plain mailto: with no subject or body. */
export function plainMailto(): string {
  return `mailto:${address()}`;
}
