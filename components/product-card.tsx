import { priceLabel, reviewLabel } from "@/lib/product-copy";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  categoryName,
}: {
  product: Product;
  categoryName: string;
}) {
  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#efeae3]">
        {/* รูปมาจากลิงก์ที่เจ้าของวางเอง โดเมนไม่ตายตัว จึงไม่ผ่าน next/image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || "/samples/sleeves.svg"}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-muted">{categoryName}</p>
          {product.isSample ? (
            <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-medium text-sand-ink">
              สินค้าตัวอย่าง
            </span>
          ) : null}
        </div>
        <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-ink">
          {product.name}
        </h3>
        <p className="text-sm leading-6 text-ink">
          <span className="text-muted">ราคาโดยประมาณ </span>
          {priceLabel(product)}
        </p>
        <p className="line-clamp-3 min-h-[4.5rem] flex-1 text-sm leading-6 text-muted">{reviewLabel(product)}</p>
        <a
          href={`/go/${product.id}`}
          target="_blank"
          rel="sponsored nofollow noopener"
          className="mt-auto inline-flex h-11 items-center justify-center rounded-xl bg-teal px-4 text-sm font-semibold text-white hover:bg-teal-dark"
        >
          ดูที่ Shopee
        </a>
      </div>
    </article>
  );
}
