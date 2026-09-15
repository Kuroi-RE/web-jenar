"use server";

import { redirect } from "next/navigation";
import {
  authenticate,
  createSession,
  destroySession,
  requireAuth,
  getSessionAdmin,
} from "@/lib/auth";
import {
  getCredentialsByUsername,
  upsertAdmin,
  updateAdmin,
  verifyPassword,
} from "@/lib/credentials";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstile, turnstileErrorMessage } from "@/lib/turnstile";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const ip = await getClientIp();

  // Rate limit: maks 5 percobaan gagal per 5 menit per IP.
  const limited = rateLimit(`login:${ip}`, 5, 5 * 60 * 1000);
  if (!limited.ok) {
    console.warn(`[auth] login rate-limited ip=${ip}`);
    return {
      error: `Terlalu banyak percobaan. Coba lagi dalam ${limited.retryAfter} detik.`,
    };
  }

  // Verifikasi anti-bot SEBELUM memeriksa kredensial, agar penyerang tidak
  // dapat menebak kata sandi tanpa melewati Turnstile.
  const captcha = await verifyTurnstile(
    String(formData.get("cf-turnstile-response") ?? ""),
    ip,
  );
  if (!captcha.ok) {
    console.warn(`[auth] turnstile gagal ip=${ip} codes=${captcha.codes.join(",")}`);
    return { error: turnstileErrorMessage(captcha.codes) };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const account = await authenticate(username, password);
  if (!account) {
    console.warn(`[auth] login gagal ip=${ip} user=${username.slice(0, 32)}`);
    return { error: "Username atau kata sandi salah." };
  }

  console.info(`[auth] login sukses ip=${ip} user=${account.username} role=${account.role}`);
  await createSession(account.username);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export type AkunState = { error?: string; success?: boolean };

/** Ubah username / kata sandi AKUN YANG SEDANG LOGIN. */
export async function changeCredentialsAction(
  _prev: AkunState,
  formData: FormData,
): Promise<AkunState> {
  const session = await requireAuth();

  const ip = await getClientIp();
  const limited = rateLimit(`akun:${ip}`, 10, 5 * 60 * 1000);
  if (!limited.ok) {
    return {
      error: `Terlalu banyak percobaan. Coba lagi dalam ${limited.retryAfter} detik.`,
    };
  }

  const newUsername = String(formData.get("username") ?? "").trim();
  const currentPassword = String(formData.get("current_password") ?? "");
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  // Verifikasi kata sandi saat ini sebelum mengizinkan perubahan.
  if (!(await authenticate(session.username, currentPassword))) {
    console.warn(`[auth] ubah kredensial gagal (sandi salah) ip=${ip}`);
    return { error: "Kata sandi saat ini salah." };
  }

  if (newUsername.length < 3) {
    return { error: "Username minimal 3 karakter." };
  }

  // Username harus unik antar akun.
  if (newUsername !== session.username) {
    const taken = await getCredentialsByUsername(newUsername);
    if (taken) return { error: "Username tersebut sudah dipakai akun lain." };
  }

  // Kata sandi baru opsional: kosongkan untuk hanya mengubah username.
  let passwordToSave: string | undefined;
  if (newPassword.length > 0) {
    if (newPassword.length < 8) {
      return { error: "Kata sandi baru minimal 8 karakter." };
    }
    if (newPassword !== confirmPassword) {
      return { error: "Konfirmasi kata sandi baru tidak cocok." };
    }
    passwordToSave = newPassword;
  }

  try {
    if (session.id === null) {
      // Sesi berasal dari kredensial env (tabel masih kosong) → buat baris baru.
      await upsertAdmin(
        newUsername,
        passwordToSave ?? currentPassword,
        "superadmin",
      );
    } else {
      await updateAdmin(session.id, {
        username: newUsername !== session.username ? newUsername : undefined,
        password: passwordToSave,
      });
    }
  } catch (err) {
    console.error("[auth] gagal simpan kredensial:", err);
    return {
      error: "Gagal menyimpan. Pastikan database tersedia, lalu coba lagi.",
    };
  }

  // Kredensial berubah → tanda tangan token lama tak lagi cocok. Perbarui
  // sesi agar admin tetap masuk dengan token bertanda tangan baru.
  await createSession(newUsername);
  console.info(`[auth] kredensial admin diperbarui ip=${ip} user=${newUsername}`);
  return { success: true };
}

export type ResetState = { error?: string; success?: string };

/**
 * Atur ulang kata sandi AKUN LAIN. Hanya untuk `superadmin`.
 * Sesi akun target otomatis batal karena tanda tangan token memakai
 * fingerprint kata sandi.
 */
export async function resetOtherPasswordAction(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const session = await requireAuth();
  if (session.role !== "superadmin") {
    return { error: "Hanya superadmin yang dapat mengatur ulang akun lain." };
  }

  const ip = await getClientIp();
  const limited = rateLimit(`reset:${ip}`, 10, 5 * 60 * 1000);
  if (!limited.ok) {
    return {
      error: `Terlalu banyak percobaan. Coba lagi dalam ${limited.retryAfter} detik.`,
    };
  }

  const target = String(formData.get("target_username") ?? "").trim();
  const newPassword = String(formData.get("reset_password") ?? "");
  const confirmPassword = String(formData.get("reset_confirm") ?? "");
  const ownPassword = String(formData.get("own_password") ?? "");

  // Konfirmasi identitas superadmin lebih dulu.
  const me = await getCredentialsByUsername(session.username);
  const ownOk = me
    ? verifyPassword(ownPassword, me.passwordHash)
    : (await authenticate(session.username, ownPassword)) !== null;
  if (!ownOk) {
    console.warn(`[auth] reset akun gagal (sandi superadmin salah) ip=${ip}`);
    return { error: "Kata sandi Anda salah." };
  }

  if (!target) return { error: "Pilih akun yang akan diatur ulang." };
  if (target === session.username) {
    return {
      error: "Untuk akun Anda sendiri, gunakan bagian Ubah Kata Sandi di atas.",
    };
  }

  const account = await getCredentialsByUsername(target);
  if (!account || account.id === null) {
    return { error: "Akun tidak ditemukan." };
  }

  if (newPassword.length < 8) {
    return { error: "Kata sandi baru minimal 8 karakter." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Konfirmasi kata sandi tidak cocok." };
  }

  try {
    await updateAdmin(account.id, { password: newPassword });
  } catch (err) {
    console.error("[auth] gagal reset kata sandi akun lain:", err);
    return {
      error: "Gagal menyimpan. Pastikan database tersedia, lalu coba lagi.",
    };
  }

  console.info(
    `[auth] kata sandi akun "${target}" diatur ulang oleh "${session.username}" ip=${ip}`,
  );
  return {
    success: `Kata sandi akun "${target}" berhasil diatur ulang. Sesi aktif akun tersebut otomatis berakhir.`,
  };
}

/** Dipakai halaman Akun untuk menampilkan peran & daftar akun. */
export async function getSessionRole(): Promise<"admin" | "superadmin" | null> {
  return (await getSessionAdmin())?.role ?? null;
}
