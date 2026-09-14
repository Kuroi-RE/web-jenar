import Link from "next/link";
import { getBeritaSlugs } from "@/lib/berita";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

const cards = [
  {
    href: "/admin/pengaturan",
    title: "Pengaturan Umum",
    desc: "Nama desa, alamat, kontak, jam pelayanan, media sosial, tautan.",
  },
  {
    href: "/admin/hero",
    title: "Hero (Beranda)",
    desc: "Teks sambutan & foto slide di bagian atas beranda.",
  },
  {
    href: "/admin/berita",
    title: "Berita",
    desc: "Buat, ubah, dan hapus berita/pengumuman.",
  },
  {
    href: "/admin/layanan",
    title: "Layanan",
    desc: "Kartu layanan unggulan di beranda.",
  },
  {
    href: "/admin/perangkat",
    title: "Perangkat Desa",
    desc: "Nama, jabatan, dan foto perangkat.",
  },
  {
    href: "/admin/apbdes",
    title: "APBDes",
    desc: "Anggaran pendapatan & belanja desa.",
  },
  {
    href: "/admin/statistik",
    title: "Statistik & Peta",
    desc: "Jumlah penduduk dan lokasi peta.",
  },
  {
    href: "/admin/profil",
    title: "Profil",
    desc: "Visi, misi, nilai, tugas & fungsi.",
  },
  { href: "/admin/ppid", title: "PPID", desc: "Keterbukaan informasi publik." },
  {
    href: "/admin/produk-hukum",
    title: "Produk Hukum",
    desc: "Peraturan & keputusan desa.",
  },
  { href: "/admin/galeri", title: "Galeri", desc: "Foto dokumentasi kegiatan." },
];

export default async function DashboardPage() {
  const [slugs, { site }] = await Promise.all([getBeritaSlugs(), getSettings()]);
  const jumlahBerita = slugs.length;

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Dasbor</h1>
      <p className="mt-1 text-ink-soft">
        Selamat datang di panel admin{" "}
        <span className="font-semibold text-ink">{site.name}</span>. Semua isi
        website dapat Anda ubah dari menu di sisi kiri.
      </p>

      {/* Panduan langkah pertama */}
      <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 p-5 dark:border-primary-900/50 dark:bg-primary-900/20">
        <p className="font-bold text-primary-800 dark:text-primary-200">
          Langkah pertama
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-soft">
          <li>
            Buka{" "}
            <Link
              href="/admin/pengaturan"
              className="font-semibold text-primary-700 underline dark:text-primary-300"
            >
              Pengaturan Umum
            </Link>{" "}
            untuk mengisi identitas desa (nama, alamat, kontak, jam pelayanan).
            Nama desa otomatis tampil di seluruh halaman.
          </li>
          <li>
            Isi menu lain sesuai kebutuhan (Hero, Perangkat, Berita, dst).
            Setiap perubahan langsung tampil di website setelah disimpan.
          </li>
          <li>
            Untuk gambar, gunakan tombol <strong>Unggah Foto</strong>
          </li>
        </ol>
        <br></br>
        <i className="text-gray-400">Silahkan kunjungi <a href="http://localhost:3000/manual/manualuser.pdf" className="text-blue-500">Panduan Pengguna</a> untuk informasi lebih lengkap.</i>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10">
        <p className="text-sm font-medium text-ink-soft">Total Berita</p>
        <p className="mt-1 text-3xl font-extrabold text-primary-700 dark:text-primary-300">
          {jumlahBerita}
        </p>
        <Link
          href="/admin/berita"
          className="mt-3 inline-flex text-sm font-semibold text-primary-700 dark:text-primary-300"
        >
          Kelola berita →
        </Link>
      </div>

      <h2 className="mt-8 text-lg font-bold text-ink">Semua Menu</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-black/5 bg-surface p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card dark:border-white/10"
          >
            <span className="block font-bold text-ink group-hover:text-primary-700 dark:group-hover:text-primary-300">
              {card.title}
            </span>
            <span className="mt-0.5 block text-sm text-ink-soft">
              {card.desc}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
