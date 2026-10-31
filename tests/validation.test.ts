import { sampleCategories, sampleProducts } from "@/lib/sample-data";
import { SAMPLE_NOTICE } from "@/lib/site";
import { readProductForm, validateProductInput } from "@/lib/validation";
import { describe, expect, it } from "vitest";

const categoryIds = sampleCategories.map((category) => category.id);

function input(overrides: Partial<ReturnType<typeof readProductForm>> = {}) {
  return {
    name: "ซองใส่การ์ด",
    categoryId: categoryIds[0],
    priceNote: "ประมาณ 90 บาท",
    review: "ซองด้านที่ใช้กับเดคหลัก",
    imageUrl: "https://example.com/sleeve.jpg",
    affiliateUrl: "https://shopee.co.th/product",
    published: true,
    isSample: false,
    sortOrder: 1,
    ...overrides,
  };
}

describe("validateProductInput", () => {
  it("รับสินค้าจริงที่ข้อมูลครบ", () => {
    const result = validateProductInput(input(), categoryIds);
    expect(result.ok).toBe(true);
  });

  it("ปฏิเสธชื่อว่าง ลิงก์ที่ไม่ใช่ https และหมวดที่ไม่มี", () => {
    const result = validateProductInput(
      input({
        name: "  ",
        categoryId: "missing",
        affiliateUrl: "http://shopee.co.th/item",
        imageUrl: "javascript:alert(1)",
        sortOrder: 1.5,
      }),
      categoryIds,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("สินค้าตัวอย่างห้ามมีราคาหรือรีวิวที่แต่งขึ้น", () => {
    const priced = validateProductInput(
      input({ isSample: true, priceNote: "199 บาท", review: SAMPLE_NOTICE }),
      categoryIds,
    );
    const reviewed = validateProductInput(
      input({ isSample: true, priceNote: "", review: "ใส่แล้วลื่นมาก แนะนำเลย" }),
      categoryIds,
    );
    expect(priced.ok).toBe(false);
    expect(reviewed.ok).toBe(false);
  });

  it("สินค้าตัวอย่างในไฟล์ผ่านตัวตรวจ", () => {
    for (const product of sampleProducts) {
      const result = validateProductInput(
        {
          name: product.name,
          categoryId: product.categoryId,
          priceNote: product.priceNote,
          review: product.review,
          imageUrl: product.imageUrl,
          affiliateUrl: product.affiliateUrl,
          published: product.published,
          isSample: product.isSample,
          sortOrder: product.sortOrder,
        },
        categoryIds,
      );
      expect(result.ok).toBe(true);
    }
  });

  it("อ่านค่าจากฟอร์มและถือว่าช่องที่ไม่ติ๊กเป็นเท็จ", () => {
    const form = new FormData();
    form.set("name", "  จอย  ");
    form.set("categoryId", categoryIds[2]);
    form.set("affiliateUrl", "https://shopee.co.th");
    form.set("sortOrder", "4");
    const value = readProductForm(form);
    expect(value.name).toBe("จอย");
    expect(value.published).toBe(false);
    expect(value.isSample).toBe(false);
    expect(value.sortOrder).toBe(4);
  });
});
