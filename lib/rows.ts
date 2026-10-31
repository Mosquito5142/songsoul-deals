import type { Category, Product } from "@/lib/types";

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
};

export type ProductRow = {
  id: string;
  category_id: string;
  name: string;
  price_note: string;
  review: string;
  image_url: string;
  affiliate_url: string;
  published: boolean;
  is_sample: boolean;
  sort_order: number;
};

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    sortOrder: row.sort_order,
  };
}

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    priceNote: row.price_note ?? "",
    review: row.review ?? "",
    imageUrl: row.image_url ?? "",
    affiliateUrl: row.affiliate_url,
    published: row.published,
    isSample: row.is_sample,
    sortOrder: row.sort_order,
  };
}
