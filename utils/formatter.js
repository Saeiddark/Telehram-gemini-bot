/**
 * Escapes MarkdownV2 reserved characters.
 */
export function escapeMd(text) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

/**
 * Formats text for Telegram's MarkdownV2 parse mode.
 * Auto‑escapes plain parts and lets the caller inject bold/italic safely.
 */
export function formatBold(text) { return `*${escapeMd(text)}*`; }
export function formatItalic(text) { return `_${escapeMd(text)}_`; }
export function formatCode(text) { return `\`${escapeMd(text)}\``; }
