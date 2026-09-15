// Produk hukum Kecamatan Jenar (data contoh — lengkapi dengan dokumen resmi).

export type JenisProdukHukum =
  | "Keputusan Camat"
  | "Surat Edaran Camat"
  | "Standar Operasional Prosedur";

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
    jenis: "Keputusan Camat",
    tentang: "Penetapan Standar Pelayanan Administrasi Terpadu Kecamatan",
  },
  {
    nomor: "2",
    tahun: 2026,
    jenis: "Keputusan Camat",
    tentang: "Pembentukan Tim Koordinasi Pembangunan Tingkat Kecamatan",
  },
  {
    nomor: "3",
    tahun: 2025,
    jenis: "Keputusan Camat",
    tentang: "Penetapan Pejabat Pengelola Informasi dan Dokumentasi (PPID) Pembantu",
  },
  {
    nomor: "1",
    tahun: 2026,
    jenis: "Surat Edaran Camat",
    tentang: "Tertib Administrasi Pelayanan Surat Keterangan di Wilayah Kecamatan",
  },
  {
    nomor: "2",
    tahun: 2025,
    jenis: "Surat Edaran Camat",
    tentang: "Pembinaan dan Pengawasan Penyelenggaraan Pemerintahan Desa",
  },
  {
    nomor: "1",
    tahun: 2026,
    jenis: "Standar Operasional Prosedur",
    tentang: "SOP Pelayanan Legalisasi dan Rekomendasi Surat",
  },
  {
    nomor: "2",
    tahun: 2026,
    jenis: "Standar Operasional Prosedur",
    tentang: "SOP Penanganan Pengaduan Masyarakat",
  },
];

export const jenisProdukHukum: JenisProdukHukum[] = [
  "Keputusan Camat",
  "Surat Edaran Camat",
  "Standar Operasional Prosedur",
];
