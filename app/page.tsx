import { DealCatalog } from "@/components/deal-catalog";
import { JsonLd } from "@/components/json-ld";
import { groupProductsByCategory } from "@/lib/catalog";
import { loadCatalog } from "@/lib/load-catalog";
import { getSiteUrl } from "@/lib/public-env";
import { buildItemListJsonLd } from "@/lib/structured-data";

export const revalidate = 60;

export default async function HomePage() {
  const catalog = await loadCatalog();
  const groups = groupProductsByCategory(catalog.categories, catalog.products);

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
        <p className="text-sm font-medium text-teal">Song Soul</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          รวมดีลอุปกรณ์เกมและการ์ด
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          รายการสินค้าที่คัดจากคลิปเกม Kuroko ทาง TikTok และ One Piece TCG ทาง YouTube
          ปุ่ม «ดูที่ Shopee» เป็นลิงก์พันธมิตร เราอาจได้ค่าคอมมิชชันโดยที่คุณไม่จ่ายเพิ่ม
          ราคาบนร้านเปลี่ยนได้ตลอด กรุณาตรวจราคาล่าสุดก่อนสั่งซื้อ
        </p>
      </section>
      <DealCatalog groups={groups} source={catalog.source} />
      <JsonLd data={buildItemListJsonLd(catalog.products, getSiteUrl())} />
    </>
  );
}
