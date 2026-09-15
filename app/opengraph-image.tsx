import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/store";

export const alt = "Website Resmi Pemerintah Kecamatan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Catatan: warna di sini pakai hex karena OG image (next/og) tidak mendukung
// CSS variable/oklch dari design system. Ini pengecualian khusus render gambar.
export default async function OpengraphImage() {
  const { site } = await getSettings();
  let host = "";
  try {
    host = new URL(site.url).host;
  } catch {
    host = "";
  }
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #052e2b 0%, #0b4f3a 55%, #0f5f45 100%)",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top: brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "84px",
              height: "84px",
              borderRadius: "20px",
              background: "#0f5f45",
              border: "2px solid rgba(255,255,255,0.18)",
              fontSize: "48px",
            }}
          >
            🏛️
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "30px", fontWeight: 700 }}>
              {site.name}
            </span>
            <span style={{ fontSize: "22px", color: "#a7d7c5" }}>
              {site.tagline}
            </span>
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <span
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 20px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              color: "#f2c94c",
              fontSize: "24px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            WEBSITE RESMI PEMERINTAH KECAMATAN
          </span>
          <span
            style={{
              fontSize: "84px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            {site.name}
          </span>
          <span style={{ fontSize: "30px", color: "#cfe8dd", maxWidth: "820px" }}>
            {site.region}
          </span>
        </div>

        {/* Bottom: slogan */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              display: "flex",
              padding: "12px 28px",
              borderRadius: "14px",
              background: "#f2c94c",
              color: "#3a2e08",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            {site.slogan}
          </span>
          <span style={{ fontSize: "24px", color: "#a7d7c5" }}>
            {host}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
