"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import {
  getSettings,
  saveSettings,
  type HeroSlide,
  type Settings,
} from "@/lib/store";

export type HeroFormState = { error?: string; success?: boolean };

const MAX_SLIDES = 6;

export async function saveHeroAction(
  _prev: HeroFormState,
  formData: FormData,
): Promise<HeroFormState> {
  await requireAuth();

  const s = (key: string) => String(formData.get(key) ?? "").trim();
  const current = await getSettings();

  // Kumpulkan slide (baris dengan img kosong diabaikan).
  const slides: HeroSlide[] = [];
  for (let i = 0; i < MAX_SLIDES; i += 1) {
    const img = s(`slide_img_${i}`);
    if (!img) continue;
    slides.push({ img, alt: s(`slide_alt_${i}`) || "Foto Kecamatan" });
  }

  if (slides.length === 0) {
    return { error: "Minimal satu slide dengan path gambar harus diisi." };
  }

  const next: Settings = {
    ...current,
    hero: {
      eyebrow: s("eyebrow") || current.hero.eyebrow,
      subtitle: s("subtitle"),
      description: s("description"),
      slides,
    },
  };

  try {
    await saveSettings(next);
  } catch {
    return { error: "Gagal menyimpan pengaturan Hero." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
