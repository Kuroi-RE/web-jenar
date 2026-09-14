// Produk hukum Desa Sidoharjo (data contoh — lengkapi dengan dokumen resmi).

export type JenisProdukHukum =
  | "Peraturan Desa"
  | "Peraturan Kepala Desa"
  | "Keputusan Kepala Desa";

export type ProdukHukum = {
  nomor: string;
  tahun: number;
  jenis: JenisProdukHukum;
  tentang: string;
  /** Tautan dokumen (opsional). */
  href?: string;
};

export const produkHukum: ProdukHukum[] = [
  {
    nomor: "1",
    tahun: 2026,
    jenis: "Peraturan Desa",
    tentang: "Anggaran Pendapatan dan Belanja Desa (APBDes) Tahun 2026",
  },
  {
    nomor: "2",
    tahun: 2025,
    jenis: "Peraturan Desa",
    tentang: "Rencana Kerja Pemerintah Desa (RKPDes) Tahun 2026",
  },
  {
    nomor: "3",
    tahun: 2025,
    jenis: "Peraturan Desa",
    tentang: "Pengelolaan Keuangan dan Aset Desa",
  },
  {
    nomor: "1",
    tahun: 2026,
    jenis: "Peraturan Kepala Desa",
    tentang: "Penjabaran APBDes Tahun Anggaran 2026",
  },
  {
    nomor: "2",
    tahun: 2025,
    jenis: "Peraturan Kepala Desa",
    tentang: "Standar Pelayanan Administrasi Desa",
  },
  {
    nomor: "5",
    tahun: 2026,
    jenis: "Keputusan Kepala Desa",
    tentang: "Pembentukan Panitia Pengisian Perangkat Desa",
  },
  {
    nomor: "3",
    tahun: 2025,
    jenis: "Keputusan Kepala Desa",
    tentang: "Penetapan Pejabat Pengelola Informasi dan Dokumentasi (PPID)",
  },
];

export const jenisProdukHukum: JenisProdukHukum[] = [
  "Peraturan Desa",
  "Peraturan Kepala Desa",
  "Keputusan Kepala Desa",
];
