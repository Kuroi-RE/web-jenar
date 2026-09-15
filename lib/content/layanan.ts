import { site } from "./site";

export type Layanan = {
  title: string;
  desc: string;
  href: string;
  // SVG path (stroke) for the icon.
  path: string;
};

export const layananItems: Layanan[] = [
  {
    title: "SOP Pelayanan Administrasi",
    desc: "Standar operasional prosedur pelayanan administrasi bagi masyarakat.",
    href: "/layanan#sop",
    path: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4",
  },
  {
    title: "Pelayanan & Persyaratan",
    desc: "Jenis pelayanan beserta berkas dan persyaratan yang diperlukan.",
    href: "/layanan#persyaratan",
    path: "M9 12h6m-6 4h4m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.6a1 1 0 0 1 .7.3l5.4 5.4a1 1 0 0 1 .3.7V19a2 2 0 0 1-2 2Z",
  },
  {
    title: "Maklumat Pelayanan",
    desc: "Pernyataan komitmen pemerintah desa atas mutu pelayanan publik.",
    href: "/layanan#maklumat",
    path: "M3 11 21 6v12L3 13v-2Zm8.6 5.8a3 3 0 1 1-5.8-1.6",
  },
  {
    title: "Layanan Pengaduan",
    desc: "Sampaikan keluhan dan aspirasi terkait pelayanan desa secara online.",
    href: "/pengaduan",
    path: "M8 10h8M8 14h5m-9 6 3.5-3H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14Z",
  },
  {
    title: "Survei Kepuasan Masyarakat",
    desc: "Berikan penilaian Anda terhadap kualitas pelayanan Desa Jenar.",
    href: site.links.skm,
    path: "M11.5 3.5a.6.6 0 0 1 1 0l2.3 4.6 5.1.7a.6.6 0 0 1 .3 1l-3.7 3.6.9 5.1a.6.6 0 0 1-.9.6L12 17.3l-4.5 2.4a.6.6 0 0 1-.9-.6l.9-5.1-3.7-3.6a.6.6 0 0 1 .3-1l5.1-.7 2.3-4.6Z",
  },
  {
    title: "Pengadaan Barang & Jasa",
    desc: "Informasi pengadaan barang dan jasa di lingkungan Desa Jenar.",
    href: "/layanan#pengadaan",
    path: "M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
];


// ---- Detail untuk halaman /layanan ----

export type SopLangkah = { judul: string; deskripsi: string };

export const sopLangkah: SopLangkah[] = [
  {
    judul: "Datang & Ambil Antrean",
    deskripsi:
      "Warga datang ke kantor desa pada jam pelayanan dan mengambil nomor antrean di loket pelayanan.",
  },
  {
    judul: "Menyerahkan Berkas",
    deskripsi:
      "Menyerahkan berkas persyaratan sesuai jenis layanan kepada petugas untuk diperiksa kelengkapannya.",
  },
  {
    judul: "Verifikasi & Proses",
    deskripsi:
      "Petugas memverifikasi berkas dan memproses dokumen. Berkas yang lengkap diproses pada hari yang sama.",
  },
  {
    judul: "Penandatanganan",
    deskripsi:
      "Dokumen ditandatangani oleh Kepala Desa atau pejabat yang berwenang serta dibubuhi stempel.",
  },
  {
    judul: "Penyerahan Dokumen",
    deskripsi:
      "Dokumen yang telah selesai diserahkan kepada warga. Seluruh pelayanan tidak dipungut biaya.",
  },
];

export type PersyaratanLayanan = { nama: string; berkas: string[] };

export const persyaratanLayanan: PersyaratanLayanan[] = [
  {
    nama: "Surat Pengantar KTP / Kartu Keluarga",
    berkas: [
      "Fotokopi Kartu Keluarga",
      "Surat pengantar RT/RW",
      "KTP lama (untuk perpanjangan)",
    ],
  },
  {
    nama: "Surat Keterangan Domisili",
    berkas: [
      "Fotokopi KTP dan Kartu Keluarga",
      "Surat pengantar RT/RW",
      "Pas foto (bila diperlukan)",
    ],
  },
  {
    nama: "Surat Keterangan Tidak Mampu (SKTM)",
    berkas: [
      "Fotokopi KTP dan Kartu Keluarga",
      "Surat pengantar RT/RW",
      "Data pendukung kondisi ekonomi",
    ],
  },
  {
    nama: "Surat Keterangan Usaha (SKU)",
    berkas: [
      "Fotokopi KTP dan Kartu Keluarga",
      "Surat pengantar RT/RW",
      "Keterangan jenis dan lokasi usaha",
    ],
  },
  {
    nama: "Surat Keterangan Kelahiran / Kematian",
    berkas: [
      "Fotokopi KTP pelapor dan Kartu Keluarga",
      "Surat pengantar RT/RW",
      "Surat keterangan dari bidan/rumah sakit (kelahiran)",
    ],
  },
];

export const maklumatPelayanan =
  "Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan, dan apabila tidak menepati janji ini kami siap menerima sanksi sesuai peraturan perundang-undangan yang berlaku.";

export const maklumatPoin: string[] = [
  "Memberikan pelayanan yang mudah, cepat, tepat, dan tanpa biaya.",
  "Bersikap ramah, adil, dan tidak diskriminatif kepada seluruh warga.",
  "Menyelesaikan pengaduan masyarakat secara bertanggung jawab.",
  "Menjaga kerahasiaan data dan informasi pribadi warga.",
];

export const pengadaanPoin: string[] = [
  "Pengadaan barang/jasa desa dilaksanakan secara swakelola dengan mengutamakan sumber daya dan tenaga kerja lokal.",
  "Proses pengadaan dilakukan secara transparan, akuntabel, dan sesuai ketentuan peraturan yang berlaku.",
  "Informasi rencana dan realisasi pengadaan diumumkan kepada masyarakat.",
];
