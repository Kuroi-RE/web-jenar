import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const COOKIE_NAME = "desa_admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 jam

const USERNAME = process.env.ADMIN_USERNAME || "admin";
const PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";

if (
  process.env.NODE_ENV === "production" &&
  (!process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET)
) {
  // Peringatan keras: jangan jalankan produksi dengan kredensial default.
  console.warn(
    "[auth] ADMIN_PASSWORD/AUTH_SECRET neds to be set.",
  );
}

/** Buat token sesi bertanda tangan: "<exp>.<hmac>" (exp = epoch ms). */
function makeToken(exp: number): string {
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(`auth:${USERNAME}:${exp}`)
    .digest("hex");
  return `${exp}.${sig}`;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Verifikasi token sesi: tanda tangan valid DAN belum kedaluwarsa. */
function verifyToken(token: string): boolean {
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return safeEqual(token, makeToken(exp));
}

/** Verifikasi username + password (perbandingan waktu-konstan). */
export function verifyCredentials(username: string, password: string): boolean {
  const okUser = safeEqual(username, USERNAME);
  const okPass = safeEqual(password, PASSWORD);
  return okUser && okPass;
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, makeToken(Date.now() + MAX_AGE * 1000), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return false;
  return verifyToken(value);
}

/** Wajib login: redirect ke halaman login bila belum terautentikasi. */
export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}
