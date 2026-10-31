import { SAMPLE_NOTICE } from "@/lib/site";
import type { Category, Product } from "@/lib/types";

// ข้อมูลชุดนี้ใช้เมื่อยังไม่มี env ของ Supabase
// ราคาและรีวิวตั้งใจเว้นให้เห็นชัดว่ายังไม่ใช่สินค้าจริง

export const sampleCategories: Category[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "sleeves-boxes",
    name: "ซอง/กล่องใส่การ์ด",
    description: "ซองใส่การ์ด กล่องเดค และกล่องเก็บการ์ด",
    sortOrder: 1,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "play-accessories",
    name: "อุปกรณ์เล่นการ์ด",
    description: "เพลย์แมต ลูกเต๋า และอุปกรณ์บนโต๊ะเล่น",
    sortOrder: 2,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    slug: "gaming-gear",
    name: "จอย/หูฟัง/ไมค์เกมมิ่ง",
    description: "จอย หูฟัง และไมโครโฟนสำหรับเล่นเกม",
    sortOrder: 3,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    slug: "other",
    name: "อื่นๆ",
    description: "สินค้าที่ยังไม่เข้าสามหมวดด้านบน",
    sortOrder: 4,
  },
];

const sampleBase = {
  priceNote: "",
  review: SAMPLE_NOTICE,
  affiliateUrl: "https://shopee.co.th",
  published: true,
  isSample: true,
} as const;

export const sampleProducts: Product[] = [
  {
    ...sampleBase,
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    categoryId: sampleCategories[0].id,
    name: "สินค้าตัวอย่าง: ซองใส่การ์ด",
    imageUrl: "/samples/sleeves.svg",
    sortOrder: 1,
  },
  {
    ...sampleBase,
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
    categoryId: sampleCategories[0].id,
    name: "สินค้าตัวอย่าง: กล่องเก็บการ์ดสำหรับเดค",
    imageUrl: "/samples/box.svg",
    sortOrder: 2,
  },
  {
    ...sampleBase,
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3",
    categoryId: sampleCategories[1].id,
    name: "สินค้าตัวอย่าง: แผ่นรองเล่นการ์ด",
    imageUrl: "/samples/mat.svg",
    sortOrder: 1,
  },
  {
    ...sampleBase,
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4",
    categoryId: sampleCategories[2].id,
    name: "สินค้าตัวอย่าง: จอยเกม",
    imageUrl: "/samples/controller.svg",
    sortOrder: 1,
  },
];
