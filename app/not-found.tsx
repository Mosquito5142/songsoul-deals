import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid w-full max-w-xl gap-4 px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-ink">ไม่พบหน้านี้</h1>
      <p className="text-sm leading-7 text-muted">ลิงก์อาจถูกย้ายหรือพิมพ์ไม่ครบ</p>
      <Link
        href="/"
        className="inline-flex h-11 w-fit items-center justify-center rounded-xl bg-teal px-4 text-sm font-semibold text-white"
      >
        กลับหน้าแรก
      </Link>
    </div>
  );
}
