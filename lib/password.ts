// Hashing kata sandi admin (scrypt + salt). Sengaja TANPA "server-only"
// agar dapat dipakai juga oleh script Node (mis. scripts/db-export-sql.mjs).
import crypto from "node:crypto";

const SCRYPT_KEYLEN = 64;

/** Hash kata sandi dengan scrypt + salt acak. Format: "scrypt$<salt>$<hash>". */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

/** Verifikasi kata sandi terhadap hash tersimpan (perbandingan waktu-konstan). */
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, hashHex] = parts;
  const expected = Buffer.from(hashHex, "hex");
  let actual: Buffer;
  try {
    actual = crypto.scryptSync(password, salt, expected.length);
  } catch {
    return false;
  }
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}
