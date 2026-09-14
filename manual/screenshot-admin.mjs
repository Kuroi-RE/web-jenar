// Screenshot + anotasi untuk Manual Book Admin (Pengaturan Website Desa).
// Memakai Playwright (Chromium). Login admin (admin/admin123), lalu memotret
// tiap halaman Panel Admin dengan panah + bingkai merah pada elemen penting.
//
// Jalankan dengan dev server aktif:  node manual/screenshot-admin.mjs

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "shots-admin");
fs.mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:3000";
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

// Digambar di dalam konteks halaman: overlay dengan bingkai, badge nomor,
// panah, dan label untuk tiap anotasi. Mendukung selektor CSS maupun pencarian
// berdasarkan teks ({ contains: { tag, text } }).
function annotateInPage(annotations) {
  document.getElementById("__manual_overlay")?.remove();
  const SVGNS = "http://www.w3.org/2000/svg";
  const overlay = document.createElement("div");
  overlay.id = "__manual_overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "2147483647",
    pointerEvents: "none",
  });
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.position = "absolute";
  svg.style.inset = "0";
  const defs = document.createElementNS(SVGNS, "defs");
  defs.innerHTML =
    '<marker id="__ah" markerWidth="12" markerHeight="12" refX="9" refY="5" orient="auto" markerUnits="userSpaceOnUse">' +
    '<path d="M0,0 L11,5 L0,10 z" fill="#e11d48"/></marker>';
  svg.appendChild(defs);
  overlay.appendChild(svg);
  document.body.appendChild(overlay);

  const RED = "#e11d48";

  const resolve = (a) => {
    if (a.selector) return document.querySelector(a.selector);
    if (a.contains) {
      const tag = a.contains.tag || "button";
      const els = Array.from(document.querySelectorAll(tag));
      return (
        els.find(
          (e) =>
            e.offsetParent !== null &&
            (e.textContent || "").trim().includes(a.contains.text),
        ) || null
      );
    }
    return null;
  };

  annotations.forEach((a, i) => {
    const el = resolve(a);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 4;
    const box = {
      x: Math.max(2, r.left - pad),
      y: Math.max(2, r.top - pad),
      w: r.width + pad * 2,
      h: r.height + pad * 2,
    };
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", box.x);
    rect.setAttribute("y", box.y);
    rect.setAttribute("width", box.w);
    rect.setAttribute("height", box.h);
    rect.setAttribute("rx", "8");
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", RED);
    rect.setAttribute("stroke-width", "3");
    svg.appendChild(rect);

    const side = a.side || "top";
    const num = a.num != null ? a.num : i + 1;
    const labelText = num + ". " + a.label;
    const charW = 7.2;
    const labelW = Math.min(380, 34 + labelText.length * charW);
    const labelH = 26;

    let tx, ty, lx, ly;
    const gap = 46;
    if (side === "top") {
      tx = box.x + box.w / 2;
      ty = box.y;
      lx = Math.min(window.innerWidth - labelW - 6, Math.max(6, tx - labelW / 2));
      ly = Math.max(6, box.y - gap - labelH);
    } else if (side === "bottom") {
      tx = box.x + box.w / 2;
      ty = box.y + box.h;
      lx = Math.min(window.innerWidth - labelW - 6, Math.max(6, tx - labelW / 2));
      ly = Math.min(window.innerHeight - labelH - 6, box.y + box.h + gap);
    } else if (side === "left") {
      tx = box.x;
      ty = box.y + box.h / 2;
      lx = Math.max(6, box.x - gap - labelW);
      ly = Math.max(6, ty - labelH / 2);
    } else {
      tx = box.x + box.w;
      ty = box.y + box.h / 2;
      lx = Math.min(window.innerWidth - labelW - 6, box.x + box.w + gap);
      ly = Math.max(6, ty - labelH / 2);
    }

    let sx, sy;
    if (side === "top") {
      sx = lx + labelW / 2;
      sy = ly + labelH;
    } else if (side === "bottom") {
      sx = lx + labelW / 2;
      sy = ly;
    } else if (side === "left") {
      sx = lx + labelW;
      sy = ly + labelH / 2;
    } else {
      sx = lx;
      sy = ly + labelH / 2;
    }
    const line = document.createElementNS(SVGNS, "line");
    line.setAttribute("x1", sx);
    line.setAttribute("y1", sy);
    line.setAttribute("x2", tx);
    line.setAttribute("y2", ty);
    line.setAttribute("stroke", RED);
    line.setAttribute("stroke-width", "3");
    line.setAttribute("marker-end", "url(#__ah)");
    svg.appendChild(line);

    const g = document.createElementNS(SVGNS, "g");
    const lr = document.createElementNS(SVGNS, "rect");
    lr.setAttribute("x", lx);
    lr.setAttribute("y", ly);
    lr.setAttribute("width", labelW);
    lr.setAttribute("height", labelH);
    lr.setAttribute("rx", "13");
    lr.setAttribute("fill", RED);
    g.appendChild(lr);
    const t = document.createElementNS(SVGNS, "text");
    t.setAttribute("x", lx + labelW / 2);
    t.setAttribute("y", ly + labelH / 2 + 5);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("fill", "#fff");
    t.setAttribute("font-family", "Arial, sans-serif");
    t.setAttribute("font-size", "13");
    t.setAttribute("font-weight", "700");
    t.textContent = labelText;
    g.appendChild(t);
    svg.appendChild(g);
  });
}

