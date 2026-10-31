import type { Category, Product } from "@/lib/types";

const inputClass = "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink";

export function ProductFormFields({
  categories,
  product,
  idPrefix,
}: {
  categories: Category[];
  product?: Product;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-3">
      <label className="grid gap-1 text-sm" htmlFor={`${idPrefix}-name`}>
        <span className="font-medium">ชื่อสินค้า</span>
        <input
          id={`${idPrefix}-name`}
          name="name"
          required
          maxLength={120}
          defaultValue={product?.name ?? ""}
          className={inputClass}
        />
      </label>
      <label className="grid gap-1 text-sm" htmlFor={`${idPrefix}-category`}>
        <span className="font-medium">หมวด</span>
        <select
          id={`${idPrefix}-category`}
          name="categoryId"
          defaultValue={product?.categoryId ?? categories[0]?.id}
          className={inputClass}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm" htmlFor={`${idPrefix}-price`}>
        <span className="font-medium">ราคาโดยประมาณ</span>
        <input
          id={`${idPrefix}-price`}
          name="priceNote"
          maxLength={80}
          defaultValue={product?.priceNote ?? ""}
          placeholder="เว้นว่างได้ เช่น ราคาประมาณ 150 บาท"
          className={inputClass}
        />
      </label>
      <label className="grid gap-1 text-sm" htmlFor={`${idPrefix}-review`}>
        <span className="font-medium">คำรีวิวสั้น</span>
        <textarea
          id={`${idPrefix}-review`}
          name="review"
          maxLength={400}
          defaultValue={product?.review ?? ""}
          className="min-h-24 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink"
        />
      </label>
      <label className="grid gap-1 text-sm" htmlFor={`${idPrefix}-image`}>
        <span className="font-medium">ลิงก์รูป</span>
        <input
          id={`${idPrefix}-image`}
          name="imageUrl"
          maxLength={500}
          defaultValue={product?.imageUrl ?? ""}
          placeholder="https:// หรือ /samples/..."
          className={inputClass}
        />
      </label>
      <label className="grid gap-1 text-sm" htmlFor={`${idPrefix}-url`}>
        <span className="font-medium">ลิงก์ Shopee Affiliate</span>
        <input
          id={`${idPrefix}-url`}
          name="affiliateUrl"
          type="url"
          required
          maxLength={2000}
          defaultValue={product?.affiliateUrl ?? ""}
          placeholder="https://shopee.co.th/..."
          className={inputClass}
        />
      </label>
      <label className="grid gap-1 text-sm" htmlFor={`${idPrefix}-sort`}>
        <span className="font-medium">ลำดับในหมวด</span>
        <input
          id={`${idPrefix}-sort`}
          name="sortOrder"
          type="number"
          min={0}
          max={9999}
          defaultValue={product?.sortOrder ?? 0}
          className={inputClass}
        />
      </label>
      <label className="flex items-center gap-2 text-sm" htmlFor={`${idPrefix}-published`}>
        <input
          id={`${idPrefix}-published`}
          name="published"
          type="checkbox"
          defaultChecked={product?.published ?? false}
          className="size-4 accent-teal"
        />
        แสดงบนหน้าร้าน
      </label>
      <label className="flex items-center gap-2 text-sm" htmlFor={`${idPrefix}-sample`}>
        <input
          id={`${idPrefix}-sample`}
          name="isSample"
          type="checkbox"
          defaultChecked={product?.isSample ?? false}
          className="size-4 accent-teal"
        />
        สินค้าตัวอย่าง (ต้องเว้นราคา และใช้ข้อความตัวอย่างเท่านั้น)
      </label>
    </div>
  );
}
