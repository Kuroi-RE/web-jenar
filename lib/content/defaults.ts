// Tipe & nilai default (seed) untuk seluruh konten yang dapat diedit admin.
//
// CATATAN IMPOR: berkas ini juga di-import oleh script Node biasa
// (scripts/db-export-sql.mjs) yang dijalankan tanpa bundler. Karena itu:
//   - JANGAN pakai alias "@/..." di sini — gunakan path relatif.
//   - Sertakan ekstensi ".ts" pada impor relatif agar resolusi ESM Node jalan.
//   - JANGAN import "server-only" atau modul yang menyentuh database.
import { site as defaultSite, jamPelayanan as defaultJam } from "./site.ts";
import { heroSlides as defaultHeroSlides } from "./hero.ts";
import {
  layananItems as defaultLayanan,
  sopLangkah as defSop,
  persyaratanLayanan as defPersyaratan,
  maklumatPelayanan as defMaklumat,
  maklumatPoin as defMaklumatPoin,
  pengadaanPoin as defPengadaanPoin,
} from "./layanan.ts";
import { perangkatKecamatan as defaultPerangkat } from "./perangkat.ts";
import {
  pendudukTotal as defTotal,
  pendudukLaki as defLaki,
  pendudukPerempuan as defPerempuan,
  petaQuery as defPetaQuery,
} from "./statistik.ts";
import {
  visi as defVisi,
  misi as defMisi,
  nilaiPelayanan as defNilai,
  tugasPokokFungsi as defTupoksi,
} from "./profil.ts";
import {
  ppidProfil as defPpidProfil,
  ppidStruktur as defPpidStruktur,
  ppidTugas as defPpidTugas,
  ppidDasarHukum as defPpidDasarHukum,
  ppidDataInformasi as defPpidDataInformasi,
} from "./ppid.ts";
import { produkHukum as defProdukHukum } from "./produk-hukum.ts";
import { galeriItems as defGaleri } from "./galeri.ts";

export type SiteSettings = {
  name: string;
  legalName: string;
  tagline: string;
  region: string;
  slogan: string;
  url: string;
  email: string;
  phone: string;
  phoneIntl: string;
  address: string;
  links: { aduan: string; skm: string; spak: string };
  social: { facebook: string; instagram: string; youtube: string };
};

export type JamRow = { day: string; time: string; rest: string | null };

export type ExternalLink = { label: string; url: string };

export type TentangSettings = {
  paragraf1: string;
  paragraf2: string;
  quickFacts: { value: string; label: string }[];
};

export type HeroSlide = { img: string; alt: string };

export type HeroSettings = {
  eyebrow: string;
  subtitle: string;
  description: string;
  slides: HeroSlide[];
};

export type LayananItemS = {
  title: string;
  desc: string;
  href: string;
  icon: string;
};

export type PerangkatItemS = {
  name: string;
  position: string;
  featured: boolean;
  photo?: string;
};

export type StatistikSettings = {
  total: number;
  laki: number;
  perempuan: number;
  petaQuery: string;
};

export type NilaiProfilS = { title: string; description: string; icon: string };
export type TupoksiS = { jabatan: string; ringkasan: string; tugas: string[] };
export type ProfilSettings = {
  visi: string;
  misi: string[];
  nilai: NilaiProfilS[];
  tupoksi: TupoksiS[];
};

export type PpidStrukturS = { jabatan: string; keterangan: string };
export type KategoriInfoS = { judul: string; deskripsi: string };
export type PpidSettings = {
  profil: string;
  struktur: PpidStrukturS[];
  tugas: string[];
  dasarHukum: string[];
  dataInformasi: KategoriInfoS[];
};

export type ProdukHukumS = {
  jenis: string;
  nomor: string;
  tahun: number;
  tentang: string;
  href: string;
};

export type GaleriItemS = {
  src: string;
  judul: string;
  alt: string;
  kategori: string;
};

export type SopLangkahS = { judul: string; deskripsi: string };
export type PersyaratanLayananS = { nama: string; berkas: string[] };
export type LayananDetailSettings = {
  sop: SopLangkahS[];
  persyaratan: PersyaratanLayananS[];
  maklumat: string;
  maklumatPoin: string[];
  pengadaanPoin: string[];
};

