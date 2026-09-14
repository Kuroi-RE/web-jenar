// Screenshot + annotation script for the Desa website user manual.
// Uses Playwright (Chromium). Captures public pages and admin panel pages
// (logging in with admin/admin123), drawing red arrows + numbered badges
// on key UI elements for clarity.

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "shots");
fs.mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:3000";
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

// Injected in the page context: draws a fixed overlay with highlight boxes,
// numbered badges, arrows and labels pointing to the given selectors.
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
  annotations.forEach((a, i) => {
    const el = document.querySelector(a.selector);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 4;
    const box = {
      x: Math.max(2, r.left - pad),
      y: Math.max(2, r.top - pad),
      w: r.width + pad * 2,
      h: r.height + pad * 2,
    };
    // highlight rectangle
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
    // estimate label width
    const charW = 7.2;
    const labelW = Math.min(360, 34 + labelText.length * charW);
    const labelH = 26;

    // anchor point on element edge + label position
    let tx, ty, lx, ly; // target point, label top-left
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
      // right
      tx = box.x + box.w;
      ty = box.y + box.h / 2;
      lx = Math.min(window.innerWidth - labelW - 6, box.x + box.w + gap);
      ly = Math.max(6, ty - labelH / 2);
    }

    // arrow start = nearest point of label box to target
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

    // label pill
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
  // stop animations and wait for fonts/images
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important;}" +
      "nextjs-portal,[data-nextjs-toast],#__next-build-watcher,[data-next-badge-root],[data-next-badge]{display:none!important;}",
  });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(500);
}

async function shoot(page, name, { fullPage = false, annotations = null } = {}) {
  if (annotations) {
    // ensure the first annotated element is in view for viewport shots
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ block: "center", behavior: "instant" });
    }, annotations[0].selector);
    await page.waitForTimeout(200);
    await page.evaluate(annotateInPage, annotations);
    await page.waitForTimeout(150);
  }
  // Remove the Next.js development indicator so it does not enter the manual.
  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal").forEach((element) => element.remove());
  });
  const file = path.join(OUT, name + ".jpg");
  await page.screenshot({
    path: file,
    type: "jpeg",
    quality: 82,
    fullPage,
  });
  // cleanup overlay
  if (annotations) {
    await page.evaluate(() => document.getElementById("__manual_overlay")?.remove());
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
    viewport: { width: 1366, height: 860 },
    deviceScaleFactor: 2,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();

  // ---------- PUBLIC PAGES ----------
  await goto(page, "/");
  await shoot(page, "pub-beranda-hero", {
    annotations: [
      { selector: "nav a[href='/']", label: "Logo & nama desa", side: "bottom" },
      { selector: "nav a[href^='http']", label: "Tombol Aduan Masyarakat", side: "bottom", num: 2 },
    ],
  });
  await shoot(page, "pub-beranda-full", { fullPage: true });

  await goto(page, "/layanan");
  await shoot(page, "pub-layanan-full", { fullPage: true });

  await goto(page, "/pengaduan");
  await shoot(page, "pub-pengaduan-full", { fullPage: true });

  await goto(page, "/ppid");
  await shoot(page, "pub-ppid-full", { fullPage: true });

  await goto(page, "/produk-hukum");
  await shoot(page, "pub-produk-hukum-full", { fullPage: true });

  await goto(page, "/berita");
  await shoot(page, "pub-berita-full", { fullPage: true });

  await goto(page, "/galeri");
  await shoot(page, "pub-galeri-full", { fullPage: true });

  await goto(page, "/profil/visi-misi");
  await shoot(page, "pub-visi-misi-full", { fullPage: true });

  await goto(page, "/profil/struktur-organisasi");
  await shoot(page, "pub-struktur-full", { fullPage: true });

  await goto(page, "/profil/demografi");
  await shoot(page, "pub-demografi-full", { fullPage: true });

  // ---------- ADMIN LOGIN ----------
  await goto(page, "/admin/login");
  await shoot(page, "adm-login", {
    annotations: [
      { selector: "#username", label: "Isi Username: admin", side: "right" },
      { selector: "#password", label: "Isi Kata Sandi: admin123", side: "right", num: 2 },
      { selector: "button[type=submit]", label: "Klik Masuk", side: "right", num: 3 },
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

  // ---------- ADMIN PAGES ----------
  await shoot(page, "adm-dasbor", {
    annotations: [
      { selector: "aside nav", label: "Menu navigasi admin", side: "right" },
      { selector: "form[action] button[type=submit]", label: "Tombol Keluar (logout)", side: "bottom", num: 2 },
    ],
  });
  await shoot(page, "adm-dasbor-full", { fullPage: true });

  await goto(page, "/admin/berita");
  await shoot(page, "adm-berita-list", { fullPage: true });

  await goto(page, "/admin/berita/baru");
  await shoot(page, "adm-berita-baru", { fullPage: true });

  await goto(page, "/admin/hero");
  await shoot(page, "adm-hero", { fullPage: true });

  await goto(page, "/admin/layanan");
  await shoot(page, "adm-layanan", { fullPage: true });

  await goto(page, "/admin/perangkat");
  await shoot(page, "adm-perangkat", { fullPage: true });

  await goto(page, "/admin/apbdes");
  await shoot(page, "adm-apbdes", { fullPage: true });

  await goto(page, "/admin/statistik");
  await shoot(page, "adm-statistik", { fullPage: true });

  await goto(page, "/admin/profil");
  await shoot(page, "adm-profil", { fullPage: true });

  await goto(page, "/admin/ppid");
  await shoot(page, "adm-ppid", { fullPage: true });

  await goto(page, "/admin/produk-hukum");
  await shoot(page, "adm-produk-hukum", { fullPage: true });

  await goto(page, "/admin/galeri");
  await shoot(page, "adm-galeri", { fullPage: true });

  await goto(page, "/admin/pengaturan");
  await shoot(page, "adm-pengaturan", { fullPage: true });

  await browser.close();
  console.log("DONE");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
