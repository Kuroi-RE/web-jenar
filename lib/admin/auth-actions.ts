"use server";

import { redirect } from "next/navigation";
import {
  verifyCredentials,
  createSession,
  destroySession,
  requireAuth,
  getCurrentUsername,
} from "@/lib/auth";
import { saveCredentials } from "@/lib/credentials";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

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

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!(await verifyCredentials(username, password))) {
    console.warn(`[auth] login gagal ip=${ip} user=${username.slice(0, 32)}`);
    return { error: "Username atau kata sandi salah." };
  }

  console.info(`[auth] login sukses ip=${ip}`);
  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export type AkunState = { error?: string; success?: boolean };

export async function changeCredentialsAction(
  _prev: AkunState,
  formData: FormData,
): Promise<AkunState> {
  await requireAuth();

  const ip = await getClientIp();
  const limited = rateLimit(`akun:${ip}`, 10, 5 * 60 * 1000);
  if (!limited.ok) {
    return {
      error: `Terlalu banyak percobaan. Coba lagi dalam ${limited.retryAfter} detik.`,
    };
  }

  const currentUsername = await getCurrentUsername();
  const newUsername = String(formData.get("username") ?? "").trim();
  const currentPassword = String(formData.get("current_password") ?? "");
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  // Verifikasi kata sandi saat ini sebelum mengizinkan perubahan.
  if (!(await verifyCredentials(currentUsername, currentPassword))) {
    console.warn(`[auth] ubah kredensial gagal (sandi salah) ip=${ip}`);
    return { error: "Kata sandi saat ini salah." };
  }

  if (newUsername.length < 3) {
    return { error: "Username minimal 3 karakter." };
  }

  // Kata sandi baru opsional: kosongkan untuk hanya mengubah username.
  let passwordToSave = currentPassword;
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
    await saveCredentials(newUsername, passwordToSave);
  } catch (err) {
    console.error("[auth] gagal simpan kredensial:", err);
    return {
      error: "Gagal menyimpan. Pastikan database tersedia, lalu coba lagi.",
    };
  }

  // Kredensial berubah → tanda tangan token lama tak lagi cocok. Perbarui
  // sesi agar admin tetap masuk dengan token bertanda tangan baru.
  await createSession();
  console.info(`[auth] kredensial admin diperbarui ip=${ip}`);
  return { success: true };
}
