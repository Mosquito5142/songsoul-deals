// โครงข้อมูลที่ใช้ทั้งหน้าร้าน หน้าแอดมิน และเทสต์
// ชื่อฟิลด์เป็น camelCase ฝั่งแอป แล้วค่อยแมปกับคอลัมน์ของ Postgres

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  priceNote: string;
  review: string;
  imageUrl: string;
  affiliateUrl: string;
  published: boolean;
  isSample: boolean;
  sortOrder: number;
};

export type ProductInput = {
  name: string;
  categoryId: string;
  priceNote: string;
  review: string;
  imageUrl: string;
  affiliateUrl: string;
  published: boolean;
  isSample: boolean;
  sortOrder: number;
};

export type CategoryGroup = {
  category: Category;
  products: Product[];
};

export type CatalogSource = "sample" | "database" | "unavailable";

export type ClickStat = {
  productId: string;
  totalClicks: number;
  monthClicks: number;
};
