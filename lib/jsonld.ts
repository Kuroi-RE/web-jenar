/**
 * Serialisasi objek JSON-LD dengan aman untuk disisipkan ke dalam <script>.
 * Escape "<" menjadi "\u003c" agar string berisi "</script>" tidak dapat
 * memecah tag script (mitigasi XSS pada data yang dapat diedit admin).
 */
export function jsonLdString(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}
