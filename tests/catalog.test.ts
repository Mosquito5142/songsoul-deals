import { groupProductsByCategory } from "@/lib/catalog";
import { priceLabel, reviewLabel } from "@/lib/product-copy";
import { sampleCategories, sampleProducts } from "@/lib/sample-data";
import { SAMPLE_NOTICE } from "@/lib/site";
import { buildItemListJsonLd } from "@/lib/structured-data";
import { describe, expect, it } from "vitest";

describe("groupProductsByCategory", () => {
  it("เรียงหมวดตามลำดับ และคงหมวดที่ยังว่าง", () => {
    const groups = groupProductsByCategory(sampleCategories, sampleProducts);
    expect(groups.map((group) => group.category.slug)).toEqual([
      "sleeves-boxes",
      "play-accessories",
      "gaming-gear",
      "other",
    ]);
    expect(groups[0]?.products.map((product) => product.sortOrder)).toEqual([1, 2]);
    expect(groups[3]?.products).toEqual([]);
  });

  it("ไม่ดึงสินค้าข้ามหมวด", () => {
    const groups = groupProductsByCategory(sampleCategories, sampleProducts);
    const ids = groups.flatMap((group) => group.products.map((product) => product.categoryId));
    expect(new Set(ids).size).toBe(3);
  });
});

describe("สินค้าตัวอย่าง", () => {
  it("ติดป้ายตัวอย่างและไม่แต่งราคา", () => {
    expect(sampleProducts).toHaveLength(4);
    for (const product of sampleProducts) {
      expect(product.isSample).toBe(true);
      expect(product.name.startsWith("สินค้าตัวอย่าง")).toBe(true);
      expect(product.priceNote).toBe("");
      expect(product.review).toBe(SAMPLE_NOTICE);
      expect(product.affiliateUrl).toBe("https://shopee.co.th");
      expect(priceLabel(product)).toBe(SAMPLE_NOTICE);
      expect(reviewLabel(product)).toBe(SAMPLE_NOTICE);
      expect(priceLabel(product)).not.toMatch(/\d/);
    }
  });

  it("รายการใน JSON-LD ไม่มีราคา", () => {
    const data = buildItemListJsonLd(sampleProducts, "https://songsoul-deals.vercel.app");
    expect(JSON.stringify(data)).not.toContain("offers");
    expect(JSON.stringify(data)).not.toMatch(/\d+\s*บาท/);
  });
});
