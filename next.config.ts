import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy yang kompatibel dengan Next.js + embed Google Maps
// + widget Cloudflare Turnstile pada halaman login admin.
// Catatan: 'unsafe-inline' pada script/style masih diperlukan karena Next
// menyuntikkan script bootstrap & style inline tanpa nonce.
// 'unsafe-eval' HANYA diaktifkan saat development karena React/Next dev mode
// (Fast Refresh, debugging) memakai eval(); di produksi tetap dilarang.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com"
  : "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "img-src 'self' data: blob:",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://maps.google.com https://www.google.com https://challenges.cloudflare.com",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Output mandiri untuk image Docker yang ramping.
  output: "standalone",
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
