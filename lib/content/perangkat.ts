// Struktur organisasi Pemerintah Kecamatan Jenar (seed awal).
// Nama pejabat dikosongkan (tampil "Nama menyusul") — isi lewat panel
// admin → Penjabat saat data resmi tersedia.
// Susunan jabatan mengacu PP No. 17 Tahun 2018 tentang Kecamatan.

export type Perangkat = {
  /** Nama lengkap; kosongkan bila belum ada data resmi. */
  name?: string;
  /** Jabatan dalam struktur pemerintahan kecamatan. */
  position: string;
  /** Path foto di /public (opsional). */
  photo?: string;
  /** Alt deskriptif untuk foto. */
  photoAlt?: string;
  /** Tandai sebagai pimpinan (kartu unggulan). */
  featured?: boolean;
};

export const perangkatKecamatan: Perangkat[] = [
  {
    position: "Camat",
    featured: true,
  },
  {
    position: "Sekretaris Kecamatan",
  },
  {
    position: "Kasubbag Umum & Kepegawaian",
  },
  {
    position: "Kasubbag Perencanaan & Keuangan",
  },
  {
    position: "Kasi Pemerintahan",
  },
  {
    position: "Kasi Ketenteraman & Ketertiban Umum",
  },
  {
    position: "Kasi Pemberdayaan Masyarakat",
  },
  {
    position: "Kasi Pelayanan Umum",
  },
];

/** Inisial dari nama untuk avatar fallback, mis. "Budi Santoso" -> "BS". */
export function initials(name: string): string {
  const parts = name
    .replace(/,.*$/, "") // buang gelar setelah koma
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}
