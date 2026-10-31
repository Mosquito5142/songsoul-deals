import { sampleProducts } from "@/lib/sample-data";
import { createPublicSupabase } from "@/lib/supabase/public";
import { createServiceSupabase } from "@/lib/supabase/service";
import type { PublishedAffiliate } from "@/lib/go-request";
import { getPublicSupabaseEnv } from "@/lib/public-env";
import { isSafeHttpsUrl } from "@/lib/urls";

export async function findPublishedProduct(id: string): Promise<PublishedAffiliate | null> {
  if (!getPublicSupabaseEnv()) {
    const sample = sampleProducts.find((product) => product.id === id && product.published);
    if (!sample || !isSafeHttpsUrl(sample.affiliateUrl)) return null;
    return { id: sample.id, affiliateUrl: sample.affiliateUrl };
  }

  const supabase = createPublicSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("id, affiliate_url, published")
    .eq("id", id)
    .maybeSingle();

  if (error || !data || data.published !== true) return null;
  if (typeof data.affiliate_url !== "string" || !isSafeHttpsUrl(data.affiliate_url)) return null;

  return { id: data.id, affiliateUrl: data.affiliate_url };
}

// ไม่เก็บไอพีหรือยูสเซอร์เอเจนต์ เก็บแค่รหัสสินค้าและเวลา
export async function recordClick(productId: string): Promise<void> {
  const service = createServiceSupabase();
  if (!service) return;

  const { error } = await service.from("clicks").insert({ product_id: productId });
  if (error) throw error;
}