async function settle(page) {
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important;}" +
      "nextjs-portal,[data-nextjs-toast],#__next-build-watcher,[data-next-badge-root],[data-next-badge]{display:none!important;}",
  });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(400);
}

async function shoot(page, name, opts = {}) {
  const { fullPage = false, annotations = null, scroll = null } = opts;
  if (scroll) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ block: "center", behavior: "instant" });
    }, scroll);
    await page.waitForTimeout(250);
  } else if (annotations && !fullPage) {
    await page.evaluate(() => window.scrollTo({ top: 0 }));
    await page.waitForTimeout(150);
  }
  if (annotations) {
    await page.evaluate(annotateInPage, annotations);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal").forEach((e) => e.remove());
  });
  const file = path.join(OUT, name + ".jpg");
  await page.screenshot({ path: file, type: "jpeg", quality: 82, fullPage });
  if (annotations) {
    await page.evaluate(() =>
      document.getElementById("__manual_overlay")?.remove(),
    );
  }
  console.log("saved", name);
}

async function goto(page, url) {
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await settle(page);
}

async function run() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();

  // ---------- LOGIN ----------
  await goto(page, "/admin/login");
  await shoot(page, "login", {
    annotations: [
      { selector: "#username", label: "Isi Username: admin", side: "right" },
      { selector: "#password", label: "Isi Kata Sandi: admin123", side: "right", num: 2 },
      { selector: "button[type=submit]", label: "Klik tombol Masuk", side: "right", num: 3 },
    ],
  });

  await page.fill("#username", ADMIN_USER);
  await page.fill("#password", ADMIN_PASS);
  await Promise.all([
    page.waitForURL("**/admin", { timeout: 15000 }).catch(() => {}),
    page.click("button[type=submit]"),
  ]);
  await page.waitForTimeout(1200);
  await settle(page);

  // ---------- DASBOR ----------
  await shoot(page, "dasbor", {
    annotations: [
      { selector: "aside nav", label: "Menu semua pengaturan", side: "right" },
      { contains: { tag: "a", text: "Lihat Website" }, label: "Buka situs publik", side: "bottom", num: 2 },
      { contains: { tag: "button", text: "Keluar" }, label: "Keluar (logout)", side: "bottom", num: 3 },
    ],
  });
  await shoot(page, "dasbor-full", { fullPage: true });

  // ---------- PENGATURAN UMUM ----------
  await goto(page, "/admin/pengaturan");
  await shoot(page, "pengaturan", {
    annotations: [
      { selector: "input[name=name]", label: "Nama Desa — dipakai di seluruh situs", side: "right" },
      { selector: "input[name=url]", label: "Alamat/URL situs resmi", side: "right", num: 2 },
    ],
  });
  await shoot(page, "pengaturan-tautan", {
    scroll: "input[name=link_aduan]",
    annotations: [
      { selector: "input[name=link_aduan]", label: "Tautan Pengaduan", side: "right" },
      { contains: { tag: "button", text: "Tambah Tautan" }, label: "Tambah baris tautan", side: "right", num: 2 },
      { contains: { tag: "button", text: "Hapus" }, label: "Hapus baris tautan", side: "left", num: 3 },
    ],
  });
  await shoot(page, "pengaturan-full", { fullPage: true });

  // ---------- HERO ----------
  await goto(page, "/admin/hero");
  await shoot(page, "hero", {
    annotations: [
      { selector: "#eyebrow", label: "Label kecil di atas judul", side: "right" },
      { selector: "#subtitle", label: "Subjudul Hero", side: "right", num: 2 },
      { selector: "#description", label: "Deskripsi Hero", side: "right", num: 3 },
    ],
  });
  await shoot(page, "hero-slide", {
    scroll: "input[name=slide_alt_0]",
    annotations: [
      { contains: { tag: "label", text: "Unggah Foto" }, label: "Unggah gambar slide", side: "right" },
      { selector: "input[name=slide_alt_0]", label: "Teks alternatif gambar", side: "right", num: 2 },
    ],
  });

  // ---------- BERITA ----------
  await goto(page, "/admin/berita");
  await shoot(page, "berita-list", {
    annotations: [
      { contains: { tag: "a", text: "Tambah Berita" }, label: "Buat berita baru", side: "bottom" },
    ],
  });
  await shoot(page, "berita-list-full", { fullPage: true });

  await goto(page, "/admin/berita/baru");
  await shoot(page, "berita-baru", {
    annotations: [
      { selector: "#title", label: "Judul berita (wajib)", side: "right" },
      { selector: "#date", label: "Tanggal terbit (wajib)", side: "right", num: 2 },
    ],
  });
  await shoot(page, "berita-baru-isi", {
    scroll: "#body",
    annotations: [
      { selector: "#body", label: "Isi berita (format Markdown)", side: "top" },
      { contains: { tag: "button", text: "Terbitkan" }, label: "Terbitkan berita", side: "top", num: 2 },
    ],
  });

  // ---------- LAYANAN ----------
  await goto(page, "/admin/layanan");
  await shoot(page, "layanan", {
    annotations: [
      { selector: "input[name=title_0]", label: "Judul layanan", side: "right" },
      { contains: { tag: "button", text: "Hapus" }, label: "Hapus kartu layanan", side: "left", num: 2 },
      { contains: { tag: "button", text: "Tambah Layanan" }, label: "Tambah kartu layanan", side: "right", num: 3 },
    ],
  });

  // ---------- PERANGKAT ----------
  await goto(page, "/admin/perangkat");
  await shoot(page, "perangkat", {
    annotations: [
      { selector: "input[name=position_0]", label: "Jabatan perangkat", side: "right" },
      { selector: "input[name=featured_0]", label: "Tandai Kepala Desa (hanya satu)", side: "right", num: 2 },
      { contains: { tag: "button", text: "Tambah Perangkat" }, label: "Tambah perangkat", side: "right", num: 3 },
    ],
  });

  // ---------- APBDES ----------
  await goto(page, "/admin/apbdes");
  await shoot(page, "apbdes", {
    annotations: [
      { selector: "#pendapatan", label: "Nominal otomatis diformat Rupiah", side: "right" },
      { selector: "#belanja", label: "Total belanja (Rupiah)", side: "right", num: 2 },
    ],
  });
  await shoot(page, "apbdes-rincian", {
    scroll: "input[name=code_0]",
    annotations: [
      { selector: "input[name=code_0]", label: "Kode sumber (PAD, DD, ...)", side: "right" },
      { selector: "#amount_0", label: "Nominal Rupiah terformat", side: "right", num: 2 },
      { contains: { tag: "button", text: "Tambah Sumber Pendapatan" }, label: "Tambah sumber", side: "right", num: 3 },
    ],
  });

  // ---------- STATISTIK ----------
  await goto(page, "/admin/statistik");
  await shoot(page, "statistik", {
    annotations: [
      { selector: "input[name=total]", label: "Total penduduk", side: "right" },
      { selector: "input[name=laki]", label: "Jumlah laki-laki", side: "right", num: 2 },
      { selector: "input[name=perempuan]", label: "Jumlah perempuan", side: "right", num: 3 },
    ],
  });
  await shoot(page, "statistik-full", { fullPage: true });

  // ---------- PROFIL ----------
  await goto(page, "/admin/profil");
  await shoot(page, "profil", {
    annotations: [
      { selector: "textarea[name=visi]", label: "Visi desa", side: "right" },
      { selector: "textarea[name=misi]", label: "Misi (satu poin per baris)", side: "right", num: 2 },
    ],
  });
  await shoot(page, "profil-full", { fullPage: true });

  // ---------- PPID ----------
  await goto(page, "/admin/ppid");
  await shoot(page, "ppid", {
    annotations: [
      { selector: "textarea[name=ppid_profil]", label: "Profil singkat PPID", side: "right" },
    ],
  });
  await shoot(page, "ppid-full", { fullPage: true });

  // ---------- PRODUK HUKUM ----------
  await goto(page, "/admin/produk-hukum");
  await shoot(page, "produk-hukum", {
    annotations: [
      { selector: "input[name=ph_jenis_0]", label: "Jenis dokumen", side: "right" },
      { selector: "input[name=ph_tentang_0]", label: "Perihal/tentang (wajib)", side: "right", num: 2 },
      { contains: { tag: "button", text: "Tambah Dokumen" }, label: "Tambah dokumen", side: "right", num: 3 },
    ],
  });

  // ---------- GALERI ----------
  await goto(page, "/admin/galeri");
  await shoot(page, "galeri", {
    annotations: [
      { contains: { tag: "label", text: "Unggah Foto" }, label: "Unggah gambar galeri", side: "right" },
      { contains: { tag: "button", text: "Tambah Foto" }, label: "Tambah foto galeri", side: "right", num: 2 },
    ],
  });

  await browser.close();
  console.log("DONE");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
