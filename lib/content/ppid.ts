// PPID — Pejabat Pengelola Informasi dan Dokumentasi Desa Sidoharjo.
// Konten mengacu UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.

export const ppidProfil =
  "PPID (Pejabat Pengelola Informasi dan Dokumentasi) Desa Sidoharjo bertanggung jawab menyediakan, menyimpan, mendokumentasikan, dan melayani permintaan informasi publik. PPID hadir untuk mewujudkan penyelenggaraan pemerintahan desa yang terbuka, transparan, dan akuntabel sesuai amanat Undang-Undang Keterbukaan Informasi Publik.";

export type PpidStruktur = { jabatan: string; keterangan: string };

export const ppidStruktur: PpidStruktur[] = [
  {
    jabatan: "Pembina / Atasan PPID",
    keterangan: "Kepala Desa Sidoharjo",
  },
  {
    jabatan: "Ketua PPID",
    keterangan: "Sekretaris Desa",
  },
  {
    jabatan: "Bidang Pelayanan Informasi",
    keterangan: "Melayani permohonan dan penyediaan informasi publik.",
  },
  {
    jabatan: "Bidang Pengolahan Data & Dokumentasi",
    keterangan: "Menghimpun, mengolah, dan mendokumentasikan informasi.",
  },
  {
    jabatan: "Bidang Penyelesaian Sengketa",
    keterangan: "Menangani keberatan dan sengketa informasi publik.",
  },
];

export const ppidTugas: string[] = [
  "Menyediakan dan memberikan pelayanan informasi publik kepada masyarakat.",
  "Mengumpulkan, mengklasifikasikan, dan mendokumentasikan informasi publik.",
  "Menyimpan dan mengamankan informasi serta dokumentasi desa.",
  "Menyelesaikan permohonan, keberatan, dan sengketa informasi publik.",
  "Mengembangkan sistem penyediaan layanan informasi yang mudah diakses.",
];

export const ppidDasarHukum: string[] = [
  "Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik.",
  "Undang-Undang Nomor 6 Tahun 2014 tentang Desa.",
  "Peraturan Komisi Informasi Nomor 1 Tahun 2010 tentang Standar Layanan Informasi Publik.",
  "Peraturan Komisi Informasi Nomor 1 Tahun 2018 tentang Standar Layanan Informasi Publik Desa.",
];

export type KategoriInformasi = { judul: string; deskripsi: string };

export const ppidDataInformasi: KategoriInformasi[] = [
  {
    judul: "Informasi Berkala",
    deskripsi:
      "Informasi yang wajib disediakan dan diumumkan secara berkala, seperti profil desa dan laporan keuangan.",
  },
  {
    judul: "Informasi Serta Merta",
    deskripsi:
      "Informasi yang dapat mengancam hajat hidup orang banyak dan ketertiban umum, diumumkan tanpa penundaan.",
  },
  {
    judul: "Informasi Setiap Saat",
    deskripsi:
      "Informasi yang wajib tersedia dan dapat diakses masyarakat setiap saat, seperti Peraturan Desa dan APBDes.",
  },
  {
    judul: "Informasi Dikecualikan",
    deskripsi:
      "Informasi yang dikecualikan sesuai ketentuan peraturan perundang-undangan yang berlaku.",
  },
];
