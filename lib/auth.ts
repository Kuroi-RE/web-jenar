import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import {
  getCredentialsByUsername,
  countAdmins,
  verifyPassword,
  envUsername,
  envPassword,
  type AdminAccount,
} from "@/lib/credentials";

const COOKIE_NAME = "desa_admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 jam

const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";

// Hash boneka untuk menyamakan waktu kerja saat username tidak ditemukan,
// sehingga selisih waktu respons tidak membocorkan username mana yang ada.
const DUMMY_HASH =
  "scrypt$0000000000000000000000000000000000000000000000000000000000000000$" +
  "0".repeat(128);

if (
  process.env.NODE_ENV === "production" &&
  (!process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET)
) {
  // Peringatan keras: jangan jalankan produksi dengan kredensial default.
  console.warn("[auth] ADMIN_PASSWORD/AUTH_SECRET perlu diisi.");
}

/** Akun bootstrap dari environment; berperan superadmin agar bisa memulihkan akun lain. */
function envAccount(): AdminAccount {
  return { id: null, username: envUsername, role: "superadmin" };
}

/**
 * Materi rahasia yang dicampur ke tanda tangan token. Karena memakai
 * `passwordHash` akun, MENGUBAH kata sandi/username otomatis membatalkan
 * sesi lama milik akun itu (dan hanya akun itu).
 */
type CredState = { account: AdminAccount; secretMaterial: string };

async function resolveCredState(username: string): Promise<CredState | null> {
  try {
    const stored = await getCredentialsByUsername(username);
    if (stored) {
      return {
        account: { id: stored.id, username: stored.username, role: stored.role },
        secretMaterial: stored.passwordHash,
      };
    }
    // Tabel masih kosong → akun env dipakai sebagai bootstrap.
    if ((await countAdmins()) === 0 && safeEqual(username, envUsername)) {
      return { account: envAccount(), secretMaterial: `env:${envPassword}` };
    }
    return null;
  } catch (err) {
    console.error("[auth] gagal baca kredensial DB, memakai env:", err);
    if (safeEqual(username, envUsername)) {
      return { account: envAccount(), secretMaterial: `env:${envPassword}` };
    }
    return null;
  }
}

function sign(username: string, secretMaterial: string, exp: number): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`auth:${username}:${secretMaterial}:${exp}`)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Token sesi: "<username-base64url>.<exp>.<hmac>" (exp = epoch ms). */
async function makeToken(username: string, exp: number): Promise<string | null> {
  const state = await resolveCredState(username);
  if (!state) return null;
  const user64 = Buffer.from(username, "utf8").toString("base64url");
  return `${user64}.${exp}.${sign(username, state.secretMaterial, exp)}`;
}

/** Verifikasi token sesi: tanda tangan valid, akun masih ada, belum kedaluwarsa. */
async function verifyToken(token: string): Promise<AdminAccount | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [user64, expStr, mac] = parts;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;

  let username: string;
  try {
    username = Buffer.from(user64!, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (!username) return null;

  const state = await resolveCredState(username);
  if (!state) return null;

  if (!safeEqual(mac!, sign(username, state.secretMaterial, exp))) return null;
  return state.account;
}

/**
 * Verifikasi username + kata sandi. Mengembalikan akun bila cocok, `null` bila
 * tidak. DB lebih dulu; kredensial env hanya dipakai bila tabel kosong atau DB
 * tak terjangkau.
 */
export async function authenticate(
  username: string,
  password: string,
): Promise<AdminAccount | null> {
  const envMatch = () =>
    safeEqual(username, envUsername) && safeEqual(password, envPassword)
      ? envAccount()
      : null;

  try {
    const stored = await getCredentialsByUsername(username);
    if (stored) {
      return verifyPassword(password, stored.passwordHash)
        ? { id: stored.id, username: stored.username, role: stored.role }
        : null;
    }
    if ((await countAdmins()) === 0) return envMatch();
    // Akun tidak ada: tetap lakukan kerja hashing agar waktu respons seragam.
    verifyPassword(password, DUMMY_HASH);
    return null;
  } catch (err) {
    console.error("[auth] gagal baca kredensial DB, memakai env:", err);
    return envMatch();
  }
}

/** Kompatibilitas: versi boolean dari `authenticate`. */
export async function verifyCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  return (await authenticate(username, password)) !== null;
}

/** Akun pada sesi aktif, atau `null` bila belum login. */
export async function getSessionAdmin(): Promise<AdminAccount | null> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return null;
  return verifyToken(value);
}

/** Username admin yang sedang login (string kosong bila tidak ada sesi). */
export async function getCurrentUsername(): Promise<string> {
  return (await getSessionAdmin())?.username ?? "";
}

export async function createSession(username: string): Promise<void> {
  const token = await makeToken(username, Date.now() + MAX_AGE * 1000);
  if (!token) throw new Error(`[auth] tidak dapat membuat sesi untuk ${username}`);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
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
  return (await getSessionAdmin()) !== null;
}

/** Wajib login: redirect ke halaman login bila belum terautentikasi. */
export async function requireAuth(): Promise<AdminAccount> {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** Wajib superadmin. */
export async function requireSuperadmin(): Promise<AdminAccount> {
  const admin = await requireAuth();
  if (admin.role !== "superadmin") redirect("/admin");
  return admin;
}
