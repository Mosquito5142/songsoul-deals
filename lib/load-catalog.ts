import { isSafeHttpsUrl } from "@/lib/urls";
import { mapCategory, mapProduct, type CategoryRow, type ProductRow } from "@/lib/rows";
import { sampleCategories, sampleProducts } from "@/lib/sample-data";
import { createPublicSupabase } from "@/lib/supabase/public";
import type { CatalogSource, Category, Product } from "@/lib/types";

export type Catalog = {
  source: CatalogSource;
  categories: Category[];
  products: Product[];
};

// ไม่มี env ให้ใช้ไฟล์ตัวอย่าง เพื่อให้ build และหน้าแรกไม่พัง
// ถ้ามี env แต่ฐานข้อมูลล่ม จะไม่แอบโชว์สินค้าตัวอย่างทับของจริง
export async function loadCatalog(): Promise<Catalog> {
  const supabase = createPublicSupabase();
  if (!supabase) {
    return {
      source: "sample",
      categories: sampleCategories,
      products: sampleProducts.filter((product) => product.published),
    };
  }

  try {
    const [categoriesResult, productsResult] = await Promise.all([
      supabase.from("categories").select("id, slug, name, description, sort_order").order("sort_order"),
      supabase
        .from("products")
        .select(
          "id, category_id, name, price_note, review, image_url, affiliate_url, published, is_sample, sort_order",
        )
        .eq("published", true)
        .order("sort_order"),
    ]);

    if (categoriesResult.error || productsResult.error) {
      return { source: "unavailable", categories: [], products: [] };
    }

    const categories = ((categoriesResult.data ?? []) as CategoryRow[]).map(mapCategory);
    const products = ((productsResult.data ?? []) as ProductRow[])
      .map(mapProduct)
      .filter((product) => product.published && isSafeHttpsUrl(product.affiliateUrl));

    return { source: "database", categories, products };
  } catch {
    return { source: "unavailable", categories: [], products: [] };
  }
}
