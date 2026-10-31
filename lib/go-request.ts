import { isSafeHttpsUrl, isUuid } from "@/lib/urls";

export type PublishedAffiliate = {
  id: string;
  affiliateUrl: string;
};

export type GoDependencies = {
  findPublishedProduct: (id: string) => Promise<PublishedAffiliate | null>;
  recordClick: (productId: string) => Promise<void>;
};

export type GoResult = { status: 404 } | { status: 302; location: string };

// ตัดสินผลการเปิด /go/[id]
// คลิกที่บันทึกไม่สำเร็จไม่ควรขวางทางไปร้าน
export async function handleGo(id: string, deps: GoDependencies): Promise<GoResult> {
  if (!isUuid(id)) return { status: 404 };

  let product: PublishedAffiliate | null;
  try {
    product = await deps.findPublishedProduct(id);
  } catch {
    return { status: 404 };
  }

  if (!product || !isSafeHttpsUrl(product.affiliateUrl)) return { status: 404 };

  try {
    await deps.recordClick(product.id);
  } catch {
    // ตั้งใจเงียบ: ผู้ซื้อยังควรไปถึงหน้าร้านได้
  }

  return { status: 302, location: product.affiliateUrl };
}
