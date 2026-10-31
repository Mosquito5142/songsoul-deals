import { SITE_DESCRIPTION, SITE_NAME, TIKTOK_URL, YOUTUBE_URL } from "@/lib/site";
import type { Product } from "@/lib/types";

export function buildWebsiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    inLanguage: "th",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
      sameAs: [TIKTOK_URL, YOUTUBE_URL],
    },
  };
}

// ไม่ใส่ offers เพราะสินค้าตัวอย่างยังไม่มีราคาจริง
export function buildItemListJsonLd(products: readonly Product[], siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `${siteUrl}/go/${product.id}`,
    })),
  };
}
