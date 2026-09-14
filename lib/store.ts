import "server-only";
import { query, ensureSchema } from "@/lib/db";
import {
  site as defaultSite,
  jamPelayanan as defaultJam,
} from "@/lib/content/site";
import { heroSlides as defaultHeroSlides } from "@/lib/content/hero";
import { layananItems as defaultLayanan } from "@/lib/content/layanan";
import { perangkatDesa as defaultPerangkat } from "@/lib/content/perangkat";
import {
  pendudukTotal as defTotal,
  pendudukLaki as defLaki,
  pendudukPerempuan as defPerempuan,
  petaQuery as defPetaQuery,
} from "@/lib/content/statistik";
import {
  apbdesTahun as defApbdesTahun,
  apbdesRingkasan as defApbdesRingkasan,
  apbdesPendapatan as defApbdesPendapatan,
} from "@/lib/content/apbdes";
import {
  visi as defVisi,
  misi as defMisi,
  nilaiPelayanan as defNilai,
  tugasPokokFungsi as defTupoksi,
} from "@/lib/content/profil";
import {
  ppidProfil as defPpidProfil,
  ppidStruktur as defPpidStruktur,
  ppidTugas as defPpidTugas,
  ppidDasarHukum as defPpidDasarHukum,
  ppidDataInformasi as defPpidDataInformasi,
} from "@/lib/content/ppid";
import { produkHukum as defProdukHukum } from "@/lib/content/produk-hukum";
import { galeriItems as defGaleri } from "@/lib/content/galeri";
import {
  sopLangkah as defSop,
  persyaratanLayanan as defPersyaratan,
  maklumatPelayanan as defMaklumat,
  maklumatPoin as defMaklumatPoin,
  pengadaanPoin as defPengadaanPoin,
} from "@/lib/content/layanan";

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

export type ApbdesPostS = { code: string; label: string; amount: number };

export type ApbdesSettings = {
  tahun: number;
  pendapatan: number;
  belanja: number;
  rincian: ApbdesPostS[];
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
  apbdes: ApbdesSettings;
  profil: ProfilSettings;
  ppid: PpidSettings;
  produkHukum: ProdukHukumS[];
  galeri: GaleriItemS[];
  layananDetail: LayananDetailSettings;
};

// Nilai default (fallback) diturunkan dari lib/content/site.ts.
const defaults: Settings = {
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
      "Desa Sidoharjo merupakan salah satu dari 208 desa/kelurahan di wilayah Kabupaten Sragen, Provinsi Jawa Tengah, dan termasuk salah satu dari 12 desa di Kecamatan Sidoharjo.",
    paragraf2:
      "Sebagai desa yang terus berkembang, Pemerintah Desa Sidoharjo berkomitmen memberikan pelayanan publik yang transparan, cepat, dan bebas korupsi — serta mendorong keterbukaan informasi bagi seluruh warga masyarakat.",
    quickFacts: [
      { value: "4.089", label: "Jumlah Penduduk" },
      { value: "12", label: "Desa se-Kecamatan" },
      { value: "Gratis", label: "Biaya Pelayanan" },
    ],
  },
  hero: {
    eyebrow: "Website Resmi",
    subtitle: "Kecamatan Sidoharjo, Kabupaten Sragen",
    description:
      "Portal layanan publik desa yang transparan, melayani, dan bebas korupsi. Akses informasi, layanan administrasi, dan pengaduan masyarakat dalam satu tempat.",
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
  apbdes: {
    tahun: defApbdesTahun,
    pendapatan: defApbdesRingkasan.pendapatan,
    belanja: defApbdesRingkasan.belanja,
    rincian: defApbdesPendapatan.map((r) => ({ ...r })),
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

/** Baca settings dari DB, di-merge di atas default. Toleran bila DB tak tersedia. */
export async function getSettings(): Promise<Settings> {
  try {
    await ensureSchema();
    const rows = await query<{ data: Partial<Settings> | string }>(
      "SELECT data FROM site_settings WHERE id = 1",
    );
    const rawData = rows[0]?.data;
    const saved: Partial<Settings> =
      typeof rawData === "string"
        ? (JSON.parse(rawData) as Partial<Settings>)
        : (rawData ?? {});
    return {
      site: { ...defaults.site, ...saved.site },
      jamPelayanan: saved.jamPelayanan ?? defaults.jamPelayanan,
      externalLinks: saved.externalLinks ?? defaults.externalLinks,
      tentang: {
        ...defaults.tentang,
        ...saved.tentang,
        quickFacts: saved.tentang?.quickFacts ?? defaults.tentang.quickFacts,
      },
      hero: {
        ...defaults.hero,
        ...saved.hero,
        slides:
          saved.hero?.slides && saved.hero.slides.length > 0
            ? saved.hero.slides
            : defaults.hero.slides,
      },
      layanan:
        saved.layanan && saved.layanan.length > 0
          ? saved.layanan
          : defaults.layanan,
      perangkat:
        saved.perangkat && saved.perangkat.length > 0
          ? saved.perangkat
          : defaults.perangkat,
      statistik: { ...defaults.statistik, ...saved.statistik },
      apbdes: {
        ...defaults.apbdes,
        ...saved.apbdes,
        rincian:
          saved.apbdes?.rincian && saved.apbdes.rincian.length > 0
            ? saved.apbdes.rincian
            : defaults.apbdes.rincian,
      },
      profil: {
        ...defaults.profil,
        ...saved.profil,
        misi: saved.profil?.misi ?? defaults.profil.misi,
        nilai: saved.profil?.nilai ?? defaults.profil.nilai,
        tupoksi: saved.profil?.tupoksi ?? defaults.profil.tupoksi,
      },
      ppid: {
        ...defaults.ppid,
        ...saved.ppid,
        struktur: saved.ppid?.struktur ?? defaults.ppid.struktur,
        tugas: saved.ppid?.tugas ?? defaults.ppid.tugas,
        dasarHukum: saved.ppid?.dasarHukum ?? defaults.ppid.dasarHukum,
        dataInformasi:
          saved.ppid?.dataInformasi ?? defaults.ppid.dataInformasi,
      },
      produkHukum:
        saved.produkHukum && saved.produkHukum.length > 0
          ? saved.produkHukum
          : defaults.produkHukum,
      galeri:
        saved.galeri && saved.galeri.length > 0
          ? saved.galeri
          : defaults.galeri,
      layananDetail: {
        ...defaults.layananDetail,
        ...saved.layananDetail,
        sop:
          saved.layananDetail?.sop && saved.layananDetail.sop.length > 0
            ? saved.layananDetail.sop
            : defaults.layananDetail.sop,
        persyaratan:
          saved.layananDetail?.persyaratan &&
          saved.layananDetail.persyaratan.length > 0
            ? saved.layananDetail.persyaratan
            : defaults.layananDetail.persyaratan,
        maklumatPoin:
          saved.layananDetail?.maklumatPoin ??
          defaults.layananDetail.maklumatPoin,
        pengadaanPoin:
          saved.layananDetail?.pengadaanPoin ??
          defaults.layananDetail.pengadaanPoin,
      },
    };
  } catch (err) {
    console.error("[store] getSettings gagal, memakai default:", err);
    return defaults;
  }
}

/** Simpan settings penuh ke DB (upsert baris tunggal id=1). */
export async function saveSettings(next: Settings): Promise<void> {
  await ensureSchema();
  await query(
    `INSERT INTO site_settings (id, data) VALUES (1, ?) AS new
     ON DUPLICATE KEY UPDATE data = new.data`,
    [JSON.stringify(next)],
  );
}
