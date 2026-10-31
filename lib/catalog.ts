import type { Category, CategoryGroup, Product } from "@/lib/types";

function byThaiName(a: string, b: string): number {
  return a.localeCompare(b, "th");
}

// เรียงตาม sortOrder ของหมวดเสมอ รวมหมวดที่ยังไม่มีสินค้า
// เพื่อให้โครงหน้าร้านไม่หายไปตอนยังไม่ได้ใส่ของจริง
export function groupProductsByCategory(
  categories: readonly Category[],
  products: readonly Product[],
): CategoryGroup[] {
  const sortedCategories = [...categories].sort(
    (a, b) => a.sortOrder - b.sortOrder || byThaiName(a.name, b.name),
  );

  return sortedCategories.map((category) => ({
    category,
    products: products
      .filter((product) => product.categoryId === category.id)
      .sort((a, b) => a.sortOrder - b.sortOrder || byThaiName(a.name, b.name)),
  }));
}
