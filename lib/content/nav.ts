import { site } from "./site.ts";

export type NavLink = { label: string; href: string };
export type NavDropdown = { label: string; key: string; items: NavLink[] };

// Menu dropdown desktop (Profil, Layanan, PPID).
export const dropdowns: NavDropdown[] = [
  {
    label: "Profil",
    key: "profil",
    items: [
      { label: "Visi & Misi", href: "/profil/visi-misi" },
      { label: "Struktur Organisasi", href: "/profil/struktur-organisasi" },
      { label: "Tugas Pokok & Fungsi", href: "/profil/tugas-pokok-fungsi" },
      { label: "Demografi", href: "/profil/demografi" },
      { label: "Peta Kecamatan", href: "/#statistik" },
      { label: "Penjabat", href: "/#perangkat" },
    ],
  },
  {
    label: "Layanan",
    key: "layanan",
    items: [
      { label: "SOP Pelayanan Administrasi", href: "/layanan#sop" },
      { label: "Pelayanan & Persyaratan", href: "/layanan#persyaratan" },
      { label: "Maklumat Pelayanan", href: "/layanan#maklumat" },
      { label: "Layanan Pengaduan", href: "/pengaduan" },
      { label: "Alur Pengaduan Masyarakat", href: "/pengaduan#alur" },
      { label: "Survei Kepuasan Masyarakat", href: site.links.skm },
      { label: "Pengadaan Barang & Jasa", href: "/layanan#pengadaan" },
    ],
  },
  {
    label: "PPID",
    key: "ppid",
    items: [
      { label: "Profil PPID", href: "/ppid#profil" },
      { label: "Struktur PPID", href: "/ppid#struktur" },
      { label: "Tugas & Fungsi PPID", href: "/ppid#tugas" },
      { label: "Dasar Hukum", href: "/ppid#dasar-hukum" },
      { label: "Data & Informasi Publik", href: "/ppid#data" },
    ],
  },
];

// Link tunggal (setelah dropdown).
export const simpleLinks: NavLink[] = [
  { label: "Produk Hukum", href: "/produk-hukum" },
  { label: "Berita", href: "/berita" },
  { label: "Galeri", href: "/galeri" },
];

// Grup untuk drawer mobile (versi ringkas).
export const mobileGroups: NavDropdown[] = [
  {
    label: "Profil",
    key: "profil",
    items: [
      { label: "Visi & Misi", href: "/profil/visi-misi" },
      { label: "Struktur Organisasi", href: "/profil/struktur-organisasi" },
      { label: "Demografi", href: "/profil/demografi" },
      { label: "Penjabat", href: "/#perangkat" },
    ],
  },
  {
    label: "Layanan",
    key: "layanan",
    items: [
      { label: "SOP Pelayanan", href: "/layanan#sop" },
      { label: "Pelayanan & Persyaratan", href: "/layanan#persyaratan" },
      { label: "Layanan Pengaduan", href: "/pengaduan" },
      { label: "Survei Kepuasan", href: site.links.skm },
    ],
  },
  {
    label: "PPID",
    key: "ppid",
    items: [
      { label: "Profil PPID", href: "/ppid#profil" },
      { label: "Struktur PPID", href: "/ppid#struktur" },
      { label: "Data & Informasi", href: "/ppid#data" },
    ],
  },
];
