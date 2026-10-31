import { SAMPLE_NOTICE } from "@/lib/site";
import type { Product } from "@/lib/types";

export function priceLabel(product: Pick<Product, "priceNote" | "isSample">): string {
  if (product.priceNote.trim()) return product.priceNote.trim();
  if (product.isSample) return SAMPLE_NOTICE;
  return "ยังไม่ระบุราคา";
}

export function reviewLabel(product: Pick<Product, "review" | "isSample">): string {
  if (product.review.trim()) return product.review.trim();
  if (product.isSample) return SAMPLE_NOTICE;
  return "ยังไม่มีคำแนะนำจากเรา";
}
