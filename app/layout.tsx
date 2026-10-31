import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/public-env";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { buildWebsiteJsonLd } from "@/lib/structured-data";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} | รวมดีลเกมและการ์ด`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | รวมดีลเกมและการ์ด`,
    description: SITE_DESCRIPTION,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | รวมดีลเกมและการ์ด`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={`${noto.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a href="#content" className="skip-link">
          ข้ามไปยังเนื้อหา
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={buildWebsiteJsonLd(siteUrl)} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
