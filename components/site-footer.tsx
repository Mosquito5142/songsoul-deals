import { AFFILIATE_DISCLOSURE, SITE_NAME, TIKTOK_URL, YOUTUBE_URL } from "@/lib/site";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-8 sm:px-6">
        <p className="max-w-3xl text-sm leading-6 text-muted">{AFFILIATE_DISCLOSURE}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <Link href="/" className="text-ink hover:text-teal">
            หน้าแรก
          </Link>
          <Link href="/about" className="text-ink hover:text-teal">
            เกี่ยวกับ
          </Link>
          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-teal">
            TikTok @songsoul44
          </a>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-teal">
            YouTube @songsoul_game
          </a>
        </div>
        <p className="text-xs text-muted">{SITE_NAME}</p>
      </div>
    </footer>
  );
}
