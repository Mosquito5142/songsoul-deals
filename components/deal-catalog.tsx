import { ProductCard } from "@/components/product-card";
import type { CatalogSource, CategoryGroup } from "@/lib/types";

export function DealCatalog({
  groups,
  source,
}: {
  groups: CategoryGroup[];
  source: CatalogSource;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10">
      {source === "sample" ? (
        <p className="rounded-2xl border border-line bg-sand px-4 py-3 text-sm leading-6 text-sand-ink">
          ขณะนี้แสดงสินค้าตัวอย่างจากไฟล์ในโปรเจกต์ เพราะยังไม่ได้เชื่อม Supabase รายการนี้ไม่ใช่สินค้าจริง
        </p>
      ) : null}
      {source === "unavailable" ? (
        <p role="status" className="rounded-2xl border border-line bg-white px-4 py-3 text-sm leading-6 text-ink">
          ยังโหลดรายการสินค้าจากฐานข้อมูลไม่ได้ในขณะนี้
        </p>
      ) : null}

      <nav aria-label="หมวดสินค้า" className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <a
            key={group.category.id}
            href={`#${group.category.slug}`}
            className="inline-flex h-10 items-center rounded-full border border-line bg-white px-3 text-sm text-ink hover:border-teal"
          >
            {group.category.name}
          </a>
        ))}
      </nav>

      {groups.map((group) => (
        <section
          key={group.category.id}
          id={group.category.slug}
          aria-labelledby={`heading-${group.category.slug}`}
          className="scroll-mt-24 flex flex-col gap-4"
        >
          <div className="max-w-2xl">
            <h2 id={`heading-${group.category.slug}`} className="text-xl font-semibold text-ink">
              {group.category.name}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">{group.category.description}</p>
          </div>
          {group.products.length === 0 ? (
            <p className="text-sm text-muted">ยังไม่มีสินค้าในหมวดนี้</p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {group.products.map((product) => (
                <li key={product.id} className="flex">
                  <ProductCard product={product} categoryName={group.category.name} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
