import { getPublicSupabaseEnv } from "@/lib/public-env";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// รีเฟรชโทเคนเฉพาะหน้าแอดมินและเส้นทางล็อกอิน
// หน้าหน้าร้านไม่ต้องแตะคุกกี้ เพื่อให้แคชได้
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const env = getPublicSupabaseEnv();
  if (!env) return supabaseResponse;

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([key, value]) => {
          supabaseResponse.headers.set(key, value);
        });
      },
    },
  });

  try {
    await supabase.auth.getClaims();
  } catch {
    // ถ้าเครือข่ายสะดุด ปล่อยให้หน้าแอดมินบอกสถานะล็อกอินเอง
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