export type Settings = {
  site: SiteSettings;
  jamPelayanan: JamRow[];
  externalLinks: ExternalLink[];
  tentang: TentangSettings;
  hero: HeroSettings;
  layanan: LayananItemS[];
  perangkat: PerangkatItemS[];
  statistik: StatistikSettings;
  profil: ProfilSettings;
  ppid: PpidSettings;
  produkHukum: ProdukHukumS[];
  galeri: GaleriItemS[];
  layananDetail: LayananDetailSettings;
};

/** Nilai default (fallback & seed) diturunkan dari lib/content/*. */
export const defaultSettings: Settings = {
  site: {
    name: defaultSite.name,
    legalName: defaultSite.legalName,
    tagline: defaultSite.tagline,
    region: defaultSite.region,
    slogan: defaultSite.slogan,
    url: defaultSite.url,
    email: defaultSite.email,
    phone: defaultSite.phone,
    phoneIntl: defaultSite.phoneIntl,
    address: defaultSite.address,
    links: { ...defaultSite.links },
    social: { ...defaultSite.social },
  },
  jamPelayanan: defaultJam.map((j) => ({ ...j })),
  externalLinks: [
    { label: "Survei Kepuasan Masyarakat", url: defaultSite.links.skm },
    { label: "Survei Anti Korupsi", url: defaultSite.links.spak },
  ],
  tentang: {
    paragraf1:
      "Kecamatan Jenar merupakan salah satu dari 20 kecamatan di wilayah Kabupaten Sragen, Provinsi Jawa Tengah, dan membawahi 7 desa.",
    paragraf2:
      "Pemerintah Kecamatan Jenar berkomitmen memberikan pelayanan publik yang transparan, cepat, dan bebas korupsi — serta mendorong keterbukaan informasi bagi seluruh warga masyarakat.",
    quickFacts: [
      { value: "26.550", label: "Jumlah Penduduk" },
      { value: "7", label: "Desa di Kecamatan" },
      { value: "Gratis", label: "Biaya Pelayanan" },
    ],
  },
  hero: {
    eyebrow: "Website Resmi",
    subtitle: "Kabupaten Sragen, Jawa Tengah",
    description:
      "Portal layanan publik kecamatan yang transparan, melayani, dan bebas korupsi. Akses informasi, layanan administrasi, dan pengaduan masyarakat dalam satu tempat.",
    slides: defaultHeroSlides.map((s) => ({ img: s.img, alt: s.alt })),
  },
  layanan: defaultLayanan.map((l) => ({
    title: l.title,
    desc: l.desc,
    href: l.href,
    icon: l.path,
  })),
  perangkat: defaultPerangkat.map((p) => ({
    name: p.name ?? "",
    position: p.position,
    featured: p.featured ?? false,
    photo: p.photo ?? "",
  })),
  statistik: {
    total: defTotal,
    laki: defLaki,
    perempuan: defPerempuan,
    petaQuery: defPetaQuery,
  },
  profil: {
    visi: defVisi,
    misi: [...defMisi],
    nilai: defNilai.map((n) => ({
      title: n.title,
      description: n.description,
      icon: n.iconPath,
    })),
    tupoksi: defTupoksi.map((t) => ({
      jabatan: t.jabatan,
      ringkasan: t.ringkasan,
      tugas: [...t.tugas],
    })),
  },
  ppid: {
    profil: defPpidProfil,
    struktur: defPpidStruktur.map((x) => ({ ...x })),
    tugas: [...defPpidTugas],
    dasarHukum: [...defPpidDasarHukum],
    dataInformasi: defPpidDataInformasi.map((x) => ({ ...x })),
  },
  produkHukum: defProdukHukum.map((p) => ({
    jenis: p.jenis,
    nomor: p.nomor,
    tahun: p.tahun,
    tentang: p.tentang,
    href: p.href ?? "",
  })),
  galeri: defGaleri.map((g) => ({
    src: g.src,
    judul: g.judul,
    alt: g.alt,
    kategori: g.kategori ?? "",
  })),
  layananDetail: {
    sop: defSop.map((s) => ({ ...s })),
    persyaratan: defPersyaratan.map((p) => ({
      nama: p.nama,
      berkas: [...p.berkas],
    })),
    maklumat: defMaklumat,
    maklumatPoin: [...defMaklumatPoin],
    pengadaanPoin: [...defPengadaanPoin],
  },
};
