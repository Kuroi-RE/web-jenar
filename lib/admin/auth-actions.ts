"use server";

import { redirect } from "next/navigation";
import {
  verifyCredentials,
  createSession,
  destroySession,
} from "@/lib/auth";
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

  if (!verifyCredentials(username, password)) {
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
