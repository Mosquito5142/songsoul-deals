import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv } from "@/lib/public-env";

// ไคลเอนต์ไม่ผูกคุกกี้ ใช้โหลดสินค้าที่เผยแพร่ในฐานะ anon
// เพื่อให้หน้าแรกยังทำแคชได้ และไม่เห็นสินค้าที่ถูกซ่อน
export function createPublicSupabase() {
  const env = getPublicSupabaseEnv();
  if (!env) return null;

  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
