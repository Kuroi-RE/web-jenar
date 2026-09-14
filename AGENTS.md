# AGENTS.md — Website Desa Sidoharjo (Next.js)

> Panduan wajib untuk setiap AI agent yang melanjutkan pengembangan proyek ini.
> **Baca dokumen ini sepenuhnya sebelum menulis kode apa pun.** Perbarui bagian
> **Progress Log** (§9) setiap kali menyelesaikan pekerjaan.

---

## 1. Ringkasan Proyek

| | |
|---|---|
| **Nama** | Website Resmi Pemerintah Desa Sidoharjo |
| **Wilayah** | Kec. Sidoharjo, Kab. Sragen, Prov. Jawa Tengah |
| **Tujuan** | Landing page + portal layanan publik desa: modern, transparan, mobile-first |
| **Stack** | **Next.js 16 (App Router)** · React 19 · TypeScript · Tailwind CSS v4 (CSS-first) · next-themes |
| **Bahasa UI** | Bahasa Indonesia (semua teks tampilan) |
| **Tema Desain** | **Modern Government** — bersih, terpercaya, profesional, aksesibel |
| **Asal** | Hasil migrasi dari proyek Laravel/Blade (lihat `MIGRATION_PLAN.md`) |

**Alasan pakai Next.js:** butuh data dinamis nanti (Berita, APBDes, Perangkat) via
Server Components + `async fetch`, dynamic routes (`app/berita/[slug]/page.tsx`),
dan route handlers (`app/api/...`). SSG/SSR menjaga SEO tetap kuat.

---

## 2. Cara Menjalankan

```bash
cd D:\Projects\magang\webdesa
npm run dev      # dev server (http://localhost:3000)
npm run build    # WAJIB lolos sebelum selesai / commit
npm run lint     # WAJIB bersih sebelum selesai / commit
```

> **Catatan shell (Windows):** wrapper terminal bisa memangle path absolut **berkuotasi**
> (menambah prefix root workspace). Untuk operasi file di terminal, pakai path **tanpa kuota**
> (tidak ada spasi di path proyek) atau `robocopy <dir-sumber> <dir-tujuan> <file>` tanpa kuota.

---

## 3. Sistem Desain (WAJIB DIIKUTI)

Semua token didefinisikan di **`app/globals.css`** memakai **Tailwind v4 `@theme`** (CSS-first, OKLCH).
**JANGAN** membuat `tailwind.config.js`. **JANGAN** hardcode warna hex/rgb di JSX — selalu pakai token
utility (mis. `bg-primary-700`, `text-accent-500`, `text-ink`, `bg-surface`).

### 3.1 Palet Warna
| Peran | Token | Makna |
|---|---|---|
| **Primary** (hijau emerald) | `primary-50` … `primary-950` | Brand utama, header, tombol utama, section gelap |
| **Accent** (emas/amber) | `accent-50` … `accent-900` | CTA sekunder, highlight, ikon |
| **Ink** | `text-ink`, `text-ink-soft` | Teks utama & sekunder (adaptif dark mode) |
| **Surface** | `bg-surface`, `bg-surface-muted` | Latar halaman & kartu (adaptif dark mode) |

Pemakaian umum: tombol utama `primary-700`→hover `primary-800`; hero/section gelap `primary-900`/`primary-950`;
CTA emas `accent-500` (teks `accent-900`); latar lembut `primary-50` atau `surface-muted`.

### 3.2 Tipografi
- Font **Instrument Sans** via `next/font/google` (`app/fonts.ts`), variabel `--font-instrument`
  dipetakan ke `--font-sans`/`--font-display` di `globals.css`. Weights 400/500/600/700.
- Judul: `font-bold`/`font-extrabold`, `tracking-tight`.

### 3.3 Radius, Shadow, Animasi
- Radius default `rounded-lg`; kartu `rounded-2xl`/`rounded-3xl`.
- Shadow: `shadow-soft` (elemen kecil), `shadow-card` (kartu/dropdown).
- Animasi (di `@theme`): `animate-fade-in`, `animate-fade-in-up`, `animate-slide-down`,
  `animate-marquee`, `animate-kenburns` (pakai `motion-safe:` untuk hormati reduced-motion).

### 3.4 Utility Komponen (di `@layer components`)
Gunakan ulang, jangan tulis ulang gaya:
- `.container-desa` — pembungkus lebar konten (`max-w-7xl` + padding responsif). **Selalu** pakai untuk section.
- `.btn-primary` — tombol utama hijau.
- `.btn-accent` — tombol emas.
- `.btn-ghost-light` — tombol outline untuk latar gelap.
- `.eyebrow` — label kecil di atas judul section.

### 3.5 Dark Mode
- Pakai **next-themes** (`attribute="class"`), toggle di `components/layout/ThemeToggle.tsx`.
- `<html suppressHydrationWarning>` di `app/layout.tsx` untuk cegah FOUC.
- Untuk permukaan adaptif pakai token (`bg-surface`/`text-ink`), bukan `bg-white`/`text-black` mentah.
- Beri varian `dark:` untuk warna/hover/border non-otomatis (mis. `border-black/10 dark:border-white/10`).
- Komponen client yang bergantung tema **wajib** pola *mounted guard* (render setelah mount) agar tidak hydration-mismatch (lihat `ThemeToggle.tsx`).

---

## 4. Aturan untuk Agent (RULES)

### HARUS
1. **Tema Modern Government** dipertahankan di semua komponen baru.
2. Pakai **token desain** (§3), bukan warna mentah.
3. Semua teks UI dalam **Bahasa Indonesia**.
4. **Mobile-first & responsif** — uji breakpoint `sm md lg xl`.
5. **Aksesibilitas**: `aria-label` pada tombol ikon, `alt` deskriptif pada `next/image`, kontras cukup, `focus-visible` (sudah global di base layer).
6. **Bangun per section/komponen** — selesaikan satu, verifikasi, baru lanjut.
7. **Server Component secara default.** Tambah `"use client"` **hanya** bila butuh state/efek/event/browser API (mis. carousel, dropdown, toggle).
8. **Data konten** taruh di `lib/content/*.ts` (bukan hardcode tersebar di JSX). Tipekan dengan TypeScript.
9. **Navigasi internal** pakai `<Link>` dari `next/link`; tautan eksternal & anchor (`#`) boleh `<a>`.
10. **Gambar** pakai `next/image` (`fill`/`width`+`height`, `sizes`, `priority` untuk above-the-fold). Aset di `public/`.
11. **SEO/GEO**: tiap halaman ekspor `metadata` (atau `generateMetadata`); tambah JSON-LD schema relevan bila perlu.
12. **Verifikasi**: `npm run build` **dan** `npm run lint` harus lolos sebelum dianggap selesai.
13. **Perbarui Progress Log** (§9) di akhir sesi.

