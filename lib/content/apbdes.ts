// Data APBDes Desa Sidoharjo Tahun Anggaran 2026 (dari §6 AGENTS.md).

export type ApbdesPost = {
  /** Singkatan/kode ringkas (mis. "PAD"). */
  code: string;
  /** Nama lengkap sumber pendapatan. */
  label: string;
  /** Nominal dalam rupiah. */
  amount: number;
};

export const apbdesTahun = 2026 as const;

export const apbdesRingkasan = {
  pendapatan: 1_759_314_000,
  belanja: 1_983_522_157,
} as const;

/** Selisih belanja terhadap pendapatan (positif = defisit). */
export const apbdesDefisit =
  apbdesRingkasan.belanja - apbdesRingkasan.pendapatan;

export const apbdesPendapatan: ApbdesPost[] = [
  { code: "PAD", label: "Pendapatan Asli Desa", amount: 615_440_000 },
  { code: "ADD", label: "Alokasi Dana Desa", amount: 554_907_000 },
  { code: "DD", label: "Dana Desa", amount: 373_456_000 },
  { code: "BANPROV", label: "Bantuan Keuangan Provinsi", amount: 80_000_000 },
  { code: "BHP", label: "Bagi Hasil Pajak & Retribusi", amount: 30_511_000 },
];

/** Total dari rincian pendapatan di atas (untuk basis proporsi progress bar). */
export const apbdesPendapatanTotal = apbdesPendapatan.reduce(
  (sum, post) => sum + post.amount,
  0,
);

/** Format nilai rupiah penuh, mis. "Rp 1.759.314.000". */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format ringkas untuk angka besar, mis. "1,76 M" atau "615,4 Jt". */
export function formatRupiahRingkas(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 2,
    })} M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} Jt`;
  }
  return formatRupiah(value);
}
