import { promises as fs } from "node:fs";
import path from "node:path";
import {
  UPLOAD_CONTENT_TYPES,
  UPLOAD_DIR,
  UPLOAD_FILENAME_RE,
  type UploadExt,
} from "@/lib/uploads";

// Next.js (mode produksi) hanya menyajikan file di `public/` yang sudah ada
// saat server start. Foto yang diunggah setelahnya tidak dikenali dan dijawab
// 404. Route ini hanya terpanggil untuk file yang tidak ada di daftar tersebut,
// lalu membacanya langsung dari disk.
export const dynamic = "force-dynamic";

function notFound() {
  return new Response("Not Found", { status: 404 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  // Whitelist nama file: menolak "..", "/", ekstensi lain, dll.
  const match = UPLOAD_FILENAME_RE.exec(filename);
  if (!match) return notFound();
  const ext = match[1] as UploadExt;

  // Lapisan kedua: path final harus tetap berada di dalam UPLOAD_DIR.
  const filePath = path.join(UPLOAD_DIR, filename);
  if (path.dirname(filePath) !== UPLOAD_DIR) return notFound();

  let data: Buffer;
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) return notFound();
    data = await fs.readFile(filePath);
  } catch {
    // Jangan bocorkan detail error server.
    return notFound();
  }

  return new Response(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": UPLOAD_CONTENT_TYPES[ext],
      "Content-Length": String(data.length),
      // Nama file acak dan tidak pernah ditimpa, jadi aman di-cache lama.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