### JANGAN
1. Jangan buat `tailwind.config.js` (CSS-first v4).
2. Jangan hardcode warna hex/rgb di JSX.
3. Jangan pasang jQuery/Alpine/library JS berat — pakai React.
4. Jangan taruh `"use client"` di komponen yang tidak butuh (rusak manfaat SSR/SEO).
5. Jangan hapus `suppressHydrationWarning` di `<html>` atau konfigurasi next-themes.
6. Jangan ubah nada formal/pelayanan publik pada konten.
7. Jangan elemen `position: fixed` (drawer/modal) sebagai anak elemen ber-`backdrop-blur`/`filter`/`transform` — pakai **React Portal (`createPortal(node, document.body)`)** seperti `MobileDrawer.tsx`.

---

## 5. Struktur & Konvensi File

```
app/
├── layout.tsx          # Root: metadata/SEO, JSON-LD, ThemeProvider, <Navbar/> + <main> + <Footer/>
├── page.tsx            # Beranda: rangkai section + metadata halaman
├── globals.css         # Sistem desain (Tailwind v4 @theme + @layer). Sumber kebenaran token.
├── fonts.ts            # Instrument Sans (next/font)
├── favicon.ico
components/
├── providers/
│   └── ThemeProvider.tsx   # wrapper next-themes ("use client")
├── layout/
│   ├── Navbar.tsx          # "use client" — dropdown, kontak, toggle, tombol drawer
│   ├── ThemeToggle.tsx     # "use client" — sun/moon, mounted guard
│   ├── MobileDrawer.tsx    # "use client" — drawer via createPortal
│   └── Footer.tsx          # server component
├── sections/
│   ├── Hero.tsx            # "use client" — carousel next/image + kenburns
│   ├── Tentang.tsx         # server — Tentang Kami + Waktu Pelayanan
│   └── Layanan.tsx         # server — grid 6 kartu layanan
lib/
└── content/
    ├── site.ts         # data desa (kontak, alamat, slogan, tautan, jamPelayanan)
    ├── nav.ts          # dropdowns, simpleLinks, mobileGroups
    ├── hero.ts         # heroSlides
    ├── layanan.ts      # layananItems
    └── berita.ts       # beritaTerbaru
public/
└── images/hero/…       # slide-1.jpeg, slide-2.jpeg, slide-3.jpg
```

**Konvensi:**
- Section landing baru → `components/sections/NamaSection.tsx`, dipanggil di `app/page.tsx`.
- Data untuk section → tambah/isi di `lib/content/`.
- Alias impor `@/*` → root proyek (mis. `@/components/...`, `@/lib/content/...`).
- Ikon: SVG inline (stroke) mengikuti gaya yang ada, atau data `path` di file konten.

---

## 6. Data Referensi (dari situs desa)

| Item | Nilai |
|---|---|
| Email | ds.sidoharjo.sragen@gmail.com |
| Telepon | 0813-9301-1650 |
| Alamat | Jl. Pungkruk – Tanon, Km. 1, Dk. Sidoharjo RT 3, Sidoharjo, Sragen 57281 |
| Jam layanan | Sen–Kam 07.30–16.00 (ist. 12.00–13.00); Jum 07.15–14.30 (ist. 11.30–12.30); Sab–Min Libur |
| Penduduk | 4.089 jiwa (L: 1.977 · P: 2.112) |
| APBDes 2026 | Pendapatan Rp 1.759.314.000 · Belanja Rp 1.983.522.157 |
| — Rincian Pendapatan | PAD 615.440.000 · ADD 554.907.000 · DD 373.456.000 · BHP 30.511.000 · BANPROV 80.000.000 |
| Kepala Desa | Titik Saptawati, S.Pd, M.H |
| Sekretaris Desa | Sugiyanto |
| Slogan | "Pelayanan Umum Gratis" |

**Tautan eksternal** (sudah di `lib/content/site.ts`):
- Aduan: http://bit.ly/PengaduanSidoharjo
- Survei Kepuasan (SKM): https://bit.ly/SKMDesaSidoharjo
- Survei Anti Korupsi (SPAK): https://bit.ly/SPAKDesaSidoharjo

---

## 7. Roadmap UI (fase berikutnya — fokus tampilan dulu)

Kerjakan berurutan; tiap section berdiri sendiri di `components/sections/` dan dipanggil di `app/page.tsx`.
Data masih boleh statis di `lib/content/` dulu (dynamic data menyusul, §8).

- [x] Hero, Tentang (Waktu Pelayanan), Layanan — sudah dimigrasi.
- [x] **Section APBDes** — visualisasi anggaran + progress bar (data §6). Buat `lib/content/apbdes.ts` + `components/sections/Apbdes.tsx`.
- [x] **Section Berita Terbaru** — grid kartu berita di beranda. Buat `components/sections/Berita.tsx` (pakai/eksten `lib/content/berita.ts`, tambah excerpt/thumbnail).
- [x] **Section Perangkat Desa** — grid profil (foto, nama, jabatan). Buat `lib/content/perangkat.ts` + `components/sections/Perangkat.tsx`.
- [x] **Section Statistik & Peta Desa** — kartu statistik penduduk + embed peta.
- [x] **Halaman dalam** (Profil/Visi-Misi/dll) — semua link `#` di navigasi kini jadi route: Profil (Visi-Misi, Struktur, Tupoksi, Demografi), Layanan, Pengaduan, PPID, Produk Hukum, Berita, Galeri.
- [~] **Aset**: OG image kini di-generate dinamis via `app/opengraph-image.tsx` (`next/og`) — tak perlu `og-desa-sidoharjo.jpg` lagi. _(Sisa: foto perangkat/berita asli.)_
- [x] **SEO/GEO**: `app/sitemap.ts` + `app/robots.ts` (mengganti `public/robots.txt`), JSON-LD `BreadcrumbList` di halaman Profil. _(Sisa: NewsArticle saat berita dinamis.)_

**Konsistensi antar-section:** bergantian latar `bg-surface` ↔ `bg-surface-muted`; header section pakai `.eyebrow` + `<h2>`; bungkus dengan `.container-desa`; kartu `rounded-2xl border border-black/5 dark:border-white/10`.

---

## 8. Rencana Data Dinamis (setelah UI)

