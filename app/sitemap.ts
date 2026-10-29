import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/store";
import { getAllBerita } from "@/lib/berita";

// Rute statis yang sudah tersedia. Tambahkan entri baru saat halaman dibuat.
const staticRoutes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/profil/visi-misi", changeFrequency: "monthly", priority: 0.8 },
  {
    path: "/profil/struktur-organisasi",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/profil/tugas-pokok-fungsi",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { path: "/profil/demografi", changeFrequency: "monthly", priority: 0.7 },
  { path: "/layanan", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pengaduan", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ppid", changeFrequency: "monthly", priority: 0.7 },
  { path: "/ppid/sakip", changeFrequency: "monthly", priority: 0.7 },
  { path: "/produk-hukum", changeFrequency: "monthly", priority: 0.7 },
  { path: "/berita", changeFrequency: "weekly", priority: 0.8 },
  { path: "/galeri", changeFrequency: "monthly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const { site } = await getSettings();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Halaman detail berita (dinamis dari content/berita).
  const berita = await getAllBerita();
  const beritaEntries: MetadataRoute.Sitemap = berita.map((post) => ({
    url: `${site.url}/berita/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...beritaEntries];
}
