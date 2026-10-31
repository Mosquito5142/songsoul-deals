import { SITE_NAME } from "@/lib/site";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0">
          <span className="block text-sm font-semibold tracking-wide text-ink">{SITE_NAME}</span>
          <span className="block truncate text-xs text-muted">รวมดีลเกมและการ์ด</span>
        </Link>
        <nav aria-label="หลัก" className="flex shrink-0 items-center gap-4 text-sm">
          <Link href="/" className="text-ink hover:text-teal">
            หน้าแรก
          </Link>
          <Link href="/about" className="text-ink hover:text-teal">
            เกี่ยวกับ
          </Link>
        </nav>
      </div>
    </header>
  );
}
