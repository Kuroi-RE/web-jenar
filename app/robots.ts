import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/store";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getSettings();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
