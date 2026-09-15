// Render Markdown → HTML dengan pengamanan.
//
// Sengaja TANPA "server-only" agar dipakai bersama oleh:
//  - render halaman berita di server (lib/berita.ts)
//  - pratinjau langsung di form admin (components/admin/BeritaForm.tsx)
// sehingga hasil pratinjau identik dengan hasil yang benar-benar tampil.
//
// Pengamanan:
//  - Raw HTML di dalam Markdown dibuang (renderer.html => "") → cegah <script> dll.
//  - Protokol tautan/gambar dibatasi (http, https, mailto, tel, relatif, anchor)
//    → cegah javascript: dan data: URI.
import { Marked } from "marked";

const marked = new Marked({ gfm: true });

marked.use({
  walkTokens(token) {
    if (token.type === "link" || token.type === "image") {
      const href = String(token.href ?? "").trim();
      if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
        token.href = "#";
      }
    }
  },
  renderer: {
    html: () => "",
  },
});

/** Ubah Markdown menjadi HTML yang sudah dibersihkan. */
export async function renderMarkdown(source: string): Promise<string> {
  return marked.parse(source ?? "");
}

/** Versi sinkron untuk pratinjau di browser. */
export function renderMarkdownSync(source: string): string {
  return marked.parse(source ?? "", { async: false });
}
