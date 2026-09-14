// Statistik kependudukan Desa Sidoharjo (dari §6 AGENTS.md).

export const pendudukTotal = 4089;
export const pendudukLaki = 1977;
export const pendudukPerempuan = 2112;

export type StatistikKartu = {
  label: string;
  value: number;
  /** Keterangan singkat di bawah angka. */
  caption: string;
  /** `path` SVG (stroke) untuk ikon. */
  iconPath: string;
  /** Warna aksen kartu. */
  tone: "primary" | "accent";
};

export const statistikKartu: StatistikKartu[] = [
  {
    label: "Total Penduduk",
    value: pendudukTotal,
    caption: "Jiwa terdaftar",
    // users
    iconPath:
      "M17 20h5v-1a4 4 0 0 0-3-3.87M9 20H4v-1a4 4 0 0 1 3-3.87m10-4.13a3 3 0 1 0-4-4M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm3 9a3 3 0 0 0-6 0v0",
    tone: "primary",
  },
  {
    label: "Laki-laki",
    value: pendudukLaki,
    caption: "Penduduk laki-laki",
    // male
    iconPath:
      "M10 20a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM14.25 9.75 21 3M16 3h5v5",
    tone: "primary",
  },
  {
    label: "Perempuan",
    value: pendudukPerempuan,
    caption: "Penduduk perempuan",
    // female
    iconPath:
      "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 15v6M9 18h6",
    tone: "accent",
  },
];

/** Peta: query alamat untuk Google Maps embed (tanpa API key). */
export const petaQuery = "Kantor Desa Sidoharjo, Sidoharjo, Sragen, Jawa Tengah 57281";

export const petaEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
  petaQuery,
)}&z=15&output=embed`;

/** Format angka ribuan gaya Indonesia, mis. 4089 -> "4.089". */
export function formatAngka(value: number): string {
  return value.toLocaleString("id-ID");
}
