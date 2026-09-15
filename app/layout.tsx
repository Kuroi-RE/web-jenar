import type { Metadata } from "next";
import { instrumentSans } from "./fonts";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChromeGate } from "@/components/layout/ChromeGate";
import { getSettings } from "@/lib/store";
import { jsonLdString } from "@/lib/jsonld";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSettings();
  const siteName = site.name;
  const title = `${siteName} — Website Resmi Pemerintah Kecamatan`;
  const description = `Website resmi ${site.legalName}, ${site.region}. Informasi pelayanan publik, berita, profil, dan layanan pengaduan masyarakat.`;

  return {
    metadataBase: new URL(site.url),
    title: {
      default: title,
      template: `%s — ${siteName}`,
    },
    description,
    keywords: [
      siteName,
      site.legalName,
      site.region,
      "layanan kecamatan",
      "pelayanan administrasi terpadu kecamatan",
      "berita kecamatan",
      "pengaduan masyarakat",
      "PPID kecamatan",
    ],
    authors: [{ name: site.legalName }],
    robots: { index: true, follow: true },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: "/",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { site, externalLinks } = await getSettings();

  // JSON-LD: GovernmentOrganization (mengikuti pengaturan tersimpan)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phoneIntl,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: site.name,
      addressRegion: site.region,
      addressCountry: "ID",
    },
    areaServed: site.region,
  };

  return (
    <html
      lang="id"
      className={`${instrumentSans.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
        />
      </head>
      <body className="bg-surface text-ink font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ChromeGate
            navbar={<Navbar site={site} externalLinks={externalLinks} />}
            footer={<Footer />}
          >
            {children}
          </ChromeGate>
        </ThemeProvider>
      </body>
    </html>
  );
}
