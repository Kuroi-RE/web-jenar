import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import {
  getStoredCredentials,
  verifyPassword,
  envUsername,
  envPassword,
} from "@/lib/credentials";

const COOKIE_NAME = "desa_admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 jam

const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";

if (
  process.env.NODE_ENV === "production" &&
  (!process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET)
) {
  // Peringatan keras: jangan jalankan produksi dengan kredensial default.
  console.warn("[auth] ADMIN_PASSWORD/AUTH_SECRET perlu diisi.");
}

/**
 * Kredensial aktif untuk penandatanganan token. `secretMaterial` di-mix ke
 * tanda tangan sehingga MENGUBAH username atau kata sandi otomatis
 * membatalkan seluruh sesi lama (token lama tak lagi cocok).
 * Toleran DB: jatuh ke kredensial env bila DB tak tersedia.
 */
async function resolveCredState(): Promise<{
  username: string;
  secretMaterial: string;
}> {
  try {
    const stored = await getStoredCredentials();
    if (stored) {
      return { username: stored.username, secretMaterial: stored.passwordHash };
    }
  } catch (err) {
    console.error("[auth] gagal baca kredensial DB, memakai env:", err);
  }
  return { username: envUsername, secretMaterial: `env:${envPassword}` };
}

function sign(username: string, secretMaterial: string, exp: number): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`auth:${username}:${secretMaterial}:${exp}`)
    .digest("hex");
}

/** Buat token sesi bertanda tangan: "<exp>.<hmac>" (exp = epoch ms). */
async function makeToken(exp: number): Promise<string> {
  const { username, secretMaterial } = await resolveCredState();
  return `${exp}.${sign(username, secretMaterial, exp)}`;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Verifikasi token sesi: tanda tangan valid DAN belum kedaluwarsa. */
async function verifyToken(token: string): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return safeEqual(token, await makeToken(exp));
}

/** Verifikasi username + kata sandi (DB dulu, fallback env). */
export async function verifyCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  try {
    const stored = await getStoredCredentials();
    if (stored) {
      const okUser = safeEqual(username, stored.username);
      const okPass = verifyPassword(password, stored.passwordHash);
      return okUser && okPass;
    }
  } catch (err) {
    console.error("[auth] gagal baca kredensial DB, memakai env:", err);
  }
  const okUser = safeEqual(username, envUsername);
  const okPass = safeEqual(password, envPassword);
  return okUser && okPass;
}

/** Username admin yang berlaku saat ini (untuk prefill form). */
export async function getCurrentUsername(): Promise<string> {
  const { username } = await resolveCredState();
  return username;
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, await makeToken(Date.now() + MAX_AGE * 1000), {
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
