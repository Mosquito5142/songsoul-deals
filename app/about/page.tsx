import { AFFILIATE_DISCLOSURE, TIKTOK_URL, YOUTUBE_URL } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description:
    "Song Soul Deals เป็นหน้ารวมลิงก์สินค้าจากช่อง TikTok @songsoul44 และ YouTube @songsoul_game พร้อมเปิดเผยว่าลิงก์เป็นพันธมิตร Shopee",
  alternates: { canonical: "/about" },
};

const channels = [
  {
    name: "TikTok @songsoul44",
    detail: "คลิปเกม Kuroko",
    href: TIKTOK_URL,
  },
  {
    name: "YouTube @songsoul_game",
    detail: "คลิป One Piece TCG",
    href: YOUTUBE_URL,
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">เกี่ยวกับเรา</h1>
        <p className="mt-4 text-base leading-7 text-muted">
          Song Soul Deals เป็นหน้ารวมลิงก์สินค้าที่พูดถึงในช่องของ Song Soul
          เพื่อให้คนดูหาของที่เกี่ยวกับเกมและการ์ดได้จากที่เดียว โดยไม่ต้องไล่หาในคำอธิบายคลิป
        </p>
      </header>

      <section aria-labelledby="channels-heading" className="grid gap-4">
        <h2 id="channels-heading" className="text-xl font-semibold text-ink">
          ช่องที่ดูแล
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {channels.map((channel) => (
            <li key={channel.href} className="h-full">
              <a
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-line bg-white p-4 hover:border-teal"
              >
                <span className="text-base font-semibold text-ink">{channel.name}</span>
                <span className="text-sm text-muted">{channel.detail}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="disclosure-heading" className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <h2 id="disclosure-heading" className="text-xl font-semibold text-ink">
          ลิงก์พันธมิตร
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">{AFFILIATE_DISCLOSURE}</p>
        <p className="mt-3 text-sm leading-7 text-muted">
          ลิงก์สินค้าพาไปที่ Shopee ราคาและของในสต็อกเป็นของร้านค้าบน Shopee
          เว็บนี้ไม่ได้เปิดช่องทางติดต่อส่วนตัว
        </p>
      </section>
    </div>
  );
}