Pilihan sumber data (putuskan bersama user):
- **Markdown/MDX** (`content/berita/*.mdx`) — paling sederhana, git-based.
- **Headless CMS** (Sanity/Payload/Strapi) — editor non-teknis.
- **Database** (SQLite/Postgres + Prisma/Drizzle) — kontrol penuh + admin UI.

Pola implementasi: Server Component `async` yang `await` data → `app/berita/page.tsx` (list) &
`app/berita/[slug]/page.tsx` (detail) dengan `generateStaticParams` + `generateMetadata`.
Sementara UI dibangun, `lib/content/*.ts` bertindak sebagai lapisan data yang mudah ditukar ke fetch nyata.

---

## 9. Progress Log

### 2026-08-24 — Halaman Layanan Publik editable (SOP, Persyaratan, Maklumat, Pengadaan)
**Oleh:** Kiro

Isi halaman `/layanan` yang sebelumnya statis (dari `lib/content/layanan.ts`) kini sepenuhnya dapat diedit via panel admin — melengkapi target "seluruh landing page bisa dicustom".

Selesai:
- **`lib/store.ts`**: tambah tipe `SopLangkahS`, `PersyaratanLayananS`, `LayananDetailSettings` (`sop`, `persyaratan`, `maklumat`, `maklumatPoin`, `pengadaanPoin`) ke `Settings`; default dari `lib/content/layanan.ts`; merge di `getSettings` (array kosong → fallback default).
- **`lib/admin/konten-actions.ts`**: `saveLayananDetailAction` (SOP & persyaratan pola baris berindeks; `berkas`/`maklumatPoin`/`pengadaanPoin` via `lines()`; baris kosong diabaikan) + `revalidatePath('/', 'layout')`.
- **`components/admin/LayananDetailForm.tsx`**: 4 seksi — SOP (RepeatableRows judul/deskripsi), Jenis Pelayanan & Persyaratan (RepeatableRows nama + berkas textarea per-baris), Maklumat (pernyataan + poin komitmen), Pengadaan (poin).
- **`app/admin/(panel)/layanan-detail/page.tsx`** (force-dynamic, `getSettings`) + item nav **"Halaman Layanan"** di `AdminShell`.
- **`app/layanan/page.tsx`**: kini `async getSettings` — SOP/persyaratan/maklumat/pengadaan + JSON-LD dari store (bukan import statis).

Verifikasi: `npm run lint` bersih; `npm run build` lolos (Next 16.3.0; `/admin/layanan-detail` Dynamic, `/layanan` Static; fallback default aktif karena MySQL lokal tak berjalan).

### 2026-08-19 — Manual Book PDF Website & Panel Admin
**Oleh:** Kiro

- Dibuat panduan pengguna lengkap berbahasa Indonesia untuk website publik dan 12 menu Panel Admin, termasuk login akun pengembangan `admin` / `admin123`, alur simpan/verifikasi, unggah gambar, keamanan, dan pemecahan masalah.
- **`manual/screenshot.mjs`**: otomatis mengambil 26 screenshot public/admin melalui Playwright, login admin, serta memberi anotasi panah/bingkai merah pada elemen penting.
- Seluruh screenshot akhir memakai **JPG quality 82**; total aset 12,17 MB (turun sekitar 44% dari PNG 21,75 MB). PNG lama dihapus.
- **`manual/generate-pdf.mjs`** + `manual/manual-book.html`: layout A4 dengan margin/padding konsisten, tipografi, daftar isi, nomor halaman, tabel, kartu catatan, dan screenshot.
- Hasil akhir: **`manual/Panduan-Pengguna-Website-Desa-Sidoharjo.pdf`** — 22 halaman, 9,56 MB, teks dapat dicari/disalin.

Verifikasi: `npm run lint` bersih; `npm run build` lolos (fallback default aktif karena MySQL lokal tidak berjalan); localhost HTTP 200; seluruh 26 screenshot JPG berhasil; generator mendeteksi 22 halaman HTML, 0 gambar hilang, 0 overflow; PDF diverifikasi PyMuPDF (22 halaman A4 595×841,9 pt, 16.067 karakter teks) dan sampel halaman 1/5/7/22 diperiksa visual.

### 2026-07-20 — Konsistensi tautan dinamis: Pengaduan, sitemap, robots
**Oleh:** Agent

- **`/pengaduan`**: kini `async getSettings` — kartu kanal dibangun dinamis dari `site.links.aduan` + `externalLinks` + telepon (`site.phoneIntl`), CTA "Buat Pengaduan" pakai `site.links.aduan`. Sebelumnya membaca tautan statis `lib/content/site.ts` sehingga tak ikut berubah saat admin mengedit.
- **`app/sitemap.ts`** & **`app/robots.ts`**: URL memakai `getSettings().site.url` (domain mengikuti Pengaturan Umum), bukan konstanta statis.

Verifikasi: `npm run lint` bersih; `npm run build` lolos (Next 16.3.0).

Sisa: editor **Navigasi** (ditunda — menu bertingkat berisiko untuk admin non-teknis); default di `lib/content/*.ts` sebagai seed contoh (di-override admin).

### 2026-07-20 — Universalisasi konten (hapus hardcode "Sidoharjo/Sragen") + UX admin
**Oleh:** Agent

Situs kini template universal — nama/wilayah desa mengikuti Pengaturan Umum, bukan hardcode.

- **Teks tampil** (section Tentang/Berita/Layanan/Perangkat + halaman Profil/PPID/dll) memakai `site.name` dari store; heading seperti "Perangkat {site.name}", "Mengenal {site.name}", "PPID {site.name}".
- **Metadata** halaman dalam dibuat generik (tanpa menyebut desa tertentu); `<title>` tetap membawa nama desa via template. `layout.tsx` `generateMetadata` kini membangun deskripsi & keywords dari `site.legalName`/`site.region` (buang "Sragen"/"Jawa Tengah" literal); JSON-LD `addressLocality` → `site.name`.
- **OG image** (`opengraph-image.tsx`) jadi async, memakai `site.name`/`site.region` + host dari `site.url` (bukan "Desa Sidoharjo"/"sidoharjo.desa.id").
- **JSON-LD berita** publisher/URL dari `getSettings` (bukan default statis).
- **UX Admin**: dasbor menyapa dengan nama desa, panduan "Langkah pertama" (mulai dari Pengaturan Umum), dan daftar semua menu dengan deskripsi ramah untuk admin non-teknis.

