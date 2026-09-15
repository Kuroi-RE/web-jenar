import "server-only";
import { query, ensureSchema } from "@/lib/db";
import { defaultSettings as defaults } from "@/lib/content/defaults";

// Tipe konten dipusatkan di lib/content/defaults.ts (dipakai juga oleh script
// generator SQL). Di-re-export agar konsumen lama tetap mengimpor dari sini.
export type {
  SiteSettings,
  JamRow,
  ExternalLink,
  TentangSettings,
  HeroSlide,
  HeroSettings,
  LayananItemS,
  PerangkatItemS,
  StatistikSettings,
  NilaiProfilS,
  TupoksiS,
  ProfilSettings,
  PpidStrukturS,
  KategoriInfoS,
  PpidSettings,
  ProdukHukumS,
  GaleriItemS,
  SopLangkahS,
  PersyaratanLayananS,
  LayananDetailSettings,
  Settings,
} from "@/lib/content/defaults";

import type { Settings } from "@/lib/content/defaults";

export { defaultSettings } from "@/lib/content/defaults";

/** Baca settings dari DB, di-merge di atas default. Toleran bila DB tak tersedia. */
export async function getSettings(): Promise<Settings> {
  try {
    await ensureSchema();
    const rows = await query<{ data: Partial<Settings> | string }>(
      "SELECT data FROM site_settings WHERE id = 1",
    );
    const rawData = rows[0]?.data;
    const saved: Partial<Settings> =
      typeof rawData === "string"
        ? (JSON.parse(rawData) as Partial<Settings>)
        : (rawData ?? {});
    return {
      site: { ...defaults.site, ...saved.site },
      jamPelayanan: saved.jamPelayanan ?? defaults.jamPelayanan,
      externalLinks: saved.externalLinks ?? defaults.externalLinks,
      tentang: {
        ...defaults.tentang,
        ...saved.tentang,
        quickFacts: saved.tentang?.quickFacts ?? defaults.tentang.quickFacts,
      },
      hero: {
        ...defaults.hero,
        ...saved.hero,
        slides:
          saved.hero?.slides && saved.hero.slides.length > 0
            ? saved.hero.slides
            : defaults.hero.slides,
      },
      layanan:
        saved.layanan && saved.layanan.length > 0
          ? saved.layanan
          : defaults.layanan,
      perangkat:
        saved.perangkat && saved.perangkat.length > 0
          ? saved.perangkat
          : defaults.perangkat,
      statistik: { ...defaults.statistik, ...saved.statistik },
      profil: {
        ...defaults.profil,
        ...saved.profil,
        misi: saved.profil?.misi ?? defaults.profil.misi,
        nilai: saved.profil?.nilai ?? defaults.profil.nilai,
        tupoksi: saved.profil?.tupoksi ?? defaults.profil.tupoksi,
      },
      ppid: {
        ...defaults.ppid,
        ...saved.ppid,
        struktur: saved.ppid?.struktur ?? defaults.ppid.struktur,
        tugas: saved.ppid?.tugas ?? defaults.ppid.tugas,
        dasarHukum: saved.ppid?.dasarHukum ?? defaults.ppid.dasarHukum,
        dataInformasi:
          saved.ppid?.dataInformasi ?? defaults.ppid.dataInformasi,
      },
      produkHukum:
        saved.produkHukum && saved.produkHukum.length > 0
          ? saved.produkHukum
          : defaults.produkHukum,
      galeri:
        saved.galeri && saved.galeri.length > 0
          ? saved.galeri
          : defaults.galeri,
      layananDetail: {
        ...defaults.layananDetail,
        ...saved.layananDetail,
        sop:
          saved.layananDetail?.sop && saved.layananDetail.sop.length > 0
            ? saved.layananDetail.sop
            : defaults.layananDetail.sop,
        persyaratan:
          saved.layananDetail?.persyaratan &&
          saved.layananDetail.persyaratan.length > 0
            ? saved.layananDetail.persyaratan
            : defaults.layananDetail.persyaratan,
        maklumatPoin:
          saved.layananDetail?.maklumatPoin ??
          defaults.layananDetail.maklumatPoin,
        pengadaanPoin:
          saved.layananDetail?.pengadaanPoin ??
          defaults.layananDetail.pengadaanPoin,
      },
    };
  } catch (err) {
    console.error("[store] getSettings gagal, memakai default:", err);
    return defaults;
  }
}

/** Simpan settings penuh ke DB (upsert baris tunggal id=1). */
export async function saveSettings(next: Settings): Promise<void> {
  await ensureSchema();
  await query(
    `INSERT INTO site_settings (id, data) VALUES (1, ?)
     ON DUPLICATE KEY UPDATE data = VALUES(data)`,
    [JSON.stringify(next)],
  );
}
