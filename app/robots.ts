import { getSiteUrl } from "@/lib/public-env";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/go/", "/auth/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