Sisa (opsional, tak menyebut nama desa spesifik): default di `lib/content/site.ts` masih memakai Sidoharjo sebagai contoh awal (di-override admin); `sitemap.ts`/`robots.ts` & kanal di halaman `/pengaduan` masih baca `site.url`/`site.links` statis (URL domain & set sekali). Editor Navigasi sengaja belum dibuat (menu bertingkat, berisiko bagi admin non-teknis).

Verifikasi: `npm run lint` bersih; `npm run build` lolos (Next 16.3.0); `npm audit` 0 vuln.

### 2026-07-20 — Upgrade Next.js 16.3.0 (tindak lanjut audit)
**Oleh:** Agent

- `npm i next@latest eslint-config-next@latest` → **Next 16.2.10 → 16.3.0**; postcss & sharp ikut ter-patch.
- `npm audit`: **0 vulnerabilities** (sebelumnya 3 High dari next/postcss/sharp).
- Verifikasi: `npm run lint` bersih, `npm run build` lolos (semua rute normal, tanpa regresi).

### 2026-07-20 — Security Audit & Hardening
**Oleh:** Agent

Audit menyeluruh + perbaikan (tanpa menghapus fitur). Fix:
- **Auth**: token sesi kini bertanda tangan HMAC + **kedaluwarsa** (`<exp>.<hmac>`, diverifikasi server) menggantikan token statis.
- **Rate limiting** (`lib/rate-limit.ts`, in-memory): login 5×/5mnt/IP + logging percobaan gagal; upload 30×/mnt/IP.
- **Upload** (`app/api/admin/upload`): validasi **magic bytes** (bukan Content-Type klien), tolak file kosong, nama acak, tetap wajib auth.
- **XSS Markdown**: `lib/berita.ts` pakai instance `Marked` yang membuang raw HTML (`renderer.html=""`) + membatasi protokol tautan (http/https/mailto/tel/relatif) → cegah stored XSS pada isi berita.
- **JSON-LD**: `lib/jsonld.ts` meng-escape `<` → cegah pemecahan `</script>` (dipakai di `layout.tsx` & detail berita).
- **Security headers** (`next.config.ts`): CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **Dependency**: `npm audit fix` (js-yaml, nanoid) — non-breaking.

Verifikasi: `npm run lint` bersih, `npm run build` lolos, TypeScript OK. Sisa audit: 3 high dari Next/postcss/sharp (perlu upgrade Next — direkomendasikan terpisah); CSP masih `unsafe-inline`; rate-limit in-memory (single instance); ganti `ADMIN_PASSWORD`/`AUTH_SECRET` default sebelum produksi.

### 2026-07-20 — Tautan Layanan Eksternal dinamis (tambah/hapus)
**Oleh:** Agent

- **Store**: tambah `externalLinks: ExternalLink[]` (`{label,url}`) ke `Settings` (default: SKM & SPAK). `links.aduan` tetap sebagai tautan Pengaduan khusus tombol "Aduan Masyarakat"; `links.skm/spak` dipertahankan (kompat, tak lagi diedit).
- **Pengaturan Umum**: bagian "Tautan Layanan Eksternal" kini = field Pengaduan + daftar dinamis (tambah/hapus; baris URL kosong diabaikan). `saveSettingsAction` parse `ext_label_i`/`ext_url_i`.
- **Publik**: Navbar (bar atas) & Hero (tombol CTA) memetakan `externalLinks` (bukan lagi SKM/SPAK hardcoded); dioper via prop dari `layout.tsx`/`page.tsx`. Tautan eksternal pakai `target="_blank" rel="noopener noreferrer"`.

Verifikasi: `npm run lint` bersih; `npm run build` lolos.

### 2026-07-20 — Foto Perangkat Desa (kartu + form)
**Oleh:** Agent

- **Store**: `PerangkatItemS` +`photo?: string`; default & `savePerangkatAction` membaca `photo_<i>`.
- **Form admin** `/admin/perangkat`: tiap perangkat kini punya `ImageField` "Foto (opsional)" (unggah/hapus/pratinjau).
- **Kartu** (section beranda `Perangkat.tsx` & halaman `profil/struktur-organisasi`): tampilkan foto (`next/image fill`, bulat) bila ada; **fallback** ke inisial (bila ada nama) atau ikon orang — sesuai desain lama.

Verifikasi: `npm run lint` bersih; `npm run build` lolos.

### 2026-07-20 — Editor batch 2 (Profil, PPID, Produk Hukum, Galeri) + Upload Foto
**Oleh:** Agent

Empat domain konten lagi editable via admin, plus fitur unggah gambar.

Selesai:
- **Store**: tambah `profil` (visi/misi/nilai/tupoksi), `ppid` (profil/struktur/tugas/dasarHukum/dataInformasi), `produkHukum[]`, `galeri[]` ke `Settings` (default dari `lib/content/*`, merge di `getSettings`).
- **Actions** (`lib/admin/konten-actions.ts`): `saveProfilAction`, `savePpidAction`, `saveProdukHukumAction`, `saveGaleriAction` (list string via textarea per-baris; baris kosong diabaikan) + `revalidatePath('/', 'layout')`.
- **Form + halaman admin**: `/admin/profil`, `/admin/ppid`, `/admin/produk-hukum`, `/admin/galeri` + item nav. Primitif `Textarea` ditambah ke `components/admin/fields.tsx`.
- **Wiring publik**: `profil/visi-misi`, `profil/tugas-pokok-fungsi`, `ppid`, `produk-hukum`, `galeri` jadi `async getSettings`.
- **Upload foto**:
  - Route `app/api/admin/upload/route.ts` (POST, `requireAuth`/`isAuthenticated`, validasi tipe JPG/PNG/WEBP/GIF + maksimal 5MB, simpan ke `public/uploads/<unik>.<ext>`, kembalikan `{ url }`).
  - Komponen `components/admin/ImageField.tsx` (pratinjau + tombol Unggah via `fetch` + input path manual).
  - Dipakai di **Hero** (tiap slide) dan **Galeri**. `public/uploads/` di-gitignore.

Verifikasi: `npm run lint` bersih; `npm run build` lolos (`/api/admin/upload` + editor baru = Dynamic).

**Sisa:** editor **Navigasi** (menu Navbar/drawer) — ditunda karena struktur menu bertingkat butuh UX khusus; konten nav masih dari `lib/content/nav.ts`.

### 2026-07-20 — Editor konten batch 1: Layanan, Perangkat, APBDes, Statistik
**Oleh:** Agent

Empat section beranda kini editable via panel admin (semua tersimpan di `site_settings` JSON MySQL).

