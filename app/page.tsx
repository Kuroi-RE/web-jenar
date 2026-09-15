import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Tentang } from "@/components/sections/Tentang";
import { Layanan } from "@/components/sections/Layanan";
import { Apbdes } from "@/components/sections/Apbdes";
import { Berita } from "@/components/sections/Berita";
import { Perangkat } from "@/components/sections/Perangkat";
import { Statistik } from "@/components/sections/Statistik";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Website resmi Pemerintah Desa Jenar, Kecamatan Jenar, Kabupaten Sragen. Akses layanan publik, berita desa, transparansi APBDes 2026, dan pengaduan masyarakat secara online.",
};

export default async function Home() {
  const { site, hero, externalLinks } = await getSettings();
  return (
    <>
      <Hero site={site} hero={hero} externalLinks={externalLinks} />
      <Tentang />
      <Layanan />
      <Apbdes />
      <Berita />
      <Perangkat />
      <Statistik />
    </>
  );
}
