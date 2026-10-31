import { SAMPLE_NOTICE } from "@/lib/site";
import type { ProductInput } from "@/lib/types";
import { isSafeHttpsUrl, isSafeImageUrl } from "@/lib/urls";

export type ValidationResult =
  | { ok: true; value: ProductInput }
  | { ok: false; errors: string[] };

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function readProductForm(formData: FormData): ProductInput {
  const sortRaw = text(formData.get("sortOrder"));
  return {
    name: text(formData.get("name")),
    categoryId: text(formData.get("categoryId")),
    priceNote: text(formData.get("priceNote")),
    review: text(formData.get("review")),
    imageUrl: text(formData.get("imageUrl")),
    affiliateUrl: text(formData.get("affiliateUrl")),
    published: formData.get("published") === "on",
    isSample: formData.get("isSample") === "on",
    sortOrder: sortRaw === "" ? 0 : Number(sortRaw),
  };
}

export function validateProductInput(
  input: ProductInput,
  categoryIds: readonly string[],
): ValidationResult {
  const errors: string[] = [];
  const value: ProductInput = {
    name: input.name.trim(),
    categoryId: input.categoryId.trim(),
    priceNote: input.priceNote.trim(),
    review: input.review.trim(),
    imageUrl: input.imageUrl.trim(),
    affiliateUrl: input.affiliateUrl.trim(),
    published: input.published,
    isSample: input.isSample,
    sortOrder: input.sortOrder,
  };

  if (value.name.length < 1 || value.name.length > 120) {
    errors.push("ชื่อสินค้าต้องมี 1–120 ตัวอักษร");
  }

  if (!categoryIds.includes(value.categoryId)) {
    errors.push("เลือกหมวดสินค้าไม่ถูกต้อง");
  }

  if (value.priceNote.length > 80) {
    errors.push("ช่องราคาต้องไม่เกิน 80 ตัวอักษร");
  }

  if (value.review.length > 400) {
    errors.push("คำรีวิวต้องไม่เกิน 400 ตัวอักษร");
  }

  if (value.imageUrl.length > 500 || !isSafeImageUrl(value.imageUrl)) {
    errors.push("ลิงก์รูปต้องว่าง ขึ้นต้นด้วย / หรือเป็น https");
  }

  if (value.affiliateUrl.length > 2000 || !isSafeHttpsUrl(value.affiliateUrl)) {
    errors.push("ลิงก์ Shopee ต้องเป็น URL แบบ https");
  }

  if (!Number.isInteger(value.sortOrder) || value.sortOrder < 0 || value.sortOrder > 9999) {
    errors.push("ลำดับต้องเป็นจำนวนเต็ม 0–9999");
  }

  // สินค้าตัวอย่างห้ามมีราคาหรือรีวิวที่ดูเหมือนของจริง
  if (value.isSample) {
    if (value.priceNote !== "") {
      errors.push("สินค้าตัวอย่างต้องเว้นช่องราคาไว้");
    }
    if (value.review !== "" && value.review !== SAMPLE_NOTICE) {
      errors.push("สินค้าตัวอย่างใช้ได้เฉพาะข้อความว่ายังไม่มีข้อมูลจริง");
    }
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value };
}