Selesai:
- **`lib/store.ts`**: tambah `layanan` (`LayananItemS[]`), `perangkat` (`PerangkatItemS[]`), `statistik` (`StatistikSettings`), `apbdes` (`ApbdesSettings` + `ApbdesPostS[]`) ke `Settings`, default dari `lib/content/*`, di-merge di `getSettings`.
- **`lib/admin/konten-actions.ts`**: `saveLayananAction`, `savePerangkatAction`, `saveStatistikAction`, `saveApbdesAction` (pola baris tetap; baris kosong diabaikan) + `revalidatePath('/', 'layout')`.
- **Primitif form** `components/admin/fields.tsx` (Field/Section/FormStatus/SubmitBar) + form: `LayananForm`, `PerangkatForm`, `StatistikForm`, `ApbdesForm`.
- **Halaman admin**: `/admin/layanan`, `/admin/perangkat`, `/admin/apbdes`, `/admin/statistik` + item nav di `AdminShell`.
- **Wiring publik ke store**: `Layanan.tsx`, `Perangkat.tsx` (+ `profil/struktur-organisasi`), `Statistik.tsx` (+ `profil/demografi`), `Apbdes.tsx` — semua jadi `async getSettings`. APBDes: defisit/surplus & persentase dihitung otomatis; peta dari `statistik.petaQuery`.
- `saveSettingsAction` (Pengaturan Umum) dispread `...current` agar field baru terjaga.

Verifikasi: `npm run lint` bersih; `npm run build` lolos (22 rute; editor baru = Dynamic).

**Berikutnya (batch 2):** Profil (visi/misi/nilai/tupoksi), PPID, Produk Hukum, Galeri, dan Navigasi (menu) — mengikuti pola yang sama.

### 2026-07-20 — Hero section dinamis (editable via admin)
**Oleh:** Agent

Hero beranda kini dinamis & dapat diubah dari panel admin (`/admin/hero`).

Selesai:
- **`lib/store.ts`**: tambah `HeroSettings` (`eyebrow`, `subtitle`, `description`, `slides[]`) ke `Settings`, default dari `lib/content/hero.ts`, di-merge di `getSettings`. **Judul besar Hero memakai `site.name`** (satu sumber nama desa) — jadi mengganti nama desa di **Pengaturan Umum** langsung mengubah judul Hero.
- **`lib/admin/hero-actions.ts`**: `saveHeroAction` (kumpulkan hingga 6 slide, abaikan baris kosong, min 1) + `revalidatePath('/', 'layout')`.
- **Admin**: `app/admin/(panel)/hero/page.tsx` + `components/admin/HeroForm.tsx` (eyebrow/subjudul/deskripsi + editor slide img/alt) + item nav "Hero" di `AdminShell`.
- **`components/sections/Hero.tsx`**: kini terima props `{ site, hero }` (bukan import statis). `app/page.tsx` jadi `async`, `getSettings()` → oper ke `<Hero>`. CTA "Statistik" → `/profil/demografi`.

Catatan: nama desa masih dummy ("Desa Sidoharjo") — ubah via **Pengaturan Umum → Nama Desa**; Hero, Navbar, Footer, dan metadata ikut berubah.

Verifikasi: `npm run lint` bersih; `npm run build` lolos (`/admin/hero` Dynamic; berita SSG dari MySQL).

**Berikutnya:** domain konten yang masih statis di `lib/content/*.ts` — Layanan, APBDes, Perangkat, Statistik, Profil (visi-misi/tupoksi), PPID, Produk Hukum, Galeri, Navigasi — mengikuti pola store + form + action yang sama.

### 2026-07-20 — Ganti database ke MySQL (mysql2)
**Oleh:** Agent

Driver database diganti dari PostgreSQL (`pg`) ke **MySQL** (`mysql2/promise`).

Selesai:
- **Dependensi**: hapus `pg`/`@types/pg`, pasang `mysql2` (punya tipe bawaan).
- **`lib/db.ts`**: `mysql.createPool` (parse `DATABASE_URL` → host/port/user/password/database, SSL opsional), `query<T>()` (`pool.query` → `[rows]`), `ensureSchema()` skema MySQL: `site_settings(id INT PK, data JSON, updated_at ON UPDATE)` + `berita(slug VARCHAR(80) PK, title, date VARCHAR(20), category, excerpt TEXT, image/image_alt, author, body MEDIUMTEXT, timestamps)`.
- **`lib/store.ts`**: upsert `INSERT ... AS new ON DUPLICATE KEY UPDATE`, `data` JSON di-`JSON.stringify` saat simpan & di-`JSON.parse` bila terbaca sebagai string.
- **`lib/berita.ts`**: placeholder `?`, upsert `ON DUPLICATE KEY UPDATE col = new.col`.
- **`scripts/db-init.mjs`**: mysql2 + `INSERT IGNORE` untuk impor `content/berita/*.md`.
- **Env**: `DATABASE_URL=mysql://user:pass@localhost:3306/webdesa`.

Sifat toleran tetap: bila DB tak terjangkau, situs jatuh ke default sehingga `npm run build` lolos tanpa DB.

**Cara pakai:** siapkan MySQL, buat database (mis. `webdesa`), set `DATABASE_URL` di `.env.local` (butuh MySQL 8.0.19+ untuk sintaks `AS new`), jalankan `npm run db:init`, lalu `npm run dev`.

Verifikasi: `npm run lint` bersih; `npm run build` lolos (TypeScript OK; error koneksi DB saat build ditangani fallback).

### 2026-07-20 — Migrasi penyimpanan ke PostgreSQL
**Oleh:** Agent

Storage panel admin/konten dipindah dari file (JSON+Markdown) ke **PostgreSQL** (driver `pg`, murni JS).

Selesai:
- **`lib/db.ts`** (server-only): `Pool` singleton (globalThis, `DATABASE_SSL` opsional), `query<T>()`, `ensureSchema()` (memoized; `CREATE TABLE IF NOT EXISTS` untuk `site_settings` JSONB singleton + `berita`).
- **`lib/store.ts`**: `getSettings` (SELECT jsonb, merge default) & `saveSettings` (upsert `id=1`).
- **`lib/berita.ts`**: seluruh baca/tulis via SQL (getAll/terbaru/slugs/bySlug[marked]/source/save[upsert]/delete). Tanggal disimpan sebagai `text` ISO.
- **Toleransi**: semua fungsi baca `try/catch` → fallback ke default/`[]` bila DB tak terjangkau, sehingga `npm run build` tetap lolos tanpa DB berjalan (halaman publik prerender dengan default; terisi saat DB tersedia + `revalidatePath`).
- **Env**: `DATABASE_URL` + `DATABASE_SSL` di `.env.local`/`.env.example`.
- **`scripts/db-init.mjs`** + script `npm run db:init`: buat tabel + impor `content/berita/*.md` ke DB (idempoten `ON CONFLICT DO NOTHING`).

