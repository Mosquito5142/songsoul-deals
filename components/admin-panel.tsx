import {
  createProductAction,
  deleteProductAction,
  signOutAction,
  updateProductAction,
} from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { ProductFormFields } from "@/components/product-form-fields";
import { formatBangkokMonth } from "@/lib/month";
import type { Category, ClickStat, Product } from "@/lib/types";

function clicksFor(stats: ClickStat[], productId: string): ClickStat {
  return stats.find((item) => item.productId === productId) ?? {
    productId,
    totalClicks: 0,
    monthClicks: 0,
  };
}

export function AdminPanel({
  email,
  allowlistSynced,
  categories,
  products,
  stats,
  statsAvailable,
  notice,
}: {
  email: string;
  allowlistSynced: boolean;
  categories: Category[];
  products: Product[];
  stats: ClickStat[];
  statsAvailable: boolean;
  notice: string | null;
}) {
  const monthTotal = stats.reduce((sum, item) => sum + item.monthClicks, 0);
  const allTotal = stats.reduce((sum, item) => sum + item.totalClicks, 0);
  const monthLabel = formatBangkokMonth();

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-ink">จัดการสินค้า</h1>
          <p className="mt-1 break-all text-sm text-muted">เข้าสู่ระบบในชื่อ {email}</p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-4 text-sm font-medium text-ink hover:border-teal"
          >
            ออกจากระบบ
          </button>
        </form>
      </div>

      {notice ? (
        <p role="status" className="rounded-2xl border border-line bg-sand px-4 py-3 text-sm leading-6 text-sand-ink">
          {notice}
        </p>
      ) : null}
      {!allowlistSynced ? (
        <p role="alert" className="rounded-2xl border border-line bg-white px-4 py-3 text-sm leading-6 text-ink">
          ยังลงทะเบียนอีเมลผู้ดูแลในฐานข้อมูลไม่ได้ ตรวจ SUPABASE_SERVICE_ROLE_KEY แล้วเข้าสู่ระบบใหม่ การเพิ่มสินค้าและการนับคลิกจึงยังไม่ทำงาน
        </p>
      ) : null}

      <section className="grid grid-cols-2 gap-3" aria-label="ยอดคลิก">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-sm text-muted">คลิกเดือน{monthLabel}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-ink">
            {statsAvailable ? monthTotal : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-sm text-muted">คลิกทั้งหมด</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-ink">
            {statsAvailable ? allTotal : "—"}
          </p>
        </div>
      </section>
      {!statsAvailable ? (
        <p className="text-sm leading-6 text-muted">
          ยังอ่านยอดคลิกไม่ได้ ตรวจว่ารันไฟล์ migration แล้ว และบัญชีนี้ถูกบันทึกในรายชื่อผู้ดูแล
        </p>
      ) : null}

      <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-ink">เพิ่มสินค้า</h2>
        <form action={createProductAction} className="mt-4">
          <ProductFormFields categories={categories} idPrefix="new" />
          <button
            type="submit"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-teal px-4 text-sm font-semibold text-white hover:bg-teal-dark"
          >
            บันทึกสินค้าใหม่
          </button>
        </form>
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-semibold text-ink">สินค้าทั้งหมด</h2>
        {products.length === 0 ? <p className="text-sm text-muted">ยังไม่มีสินค้า</p> : null}
        {products.map((product) => {
          const click = clicksFor(stats, product.id);
          return (
            <article key={product.id} className="grid gap-4 rounded-2xl border border-line bg-white p-4 sm:p-5">
              <div className="flex gap-3">
                <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg bg-[#efeae3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl || "/samples/sleeves.svg"}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink">{product.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {product.published ? "แสดงบนเว็บ" : "ซ่อนอยู่"}
                    {product.isSample ? " · สินค้าตัวอย่าง" : ""}
                    {" · "}คลิกทั้งหมด {statsAvailable ? click.totalClicks : "—"}
                    {" · "}เดือนนี้ {statsAvailable ? click.monthClicks : "—"}
                  </p>
                </div>
              </div>
              <details className="rounded-xl border border-line px-3 py-2">
                <summary className="cursor-pointer text-sm font-medium text-ink">แก้ไข</summary>
                <form action={updateProductAction} className="mt-3">
                  <input type="hidden" name="id" value={product.id} />
                  <ProductFormFields categories={categories} product={product} idPrefix={product.id} />
                  <button
                    type="submit"
                    className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-teal px-4 text-sm font-semibold text-white hover:bg-teal-dark"
                  >
                    บันทึกการแก้ไข
                  </button>
                </form>
              </details>
              <form action={deleteProductAction}>
                <input type="hidden" name="id" value={product.id} />
                <ConfirmSubmitButton label="ลบสินค้า" message="ลบสินค้านี้ถาวรหรือไม่" />
              </form>
            </article>
          );
        })}
      </section>
    </div>
  );
}
