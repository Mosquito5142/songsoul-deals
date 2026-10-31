import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseEnv } from "@/lib/public-env";

export function createBrowserSupabase() {
  const env = getPublicSupabaseEnv();
  if (!env) {
    throw new Error("ยังไม่ได้ตั้งค่า Supabase");
  }

  return createBrowserClient(env.url, env.anonKey);
}
