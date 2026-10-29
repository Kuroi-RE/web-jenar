import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isAuthenticated } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { UPLOAD_DIR } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

/** Deteksi tipe gambar dari magic bytes (bukan dari header yang dikirim klien). */
function sniffImageExt(buf: Buffer): "jpg" | "png" | "gif" | "webp" | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "jpg";
  }
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "png";
  }
  if (buf.length >= 4 && buf.toString("ascii", 0, 4) === "GIF8") {
    return "gif";
  }
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  // Rate limit unggah: maks 30 per menit per IP.
  const ip = await getClientIp();
  const limited = rateLimit(`upload:${ip}`, 30, 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak unggahan. Coba lagi sebentar." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File kosong." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Ukuran gambar maksimal 5MB." },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // Validasi berdasarkan isi file (magic bytes), bukan Content-Type klien.
  const ext = sniffImageExt(bytes);
  if (!ext) {
    return NextResponse.json(
      { error: "File bukan gambar valid (JPG, PNG, WEBP, atau GIF)." },
      { status: 400 },
    );
  }

  const dir = UPLOAD_DIR;
  await fs.mkdir(dir, { recursive: true });
  // Nama file acak (tanpa memakai nama dari pengguna → cegah path traversal).
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
  await fs.writeFile(path.join(dir, filename), bytes);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