**Cara pakai:** siapkan PostgreSQL, set `DATABASE_URL` di `.env.local`, jalankan `npm run db:init` (buat tabel + impor berita awal), lalu `npm run dev`. Skema juga dibuat otomatis saat runtime pertama (`ensureSchema`).

Verifikasi: `npm run lint` bersih; `npm run build` lolos (error koneksi DB saat build ditangani fallback, sesuai desain). Uji CRUD/pengaturan secara manual setelah DB terhubung.

**Berikutnya:** editor konten domain lain (Hero/Layanan/APBDes/dst.) — kini tinggal menambah tabel/kolom atau baris JSONB + form, mengikuti pola store+action.

### 2026-07-20 — Panel Admin & Konten Dinamis (auth + Berita CRUD + Pengaturan Umum)
**Oleh:** Agent

Tujuan: konten website dapat diubah lewat panel admin. Fondasi + dua modul pertama selesai.

**Keamanan/Arsitektur:**
- **Auth** (`lib/auth.ts`, server-only): login username+password dari env (`ADMIN_USERNAME`/`ADMIN_PASSWORD`), cookie sesi `httpOnly` bertoken HMAC-SHA256 (`AUTH_SECRET`), `verifyCredentials` waktu-konstan, `requireAuth()` dipanggil di **setiap** server action + layout panel. `.env.local` (dev) + `.env.example`. **Kredensial default hanya dev — wajib diganti + HTTPS di produksi.**
- **Penyimpanan**: `content/settings.json` (JSON, ditulis `saveSettings`) untuk konten terstruktur + `content/berita/*.md` untuk berita. Lapisan `lib/store.ts` (`getSettings` merge atas default `lib/content/site.ts`).
- **Rendering**: halaman `/admin/*` = Dynamic (`force-dynamic`, `noindex`); halaman publik tetap Static/SSG dan diperbarui via `revalidatePath` setelah simpan (`revalidatePath('/', 'layout')` untuk pengaturan; path berita untuk CRUD). `robots.ts` disallow `/admin`. `ChromeGate` menyembunyikan Navbar/Footer publik di `/admin/*`.

**Fitur admin (`app/admin`):**
- `/admin/login` (public) + logout; `(panel)` route group terproteksi + `AdminShell` (topbar/sidebar).
- `/admin` dasbor; `/admin/berita` list + `/baru` + `/[slug]` edit → **buat/ubah/hapus berita** (tulis Markdown via `matter.stringify`, slug dari judul, konfirmasi hapus).
- `/admin/pengaturan` editor **Pengaturan Umum**: identitas desa, kontak, tautan eksternal, media sosial, jam pelayanan, teks Tentang + quick facts.

**Wiring publik ke store:** `layout.tsx` (`generateMetadata` + JSON-LD async), `Navbar`/`MobileDrawer` (prop `site`), `Footer` & `Tentang` (async `getSettings`). Edit di panel langsung tampil di situs.

Verifikasi: `npm run lint` bersih, `npm run build` lolos (28 rute; `/admin/*` Dynamic, publik Static/SSG), TypeScript lolos. Uji alur login/CRUD secara manual via `npm run dev` (belum diverifikasi runtime interaktif).

**Berikutnya (agar SEMUA konten editable):** editor untuk domain lain mengikuti pola yang sama (store + form + action + revalidate): Hero, Layanan (items+detail), APBDes, Perangkat, Statistik, Profil (visi-misi/tupoksi), PPID, Produk Hukum, Galeri, dan Navigasi. Konten tersebut kini masih dari `lib/content/*.ts` (statis).

### 2026-07-20 — Fase Data Dinamis: Berita berbasis Markdown (§8)
**Oleh:** Agent

Sumber data dipilih: **Markdown file-based** (`content/berita/*.md`) — git-based, SSG, tanpa layanan eksternal.

Selesai:
- **Dependensi**: `gray-matter@^4.0.3` (frontmatter) + `marked@^18.0.7` (render). npm audit: 3 high vuln semuanya pre-existing dari next/postcss/sharp — **bukan** dari deps baru; `audit fix --force` tidak dijalankan (akan ubah versi Next).
- **Konten** `content/berita/*.md` (4 artikel) — frontmatter `title/date/category/excerpt/image/imageAlt/author` + body Markdown.
- **Lapisan data** `lib/berita.ts` (`server-only`): `getAllBerita` (urut terbaru), `getBeritaTerbaru`, `getBeritaSlugs`, `getBeritaBySlug` (isi → HTML via `marked`), `formatTanggal` (id-ID). Tipe `BeritaMeta`/`BeritaPost`. Lapisan mudah ditukar ke CMS/DB.
- **Route dinamis** `app/berita/[slug]/page.tsx`: `generateStaticParams` + `generateMetadata` (OG article) + JSON-LD `NewsArticle` + `notFound()` + "Berita Lainnya". Body dirender ke `.prose-desa` (style baru di `globals.css`, pakai token) via `dangerouslySetInnerHTML` (konten tepercaya dari repo).
- **Konsumen jadi async**: `app/berita/page.tsx` (list), `components/sections/Berita.tsx` (3 terbaru), `components/layout/Footer.tsx` (3 terbaru + `layananLinks` diarahkan ke route nyata). Semua link berita → `/berita/[slug]`.
- **`app/sitemap.ts`** kini async + memuat URL detail berita. Data statis lama `lib/content/berita.ts` **dihapus**.

Verifikasi: `npm run lint` bersih, `npm run build` lolos — 22 rute, `/berita/[slug]` prerendered SSG (4 artikel via `generateStaticParams`), TypeScript lolos.

**Cara menambah berita:** buat file baru `content/berita/<slug>.md` dengan frontmatter — otomatis muncul di list, beranda, footer, sitemap, dan sebagai halaman statis saat build.

**Berikutnya:** pola serupa dapat diterapkan ke APBDes detail / halaman lain, atau migrasi sumber ke CMS/DB bila perlu editor non-teknis (§8).

### 2026-07-20 — Halaman dalam lengkap (Layanan, Pengaduan, PPID, Produk Hukum, Berita, Galeri, Tupoksi)
**Oleh:** Agent

