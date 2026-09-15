// Profil Kecamatan Jenar.
// CATATAN: teks Visi & Misi di bawah bersifat template — ganti dengan
// rumusan resmi saat dokumen Renstra/RPJMD Kecamatan tersedia.

export const visi =
  "Terwujudnya Kecamatan Jenar yang maju, mandiri, dan sejahtera melalui pelayanan publik yang prima, transparan, dan partisipatif.";

export const misi: string[] = [
  "Meningkatkan kualitas pelayanan administrasi dan publik yang cepat, mudah, serta bebas biaya bagi seluruh warga.",
  "Mewujudkan tata kelola pemerintahan kecamatan yang transparan, akuntabel, dan partisipatif.",
  "Mengoordinasikan penyelenggaraan pemerintahan dan pembangunan di seluruh desa dalam wilayah kecamatan.",
  "Memberdayakan ekonomi masyarakat melalui UMKM, pertanian, dan potensi lokal wilayah.",
  "Meningkatkan kualitas sumber daya manusia di bidang pendidikan, kesehatan, dan sosial keagamaan.",
];

export type NilaiProfil = {
  title: string;
  description: string;
  /** `path` SVG (stroke) untuk ikon. */
  iconPath: string;
};

// Nilai/prinsip pelayanan kecamatan (pendukung visi-misi).
export const nilaiPelayanan: NilaiProfil[] = [
  {
    title: "Transparan",
    description:
      "Keterbukaan informasi anggaran, program, dan pelayanan kepada masyarakat.",
    iconPath:
      "M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  },
  {
    title: "Melayani",
    description:
      "Pelayanan umum gratis, cepat, dan ramah untuk seluruh warga wilayah kecamatan.",
    iconPath:
      "M12 21c4.97-3.06 8-6.5 8-10a4 4 0 0 0-8-1 4 4 0 0 0-8 1c0 3.5 3.03 6.94 8 10Z",
  },
  {
    title: "Amanah",
    description:
      "Pengelolaan sumber daya dan aset daerah secara bertanggung jawab dan akuntabel.",
    iconPath:
      "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z M9.5 12l1.8 1.8L15 10",
  },
];


export type Tupoksi = {
  jabatan: string;
  ringkasan: string;
  tugas: string[];
};

// Tugas pokok & fungsi aparatur kecamatan
// (mengacu PP No. 17 Tahun 2018 tentang Kecamatan).
export const tugasPokokFungsi: Tupoksi[] = [
  {
    jabatan: "Camat",
    ringkasan:
      "Memimpin penyelenggaraan urusan pemerintahan umum di wilayah kecamatan serta melaksanakan kewenangan yang dilimpahkan oleh Bupati.",
    tugas: [
      "Menyelenggarakan urusan pemerintahan umum di tingkat kecamatan.",
      "Mengoordinasikan kegiatan pemberdayaan masyarakat serta ketenteraman dan ketertiban umum.",
      "Membina dan mengawasi penyelenggaraan pemerintahan desa.",
      "Mengoordinasikan penyelenggaraan pelayanan publik di wilayah kecamatan.",
    ],
  },
  {
    jabatan: "Sekretaris Kecamatan",
    ringkasan:
      "Membantu Camat dalam bidang administrasi dan memimpin penyelenggaraan kesekretariatan kecamatan.",
    tugas: [
      "Mengoordinasikan tugas dan fungsi subbagian serta seksi di kecamatan.",
      "Menyusun rencana kerja, anggaran, dan laporan penyelenggaraan pemerintahan kecamatan.",
      "Menata administrasi umum, aset, dan kearsipan kecamatan.",
      "Melaksanakan urusan ketatausahaan dan surat-menyurat.",
    ],
  },
  {
    jabatan: "Kasubbag Perencanaan & Keuangan",
    ringkasan:
      "Melaksanakan penyusunan perencanaan program serta pengelolaan administrasi keuangan kecamatan.",
    tugas: [
      "Menyusun rencana kerja, program, dan bahan penyusunan anggaran kecamatan.",
      "Mengelola administrasi keuangan, pembukuan, serta verifikasi belanja.",
      "Menyusun laporan pertanggungjawaban keuangan dan capaian kinerja.",
    ],
  },
  {
    jabatan: "Kasubbag Umum & Kepegawaian",
    ringkasan:
      "Melaksanakan urusan ketatausahaan, rumah tangga, sarana prasarana, dan administrasi kepegawaian.",
    tugas: [
      "Mengelola inventaris, sarana prasarana, dan administrasi umum.",
      "Melaksanakan pelayanan administrasi kepegawaian aparatur kecamatan.",
      "Menata kearsipan serta melayani kebutuhan tata usaha perkantoran.",
    ],
  },
  {
    jabatan: "Kasi Pemerintahan",
    ringkasan:
      "Melaksanakan koordinasi penyelenggaraan pemerintahan serta pembinaan dan pengawasan pemerintahan desa.",
    tugas: [
      "Mengoordinasikan administrasi kependudukan dan pertanahan.",
      "Membina dan mengawasi penyelenggaraan pemerintahan desa.",
      "Menyiapkan bahan fasilitasi penyusunan produk hukum desa.",
    ],
  },
  {
    jabatan: "Kasi Ketenteraman & Ketertiban Umum",
    ringkasan:
      "Melaksanakan koordinasi penyelenggaraan ketenteraman, ketertiban umum, dan penegakan peraturan daerah.",
    tugas: [
      "Mengoordinasikan penyelenggaraan ketenteraman dan ketertiban umum.",
      "Berkoordinasi dengan aparat keamanan dalam pembinaan ketertiban masyarakat.",
      "Memfasilitasi penanganan bencana dan kesiapsiagaan di wilayah kecamatan.",
    ],
  },
  {
    jabatan: "Kasi Pemberdayaan Masyarakat",
    ringkasan:
      "Melaksanakan koordinasi kegiatan pemberdayaan masyarakat dan pembangunan di wilayah kecamatan.",
    tugas: [
      "Mengoordinasikan pembangunan sarana prasarana dan pengembangan ekonomi masyarakat.",
      "Memfasilitasi musyawarah perencanaan pembangunan tingkat kecamatan.",
      "Melaksanakan pemberdayaan masyarakat di bidang sosial, budaya, dan keagamaan.",
    ],
  },
  {
    jabatan: "Kasi Pelayanan Umum",
    ringkasan:
      "Menyelenggarakan pelayanan administrasi terpadu kecamatan (PATEN) kepada masyarakat.",
    tugas: [
      "Memberikan pelayanan perizinan dan nonperizinan sesuai kewenangan yang dilimpahkan.",
      "Menyediakan informasi persyaratan, alur, dan waktu penyelesaian layanan.",
      "Menindaklanjuti pengaduan masyarakat atas mutu pelayanan.",
    ],
  },
];
