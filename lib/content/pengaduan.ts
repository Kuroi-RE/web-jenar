import { site } from "./site.ts";

export type AlurPengaduan = { judul: string; deskripsi: string };

// Alur penanganan pengaduan masyarakat.
export const alurPengaduan: AlurPengaduan[] = [
  {
    judul: "Penyampaian Aduan",
    deskripsi:
      "Masyarakat menyampaikan pengaduan melalui kanal resmi (formulir online, datang langsung, atau telepon).",
  },
  {
    judul: "Pencatatan & Verifikasi",
    deskripsi:
      "Petugas mencatat dan memverifikasi aduan serta melengkapi data yang diperlukan.",
  },
  {
    judul: "Telaah & Tindak Lanjut",
    deskripsi:
      "Aduan ditelaah dan diteruskan kepada bidang terkait untuk ditindaklanjuti sesuai kewenangan.",
  },
  {
    judul: "Penyelesaian",
    deskripsi:
      "Penyelesaian dilakukan dan hasilnya disampaikan kembali kepada pelapor secara bertanggung jawab.",
  },
];

export type KanalPengaduan = {
  nama: string;
  keterangan: string;
  href: string;
  /** `path` SVG (stroke) untuk ikon. */
  iconPath: string;
  external?: boolean;
};

export const kanalPengaduan: KanalPengaduan[] = [
  {
    nama: "Formulir Pengaduan Online",
    keterangan: "Sampaikan aduan Anda melalui formulir daring resmi kecamatan.",
    href: site.links.aduan,
    external: true,
    iconPath:
      "M8 10h8M8 14h5m-9 6 3.5-3H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14Z",
  },
  {
    nama: "Survei Anti Korupsi (SPAK)",
    keterangan: "Laporkan dugaan penyimpangan melalui survei anti korupsi.",
    href: site.links.spak,
    external: true,
    iconPath:
      "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z M9.5 12l1.8 1.8L15 10",
  },
  {
    nama: "Datang Langsung / Telepon",
    keterangan: `Kunjungi kantor kecamatan pada jam pelayanan atau hubungi ${site.phone}.`,
    href: `tel:${site.phoneIntl}`,
    iconPath:
      "M2.25 6.75c0 8.28 6.72 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.37a1.5 1.5 0 0 0-1.14-1.46l-3.5-.88a1.5 1.5 0 0 0-1.54.6l-.7 1a11.3 11.3 0 0 1-5.1-5.1l1-.7a1.5 1.5 0 0 0 .6-1.54l-.88-3.5A1.5 1.5 0 0 0 6.87 3H5.5A2.25 2.25 0 0 0 3.25 5.25Z",
  },
];