Selesai — semua link `#` di navigasi kini menjadi route nyata (18 rute total, semua prerendered static):
- **Profil / Tugas Pokok & Fungsi** `app/profil/tugas-pokok-fungsi` + `tugasPokokFungsi` di `lib/content/profil.ts` (6 jabatan, Permendagri 84/2015).
- **Layanan** `app/layanan` — 1 halaman, seksi anchor `#sop` `#persyaratan` `#maklumat` `#pengadaan` + sticky sub-nav; data baru di `lib/content/layanan.ts`.
- **Pengaduan** `app/pengaduan` — kanal pengaduan + seksi `#alur` + CTA aduan; `lib/content/pengaduan.ts`.
- **PPID** `app/ppid` — seksi `#profil` `#struktur` `#tugas` `#dasar-hukum` `#data`; `lib/content/ppid.ts`.
- **Produk Hukum** `app/produk-hukum` — dikelompokkan per jenis; `lib/content/produk-hukum.ts`.
- **Berita** `app/berita` — list kartu (data statis `beritaTerbaru`, siap ditukar dinamis; detail `[slug]` menyusul).
- **Galeri** `app/galeri` — grid figure + overlay; `lib/content/galeri.ts` (gambar sementara aset hero).
- Tiap halaman: `PageHero` + `metadata`/`canonical` + JSON-LD `BreadcrumbList`.
- **Navigasi**: `lib/content/nav.ts` (dropdowns/simpleLinks/mobileGroups) semua diarahkan ke route baru. Homepage CTA & kartu Layanan (`SmartLink`), tombol Perangkat → struktur, "Semua Berita" → `/berita`, "Statistik Desa" → `/profil/demografi`.
- **`app/sitemap.ts`** diperbarui memuat seluruh rute baru.

Verifikasi: `npm run lint` bersih, `npm run build` lolos (18 rute static), TypeScript lolos.

**Berikutnya:** siap ke Fase Data Dinamis (§8) — Berita (`app/berita/[slug]`, sumber data) atas perintah user. Sisa link `#` tinggal CTA "Lihat Detail APBDes" (belum ada halaman APBDes) & detail berita.

### 2026-07-20 — SEO/GEO: OG image dinamis, sitemap, robots (Fase UI)
**Oleh:** Agent

Selesai:
- **OG image dinamis** `app/opengraph-image.tsx` (`next/og` `ImageResponse`, 1200×630): gradasi emerald + brand + slogan. `app/twitter-image.tsx` re-export render yang sama. Referensi statis `/images/og-desa-sidoharjo.jpg` di `app/layout.tsx` (openGraph & twitter `images`) dihapus agar konvensi file-based dipakai otomatis — aset JPG tak lagi diperlukan. (Warna OG pakai hex; pengecualian khusus karena `next/og` tak dukung oklch/CSS var.)
- **`app/sitemap.ts`**: daftar rute statis (beranda + 3 halaman Profil) dengan `changeFrequency`/`priority`, `lastModified`.
- **`app/robots.ts`**: `allow: "/"` + `sitemap` + `host` (dari `site.url`). **`public/robots.txt` dihapus** untuk hindari bentrok konvensi.
- JSON-LD `BreadcrumbList` sudah ada di tiap halaman Profil (sesi sebelumnya).

Verifikasi: `npm run build` lolos — `/opengraph-image`, `/twitter-image`, `/robots.txt`, `/sitemap.xml` ter-generate static (11 rute total); `npm run lint` bersih; TypeScript lolos.

**Berikutnya:** halaman dalam tersisa (Layanan/PPID/Tupoksi/Produk Hukum/Galeri) atau mulai data dinamis Berita (§8).

### 2026-07-20 — Halaman dalam Profil + navigasi internal (Fase UI)
**Oleh:** Agent

Selesai:
- **Konten** `lib/content/profil.ts`: `visi`, `misi[]`, `nilaiPelayanan[]` (template — ganti dengan rumusan RPJMDes resmi).
- **Komponen reusable** `components/layout/PageHero.tsx`: header halaman gelap (`primary-900/950`) + breadcrumb (`<ol>`/`aria-current`) + eyebrow/judul/deskripsi. `components/layout/SmartLink.tsx`: pilih `<Link>` (rute internal `/`) vs `<a>` (eksternal/anchor/mailto).
- **Route baru** (semua prerendered static, tiap halaman `metadata` + `canonical` + JSON-LD `BreadcrumbList`):
  - `app/profil/visi-misi/page.tsx` — kartu visi sticky + daftar misi bernomor + grid nilai pelayanan.
  - `app/profil/struktur-organisasi/page.tsx` — grid perangkat (reuse `perangkatDesa`/`initials`).
  - `app/profil/demografi/page.tsx` — kartu statistik + bar komposisi jenis kelamin (reuse data `statistik`).
- **Navigasi**: `lib/content/nav.ts` link Profil diarahkan ke rute baru + anchor `/#perangkat`, `/#statistik`; `Navbar.tsx` & `MobileDrawer.tsx` item dropdown/simpleLinks pakai `SmartLink` (drawer menutup saat item diklik via `onClose`).

Verifikasi: `npm run lint` bersih, `npm run build` lolos (7 halaman, `/profil/*` static), TypeScript lolos.

**Berikutnya:** Aset `og-desa-sidoharjo.jpg` + `app/sitemap.ts`/`robots.ts` (§7). Sisa link `#` (Layanan/PPID/Tupoksi/Produk Hukum/Galeri) menyusul.

### 2026-07-20 — Section Statistik & Peta Desa (Fase UI)
**Oleh:** Agent

Selesai:
- **Data** `lib/content/statistik.ts`: `pendudukTotal` 4.089 (L 1.977 · P 2.112) sesuai §6; `statistikKartu` (3 kartu berikon+tone), `petaQuery`/`petaEmbedSrc` (Google Maps embed tanpa API key), helper `formatAngka`.
- **Komponen** `components/sections/Statistik.tsx` (server component): 2 kolom — kiri kartu statistik (`sm:3`) + bar distribusi jenis kelamin (persentase terhitung), kanan embed peta `<iframe>` (`loading="lazy"`, `title`, `referrerPolicy`) + kartu alamat dari `site.address`. Token desain penuh + varian `dark:`, latar `bg-surface-muted` (alternasi dengan `Perangkat` yang `bg-surface`), a11y (`role="img"`/`aria-label` pada bar, `aria-hidden` ikon).
- Dirangkai di `app/page.tsx` setelah `<Perangkat />`.

