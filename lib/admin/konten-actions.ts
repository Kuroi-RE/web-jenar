"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import {
  getSettings,
  saveSettings,
  type LayananItemS,
  type PerangkatItemS,
  type NilaiProfilS,
  type TupoksiS,
  type PpidStrukturS,
  type KategoriInfoS,
  type ProdukHukumS,
  type SakipItemS,
  type GaleriItemS,
  type SopLangkahS,
  type PersyaratanLayananS,
  type Settings,
} from "@/lib/store";

export type KontenFormState = { error?: string; success?: boolean };

const DEFAULT_ICON =
  "M9 12h6m-6 4h4m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.6a1 1 0 0 1 .7.3l5.4 5.4a1 1 0 0 1 .3.7V19a2 2 0 0 1-2 2Z";

const MAX_ROWS = 50;

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function num(formData: FormData, key: string): number {
  // Buang semua kecuali digit dan tanda minus (mis. "Rp1.759.314.000" → "1759314000").
  const raw = str(formData, key).replace(/[^\d-]/g, "");
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/** Pisahkan textarea menjadi array baris (buang baris kosong). */
function lines(formData: FormData, key: string): string[] {
  return str(formData, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

async function persist(next: Settings): Promise<KontenFormState> {
  try {
    await saveSettings(next);
  } catch {
    return { error: "Gagal menyimpan. Periksa koneksi database." };
  }
  revalidatePath("/", "layout");
  return { success: true };
}

/** Layanan unggulan (kartu beranda). */
export async function saveLayananAction(
  _prev: KontenFormState,
  formData: FormData,
): Promise<KontenFormState> {
  await requireAuth();
  const current = await getSettings();

  const items: LayananItemS[] = [];
  for (let i = 0; i < MAX_ROWS; i += 1) {
    const title = str(formData, `title_${i}`);
    if (!title) continue;
    items.push({
      title,
      desc: str(formData, `desc_${i}`),
      href: str(formData, `href_${i}`) || "#",
      icon: str(formData, `icon_${i}`) || DEFAULT_ICON,
    });
  }
  if (items.length === 0) return { error: "Minimal satu layanan harus diisi." };

  return persist({ ...current, layanan: items });
}

/** Penjabat kecamatan (struktur organisasi). */
export async function savePerangkatAction(
  _prev: KontenFormState,
  formData: FormData,
): Promise<KontenFormState> {
  await requireAuth();
  const current = await getSettings();

  const items: PerangkatItemS[] = [];
  for (let i = 0; i < MAX_ROWS; i += 1) {
    const position = str(formData, `position_${i}`);
    if (!position) continue;
    items.push({
      position,
      name: str(formData, `name_${i}`),
      featured: str(formData, `featured_${i}`) === "on",
      photo: str(formData, `photo_${i}`),
    });
  }
  if (items.length === 0) return { error: "Minimal satu jabatan harus diisi." };

  return persist({ ...current, perangkat: items });
}

/** Statistik kependudukan + peta. */
export async function saveStatistikAction(
  _prev: KontenFormState,
  formData: FormData,
): Promise<KontenFormState> {
  await requireAuth();
  const current = await getSettings();

  return persist({
    ...current,
    statistik: {
      total: num(formData, "total"),
      laki: num(formData, "laki"),
      perempuan: num(formData, "perempuan"),
      petaQuery: str(formData, "petaQuery") || current.statistik.petaQuery,
    },
  });
}

/** Profil: visi, misi, nilai pelayanan, tugas pokok & fungsi. */
export async function saveProfilAction(
  _prev: KontenFormState,
  formData: FormData,
): Promise<KontenFormState> {
  await requireAuth();
  const current = await getSettings();

  const nilai: NilaiProfilS[] = [];
  for (let i = 0; i < MAX_ROWS; i += 1) {
    const title = str(formData, `nilai_title_${i}`);
    if (!title) continue;
    nilai.push({
      title,
      description: str(formData, `nilai_desc_${i}`),
      icon: str(formData, `nilai_icon_${i}`) || DEFAULT_ICON,
    });
  }

  const tupoksi: TupoksiS[] = [];
  for (let i = 0; i < MAX_ROWS; i += 1) {
    const jabatan = str(formData, `tup_jabatan_${i}`);
    if (!jabatan) continue;
    tupoksi.push({
      jabatan,
      ringkasan: str(formData, `tup_ringkasan_${i}`),
      tugas: lines(formData, `tup_tugas_${i}`),
    });
  }

  return persist({
    ...current,
    profil: {
      visi: str(formData, "visi"),
      misi: lines(formData, "misi"),
      nilai: nilai.length > 0 ? nilai : current.profil.nilai,
      tupoksi: tupoksi.length > 0 ? tupoksi : current.profil.tupoksi,
    },
  });
}

/** PPID: profil, struktur, tugas, dasar hukum, klasifikasi informasi. */
export async function savePpidAction(
  _prev: KontenFormState,
  formData: FormData,
): Promise<KontenFormState> {
  await requireAuth();
  const current = await getSettings();

  const struktur: PpidStrukturS[] = [];
  for (let i = 0; i < MAX_ROWS; i += 1) {
    const jabatan = str(formData, `str_jabatan_${i}`);
    if (!jabatan) continue;
    struktur.push({ jabatan, keterangan: str(formData, `str_ket_${i}`) });
  }

  const dataInformasi: KategoriInfoS[] = [];
  for (let i = 0; i < MAX_ROWS; i += 1) {
    const judul = str(formData, `info_judul_${i}`);
    if (!judul) continue;
    dataInformasi.push({ judul, deskripsi: str(formData, `info_desk_${i}`) });
  }

  return persist({
    ...current,
    ppid: {
      profil: str(formData, "ppid_profil"),
      struktur: struktur.length > 0 ? struktur : current.ppid.struktur,
      tugas: lines(formData, "ppid_tugas"),
      dasarHukum: lines(formData, "ppid_dasar"),
      dataInformasi:
        dataInformasi.length > 0 ? dataInformasi : current.ppid.dataInformasi,
    },
  });
}

/** Produk Hukum: daftar peraturan/keputusan. */
export async function saveProdukHukumAction(
  _prev: KontenFormState,
  formData: FormData,
): Promise<KontenFormState> {
  await requireAuth();
  const current = await getSettings();

  const items: ProdukHukumS[] = [];
  for (let i = 0; i < MAX_ROWS; i += 1) {
    const tentang = str(formData, `ph_tentang_${i}`);
    if (!tentang) continue;
    items.push({
      jenis: str(formData, `ph_jenis_${i}`) || "Keputusan Camat",
      nomor: str(formData, `ph_nomor_${i}`),
      tahun: num(formData, `ph_tahun_${i}`),
      tentang,
      href: str(formData, `ph_href_${i}`),
    });
  }

  return persist({
    ...current,
    produkHukum: items.length > 0 ? items : current.produkHukum,
  });
}

/** SAKIP: daftar dokumen akuntabilitas kinerja. */
export async function saveSakipAction(
  _prev: KontenFormState,
  formData: FormData,
): Promise<KontenFormState> {
  await requireAuth();
  const current = await getSettings();

  const items: SakipItemS[] = [];
  for (let i = 0; i < MAX_ROWS; i += 1) {
    const nama = str(formData, `sakip_nama_${i}`);
    const href = str(formData, `sakip_href_${i}`);
    if (!nama && !href) continue;
    if (!nama) {
      return { error: `Baris dokumen ke-${i + 1}: Nama dokumen wajib diisi.` };
    }
    if (!href) {
      return { error: `Dokumen "${nama}": File PDF wajib diunggah.` };
    }
    items.push({ nama, href });
  }

  return persist({
    ...current,
    sakip: items,
  });
}

/** Galeri: daftar foto dokumentasi. */
export async function saveGaleriAction(
  _prev: KontenFormState,
  formData: FormData,
): Promise<KontenFormState> {
  await requireAuth();
  const current = await getSettings();

  const items: GaleriItemS[] = [];
  for (let i = 0; i < MAX_ROWS; i += 1) {
    const src = str(formData, `gal_src_${i}`);
    if (!src) continue;
    items.push({
      src,
      judul: str(formData, `gal_judul_${i}`),
      alt: str(formData, `gal_alt_${i}`) || str(formData, `gal_judul_${i}`),
      kategori: str(formData, `gal_kategori_${i}`),
    });
  }

  return persist({
    ...current,
    galeri: items.length > 0 ? items : current.galeri,
  });
}

/** Halaman Layanan Publik: SOP, jenis pelayanan & persyaratan, maklumat, pengadaan. */
export async function saveLayananDetailAction(
  _prev: KontenFormState,
  formData: FormData,
): Promise<KontenFormState> {
  await requireAuth();
  const current = await getSettings();

  const sop: SopLangkahS[] = [];
  for (let i = 0; i < MAX_ROWS; i += 1) {
    const judul = str(formData, `sop_judul_${i}`);
    if (!judul) continue;
    sop.push({ judul, deskripsi: str(formData, `sop_deskripsi_${i}`) });
  }

  const persyaratan: PersyaratanLayananS[] = [];
  for (let i = 0; i < MAX_ROWS; i += 1) {
    const nama = str(formData, `pl_nama_${i}`);
    if (!nama) continue;
    persyaratan.push({ nama, berkas: lines(formData, `pl_berkas_${i}`) });
  }

  return persist({
    ...current,
    layananDetail: {
      sop: sop.length > 0 ? sop : current.layananDetail.sop,
      persyaratan:
        persyaratan.length > 0
          ? persyaratan
          : current.layananDetail.persyaratan,
      maklumat: str(formData, "maklumat") || current.layananDetail.maklumat,
      maklumatPoin: lines(formData, "maklumatPoin"),
      pengadaanPoin: lines(formData, "pengadaanPoin"),
    },
  });
}
