import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv } from "@/lib/public-env";
import { getServiceRoleKey } from "@/lib/server-env";

// service role ข้าม RLS ได้ ใช้แค่บันทึกคลิกและเพิ่มอีเมลผู้ดูแล
export function createServiceSupabase() {
  const env = getPublicSupabaseEnv();
  const serviceRoleKey = getServiceRoleKey();
  if (!env || !serviceRoleKey) return null;

  return createClient(env.url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