Verifikasi: `npm run lint` bersih, `npm run build` lolos (`/` prerendered static), TypeScript lolos.

**Berikutnya:** Halaman dalam (Profil/Visi-Misi) & aset OG/SEO (§7).

### 2026-07-20 — Section Perangkat Desa (Fase UI)
**Oleh:** Agent

Selesai:
- **Data** `lib/content/perangkat.ts`: tipe `Perangkat` (`name?`, `position`, `photo?`, `photoAlt?`, `featured?`) + array `perangkatDesa`. Nama Kepala Desa (Titik Saptawati, S.Pd, M.H — `featured`) & Sekretaris Desa (Sugiyanto) sesuai §6; jabatan lain (Kaur/Kasi) dibiarkan tanpa nama (label "Nama menyusul") agar tidak memuat data tak terverifikasi. Helper `initials()` untuk avatar fallback (buang gelar setelah koma).
- **Komponen** `components/sections/Perangkat.tsx` (server component): grid profil (`sm:2`/`lg:3`) kartu terpusat. Avatar bulat 3-tingkat: foto `next/image` → inisial → ikon orang (bila nama kosong). Kartu Kepala Desa disorot ring/aksen emas (`featured`). Token desain penuh + varian `dark:`, latar `bg-surface` (alternasi dengan `Berita` yang `bg-surface-muted`), kartu `rounded-2xl` + border, hover lift.
- Dirangkai di `app/page.tsx` setelah `<Berita />`.

Verifikasi: `npm run lint` bersih, `npm run build` lolos (`/` prerendered static), TypeScript lolos.

**Berikutnya:** Section Statistik & Peta Desa (§7).

### 2026-07-20 — Section Berita Terbaru (Fase UI)
**Oleh:** Agent

Selesai:
- **Data** `lib/content/berita.ts` diperluas: tipe `BeritaRingkas` ditambah field opsional `slug`, `category`, `excerpt`, `image`, `imageAlt` (field lama `title`/`date`/`href` dipertahankan agar `Footer.tsx` tetap jalan). Judul dilengkapi (tak lagi terpotong `…`), thumbnail sementara memakai aset hero yang ada.
- **Komponen** `components/sections/Berita.tsx` (server component): header + tautan "Semua Berita", grid 3 kartu (`sm:2` / `lg:3`). Kartu: thumbnail `next/image` `fill` + `sizes` + zoom `motion-safe:group-hover:scale-105`, badge kategori, tanggal berikon, judul, `excerpt` `line-clamp-3`, CTA "Baca Selengkapnya". Fallback blok warna bila `image` kosong.
- Navigasi pakai `<Link>` (`next/link`); token desain penuh + varian `dark:`; latar `bg-surface-muted` (alternasi dengan `Apbdes` yang `bg-surface`); kartu `rounded-2xl border-black/5 dark:border-white/10`.
- Dirangkai di `app/page.tsx` setelah `<Apbdes />`.

Verifikasi: `npm run lint` bersih, `npm run build` lolos (`/` prerendered static), TypeScript lolos.

**Berikutnya:** Section Perangkat Desa (§7).

### 2026-07-20 — Section APBDes (Fase UI)
**Oleh:** Agent

Selesai:
- **Data** `lib/content/apbdes.ts`: `apbdesTahun`, `apbdesRingkasan` (pendapatan/belanja), `apbdesDefisit` (terhitung), `apbdesPendapatan` (PAD/ADD/DD/BANPROV/BHP, urut nominal), `apbdesPendapatanTotal`, plus helper `formatRupiah` & `formatRupiahRingkas` (Intl `id-ID`).
- **Komponen** `components/sections/Apbdes.tsx` (server component, tanpa `"use client"`): header `.eyebrow` + `<h2>`, 2 kartu ringkasan (Pendapatan/Belanja) + kartu catatan defisit (aksen emas), panel rincian sumber pendapatan dengan progress bar CSS-only (proporsi dihitung terhadap total pendapatan resmi agar angka jujur), footer total + CTA.
- **Aksesibilitas**: `role="progressbar"` + `aria-valuenow/min/max` + `aria-label` per bar; bar animasi pakai `motion-safe:animate-fade-in`.
- Token desain dipakai penuh (primary/accent/ink/surface), varian `dark:`, latar `bg-surface` (alternasi dengan `Layanan` yang `bg-surface-muted`), dibungkus `.container-desa`, kartu `rounded-2xl/3xl` + `border-black/5 dark:border-white/10`.
- Dirangkai di `app/page.tsx` setelah `<Layanan />`.

Verifikasi: `npm run lint` bersih, `npm run build` lolos (`/` prerendered static), TypeScript lolos.

**Berikutnya:** Section Berita Terbaru (§7).

### 2026-07-20 — Migrasi dari Laravel → Next.js (Fase 0–10)
**Oleh:** Agent

Selesai:
- Bootstrap Next.js 16.2.10 (App Router, TS, Tailwind v4 via `@tailwindcss/postcss`, ESLint, alias `@/*`), pasang `next-themes`.
- **Sistem desain** dipindah ke `app/globals.css` (token OKLCH primary/accent/ink/surface, font, radius, shadow, animasi termasuk kenburns; `@custom-variant dark`; `@layer base/components`).
- **Font** Instrument Sans via `next/font` (`app/fonts.ts`).
- **Layout** `app/layout.tsx`: Metadata API lengkap (title template, keywords, OG, Twitter, canonical, robots, icons), JSON-LD `GovernmentOrganization`, `ThemeProvider`, skip-link a11y.
- **Komponen**: `Navbar` (dropdown + kontak + toggle + tombol drawer), `ThemeToggle` (mounted guard), `MobileDrawer` (React Portal ke body — pengganti `x-teleport`), `Footer` (server), `Hero` (carousel `next/image` + kenburns + autoplay/pause), `Tentang` (Waktu Pelayanan), `Layanan` (grid 6 kartu).
- **Data** dipusatkan di `lib/content/` (site, nav, hero, layanan, berita).
- **Aset** hero images + favicon + robots.txt disalin ke `public/`.
- Interaktivitas Alpine → React: `useState`/`useEffect`, Portal untuk drawer, `next-themes` untuk dark mode.

Verifikasi: `npm run build` lolos (`/` prerendered static), `npm run lint` bersih, TypeScript lolos.
Catatan: dev server diverifikasi user (berfungsi).

**Berikutnya:** Fase UI berikutnya — **Section APBDes** (§7), lalu Berita, Perangkat, Statistik.
