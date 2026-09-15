// Profil Desa Jenar.
// CATATAN: teks Visi & Misi di bawah bersifat template — ganti dengan
// rumusan resmi desa saat dokumen RPJMDes tersedia.

export const visi =
  "Terwujudnya Desa Jenar yang maju, mandiri, dan sejahtera melalui pelayanan publik yang prima, transparan, dan partisipatif.";

export const misi: string[] = [
  "Meningkatkan kualitas pelayanan administrasi dan publik yang cepat, mudah, serta bebas biaya bagi seluruh warga.",
  "Mewujudkan tata kelola pemerintahan desa yang transparan, akuntabel, dan partisipatif.",
  "Mendorong pembangunan infrastruktur desa yang merata dan berkelanjutan.",
  "Memberdayakan ekonomi masyarakat melalui UMKM, pertanian, dan potensi lokal desa.",
  "Meningkatkan kualitas sumber daya manusia di bidang pendidikan, kesehatan, dan sosial keagamaan.",
];

export type NilaiProfil = {
  title: string;
  description: string;
  /** `path` SVG (stroke) untuk ikon. */
  iconPath: string;
};

// Nilai/prinsip pelayanan desa (pendukung visi-misi).
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
      "Pelayanan umum gratis, cepat, dan ramah untuk seluruh warga desa.",
    iconPath:
      "M12 21c4.97-3.06 8-6.5 8-10a4 4 0 0 0-8-1 4 4 0 0 0-8 1c0 3.5 3.03 6.94 8 10Z",
  },
  {
    title: "Amanah",
    description:
      "Pengelolaan sumber daya desa secara bertanggung jawab dan akuntabel.",
    iconPath:
      "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z M9.5 12l1.8 1.8L15 10",
  },
];


export type Tupoksi = {
  jabatan: string;
  ringkasan: string;
  tugas: string[];
};

// Tugas pokok & fungsi perangkat desa (mengacu Permendagri No. 84 Tahun 2015).
export const tugasPokokFungsi: Tupoksi[] = [
  {
    jabatan: "Kepala Desa",
    ringkasan:
      "Menyelenggarakan pemerintahan desa, melaksanakan pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat desa.",
    tugas: [
      "Memimpin penyelenggaraan pemerintahan desa.",
      "Menetapkan Peraturan Desa bersama Badan Permusyawaratan Desa (BPD).",
      "Membina kehidupan dan ketenteraman masyarakat desa.",
      "Mengelola keuangan dan aset desa secara transparan dan akuntabel.",
    ],
  },
  {
    jabatan: "Sekretaris Desa",
    ringkasan:
      "Membantu Kepala Desa dalam bidang administrasi pemerintahan dan memimpin kesekretariatan.",
    tugas: [
      "Mengoordinasikan tugas dan fungsi para kepala urusan.",
      "Menyusun rancangan APBDes dan laporan penyelenggaraan pemerintahan desa.",
      "Menata administrasi umum, aset, dan kearsipan desa.",
      "Melaksanakan urusan ketatausahaan dan surat-menyurat.",
    ],
  },
  {
    jabatan: "Kaur Keuangan",
    ringkasan:
      "Melaksanakan fungsi kebendaharaan dan pengelolaan administrasi keuangan desa.",
    tugas: [
      "Mengelola administrasi keuangan dan sumber pendapatan desa.",
      "Menyiapkan pembukuan serta verifikasi penerimaan dan pengeluaran.",
      "Menyusun laporan pertanggungjawaban keuangan desa.",
    ],
  },
  {
    jabatan: "Kaur Umum & Perencanaan",
    ringkasan:
      "Melaksanakan urusan ketatausahaan, umum, serta penyusunan rencana kegiatan dan anggaran desa.",
    tugas: [
      "Mengelola inventaris, sarana prasarana, dan administrasi umum.",
      "Menyusun rencana kerja, RKPDes, dan bahan penyusunan APBDes.",
      "Melaksanakan pelayanan administrasi kepegawaian aparatur desa.",
    ],
  },
  {
    jabatan: "Kasi Pemerintahan",
    ringkasan:
      "Melaksanakan pengelolaan administrasi kependudukan dan penyelenggaraan pemerintahan desa.",
    tugas: [
      "Mengelola administrasi kependudukan dan pertanahan.",
      "Menyelenggarakan ketenteraman dan ketertiban masyarakat.",
      "Menyiapkan bahan penyusunan produk hukum desa.",
    ],
  },
  {
    jabatan: "Kasi Kesejahteraan & Pelayanan",
    ringkasan:
      "Melaksanakan pembangunan, pemberdayaan, serta pelayanan kepada masyarakat desa.",
    tugas: [
      "Melaksanakan pembangunan sarana prasarana dan ekonomi desa.",
      "Melaksanakan pemberdayaan masyarakat di bidang sosial, budaya, dan keagamaan.",
      "Memberikan pelayanan kepada masyarakat sesuai bidang tugasnya.",
    ],
  },
];
