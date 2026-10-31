import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseEnv } from "@/lib/public-env";

// ไคลเอนต์ของเซสชันผู้ใช้ อ่านคุกกี้จากคำขอปัจจุบัน
// ใช้กับหน้าแอดมินเพื่อให้ RLS ทำงานตามผู้ที่ล็อกอิน
export async function createServerSupabase() {
  const env = getPublicSupabaseEnv();
  if (!env) return null;

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component เขียนคุกกี้ไม่ได้ proxy เป็นคนรีเฟรชเซสชัน
        }
      },
    },
  });
}
