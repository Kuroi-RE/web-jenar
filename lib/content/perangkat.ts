// Struktur organisasi Pemerintah Desa Sidoharjo.
// Nama Kepala Desa & Sekretaris Desa dari §6 AGENTS.md (data terkonfirmasi).
// Jabatan lain: nama menyusul (photo & nama diisi saat data resmi tersedia).

export type Perangkat = {
  /** Nama lengkap; kosongkan bila belum ada data resmi. */
  name?: string;
  /** Jabatan dalam struktur pemerintahan desa. */
  position: string;
  /** Path foto di /public (opsional). */
  photo?: string;
  /** Alt deskriptif untuk foto. */
  photoAlt?: string;
  /** Tandai sebagai pimpinan (kartu unggulan). */
  featured?: boolean;
};

export const perangkatDesa: Perangkat[] = [
  {
    name: "Titik Saptawati, S.Pd, M.H",
    position: "Kepala Desa",
    featured: true,
  },
  {
    name: "Sugiyanto",
    position: "Sekretaris Desa",
  },
  {
    position: "Kaur Keuangan",
  },
  {
    position: "Kaur Umum & Perencanaan",
  },
  {
    position: "Kasi Pemerintahan",
  },
  {
    position: "Kasi Kesejahteraan & Pelayanan",
  },
];

/** Inisial dari nama untuk avatar fallback, mis. "Titik Saptawati" -> "TS". */
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
