"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { getSettings, saveSettings, type Settings } from "@/lib/store";

export type SettingsFormState = { error?: string; success?: boolean };

export async function saveSettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAuth();

  const s = (key: string) => String(formData.get(key) ?? "").trim();
  const current = await getSettings();

  const jamPelayanan = current.jamPelayanan.map((row, i) => ({
    day: s(`jam_day_${i}`) || row.day,
    time: s(`jam_time_${i}`),
    rest: s(`jam_rest_${i}`) || null,
  }));

  const quickFacts = current.tentang.quickFacts.map((fact, i) => ({
    value: s(`fact_value_${i}`) || fact.value,
    label: s(`fact_label_${i}`) || fact.label,
  }));

  // Tautan layanan eksternal (dinamis: tambah/hapus).
  const externalLinks: { label: string; url: string }[] = [];
  for (let i = 0; i < 20; i += 1) {
    const url = s(`ext_url_${i}`);
    if (!url) continue;
    externalLinks.push({
      label: s(`ext_label_${i}`) || "Tautan",
      url,
    });
  }

  const next: Settings = {
    ...current,
    externalLinks,
    site: {
      ...current.site,
      name: s("name") || current.site.name,
      legalName: s("legalName") || current.site.legalName,
      tagline: s("tagline"),
      region: s("region"),
      slogan: s("slogan"),
      url: s("url") || current.site.url,
      email: s("email"),
      phone: s("phone"),
      phoneIntl: s("phoneIntl"),
      address: s("address"),
      links: {
        aduan: s("link_aduan"),
        skm: current.site.links.skm,
        spak: current.site.links.spak,
      },
      social: {
        facebook: s("social_facebook"),
        instagram: s("social_instagram"),
        youtube: s("social_youtube"),
      },
    },
    jamPelayanan,
    tentang: {
      paragraf1: s("tentang_p1"),
      paragraf2: s("tentang_p2"),
      quickFacts,
    },
    hero: current.hero,
  };

  if (!next.site.name) {
    return { error: "Nama kecamatan wajib diisi." };
  }

  try {
    await saveSettings(next);
  } catch {
    return { error: "Gagal menyimpan pengaturan." };
  }

  // Layout mempengaruhi seluruh halaman → revalidasi menyeluruh.
  revalidatePath("/", "layout");

  return { success: true };
}
